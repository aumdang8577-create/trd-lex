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

# District coordinates mapping fallback
district_coords = {
    'กรุงเทพมหานคร_พระนคร': {'lat': 13.7563, 'lng': 100.5018},
    'ชลบุรี_บางละมุง': {'lat': 12.9236, 'lng': 100.8824},
    'ชลบุรี_ศรีราชา': {'lat': 13.1111, 'lng': 100.9999},
    'นครนายก_เมืองนครนายก': {'lat': 14.2069, 'lng': 101.1965},
    'อุดรธานี_กุมภวาปี': {'lat': 17.1147, 'lng': 103.0181},
    'อุดรธานี_เมืองอุดรธานี': {'lat': 17.4037, 'lng': 102.7895},
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

def parse_float(val, default=0.0) -> float:
    if val is None:
        return default
    s = str(val).replace('"', '').replace(',', '').strip()
    if not s:
        return default
    try:
        return float(s)
    except ValueError:
        return default

def parse_int(val, default=None):
    if val is None:
        return default
    s = str(val).replace('"', '').replace(',', '').strip()
    if not s:
        return default
    try:
        return int(float(s))
    except ValueError:
        return default

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

def get_asking_price(building_type: str, land_area: float) -> float:
    if building_type == "โรงงาน/คลังสินค้า":
        multiplier = 15000
    elif building_type == "อาคารพาณิชย์":
        multiplier = 20000
    elif building_type == "บ้านพักอาศัย":
        multiplier = 8000
    else:
        multiplier = 2000
    base = max(land_area, 10.0) * multiplier * random.uniform(0.95, 1.15)
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

    # Candidate CSV file paths
    csv_paths = [
        "data/data.csv",
        "../data/data.csv",
        "backend/data/data.csv",
        "c:/TRD_lex/data/data.csv",
        "./data.csv",
        "datatest.csv",
        "../datatest.csv"
    ]
    csv_file = None
    for path in csv_paths:
        if os.path.exists(path):
            csv_file = path
            break
            
    if not csv_file:
        print("ERROR: data.csv not found!")
        await db.disconnect()
        return
        
    print(f"Reading data from: {csv_file}")
    
    listings_count = 0
    contracts_count = 0
    
    with open(csv_file, mode='r', encoding='utf-8-sig') as f:
        reader = csv.DictReader(f)
        
        for row in reader:
            primary_key = row.get("PrimaryKey", "").strip()
            reg_id = row.get("REG_ID", "").strip()
            parcel_num = row.get("Land_No", "").strip()
            rent_cat = row.get("Rent", "").strip()
            rent_type = row.get("Rent_Type", "").strip()
            contract_num = row.get("Rent_Num", "").strip() or primary_key
            vpn_code = row.get("VPN_Code", "").strip()
            lessee_full = row.get("Rent_Name", "").strip() or row.get("ชื่อผู้เช่า/หน่วยงานครอบครอง", "").strip()
            
            if not contract_num and not primary_key:
                continue
                
            sub_district = row.get("Tambon", "").strip() or row.get("ตำบล", "").strip()
            district = row.get("Amphoe", "").strip() or row.get("อำเภอ", "").strip()
            province = row.get("Provice", "").strip() or row.get("Province", "").strip() or row.get("จังหวัด", "").strip()
            
            area_rai = parse_float(row.get("Area_Rai", "0"))
            area_ngan = parse_float(row.get("Area_Ngan", "0"))
            area_wa = parse_float(row.get("Area_Wa", "0"))
            land_area = parse_float(row.get("เนื้อที่ (ตร.ว.)", "0"))
            if land_area == 0:
                land_area = area_rai * 400.0 + area_ngan * 100.0 + area_wa
                
            lat = parse_float(row.get("Latitude", "0"))
            lng = parse_float(row.get("Longitude", "0"))
            
            if lat == 0 or lng == 0:
                loc_key = f"{province}_{district}"
                coords = district_coords.get(loc_key, {'lat': 17.4037, 'lng': 102.7895})
                lat = coords['lat'] + get_random_offset()
                lng = coords['lng'] + get_random_offset()
                
            land_plan = row.get("Land_Plan", "").strip()
            build_type = row.get("Build_Type", "").strip()
            building = row.get("Building", "").strip()
            build_area = parse_float(row.get("Build_Area", "0"))
            build_year = parse_int(row.get("Build_Year"))
            on_street = row.get("ON_Street", "").strip()
            street_t = row.get("Street_T", "").strip()
            street_w = parse_float(row.get("Street_W"))
            street_a = parse_float(row.get("Street_A"))
            land_w = parse_float(row.get("Land_Width"))
            land_ap = parse_float(row.get("Land_AP"))
            build_ap = parse_float(row.get("Build_AP"))
            status = row.get("Status", "ACTIVE").strip().upper()
            
            names = lessee_full.split(" ", 1) if lessee_full else ["ผู้เช่า", "ราชพัสดุ"]
            first_name = names[0]
            last_name = names[1] if len(names) > 1 else ""
            
            thaid_id = generate_thai_id(lessee_full) if lessee_full else f"3{random.randint(100000000000, 999999999999)}"
            
            # Map first 3 active contracts to core test accounts for easy testing
            if contracts_count == 0:
                thaid_id = "1123456789012"
            elif contracts_count == 1:
                thaid_id = "2123456789012"
            elif contracts_count == 2:
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
                
            bld_info = infer_building_details(lessee_full, land_area)
            building_type = build_type if build_type else bld_info["building_type"]
            usable_area_sqm = build_area if build_area > 0 else bld_info["usable_area_sqm"]
            zoning = land_plan if land_plan else bld_info["zoning"]
            
            contracts_count += 1
            
            # Create contract with all new columns
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
                    "is_active": (status != "HIDDEN"),
                    "building_type": building_type,
                    "usable_area_sqm": usable_area_sqm,
                    "zoning": zoning,
                    "annual_rent": 12000.0 if land_ap == 0 else float(land_ap),
                    
                    # Additional CSV fields
                    "primary_key": primary_key,
                    "reg_id": reg_id,
                    "rent_category": rent_cat,
                    "rent_type": rent_type,
                    "vpn_code": vpn_code,
                    "lessee_name": lessee_full,
                    "area_rai": area_rai,
                    "area_ngan": area_ngan,
                    "area_wa": area_wa,
                    "land_plan": land_plan,
                    "building_details": building,
                    "build_year": build_year,
                    "on_street": on_street,
                    "street_type": street_t,
                    "street_width": street_w,
                    "street_access": street_a,
                    "land_width": land_w,
                    "land_ap": land_ap,
                    "build_ap": build_ap
                }
            )
            
            # Create active listing for first 50 contracts or all active ones
            if status == STATUS_ACTIVE and listings_count < 60:
                asking_price = get_asking_price(building_type, land_area)
                estimated_fee = asking_price * 0.03
                description = generate_description(province, district, sub_district, land_area, building_type)
                
                if building_type == "อาคารพาณิชย์" or "ตึก" in building:
                    images = commercial_images
                elif "โรงงาน" in building_type or "คลัง" in building_type:
                    images = industrial_images
                elif "บ้าน" in building_type or "อาศัย" in building_type:
                    images = residential_images
                else:
                    images = vacant_images
                    
                img_url = random.choice(images)
                
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
                
        print(f"Successfully seeded {contracts_count} contracts and {listings_count} active listings from CSV!")
        await db.disconnect()

if __name__ == "__main__":
    asyncio.run(main())
