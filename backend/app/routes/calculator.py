from fastapi import APIRouter
from app.schemas.calculator import FeeCalculationRequest, FeeCalculationResponse, TransferType
from app.core.database import db
from app.core.calculations import (
    calculate_annual_rent as core_calculate_annual_rent,
    calculate_transfer_fee as core_calculate_transfer_fee,
    calculate_arrangement_fee as core_calculate_arrangement_fee,
    LeasePurpose,
    RegionType,
    LocationClass,
    TransferType as CoreTransferType
)

router = APIRouter(prefix="/calculator", tags=["Fee Calculator"])

@router.post("/transfer-fee", response_model=FeeCalculationResponse)
async def calculate_transfer_fee(request: FeeCalculationRequest):
    """
    คำนวณค่าธรรมเนียมการโอนสิทธิ์การเช่าและค่าเช่ารายปีที่ราชพัสดุตามระเบียบกรมธนารักษ์
    """
    # 1. เช็คว่าเป็นการคำนวณแบบละเอียดหรือแบบรวดเร็ว
    is_detailed = all([
        request.lease_purpose,
        request.region_type,
        request.location_class,
        request.land_area_sqw is not None,
        request.appraisal_land_sqw is not None
    ])

    if is_detailed:
        from fastapi import HTTPException
        try:
            lease_purpose = LeasePurpose(request.lease_purpose)
            region_type = RegionType(request.region_type)
            location_class = LocationClass(request.location_class)
        except ValueError as e:
            raise HTTPException(
                status_code=400,
                detail=f"ค่าข้อมูลในพารามิเตอร์วัตถุประสงค์การเช่า, ภูมิภาค หรือระดับทำเล ไม่ถูกต้องตามระเบียบ: {e}"
            )
        
        annual_rent, calc_details = core_calculate_annual_rent(
            purpose=lease_purpose,
            region=region_type,
            location_class=location_class,
            land_area_sqw=request.land_area_sqw,
            appraisal_land_sqw=request.appraisal_land_sqw,
            building_type=request.building_type,
            usable_area_sqm=request.usable_area_sqm,
            appraisal_bld_sqm=request.appraisal_bld_sqm,
            building_depreciation=request.building_depreciation
        )
        
        arrangement_fee = core_calculate_arrangement_fee(
            annual_rent=annual_rent,
            purpose=lease_purpose,
            total_asset_value=calc_details.get("total_asset_value", 0.0),
            lease_years=3
        )
    else:
        # Fallback to simple calculation if details are not provided
        annual_rent = request.annual_rent or 12000.0
        calc_details = {"method": "ประมาณการด่วน (ระบุตรง)"}
        arrangement_fee = annual_rent * 2.0  # ค่าธรรมเนียมจัดให้เช่า 2 เท่าของค่าเช่า 1 ปี

    # 2. คำนวณค่าธรรมเนียมโอนสิทธิ์ตามระเบียบ
    base_fee, final_fee, discount_desc = core_calculate_transfer_fee(
        annual_rent=annual_rent,
        transfer_type=CoreTransferType(request.transfer_type.value),
        transfer_share=request.transfer_share or 100.0
    )

    # 3. บันทึกประวัติลงฐานข้อมูล (FeeCalculationLog)
    await db.feecalculationlog.create(
        data={
            "contract_number": request.contract_number,
            "annual_rent": annual_rent,
            "transfer_type": request.transfer_type.value,
            "transfer_share": request.transfer_share,
            "calculated_fee": round(final_fee, 2),
        }
    )

    # 4. ส่งผลลัพธ์กลับ
    return FeeCalculationResponse(
        annual_rent=annual_rent,
        base_fee=round(base_fee, 2),
        discount_description=discount_desc,
        final_fee=round(final_fee, 2),
        calculated_arrangement_fee=round(arrangement_fee, 2),
        calculation_details=calc_details
    )

