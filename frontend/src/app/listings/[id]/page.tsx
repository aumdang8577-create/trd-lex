"use client";

import { useState, use, useEffect } from "react";
import Image from "next/image";
import Button from "@/components/ui/Button";
import Badge from "@/components/ui/Badge";
import Card, { CardContent } from "@/components/ui/Card";
import LeaseMap from "@/components/features/Map/LeaseMap";
import Breadcrumb from "@/components/features/Breadcrumb";
import Link from "next/link";
import { formatCurrency } from "@/lib/utils";
import type { Listing } from "@/types";
import api from "@/lib/api";

const mockListings: Record<string, Listing> = {
  "list-1": {
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
      annual_rent: 18000.0,
    },
    asking_price: 1500000,
    estimated_fee: 45000,
    description: "สิทธิ์การเช่าที่ดินเพื่อการพาณิชย์ ทำเลทองพญาไท ใกล้รถไฟฟ้า เหมาะทำร้านกาแฟหรือโชว์รูมสินค้าขนาดเล็ก เดินทางสะดวกติดถนนใหญ่สภาพแวดล้อมดีเยี่ยม",
    image_urls: [
      "https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=600&q=80"
    ],
    status: "ACTIVE",
    createdAt: "2026-07-09T00:00:00Z",
    updatedAt: "2026-07-09T00:00:00Z",
  },
  "list-2": {
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
      annual_rent: 24000.0,
    },
    asking_price: 980000,
    estimated_fee: 29400,
    description: "แปลงที่ดินราชพัสดุพัทยาใต้ ทำเลพักอาศัย เงียบสงบ ใกล้สิ่งอำนวยความสะดวกมากมาย เหมาะสำหรับสร้างบ้านเดี่ยวหรือบ้านพักตากอากาศส่วนตัว",
    image_urls: [
      "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1200&q=80"
    ],
    status: "ACTIVE",
    createdAt: "2026-07-09T00:00:00Z",
    updatedAt: "2026-07-09T00:00:00Z",
  },
  "list-3": {
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
      annual_rent: 15000.0,
    },
    asking_price: 2400000,
    estimated_fee: 72000,
    description: "สิทธิ์การเช่าระยะยาวสำหรับทำธุรกิจเกสท์เฮ้าส์หรือร้านอาหารในเขตคูเมืองเก่าเชียงใหม่ ดึงดูดนักท่องเที่ยวต่างชาติได้ดีเยี่ยม แปลงมุมหน้ากว้างสวยงาม",
    image_urls: [
      "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=1200&q=80"
    ],
    status: "ACTIVE",
    createdAt: "2026-07-09T00:00:00Z",
    updatedAt: "2026-07-09T00:00:00Z",
  }
};

interface PropertyDetailPageProps {
  params: Promise<{ id: string }>;
}

