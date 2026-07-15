// ==========================================
// 1. ENUMS (ตัวแปรควบคุมประเภทต่างๆ ตามระเบียบ)
// ==========================================

enum RegionType {
  BKK           // กรุงเทพมหานคร (บัญชี ก)
  PROVINCIAL    // จังหวัดอื่น (บัญชี ข)
}

enum LocationClass {
  CLASS_1       // ทำเลชั้น 1 (ติดถนน > 6ม. หรือแหล่งเศรษฐกิจ)
  CLASS_2       // ทำเลชั้น 2 (ติดถนน 4-6ม. หรือแม่น้ำ/คลอง)
  CLASS_3       // ทำเลชั้น 3 (อื่นๆ หรือรถเข้าไม่ถึง)
}

enum TenantCategory {
  NEW_TENANT    // ผู้เช่ารายใหม่ (หลัง 1 ม.ค. 2560)
  OLD_TENANT    // ผู้เช่ารายเดิม (ก่อน 1 ม.ค. 2560)
}

enum LeasePurpose {
  RESIDENTIAL        // เพื่ออยู่อาศัย (เอกสาร 1)
  AGRICULTURE        // เพื่อประกอบเกษตรกรรม (เอกสาร 2)
  COMMERCIAL         // เพื่อการพาณิชยกรรมและอุตสาหกรรม (เอกสาร 3)
  LUMP_SUM           // แบบเหมาจ่าย/ชั่วคราว เช่น ป้ายโฆษณา, ตู้ ATM (เอกสาร 4)
  WELFARE_BUSINESS   // สวัสดิการในเชิงธุรกิจ (เอกสาร 5)
  STATE_ENTERPRISE   // หน่วยงาน/รัฐวิสาหกิจ (เอกสาร 6)
  NON_PROFIT         // สาธารณกุศล/นโยบายรัฐ (เอกสาร 7)
}

enum AssetType {
  LAND               // เช่าที่ดินเปล่า
  BUILDING           // เช่าอาคาร/สิ่งปลูกสร้าง
  LAND_AND_BUILDING  // เช่าที่ดินพร้อมอาคาร
  BOT                // ปลูกสร้างอาคารยกกรรมสิทธิ์ให้กระทรวงการคลัง (B.O.T)
}

// ==========================================
// 2. MODELS: ข้อมูลทรัพย์สินและสัญญา (Core Data)
// ==========================================

model PropertyAsset {
  id                  String    @id @default(uuid())
  parcel_number       String    @unique
  region_type         RegionType
  location_class      LocationClass
  
  // ข้อมูลพื้นที่สำหรับการคำนวณ (ข้อ 22)
  land_area_sqw       Float     // เนื้อที่เช่าที่ดิน (ตารางวา) ใช้คำนวณค่าเช่าที่ดินและค่าธรรมเนียม
  usable_area_sqm     Float?    // เนื้อที่ใช้สอยของอาคาร (ตารางเมตร) ใช้คำนวณค่าเช่าอาคาร
  
  // ราคาประเมินเพื่อเป็นฐานคำนวณ
  appraisal_land_sqw  Float     // ราคาประเมินที่ดิน (บาท/ตร.ว.) 
  appraisal_bld_sqm   Float?    // ราคาประเมินอาคาร (บาท/ตร.ม.)
  building_depreciation Float?  // ค่าเสื่อมราคาอาคารสะสม (%) นำไปหักลบเพื่อหามูลค่าอาคาร
  
  contracts           LeaseContract[]
}

model LeaseContract {
  id                  String    @id @default(uuid())
  contract_number     String    @unique
  asset_id            String
  asset               PropertyAsset @relation(fields: [asset_id], references: [id])
  
  tenant_name         String
  tenant_category     TenantCategory
  purpose             LeasePurpose
  asset_type          AssetType
  
  start_date          DateTime
  end_date            DateTime
  lease_years         Int       // จำนวนปีที่จัดให้เช่า
  
  // สรุปยอดผลการคำนวณ
  calculated_annual_rent Float  // ค่าเช่ารายปี
  calculated_arrange_fee Float  // ค่าธรรมเนียมการจัดให้เช่า
  
  // ระบบติดตามการปรับปรุงอัตราค่าเช่า (ข้อ 21)
  next_rent_review_date DateTime? // กำหนดการปรับปรุงค่าเช่าเพิ่มขึ้นร้อยละ 9 ทุก 3 ปี
  
  calculations        FeeCalculationLog[]
}

