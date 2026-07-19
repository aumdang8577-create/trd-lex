from typing import List
from fastapi import APIRouter, Depends, Query, HTTPException, status
from app.schemas.listing import (
    CreateListingRequest,
    UpdateListingRequest,
    UpdateListingStatusRequest,
    ListingListResponse,
    ListingResponse
)
from app.services.listing_service import ListingService
from app.core.security import get_current_user
from prisma.models import User

router = APIRouter(prefix="/listings", tags=["Marketplace Listings"])

@router.get("", response_model=ListingListResponse)
async def get_listings(
    province: str | None = Query(None, description="กรองตามจังหวัด"),
    min_price: float | None = Query(None, description="ราคาขั้นต่ำ"),
    max_price: float | None = Query(None, description="ราคาสูงสุด"),
    page: int = Query(1, ge=1, description="หน้าข้อมูล"),
    per_page: int = Query(10, ge=1, le=50, description="จำนวนประกาศต่อหน้า")
):
    """
    ค้นหาและแสดงรายการประกาศเสนอขายสิทธิ์ทั้งหมดที่มีสถานะ ACTIVE
    """
    return await ListingService.get_listings(
        province=province,
        min_price=min_price,
        max_price=max_price,
        page=page,
        per_page=per_page
    )

@router.get("/my", response_model=List[ListingResponse])
async def get_my_listings(
    current_user: User = Depends(get_current_user)
):
    """
    ดึงรายการประกาศของฉันทั้งหมด
    """
    return await ListingService.get_my_listings(current_user)

@router.get("/{id}", response_model=ListingResponse)
async def get_listing_by_id(id: str):
    """
    ดึงรายละเอียดอย่างเป็นทางการของประกาศรายหนึ่ง รวมถึงสัญญาและผู้เสนอขาย
    """
    return await ListingService.get_listing_by_id(id)

@router.post("", response_model=ListingResponse, status_code=201)
async def create_listing(
    request: CreateListingRequest,
    current_user: User = Depends(get_current_user)
):
    """
    สร้างประกาศเสนอขายสิทธิ์ใหม่ (ต้องยืนยันตัวตนและเป็นเจ้าของสัญญาที่ระบุ)
    """
    return await ListingService.create_listing(request, current_user)

@router.put("/{id}", response_model=ListingResponse)
async def update_listing(
    id: str,
    request: UpdateListingRequest,
    current_user: User = Depends(get_current_user)
):
    """
    แก้ไขข้อมูลราคารายละเอียดของประกาศ (ผู้ลงประกาศเดิมเท่านั้น)
    """
    return await ListingService.update_listing(id, request, current_user)

@router.patch("/{id}/status", response_model=ListingResponse)
async def update_listing_status(
    id: str,
    request: UpdateListingStatusRequest,
    current_user: User = Depends(get_current_user)
):
    """
    อัปเดตสถานะของประกาศ (เช่น เปลี่ยนเป็น SOLD หรือ HIDDEN)
    """
    return await ListingService.update_listing_status(id, request, current_user)

@router.delete("/{id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_listing(
    id: str,
    current_user: User = Depends(get_current_user)
):
    """
    ลบประกาศเสนอขายสิทธิ์ (ผู้ลงประกาศเดิมเท่านั้น)
    """
    await ListingService.delete_listing(id, current_user)
    return None
