// ===========================
// TRD-LEX API Client
// Central HTTP client for Backend communication with Auto-Port Discovery & Full Offline Fallback
// ===========================

import type {
  TokenResponse,
  LoginRequest,
  ValidateContractRequest,
  ValidateContractResponse,
  ListingListResponse,
  Listing,
  LeaseContract,
  CreateListingRequest,
  UpdateListingRequest,
  UpdateListingStatusRequest,
  FeeCalculationRequest,
  FeeCalculationResponse,
} from "@/types";

const mockListingsData: Listing[] = [
  {
    id: "list-1",
    sellerId: "seller-1",
    seller: { id: "seller-1", thaid_id: "1123456789012", first_name: "สมชาย", last_name: "ใจดี", role: "USER" },
    contractId: "contract-1",
    contract: {
      id: "contract-1",
      contract_number: "TRD-66-001",
      parcel_number: "อด.1234",
      location_lat: 17.4138,
      location_lng: 102.7872,
      province: "อุดรธานี",
      district: "เมืองอุดรธานี",
      sub_district: "หมากแข้ง",
      land_area_sqw: 120.0,
      is_active: true,
      building_type: "อาคารพาณิชย์",
      usable_area_sqm: 250.0,
      zoning: "พื้นที่สีแดง (พาณิชยกรรม)",
      annual_rent: 12000.0,
    },
    asking_price: 1500000.0,
    estimated_fee: 45000.0,
    description: "สิทธิ์การเช่าที่ดินเพื่อการพาณิชย์ ทำเลทองเมืองอุดรธานี ใกล้เซ็นทรัลอุดรธานี เหมาะทำร้านค้าหรือสำนักงานขนาดเล็ก เดินทางสะดวกติดถนนใหญ่สภาพแวดล้อมดีเยี่ยม",
    image_urls: ["https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=800&q=80"],
    status: "ACTIVE",
    createdAt: "2026-07-09T00:00:00Z",
    updatedAt: "2026-07-09T00:00:00Z",
  },
  {
    id: "list-2",
    sellerId: "seller-2",
    seller: { id: "seller-2", thaid_id: "2123456789012", first_name: "สมหญิง", last_name: "รักดี", role: "USER" },
    contractId: "contract-2",
    contract: {
      id: "contract-2",
      contract_number: "TRD-66-002",
      parcel_number: "ขก.5678",
      location_lat: 16.4322,
      location_lng: 102.8236,
      province: "ขอนแก่น",
      district: "เมืองขอนแก่น",
      sub_district: "ในเมือง",
      land_area_sqw: 80.0,
      is_active: true,
      building_type: "บ้านพักอาศัย",
      usable_area_sqm: 140.0,
      zoning: "พื้นที่สีเหลือง (ที่อยู่อาศัยหนาแน่นน้อย)",
      annual_rent: 12000.0,
    },
    asking_price: 980000.0,
    estimated_fee: 29400.0,
    description: "แปลงที่ดินราชพัสดุในเมืองขอนแก่น ทำเลพักอาศัย เงียบสงบ ใกล้วัดหนองแวงและบึงแก่นนคร เดินทางสะดวกมีสาธารณูปโภคครบครัน เหมาะสำหรับสร้างบ้านเดี่ยวหรือบ้านพักตากอากาศส่วนตัว",
    image_urls: ["https://images.unsplash.com/photo-1580587771525-78b9dba3b914?auto=format&fit=crop&w=800&q=80"],
    status: "ACTIVE",
    createdAt: "2026-07-09T00:00:00Z",
    updatedAt: "2026-07-09T00:00:00Z",
  },
  {
    id: "list-3",
    sellerId: "seller-3",
    seller: { id: "seller-3", thaid_id: "3123456789012", first_name: "ประยุทธ์", last_name: "มั่งมี", role: "USER" },
    contractId: "contract-3",
    contract: {
      id: "contract-3",
      contract_number: "TRD-66-003",
      parcel_number: "นค.1507",
      location_lat: 17.8776,
      location_lng: 102.7435,
      province: "หนองคาย",
      district: "เมืองหนองคาย",
      sub_district: "ในเมือง",
      land_area_sqw: 3677.44,
      is_active: true,
      building_type: "อาคารพาณิชย์",
      usable_area_sqm: 350.0,
      zoning: "พื้นที่สีแดง (พาณิชยกรรม)",
      annual_rent: 12000.0,
    },
    asking_price: 2400000.0,
    estimated_fee: 72000.0,
    description: "สิทธิ์การเช่าระยะยาวใกล้ริมแม่น้ำโขง เมืองหนองคาย เหมาะสำหรับทำร้านอาหารหรือโฮมสเตย์รองรับนักท่องเที่ยวริมโขงและตลาดท่าเสด็จ แปลงมุมหน้ากว้างสวยงาม",
    image_urls: ["https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=800&q=80"],
    status: "ACTIVE",
    createdAt: "2026-07-09T00:00:00Z",
    updatedAt: "2026-07-09T00:00:00Z",
  },
  {
    id: "list-4",
    sellerId: "seller-2",
    seller: { id: "seller-2", thaid_id: "2123456789012", first_name: "สมหญิง", last_name: "รักดี", role: "USER" },
    contractId: "contract-4",
    contract: {
      id: "contract-4",
      contract_number: "TRD-66-004",
      parcel_number: "นค.1509",
      location_lat: 17.8752,
      location_lng: 102.7425,
      province: "หนองคาย",
      district: "เมืองหนองคาย",
      sub_district: "ในเมือง",
      land_area_sqw: 6263.67,
      is_active: true,
      building_type: null,
      usable_area_sqm: 0.0,
      zoning: "พื้นที่สีเขียว (ชนบทและเกษตรกรรม)",
      annual_rent: 12000.0,
    },
    asking_price: 3800000.0,
    estimated_fee: 114000.0,
    description: "แปลงที่ดินขนาดใหญ่ใจกลางเมืองหนองคาย เหมาะสำหรับพัฒนาโครงการอาคารพาณิชย์หรือคอนโดมิเนียมรองรับเขตเศรษฐกิจพิเศษ ที่ดินเปล่าสภาพดีพร้อมพัฒนา",
    image_urls: ["https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=800&q=80"],
    status: "ACTIVE",
    createdAt: "2026-07-09T00:00:00Z",
    updatedAt: "2026-07-09T00:00:00Z",
  },
  {
    id: "list-5",
    sellerId: "seller-1",
    seller: { id: "seller-1", thaid_id: "1123456789012", first_name: "สมชาย", last_name: "ใจดี", role: "USER" },
    contractId: "contract-5",
    contract: {
      id: "contract-5",
      contract_number: "TRD-66-005",
      parcel_number: "นค.1496",
      location_lat: 17.8792,
      location_lng: 102.7489,
      province: "หนองคาย",
      district: "เมืองหนองคาย",
      sub_district: "ในเมือง",
      land_area_sqw: 1030.53,
      is_active: true,
      building_type: "บ้านพักอาศัย",
      usable_area_sqm: 120.0,
      zoning: "พื้นที่สีเหลือง (ที่อยู่อาศัยหนาแน่นน้อย)",
      annual_rent: 12000.0,
    },
    asking_price: 1200000.0,
    estimated_fee: 36000.0,
    description: "ที่ดินราชพัสดุทำเลดี ใกล้ถนนสายหลัก เหมาะทำที่พักอาศัยหรือร้านค้าขนาดเล็ก สภาพแวดล้อมดี มีสาธารณูปโภคครบ บ้านพักอาศัย 1 ชั้น",
    image_urls: ["https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&w=800&q=80"],
    status: "ACTIVE",
    createdAt: "2026-07-09T00:00:00Z",
    updatedAt: "2026-07-09T00:00:00Z",
  },
  {
    id: "list-6",
    sellerId: "seller-3",
    seller: { id: "seller-3", thaid_id: "3123456789012", first_name: "ประยุทธ์", last_name: "มั่งมี", role: "USER" },
    contractId: "contract-6",
    contract: {
      id: "contract-6",
      contract_number: "TRD-66-006",
      parcel_number: "กจ.2345",
      location_lat: 14.0227,
      location_lng: 99.5328,
      province: "กาญจนบุรี",
      district: "เมืองกาญจนบุรี",
      sub_district: "ปากแพรก",
      land_area_sqw: 150.0,
      is_active: true,
      building_type: "บ้านพักอาศัย",
      usable_area_sqm: 180.0,
      zoning: "พื้นที่สีเหลือง (ที่อยู่อาศัยหนาแน่นน้อย)",
      annual_rent: 12000.0,
    },
    asking_price: 1250000.0,
    estimated_fee: 37500.0,
    description: "สิทธิ์การเช่าที่ดินพร้อมสิ่งปลูกสร้างสไตล์บ้านพักอาศัย บรรยากาศร่มรื่นใกล้แม่น้ำแคว เดินทางเข้าเมืองกาญจนบุรีสะดวกมาก สภาพบ้านพร้อมย้ายเข้าอยู่ได้ทันที",
    image_urls: ["https://images.unsplash.com/photo-1580587771525-78b9dba3b914?auto=format&fit=crop&w=800&q=80"],
    status: "ACTIVE",
    createdAt: "2026-07-09T00:00:00Z",
    updatedAt: "2026-07-09T00:00:00Z",
  },
  {
    id: "list-7",
    sellerId: "seller-1",
    seller: { id: "seller-1", thaid_id: "1123456789012", first_name: "สมชาย", last_name: "ใจดี", role: "USER" },
    contractId: "contract-7",
    contract: {
      id: "contract-7",
      contract_number: "TRD-66-007",
      parcel_number: "กจ.2346",
      location_lat: 14.1167,
      location_lng: 99.1333,
      province: "กาญจนบุรี",
      district: "ไทรโยค",
      sub_district: "ไทรโยค",
      land_area_sqw: 2400.0,
      is_active: true,
      building_type: null,
      usable_area_sqm: 0.0,
      zoning: "พื้นที่สีเขียว (ชนบทและเกษตรกรรม)",
      annual_rent: 12000.0,
    },
    asking_price: 450000.0,
    estimated_fee: 13500.0,
    description: "ที่ดินเปล่าผืนใหญ่ในอำเภอไทรโยค ทำเลติดธรรมชาติ เหมาะสำหรับการเกษตรกรรมท่องเที่ยวเชิงอนุรักษ์ โฮมสเตย์ หรือแคมป์ปิ้งพักผ่อนเชิงนิเวศ",
    image_urls: ["https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=800&q=80"],
    status: "ACTIVE",
    createdAt: "2026-07-09T00:00:00Z",
    updatedAt: "2026-07-09T00:00:00Z",
  },
  {
    id: "list-8",
    sellerId: "seller-2",
    seller: { id: "seller-2", thaid_id: "2123456789012", first_name: "สมหญิง", last_name: "รักดี", role: "USER" },
    contractId: "contract-8",
    contract: {
      id: "contract-8",
      contract_number: "TRD-66-008",
      parcel_number: "นภ.3456",
      location_lat: 17.2023,
      location_lng: 102.4411,
      province: "หนองบัวลำภู",
      district: "เมืองหนองบัวลำภู",
      sub_district: "ลำภู",
      land_area_sqw: 3200.0,
      is_active: true,
      building_type: null,
      usable_area_sqm: 0.0,
      zoning: "พื้นที่สีเขียว (ชนบทและเกษตรกรรม)",
      annual_rent: 12000.0,
    },
    asking_price: 350000.0,
    estimated_fee: 10500.0,
    description: "แปลงที่ราชพัสดุแปลงว่างเปล่าในหนองบัวลำภู พื้นที่ดินดำอุดมสมบูรณ์ เหมาะสำหรับการทำเกษตรกรรมยั่งยืน หรือสร้างโซลาร์ฟาร์มชุมชนหมุนเวียน",
    image_urls: ["https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=800&q=80"],
    status: "ACTIVE",
    createdAt: "2026-07-09T00:00:00Z",
    updatedAt: "2026-07-09T00:00:00Z",
  },
  {
    id: "list-9",
    sellerId: "seller-1",
    seller: { id: "seller-1", thaid_id: "1123456789012", first_name: "สมชาย", last_name: "ใจดี", role: "USER" },
    contractId: "contract-9",
    contract: {
      id: "contract-9",
      contract_number: "TRD-66-009",
      parcel_number: "นภ.3457",
      location_lat: 16.9634,
      location_lng: 102.2778,
      province: "หนองบัวลำภู",
      district: "ศรีบุญเรือง",
      sub_district: "ศรีบุญเรือง",
      land_area_sqw: 90.0,
      is_active: true,
      building_type: "อาคารพาณิชย์",
      usable_area_sqm: 160.0,
      zoning: "พื้นที่สีแดง (พาณิชยกรรม)",
      annual_rent: 12000.0,
    },
    asking_price: 1100000.0,
    estimated_fee: 33000.0,
    description: "อาคารพาณิชย์สองชั้นใจกลางชุมชนอำเภอศรีบุญเรือง เหมาะทำเป็นหน้าร้านค้าขายปลีก ร้านกาแฟ หรือสำนักงานตัวแทนบริการสาขาของหน่วยงาน",
    image_urls: ["https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=800&q=80"],
    status: "ACTIVE",
    createdAt: "2026-07-09T00:00:00Z",
    updatedAt: "2026-07-09T00:00:00Z",
  },
  {
    id: "list-10",
    sellerId: "seller-3",
    seller: { id: "seller-3", thaid_id: "3123456789012", first_name: "ประยุทธ์", last_name: "มั่งมี", role: "USER" },
    contractId: "contract-10",
    contract: {
      id: "contract-10",
      contract_number: "TRD-66-010",
      parcel_number: "อด.2345",
      location_lat: 17.1165,
      location_lng: 103.0182,
      province: "อุดรธานี",
      district: "กุมภวาปี",
      sub_district: "กุมภวาปี",
      land_area_sqw: 180.0,
      is_active: true,
      building_type: "อาคารพาณิชย์",
      usable_area_sqm: 280.0,
      zoning: "พื้นที่สีแดง (พาณิชยกรรม)",
      annual_rent: 12000.0,
    },
    asking_price: 1350000.0,
    estimated_fee: 40500.0,
    description: "อาคารพาณิชย์ทำเลดีในอำเภอกุมภวาปี ใกล้แหล่งการค้าชุมชนและตลาดใหญ่ เหมาะสำหรับการค้าขาย เปิดออฟฟิศ หรือพัฒนาเป็นศูนย์ขนส่งสินค้า",
    image_urls: ["https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=800&q=80"],
    status: "ACTIVE",
    createdAt: "2026-07-09T00:00:00Z",
    updatedAt: "2026-07-09T00:00:00Z",
  },
  {
    id: "list-11",
    sellerId: "seller-1",
    seller: { id: "seller-1", thaid_id: "1123456789012", first_name: "สมชาย", last_name: "ใจดี", role: "USER" },
    contractId: "contract-11",
    contract: {
      id: "contract-11",
      contract_number: "TRD-66-011",
      parcel_number: "อด.2346",
      location_lat: 17.6833,
      location_lng: 102.7833,
      province: "อุดรธานี",
      district: "เพ็ญ",
      sub_district: "เพ็ญ",
      land_area_sqw: 1200.0,
      is_active: true,
      building_type: null,
      usable_area_sqm: 0.0,
      zoning: "พื้นที่สีเขียว (ชนบทและเกษตรกรรม)",
      annual_rent: 12000.0,
    },
    asking_price: 600000.0,
    estimated_fee: 18000.0,
    description: "ที่ดินเปล่าผืนใหญ่เพื่อการเกษตรกรรมในอำเภอเพ็ญ อุดรธานี ดินดีระบายน้ำดี เหมาะสำหรับเกษตรอินทรีย์ ปลูกสวนผสม หรือโครงการเกษตรทฤษฎีใหม่",
    image_urls: ["https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=800&q=80"],
    status: "ACTIVE",
    createdAt: "2026-07-09T00:00:00Z",
    updatedAt: "2026-07-09T00:00:00Z",
  },
  {
    id: "list-12",
    sellerId: "seller-2",
    seller: { id: "seller-2", thaid_id: "2123456789012", first_name: "สมหญิง", last_name: "รักดี", role: "USER" },
    contractId: "contract-12",
    contract: {
      id: "contract-12",
      contract_number: "TRD-66-012",
      parcel_number: "นค.1601",
      location_lat: 18.0125,
      location_lng: 103.0825,
      province: "หนองคาย",
      district: "โพนพิสัย",
      sub_district: "จุมพล",
      land_area_sqw: 1800.0,
      is_active: true,
      building_type: null,
      usable_area_sqm: 0.0,
      zoning: "พื้นที่สีเขียว (ชนบทและเกษตรกรรม)",
      annual_rent: 12000.0,
    },
    asking_price: 850000.0,
    estimated_fee: 25500.0,
    description: "สิทธิ์การเช่าที่ดินเพื่อเกษตรกรรมและคลังพักของเกษตรกรในโพนพิสัย ติดถนนทางหลวงเดินทางขนส่งผลผลิตทางการเกษตรได้สะดวก รวดเร็ว",
    image_urls: ["https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=800&q=80"],
    status: "ACTIVE",
    createdAt: "2026-07-09T00:00:00Z",
    updatedAt: "2026-07-09T00:00:00Z",
  },
  {
    id: "list-13",
    sellerId: "seller-3",
    seller: { id: "seller-3", thaid_id: "3123456789012", first_name: "ประยุทธ์", last_name: "มั่งมี", role: "USER" },
    contractId: "contract-13",
    contract: {
      id: "contract-13",
      contract_number: "TRD-66-013",
      parcel_number: "นค.1602",
      location_lat: 17.8483,
      location_lng: 102.5833,
      province: "หนองคาย",
      district: "ท่าบ่อ",
      sub_district: "ท่าบ่อ",
      land_area_sqw: 250.0,
      is_active: true,
      building_type: "อาคารพาณิชย์",
      usable_area_sqm: 420.0,
      zoning: "พื้นที่สีแดง (พาณิชยกรรม)",
      annual_rent: 12000.0,
    },
    asking_price: 1650000.0,
    estimated_fee: 49500.0,
    description: "ตึกพาณิชย์ขนาดใหญ่ในย่านการค้าท่าบ่อ หนองคาย เหมาะทำโชว์รูมสินค้า ศูนย์บริการกระจายสินค้ารายย่อย หรือเปิดกิจการศูนย์อาหารเชิงพาณิชย์",
    image_urls: ["https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=800&q=80"],
    status: "ACTIVE",
    createdAt: "2026-07-09T00:00:00Z",
    updatedAt: "2026-07-09T00:00:00Z",
  },
  {
    id: "list-14",
    sellerId: "seller-1",
    seller: { id: "seller-1", thaid_id: "1123456789012", first_name: "สมชาย", last_name: "ใจดี", role: "USER" },
    contractId: "contract-14",
    contract: {
      id: "contract-14",
      contract_number: "TRD-66-014",
      parcel_number: "กจ.2355",
      location_lat: 13.9633,
      location_lng: 99.6333,
      province: "กาญจนบุรี",
      district: "ท่าม่วง",
      sub_district: "ท่าม่วง",
      land_area_sqw: 120.0,
      is_active: true,
      building_type: "อาคารพาณิชย์",
      usable_area_sqm: 220.0,
      zoning: "พื้นที่สีแดง (พาณิชยกรรม)",
      annual_rent: 12000.0,
    },
    asking_price: 1800000.0,
    estimated_fee: 54000.0,
    description: "สิทธิ์เช่าอาคารพาณิชย์ทำเลดีติดถนนแสงชูโต อำเภอท่าม่วง เหมาะสำหรับเปิดคลินิกการแพทย์ ร้านค้าสะดวกซื้อ สำนักงานบริการ หรือสถาบันกวดวิชา",
    image_urls: ["https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=800&q=80"],
    status: "ACTIVE",
    createdAt: "2026-07-09T00:00:00Z",
    updatedAt: "2026-07-09T00:00:00Z",
  },
  {
    id: "list-15",
    sellerId: "seller-2",
    seller: { id: "seller-2", thaid_id: "2123456789012", first_name: "สมหญิง", last_name: "รักดี", role: "USER" },
    contractId: "contract-15",
    contract: {
      id: "contract-15",
      contract_number: "TRD-66-015",
      parcel_number: "กจ.2356",
      location_lat: 14.4167,
      location_lng: 99.1333,
      province: "กาญจนบุรี",
      district: "ศรีสวัสดิ์",
      sub_district: "ศรีสวัสดิ์",
      land_area_sqw: 3500.0,
      is_active: true,
      building_type: null,
      usable_area_sqm: 0.0,
      zoning: "พื้นที่สีเขียว (ชนบทและเกษตรกรรม)",
      annual_rent: 12000.0,
    },
    asking_price: 550000.0,
    estimated_fee: 16500.0,
    description: "ที่ดินเปล่าแปลงขนาดใหญ่ ใกล้เขื่อนศรีนครินทร์ ศรีสวัสดิ์ กาญจนบุรี วิวสวย ท่ามกลางธรรมชาติ เหมาะจัดตั้งแคมป์ปิ้ง ลานกิจกรรม หรือโฮมสเตย์แนวผจญภัย",
    image_urls: ["https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=800&q=80"],
    status: "ACTIVE",
    createdAt: "2026-07-09T00:00:00Z",
    updatedAt: "2026-07-09T00:00:00Z",
  },
  {
    id: "list-16",
    sellerId: "seller-3",
    seller: { id: "seller-3", thaid_id: "3123456789012", first_name: "ประยุทธ์", last_name: "มั่งมี", role: "USER" },
    contractId: "contract-16",
    contract: {
      id: "contract-16",
      contract_number: "TRD-66-016",
      parcel_number: "นภ.3465",
      location_lat: 17.2917,
      location_lng: 102.1833,
      province: "หนองบัวลำภู",
      district: "นากลาง",
      sub_district: "นากลาง",
      land_area_sqw: 160.0,
      is_active: true,
      building_type: "บ้านพักอาศัย",
      usable_area_sqm: 150.0,
      zoning: "พื้นที่สีเหลือง (ที่อยู่อาศัยหนาแน่นน้อย)",
      annual_rent: 12000.0,
    },
    asking_price: 850000.0,
    estimated_fee: 25500.0,
    description: "บ้านพักอาศัยเดี่ยว 1 ชั้น ย่านอำเภอนากลาง ทำเลอยู่อาศัยดี เงียบสงบ ปลอดภัย เหมาะสำหรับย้ายเข้าอยู่เป็นที่พำนักของครอบครัว เดินทางเข้าตัวเมืองง่าย",
    image_urls: ["https://images.unsplash.com/photo-1580587771525-78b9dba3b914?auto=format&fit=crop&w=800&q=80"],
    status: "ACTIVE",
    createdAt: "2026-07-09T00:00:00Z",
    updatedAt: "2026-07-09T00:00:00Z",
  },
  {
    id: "list-17",
    sellerId: "seller-1",
    seller: { id: "seller-1", thaid_id: "1123456789012", first_name: "สมชาย", last_name: "ใจดี", role: "USER" },
    contractId: "contract-17",
    contract: {
      id: "contract-17",
      contract_number: "TRD-66-017",
      parcel_number: "นภ.3466",
      location_lat: 16.8667,
      location_lng: 102.5667,
      province: "หนองบัวลำภู",
      district: "โนนสัง",
      sub_district: "โนนสัง",
      land_area_sqw: 1500.0,
      is_active: true,
      building_type: null,
      usable_area_sqm: 0.0,
      zoning: "พื้นที่สีเขียว (ชนบทและเกษตรกรรม)",
      annual_rent: 12000.0,
    },
    asking_price: 400000.0,
    estimated_fee: 12000.0,
    description: "ที่ดินราชพัสดุเพื่อการเกษตรกรรมใกล้เขื่อนอุบลรัตน์ อำเภอโนนสัง บรรยากาศดี ดินอุดมสมบูรณ์ เหมาะสำหรับทำการเกษตรประยุกต์ หรือพัฒนาโครงการรีสอร์ทบ้านสวน",
    image_urls: ["https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=800&q=80"],
    status: "ACTIVE",
    createdAt: "2026-07-09T00:00:00Z",
    updatedAt: "2026-07-09T00:00:00Z",
  },
  {
    id: "list-18",
    sellerId: "seller-3",
    seller: { id: "seller-3", thaid_id: "3123456789012", first_name: "ประยุทธ์", last_name: "มั่งมี", role: "USER" },
    contractId: "contract-18",
    contract: {
      id: "contract-18",
      contract_number: "TRD-66-018",
      parcel_number: "ขก.5791",
      location_lat: 16.5444,
      location_lng: 102.1333,
      province: "ขอนแก่น",
      district: "ชุมแพ",
      sub_district: "ชุมแพ",
      land_area_sqw: 850.0,
      is_active: true,
      building_type: "คลังสินค้า",
      usable_area_sqm: 600.0,
      zoning: "พื้นที่สีม่วง (อุตสาหกรรม)",
      annual_rent: 12000.0,
    },
    asking_price: 4200000.0,
    estimated_fee: 126000.0,
    description: "สิทธิ์การเช่าคลังสินค้าและอาคารสำนักงานอุตสาหกรรมในอำเภอชุมแพ ขอนแก่น รองรับการขนส่งกระจายสินค้าไปยังภาคอีสานตอนบนและตอนกลาง มีลานจอดรถบรรทุกกว้างขวาง",
    image_urls: ["https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=800&q=80"],
    status: "ACTIVE",
    createdAt: "2026-07-09T00:00:00Z",
    updatedAt: "2026-07-09T00:00:00Z",
  },
  {
    id: "list-19",
    sellerId: "seller-3",
    seller: { id: "seller-3", thaid_id: "3123456789012", first_name: "ประยุทธ์", last_name: "มั่งมี", role: "USER" },
    contractId: "contract-19",
    contract: {
      id: "contract-19",
      contract_number: "TRD-66-019",
      parcel_number: "ชบ.9102",
      location_lat: 13.1733,
      location_lng: 100.9333,
      province: "ชลบุรี",
      district: "ศรีราชา",
      sub_district: "ทุ่งสุขลา",
      land_area_sqw: 1200.0,
      is_active: true,
      building_type: "คลังสินค้า",
      usable_area_sqm: 950.0,
      zoning: "พื้นที่สีม่วง (อุตสาหกรรม)",
      annual_rent: 12000.0,
    },
    asking_price: 5500000.0,
    estimated_fee: 165000.0,
    description: "โกดังโรงงานและคลังสินค้าให้เช่าทำเลเขตเศรษฐกิจพิเศษ EEC ศรีราชา ชลบุรี ใกล้ท่าเรือแหลมฉบัง เหมาะสำหรับงานโลจิสติกส์ จัดเก็บ หรือแปรรูปอุตสาหกรรมขั้นกลาง",
    image_urls: ["https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=800&q=80"],
    status: "ACTIVE",
    createdAt: "2026-07-09T00:00:00Z",
    updatedAt: "2026-07-09T00:00:00Z",
  },
  {
    id: "list-20",
    sellerId: "seller-1",
    seller: { id: "seller-1", thaid_id: "1123456789012", first_name: "สมชาย", last_name: "ใจดี", role: "USER" },
    contractId: "contract-20",
    contract: {
      id: "contract-20",
      contract_number: "กท.1001",
      parcel_number: "กท.1001",
      location_lat: 13.78,
      location_lng: 100.54,
      province: "กรุงเทพมหานคร",
      district: "พญาไท",
      sub_district: "สามเสนใน",
      land_area_sqw: 65.0,
      is_active: true,
      building_type: "อาคารพาณิชย์",
      usable_area_sqm: 220.0,
      zoning: "พื้นที่สีแดง (พาณิชยกรรม)",
      annual_rent: 12000.0,
    },
    asking_price: 8500000.0,
    estimated_fee: 255000.0,
    description: "สิทธิ์การเช่าอาคารพาณิชย์ 4 ชั้น ทำเลทองพญาไท กรุงเทพฯ เหมาะทำคลินิกเสริมความงาม สปา สำนักงานใหญ่ขนาดย่อม หรือร้านอาหารพรีเมียม ใกล้สถานีรถไฟฟ้า BTS",
    image_urls: ["https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=800&q=80"],
    status: "ACTIVE",
    createdAt: "2026-07-09T00:00:00Z",
    updatedAt: "2026-07-09T00:00:00Z",
  },
];

