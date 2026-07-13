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
    annual_rent: Optional[float] = Field(None, description="ค่าเช่ารายปี ณ ปัจจุบัน (บาท) - ถ้าไม่มีจะใช้วิธีคำนวณจากรายละเอียดด้านล่าง")
    transfer_type: TransferType = Field(..., description="ประเภทผู้รับโอน")
    transfer_share: Optional[float] = Field(
        100.0, ge=1.0, le=100.0, 
        description="สัดส่วนที่โอน (ร้อยละ) - จำเป็นต้องส่งเมื่อโอนให้ผู้เช่าร่วม"
    )
    contract_number: Optional[str] = Field(None, description="เลขที่สัญญาเช่า (ถ้ามี)")

    # ฟิลด์สำหรับการประเมินค่าเช่าและธรรมเนียมแบบละเอียดตามระเบียบ
    lease_purpose: Optional[str] = Field(None, description="วัตถุประสงค์การเช่า: RESIDENTIAL, AGRICULTURE, COMMERCIAL")
    region_type: Optional[str] = Field(None, description="ภูมิภาค: BKK, PROVINCIAL")
    location_class: Optional[str] = Field(None, description="ระดับทำเล: CLASS_1, CLASS_2, CLASS_3")
    land_area_sqw: Optional[float] = Field(None, description="เนื้อที่ดิน (ตารางวา)")
    appraisal_land_sqw: Optional[float] = Field(None, description="ราคาประเมินที่ดิน (บาทต่อตารางวา)")
    building_type: Optional[str] = Field(None, description="ประเภทอาคาร")
    usable_area_sqm: Optional[float] = Field(None, description="เนื้อที่ใช้สอย (ตารางเมตร)")
    appraisal_bld_sqm: Optional[float] = Field(None, description="ราคาประเมินอาคาร (บาทต่อตารางเมตร)")
    building_depreciation: Optional[float] = Field(None, description="ค่าเสื่อมอาคาร (%)")

    @model_validator(mode='after')
    def validate_request(self) -> 'FeeCalculationRequest':
        if self.transfer_type == TransferType.CO_LESSEE and self.transfer_share is None:
            raise ValueError("ต้องระบุสัดส่วนการโอน (transfer_share) เมื่อโอนให้ผู้เช่าร่วม")
        
        # ตรวจสอบการส่งข้อมูลแบบละเอียด
        if self.annual_rent is None:
            if not all([self.lease_purpose, self.region_type, self.location_class, self.land_area_sqw is not None, self.appraisal_land_sqw is not None]):
                raise ValueError("ต้องระบุค่าเช่ารายปี (annual_rent) หรือส่งรายละเอียดข้อมูลแปลงที่ดินให้ครบเพื่อประเมินค่าเช่า")
        return self


# 3. Schema สำหรับฝั่ง Response (ข้อมูลที่ส่งกลับไปให้ Frontend)
class FeeCalculationResponse(BaseModel):
    annual_rent: float
    base_fee: float
    discount_description: str
    final_fee: float
    calculated_arrangement_fee: Optional[float] = None
    calculation_details: Optional[dict] = None

