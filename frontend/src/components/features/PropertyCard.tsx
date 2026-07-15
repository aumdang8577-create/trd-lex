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
}: PropertyCardProps) {
  const [isFeeOpen, setIsFeeOpen] = useState(false);
  const estimatedFee = price * 0.03; // 3% estimation

  // Parse color mapping for Zoning without emoji
  const getZoningColorClass = (zoneText: string | null | undefined) => {
    if (!zoneText) return "border-slate-800 text-slate-400 bg-slate-950/20";
    if (zoneText.includes("สีแดง")) return "border-val-e/30 text-val-e bg-val-e/10";
    if (zoneText.includes("สีเหลือง")) return "border-val-l/30 text-val-l bg-val-l/10";
    if (zoneText.includes("สีส้ม")) return "border-orange-500/30 text-orange-400 bg-orange-950/20";
    if (zoneText.includes("สีม่วง")) return "border-val-u/30 text-val-u bg-val-u/10";
    return "border-val-v/30 text-val-v bg-val-v/10";
  };

  return (
    <div className="group relative bg-slate-900/60 backdrop-blur-md border border-slate-800/80 overflow-hidden transition-all duration-350 hover:-translate-y-1 hover:border-slate-700/80 hover:shadow-[0_0_30px_rgba(59,130,246,0.06)] flex flex-col font-sans rounded-2xl">
      
      {/* Image & Verification Badge */}
      <div className="relative h-44 w-full overflow-hidden border-b border-slate-800/80">
        <Image 
          src={imageUrl} 
          alt={`ที่ราชพัสดุ ${district} ${province}`} 
          fill 
          className="object-cover transform transition-transform duration-500 group-hover:scale-105"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
        {isVerified && (
          <div className="absolute top-3 left-3 bg-val-v/10 border border-val-v/30 text-val-v text-[8px] font-black font-mono px-2 py-0.5 rounded-full tracking-widest uppercase shadow-[0_0_10px_rgba(16,185,129,0.2)]">
            [ผ่านการตรวจสอบสิทธิ์ธนารักษ์]
          </div>
        )}
      </div>

      {/* Details Area */}
      <div className="p-5 flex flex-col flex-grow space-y-4">
        
        {/* Title & Spatial coordinates */}
        <div>
          <span className="text-[9px] font-mono text-trd-primary uppercase tracking-widest font-black block">
            พิกัดรายจังหวัด // {province}
          </span>
          <h3 className="text-white font-black text-base leading-tight mt-1">
            {district}, {province}
          </h3>
          
          {/* Coordinates representation */}
          {locationLat && locationLng ? (
            <div className="text-[9px] font-mono text-trd-primary mt-1.5 uppercase tracking-wider bg-slate-950/60 py-1 px-2.5 border border-slate-800/85 inline-block rounded-xl font-bold">
              พิกัดภูมิศาสตร์ // {locationLat.toFixed(4)}° N, {locationLng.toFixed(4)}° E
            </div>
          ) : (
            <div className="text-[9px] font-mono text-trd-primary mt-1.5 uppercase tracking-wider bg-slate-950/60 py-1 px-2.5 border border-slate-800/85 inline-block rounded-xl font-bold">
              พิกัดภูมิศาสตร์ // อยู่ระหว่างการรังวัด
            </div>
          )}
        </div>

        {/* Technical Specification Matrix */}
        <div className="grid grid-cols-2 gap-2.5 text-xs font-mono border-t border-b border-slate-800/80 py-3.5 bg-slate-950/40 px-3 rounded-xl">
          <div>
            <span className="text-slate-400 block text-[8px] font-bold uppercase tracking-widest">เนื้อที่ดิน</span>
            <span className="text-white font-black">{landArea.toLocaleString()} ตร.ว.</span>
          </div>
          <div>
            <span className="text-slate-400 block text-[8px] font-bold uppercase tracking-widest">ลักษณะสิ่งปลูกสร้าง</span>
            <span className="text-white font-black truncate block">{buildingType || "ที่ดินเปล่า"}</span>
          </div>
          <div className="col-span-2 pt-2 border-t border-slate-800/40">
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
              className="bg-trd-primary hover:bg-trd-primary-dark border border-slate-850 text-white text-[10px] font-mono uppercase tracking-widest font-black py-1.5 px-3 rounded-xl shadow-[0_0_12px_rgba(59,130,246,0.2)] hover:shadow-[0_0_18px_rgba(59,130,246,0.3)] transition-all duration-200"
            >
              รายละเอียดเพิ่มเติม
            </a>
          </div>

          {/* Fee Estimator link to modal */}
          <div className="bg-slate-950/60 p-2.5 border border-slate-800 flex justify-between items-center text-[9px] font-mono rounded-xl">
            <span className="text-slate-400 font-bold">ค่าธรรมเนียมประเมิน: <strong className="text-white">{formatCurrency(estimatedFee)}</strong></span>
            <button
              onClick={() => setIsFeeOpen(true)}
              className="text-trd-primary hover:underline uppercase tracking-widest font-black text-[8px]"
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
      />
    </div>
  );
}