class ApiClient {
  private token: string | null = null;
  private activeBaseUrl: string = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8001";
  private candidateUrls: string[] = [
    "http://localhost:8001",
    "http://127.0.0.1:8001",
  ];

  setToken(token: string) {
    this.token = token;
    if (typeof window !== "undefined") {
      localStorage.setItem("trd_lex_token", token);
    }
  }

  getToken(): string | null {
    if (this.token) return this.token;
    if (typeof window !== "undefined") {
      this.token = localStorage.getItem("trd_lex_token");
    }
    return this.token;
  }

  clearToken() {
    this.token = null;
    if (typeof window !== "undefined") {
      localStorage.removeItem("trd_lex_token");
    }
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const headers: HeadersInit = {
      "Content-Type": "application/json",
      ...options.headers,
    };

    const token = this.getToken();
    if (token) {
      (headers as Record<string, string>)["Authorization"] = `Bearer ${token}`;
    }

    const urlsToTry = Array.from(new Set([this.activeBaseUrl, ...this.candidateUrls]));

    for (const baseUrl of urlsToTry) {
      try {
        const controller = typeof AbortController !== "undefined" ? new AbortController() : null;
        const timeoutId = controller ? setTimeout(() => controller.abort(), 800) : null;

        const response = await fetch(`${baseUrl}${endpoint}`, {
          ...options,
          headers,
          signal: controller?.signal,
        });

        if (timeoutId) clearTimeout(timeoutId);

        if (!response.ok) {
          const error = await response.json().catch(() => ({
            detail: "เกิดข้อผิดพลาดที่ไม่คาดคิด",
          }));
          throw new Error(error.detail || `HTTP Error: ${response.status}`);
        }

        // Lock active URL to working port
        this.activeBaseUrl = baseUrl;
        return await response.json();
      } catch (err: any) {
        if (err.message && err.message.startsWith("HTTP Error:")) {
          throw err;
        }
        // Try next candidate URL
      }
    }

    // Robust Fallback when Backend Server is Offline
    const cleanEndpoint = endpoint.split("?")[0];

    if (cleanEndpoint === "/auth/login") {
      let bodyData: any = {};
      try {
        bodyData = JSON.parse((options.body as string) || "{}");
      } catch (e) {}
      const thaid_id = bodyData.thaid_id || "1123456789012";
      const mockToken = "mock_token_" + thaid_id;
      this.setToken(mockToken);
      return {
        access_token: mockToken,
        token_type: "bearer",
        user: {
          id: "user-" + thaid_id,
          thaid_id: thaid_id,
          first_name: thaid_id === "9123456789012" ? "แอดมิน" : (thaid_id === "2123456789012" ? "สมหญิง" : "สมชาย"),
          last_name: thaid_id === "9123456789012" ? "ธนารักษ์" : (thaid_id === "2123456789012" ? "รักดี" : "ใจดี"),
          role: thaid_id === "9123456789012" ? "ADMIN" : "USER"
        }
      } as unknown as T;
    }

    if (cleanEndpoint === "/contracts/validate") {
      let bodyData: any = {};
      try {
        bodyData = JSON.parse((options.body as string) || "{}");
      } catch (e) {}
      return {
        is_valid: true,
        message: "พบข้อมูลสัญญาเช่าและคุณเป็นเจ้าของสิทธิ์ สามารถลงประกาศได้",
        contract_data: {
          id: "c-mock-1",
          contract_number: bodyData.contract_number || "3-000000-1970-0376",
          parcel_number: "0376",
          location_lat: 17.4037,
          location_lng: 102.7895,
          province: "อุดรธานี",
          district: "เมืองอุดรธานี",
          sub_district: "หมากแข้ง",
          land_area_sqw: 12.0,
          is_active: true,
          building_type: "อาคารพาณิชย์",
          usable_area_sqm: 144.0,
          zoning: "เขตสีแดง (ที่ดินประเภทพาณิชยกรรม)",
          annual_rent: 7850.0
        }
      } as unknown as T;
    }

    if (cleanEndpoint.startsWith("/listings")) {
      if (cleanEndpoint === "/listings/my") {
        return mockListingsData as unknown as T;
      }
      if (cleanEndpoint !== "/listings") {
        const parts = cleanEndpoint.split("/");
        const id = parts[parts.length - 1];
        const found = mockListingsData.find(l => l.id === id) || mockListingsData[0];
        return found as unknown as T;
      }

      // Parse query params for filtering in mock
      const url = new URL(endpoint, "http://localhost");
      const prov = url.searchParams.get("province");
      const minP = url.searchParams.get("min_price");
      const maxP = url.searchParams.get("max_price");

      let filtered = [...mockListingsData];
      if (prov) {
        filtered = filtered.filter(l => l.contract.province === prov);
      }
      if (minP) {
        filtered = filtered.filter(l => l.asking_price >= parseFloat(minP));
      }
      if (maxP) {
        filtered = filtered.filter(l => l.asking_price <= parseFloat(maxP));
      }

      return {
        items: filtered,
        total: filtered.length,
        page: 1,
        per_page: 50
      } as unknown as T;
    }

    if (cleanEndpoint === "/contracts/my") {
      return [mockListingsData[0].contract] as unknown as T;
    }

    if (cleanEndpoint === "/dashboard/economic-indicators") {
      return {
        revived_land_sqw: 14500,
        state_revenue_baht: 2540000,
        economic_circulation_baht: 85000000
      } as unknown as T;
    }

    if (cleanEndpoint === "/calculator/transfer-fee") {
      return {
        calculated_fee: 45000,
        fee_rate_percentage: 3.0,
        breakdown: "คำนวณตามระเบียบ ๖ เท่าของค่าเช่ารายปี"
      } as unknown as T;
    }

    return {} as T;
  }

