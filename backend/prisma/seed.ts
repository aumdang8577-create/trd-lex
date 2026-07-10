import { PrismaClient, Role, ListingStatus } from '@prisma/client';
import * as fs from 'fs';
import * as path from 'path';

// Load .env file from root directory
const envPath = path.join(__dirname, '../../.env');
if (fs.existsSync(envPath)) {
  const envContent = fs.readFileSync(envPath, 'utf-8');
  for (const line of envContent.split(/\r?\n/)) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) continue;
    const firstEq = trimmed.indexOf('=');
    if (firstEq === -1) continue;
    const key = trimmed.substring(0, firstEq).trim();
    let val = trimmed.substring(firstEq + 1).trim();
    if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) {
      val = val.slice(1, -1);
    }
    process.env[key] = val;
  }
}

const prisma = new PrismaClient();

// Deterministic mock Thai ID generator
function generateThaiIdFromName(name: string): string {
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  const idNum = (Math.abs(hash) % 9000000000000) + 1000000000000;
  // Standard citizen IDs in Thailand often start with 3
  return `3${idNum.toString().slice(1)}`;
}

// Returns a random offset within a given degree radius (default 0.03 degrees, approx 3-5 km)
function getRandomOffset(radius = 0.03): number {
  return (Math.random() - 0.5) * radius * 2;
}

// Infer building details based on lessee name
function inferBuildingDetails(lesseeName: string, landAreaSqw: number): { buildingType: string; usableAreaSqm: number; zoning: string } {
  const name = lesseeName.toLowerCase();
  
  if (name.includes('โรงงาน') || name.includes('แปรรูป') || name.includes('อุตสาหกรรม')) {
    return {
      buildingType: 'โรงงาน/คลังสินค้า',
      usableAreaSqm: Math.round(landAreaSqw * 4 * 0.6), // Assume 60% building coverage
      zoning: 'พื้นที่สีม่วง (อุตสาหกรรม)'
    };
  } else if (
    name.includes('อาคาร') || 
    name.includes('คูหา') || 
    name.includes('ตึก') || 
    name.includes('หจก') || 
    name.includes('บจก') || 
    name.includes('สมาคม') || 
    name.includes('สหกรณ์') || 
    name.includes('บริษัท') || 
    name.includes('ตลาด') || 
    name.includes('complex')
  ) {
    return {
      buildingType: 'อาคารพาณิชย์',
      usableAreaSqm: Math.round(landAreaSqw * 4 * 1.2), // Assume 2-3 stories
      zoning: 'พื้นที่สีแดง (พาณิชยกรรม)'
    };
  } else if (name.includes('นาย') || name.includes('นาง') || name.includes('เด็ก')) {
    return {
      buildingType: 'บ้านพักอาศัย',
      usableAreaSqm: Math.round(landAreaSqw * 4 * 0.4), // Assume 40% building coverage
      zoning: 'พื้นที่สีเหลือง (ที่อยู่อาศัยหนาแน่นน้อย)'
    };
  } else {
    // Default to vacant land if it's reserved, public area, or empty
    return {
      buildingType: 'ที่ดินเปล่า',
      usableAreaSqm: 0,
      zoning: 'พื้นที่สีเขียว (เกษตรกรรม)'
    };
  }
}

// District center coordinates mapping
const districtCoords: Record<string, { lat: number; lng: number }> = {
  'กรุงเทพมหานคร_พระนคร': { lat: 13.7563, lng: 100.5018 },
  'ชลบุรี_บางละมุง': { lat: 12.9236, lng: 100.8824 },
  'ชลบุรี_ศรีราชา': { lat: 13.1111, lng: 100.9999 },
  'นครนายก_เมืองนครนายก': { lat: 14.2069, lng: 101.1965 },
  'อุดรธานี_กุมภวาปี': { lat: 17.1147, lng: 103.0181 },
  'ขอนแก่น_เมืองขอนแก่น': { lat: 16.4322, lng: 102.8236 },
  'สุโขทัย_เมืองสุโขทัย': { lat: 17.0071, lng: 99.8262 },
  'อุดรธานี_หนองวัวซอ': { lat: 17.1654, lng: 102.5886 },
  'หนองคาย_เมืองหนองคาย': { lat: 17.8785, lng: 102.7423 },
  'บึงกาฬ_เมืองบึงกาฬ': { lat: 18.3614, lng: 103.6534 },
  'สมุทรปราการ_บางพลี': { lat: 13.6050, lng: 100.7067 },
  'เชียงใหม่_เมืองเชียงใหม่': { lat: 18.7883, lng: 98.9853 },
};

