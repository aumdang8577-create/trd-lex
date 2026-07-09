from pydantic import BaseModel

class EconomicIndicatorsResponse(BaseModel):
    revived_land_sqw: float
    state_revenue_baht: float
    economic_circulation_baht: float
