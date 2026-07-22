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

    # Additional CSV fields
    primary_key: Optional[str] = None
    reg_id: Optional[str] = None
    rent_category: Optional[str] = None
    rent_type: Optional[str] = None
    vpn_code: Optional[str] = None
    lessee_name: Optional[str] = None
    area_rai: Optional[float] = None
    area_ngan: Optional[float] = None
    area_wa: Optional[float] = None
    land_plan: Optional[str] = None
    building_details: Optional[str] = None
    build_year: Optional[int] = None
    on_street: Optional[str] = None
    street_type: Optional[str] = None
    street_width: Optional[float] = None
    street_access: Optional[float] = None
    land_width: Optional[float] = None
    land_ap: Optional[float] = None
    build_ap: Optional[float] = None

    class Config:
        from_attributes = True

class ValidateContractResponse(BaseModel):
    is_valid: bool
    message: str
    contract_data: Optional[ContractDataResponse] = None

class TreasuryParcelResponse(BaseModel):
    id: str
    parcel_number: str
    province: str
    district: str
    sub_district: str
    geometry_geojson: str
    centroid_lat: float
    centroid_lng: float
    land_area_sqw: float

    class Config:
        from_attributes = True

