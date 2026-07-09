# TRD Lease Exchange (TRD-LEX) Backend

บริการ Backend API ของแพลตฟอร์มตลาดรองเพื่อการเปลี่ยนมือสิทธิการเช่าที่ราชพัสดุ พัฒนาด้วย **FastAPI**, **Prisma ORM**, และ **PostgreSQL**

---

## 📂 โครงสร้างโฟลเดอร์ (Backend Folder Structure)

โครงสร้างโฟลเดอร์ถูกแบ่งตามหลัก Modular & Domain-driven Service Pattern เพื่อการขยายระบบในอนาคต:

```
backend/
├── prisma/
│   └── schema.prisma         # Prisma Schema (ความสัมพันธ์ User, สัญญาเช่า, และประกาศ)
├── app/
│   ├── core/
│   │   ├── config.py         # การตั้งค่าของแอปและอ่านตัวแปรสภาพแวดล้อมจาก .env
│   │   ├── database.py       # Instance จัดการการเชื่อมต่อ Prisma Client
│   │   └── security.py       # ระบบรักษาความปลอดภัย สร้าง/ถอดรหัส JWT Token สำหรับระบบล็อกอิน
│   ├── models/
│   │   └── enums.py          # Enums ที่จับคู่กับข้อมูล Prisma (เช่นสถานะประกาศ, บทบาทผู้ใช้)
│   ├── schemas/
│   │   ├── auth.py           # Pydantic validation schemas สำหรับการล็อกอิน
│   │   ├── contract.py       # Validation schemas สำหรับตรวจสอบเลขที่สัญญาเช่า
│   │   └── listing.py        # Validation schemas สำหรับสร้าง/แสดง/แก้ไขข้อมูลประกาศ
│   ├── services/
│   │   ├── auth_service.py   # Business Logic สำหรับการเข้าสู่ระบบและสร้าง Token
│   │   ├── contract_service.py # Logic ตรวจสอบเลขสัญญาเช่าและความเป็นเจ้าของ
│   │   └── listing_service.py  # Logic จัดการประกาศการขายสิทธิ์ (CRUD + Estimated Fee)
│   ├── routes/
│   │   ├── auth.py           # API Endpoints สำหรับ Login
│   │   ├── contracts.py      # API Endpoints สำหรับการยืนยันสัญญาเช่า
│   │   └── listings.py       # API Endpoints สำหรับ Marketplace Listings (CRUD)
│   └── main.py               # จุดเริ่มต้นระบบ (FastAPI App, Middlewares, API Routers)
├── requirements.txt          # รายการ Dependencies สำหรับโปรเจกต์ Python
├── seed.py                   # สคริปต์สำหรับนำเข้าข้อมูลจำลองลง Database (Users, Contracts, Listings)
└── setup_backend.bat         # สคริปต์แบบคลิกเดียวจบสำหรับติดตั้ง venv, dependencies, prisma และ seed data (Windows)
```

---

## ⚡ วิธีเริ่มต้นใช้งานอย่างรวดเร็ว (Setup & Run)

### วิธีที่ 1: ติดตั้งผ่านสคริปต์อัตโนมัติ (แนะนำสำหรับ Windows)
1. เปิด **Docker Desktop** ให้เรียบร้อย
2. ดับเบิ้ลคลิกไฟล์ `setup_backend.bat` 
3. สคริปต์จะทำงานต่อไปนี้โดยอัตโนมัติ:
   - สั่งรันฐานข้อมูล PostgreSQL ผ่าน Docker Compose
   - สร้าง Python Virtual Environment (`.venv`) และเปิดใช้งาน
   - ติดตั้ง Python Dependencies ทั้งหมด
   - สร้างตารางใน Database ผ่าน `prisma db push`
   - รันสคริปต์ `seed.py` เพื่อจำลองข้อมูลสัญญาเช่าและผู้ใช้ในระบบ

### วิธีที่ 2: ติดตั้งด้วยตัวเองทีละขั้นตอน
หากต้องการติดตั้งด้วยตัวเอง สามารถเปิด Terminal ในโฟลเดอร์ `backend/` แล้วทำตามขั้นตอนนี้:

1. **สร้างและเรียกใช้งาน Virtual Environment**
   ```bash
   python -m venv .venv
   .venv\Scripts\activate
   ```
2. **ติดตั้ง dependencies**
   ```bash
   pip install -r requirements.txt
   ```
3. **ตรวจสอบฐานข้อมูล Docker และเชื่อมต่อ**
   - รัน `docker compose up -d` ใน root โฟลเดอร์ `c:\TRD_lex`
4. **สร้างฐานข้อมูลและ Client ด้วย Prisma**
   ```bash
   python -m prisma generate --schema=prisma/schema.prisma
   python -m prisma db push --schema=prisma/schema.prisma
   ```
5. **นำเข้าข้อมูลจำลอง (Seed Data)**
   ```bash
   python seed.py
   ```

---

## 🚀 วิธีรันเซิร์ฟเวอร์พัฒนา (Running Development Server)

เรียกใช้งานเซิร์ฟเวอร์โดยการรันคำสั่ง:
```bash
uvicorn app.main:app --reload --port 8000
```
- **API Base URL:** `http://localhost:8000`
- **Interactive Documentation (Swagger UI):** `http://localhost:8000/docs`
- **Alternative Documentation (Redoc):** `http://localhost:8000/redoc`

---

## 🔌 API Specification & Endpoints

### 1. Authentication (ระบบยืนยันตัวตน)
* **POST `/auth/login`** — ยืนยันตัวตนจำลองผ่านระบบ ThaID ด้วยเลขบัตรประชาชน 13 หลัก
  * **ข้อมูลจำลองที่มีสิทธิ์ใช้งานทันทีในระบบ:**
    - `1123456789012` (สมชาย ใจดี - เจ้าของสัญญา `TRD-66-001`)
    - `2123456789012` (สมหญิง รักดี - เจ้าของสัญญา `TRD-66-002`)
    - *หรือกรอกเลขอื่นใดก็ได้ ระบบจะสร้างผู้ใช้จำลองให้ใหม่โดยอัตโนมัติสำหรับการทดสอบ*

### 2. Smart Validation (ระบบตรวจสอบสิทธิสัญญาเช่า)
* **POST `/contracts/validate`** (ต้องระบุ Authorization Bearer Token)
  * ตรวจสอบว่าเลขที่สัญญาที่กรอกมีตัวตนอยู่จริงหรือไม่ เป็นของผู้ใช้งานปัจจุบันหรือไม่ และสัญญาไม่ได้ถูกระงับ

### 3. Marketplace Listings (ระบบประกาศเสนอขายสิทธิ์)
* **GET `/listings`** — แสดงประกาศทั้งหมดที่เป็นสถานะ `ACTIVE` รองรับการกรองตาม `province` (จังหวัด) และช่วงราคา `min_price` - `max_price`
* **GET `/listings/{id}`** — แสดงรายละเอียดของประกาศเดียวโดยระบุไอดี
* **POST `/listings`** (ต้องระบุ Token) — สร้างประกาศขายสิทธิ์ใหม่ (ระบบจะประเมินค่าธรรมเนียมโอนสิทธิ์ 3% ให้โดยอัตโนมัติ)
* **PUT `/listings/{id}`** (ต้องระบุ Token) — แก้ไขรายละเอียดราคาหรือรูปภาพของประกาศ (เฉพาะเจ้าของประกาศเท่านั้น)
* **PATCH `/listings/{id}/status`** (ต้องระบุ Token) — เปลี่ยนสถานะของประกาศเป็น `SOLD` หรือ `HIDDEN`
