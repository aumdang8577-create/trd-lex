from fastapi import APIRouter
from app.schemas.calculator import FeeCalculationRequest, FeeCalculationResponse, TransferType
from app.core.database import db

router = APIRouter(prefix="/calculator", tags=["Fee Calculator"])

@router.post("/transfer-fee", response_model=FeeCalculationResponse)
async def calculate_transfer_fee(request: FeeCalculationRequest):
    """
    คำนวณค่าธรรมเนียมการโอนสิทธิ์การเช่าที่ราชพัสดุตามระเบียบกรมธนารักษ์
    """
    # 1. คำนวณฐานค่าธรรมเนียมปกติ (6 เท่าของค่าเช่ารายปี)
    base_fee = request.annual_rent * 6.0
    
    # 2. เตรียมตัวแปรสำหรับค่าธรรมเนียมสุทธิและคำอธิบาย
    final_fee = base_fee
    discount_desc = "คิดอัตราปกติ (6 เท่าของค่าเช่ารายปี)"

    # 3. เข้าเงื่อนไขตามระเบียบ
    if request.transfer_type == TransferType.FAMILY:
        final_fee = base_fee * 0.25
        discount_desc = "ได้รับสิทธิลดหย่อนร้อยละ 75 (โอนให้ทายาท/คู่สมรส)"
    elif request.transfer_type == TransferType.CO_LESSEE:
        share_ratio = (request.transfer_share or 100.0) / 100.0
        final_fee = base_fee * share_ratio
        discount_desc = f"คิดตามสัดส่วนสิทธิที่โอน ({request.transfer_share}%) ระหว่างผู้เช่าร่วม"

    # 4. บันทึกประวัติลงฐานข้อมูล (FeeCalculationLog)
    await db.feecalculationlog.create(
        data={
            "contract_number": request.contract_number,
            "annual_rent": request.annual_rent,
            "transfer_type": request.transfer_type.value,
            "transfer_share": request.transfer_share,
            "calculated_fee": round(final_fee, 2),
        }
    )

    # 5. ส่งผลลัพธ์กลับ
    return FeeCalculationResponse(
        annual_rent=request.annual_rent,
        base_fee=round(base_fee, 2),
        discount_description=discount_desc,
        final_fee=round(final_fee, 2)
    )
