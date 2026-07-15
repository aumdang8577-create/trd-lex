from fastapi import HTTPException, status
from app.core.database import db
from app.schemas.contract import ValidateContractResponse, ContractDataResponse
from prisma.models import User

class ContractService:
    @staticmethod
    async def validate_contract(contract_number: str, current_user: User) -> ValidateContractResponse:
        # Search for contract in DB
        contract = await db.leasecontract.find_unique(
            where={"contract_number": contract_number}
        )
        
        if not contract:
            return ValidateContractResponse(
                is_valid=False,
                message="ไม่พบข้อมูลสัญญาเช่าที่ระบุในระบบของกรมธนารักษ์"
            )
            
        if not contract.is_active:
            return ValidateContractResponse(
                is_valid=False,
                message="สัญญาเช่าถูกระงับการใช้งาน หรือสิ้นสุดอายุสัญญาแล้ว"
            )
            
        if contract.lessee_thaid_id != current_user.thaid_id:
            return ValidateContractResponse(
                is_valid=False,
                message="สัญญานี้ไม่ได้ลงทะเบียนภายใต้เลขบัตรประชาชนของคุณ"
            )
            
        # ซิงค์พิกัดแผนที่และขนาดพื้นที่ให้ตรงกับแปลงที่ดินราชพัสดุ (Shapefile) ในฐานข้อมูลโดยอัตโนมัติ
        try:
            parcel = await db.treasuryparcel.find_unique(
                where={"parcel_number": contract.parcel_number}
            )
            if parcel:
                contract = await db.leasecontract.update(
                    where={"id": contract.id},
                    data={
                        "location_lat": parcel.centroid_lat,
                        "location_lng": parcel.centroid_lng,
                        "land_area_sqw": parcel.land_area_sqw
                    }
                )
        except Exception as es:
            print(f"Error syncing contract coordinates with parcel: {es}")
            
        # คำนวณค่าเช่ารายปีและค่าจัดให้เช่าตามระเบียบหลวงแบบไดนามิก และอัปเดตลงฐานข้อมูลผ่าน Prisma ORM
        from app.core.calculations import (
            calculate_annual_rent,
            calculate_arrangement_fee,
            LeasePurpose,
            RegionType,
            LocationClass
        )
        
        try:
            annual_rent, calc_details = calculate_annual_rent(
                purpose=LeasePurpose(str(contract.purpose)),
                region=RegionType(str(contract.region_type)),
                location_class=LocationClass(str(contract.location_class)),
                land_area_sqw=contract.land_area_sqw,
                appraisal_land_sqw=contract.appraisal_land_sqw,
                building_type=contract.building_type,
                usable_area_sqm=contract.usable_area_sqm,
                appraisal_bld_sqm=contract.appraisal_bld_sqm,
                building_depreciation=contract.building_depreciation
            )
            
            arrangement_fee = calculate_arrangement_fee(
                annual_rent=annual_rent,
                purpose=LeasePurpose(contract.purpose),
                total_asset_value=calc_details.get("total_asset_value", 0.0),
                lease_years=contract.lease_years or 3
            )
            
            # อัปเดตข้อมูลผลลัพธ์การคำนวณผ่าน Prisma ORM
            contract = await db.leasecontract.update(
                where={"id": contract.id},
                data={
                    "calculated_annual_rent": annual_rent,
                    "calculated_arrange_fee": arrangement_fee,
                    "annual_rent": annual_rent  # อัปเดตค่าเช่าหลักเพื่อให้สัมพันธ์กับส่วนอื่น
                }
            )
        except Exception as e:
            # Fallback หากเกิดข้อผิดพลาดด้านความเข้ากันได้
            print(f"Error auto-calculating contract rent: {e}")
            
        # Map to response schema
        contract_data = ContractDataResponse.model_validate(contract)
        
        return ValidateContractResponse(
            is_valid=True,
            message="พบข้อมูลสัญญาเช่าและคุณเป็นเจ้าของสิทธิ์ สามารถลงประกาศได้",
            contract_data=contract_data
        )

    @staticmethod
    async def get_parcels(province: str = None):
        if province:
            return await db.treasuryparcel.find_many(where={"province": province})
        return await db.treasuryparcel.find_many()

    @staticmethod
    async def search_parcel(parcel_number: str):
        return await db.treasuryparcel.find_unique(where={"parcel_number": parcel_number})

    @staticmethod
    async def find_parcel_by_location(lat: float, lng: float):
        import json
        parcels = await db.treasuryparcel.find_many()
        
        for p in parcels:
            # Quick bounding box check
            if abs(p.centroid_lat - lat) > 0.02 or abs(p.centroid_lng - lng) > 0.02:
                continue
                
            try:
                geom = json.loads(p.geometry_geojson)
                if geom.get("type") == "Polygon" and geom.get("coordinates"):
                    poly = geom["coordinates"][0] # Outer boundary ring (coords are [lng, lat])
                    
                    # Ray casting algorithm
                    inside = False
                    n = len(poly)
                    p1x, p1y = poly[0]
                    for i in range(n + 1):
                        p2x, p2y = poly[i % n]
                        if lat > min(p1y, p2y):
                            if lat <= max(p1y, p2y):
                                if lng <= max(p1x, p2x):
                                    if p1y != p2y:
                                        xints = (lat - p1y) * (p2x - p1x) / (p2y - p1y) + p1x
                                    if p1x == p2x or lng <= xints:
                                        inside = not inside
                        p1x, p1y = p2x, p2y
                    
                    if inside:
                        return p
            except Exception as e:
                print(f"Error checking polygon boundary: {e}")
                continue
        return None

