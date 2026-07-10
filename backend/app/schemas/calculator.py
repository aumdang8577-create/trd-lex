from pydantic import BaseModel, Field, model_validator
from enum import Enum
from typing import Optional

# 1. กำหนดประเภทของผู้รับโอน (Enum)
class TransferType(str, Enum):
    GENERAL = "GENERAL"       # บุคคลทั่วไป
    FAMILY = "FAMILY"         # บุคคลในครอบครัว (พ่อแม่/ลูก/คู่สมรส)
    CO_LESSEE = "CO_LESSEE"   # ผู้เช่าร่วม

# 2. Schema สำหรับฝั่ง Request (ข้อมูลที่ส่งเข้ามาคำนวณ)
class FeeCalculationRequest(BaseModel):
    annual_rent: float = Field(..., gt=0, description="ค่าเช่ารายปี ณ ปัจจุบัน (บาท)")
    transfer_type: TransferType = Field(..., description="ประเภทผู้รับโอน")
    transfer_share: Optional[float] = Field(
        100.0, ge=1.0, le=100.0, 
        description="สัดส่วนที่โอน (ร้อยละ) - จำเป็นต้องส่งเมื่อโอนให้ผู้เช่าร่วม"
    )
    contract_number: Optional[str] = Field(None, description="เลขที่สัญญาเช่า (ถ้ามี)")

    # Validate เช็คว่าถ้าเป็นผู้เช่าร่วม ต้องระบุสัดส่วนเสมอ
    @model_validator(mode='after')
    def check_share_for_colessee(self) -> 'FeeCalculationRequest':
        if self.transfer_type == TransferType.CO_LESSEE and self.transfer_share is None:
            raise ValueError("ต้องระบุสัดส่วนการโอน (transfer_share) เมื่อโอนให้ผู้เช่าร่วม")
        return self

# 3. Schema สำหรับฝั่ง Response (ข้อมูลที่ส่งกลับไปให้ Frontend)
class FeeCalculationResponse(BaseModel):
    annual_rent: float
    base_fee: float
    discount_description: str
    final_fee: float