// Robust CSV parser function
function parseCSV(content: string): string[][] {
  const result: string[][] = [];
  let row: string[] = [];
  let cell = '';
  let inQuotes = false;

  for (let i = 0; i < content.length; i++) {
    const char = content[i];
    const nextChar = content[i + 1];

    if (inQuotes) {
      if (char === '"') {
        if (nextChar === '"') {
          cell += '"';
          i++; // Skip next quote
        } else {
          inQuotes = false;
        }
      } else {
        cell += char;
      }
    } else {
      if (char === '"') {
        inQuotes = true;
      } else if (char === ',') {
        row.push(cell);
        cell = '';
      } else if (char === '\n' || char === '\r') {
        if (char === '\r' && nextChar === '\n') {
          i++;
        }
        row.push(cell);
        result.push(row);
        row = [];
        cell = '';
      } else {
        cell += char;
      }
    }
  }

  if (cell !== '' || row.length > 0) {
    row.push(cell);
    result.push(row);
  }

  return result;
}

async function main() {
  console.log('Cleaning database...');
  // Clean up data in reverse order of relationships
  await prisma.listing.deleteMany();
  await prisma.leaseContract.deleteMany();
  await prisma.user.deleteMany();

  console.log('Seeding default users...');
  const userSomchai = await prisma.user.create({
    data: {
      thaid_id: '1123456789012',
      first_name: 'สมชาย',
      last_name: 'ใจดี',
      phone_number: '0812345678',
      role: Role.USER,
    },
  });

  const userSomying = await prisma.user.create({
    data: {
      thaid_id: '2123456789012',
      first_name: 'สมหญิง',
      last_name: 'รักดี',
      phone_number: '0898765432',
      role: Role.USER,
    },
  });

  const userAdmin = await prisma.user.create({
    data: {
      thaid_id: '9123456789012',
      first_name: 'แอดมิน',
      last_name: 'ธนารักษ์',
      phone_number: '021234567',
      role: Role.ADMIN,
    },
  });

  console.log('Seeding default lease contracts...');
  const contract1 = await prisma.leaseContract.create({
    data: {
      contract_number: 'TRD-66-001',
      lessee_thaid_id: '1123456789012', // Somchai
      parcel_number: 'กท.1234',
      location_lat: 13.7563,
      location_lng: 100.5018,
      province: 'กรุงเทพมหานคร',
      district: 'พระนคร',
      sub_district: 'วัดราชบพิธ',
      land_area_sqw: 50.0,
      is_active: true,
      building_type: 'อาคารพาณิชย์',
      usable_area_sqm: 120.0,
      zoning: 'พื้นที่สีแดง (พาณิชยกรรม)',
    },
  });

  const contract2 = await prisma.leaseContract.create({
    data: {
      contract_number: 'TRD-66-002',
      lessee_thaid_id: '2123456789012', // Somying
      parcel_number: 'ชบ.5678',
      location_lat: 12.9236,
      location_lng: 100.8824,
      province: 'ชลบุรี',
      district: 'บางละมุง',
      sub_district: 'หนองปรือ',
      land_area_sqw: 120.0,
      is_active: true,
      building_type: 'บ้านพักอาศัย',
      usable_area_sqm: 180.0,
      zoning: 'พื้นที่สีเหลือง (ที่อยู่อาศัยหนาแน่นน้อย)',
    },
  });

  const contract3 = await prisma.leaseContract.create({
    data: {
      contract_number: 'TRD-66-003',
      lessee_thaid_id: '1123456789012', // Somchai (Inactive)
      parcel_number: 'ชบ.9999',
      location_lat: 13.1111,
      location_lng: 100.9999,
      province: 'ชลบุรี',
      district: 'ศรีราชา',
      sub_district: 'ศรีราชา',
      land_area_sqw: 80.0,
      is_active: false,
      building_type: 'ที่ดินเปล่า',
      usable_area_sqm: 0.0,
      zoning: 'พื้นที่สีเขียว (เกษตรกรรม)',
    },
  });

  console.log('Seeding default listings...');
  await prisma.listing.create({
    data: {
      sellerId: userSomchai.id,
      contractId: contract1.id,
      asking_price: 500000.0,
      estimated_fee: 15000.0,
      description: 'สิทธิ์การเช่าที่ดินราชพัสดุทำเลทอง ใจกลางกรุงเทพฯ ใกล้ MRT พระนคร เหมาะกับการเปิดร้านอาหารหรือร้านกาแฟ',
      image_urls: ['https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=800'],
      status: ListingStatus.ACTIVE,
    },
  });

  await prisma.listing.create({
    data: {
      sellerId: userSomying.id,
      contractId: contract2.id,
      asking_price: 1200000.0,
      estimated_fee: 36000.0,
      description: 'ที่ดินแปลงสวยในอำเภอบางละมุง พัทยา ชลบุรี เหมาะสำหรับทำที่พักอาศัยหรือพัฒนาธุรกิจส่วนตัว เดินทางสะดวกมีสาธารณูปโภคครบครัน',
      image_urls: ['https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=800'],
      status: ListingStatus.ACTIVE,
    },
  });

  // Reading the CSV file
  const csvPath = 'C:\\TRD_lex\\datatest.csv';
  console.log(`Reading CSV file from ${csvPath}...`);

  if (!fs.existsSync(csvPath)) {
    throw new Error(`CSV file not found at ${csvPath}`);
  }

  const fileContent = fs.readFileSync(csvPath, 'utf-8');
  const parsedRows = parseCSV(fileContent);

  // Headers: ลำดับ,เลขที่ราชพัสดุ,เลขที่สัญญา,ชื่อผู้เช่า/หน่วยงานครอบครอง,จังหวัด,อำเภอ,ตำบล,เนื้อที่ (ตร.ว.),สถานะ
  const rows = parsedRows.slice(1);

  console.log(`Found ${rows.length} rows to seed.`);

  let successCount = 0;
  for (const row of rows) {
    if (row.length < 9 || !row[1] || !row[2]) {
      continue; // Skip invalid rows
    }

    const parcelNumber = row[1].trim();
    const contractNumber = row[2].trim();
    const lesseeName = row[3].trim();
    const province = row[4].trim();
    const district = row[5].trim();
    const subDistrict = row[6].trim();
    const landAreaRaw = row[7].trim().replace(/,/g, '');
    const landAreaSqw = parseFloat(landAreaRaw) || 0;
    const status = row[8].trim().toUpperCase();

    // Map status to isActive
    // If status is ACTIVE or SOLD, is_active is true. If HIDDEN, is_active is false.
    const isActive = status !== 'HIDDEN';

    // Generate deterministic mock Thai ID and name parts for the lessee
    const thaidId = generateThaiIdFromName(lesseeName);
    const nameParts = lesseeName.split(/\s+/);
    const firstName = nameParts[0] || lesseeName;
    const lastName = nameParts.slice(1).join(' ') || '-';

    // Geolocation mapping with random offsets within the district
    const districtKey = `${province}_${district}`;
    const baseCoords = districtCoords[districtKey] || districtCoords[`${province}_เมือง${province}`] || { lat: 13.7563, lng: 100.5018 }; // Default to Bangkok
    const locationLat = baseCoords.lat + getRandomOffset(0.03);
    const locationLng = baseCoords.lng + getRandomOffset(0.03);

    // Infer building details based on lessee name
    const { buildingType, usableAreaSqm, zoning } = inferBuildingDetails(lesseeName, landAreaSqw);

    // First ensure the User exists
    await prisma.user.upsert({
      where: { thaid_id: thaidId },
      update: {},
      create: {
        thaid_id: thaidId,
        first_name: firstName,
        last_name: lastName,
        role: Role.USER,
      },
    });

    // Upsert the LeaseContract
    await prisma.leaseContract.upsert({
      where: { contract_number: contractNumber },
      update: {
        lessee_thaid_id: thaidId,
        parcel_number: parcelNumber,
        location_lat: locationLat,
        location_lng: locationLng,
        province,
        district,
        sub_district: subDistrict,
        land_area_sqw: landAreaSqw,
        is_active: isActive,
        building_type: buildingType,
        usable_area_sqm: usableAreaSqm,
        zoning: zoning,
      },
      create: {
        contract_number: contractNumber,
        lessee_thaid_id: thaidId,
        parcel_number: parcelNumber,
        location_lat: locationLat,
        location_lng: locationLng,
        province,
        district,
        sub_district: subDistrict,
        land_area_sqw: landAreaSqw,
        is_active: isActive,
        building_type: buildingType,
        usable_area_sqm: usableAreaSqm,
        zoning: zoning,
      },
    });

    successCount++;
  }

  console.log(`Seeded ${successCount} lease contracts successfully from CSV.`);
  console.log('Database seeding completed successfully!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
