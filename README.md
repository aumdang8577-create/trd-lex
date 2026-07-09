# 🏛️ TRD Lease Exchange (TRD-LEX)

**แพลตฟอร์มตลาดรองเพื่อการเปลี่ยนมือสิทธิการเช่าที่ราชพัสดุ**

> Architecture: Two-Sided Marketplace (B2C / C2C)
> Theme: "Smart & Sustainable Treasury"

---

## 💡 Executive Summary: นวัตกรรมเปลี่ยนภาระให้เป็นมูลค่า

> "จุดเด่นที่สุดของ TRD-LEX ไม่ใช่แค่การเป็นเว็บไซต์ลงประกาศครับ แต่มันคือ **เครื่องมือเปลี่ยนภาระให้เป็นมูลค่า** ทุกครั้งที่มีการตกลงเปลี่ยนมือสิทธิผ่านแพลตฟอร์มนี้ ข้อมูลเชิงธุรกรรมจะถูกแปลงเป็น **Economic Indicators** แบบ Real-time บน Dashboard ทันที... คณะผู้บริหารจะมองเห็นตัวเลขของพื้นที่รกร้างที่ถูกพลิกฟื้นกลับมาสร้างรายได้ เห็นเม็ดเงินค่าธรรมเนียมที่ไหลเข้ากระเป๋ารัฐอย่างโปร่งใส และเห็นมูลค่าการลงทุนที่ลงไปหมุนเวียนในระดับภูมิภาค นี่คือนวัตกรรมที่พิสูจน์ให้เห็นว่า เทคโนโลยีดิจิทัลสามารถขับเคลื่อนเป้าหมายการจัดเก็บรายได้ และยกระดับการบริหารทรัพย์สินของแผ่นดินได้อย่างแท้จริง"

---

## 🔧 Tech Stack

| Layer | Technology |
|-------|-----------|
| **Frontend** | Next.js 15 (App Router), Tailwind CSS, Leaflet |
| **Backend** | FastAPI (Python), Pydantic v2 |
| **Database** | PostgreSQL 16, Prisma ORM (Python Client) |
| **Auth** | JWT + Mock ThaID |
| **Infra** | Docker Compose, Google Cloud Run (planned) |

---

## 📂 Project Structure

```
TRD_lex/
├── .env.example              # Environment template (safe to commit)
├── .gitignore                 # Comprehensive ignore rules
├── docker-compose.yml         # Full-stack: DB + pgAdmin + Backend + Frontend
│
├── backend/                   # FastAPI Backend
│   ├── app/
│   │   ├── core/              # Config, Database, Security (JWT)
│   │   ├── models/            # Python Enums
│   │   ├── schemas/           # Pydantic Request/Response
│   │   ├── services/          # Business Logic
│   │   ├── routes/            # API Endpoints
│   │   └── main.py            # FastAPI Entry Point
│   ├── prisma/schema.prisma   # Database Schema
│   ├── seed.py                # Mock Data Seeder
│   ├── Dockerfile             # Production Image
│   └── setup_backend.bat      # One-click Setup (Windows)
│
├── frontend/                  # Next.js Frontend
│   ├── src/
│   │   ├── app/               # Pages & Layout
│   │   ├── components/
│   │   │   ├── ui/            # Button, Card, Input, Badge, Modal
│   │   │   └── features/      # Navbar, Map, FeeModal, ListingCard
│   │   ├── lib/api.ts         # Backend API Client
│   │   └── types/             # TypeScript Interfaces
│   ├── tailwind.config.ts     # TRD Design System
│   ├── Dockerfile             # Production Image
│   └── setup_frontend.bat     # One-click Setup (Windows)
│
└── setup_deploy.bat           # Git Init + GCloud CLI Check
```

---

## ⚡ Quick Start (Local Development)

### Prerequisites
- [Docker Desktop](https://www.docker.com/products/docker-desktop/)
- [Python 3.12+](https://www.python.org/)
- [Node.js 20+](https://nodejs.org/)
- [Git](https://git-scm.com/)

### Step 1: Clone & Configure
```bash
git clone https://github.com/YOUR_USERNAME/trd-lex.git
cd trd-lex
cp .env.example .env
```

### Step 2: Start Database
```bash
docker compose up db pgadmin -d
```

### Step 3: Setup Backend
```bash
cd backend
python -m venv .venv
.venv\Scripts\activate          # Windows
pip install -r requirements.txt
python -m prisma generate --schema=prisma/schema.prisma
python -m prisma db push --schema=prisma/schema.prisma
python seed.py
uvicorn app.main:app --reload --port 8000
```

### Step 4: Setup Frontend
```bash
cd frontend
npm install
npm run dev
```

### Step 5: Access
| Service | URL |
|---------|-----|
| 🌐 Frontend | http://localhost:3000 |
| ⚡ Backend API | http://localhost:8000 |
| 📖 API Docs (Swagger) | http://localhost:8000/docs |
| 🗄️ pgAdmin | http://localhost:5050 |

---

## 🚀 Deployment (Google Cloud Run)

```bash
# Build & deploy backend
gcloud run deploy trd-lex-backend \
  --source ./backend \
  --region asia-southeast1 \
  --allow-unauthenticated

# Build & deploy frontend
gcloud run deploy trd-lex-frontend \
  --source ./frontend \
  --region asia-southeast1 \
  --allow-unauthenticated
```

Or use Docker Compose for full-stack:
```bash
docker compose up --build
```

---

## 🧪 Test Accounts

| เลขบัตรประชาชน (ThaID) | ชื่อ | สัญญาเช่า |
|------------------------|------|-----------|
| `1123456789012` | สมชาย ใจดี | TRD-66-001 (กรุงเทพฯ) |
| `2123456789012` | สมหญิง รักดี | TRD-66-002 (ชลบุรี) |
| `9123456789012` | แอดมิน ธนารักษ์ | (Admin) |

## 📄 License

Internal project — Treasury Department of Thailand

---

## 💡 Inspiration & References

- **Design & Flow Inspiration**: [AntonioErdeljac/next13-airbnb-clone](https://github.com/AntonioErdeljac/next13-airbnb-clone) (หยิบยกโครงสร้างการลงประกาศแบบเป็นลำดับขั้นตอน Step-by-step Modal, ระบบตัวกรองค้นหาที่ดินแบบละเอียด และการเชื่อมต่อแผนที่เชิงพื้นที่แบบบูรณาการมาประยุกต์ใช้)
- **Marketplace Logic & State Reference**: [sharetribe/sharetribe](https://github.com/sharetribe/sharetribe) (ศึกษาโครงสร้างโฟลว์ระบบ C2C Marketplace เช่น โครงสร้างการส่งคำขอโอนสิทธิ์ "Request to Transfer" และแนวทางการทำ State Management ของระบบกรองข้อมูล)
- **Real Estate Templates**: [mohitchandel/real-estate-tremplate](https://github.com/mohitchandel/real-estate-tremplate) (แนวทางการออกแบบและสร้างโครงสร้างธีมหน้าเว็บประเภทอสังหาริมทรัพย์เพื่อความรวดเร็วในการจัดทำ Layout)
