"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { formatCurrency, latLngToUTM } from "@/lib/utils";
import FeeBreakdown from "@/components/features/FeeModal/FeeBreakdown";

interface PropertyCardProps {
  id: string;
  price: number;
  province: string;
  district: string;
  landArea: number;
  imageUrl?: string;
  imageUrls?: string[];
  isVerified: boolean; // มาจากสถานะ Smart Validation
  buildingType?: string | null;
  usableAreaSqm?: number | null;
  zoning?: string | null;
  locationLat?: number | null;
  locationLng?: number | null;
  annualRent?: number;
}

const IMAGE_LABELS = [
  "ด้านหน้าอาคาร/ที่ดิน",
  "มุมสูง Aerial GIS",
  "ทางเข้าติดถนนใหญ่",
  "ภายใน/พื้นที่ใช้สอย",
  "แปลงข้างเคียง",
  "ผังแสดงตำแหน่ง",
];

export default function PropertyCard({
  id,
  price,
  province,
  district,
  landArea,
  imageUrl,
  imageUrls = [],
  isVerified,
  buildingType,
  usableAreaSqm,
  zoning,
  locationLat,
  locationLng,
  annualRent = 12000,
}: PropertyCardProps) {
  const [isFeeOpen, setIsFeeOpen] = useState(false);
  const [currentImgIndex, setCurrentImgIndex] = useState(0);

  const imagesList = imageUrls.length > 0 ? imageUrls : imageUrl ? [imageUrl] : [];
  const estimatedFee = annualRent * 6.0;

  const handlePrevImage = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setCurrentImgIndex((prev) => (prev === 0 ? imagesList.length - 1 : prev - 1));
  };

  const handleNextImage = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setCurrentImgIndex((prev) => (prev === imagesList.length - 1 ? 0 : prev + 1));
  };

  const getZoningColorClass = (zoneText: string | null | undefined) => {
    if (!zoneText) return "border-[#1E2E4A] text-slate-400 bg-[#070D1A]/45";
    if (zoneText.includes("สีแดง")) return "border-red-900/50 text-red-300 bg-red-950/40";
    if (zoneText.includes("สีเหลือง")) return "border-amber-900/50 text-amber-300 bg-amber-950/40";
    if (zoneText.includes("สีส้ม")) return "border-orange-900/50 text-orange-300 bg-orange-950/40";
    if (zoneText.includes("สีม่วง")) return "border-purple-900/50 text-purple-300 bg-purple-950/40";
    return "border-emerald-900/50 text-emerald-300 bg-emerald-950/40";
  };

  const currentSrc = imagesList[currentImgIndex] || imageUrl || "";
  const currentLabel = IMAGE_LABELS[currentImgIndex % IMAGE_LABELS.length];

  return (
    <div className="group relative bg-[#0F1A30] border border-[#1E2E4A]/80 overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:border-trd-secondary/50 hover:shadow-[0_12px_35px_rgba(7,13,26,0.4)] flex flex-col font-sans rounded-2xl">
      
      {/* Image Carousel & Verification Badge */}
      <div className="relative h-48 w-full overflow-hidden border-b border-[#1E2E4A]/60 bg-[#070D1A]">
        {currentSrc ? (
          <Image
            src={currentSrc}
            alt={`ที่ราชพัสดุ ${district} ${province}`}
            fill
            className="object-cover transform transition-transform duration-500 group-hover:scale-105"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        ) : (
          <div className="absolute inset-0 bg-[#0F1A30] flex flex-col items-center justify-center gap-2">
            <svg className="w-10 h-10 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <span className="text-slate-600 text-[9px] font-mono uppercase tracking-widest font-bold">ไม่มีรูปภาพ</span>
          </div>
        )}

        {/* Verification Status Badge */}
        {isVerified && (
          <div className="absolute top-3 left-3 bg-[#0F1A30]/95 backdrop-blur-sm border border-trd-secondary/40 text-trd-secondary text-[8px] font-black font-mono px-2.5 py-1 rounded-full tracking-widest uppercase shadow-neon-gold z-10">
            [ผ่านการตรวจสอบสิทธิ์ธนารักษ์]
          </div>
        )}

        {/* Carousel Overlay Controls for 6 Images */}
        {imagesList.length > 1 && (
          <>
            {/* Image Category Badge & Count */}
            <div className="absolute bottom-2 left-2 right-2 flex items-center justify-between z-10 pointer-events-none">
              <span className="bg-[#070D1A]/85 backdrop-blur-md border border-[#1E2E4A] text-white text-[9px] font-mono font-bold px-2 py-0.5 rounded-md truncate max-w-[170px]">
                📷 {currentImgIndex + 1}. {currentLabel}
              </span>
              <span className="bg-[#0F1A30]/90 backdrop-blur-md border border-trd-secondary/30 text-trd-secondary font-mono text-[9px] font-black px-2 py-0.5 rounded-full">
                {currentImgIndex + 1} / {imagesList.length}
              </span>
            </div>

            {/* Prev / Next Arrows */}
            <button
              type="button"
              onClick={handlePrevImage}
              className="absolute left-2 top-1/2 -translate-y-1/2 bg-[#070D1A]/80 hover:bg-trd-secondary text-white hover:text-[#0F1A30] w-7 h-7 rounded-full flex items-center justify-center border border-[#1E2E4A] transition-all opacity-0 group-hover:opacity-100 z-20 shadow-lg active:scale-95"
              aria-label="รูปก่อนหน้า"
            >
              ❮
            </button>
            <button
              type="button"
              onClick={handleNextImage}
              className="absolute right-2 top-1/2 -translate-y-1/2 bg-[#070D1A]/80 hover:bg-trd-secondary text-white hover:text-[#0F1A30] w-7 h-7 rounded-full flex items-center justify-center border border-[#1E2E4A] transition-all opacity-0 group-hover:opacity-100 z-20 shadow-lg active:scale-95"
              aria-label="รูปถัดไป"
            >
              ❯
            </button>
          </>
        )}
      </div>

      {/* Details Area */}
      <div className="p-5 flex flex-col flex-grow space-y-4">
        
        {/* Title & Spatial coordinates */}
        <div>
          <span className="text-[9px] font-mono text-trd-secondary uppercase tracking-widest font-black block">
            พิกัดรายจังหวัด // {province}
          </span>
          <Link href={`/listings/${id}`}>
            <h3 className="text-white font-black text-base leading-tight mt-1 group-hover:text-trd-secondary-light transition-colors duration-200 cursor-pointer">
              {district}, {province}
            </h3>
          </Link>
          
          {/* Coordinates representation in UTM System & Google Maps Lat, Long */}
          {locationLat && locationLng ? (
            <div className="text-[9px] font-mono text-slate-300 mt-1.5 uppercase tracking-wider bg-[#070D1A]/50 py-1 px-2.5 border border-[#1E2E4A] inline-block rounded-xl font-bold">
              พิกัดแผนที่ (Google Maps / UTM) // {latLngToUTM(locationLat, locationLng)}
            </div>
          ) : (
            <div className="text-[9px] font-mono text-slate-400 mt-1.5 uppercase tracking-wider bg-[#070D1A]/50 py-1 px-2.5 border border-[#1E2E4A] inline-block rounded-xl font-bold">
              พิกัดภูมิศาสตร์ // อยู่ระหว่างการรังวัด
            </div>
          )}
        </div>

        {/* Specifications Grid */}
        <div className="grid grid-cols-2 gap-2 text-xs py-3 border-y border-[#1E2E4A]/80 font-mono">
          <div className="bg-[#070D1A]/60 p-2.5 rounded-xl border border-[#1E2E4A]/60">
            <span className="text-[9px] text-slate-400 block uppercase font-bold">ขนาดเนื้อที่ดิน</span>
            <span className="text-white font-black text-xs mt-0.5 block">{landArea} ตร.ว.</span>
          </div>

          <div className="bg-[#070D1A]/60 p-2.5 rounded-xl border border-[#1E2E4A]/60">
            <span className="text-[9px] text-slate-400 block uppercase font-bold">ประเภทสิ่งปลูกสร้าง</span>
            <span className="text-white font-black text-xs mt-0.5 block truncate">
              {buildingType || "ที่ดินเปล่า"}
            </span>
          </div>
        </div>

        {/* Zoning Badge */}
        {zoning && (
          <div>
            <span className={`inline-block text-[9px] font-mono font-bold px-2.5 py-1 rounded-lg border uppercase tracking-wider ${getZoningColorClass(zoning)}`}>
              ผังเมือง: {zoning}
            </span>
          </div>
        )}

        {/* Pricing Footer */}
        <div className="pt-2 flex items-end justify-between mt-auto">
          <div>
            <span className="text-[9px] font-mono text-slate-400 uppercase tracking-widest block font-bold">
              ราคาเสนอขายสิทธิ์
            </span>
            <span className="text-xl font-black text-white font-mono tracking-tight text-gold-gradient">
              {formatCurrency(price)}
            </span>
          </div>

          {/* Action Link & Fee Modal Button */}
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={(e) => {
                e.preventDefault();
                setIsFeeOpen(true);
              }}
              className="text-[9px] font-mono text-trd-secondary hover:text-white bg-[#070D1A] hover:bg-[#1E2E4A] border border-trd-secondary/40 px-2.5 py-1.5 rounded-xl font-bold transition-all"
            >
              คำนวณค่าธรรมเนียม
            </button>
            <Link
              href={`/listings/${id}`}
              className="bg-trd-secondary hover:bg-trd-secondary-light text-[#0F1A30] font-mono text-xs font-black px-3.5 py-1.5 rounded-xl transition-all shadow-md active:scale-95"
            >
              รายละเอียด
            </Link>
          </div>
        </div>

      </div>

      {/* Fee Breakdown Modal */}
      {isFeeOpen && (
        <FeeBreakdown
          isOpen={isFeeOpen}
          onClose={() => setIsFeeOpen(false)}
          askingPrice={price}
          estimatedFee={estimatedFee}
          annualRent={annualRent}
        />
      )}
    </div>
  );
}
