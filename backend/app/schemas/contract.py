from pydantic import BaseModel
from typing import Optional

class ValidateContractRequest(BaseModel):
    contract_number: str

class ContractDataResponse(BaseModel):
    id: str
    contract_number: str
    parcel_number: str
    location_lat: float
    location_lng: float
    province: str
    district: str
    sub_district: str
    land_area_sqw: float
    is_active: bool
    building_type: Optional[str] = None
    usable_area_sqm: Optional[float] = None
    zoning: Optional[str] = None
    annual_rent: float

    class Config:
        from_attributes = True

class ValidateContractResponse(BaseModel):
    is_valid: bool
    message: str
    contract_data: Optional[ContractDataResponse] = None
