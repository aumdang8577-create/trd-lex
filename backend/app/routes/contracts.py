from fastapi import APIRouter, Depends, Query, HTTPException, status
from app.schemas.contract import ValidateContractRequest, ValidateContractResponse, TreasuryParcelResponse
from app.services.contract_service import ContractService
from app.core.security import get_current_user
from prisma.models import User
from typing import List, Optional

router = APIRouter(prefix="/contracts", tags=["Lease Contracts"])

@router.post("/validate", response_model=ValidateContractResponse)
async def validate_contract(
    request: ValidateContractRequest,
    current_user: User = Depends(get_current_user)
):
    """
    ตรวจสอบความถูกต้องของสัญญาเช่าที่ราชพัสดุและกรรมสิทธิ์สำหรับผู้ใช้ปัจจุบัน
    """
    return await ContractService.validate_contract(request.contract_number, current_user)

@router.get("/parcels", response_model=List[TreasuryParcelResponse])
async def get_parcels(
    province: Optional[str] = Query(None, description="กรองตามจังหวัด"),
    current_user: User = Depends(get_current_user)
):
    """
    ดึงข้อมูลแปลงที่ดินราชพัสดุทั้งหมดในระบบ
    """
    return await ContractService.get_parcels(province)

@router.get("/parcels/search", response_model=TreasuryParcelResponse)
async def search_parcel(
    parcel_number: str = Query(..., description="หมายเลขทะเบียนที่ราชพัสดุ เช่น นค.1001"),
    current_user: User = Depends(get_current_user)
):
    """
    ค้นหาแปลงที่ดินราชพัสดุจากเลขทะเบียน
    """
    parcel = await ContractService.search_parcel(parcel_number)
    if not parcel:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="ไม่พบข้อมูลแปลงที่ราชพัสดุระบุ"
        )
    return parcel

@router.get("/parcels/by-location", response_model=TreasuryParcelResponse)
async def get_parcel_by_location(
    lat: float = Query(..., description="ละติจูด"),
    lng: float = Query(..., description="ลองจิจูด"),
    current_user: User = Depends(get_current_user)
):
    """
    ค้นหาแปลงที่ราชพัสดุจากพิกัด (ละติจูด, ลองจิจูด) ด้วยระบบ GIS reverse-geocoding
    """
    parcel = await ContractService.find_parcel_by_location(lat, lng)
    if not parcel:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="พิกัดนี้ไม่ได้อยู่บนพื้นที่ของแปลงที่ราชพัสดุใดๆ"
        )
    return parcel

