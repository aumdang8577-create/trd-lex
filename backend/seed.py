import asyncio
import csv
import os
import random
import hashlib
from prisma import Prisma

# Enums
ROLE_USER = "USER"
ROLE_ADMIN = "ADMIN"
STATUS_ACTIVE = "ACTIVE"

# District coordinates mapping
district_coords = {
    'กรุงเทพมหานคร_พระนคร': {'lat': 13.7563, 'lng': 100.5018},
    'ชลบุรี_บางละมุง': {'lat': 12.9236, 'lng': 100.8824},
    'ชลบุรี_ศรีราชา': {'lat': 13.1111, 'lng': 100.9999},
    'นครนายก_เมืองนครนายก': {'lat': 14.2069, 'lng': 101.1965},
    'อุดรธานี_กุมภวาปี': {'lat': 17.1147, 'lng': 103.0181},
    'ขอนแก่น_เมืองขอนแก่น': {'lat': 16.4322, 'lng': 102.8236},
    'สุโขทัย_เมืองสุโขทัย': {'lat': 17.0071, 'lng': 99.8262},
    'อุดรธานี_หนองวัวซอ': {'lat': 17.1654, 'lng': 102.5886},
    'หนองคาย_เมืองหนองคาย': {'lat': 17.8785, 'lng': 102.7423},
    'บึงกาฬ_เมืองบึงกาฬ': {'lat': 18.3614, 'lng': 103.6534},
    'สมุทรปราการ_บางพลี': {'lat': 13.6050, 'lng': 100.7067},
    'เชียงใหม่_เมืองเชียงใหม่': {'lat': 18.7883, 'lng': 98.9853},
}

residential_images = [
    "/images/images (1).jpg",
    "/images/images (2).jpg",
    "/images/images (3).jpg",
    "/images/images (4).jpg",
    "/images/images (5).jpg",
    "/images/images (6).jpg"
]
commercial_images = [
    "/images/images (7).jpg",
    "/images/images (8).jpg",
    "/images/images (9).jpg",
    "/images/images (10).jpg",
    "/images/images (11).jpg",
    "/images/images (12).jpg"
]
industrial_images = [
    "/images/images (13).jpg",
    "/images/images (14).jpg",
    "/images/images (15).jpg",
    "/images/images (16).jpg",
    "/images/images (17).jpg",
    "/images/images (18).jpg"
]
vacant_images = [
    "/images/images (19).jpg",
    "/images/images (20).jpg",
    "/images/images (21).jpg",
    "/images/images (22).jpg",
    "/images/images (23).jpg",
    "/images/images.jpg",
    "/images/dszfgdrhtrj.jpg",
    "/images/esdgdxfh.jpg"
]

def generate_thai_id(name: str) -> str:
    h = hashlib.md5(name.encode('utf-8')).hexdigest()
    val = int(h, 16) % 9000000000000 + 1000000000000
    return f"3{str(val)[1:]}"

def get_random_offset(radius=0.02):
    return (random.random() - 0.5) * radius * 2

def infer_building_details(lessee_name: str, land_area_sqw: float):
    name = lessee_name.lower()
    if any(x in name for x in ['โรงงาน', 'แปรรูป', 'อุตสาหกรรม']):
        return {
            "building_type": "โรงงาน/คลังสินค้า",
            "usable_area_sqm": float(round(land_area_sqw * 4 * 0.6)),
            "zoning": "พื้นที่สีม่วง (อุตสาหกรรม)"
        }
    elif any(x in name for x in ['อาคาร', 'คูหา', 'ตึก', 'หจก', 'บจก', 'สมาคม', 'สหกรณ์', 'บริษัท', 'ตลาด', 'complex']):
        return {
            "building_type": "อาคารพาณิชย์",
            "usable_area_sqm": float(round(land_area_sqw * 4 * 1.2)),
            "zoning": "พื้นที่สีแดง (พาณิชยกรรม)"
        }
    elif any(x in name for x in ['นาย', 'นาง', 'เด็ก', 'นางสาว']):
        return {
            "building_type": "บ้านพักอาศัย",
            "usable_area_sqm": float(round(land_area_sqw * 4 * 0.4)),
            "zoning": "พื้นที่สีเหลือง (ที่อยู่อาศัยหนาแน่นน้อย)"
        }
    else:
        return {
            "building_type": "ที่ดินเปล่า",
            "usable_area_sqm": 0.0,
            "zoning": "พื้นที่สีเขียว (เกษตรกรรม)"
        }

