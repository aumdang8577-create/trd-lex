"use client";

import { useState } from "react";
import Button from "@/components/ui/Button";
import Badge from "@/components/ui/Badge";
import SearchBar from "@/components/features/SearchBar/SearchBar";
import PropertyCard from "@/components/features/PropertyCard";
import CreateListingModal from "@/components/features/CreateListingModal";
import EconomicDashboard from "@/components/features/EconomicDashboard";
import type { Listing } from "@/types";

const mockListings: Listing[] = [
  {
    id: "list-1",
    sellerId: "seller-1",
    seller: { id: "seller-1", thaid_id: "123", first_name: "สมชาย", last_name: "ใจดี", role: "USER" },
    contractId: "contract-1",
    contract: {
      id: "contract-1",
      contract_number: "TRD-66-001",
      parcel_number: "1024/65",
      location_lat: 13.7712,
      location_lng: 100.5401,
      province: "กรุงเทพมหานคร",
      district: "พญาไท",
      sub_district: "สามเสนใน",
      land_area_sqw: 120,
      is_active: true,
      building_type: "อาคารพาณิชย์",
      usable_area_sqm: 250,
      zoning: "พื้นที่สีแดง (พาณิชยกรรม)",
    },
    asking_price: 1500000,
    estimated_fee: 45000,
    description: "สิทธิ์การเช่าที่ดินเพื่อการพาณิชย์ ทำเลทองพญาไท ใกล้รถไฟฟ้า เหมาะทำร้านกาแฟหรือโชว์รูมสินค้าขนาดเล็ก",
    image_urls: ["https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=800&q=80"],
    status: "ACTIVE",
    createdAt: "2026-07-09T00:00:00Z",
    updatedAt: "2026-07-09T00:00:00Z",
  },
  {
    id: "list-2",
    sellerId: "seller-2",
    seller: { id: "seller-2", thaid_id: "456", first_name: "สมหญิง", last_name: "รักดี", role: "USER" },
    contractId: "contract-2",
    contract: {
      id: "contract-2",
      contract_number: "TRD-66-002",
      parcel_number: "589/12",
      location_lat: 12.9235,
      location_lng: 100.8824,
      province: "ชลบุรี",
      district: "บางละมุง",
      sub_district: "หนองปรือ",
      land_area_sqw: 80,
      is_active: true,
      building_type: "บ้านพักอาศัย",
      usable_area_sqm: 140,
      zoning: "พื้นที่สีเหลือง (ที่อยู่อาศัยหนาแน่นน้อย)",
    },
    asking_price: 980000,
    estimated_fee: 29400,
    description: "แปลงที่ดินราชพัสดุพัทยาใต้ ทำเลพักอาศัย เงียบสงบ ใกล้สิ่งอำนวยความสะดวกมากมาย",
    image_urls: ["https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=800&q=80"],
    status: "ACTIVE",
    createdAt: "2026-07-09T00:00:00Z",
    updatedAt: "2026-07-09T00:00:00Z",
  },
  {
    id: "list-3",
    sellerId: "seller-3",
    seller: { id: "seller-3", thaid_id: "789", first_name: "ประยุทธ์", last_name: "มั่งมี", role: "USER" },
    contractId: "contract-3",
    contract: {
      id: "contract-3",
      contract_number: "TRD-66-003",
      parcel_number: "220/8",
      location_lat: 18.7883,
      location_lng: 98.9853,
      province: "เชียงใหม่",
      district: "เมืองเชียงใหม่",
      sub_district: "ศรีภูมิ",
      land_area_sqw: 150,
      is_active: true,
      building_type: "อาคารพาณิชย์",
      usable_area_sqm: 350,
      zoning: "พื้นที่สีแดง (พาณิชยกรรม)",
    },
    asking_price: 2400000,
    estimated_fee: 72000,
    description: "สิทธิ์การเช่าระยะยาวสำหรับทำธุรกิจเกสท์เฮ้าส์หรือร้านอาหารในเขตคูเมืองเก่าเชียงใหม่ ดึงดูดนักท่องเที่ยวได้ดีเยี่ยม",
    image_urls: ["https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=800&q=80"],
    status: "ACTIVE",
    createdAt: "2026-07-09T00:00:00Z",
    updatedAt: "2026-07-09T00:00:00Z",
  }
];

