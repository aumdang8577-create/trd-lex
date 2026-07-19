import asyncio
from prisma import Prisma
from app.models.enums import Role, ListingStatus

async def main():
    db = Prisma()
    await db.connect()
    
    print("Cleaning database...")
    # Clean up existing data in reverse order of relationships
    await db.listing.delete_many()
    await db.leasecontract.delete_many()
    await db.user.delete_many()
    
    print("Seeding Users...")
    # 1. Seed users
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
    user_admin = await db.user.create(
        data={
            "thaid_id": "9123456789012",
            "first_name": "แอดมิน",
            "last_name": "ธนารักษ์",
            "phone_number": "021234567",
            "role": Role.ADMIN.value
        }
    )
    
    # Helper: ดึงพิกัดจริงจาก TreasuryParcel ตาม parcel_number
    async def get_parcel_coords(parcel_number: str):
        parcel = await db.treasuryparcel.find_unique(where={"parcel_number": parcel_number})
        if parcel:
            return parcel.centroid_lat, parcel.centroid_lng, parcel.land_area_sqw
        return None, None, None
    
    print("Seeding Lease Contracts (synced with Shapefile parcels)...")
    # 2. Seed Lease Contracts
    
    # สัญญา 1: อุดรธานี (ไม่มี shapefile — ใช้พิกัดเดิม)
    contract1 = await db.leasecontract.create(
        data={
            "contract_number": "TRD-66-001",
            "lessee_thaid_id": "1123456789012",  # Somchai
            "parcel_number": "อด.1234",
            "location_lat": 17.4138,
            "location_lng": 102.7872,
            "province": "อุดรธานี",
            "district": "เมืองอุดรธานี",
            "sub_district": "หมากแข้ง",
            "land_area_sqw": 120.0,
            "is_active": True
        }
    )
    
    # สัญญา 2: ขอนแก่น (ไม่มี shapefile — ใช้พิกัดเดิม)
    contract2 = await db.leasecontract.create(
        data={
            "contract_number": "TRD-66-002",
            "lessee_thaid_id": "2123456789012",  # Somying
            "parcel_number": "ขก.5678",
            "location_lat": 16.4322,
            "location_lng": 102.8236,
            "province": "ขอนแก่น",
            "district": "เมืองขอนแก่น",
            "sub_district": "ในเมือง",
            "land_area_sqw": 80.0,
            "is_active": True
        }
    )
    
    # สัญญา 3: หนองคาย — ใช้แปลงจริง นค.1507 (ใกล้ศูนย์กลางเมือง, 3677 ตร.ว.)
    lat3, lng3, area3 = await get_parcel_coords("นค.1507")
    contract3 = await db.leasecontract.create(
        data={
            "contract_number": "TRD-66-003",
            "lessee_thaid_id": "1123456789012",  # Somchai
            "parcel_number": "นค.1507",
            "location_lat": lat3 or 17.8783,
            "location_lng": lng3 or 102.7412,
            "province": "หนองคาย",
            "district": "เมืองหนองคาย",
            "sub_district": "ในเมือง",
            "land_area_sqw": area3 or 150.0,
            "is_active": True
        }
    )
    print(f"  Contract 3 (นค.1507): lat={lat3}, lng={lng3}, area={area3}")
    
    # สัญญา 4: หนองคาย — ใช้แปลง นค.1509 (ขนาดใหญ่ 6263 ตร.ว. ใกล้ศูนย์เมือง)
    lat4, lng4, area4 = await get_parcel_coords("นค.1509")
    contract4 = await db.leasecontract.create(
        data={
            "contract_number": "TRD-66-004",
            "lessee_thaid_id": "2123456789012",  # Somying
            "parcel_number": "นค.1509",
            "location_lat": lat4 or 17.875,
            "location_lng": lng4 or 102.742,
            "province": "หนองคาย",
            "district": "เมืองหนองคาย",
            "sub_district": "ในเมือง",
            "land_area_sqw": area4 or 200.0,
            "is_active": True
        }
    )
    print(f"  Contract 4 (นค.1509): lat={lat4}, lng={lng4}, area={area4}")

    # สัญญา 5: หนองคาย — ใช้แปลง นค.1496 (ขนาด 1030 ตร.ว.)
    lat5, lng5, area5 = await get_parcel_coords("นค.1496")
    contract5 = await db.leasecontract.create(
        data={
            "contract_number": "TRD-66-005",
            "lessee_thaid_id": "1123456789012",  # Somchai
            "parcel_number": "นค.1496",
            "location_lat": lat5 or 17.879,
            "location_lng": lng5 or 102.749,
            "province": "หนองคาย",
            "district": "เมืองหนองคาย",
            "sub_district": "ในเมือง",
            "land_area_sqw": area5 or 100.0,
            "is_active": True,
            "building_type": "บ้านพักอาศัย",
            "usable_area_sqm": 120.0,
            "zoning": "พื้นที่สีเหลือง (ที่อยู่อาศัยหนาแน่นน้อย)"
        }
    )
    print(f"  Contract 5 (นค.1496): lat={lat5}, lng={lng5}, area={area5}")

    # สัญญา 6: กาญจนบุรี
    contract6 = await db.leasecontract.create(
        data={
            "contract_number": "TRD-66-006",
            "lessee_thaid_id": "9123456789012",
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
            "zoning": "พื้นที่สีเหลือง (ที่อยู่อาศัยหนาแน่นน้อย)"
        }
    )

    # สัญญา 7: กาญจนบุรี
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
            "zoning": "พื้นที่สีเขียว (ชนบทและเกษตรกรรม)"
        }
    )

    # สัญญา 8: หนองบัวลำภู
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
            "zoning": "พื้นที่สีเขียว (ชนบทและเกษตรกรรม)"
        }
    )

    # สัญญา 9: หนองบัวลำภู
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
            "zoning": "พื้นที่สีแดง (พาณิชยกรรม)"
        }
    )
    
    print("Seeding Listings...")
    # 3. Seed active Listings
    await db.listing.create(
        data={
            "sellerId": user_somchai.id,
            "contractId": contract1.id,
            "asking_price": 1500000.0,
            "estimated_fee": 45000.0,
            "description": "สิทธิ์การเช่าที่ดินเพื่อการพาณิชย์ ทำเลทองเมืองอุดรธานี ใกล้เซ็นทรัลอุดรธานี เหมาะทำร้านค้าหรือสำนักงานขนาดเล็ก",
            "image_urls": ["https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=800"],
            "status": ListingStatus.ACTIVE.value
        }
    )
    
    await db.listing.create(
        data={
            "sellerId": user_somying.id,
            "contractId": contract2.id,
            "asking_price": 980000.0,
            "estimated_fee": 29400.0,
            "description": "แปลงที่ดินราชพัสดุในเมืองขอนแก่น ทำเลพักอาศัย เงียบสงบ ใกล้วัดหนองแวงและบึงแก่นนคร เดินทางสะดวกมีสาธารณูปโภคครบครัน",
            "image_urls": ["https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?w=800"],
            "status": ListingStatus.ACTIVE.value
        }
    )

    await db.listing.create(
        data={
            "sellerId": user_somchai.id,
            "contractId": contract3.id,
            "asking_price": 2400000.0,
            "estimated_fee": 72000.0,
            "description": "สิทธิ์การเช่าระยะยาวใกล้ริมแม่น้ำโขง เมืองหนองคาย เหมาะสำหรับทำร้านอาหารหรือโฮมสเตย์รองรับนักท่องเที่ยวริมโขงและตลาดท่าเสด็จ",
            "image_urls": ["https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=800"],
            "status": ListingStatus.ACTIVE.value
        }
    )
    
    await db.listing.create(
        data={
            "sellerId": user_somying.id,
            "contractId": contract4.id,
            "asking_price": 3800000.0,
            "estimated_fee": 114000.0,
            "description": "แปลงที่ดินขนาดใหญ่ใจกลางเมืองหนองคาย เหมาะสำหรับพัฒนาโครงการอาคารพาณิชย์หรือคอนโดมิเนียมรองรับเขตเศรษฐกิจพิเศษ",
            "image_urls": ["https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800"],
            "status": ListingStatus.ACTIVE.value
        }
    )
    
    await db.listing.create(
        data={
            "sellerId": user_somchai.id,
            "contractId": contract5.id,
            "asking_price": 1200000.0,
            "estimated_fee": 36000.0,
            "description": "ที่ดินราชพัสดุทำเลดี ใกล้ถนนสายหลัก เหมาะทำที่พักอาศัยหรือร้านค้าขนาดเล็ก สภาพแวดล้อมดี มีสาธารณูปโภคครบ",
            "image_urls": ["https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=800"],
            "status": ListingStatus.ACTIVE.value
        }
    )

    await db.listing.create(
        data={
            "sellerId": user_somchai.id,
            "contractId": contract6.id,
            "asking_price": 1250000.0,
            "estimated_fee": 37500.0,
            "description": "สิทธิ์การเช่าที่ดินพร้อมสิ่งปลูกสร้างสไตล์บ้านพักอาศัย บรรยากาศร่มรื่นใกล้แม่น้ำแคว เดินทางเข้าเมืองกาญจนบุรีสะดวกมาก",
            "image_urls": ["https://images.unsplash.com/photo-1580587771525-78b9dba3b914?w=800"],
            "status": ListingStatus.ACTIVE.value
        }
    )

    await db.listing.create(
        data={
            "sellerId": user_somchai.id,
            "contractId": contract7.id,
            "asking_price": 450000.0,
            "estimated_fee": 13500.0,
            "description": "ที่ดินเปล่าผืนใหญ่ในอำเภอไทรโยค ทำเลติดธรรมชาติ เหมาะสำหรับการเกษตรกรรมท่องเที่ยวเชิงอนุรักษ์ โฮมสเตย์ หรือแคมป์ปิ้งพักผ่อน",
            "image_urls": ["https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=800"],
            "status": ListingStatus.ACTIVE.value
        }
    )

    await db.listing.create(
        data={
            "sellerId": user_somying.id,
            "contractId": contract8.id,
            "asking_price": 350000.0,
            "estimated_fee": 10500.0,
            "description": "แปลงที่ราชพัสดุแปลงว่างเปล่าในหนองบัวลำภู พื้นที่ดินดำอุดมสมบูรณ์ เหมาะสำหรับการทำเกษตรกรรมยั่งยืน หรือสร้างโซลาร์ฟาร์มชุมชน",
            "image_urls": ["https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=800"],
            "status": ListingStatus.ACTIVE.value
        }
    )

    await db.listing.create(
        data={
            "sellerId": user_somchai.id,
            "contractId": contract9.id,
            "asking_price": 1100000.0,
            "estimated_fee": 33000.0,
            "description": "อาคารพาณิชย์สองชั้นใจกลางชุมชนอำเภอศรีบุญเรือง เหมาะทำเป็นหน้าร้านค้าขายปลีก ร้านกาแฟ หรือสำนักงานตัวแทนท้องถิ่น",
            "image_urls": ["https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800"],
            "status": ListingStatus.ACTIVE.value
        }
    )

    print("Database seeding completed successfully!")
    await db.disconnect()

if __name__ == "__main__":
    asyncio.run(main())