def parse_area(area_str: str) -> float:
    return float(area_str.replace('"', '').replace(',', '').strip())

def get_asking_price(building_type: str, land_area: float) -> float:
    if building_type == "โรงงาน/คลังสินค้า":
        multiplier = 15000
    elif building_type == "อาคารพาณิชย์":
        multiplier = 20000
    elif building_type == "บ้านพักอาศัย":
        multiplier = 8000
    else:
        multiplier = 2000
    base = land_area * multiplier * random.uniform(0.95, 1.15)
    return float(round(base / 10000) * 10000)

def generate_description(province: str, district: str, sub_district: str, land_area: float, building_type: str) -> str:
    if building_type == "อาคารพาณิชย์":
        return f"สิทธิ์การเช่าอาคารพาณิชย์ ทำเลดีในย่านชุมชน {sub_district} อำเภอ{district} จังหวัด{province} เนื้อที่ {land_area} ตร.ว. เหมาะสำหรับเปิดร้านค้า สำนักงาน หรือโชว์รูม เดินทางสะดวกติดถนนใหญ่สภาพแวดล้อมดีเยี่ยม"
    elif building_type == "บ้านพักอาศัย":
        return f"สิทธิ์การเช่าที่ดินพร้อมสิ่งปลูกสร้างบ้านพักอาศัย บรรยากาศเงียบสงบในพื้นที่ {sub_district} อำเภอ{district} จังหวัด{province} เนื้อที่ {land_area} ตร.ว. สภาพแวดล้อมดี ปลอดภัย เหมาะสำหรับครอบครัวหรือทำบ้านพักตากอากาศ"
    elif building_type == "โรงงาน/คลังสินค้า":
        return f"สิทธิ์การเช่าคลังสินค้าโรงงานอุตสาหกรรม โครงสร้างแข็งแรงในพื้นที่ {sub_district} อำเภอ{district} จังหวัด{province} เนื้อที่ {land_area} ตร.ว. รองรับการผลิต จัดเก็บสินค้า และการกระจายสินค้า มีทางเข้าออกสำหรับรถบรรทุกสะดวกสบาย"
    else:
        return f"แปลงที่ดินเปล่าราชพัสดุในทำเลศักยภาพ {sub_district} อำเภอ{district} จังหวัด{province} เนื้อที่ {land_area} ตร.ว. ดินดี น้ำอุดมสมบูรณ์ เหมาะสำหรับทำเกษตรกรรม หรือพัฒนาโครงการเชิงพาณิชย์และที่อยู่อาศัย"

