"use client";

import { useState } from "react";
import Image from "next/image";
import { formatCurrency } from "@/lib/utils";
import FeeBreakdown from "@/components/features/FeeModal/FeeBreakdown";

interface PropertyCardProps {
  id: string;
  price: number;
  province: string;
  district: string;
  landArea: number;
  imageUrl: string;
  isVerified: boolean; // มาจากสถานะ Smart Validation
  buildingType?: string | null;
  usableAreaSqm?: number | null;
  zoning?: string | null;
  locationLat?: number | null;
  locationLng?: number | null;
  annualRent?: number;
}

export default function PropertyCard({
  id,
  price,
  province,
  district,
  landArea,
  imageUrl,
  isVerified,
  buildingType,
  usableAreaSqm,
  zoning,
  locationLat,
  locationLng,
  annualRent = 12000,
}: PropertyCardProps) {
  const [isFeeOpen, setIsFeeOpen] = useState(false);
  const estimatedFee = annualRent * 6.0;  // Parse color mapping for Zoning without emoji
  const getZoningColorClass = (zoneText: string | null | undefined) => {
    if (!zoneText) return "border-[#1E2E4A] text-slate-400 bg-[#070D1A]/45";
    if (zoneText.includes("สีแดง")) return "border-red-900/50 text-red-300 bg-red-950/40";
    if (zoneText.includes("สีเหลือง")) return "border-amber-900/50 text-amber-300 bg-amber-950/40";
    if (zoneText.includes("สีส้ม")) return "border-orange-900/50 text-orange-300 bg-orange-950/40";
    if (zoneText.includes("สีม่วง")) return "border-purple-900/50 text-purple-300 bg-purple-950/40";
    return "border-emerald-900/50 text-emerald-300 bg-emerald-950/40";
  };

  return (
    <div className="group relative bg-[#0F1A30] border border-[#1E2E4A]/80 overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:border-trd-secondary/50 hover:shadow-[0_12px_35px_rgba(7,13,26,0.4)] flex flex-col font-sans rounded-2xl">
      
      {/* Image & Verification Badge */}
      <div className="relative h-44 w-full overflow-hidden border-b border-[#1E2E4A]/60">
        <Image 
          src={imageUrl} 
          alt={`ที่ราชพัสดุ ${district} ${province}`} 
          fill 
          className="object-cover transform transition-transform duration-500 group-hover:scale-105"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
        {isVerified && (
          <div className="absolute top-3 left-3 bg-[#0F1A30]/95 backdrop-blur-sm border border-trd-secondary/40 text-trd-secondary text-[8px] font-black font-mono px-2.5 py-1 rounded-full tracking-widest uppercase shadow-neon-gold">
            [ผ่านการตรวจสอบสิทธิ์ธนารักษ์]
          </div>
        )}
      </div>

      {/* Details Area */}
      <div className="p-5 flex flex-col flex-grow space-y-4">
        
        {/* Title & Spatial coordinates */}
        <div>
          <span className="text-[9px] font-mono text-trd-secondary uppercase tracking-widest font-black block">
            พิกัดรายจังหวัด // {province}
          </span>
          <h3 className="text-white font-black text-base leading-tight mt-1 group-hover:text-trd-secondary-light transition-colors duration-200">
            {district}, {province}
          </h3>
          
          {/* Coordinates representation */}
          {locationLat && locationLng ? (
            <div className="text-[9px] font-mono text-slate-300 mt-1.5 uppercase tracking-wider bg-[#070D1A]/50 py-1 px-2.5 border border-[#1E2E4A] inline-block rounded-xl font-bold">
              พิกัดภูมิศาสตร์ // {locationLat.toFixed(4)}° N, {locationLng.toFixed(4)}° E
            </div>
          ) : (
            <div className="text-[9px] font-mono text-slate-400 mt-1.5 uppercase tracking-wider bg-[#070D1A]/50 py-1 px-2.5 border border-[#1E2E4A] inline-block rounded-xl font-bold">
              พิกัดภูมิศาสตร์ // อยู่ระหว่างการรังวัด
            </div>
          )}
        </div>

        {/* Technical Specification Matrix */}
        <div className="grid grid-cols-2 gap-2.5 text-xs font-mono border-t border-b border-[#1E2E4A]/40 py-3.5 bg-[#070D1A]/20 px-3 rounded-xl">
          <div>
            <span className="text-slate-400 block text-[8px] font-bold uppercase tracking-widest">เนื้อที่ดิน</span>
            <span className="text-white font-black">{landArea.toLocaleString()} ตร.ว.</span>
          </div>
          <div>
            <span className="text-slate-400 block text-[8px] font-bold uppercase tracking-widest">ลักษณะสิ่งปลูกสร้าง</span>
            <span className="text-white font-black truncate block">{buildingType || "ที่ดินเปล่า"}</span>
          </div>
          <div className="col-span-2 pt-2 border-t border-[#1E2E4A]/30">
            <span className="text-slate-400 block text-[8px] font-bold uppercase tracking-widest">เขตการใช้ประโยชน์ที่ดิน</span>
            <span className={`inline-block px-1.5 py-0.5 border text-[8px] font-black uppercase tracking-widest rounded-lg ${getZoningColorClass(zoning)}`}>
              {zoning ? zoning.replace("พื้นที่", "") : "ไม่ระบุข้อมูลผังเมือง"}
            </span>
          </div>
        </div>

        {/* Price & Fee Estimation */}
        <div className="pt-1 mt-auto space-y-3">
          <div className="flex justify-between items-end">
            <div>
              <p className="text-[8px] font-mono text-slate-400 uppercase tracking-widest font-bold">ราคาเสนอโอน</p>
              <p className="text-lg font-black text-white font-mono leading-none">
                {formatCurrency(price)}
              </p>
            </div>
            
            <a
              href={`/listings/${id}`}
              className="bg-gold-gradient border border-transparent text-[#0F1A30] text-[10px] font-mono uppercase tracking-widest font-black py-1.5 px-3 rounded-xl shadow-neon-gold hover:opacity-90 hover:scale-[1.03] active:scale-[0.98] transition-all duration-250"
            >
              รายละเอียดเพิ่มเติม
            </a>
          </div>

          {/* Fee Estimator link to modal */}
          <div className="bg-[#070D1A]/40 p-2.5 border border-[#1E2E4A]/60 flex justify-between items-center text-[9px] font-mono rounded-xl">
            <span className="text-slate-300 font-bold">ค่าธรรมเนียมประเมิน: <strong className="text-trd-secondary">{formatCurrency(estimatedFee)}</strong></span>
            <button
              onClick={() => setIsFeeOpen(true)}
              className="text-trd-secondary hover:text-trd-secondary-light hover:underline uppercase tracking-widest font-black text-[8px]"
            >
              [แจงรายการ]
            </button>
          </div>
        </div>
      </div>

      {/* Fee Breakdown Modal */}
      <FeeBreakdown 
        isOpen={isFeeOpen} 
        onClose={() => setIsFeeOpen(false)} 
        askingPrice={price} 
        estimatedFee={estimatedFee} 
        annualRent={annualRent}
      />
    </div>
  );
}