// ==========================================
// 3. MODELS: การคำนวณและประวัติ (Calculation Logs)
// ==========================================

model FeeCalculationLog {
  id                  String    @id @default(uuid())
  contract_id         String
  contract            LeaseContract @relation(fields: [contract_id], references: [id])
  
  // ฐานมูลค่าทรัพย์สินที่ใช้คำนวณ ณ วันนั้น (เอกสาร 3 ข้อ 1)
  base_land_value     Float     // มูลค่าที่ดิน (ราคาประเมิน x เนื้อที่)
  base_building_value Float?    // มูลค่าอาคาร (ราคาก่อสร้างหักค่าเสื่อม)
  total_asset_value   Float     // มูลค่าทรัพย์สินรวม (นำไปคิดร้อยละสำหรับพาณิชยกรรม)
  
  // ผลลัพธ์
  rent_amount_per_year Float    // ปัดเศษเป็นหนึ่งบาท (ข้อ 23.1)
  arrangement_fee      Float?   // ค่าธรรมเนียมจัดให้เช่า ปัดเศษเป็นสิบบาท (ข้อ 23.2)
  renewal_fee          Float?   // ค่าธรรมเนียมต่ออายุ
  transfer_fee         Float?   // ค่าธรรมเนียมโอนสิทธิ (เช่น 6 เท่าของค่าเช่า 1 ปี)
  
  // รายการลดหย่อน / ข้อยกเว้น
  discount_rate        Float?   // เช่น ลด 50% สำหรับสาธารณกุศล หรือองค์กรท้องถิ่น
  is_fee_exempted      Boolean  @default(false) // ยกเว้นค่าธรรมเนียม (เช่น การเกษตร/อยู่อาศัย ยกเว้นค่าต่ออายุ)
  
  createdAt            DateTime @default(now())
}

// ==========================================
// 4. CONFIG MODELS: ตารางบัญชีอัตราค่าเช่า (Master Data)
// ==========================================

model RentRateConfig {
  id                  Int       @id @default(autoincrement())
  table_name          String    // อ้างอิงชื่อบัญชี เช่น "บัญชี ก", "บัญชี ข", "บัญชี 1-18"
  purpose             LeasePurpose
  region_type         RegionType
  location_class      LocationClass
  
  // ช่วงราคาประเมินที่ดิน (บาท/ตารางวา)
  min_appraisal_val   Float     
  max_appraisal_val   Float     
  
  // อัตราการจัดเก็บ
  rate_per_sqw_month  Float?    // อัตราค่าเช่าที่ดิน (บาท/ตร.ว./เดือน)
  rate_per_sqm_month  Float?    // อัตราค่าเช่าอาคาร (บาท/ตร.ม./เดือน)
  
  // เงื่อนไขขั้นต่ำและสูงสุด
  min_rent_per_month  Float?    // เช่น ไม่ต่ำกว่า 0.50 บาท/เดือน
  percentage_rate     Float?    // กรณีเกินเพดาน ให้คิดเป็นร้อยละ (เช่น 1% หรือ 3% ของมูลค่าทรัพย์สิน)
}

// ตารางค่าธรรมเนียมจิปาถะ (เอกสาร 8)
model MiscellaneousFeeConfig {
  id                  Int       @id @default(autoincrement())
  fee_type            String    // เช่น "SURVEY_FEE", "DESIGN_FEE", "INSPECTION_FEE"
  condition_min_value Float     // เช่น เนื้อที่ไม่เกิน 1 ไร่
  condition_max_value Float     // เช่น เนื้อที่ไม่เกิน 5 ไร่
  fee_amount          Float     // อัตราเรียกเก็บ (เช่น 200 บาท, 400 บาท)
  max_cap_amount      Float?    // เพดานการเก็บสูงสุด (เช่น เก็บไม่เกินแปลงละ 2,000 บาท)
}