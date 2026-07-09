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
    
    print("Seeding Lease Contracts...")
    # 2. Seed Lease Contracts
    contract1 = await db.leasecontract.create(
        data={
            "contract_number": "TRD-66-001",
            "lessee_thaid_id": "1123456789012",  # Somchai
            "parcel_number": "กท.1234",
            "location_lat": 13.7563,
            "location_lng": 100.5018,
            "province": "กรุงเทพมหานคร",
            "district": "พระนคร",
            "sub_district": "วัดราชบพิธ",
            "land_area_sqw": 50.0,
            "is_active": True
        }
    )
    contract2 = await db.leasecontract.create(
        data={
            "contract_number": "TRD-66-002",
            "lessee_thaid_id": "2123456789012",  # Somying
            "parcel_number": "ชบ.5678",
            "location_lat": 12.9236,
            "location_lng": 100.8824,
            "province": "ชลบุรี",
            "district": "บางละมุง",
            "sub_district": "หนองปรือ",
            "land_area_sqw": 120.0,
            "is_active": True
        }
    )
    contract3 = await db.leasecontract.create(
        data={
            "contract_number": "TRD-66-003",
            "lessee_thaid_id": "1123456789012",  # Somchai (Inactive)
            "parcel_number": "ชบ.9999",
            "location_lat": 13.1111,
            "location_lng": 100.9999,
            "province": "ชลบุรี",
            "district": "ศรีราชา",
            "sub_district": "ศรีราชา",
            "land_area_sqw": 80.0,
            "is_active": False
        }
    )
    
    print("Seeding Listings...")
    # 3. Seed active Listings
    await db.listing.create(
        data={
            "sellerId": user_somchai.id,
            "contractId": contract1.id,
            "asking_price": 500000.0,
            "estimated_fee": 15000.0,
            "description": "สิทธิ์การเช่าที่ดินราชพัสดุทำเลทอง ใจกลางกรุงเทพฯ ใกล้ MRT พระนคร เหมาะกับการเปิดร้านอาหารหรือร้านกาแฟ",
            "image_urls": ["https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=800"],
            "status": ListingStatus.ACTIVE.value
        }
    )
    
    await db.listing.create(
        data={
            "sellerId": user_somying.id,
            "contractId": contract2.id,
            "asking_price": 1200000.0,
            "estimated_fee": 36000.0,
            "description": "ที่ดินแปลงสวยในอำเภอบางละมุง พัทยา ชลบุรี เหมาะสำหรับทำที่พักอาศัยหรือพัฒนาธุรกิจส่วนตัว เดินทางสะดวกมีสาธารณูปโภคครบครัน",
            "image_urls": ["https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=800"],
            "status": ListingStatus.ACTIVE.value
        }
    )

    print("Database seeding completed successfully!")
    await db.disconnect()

if __name__ == "__main__":
    asyncio.run(main())
