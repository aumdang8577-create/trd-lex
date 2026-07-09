from fastapi import APIRouter
from app.core.database import db
from app.models.enums import ListingStatus
from app.schemas.dashboard import EconomicIndicatorsResponse

router = APIRouter(prefix="/dashboard", tags=["Economic Indicators Dashboard"])

@router.get("/economic-indicators", response_model=EconomicIndicatorsResponse)
async def get_economic_indicators():
    """
    ดึงข้อมูลวิเคราะห์ตัวชี้วัดทางเศรษฐกิจสะสมจากธุรกรรมการโอนสิทธิสัญญาราชพัสดุสำเร็จ (SOLD)
    """
    # ดึงข้อมูลประกาศที่มีสถานะ SOLD
    sold_listings = await db.listing.find_many(
        where={"status": ListingStatus.SOLD.value},
        include={"contract": True}
    )

    total_area_sqw = 0.0
    total_estimated_fee = 0.0
    total_circulation = 0.0

    for item in sold_listings:
        if item.contract:
            total_area_sqw += float(item.contract.land_area_sqw)
        total_estimated_fee += float(item.estimated_fee)
        total_circulation += float(item.asking_price)

    return EconomicIndicatorsResponse(
        revived_land_sqw=total_area_sqw,
        state_revenue_baht=total_estimated_fee,
        economic_circulation_baht=total_circulation
    )
