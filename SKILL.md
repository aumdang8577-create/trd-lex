# Project: TRD Lease Exchange (TRD-LEX)
**Description:** แพลตฟอร์มตลาดรองเพื่อการเปลี่ยนมือสิทธิการเช่าที่ราชพัสดุ
**Architecture Pattern:** Two-Sided Marketplace (B2C / C2C)
**Design Theme:** "Smart & Sustainable Treasury"

---

## 1. Two-Sided Marketplace Dynamics (โครงสร้างตลาดสองด้าน)

### ฝั่งอุปทาน (Supply Side: ผู้เช่าเดิม/ผู้เสนอขาย)
* **เป้าหมาย:** ต้องการส่งต่อสิทธิการเช่าที่ไม่ได้ใช้ประโยชน์เพื่อเปลี่ยนเป็นสภาพคล่อง
* **สิ่งที่ระบบต้องรองรับ:** การยืนยันตัวตนที่รัดกุม การตรวจสอบสถานะสัญญาเช่าที่แม่นยำ และเครื่องมือในการสร้างประกาศที่ใช้งานง่าย

### ฝั่งอุปสงค์ (Demand Side: นักลงทุน/ผู้ซื้อ)
* **เป้าหมาย:** ต้องการค้นหาพื้นที่ทำเลศักยภาพที่ถูกต้องตามกฎหมายและตรวจสอบได้
* **สิ่งที่ระบบต้องรองรับ:** เครื่องมือค้นหาเชิงพื้นที่ (Map-based Search) การแสดงรายละเอียดที่โปร่งใส และการจำลองค่าธรรมเนียมเบื้องต้น

---

## 2. Tech Stack Requirements

* **Frontend Framework:** Next.js (App Router) สำหรับทำ SEO หน้าประกาศให้ติดอันดับการค้นหา
* **Frontend Styling:** Tailwind CSS
* **Map Integration:** Leaflet หรือ Mapbox GL JS สำหรับแสดงผลพื้นที่ระวางแบบ GIS
* **State Management:** React Context API หรือ Zustand
* **Backend Framework:** FastAPI (Python) เพื่อความรวดเร็วในการประมวลผลข้อมูล
* **Data Validation:** Pydantic
* **Authentication:** JWT (JSON Web Tokens) ควบคู่กับการ Mock ข้อมูลระบบ ThaID
* **Database:** PostgreSQL
* **ORM:** Prisma (Prisma Client Python)
* **Containerization:** Docker & Docker Compose สำหรับจัดการ Environment
* **Storage:** Local Storage หรือ Cloud Storage สำหรับจัดเก็บรูปภาพ

---

## 3. Core Features Scope (ขอบเขตการทำงาน)

1. **Authentication (ระบบยืนยันตัวตน):** จำลองการ Login ผ่าน ThaID เพื่อแยกแยะผู้ใช้
2. **Smart Validation (ระบบตรวจสอบสิทธิสำหรับ Supply Side):** ตรวจสอบเลขที่สัญญาและเลขบัตรประชาชนกับฐานข้อมูลจำลองของกรมธนารักษ์ก่อนอนุญาตให้ลงประกาศ
3. **Listing Management (ระบบจัดการประกาศสำหรับ Supply Side):** ฟังก์ชัน CRUD (Create, Read, Update, Delete) สำหรับข้อมูลแปลงที่ดิน ราคา และรูปภาพ
4. **Smart Search & Map (ระบบค้นหาสำหรับ Demand Side):** แสดงหมุดประกาศสถานะ ACTIVE บนแผนที่ และค้นหาผ่านเงื่อนไขพื้นที่ (จังหวัด/อำเภอ)
5. **Fee Estimator (ระบบคำนวณค่าธรรมเนียม):** แสดงการประเมินค่าธรรมเนียมการโอนสิทธิเบื้องต้นในหน้าแสดงรายละเอียดประกาศ

---

## 4. Database Schema (Prisma)

โครงสร้างฐานข้อมูลออกแบบมาเพื่อรองรับความสัมพันธ์ระหว่างผู้ใช้ สัญญาเช่าของรัฐ และประกาศในตลาด