export default function PropertyDetailPage({ params }: PropertyDetailPageProps) {
  const { id } = use(params);
  const listing = mockListings[id] || mockListings["list-1"];
  const [requestSuccess, setRequestSuccess] = useState(false);
  const [calcType, setCalcType] = useState<"GENERAL" | "FAMILY" | "CO_LESSEE">("GENERAL");
  const [calcShare, setCalcShare] = useState<number>(100);
  const [calcResult, setCalcResult] = useState<{
    annual_rent: number;
    base_fee: number;
    discount_description: string;
    final_fee: number;
  } | null>(null);

  useEffect(() => {
    const calculateOfficialFee = async () => {
      try {
        const res = await api.calculateTransferFee({
          annual_rent: listing.contract.annual_rent || 12000.0,
          transfer_type: calcType,
          transfer_share: calcType === "CO_LESSEE" ? calcShare : 100,
          contract_number: listing.contract.contract_number
        });
        setCalcResult(res);
      } catch (err) {
        console.error("Error calculating official fee via API, using frontend fallback:", err);
        // Fallback calculation logic matching the backend rules
        const rent = listing.contract.annual_rent || 12000.0;
        const base = rent * 6.0;
        let final = base;
        let desc = "คิดอัตราปกติ (6 เท่าของค่าเช่ารายปี)";

        if (calcType === "FAMILY") {
          final = base * 0.25;
          desc = "ได้รับสิทธิลดหย่อนร้อยละ 75 (โอนให้ทายาท/คู่สมรส)";
        } else if (calcType === "CO_LESSEE") {
          const ratio = calcShare / 100.0;
          final = base * ratio;
          desc = `คิดตามสัดส่วนสิทธิที่โอน (${calcShare}%) ระหว่างผู้เช่าร่วม`;
        }

        setCalcResult({
          annual_rent: rent,
          base_fee: base,
          discount_description: desc,
          final_fee: final
        });
      }
    };
    calculateOfficialFee();
  }, [calcType, calcShare, listing]);

  // Fee calculation
  const transferFee = listing.asking_price * 0.02;
  const stampDuty = listing.asking_price * 0.005;
  const adminFee = listing.asking_price * 0.005;
  const totalFee = transferFee + stampDuty + adminFee;

  const handleRequestTransfer = () => {
    setRequestSuccess(true);
    setTimeout(() => setRequestSuccess(false), 3000);
  };

  const getRegionName = (prov: string) => {
    if (prov === "อุดรธานี" || prov === "ขอนแก่น") return "ภาคตะวันออกเฉียงเหนือ";
    if (["เชียงใหม่", "ตาก"].includes(prov)) return "ภาคเหนือ";
    if (["ชลบุรี", "ระยอง"].includes(prov)) return "ภาคตะวันออก";
    return "ภาคกลาง";
  };

  const breadcrumbItems = [
    { label: "ค้นหาทำเลศักยภาพ", href: "/listings" },
    { label: getRegionName(listing.contract.province), href: `/listings?query=${getRegionName(listing.contract.province)}` },
    { label: listing.contract.province, href: `/listings?province=${listing.contract.province}` },
    { label: `อ. ${listing.contract.district}`, href: `/listings?query=${listing.contract.district}` },
    { label: `สัญญาเช่าเลขที่ ${listing.contract.contract_number}` }
  ];

  return (
    <>
      <Breadcrumb items={breadcrumbItems} />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Back link */}
        <Link href="/listings" className="inline-flex items-center gap-1.5 text-xs text-trd-primary font-medium hover:underline mb-6">
          ← ย้อนกลับไปหน้าค้นหา
        </Link>

      {/* Main Image Banner Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8 h-[350px] md:h-[450px]">
        <div className="md:col-span-2 relative h-full w-full rounded-2xl overflow-hidden shadow-sm">
          <Image
            src={listing.image_urls[0]}
            alt={`ภาพแปลงที่ดิน ${listing.contract.parcel_number}`}
            fill
            className="object-cover"
            priority
            sizes="(max-width: 768px) 100vw, 66vw"
          />
        </div>
        <div className="hidden md:flex flex-col gap-4 h-full">
          {listing.image_urls[1] ? (
            <div className="relative flex-1 w-full rounded-2xl overflow-hidden shadow-sm">
              <Image
                src={listing.image_urls[1]}
                alt="ภาพแปลงที่ดินเพิ่มเติม"
                fill
                className="object-cover"
                sizes="33vw"
              />
            </div>
          ) : (
            <div className="relative flex-1 w-full rounded-2xl overflow-hidden shadow-sm bg-gray-50 flex items-center justify-center text-gray-300 border border-trd-border">
              <span>ไม่มีรูปภาพเพิ่มเติม</span>
            </div>
          )}
          <div className="relative flex-1 w-full rounded-2xl overflow-hidden shadow-sm">
            <LeaseMap listings={[listing]} center={[listing.contract.location_lat, listing.contract.location_lng]} zoom={14} className="!h-full !rounded-none !border-none" />
          </div>
        </div>
      </div>

      {/* Layout Split: Content vs Sticky Sidebar */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Details */}
        <div className="lg:col-span-8 space-y-8">
          <div>
            <div className="flex items-center gap-3 mb-3">
              <Badge variant="valid">เปิดเสนอขาย</Badge>
              <span className="trd-verified-badge text-[10px]">
                ✅ Verified by TRD (Smart Validation)
              </span>
            </div>
            <h1 className="text-3xl font-bold text-trd-primary leading-tight">
              สิทธิ์การเช่าที่ดินราชพัสดุ อำเภอ{listing.contract.district}, จังหวัด{listing.contract.province}
            </h1>
            <p className="text-gray-500 mt-2">
              เลขที่สัญญาเช่า: {listing.contract.contract_number} • แปลงระวางหมายเลข: {listing.contract.parcel_number}
            </p>
          </div>

          {/* Quick Specs Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-4">
            {[
              { label: "ขนาดที่ดิน", val: `${listing.contract.land_area_sqw} ตร.ว.`, icon: "📐" },
              { label: "ประเภทอาคาร", val: listing.contract.building_type || "ที่ดินเปล่า", icon: "🏢" },
              { label: "พื้นที่ใช้สอย", val: listing.contract.usable_area_sqm && listing.contract.usable_area_sqm > 0 ? `${listing.contract.usable_area_sqm} ตร.ม.` : "ไม่มี (ที่ดินเปล่า)", icon: "🏗️" },
              { label: "ผังเมือง (Zoning)", val: listing.contract.zoning || "ไม่ระบุ", icon: "🎨" },
              { label: "จังหวัด", val: listing.contract.province, icon: "📍" },
              { label: "ระวางที่ดิน", val: listing.contract.parcel_number, icon: "🗺️" },
              { label: "สถานะสัญญา", val: "ปกติ (Active)", icon: "🛡️" },
            ].map((spec) => (
              <div key={spec.label} className="bg-gray-50/80 border border-trd-border/50 rounded-xl p-4 flex flex-col items-center justify-center text-center">
                <span className="text-2xl mb-1">{spec.icon}</span>
                <span className="text-[10px] text-gray-400 font-medium uppercase tracking-wider">{spec.label}</span>
                <span className="text-sm font-bold text-trd-primary mt-0.5">{spec.val}</span>
              </div>
            ))}
          </div>

          {/* Description */}
          <div className="border-t border-trd-border/50 pt-6">
            <h3 className="text-lg font-semibold text-trd-primary mb-3">รายละเอียดคำอธิบาย</h3>
            <p className="text-gray-600 leading-relaxed text-sm whitespace-pre-line">
              {listing.description}
            </p>
          </div>

          {/* Facilities / Infrastructure */}
          <div className="border-t border-trd-border/50 pt-6">
            <h3 className="text-lg font-semibold text-trd-primary mb-4">สิ่งอำนวยความสะดวกและระบบสาธารณูปโภค</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm text-gray-600">
              {[
                { title: "ระบบไฟฟ้าแรงดันต่ำ", check: true },
                { title: "ระบบน้ำประปาส่วนภูมิภาค", check: true },
                { title: "ติดถนนสาธารณะหลัก", check: true },
                { title: "ใกล้แหล่งชุมชนและร้านค้า", check: true },
              ].map((fac) => (
                <div key={fac.title} className="flex items-center gap-2">
                  <span className="text-status-valid">✓</span>
                  <span>{fac.title}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Pricing & Action Box (Sticky) */}
        <div className="lg:col-span-4 lg:sticky lg:top-24">
          <Card className="overflow-hidden border border-trd-border shadow-md">
            <div className="bg-trd-primary text-white p-6">
              <span className="text-xs text-white/70 block mb-1">ราคาเสนอโอนสิทธิ์</span>
              <h2 className="text-3xl font-extrabold text-trd-secondary">
                {formatCurrency(listing.asking_price)}
              </h2>
            </div>
            
            <CardContent className="p-6 space-y-6">
              {/* Fee Breakdown Table */}
              <div className="space-y-3">
                <h4 className="text-xs font-bold text-trd-primary uppercase tracking-wide border-b border-trd-border/50 pb-2">
                  โครงสร้างค่าธรรมเนียมโดยประมาณ (Fee Estimator)
                </h4>

                <div className="space-y-2 text-xs">
                  <div className="flex justify-between">
                    <span className="text-gray-500">1. ค่าธรรมเนียมการโอน (2.0%)</span>
                    <span className="font-semibold text-gray-800">{formatCurrency(transferFee)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">2. อากรแสตมป์ (0.5%)</span>
                    <span className="font-semibold text-gray-800">{formatCurrency(stampDuty)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">3. ค่าดำเนินการโอนกรรมสิทธิ์ (0.5%)</span>
                    <span className="font-semibold text-gray-800">{formatCurrency(adminFee)}</span>
                  </div>
                  
                  <div className="flex justify-between border-t border-trd-border/50 pt-2 font-bold text-sm text-trd-primary">
                    <span>ยอดรวมประมาณการ</span>
                    <span className="text-trd-secondary-dark">{formatCurrency(totalFee)}</span>
                  </div>
                </div>
              </div>

              {/* Official Transfer Fee Calculator */}
              <div className="border-t border-trd-border/50 pt-4 space-y-3">
                <h4 className="text-xs font-bold text-trd-primary uppercase tracking-wide border-b border-trd-border/50 pb-2 flex items-center justify-between">
                  <span>🧮 เครื่องคิดเลขประเมินค่าธรรมเนียม</span>
                  <span className="text-[10px] bg-trd-primary/10 text-trd-primary px-1.5 py-0.5 rounded">
                    ระเบียบราชการ
                  </span>
                </h4>
                
                <div className="space-y-2.5 text-xs">
                  <div>
                    <label className="block text-[10px] text-gray-400 font-semibold mb-1 uppercase">
                      ประเภทผู้รับโอน
                    </label>
                    <select
                      value={calcType}
                      title="เลือกประเภทผู้รับโอน"
                      onChange={(e) => setCalcType(e.target.value as any)}
                      className="w-full px-2.5 py-1.5 rounded border border-trd-border bg-white text-xs text-gray-700 focus:outline-none focus:ring-1 focus:ring-trd-primary"
                    >
                      <option value="GENERAL">บุคคลทั่วไป (อัตราปกติ)</option>
                      <option value="FAMILY">ครอบครัว/ทายาท/คู่สมรส (ลด 75%)</option>
                      <option value="CO_LESSEE">ผู้เช่าร่วมกัน (ตามสัดส่วน)</option>
                    </select>
                  </div>

                  {calcType === "CO_LESSEE" && (
                    <div>
                      <label className="block text-[10px] text-gray-400 font-semibold mb-1 uppercase flex justify-between">
                        <span>สัดส่วนที่โอนสิทธิ์</span>
                        <span className="text-trd-primary font-bold">{calcShare}%</span>
                      </label>
                      <input
                        type="range"
                        min="1"
                        max="100"
                        value={calcShare}
                        title="สัดส่วนการโอน"
                        onChange={(e) => setCalcShare(parseFloat(e.target.value))}
                        className="w-full h-1.5 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-trd-primary"
                      />
                    </div>
                  )}

                  <div className="bg-gray-50 rounded-lg p-3 border border-gray-100 space-y-1.5 mt-2">
                    <div className="flex justify-between text-[11px]">
                      <span className="text-gray-500">ค่าเช่ารายปี:</span>
                      <span className="font-semibold text-gray-700">
                        {listing.contract.annual_rent ? `฿${new Intl.NumberFormat("th-TH").format(listing.contract.annual_rent)} / ปี` : "ไม่ระบุ"}
                      </span>
                    </div>
                    {calcResult ? (
                      <>
                        <div className="flex justify-between text-[11px]">
                          <span className="text-gray-500">ฐานค่าธรรมเนียม (6 เท่า):</span>
                          <span className="font-semibold text-gray-700">
                            ฿{new Intl.NumberFormat("th-TH").format(calcResult.base_fee)}
                          </span>
                        </div>
                        <div className="text-[10px] text-status-valid font-medium bg-status-valid/5 px-2 py-0.5 rounded border border-status-valid/10 w-fit leading-relaxed">
                          💡 {calcResult.discount_description}
                        </div>
                        <div className="flex justify-between items-baseline border-t border-gray-200/55 pt-1.5 font-bold text-xs">
                          <span className="text-trd-primary">ค่าโอนสิทธิ์สุทธิ:</span>
                          <span className="text-base text-trd-secondary-dark font-extrabold">
                            ฿{new Intl.NumberFormat("th-TH").format(calcResult.final_fee)}
                          </span>
                        </div>
                      </>
                    ) : (
                      <div className="text-center text-[10px] text-gray-400 py-1">
                        กำลังคำนวณ...
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-3 pt-2">
                {requestSuccess && (
                  <div className="bg-status-valid/10 border border-status-valid/20 text-status-valid text-xs rounded-lg p-3 text-center">
                    ส่งคำขอสิทธิ์การโอน (Request to Transfer) สำเร็จ!
                  </div>
                )}
                <Button variant="primary" className="w-full py-3 text-sm font-semibold" onClick={handleRequestTransfer} disabled={requestSuccess}>
                  ส่งคำขอโอนสิทธิ์ (Request to Transfer)
                </Button>
                <Button variant="ghost" className="w-full py-2.5 text-xs text-gray-500">
                  📄 ดาวน์โหลดเอกสารเงื่อนไขสิทธิ์
                </Button>
              </div>

              {/* Seller details */}
              <div className="border-t border-trd-border/30 pt-4 text-center">
                <p className="text-[10px] text-gray-400">ผู้ถือสิทธิ์คนปัจจุบัน</p>
                <p className="text-xs font-semibold text-gray-700 mt-1">คุณ{listing.seller.first_name} {listing.seller.last_name}</p>
                <p className="text-[10px] text-status-valid mt-1">✓ ยืนยันตัวตนผ่าน ThaID เรียบร้อย</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  </>
  );
}