async def main():
    db = Prisma()
    await db.connect()
    
    print("Cleaning database...")
    await db.listing.delete_many()
    await db.leasecontract.delete_many()
    await db.user.delete_many()
    
    print("Creating core default users...")
    # Standard test users mapping
    default_users = [
        {"thaid_id": "1123456789012", "first_name": "สมชาย", "last_name": "ใจดี", "phone_number": "0812345678", "role": ROLE_USER},
        {"thaid_id": "2123456789012", "first_name": "สมหญิง", "last_name": "รักดี", "phone_number": "0898765432", "role": ROLE_USER},
        {"thaid_id": "3123456789012", "first_name": "ประยุทธ์", "last_name": "มั่งมี", "phone_number": "0811112222", "role": ROLE_USER},
        {"thaid_id": "9123456789012", "first_name": "แอดมิน", "last_name": "ธนารักษ์", "phone_number": "021234567", "role": ROLE_ADMIN}
    ]
    
    user_map = {}
    for user_data in default_users:
        user = await db.user.create(data=user_data)
        user_map[user_data["thaid_id"]] = user

    # Locate CSV file
    csv_paths = ["../datatest.csv", "datatest.csv", "backend/datatest.csv", "./datatest.csv"]
    csv_file = None
    for path in csv_paths:
        if os.path.exists(path):
            csv_file = path
            break
            
    if not csv_file:
        print("ERROR: datatest.csv not found!")
        await db.disconnect()
        return
        
    print(f"Reading data from: {csv_file}")
    
    listings_count = 0
    with open(csv_file, mode='r', encoding='utf-8-sig') as f:
        reader = csv.DictReader(f)
        
        for row in reader:
            if listings_count >= 20:
                break
                
            status = row.get("สถานะ", "").strip()
            # Only import active listings to get 20 declarations
            if status != STATUS_ACTIVE:
                continue
                
            lessee_full = row.get("ชื่อผู้เช่า/หน่วยงานครอบครอง", "").strip()
            if not lessee_full:
                continue
                
            # Parse names
            names = lessee_full.split(" ", 1)
            first_name = names[0]
            last_name = names[1] if len(names) > 1 else ""
            
            # Generate or find user
            thaid_id = generate_thai_id(lessee_full)
            # To ensure standard test credentials work, map first few to standard accounts
            if listings_count == 0:
                thaid_id = "1123456789012"
            elif listings_count == 1:
                thaid_id = "2123456789012"
            elif listings_count == 2:
                thaid_id = "3123456789012"
                
            if thaid_id in user_map:
                seller = user_map[thaid_id]
            else:
                seller = await db.user.create(
                    data={
                        "thaid_id": thaid_id,
                        "first_name": first_name,
                        "last_name": last_name,
                        "phone_number": f"08{random.randint(10000000, 99999999)}",
                        "role": ROLE_USER
                    }
                )
                user_map[thaid_id] = seller
                
            # Contract attributes
            contract_num = row.get("เลขที่สัญญา", "").strip()
            parcel_num = row.get("เลขที่ราชพัสดุ", "").strip()
            province = row.get("จังหวัด", "").strip()
            district = row.get("อำเภอ", "").strip()
            sub_district = row.get("ตำบล", "").strip()
            land_area = parse_area(row.get("เนื้อที่ (ตร.ว.)", "0"))
            
            # Location Mapping
            loc_key = f"{province}_{district}"
            coords = district_coords.get(loc_key, {'lat': 13.7563, 'lng': 100.5018})
            lat = coords['lat'] + get_random_offset()
            lng = coords['lng'] + get_random_offset()
            
            # Building details mapping
            bld_info = infer_building_details(lessee_full, land_area)
            building_type = bld_info["building_type"]
            usable_area_sqm = bld_info["usable_area_sqm"]
            zoning = bld_info["zoning"]
            
            # Create contract
            contract = await db.leasecontract.create(
                data={
                    "contract_number": contract_num,
                    "lessee_thaid_id": thaid_id,
                    "parcel_number": parcel_num,
                    "location_lat": lat,
                    "location_lng": lng,
                    "province": province,
                    "district": district,
                    "sub_district": sub_district,
                    "land_area_sqw": land_area,
                    "is_active": True,
                    "building_type": building_type,
                    "usable_area_sqm": usable_area_sqm,
                    "zoning": zoning,
                    "annual_rent": 12000.0
                }
            )
            
            # Generate pricing & description
            asking_price = get_asking_price(building_type, land_area)
            estimated_fee = asking_price * 0.03
            description = generate_description(province, district, sub_district, land_area, building_type)
            
            # Image picker
            if building_type == "อาคารพาณิชย์":
                images = commercial_images
            elif building_type == "โรงงาน/คลังสินค้า":
                images = industrial_images
            elif building_type == "บ้านพักอาศัย":
                images = residential_images
            else:
                images = vacant_images
                
            img_url = random.choice(images)
            
            # Create listing
            listings_count += 1
            await db.listing.create(
                data={
                    "id": f"list-{listings_count}",
                    "sellerId": seller.id,
                    "contractId": contract.id,
                    "asking_price": asking_price,
                    "estimated_fee": estimated_fee,
                    "description": description,
                    "image_urls": [img_url],
                    "status": STATUS_ACTIVE
                }
            )
            
            print(f"Seeded #{listings_count}: {contract_num} in {district}, {province} for {lessee_full}")

    print(f"Successfully seeded {listings_count} active listings from CSV!")
    await db.disconnect()

if __name__ == "__main__":
    asyncio.run(main())
