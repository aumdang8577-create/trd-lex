import asyncio
from prisma import Prisma
from app.models.enums import Role, ListingStatus

async def main():
    db = Prisma()
    await db.connect()
    
    print("Cleaning database...")
    await db.listing.delete_many()
    await db.leasecontract.delete_many()
    await db.user.delete_many()
    
    print("Seeding Users...")
    user_somchai = await db.user.create(
        data={
            "thaid_id": "1123456789012",
            "first_name": "สมชาย",
            "last_name": "ใจดี",
            "phone_number": "0812345678",
            "role": Role.USER.value
        }
    )
    user_somying = await db.user.create(
        data={
            "thaid_id": "2123456789012",
            "first_name": "สมหญิง",
            "last_name": "รักดี",
            "phone_number": "0898765432",
            "role": Role.USER.value
        }
    )
    user_prayut = await db.user.create(
        data={
            "thaid_id": "3123456789012",
            "first_name": "ประยุทธ์",
            "last_name": "มั่งมี",
            "phone_number": "0811112222",
            "role": Role.USER.value
        }
    )
    user_admin = await db.user.create(
        data={
            "thaid_id": "9123456789012",
            "first_name": "แอดมิน",
            "last_name": "ธนารักษ์",
            "phone_number": "021234567",
            "role": Role.ADMIN.value
        }
    )
    
    user_map = {
        "seller-1": user_somchai,
        "seller-2": user_somying,
        "seller-3": user_prayut
    }

    print("Seeding 20 Lease Contracts...")
    contract1 = await db.leasecontract.create(
        data={
            "contract_number": "TRD-66-001",
            "lessee_thaid_id": "1123456789012",
            "parcel_number": "อด.1234",
            "location_lat": 17.4138,
            "location_lng": 102.7872,
            "province": "อุดรธานี",
            "district": "เมืองอุดรธานี",
            "sub_district": "หมากแข้ง",
            "land_area_sqw": 120.0,
            "is_active": True,
            "building_type": "อาคารพาณิชย์",
            "usable_area_sqm": 250.0,
            "zoning": "พื้นที่สีแดง (พาณิชยกรรม)",
            "annual_rent": 12000.0
        }
    )
    contract2 = await db.leasecontract.create(
        data={
            "contract_number": "TRD-66-002",
            "lessee_thaid_id": "2123456789012",
            "parcel_number": "ขก.5678",
            "location_lat": 16.4322,
            "location_lng": 102.8236,
            "province": "ขอนแก่น",
            "district": "เมืองขอนแก่น",
            "sub_district": "ในเมือง",
            "land_area_sqw": 80.0,
            "is_active": True,
            "building_type": "บ้านพักอาศัย",
            "usable_area_sqm": 140.0,
            "zoning": "พื้นที่สีเหลือง (ที่อยู่อาศัยหนาแน่นน้อย)",
            "annual_rent": 12000.0
        }
    )
    contract3 = await db.leasecontract.create(
        data={
            "contract_number": "TRD-66-003",
            "lessee_thaid_id": "3123456789012",
            "parcel_number": "นค.1507",
            "location_lat": 17.8776,
            "location_lng": 102.7435,
            "province": "หนองคาย",
            "district": "เมืองหนองคาย",
            "sub_district": "ในเมือง",
            "land_area_sqw": 3677.44,
            "is_active": True,
            "building_type": "อาคารพาณิชย์",
            "usable_area_sqm": 350.0,
            "zoning": "พื้นที่สีแดง (พาณิชยกรรม)",
            "annual_rent": 12000.0
        }
    )
    contract4 = await db.leasecontract.create(
        data={
            "contract_number": "TRD-66-004",
            "lessee_thaid_id": "2123456789012",
            "parcel_number": "นค.1509",
            "location_lat": 17.8752,
            "location_lng": 102.7425,
            "province": "หนองคาย",
            "district": "เมืองหนองคาย",
            "sub_district": "ในเมือง",
            "land_area_sqw": 6263.67,
            "is_active": True,
            "building_type": None,
            "usable_area_sqm": 0.0,
            "zoning": "พื้นที่สีเขียว (ชนบทและเกษตรกรรม)",
            "annual_rent": 12000.0
        }
    )
    contract5 = await db.leasecontract.create(
        data={
            "contract_number": "TRD-66-005",
            "lessee_thaid_id": "1123456789012",
            "parcel_number": "นค.1496",
            "location_lat": 17.8792,
            "location_lng": 102.7489,
            "province": "หนองคาย",
            "district": "เมืองหนองคาย",
            "sub_district": "ในเมือง",
            "land_area_sqw": 1030.53,
            "is_active": True,
            "building_type": "บ้านพักอาศัย",
            "usable_area_sqm": 120.0,
            "zoning": "พื้นที่สีเหลือง (ที่อยู่อาศัยหนาแน่นน้อย)",
            "annual_rent": 12000.0
        }
    )
    contract6 = await db.leasecontract.create(
        data={
            "contract_number": "TRD-66-006",
            "lessee_thaid_id": "3123456789012",
            "parcel_number": "กจ.2345",
            "location_lat": 14.0227,
            "location_lng": 99.5328,
            "province": "กาญจนบุรี",
            "district": "เมืองกาญจนบุรี",
            "sub_district": "ปากแพรก",
            "land_area_sqw": 150.0,
            "is_active": True,
            "building_type": "บ้านพักอาศัย",
            "usable_area_sqm": 180.0,
            "zoning": "พื้นที่สีเหลือง (ที่อยู่อาศัยหนาแน่นน้อย)",
            "annual_rent": 12000.0
        }
    )
    contract7 = await db.leasecontract.create(
        data={
            "contract_number": "TRD-66-007",
            "lessee_thaid_id": "1123456789012",
            "parcel_number": "กจ.2346",
            "location_lat": 14.1167,
            "location_lng": 99.1333,
            "province": "กาญจนบุรี",
            "district": "ไทรโยค",
            "sub_district": "ไทรโยค",
            "land_area_sqw": 2400.0,
            "is_active": True,
            "building_type": None,
            "usable_area_sqm": 0.0,
            "zoning": "พื้นที่สีเขียว (ชนบทและเกษตรกรรม)",
            "annual_rent": 12000.0
        }
    )
    contract8 = await db.leasecontract.create(
        data={
            "contract_number": "TRD-66-008",
            "lessee_thaid_id": "2123456789012",
            "parcel_number": "นภ.3456",
            "location_lat": 17.2023,
            "location_lng": 102.4411,
            "province": "หนองบัวลำภู",
            "district": "เมืองหนองบัวลำภู",
            "sub_district": "ลำภู",
            "land_area_sqw": 3200.0,
            "is_active": True,
            "building_type": None,
            "usable_area_sqm": 0.0,
            "zoning": "พื้นที่สีเขียว (ชนบทและเกษตรกรรม)",
            "annual_rent": 12000.0
        }
    )
    contract9 = await db.leasecontract.create(
        data={
            "contract_number": "TRD-66-009",
            "lessee_thaid_id": "1123456789012",
            "parcel_number": "นภ.3457",
            "location_lat": 16.9634,
            "location_lng": 102.2778,
            "province": "หนองบัวลำภู",
            "district": "ศรีบุญเรือง",
            "sub_district": "ศรีบุญเรือง",
            "land_area_sqw": 90.0,
            "is_active": True,
            "building_type": "อาคารพาณิชย์",
            "usable_area_sqm": 160.0,
            "zoning": "พื้นที่สีแดง (พาณิชยกรรม)",
            "annual_rent": 12000.0
        }
    )
    contract10 = await db.leasecontract.create(
        data={
            "contract_number": "TRD-66-010",
            "lessee_thaid_id": "3123456789012",
            "parcel_number": "อด.2345",
            "location_lat": 17.1165,
            "location_lng": 103.0182,
            "province": "อุดรธานี",
            "district": "กุมภวาปี",
            "sub_district": "กุมภวาปี",
            "land_area_sqw": 180.0,
            "is_active": True,
            "building_type": "อาคารพาณิชย์",
            "usable_area_sqm": 280.0,
            "zoning": "พื้นที่สีแดง (พาณิชยกรรม)",
            "annual_rent": 12000.0
        }
    )
    contract11 = await db.leasecontract.create(
        data={
            "contract_number": "TRD-66-011",
            "lessee_thaid_id": "1123456789012",
            "parcel_number": "อด.2346",
            "location_lat": 17.6833,
            "location_lng": 102.7833,
            "province": "อุดรธานี",
            "district": "เพ็ญ",
            "sub_district": "เพ็ญ",
            "land_area_sqw": 1200.0,
            "is_active": True,
            "building_type": None,
            "usable_area_sqm": 0.0,
            "zoning": "พื้นที่สีเขียว (ชนบทและเกษตรกรรม)",
            "annual_rent": 12000.0
        }
    )
    contract12 = await db.leasecontract.create(
        data={
            "contract_number": "TRD-66-012",
            "lessee_thaid_id": "2123456789012",
            "parcel_number": "นค.1601",
            "location_lat": 18.0125,
            "location_lng": 103.0825,
            "province": "หนองคาย",
            "district": "โพนพิสัย",
            "sub_district": "จุมพล",
            "land_area_sqw": 1800.0,
            "is_active": True,
            "building_type": None,
            "usable_area_sqm": 0.0,
            "zoning": "พื้นที่สีเขียว (ชนบทและเกษตรกรรม)",
            "annual_rent": 12000.0
        }
    )
    contract13 = await db.leasecontract.create(
        data={
            "contract_number": "TRD-66-013",
            "lessee_thaid_id": "3123456789012",
            "parcel_number": "นค.1602",
            "location_lat": 17.8483,
            "location_lng": 102.5833,
            "province": "หนองคาย",
            "district": "ท่าบ่อ",
            "sub_district": "ท่าบ่อ",
            "land_area_sqw": 250.0,
            "is_active": True,
            "building_type": "อาคารพาณิชย์",
            "usable_area_sqm": 420.0,
            "zoning": "พื้นที่สีแดง (พาณิชยกรรม)",
            "annual_rent": 12000.0
        }
    )
    contract14 = await db.leasecontract.create(
        data={
            "contract_number": "TRD-66-014",
            "lessee_thaid_id": "1123456789012",
            "parcel_number": "กจ.2355",
            "location_lat": 13.9633,
            "location_lng": 99.6333,
            "province": "กาญจนบุรี",
            "district": "ท่าม่วง",
            "sub_district": "ท่าม่วง",
            "land_area_sqw": 120.0,
            "is_active": True,
            "building_type": "อาคารพาณิชย์",
            "usable_area_sqm": 220.0,
            "zoning": "พื้นที่สีแดง (พาณิชยกรรม)",
            "annual_rent": 12000.0
        }
    )
    contract15 = await db.leasecontract.create(
        data={
            "contract_number": "TRD-66-015",
            "lessee_thaid_id": "2123456789012",
            "parcel_number": "กจ.2356",
            "location_lat": 14.4167,
            "location_lng": 99.1333,
            "province": "กาญจนบุรี",
            "district": "ศรีสวัสดิ์",
            "sub_district": "ศรีสวัสดิ์",
            "land_area_sqw": 3500.0,
            "is_active": True,
            "building_type": None,
            "usable_area_sqm": 0.0,
            "zoning": "พื้นที่สีเขียว (ชนบทและเกษตรกรรม)",
            "annual_rent": 12000.0
        }
    )
    contract16 = await db.leasecontract.create(
        data={
            "contract_number": "TRD-66-016",
            "lessee_thaid_id": "3123456789012",
            "parcel_number": "นภ.3465",
            "location_lat": 17.2917,
            "location_lng": 102.1833,
            "province": "หนองบัวลำภู",
            "district": "นากลาง",
            "sub_district": "นากลาง",
            "land_area_sqw": 160.0,
            "is_active": True,
            "building_type": "บ้านพักอาศัย",
            "usable_area_sqm": 150.0,
            "zoning": "พื้นที่สีเหลือง (ที่อยู่อาศัยหนาแน่นน้อย)",
            "annual_rent": 12000.0
        }
    )
    contract17 = await db.leasecontract.create(
        data={
            "contract_number": "TRD-66-017",
            "lessee_thaid_id": "1123456789012",
            "parcel_number": "นภ.3466",
            "location_lat": 16.8667,
            "location_lng": 102.5667,
            "province": "หนองบัวลำภู",
            "district": "โนนสัง",
            "sub_district": "โนนสัง",
            "land_area_sqw": 1500.0,
            "is_active": True,
            "building_type": None,
            "usable_area_sqm": 0.0,
            "zoning": "พื้นที่สีเขียว (ชนบทและเกษตรกรรม)",
            "annual_rent": 12000.0
        }
    )
    contract18 = await db.leasecontract.create(
        data={
            "contract_number": "TRD-66-018",
            "lessee_thaid_id": "2123456789012",
            "parcel_number": "ขก.5791",
            "location_lat": 16.5444,
            "location_lng": 102.1333,
            "province": "ขอนแก่น",
            "district": "ชุมแพ",
            "sub_district": "ชุมแพ",
            "land_area_sqw": 850.0,
            "is_active": True,
            "building_type": "คลังสินค้า",
            "usable_area_sqm": 600.0,
            "zoning": "พื้นที่สีม่วง (อุตสาหกรรม)",
            "annual_rent": 12000.0
        }
    )
    contract19 = await db.leasecontract.create(
        data={
            "contract_number": "TRD-66-019",
            "lessee_thaid_id": "3123456789012",
            "parcel_number": "ชบ.9102",
            "location_lat": 13.1733,
            "location_lng": 100.9333,
            "province": "ชลบุรี",
            "district": "ศรีราชา",
            "sub_district": "ทุ่งสุขลา",
            "land_area_sqw": 1200.0,
            "is_active": True,
            "building_type": "คลังสินค้า",
            "usable_area_sqm": 950.0,
            "zoning": "พื้นที่สีม่วง (อุตสาหกรรม)",
            "annual_rent": 12000.0
        }
    )
    contract20 = await db.leasecontract.create(
        data={
            "contract_number": "TRD-66-020",
            "lessee_thaid_id": "1123456789012",
            "parcel_number": "กท.1001",
            "location_lat": 13.78,
            "location_lng": 100.54,
            "province": "กรุงเทพมหานคร",
            "district": "พญาไท",
            "sub_district": "สามเสนใน",
            "land_area_sqw": 65.0,
            "is_active": True,
            "building_type": "อาคารพาณิชย์",
            "usable_area_sqm": 220.0,
            "zoning": "พื้นที่สีแดง (พาณิชยกรรม)",
            "annual_rent": 12000.0
        }
    )

    print("Seeding 20 Listings...")
    await db.listing.create(
        data={
            "sellerId": user_map["seller-1"].id,
            "contractId": contract1.id,
            "asking_price": 1500000.0,
            "estimated_fee": 45000.0,
            "description": "สิทธิ์การเช่าที่ดินเพื่อการพาณิชย์ ทำเลทองเมืองอุดรธานี ใกล้เซ็นทรัลอุดรธานี เหมาะทำร้านค้าหรือสำนักงานขนาดเล็ก เดินทางสะดวกติดถนนใหญ่สภาพแวดล้อมดีเยี่ยม",
            "image_urls": ["https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=800&q=80"],
            "status": ListingStatus.ACTIVE.value
        }
    )
    await db.listing.create(
        data={
            "sellerId": user_map["seller-2"].id,
            "contractId": contract2.id,
            "asking_price": 980000.0,
            "estimated_fee": 29400.0,
            "description": "แปลงที่ดินราชพัสดุในเมืองขอนแก่น ทำเลพักอาศัย เงียบสงบ ใกล้วัดหนองแวงและบึงแก่นนคร เดินทางสะดวกมีสาธารณูปโภคครบครัน เหมาะสำหรับสร้างบ้านเดี่ยวหรือบ้านพักตากอากาศส่วนตัว",
            "image_urls": ["https://images.unsplash.com/photo-1580587771525-78b9dba3b914?auto=format&fit=crop&w=800&q=80"],
            "status": ListingStatus.ACTIVE.value
        }
    )
    await db.listing.create(
        data={
            "sellerId": user_map["seller-3"].id,
            "contractId": contract3.id,
            "asking_price": 2400000.0,
            "estimated_fee": 72000.0,
            "description": "สิทธิ์การเช่าระยะยาวใกล้ริมแม่น้ำโขง เมืองหนองคาย เหมาะสำหรับทำร้านอาหารหรือโฮมสเตย์รองรับนักท่องเที่ยวริมโขงและตลาดท่าเสด็จ แปลงมุมหน้ากว้างสวยงาม",
            "image_urls": ["https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=800&q=80"],
            "status": ListingStatus.ACTIVE.value
        }
    )
    await db.listing.create(
        data={
            "sellerId": user_map["seller-2"].id,
            "contractId": contract4.id,
            "asking_price": 3800000.0,
            "estimated_fee": 114000.0,
            "description": "แปลงที่ดินขนาดใหญ่ใจกลางเมืองหนองคาย เหมาะสำหรับพัฒนาโครงการอาคารพาณิชย์หรือคอนโดมิเนียมรองรับเขตเศรษฐกิจพิเศษ ที่ดินเปล่าสภาพดีพร้อมพัฒนา",
            "image_urls": ["https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=800&q=80"],
            "status": ListingStatus.ACTIVE.value
        }
    )
    await db.listing.create(
        data={
            "sellerId": user_map["seller-1"].id,
            "contractId": contract5.id,
            "asking_price": 1200000.0,
            "estimated_fee": 36000.0,
            "description": "ที่ดินราชพัสดุทำเลดี ใกล้ถนนสายหลัก เหมาะทำที่พักอาศัยหรือร้านค้าขนาดเล็ก สภาพแวดล้อมดี มีสาธารณูปโภคครบ บ้านพักอาศัย 1 ชั้น",
            "image_urls": ["https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&w=800&q=80"],
            "status": ListingStatus.ACTIVE.value
        }
    )
    await db.listing.create(
        data={
            "sellerId": user_map["seller-3"].id,
            "contractId": contract6.id,
            "asking_price": 1250000.0,
            "estimated_fee": 37500.0,
            "description": "สิทธิ์การเช่าที่ดินพร้อมสิ่งปลูกสร้างสไตล์บ้านพักอาศัย บรรยากาศร่มรื่นใกล้แม่น้ำแคว เดินทางเข้าเมืองกาญจนบุรีสะดวกมาก สภาพบ้านพร้อมย้ายเข้าอยู่ได้ทันที",
            "image_urls": ["https://images.unsplash.com/photo-1580587771525-78b9dba3b914?auto=format&fit=crop&w=800&q=80"],
            "status": ListingStatus.ACTIVE.value
        }
    )
    await db.listing.create(
        data={
            "sellerId": user_map["seller-1"].id,
            "contractId": contract7.id,
            "asking_price": 450000.0,
            "estimated_fee": 13500.0,
            "description": "ที่ดินเปล่าผืนใหญ่ในอำเภอไทรโยค ทำเลติดธรรมชาติ เหมาะสำหรับการเกษตรกรรมท่องเที่ยวเชิงอนุรักษ์ โฮมสเตย์ หรือแคมป์ปิ้งพักผ่อนเชิงนิเวศ",
            "image_urls": ["https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=800&q=80"],
            "status": ListingStatus.ACTIVE.value
        }
    )
    await db.listing.create(
        data={
            "sellerId": user_map["seller-2"].id,
            "contractId": contract8.id,
            "asking_price": 350000.0,
            "estimated_fee": 10500.0,
            "description": "แปลงที่ราชพัสดุแปลงว่างเปล่าในหนองบัวลำภู พื้นที่ดินดำอุดมสมบูรณ์ เหมาะสำหรับการทำเกษตรกรรมยั่งยืน หรือสร้างโซลาร์ฟาร์มชุมชนหมุนเวียน",
            "image_urls": ["https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=800&q=80"],
            "status": ListingStatus.ACTIVE.value
        }
    )
    await db.listing.create(
        data={
            "sellerId": user_map["seller-1"].id,
            "contractId": contract9.id,
            "asking_price": 1100000.0,
            "estimated_fee": 33000.0,
            "description": "อาคารพาณิชย์สองชั้นใจกลางชุมชนอำเภอศรีบุญเรือง เหมาะทำเป็นหน้าร้านค้าขายปลีก ร้านกาแฟ หรือสำนักงานตัวแทนบริการสาขาของหน่วยงาน",
            "image_urls": ["https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=800&q=80"],
            "status": ListingStatus.ACTIVE.value
        }
    )
    await db.listing.create(
        data={
            "sellerId": user_map["seller-3"].id,
            "contractId": contract10.id,
            "asking_price": 1350000.0,
            "estimated_fee": 40500.0,
            "description": "อาคารพาณิชย์ทำเลดีในอำเภอกุมภวาปี ใกล้แหล่งการค้าชุมชนและตลาดใหญ่ เหมาะสำหรับการค้าขาย เปิดออฟฟิศ หรือพัฒนาเป็นศูนย์ขนส่งสินค้า",
            "image_urls": ["https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=800&q=80"],
            "status": ListingStatus.ACTIVE.value
        }
    )
    await db.listing.create(
        data={
            "sellerId": user_map["seller-1"].id,
            "contractId": contract11.id,
            "asking_price": 600000.0,
            "estimated_fee": 18000.0,
            "description": "ที่ดินเปล่าผืนใหญ่เพื่อการเกษตรกรรมในอำเภอเพ็ญ อุดรธานี ดินดีระบายน้ำดี เหมาะสำหรับเกษตรอินทรีย์ ปลูกสวนผสม หรือโครงการเกษตรทฤษฎีใหม่",
            "image_urls": ["https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=800&q=80"],
            "status": ListingStatus.ACTIVE.value
        }
    )
    await db.listing.create(
        data={
            "sellerId": user_map["seller-2"].id,
            "contractId": contract12.id,
            "asking_price": 850000.0,
            "estimated_fee": 25500.0,
            "description": "สิทธิ์การเช่าที่ดินเพื่อเกษตรกรรมและคลังพักของเกษตรกรในโพนพิสัย ติดถนนทางหลวงเดินทางขนส่งผลผลิตทางการเกษตรได้สะดวก รวดเร็ว",
            "image_urls": ["https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=800&q=80"],
            "status": ListingStatus.ACTIVE.value
        }
    )
    await db.listing.create(
        data={
            "sellerId": user_map["seller-3"].id,
            "contractId": contract13.id,
            "asking_price": 1650000.0,
            "estimated_fee": 49500.0,
            "description": "ตึกพาณิชย์ขนาดใหญ่ในย่านการค้าท่าบ่อ หนองคาย เหมาะทำโชว์รูมสินค้า ศูนย์บริการกระจายสินค้ารายย่อย หรือเปิดกิจการศูนย์อาหารเชิงพาณิชย์",
            "image_urls": ["https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=800&q=80"],
            "status": ListingStatus.ACTIVE.value
        }
    )
    await db.listing.create(
        data={
            "sellerId": user_map["seller-1"].id,
            "contractId": contract14.id,
            "asking_price": 1800000.0,
            "estimated_fee": 54000.0,
            "description": "สิทธิ์เช่าอาคารพาณิชย์ทำเลดีติดถนนแสงชูโต อำเภอท่าม่วง เหมาะสำหรับเปิดคลินิกการแพทย์ ร้านค้าสะดวกซื้อ สำนักงานบริการ หรือสถาบันกวดวิชา",
            "image_urls": ["https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=800&q=80"],
            "status": ListingStatus.ACTIVE.value
        }
    )
    await db.listing.create(
        data={
            "sellerId": user_map["seller-2"].id,
            "contractId": contract15.id,
            "asking_price": 550000.0,
            "estimated_fee": 16500.0,
            "description": "ที่ดินเปล่าแปลงขนาดใหญ่ ใกล้เขื่อนศรีนครินทร์ ศรีสวัสดิ์ กาญจนบุรี วิวสวย ท่ามกลางธรรมชาติ เหมาะจัดตั้งแคมป์ปิ้ง ลานกิจกรรม หรือโฮมสเตย์แนวผจญภัย",
            "image_urls": ["https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=800&q=80"],
            "status": ListingStatus.ACTIVE.value
        }
    )
    await db.listing.create(
        data={
            "sellerId": user_map["seller-3"].id,
            "contractId": contract16.id,
            "asking_price": 850000.0,
            "estimated_fee": 25500.0,
            "description": "บ้านพักอาศัยเดี่ยว 1 ชั้น ย่านอำเภอนากลาง ทำเลอยู่อาศัยดี เงียบสงบ ปลอดภัย เหมาะสำหรับย้ายเข้าอยู่เป็นที่พำนักของครอบครัว เดินทางเข้าตัวเมืองง่าย",
            "image_urls": ["https://images.unsplash.com/photo-1580587771525-78b9dba3b914?auto=format&fit=crop&w=800&q=80"],
            "status": ListingStatus.ACTIVE.value
        }
    )
    await db.listing.create(
        data={
            "sellerId": user_map["seller-1"].id,
            "contractId": contract17.id,
            "asking_price": 400000.0,
            "estimated_fee": 12000.0,
            "description": "ที่ดินราชพัสดุเพื่อการเกษตรกรรมใกล้เขื่อนอุบลรัตน์ อำเภอโนนสัง บรรยากาศดี ดินอุดมสมบูรณ์ เหมาะสำหรับทำการเกษตรประยุกต์ หรือพัฒนาโครงการรีสอร์ทบ้านสวน",
            "image_urls": ["https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=800&q=80"],
            "status": ListingStatus.ACTIVE.value
        }
    )
    await db.listing.create(
        data={
            "sellerId": user_map["seller-2"].id,
            "contractId": contract18.id,
            "asking_price": 4200000.0,
            "estimated_fee": 126000.0,
            "description": "สิทธิ์การเช่าคลังสินค้าและอาคารสำนักงานอุตสาหกรรมในอำเภอชุมแพ ขอนแก่น รองรับการขนส่งกระจายสินค้าไปยังภาคอีสานตอนบนและตอนกลาง มีลานจอดรถบรรทุกกว้างขวาง",
            "image_urls": ["https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=800&q=80"],
            "status": ListingStatus.ACTIVE.value
        }
    )
    await db.listing.create(
        data={
            "sellerId": user_map["seller-3"].id,
            "contractId": contract19.id,
            "asking_price": 5500000.0,
            "estimated_fee": 165000.0,
            "description": "โกดังโรงงานและคลังสินค้าให้เช่าทำเลเขตเศรษฐกิจพิเศษ EEC ศรีราชา ชลบุรี ใกล้ท่าเรือแหลมฉบัง เหมาะสำหรับงานโลจิสติกส์ จัดเก็บ หรือแปรรูปอุตสาหกรรมขั้นกลาง",
            "image_urls": ["https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=800&q=80"],
            "status": ListingStatus.ACTIVE.value
        }
    )
    await db.listing.create(
        data={
            "sellerId": user_map["seller-1"].id,
            "contractId": contract20.id,
            "asking_price": 8500000.0,
            "estimated_fee": 255000.0,
            "description": "สิทธิ์การเช่าอาคารพาณิชย์ 4 ชั้น ทำเลทองพญาไท กรุงเทพฯ เหมาะทำคลินิกเสริมความงาม สปา สำนักงานใหญ่ขนาดย่อม หรือร้านอาหารพรีเมียม ใกล้สถานีรถไฟฟ้า BTS",
            "image_urls": ["https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=800&q=80"],
            "status": ListingStatus.ACTIVE.value
        }
    )

    print("Database seeding completed successfully!")
    await db.disconnect()

if __name__ == "__main__":
    asyncio.run(main())