export default function HomePage() {
  const [isCreateOpen, setIsCreateOpen] = useState(false);

  return (
    <>
      {/* Hero Section */}
      <section className="relative bg-hero-gradient text-white overflow-hidden pb-32">
        {/* Decorative gold accent */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-trd-secondary/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
        <div className="absolute bottom-0 left-0 w-72 h-72 bg-trd-secondary/5 rounded-full blur-2xl translate-y-1/2 -translate-x-1/2" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-24">
          <div className="max-w-3xl animate-fade-in mb-12">
            {/* Verified badge */}
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-4 py-2 mb-6">
              <span className="w-2 h-2 bg-trd-secondary rounded-full animate-pulse-gold" />
              <span className="text-sm font-medium">Smart &amp; Sustainable Treasury</span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
              ตลาดรองสิทธิการเช่า
              <br />
              <span className="text-trd-secondary">ที่ราชพัสดุ</span>
            </h1>

            <p className="text-base sm:text-lg text-white/85 mb-8 max-w-2xl leading-relaxed">
              แพลตฟอร์มเพื่อเปลี่ยนมือสิทธิการเช่าอย่างโปร่งใส ตรวจสอบได้
              ผ่านการยืนยันตัวตนจากระบบ ThaID ของกรมธนารักษ์
            </p>

            <div className="flex flex-col sm:flex-row gap-4">
              <Button variant="secondary" size="lg" onClick={() => window.location.href = "/listings"}>
                🔍 ค้นหาประกาศ
              </Button>
              <Button variant="outline" size="lg" onClick={() => setIsCreateOpen(true)}>
                📋 ลงประกาศขายสิทธิ์
              </Button>
            </div>
          </div>

          {/* SearchBar in Hero */}
          <div className="animate-slide-up">
            <SearchBar />
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-16 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            { label: "ประกาศเปิดขาย", value: "128", icon: "📋" },
            { label: "ผู้ใช้งานในระบบ", value: "1,240", icon: "👥" },
            { label: "มูลค่ารวม (ล้านบาท)", value: "356", icon: "💰" },
          ].map((stat) => (
            <div
              key={stat.label}
              className="trd-card px-6 py-5 flex items-center gap-4 animate-slide-up"
            >
              <div className="text-3xl">{stat.icon}</div>
              <div>
                <div className="text-2xl font-bold text-trd-primary">
                  {stat.value}
                </div>
                <div className="text-sm text-gray-500">{stat.label}</div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Featured Properties Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center mb-12">
          <h2 className="trd-section-title text-3xl">รายการสิทธิการเช่าแนะนำ</h2>
          <div className="trd-gold-divider mx-auto mt-4" />
          <p className="mt-4 text-gray-500 max-w-xl mx-auto">
            สิทธิการเช่าที่ผ่านการตรวจสอบสถานะสัญญาโดยระบบ Smart Validation ของกรมธนารักษ์เรียบร้อยแล้ว
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {mockListings.map((listing) => (
            <PropertyCard
              key={listing.id}
              id={listing.id}
              price={listing.asking_price}
              province={listing.contract.province}
              district={listing.contract.district}
              landArea={listing.contract.land_area_sqw}
              imageUrl={listing.image_urls[0] || ""}
              isVerified={listing.status === "ACTIVE"}
              buildingType={listing.contract.building_type}
              usableAreaSqm={listing.contract.usable_area_sqm}
              zoning={listing.contract.zoning}
            />
          ))}
        </div>
      </section>

      {/* Economic Impact Dashboard Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <EconomicDashboard />
      </section>

      {/* Features Section */}
      <section className="bg-white border-t border-b border-trd-border/50 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="trd-section-title text-3xl">ฟีเจอร์หลักของระบบ</h2>
            <div className="trd-gold-divider mx-auto mt-4" />
            <p className="mt-4 text-gray-500 max-w-xl mx-auto">
              ออกแบบเพื่อความโปร่งใสและการตรวจสอบได้ทุกขั้นตอน
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                icon: "🛡️",
                title: "ยืนยันตัวตน ThaID",
                desc: "ระบบจำลองการยืนยันตัวตนผ่าน ThaID ของกรมการปกครอง เพื่อความปลอดภัยสูงสุด",
                badge: "ความปลอดภัย",
              },
              {
                icon: "📄",
                title: "ตรวจสอบสัญญาเช่า",
                desc: "ตรวจสอบสถานะสัญญาเช่าที่ราชพัสดุแบบอัตโนมัติ ลดเวลาดำเนินการด้วยมือ",
                badge: "Smart Validation",
              },
              {
                icon: "🗺️",
                title: "ค้นหาเชิงพื้นที่",
                desc: "แสดงหมุดประกาศที่เปิดขายบนแผนที่ ค้นหาตามจังหวัดและอำเภอได้ทันที",
                badge: "Map Search",
              },
              {
                icon: "💵",
                title: "ประเมินค่าธรรมเนียม",
                desc: "คำนวณค่าธรรมเนียมการโอนสิทธิ์เบื้องต้นอัตโนมัติ โปร่งใสทุกรายการ",
                badge: "Fee Estimator",
              },
              {
                icon: "📊",
                title: "จัดการประกาศ",
                desc: "สร้าง แก้ไข และปิดประกาศได้ด้วยตนเอง มีสถานะชัดเจน (ACTIVE/SOLD/HIDDEN)",
                badge: "CRUD",
              },
              {
                icon: "✅",
                title: "Verified by TRD",
                desc: "ทุกประกาศผ่านการตรวจสอบสิทธิ์จากระบบฐานข้อมูลกรมธนารักษ์",
                badge: "Trust Badge",
              },
            ].map((feature) => (
              <div key={feature.title} className="trd-card p-6 group">
                <div className="text-4xl mb-4">{feature.icon}</div>
                <Badge variant="gold" className="mb-3">
                  {feature.badge}
                </Badge>
                <h3 className="text-lg font-semibold text-trd-primary mb-2">
                  {feature.title}
                </h3>
                <p className="text-sm text-gray-500 leading-relaxed">
                  {feature.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Footer */}
      <section className="bg-trd-gradient text-white py-16">
        <div className="max-w-4xl mx-auto text-center px-4">
          <h2 className="text-3xl font-bold mb-4">
            พร้อมเริ่มต้นใช้งาน?
          </h2>
          <p className="text-white/80 mb-8 text-lg">
            เข้าสู่ระบบด้วย ThaID เพื่อเริ่มค้นหาหรือลงประกาศสิทธิการเช่าที่ราชพัสดุ
          </p>
          <Button variant="secondary" size="lg">
            เข้าสู่ระบบด้วย ThaID →
          </Button>
        </div>
      </section>
      {/* Create Listing Modal */}
      <CreateListingModal isOpen={isCreateOpen} onClose={() => setIsCreateOpen(false)} />
    </>
  );
}