```prisma
generator client {
  provider = "prisma-client-py"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

model User {
  id            String    @id @default(uuid())
  thaid_id      String    @unique
  first_name    String
  last_name     String
  phone_number  String?
  role          Role      @default(USER)
  listings      Listing[] 
  createdAt     DateTime  @default(now())
  updatedAt     DateTime  @updatedAt
}

enum Role {
  USER
  ADMIN
}

model LeaseContract {
  id                String    @id @default(uuid())
  contract_number   String    @unique
  lessee_thaid_id   String    
  parcel_number     String    
  location_lat      Float     
  location_lng      Float     
  province          String    
  district          String    
  sub_district      String    
  land_area_sqw     Float     
  is_active         Boolean   @default(true)
  listings          Listing[] 
}

model Listing {
  id                  String        @id @default(uuid())
  sellerId            String        
  seller              User          @relation(fields: [sellerId], references: [id])
  contractId          String        
  contract            LeaseContract @relation(fields: [contractId], references: [id])
  asking_price        Float         
  estimated_fee       Float         
  description         String?       @db.Text
  image_urls          String[]      
  status              ListingStatus @default(ACTIVE)
  createdAt           DateTime      @default(now())
  updatedAt           DateTime      @updatedAt

  @@index([sellerId])
  @@index([contractId])
}

enum ListingStatus {
  ACTIVE
  SOLD
  HIDDEN
}

---

## 5. Tech Stack Requirements

### Frontend
* **Framework:** Next.js (App Router)
* **Styling:** Tailwind CSS
* **Map Integration:** Leaflet หรือ Mapbox GL JS (สำหรับการค้นหาเชิงพื้นที่/GIS)
* **State Management:** React Context API หรือ Zustand

### Backend
* **Framework:** FastAPI (Python)
* **Data Validation:** Pydantic
* **Authentication:** JWT (JSON Web Tokens) จำลองการยืนยันตัวตนผ่านระบบ ThaID

### Database & ORM
* **Database:** PostgreSQL
* **ORM:** Prisma (Prisma Client Python)

### Infrastructure & Deployment
* **Containerization:** Docker & Docker Compose
* **Storage:** Local Storage หรือ Cloud Storage (สำหรับเก็บไฟล์รูปภาพประกาศ)

---

## 6. Core Features Scope (ขอบเขตการทำงาน)
1. **Authentication:** ระบบ Login/Register (Mock ข้อมูล ThaID)
2. **Smart Validation:** ตรวจสอบสถานะสัญญาจากตารางฐานข้อมูลจำลองของกรมธนารักษ์
3. **Listing Management:** ผู้เช่าสร้าง ลบ และแก้ไขประกาศขายสิทธิได้
4. **Smart Search & Map:** ค้นหาประกาศผ่านหน้าเว็บ ทั้งรูปแบบ List View และ Map View
5. **Fee Estimator:** คำนวณอัตราค่าธรรมเนียมการโอนสิทธิเบื้องต้น

---

## 7. Database Schema (Prisma)
โครงสร้างฐานข้อมูลสำหรับการตั้งต้นโปรเจกต์ (บันทึกเป็นไฟล์ `schema.prisma`)

```prisma
generator client {
  provider = "prisma-client-py"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

model User {
  id            String    @id @default(uuid())
  thaid_id      String    @unique
  first_name    String
  last_name     String
  phone_number  String?
  role          Role      @default(USER)
  listings      Listing[]
  createdAt     DateTime  @default(now())
  updatedAt     DateTime  @updatedAt
}

enum Role {
  USER
  ADMIN
}

model LeaseContract {
  id                String    @id @default(uuid())
  contract_number   String    @unique
  lessee_thaid_id   String    
  parcel_number     String    
  location_lat      Float     
  location_lng      Float     
  province          String    
  district          String    
  sub_district      String    
  land_area_sqw     Float     
  is_active         Boolean   @default(true)
  listings          Listing[] 
}

model Listing {
  id                  String        @id @default(uuid())
  sellerId            String        
  seller              User          @relation(fields: [sellerId], references: [id])
  contractId          String        
  contract            LeaseContract @relation(fields: [contractId], references: [id])
  asking_price        Float         
  estimated_fee       Float         
  description         String?       @db.Text
  image_urls          String[]      
  status              ListingStatus @default(ACTIVE)
  createdAt           DateTime      @default(now())
  updatedAt           DateTime      @updatedAt

  @@index([sellerId])
  @@index([contractId])
}

enum ListingStatus {
  ACTIVE
  SOLD
  HIDDEN
}

8. UX/UI Design System
รักษ์ทรัพย์สิน (Trust UI): ใช้โทนสีทางการ (Primary: #00594C, Secondary: #D4AF37) มีตราสัญลักษณ์ "Verified by TRD" กำกับทุกประกาศ

ยินดีบริการ (Accessibility): ออกแบบ Responsive ฟอร์มกรอกข้อมูลง่าย ใช้ฟอนต์มาตรฐานราชการ (Noto Sans Thai หรือ Sarabun)

งานมีฝีมือ (Grid Precision): ใช้ Card Component จัดการสัดส่วนข้อมูลรูปภาพ พิกัด และราคาอย่างสมมาตร

ยึดถือคุณธรรม (Transparent UX): แจกแจงโครงสร้างค่าธรรมเนียมชัดเจนด้วย Fee Breakdown Modal

9. Authentication (ระบบยืนยันตัวตน)
จำลองการเข้าสู่ระบบผ่าน ThaID โดยใช้รหัสบัตรประชาชน (Mock Data)

Endpoint: POST /auth/login

Description: รับรหัสบัตรประชาชนเพื่อจำลองการ Login หากมีผู้ใช้ในระบบจะคืนค่า JWT Token

Request Body:

JSON
{
  "thaid_id": "1123456789012"
}
Response (200 OK):

JSON
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "token_type": "bearer",
  "user": {
    "id": "uuid-1234",
    "first_name": "สมชาย",
    "last_name": "ใจดี",
    "role": "USER"
  }
}
10. Smart Validation (ระบบตรวจสอบสถานะสัญญาเช่า)
สำหรับฝั่ง Supply Side ใช้ตรวจสอบสิทธิก่อนลงประกาศ

Endpoint: POST /contracts/validate

Description: ตรวจสอบความถูกต้องของเลขที่สัญญาเช่ากับรหัสบัตรประชาชนของผู้ใช้

Headers: Authorization: Bearer <token>

Request Body:

JSON
{
  "contract_number": "TRD-66-001"
}
Response (200 OK): (สัญญามีอยู่จริงและเป็นของผู้ใช้)

JSON
{
  "is_valid": true,
  "message": "พบข้อมูลสัญญาและสามารถดำเนินการต่อได้",
  "contract_data": {
    "parcel_number": "กท.1234",
    "location_lat": 13.7563,
    "location_lng": 100.5018,
    "province": "กรุงเทพมหานคร",
    "land_area_sqw": 50.0
  }
}
Response (400 Bad Request): (สัญญาไม่ถูกต้องหรือค้างชำระ)

JSON
{
  "is_valid": false,
  "message": "ไม่พบข้อมูลสัญญา หรือสัญญาถูกระงับ"
}
11. Listing Management (ระบบจัดการประกาศขายสิทธิ)
11.1 ดึงรายการประกาศทั้งหมด (สำหรับ Demand Side)

Endpoint: GET /listings

Description: ค้นหาประกาศ (รองรับ Pagination และ Query Parameters เพื่อการกรองข้อมูล)

Query Parameters (Optional):

province (String) - ค้นหาตามจังหวัด

min_price (Float) - ราคาขั้นต่ำ

max_price (Float) - ราคาสูงสุด

Response (200 OK):

JSON
{
  "data": [
    {
      "id": "list-uuid-1",
      "asking_price": 500000,
      "estimated_fee": 15000,
      "image_urls": ["url1.jpg", "url2.jpg"],
      "contract": {
        "province": "กรุงเทพมหานคร",
        "district": "พญาไท",
        "location_lat": 13.7712,
        "location_lng": 100.5401
      }
    }
  ],
  "meta": {
    "total_items": 1,
    "page": 1,
    "per_page": 10
  }
}
11.2 ดึงรายละเอียดประกาศ (รายการเดียว)

Endpoint: GET /listings/{id}

Description: ดึงข้อมูลรายละเอียดของประกาศแบบครบถ้วน รวมถึงโครงสร้างการคำนวณค่าธรรมเนียม

Response (200 OK): (คืนค่ารายละเอียดทั้งหมดที่เกี่ยวข้องกับ Listing ID นั้น)

11.3 สร้างประกาศใหม่ (สำหรับ Supply Side)

Endpoint: POST /listings

Description: สร้างประกาศใหม่โดยผูกกับ Contract ID ที่ผ่านการ Validate แล้ว

Headers: Authorization: Bearer <token>

Request Body:

JSON
{
  "contractId": "contract-uuid-123",
  "asking_price": 500000,
  "description": "ที่ดินทำเลทอง ใกล้รถไฟฟ้า เหมาะทำร้านกาแฟ",
  "image_urls": ["url_image1.jpg"] 
}
Response (201 Created): (คืนค่าข้อมูลประกาศที่ถูกสร้างขึ้น พร้อมสถานะ ACTIVE)

11.4 แก้ไขข้อมูลประกาศ

Endpoint: PUT /listings/{id}

Headers: Authorization: Bearer <token>

Description: อัปเดตราคา หรือแก้ไขรายละเอียด (อัปเดตได้เฉพาะผู้ที่เป็นเจ้าของประกาศ)

11.5 ซ่อน/ปิดการขายประกาศ

Endpoint: PATCH /listings/{id}/status

Headers: Authorization: Bearer <token>

Request Body:

JSON
{
  "status": "SOLD" // หรือ "HIDDEN"
}

12. เข้าใช้งาน pgAdmin: เปิดเบราว์เซอร์ไปที่  http://localhost:5050
      • อีเมล:  admin@trd.go.th
      • รหัสผ่าน:  admin1234

13. Workflow การพัฒนาและเตรียมขึ้นระบบ (Development & Deployment Workflow)

เพื่อความต่อเนื่องในการพัฒนา แนะนำให้ปฏิบัติตามขั้นตอน (Workflow) ดังต่อไปนี้:

### 13.1 ขั้นตอนการติดตั้งและรันระบบครั้งแรก (Local First Run)

1. **เริ่มระบบฐานข้อมูล**:
   - เปิด Docker Desktop
   - รันคำสั่ง `docker compose up -d db pgadmin` เพื่อเปิดฐานข้อมูล PostgreSQL และเครื่องมือจัดการ pgAdmin

2. **ตั้งค่า Backend**:
   - รัน [setup_backend.bat](file:///c:/TRD_lex/backend/setup_backend.bat) เพื่อสร้าง Virtual Environment ติดตั้งไลบรารี สตรีมตารางข้อมูล และยัดข้อมูลจำลอง (Seed Data) โดยอัตโนมัติ
   - เปิด Uvicorn Server:

     ```bash
     cd backend
     .venv\Scripts\activate
     uvicorn app.main:app --reload --port 8000
     ```

3. **ตั้งค่า Frontend**:
   - รัน [setup_frontend.bat](file:///c:/TRD_lex/frontend/setup_frontend.bat) เพื่อติดตั้งแพ็กเกจ Node.js
   - เริ่มเว็บบอร์ดฝั่ง Client:

     ```bash
     cd frontend
     npm run dev
     ```

   - เข้าใช้งานที่ `http://localhost:3000`

### 13.2 ขั้นตอนการพัฒนาเมื่อเปลี่ยน Schema ฐานข้อมูล (Prisma Development Flow)

เมื่อต้องการแก้ไขโครงสร้างข้อมูลใน `prisma/schema.prisma`:

1. ทำการแก้ไขโครงสร้างคอลัมน์/ตารางที่ต้องการในไฟล์ `backend/prisma/schema.prisma`

2. อัปเดตฝั่งฐานข้อมูลและฝั่ง Python Client ด้วยคำสั่ง:

   ```bash
   python -m prisma generate --schema=prisma/schema.prisma
   python -m prisma db push --schema=prisma/schema.prisma
   ```

3. ปรับปรุงไฟล์ [frontend/src/types/index.ts](file:///c:/TRD_lex/frontend/src/types/index.ts) ให้สอดรับการเปลี่ยนแปลงโครงสร้าง เพื่อให้ระบบพิมพ์ตรวจสอบค่า (Static Checking) ของ TypeScript ทำงานได้อย่างมีประสิทธิภาพ

### 13.3 ขั้นตอนการนำส่งและจัดการเวอร์ชันโค้ด (Version Control Flow)

1. ตรวจสอบการกรองไฟล์ไม่พึงประสงค์ใน [C:\TRD_lex\.gitignore](file:///c:/TRD_lex/.gitignore) ว่าไม่มีไฟล์ความลับ (Secrets) เช่น `.env` ติดขึ้นไป

2. ดำเนินการ Commit โค้ดในเครื่อง:

   ```bash
   git add .
   git commit -m "feat: <คำอธิบายฟีเจอร์>"
   ```

3. รัน [setup_deploy.bat](file:///c:/TRD_lex/setup_deploy.bat) เพื่อตรวจความพร้อมของระบบ Git, Docker, และ Google Cloud CLI ก่อนส่งขึ้น GitHub หรือ GitLab

### 13.4 ขั้นตอนการเตรียม Deploy บนระบบคลาวด์ (Cloud Deployment Prep)

ในกรณีที่จะทดสอบบน Cloud (เช่น Google Cloud Run):

1. **ทดสอบ Docker Build ภายในเครื่องก่อน**:

   ```bash
   # รัน build และทดสอบจำลองภาพรวมทั้ง 4 เซอร์วิส
   docker compose up --build
   ```

2. **ขึ้นระบบ Backend บน Google Cloud Run**:

   ```bash
   gcloud config set project YOUR_PROJECT_ID
   gcloud run deploy trd-lex-backend --source ./backend --region asia-southeast1 --allow-unauthenticated
   ```

3. **ขึ้นระบบ Frontend บน Google Cloud Run**:

   ```bash
   gcloud run deploy trd-lex-frontend --source ./frontend --region asia-southeast1 --allow-unauthenticated
   ```
