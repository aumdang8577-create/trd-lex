from pydantic import BaseModel, Field
from datetime import datetime
from typing import Optional, List
from app.models.enums import ListingStatus

class ListingSellerResponse(BaseModel):
    id: str
    first_name: str
    last_name: str
    phone_number: Optional[str] = None

    class Config:
        from_attributes = True

class ListingContractResponse(BaseModel):
    id: str
    contract_number: str
    parcel_number: str
    location_lat: float
    location_lng: float
    province: str
    district: str
    sub_district: str
    land_area_sqw: float

    class Config:
        from_attributes = True

class ListingResponse(BaseModel):
    id: str
    sellerId: str
    seller: ListingSellerResponse
    contractId: str
    contract: ListingContractResponse
    asking_price: float
    estimated_fee: float
    description: Optional[str] = None
    image_urls: List[str] = []
    status: ListingStatus
    createdAt: datetime
    updatedAt: datetime

    class Config:
        from_attributes = True

class CreateListingRequest(BaseModel):
    contractId: str = Field(..., description="UUID ของสัญญาเช่าที่ผ่านการตรวจสอบสิทธิ์แล้ว")
    asking_price: float = Field(..., gt=0, description="ราคาเสนอขายสิทธิ์")
    description: Optional[str] = Field(None, description="รายละเอียดประกาศเพิ่มเติม")
    image_urls: List[str] = Field(default=[], description="URLs ของรูปภาพประกอบแปลงที่ดิน")

class UpdateListingRequest(BaseModel):
    asking_price: Optional[float] = Field(None, gt=0, description="ราคาเสนอขายสิทธิ์ใหม่")
    description: Optional[str] = Field(None, description="รายละเอียดประกาศใหม่")
    image_urls: Optional[List[str]] = Field(None, description="รายการรูปภาพประกอบใหม่")

class UpdateListingStatusRequest(BaseModel):
    status: ListingStatus = Field(..., description="สถานะใหม่ของประกาศ เช่น SOLD, HIDDEN, ACTIVE")

class ListingMeta(BaseModel):
    total_items: int
    page: int
    per_page: int

class ListingListResponse(BaseModel):
    data: List[ListingResponse]
    meta: ListingMeta
