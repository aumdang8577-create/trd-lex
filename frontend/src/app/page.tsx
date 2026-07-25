"use client";

import { useState, Suspense } from "react";
import { useRouter } from "next/navigation";
import Button from "@/components/ui/Button";
import SearchBar from "@/components/features/SearchBar/SearchBar";
import PropertyCard from "@/components/features/PropertyCard";
import CreateListingModal from "@/components/features/CreateListingModal";
import EconomicDashboard from "@/components/features/EconomicDashboard";
import HeroSection from "@/components/features/HeroSection/HeroSection";
import PropertyCardSkeleton from "@/components/ui/PropertyCardSkeleton";
import FetchErrorAlert from "@/components/ui/FetchErrorAlert";
import { useFeaturedListings } from "@/lib/hooks/useListings";
import type { Listing } from "@/types";

const defaultMockListings: Listing[] = [
  {
    id: "list-1",
    sellerId: "seller-1",
    seller: { id: "seller-1", thaid_id: "1123456789012", first_name: "สมชาย", last_name: "ใจดี", role: "USER" },
    contractId: "contract-1",
    contract: {
      id: "contract-1",
      contract_number: "TRD-66-001",
      parcel_number: "อด.1234",
      location_lat: 17.4138,
      location_lng: 102.7872,
      province: "อุดรธานี",
      district: "เมืองอุดรธานี",
      sub_district: "หมากแข้ง",
      land_area_sqw: 120.0,
      is_active: true,
      building_type: "อาคารพาณิชย์",
      usable_area_sqm: 250.0,
      zoning: "พื้นที่สีแดง (พาณิชยกรรม)",
      annual_rent: 12000.0,
    },
    asking_price: 1500000.0,
    estimated_fee: 45000.0,
    description: "สิทธิ์การเช่าที่ดินเพื่อการพาณิชย์ ทำเลทองเมืองอุดรธานี ใกล้เซ็นทรัลอุดรธานี เหมาะทำร้านค้าหรือสำนักงานขนาดเล็ก เดินทางสะดวกติดถนนใหญ่สภาพแวดล้อมดีเยี่ยม",
    image_urls: ["/images/images (7).jpg"],
    status: "ACTIVE",
    createdAt: "2026-07-09T00:00:00Z",
    updatedAt: "2026-07-09T00:00:00Z",
  },
  {
    id: "list-2",
    sellerId: "seller-2",
    seller: { id: "seller-2", thaid_id: "2123456789012", first_name: "สมหญิง", last_name: "รักดี", role: "USER" },
    contractId: "contract-2",
    contract: {
      id: "contract-2",
      contract_number: "TRD-66-002",
      parcel_number: "ขก.5678",
      location_lat: 16.4322,
      location_lng: 102.8236,
      province: "ขอนแก่น",
      district: "เมืองขอนแก่น",
      sub_district: "ในเมือง",
      land_area_sqw: 80.0,
      is_active: true,
      building_type: "บ้านพักอาศัย",
      usable_area_sqm: 140.0,
      zoning: "พื้นที่สีเหลือง (ที่อยู่อาศัยหนาแน่นน้อย)",
      annual_rent: 12000.0,
    },
    asking_price: 980000.0,
    estimated_fee: 29400.0,
    description: "แปลงที่ดินราชพัสดุในเมืองขอนแก่น ทำเลพักอาศัย เงียบสงบ ใกล้วัดหนองแวงและบึงแก่นนคร เดินทางสะดวกมีสาธารณูปโภคครบครัน เหมาะสำหรับสร้างบ้านเดี่ยวหรือบ้านพักตากอากาศส่วนตัว",
    image_urls: ["/images/images (1).jpg"],
    status: "ACTIVE",
    createdAt: "2026-07-09T00:00:00Z",
    updatedAt: "2026-07-09T00:00:00Z",
  },
  {
    id: "list-3",
    sellerId: "seller-3",
    seller: { id: "seller-3", thaid_id: "3123456789012", first_name: "ประยุทธ์", last_name: "มั่งมี", role: "USER" },
    contractId: "contract-3",
    contract: {
      id: "contract-3",
      contract_number: "TRD-66-003",
      parcel_number: "นค.1507",
      location_lat: 17.8776,
      location_lng: 102.7435,
      province: "หนองคาย",
      district: "เมืองหนองคาย",
      sub_district: "ในเมือง",
      land_area_sqw: 3677.44,
      is_active: true,
      building_type: "อาคารพาณิชย์",
      usable_area_sqm: 350.0,
      zoning: "พื้นที่สีแดง (พาณิชยกรรม)",
      annual_rent: 12000.0,
    },
    asking_price: 2400000.0,
    estimated_fee: 72000.0,
    description: "สิทธิ์การเช่าระยะยาวใกล้ริมแม่น้ำโขง เมืองหนองคาย เหมาะสำหรับทำร้านอาหารหรือโฮมสเตย์รองรับนักท่องเที่ยวริมโขงและตลาดท่าเสด็จ แปลงมุมหน้ากว้างสวยงาม",
    image_urls: ["/images/images (8).jpg"],
    status: "ACTIVE",
    createdAt: "2026-07-09T00:00:00Z",
    updatedAt: "2026-07-09T00:00:00Z",
  }
];

export default function HomePage() {
  const router = useRouter();
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  
  // Use SWR hook for featured listings
  const { listings, isLoading, error, mutate } = useFeaturedListings(3);
  const displayListings = listings.length > 0 ? listings : defaultMockListings;

  return (
    <div className="bg-trd-bg text-trd-primary min-h-screen">
      {/* Hero Section */}
      <HeroSection />

      {/* SearchBar Container */}
      <section id="stats-section" className="relative z-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-12 md:-mt-16 mb-12">
        <div className="bg-[#0F1A30]/90 backdrop-blur-xl border border-[#1E2E4A] p-4 md:p-6 rounded-2xl shadow-2xl">
          <Suspense fallback={<div className="h-16 w-full bg-slate-900/60 rounded-2xl animate-pulse" />}>
            <SearchBar />
          </Suspense>
        </div>
      </section>

      {/* Stats Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
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

        {error && (
          <div className="mb-8">
            <FetchErrorAlert onRetry={() => mutate()} />
          </div>
        )}

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <PropertyCardSkeleton count={3} />
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {displayListings.map((listing) => (
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
                annualRent={listing.contract.annual_rent}
              />
            ))}
          </div>
        )}
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
                title: "สืบค้นประกาศหาผู้รับโอนสิทธิ",
                desc: "สืบค้นและตรวจสอบสถานะประกาศโอนสิทธิเช่าที่ราชพัสดุแบบอัตโนมัติ ลดเวลาดำเนินการด้วยมือ",
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