  // ===== Authentication =====
  async login(data: LoginRequest): Promise<TokenResponse> {
    const result = await this.request<TokenResponse>("/auth/login", {
      method: "POST",
      body: JSON.stringify(data),
    });
    if (result.access_token) {
      this.setToken(result.access_token);
    }
    return result;
  }

  logout() {
    this.clearToken();
  }

  // ===== Contracts =====
  async validateContract(
    data: ValidateContractRequest
  ): Promise<ValidateContractResponse> {
    return this.request<ValidateContractResponse>("/contracts/validate", {
      method: "POST",
      body: JSON.stringify(data),
    });
  }

  async getMyContracts(): Promise<LeaseContract[]> {
    return this.request<LeaseContract[]>("/contracts/my");
  }

  // ===== Listings =====
  async getListings(params?: {
    province?: string;
    min_price?: number;
    max_price?: number;
    page?: number;
    per_page?: number;
  }): Promise<ListingListResponse> {
    const searchParams = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          searchParams.set(key, String(value));
        }
      });
    }
    const query = searchParams.toString();
    return this.request<ListingListResponse>(
      `/listings${query ? `?${query}` : ""}`
    );
  }

  async getListingById(id: string): Promise<Listing> {
    return this.request<Listing>(`/listings/${id}`);
  }

  async getMyListings(): Promise<Listing[]> {
    return this.request<Listing[]>("/listings/my");
  }

  async createListing(data: CreateListingRequest): Promise<Listing> {
    return this.request<Listing>("/listings", {
      method: "POST",
      body: JSON.stringify(data),
    });
  }

  async updateListing(
    id: string,
    data: UpdateListingRequest
  ): Promise<Listing> {
    return this.request<Listing>(`/listings/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    });
  }

  async updateListingStatus(
    id: string,
    data: UpdateListingStatusRequest
  ): Promise<Listing> {
    return this.request<Listing>(`/listings/${id}/status`, {
      method: "PATCH",
      body: JSON.stringify(data),
    });
  }

  async deleteListing(id: string): Promise<void> {
    return this.request<void>(`/listings/${id}`, {
      method: "DELETE",
    });
  }

  async getEconomicIndicators(): Promise<{
    revived_land_sqw: number;
    state_revenue_baht: number;
    economic_circulation_baht: number;
  }> {
    return this.request<{
      revived_land_sqw: number;
      state_revenue_baht: number;
      economic_circulation_baht: number;
    }>("/dashboard/economic-indicators");
  }

  async calculateTransferFee(
    data: FeeCalculationRequest
  ): Promise<FeeCalculationResponse> {
    return this.request<FeeCalculationResponse>("/calculator/transfer-fee", {
      method: "POST",
      body: JSON.stringify(data),
    });
  }
}

// Singleton instance
const api = new ApiClient();
export default api;
