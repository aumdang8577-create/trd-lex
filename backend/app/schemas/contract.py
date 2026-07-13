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

    # New Treasury properties
    region_type: Optional[str] = None
    location_class: Optional[str] = None
    purpose: Optional[str] = None
    tenant_category: Optional[str] = None
    appraisal_land_sqw: Optional[float] = None
    appraisal_bld_sqm: Optional[float] = None
    building_depreciation: Optional[float] = None
    calculated_annual_rent: Optional[float] = None
    calculated_arrange_fee: Optional[float] = None

    class Config:
        from_attributes = True

class ValidateContractResponse(BaseModel):
    is_valid: bool
    message: str
    contract_data: Optional[ContractDataResponse] = None
