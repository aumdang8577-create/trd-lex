"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
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
  const router = useRouter();
  const [isCreateOpen, setIsCreateOpen] = useState(false);

  return (
    <div className="bg-trd-bg text-trd-primary min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-hero-gradient text-white overflow-hidden pb-28 pt-20 border-b border-[#1E2E4A]">
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl animate-fade-in mb-12">
            {/* Verified badge */}
            <div className="inline-flex items-center gap-2 bg-[#070D1A]/60 border border-[#1E2E4A] px-3.5 py-1.5 mb-6 font-mono text-xs text-trd-secondary uppercase tracking-widest font-bold rounded-full shadow-neon-gold">
              <span className="w-2 h-2 bg-trd-secondary rounded-full animate-pulse" />
              สถานะระบบ // เปิดการใช้งานปกติ
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black mb-6 uppercase tracking-tight font-sans text-white" style={{ lineHeight: '1.6' }}>
              ตลาดรองสิทธิการเช่า
              <br />
              <span className="text-trd-secondary">ที่ราชพัสดุ</span>
            </h1>

            <p className="text-sm sm:text-base text-slate-300 mb-8 max-w-2xl leading-relaxed font-medium">
              แพลตฟอร์มการซื้อขายและโอนสิทธิการเช่าที่ราชพัสดุเพื่อความโปร่งใส 
              ตรวจสอบสัญญาเช่าผ่านระบบ Smart Validation และบริการยืนยันตัวตนดิจิทัลผ่านระบบ ThaID ของกรมธนารักษ์
            </p>

            <div className="flex flex-col sm:flex-row gap-4 font-mono text-xs uppercase tracking-widest">
              <Button 
                variant="primary" 
                size="lg" 
                className="font-black border border-transparent bg-gold-gradient text-[#0F1A30] rounded-xl shadow-neon-gold hover:opacity-90 transition-all duration-150" 
                onClick={() => router.push("/listings")}
              >
                ค้นหาแปลงที่ดิน
              </Button>
              <Button 
                variant="outline" 
                size="lg" 
                className="font-black border border-[#1E2E4A] text-white bg-[#070D1A]/40 rounded-xl hover:bg-[#1E2E4A]/40 transition-all duration-150" 
                onClick={() => setIsCreateOpen(true)}
              >
                ลงทะเบียนประกาศโอนสิทธิ์
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
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-10 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 font-mono">
          {[
            { label: "ประกาศเปิดขาย", value: "128", code: "สถิติจำนวนสัญญาเช่าที่ประกาศโอน" },
            { label: "ผู้ใช้งานในระบบ", value: "1,240", code: "สถิติจำนวนผู้ใช้งานในระบบทะเบียน" },
            { label: "มูลค่ารวม (ล้านบาท)", value: "356", code: "สถิติมูลค่าธุรกรรมหมุนเวียนรวม" },
          ].map((stat) => (
            <div
              key={stat.label}
              className="bg-[#0F1A30] border border-[#1E2E4A]/80 px-6 py-5.5 flex flex-col justify-between animate-slide-up rounded-2xl shadow-2xl hover:border-trd-secondary/40 transition-all duration-300"
            >
              <div className="text-[9px] text-trd-secondary-dark font-black uppercase tracking-widest">{stat.code}</div>
              <div className="text-3xl font-black text-white mt-1">
                {stat.value}
              </div>
              <div className="text-[11px] text-slate-350 mt-1 font-sans font-bold">{stat.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Warning Banner (Disclaimer - Soft light Red style) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12">
        <div className="bg-red-50 border border-red-200 border-l-4 border-l-red-500 p-4 rounded-xl shadow-sm text-slate-700">
          <div className="flex">
            <div className="flex-shrink-0 font-mono text-red-650 text-xs font-black tracking-widest uppercase">
              [ประกาศคำชี้แจงส่วนราชการ]
            </div>
            <div className="ml-4">
              <h3 className="text-xs font-black text-red-700 uppercase tracking-wider font-mono">
                ข้อควรทราบก่อนการเจรจาโอนสิทธิ
              </h3>
              <div className="mt-1 text-xs text-slate-650 leading-relaxed font-sans font-medium">
                <p>
                  TRD-LEX เป็นเพียงแพลตฟอร์มกลางในการแสดงข้อมูลทำเลศักยภาพเท่านั้น 
                  <strong> การทำธุรกรรมเพื่อเปลี่ยนแปลงชื่อผู้เช่าในสัญญาอย่างสมบูรณ์ จะต้องดำเนินการ ณ สำนักงานธนารักษ์พื้นที่ที่รับผิดชอบเท่านั้น</strong> 
                  โปรดระวังการโอนเงินหรือทำธุรกรรมผ่านบุคคลที่สาม
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Properties Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center mb-12">
          <span className="text-[9px] font-mono text-trd-secondary-dark uppercase tracking-widest font-black">
            รายการแนะนำประจำสัปดาห์
          </span>
          <h2 className="text-2xl font-black text-trd-primary uppercase mt-1 font-sans tracking-wide">รายการแนะนำสิทธิการเช่า</h2>
          <div className="trd-gold-divider mx-auto mt-4" />
          <p className="mt-4 text-xs text-slate-500 max-w-xl mx-auto font-sans leading-relaxed">
            แปลงที่ราชพัสดุศักยภาพสูงที่ยืนยันข้อมูลสัญญาผ่านระบบ Smart Validation สำเร็จแล้ว
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
              locationLat={listing.contract.location_lat}
              locationLng={listing.contract.location_lng}
            />
          ))}
        </div>
      </section>

      {/* Economic Impact Dashboard Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <EconomicDashboard />
      </section>

      {/* Features Section */}
      <section className="bg-white border-t border-b border-slate-200/80 py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <span className="text-[9px] font-mono text-trd-secondary-dark uppercase tracking-widest font-black">
              กลไกการให้บริการของระบบ
            </span>
            <h2 className="text-2xl font-black text-trd-primary uppercase mt-1 font-sans tracking-wide">ฟีเจอร์หลักของระบบ</h2>
            <div className="trd-gold-divider mx-auto mt-4" />
            <p className="mt-4 text-xs text-slate-500 max-w-xl mx-auto leading-relaxed font-medium font-sans">
              ออกแบบเพื่อความโปร่งใสและการตรวจสอบได้ทุกขั้นตอน
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                title: "ยืนยันตัวตน ThaID",
                desc: "ระบบจำลองการยืนยันตัวตนผ่าน ThaID ของกรมการปกครอง เพื่อความปลอดภัยสูงสุด",
                badge: "ระบบความมั่นคงปลอดภัยในการยืนยันตัวตน",
              },
              {
                title: "ตรวจสอบสัญญาเช่า",
                desc: "ตรวจสอบสถานะสัญญาเช่าที่ราชพัสดุแบบอัตโนมัติ ลดเวลาดำเนินการด้วยมือ",
                badge: "ระบบตรวจสอบความถูกต้องสัญญา",
              },
              {
                title: "ค้นหาเชิงพื้นที่",
                desc: "แสดงหมุดประกาศที่เปิดขายบนแผนที่ ค้นหาตามจังหวัดและอำเภอได้ทันที",
                badge: "แผนที่สารสนเทศภูมิศาสตร์เชิงพื้นที่",
              },
              {
                title: "ประเมินค่าธรรมเนียม",
                desc: "คำนวณค่าธรรมเนียมการโอนสิทธิ์เบื้องต้นอัตโนมัติ โปร่งใสทุกรายการ",
                badge: "ระบบคำนวณอัตราค่าธรรมเนียมหลวง",
              },
              {
                title: "จัดการประกาศ",
                desc: "สร้าง แก้ไข และปิดประกาศได้ด้วยตนเอง มีสถานะชัดเจน (ACTIVE/SOLD/HIDDEN)",
                badge: "ระบบบันทึกคำสั่งและจัดการประกาศ",
              },
              {
                title: "Verified by TRD",
                desc: "ทุกประกาศผ่านการตรวจสอบสิทธิ์จากระบบฐานข้อมูลกรมธนารักษ์",
                badge: "การรับรองข้อมูลทะเบียนกรมธนารักษ์",
              },
            ].map((feature, idx) => (
              <div key={feature.title} className="bg-[#0F1A30] border border-[#1E2E4A]/80 rounded-2xl p-6 hover:-translate-y-1 hover:border-trd-secondary/50 hover:shadow-[0_10px_25px_rgba(7,13,26,0.3)] transition-all duration-300 group">
                <div className="text-[9px] font-mono text-trd-secondary mb-3 uppercase tracking-widest font-black">
                  [ ระบบงานย่อยที่ ๐{idx + 1} ]
                </div>
                <div className="inline-block bg-purple-950/40 border border-purple-900/50 text-purple-300 text-[8px] font-black font-mono px-2.5 py-1 rounded-full tracking-widest uppercase mb-3 font-sans shadow-[0_0_10px_rgba(139,92,246,0.1)]">
                  {feature.badge}
                </div>
                <h3 className="text-sm font-black text-white mb-2 font-mono group-hover:text-trd-secondary-light transition-colors duration-200">
                  {feature.title}
                </h3>
                <p className="text-xs text-slate-300 leading-relaxed font-sans font-medium">
                  {feature.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Footer */}
      <section className="bg-hero-gradient border-b border-[#1E2E4A] py-24">
        <div className="max-w-4xl mx-auto text-center px-4">
          <span className="text-[9px] font-mono text-trd-secondary uppercase tracking-widest font-black">
            ขั้นตอนการเริ่มใช้งานระบบ
          </span>
          <h2 className="text-2xl font-black mb-4 font-sans tracking-wide text-white mt-1">พร้อมเริ่มต้นใช้งาน?</h2>
          <p className="text-slate-300 mb-8 text-xs max-w-md mx-auto leading-relaxed font-sans font-medium">
            เข้าสู่ระบบดิจิทัลด้วยบัญชีการยืนยันสิทธิ์ ThaID เพื่อเริ่มดำเนินการหรือวิเคราะห์ทำเลศักยภาพที่ราชพัสดุ
          </p>
          <Button 
            variant="primary" 
            size="lg" 
            className="font-mono text-xs uppercase tracking-widest font-black border border-transparent bg-gold-gradient text-[#0F1A30] rounded-xl shadow-neon-gold hover:opacity-90 transition-all duration-150 py-2.5 px-6"
            onClick={() => router.push("/login")}
          >
            ลงชื่อเข้าใช้งานผ่านระบบ ThaID
          </Button>
        </div>
      </section>
      {/* Create Listing Modal */}
      <CreateListingModal isOpen={isCreateOpen} onClose={() => setIsCreateOpen(false)} />
    </div>
  );
}

