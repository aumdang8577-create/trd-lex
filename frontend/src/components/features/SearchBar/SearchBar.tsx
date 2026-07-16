"use client";

import { useState } from "react";
import Button from "@/components/ui/Button";

interface SearchBarProps {
  onSearch?: (searchData: { province: string; district: string; minPrice: string; maxPrice: string; zoning: string }) => void;
  className?: string;
}

export default function SearchBar({ onSearch, className = "" }: SearchBarProps) {
  const [province, setProvince] = useState("");
  const [district, setDistrict] = useState("");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [zoning, setZoning] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (onSearch) {
      onSearch({ province, district, minPrice, maxPrice, zoning });
    }
  };

  // Common provinces for selection
  const provinces = [
    "อุดรธานี",
    "ขอนแก่น",
    "หนองคาย",
    "กรุงเทพมหานคร",
    "ชลบุรี",
    "เชียงใหม่",
  ];

  // Thai Zoning options
  const zones = [
    "พื้นที่สีแดง (พาณิชยกรรม)",
    "พื้นที่สีเหลือง (ที่อยู่อาศัยหนาแน่นน้อย)",
    "พื้นที่สีเขียว (เกษตรกรรม)",
    "พื้นที่สีม่วง (อุตสาหกรรม)",
  ];

  return (
    <form
      onSubmit={handleSubmit}
      className={`
        bg-slate-900/60 backdrop-blur-md border border-slate-800/85
        p-5 w-full max-w-5xl mx-auto
        grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 items-end
        shadow-2xl shadow-black/40 rounded-2xl hover:border-slate-700/80 transition-all duration-300
        ${className}
      `}
    >
      {/* Province */}
      <div className="w-full font-sans">
        <label className="block text-[9px] font-bold text-trd-primary mb-1 uppercase tracking-widest font-mono">
          จังหวัด
        </label>
        <select
          id="search-province"
          name="province"
          value={province}
          title="เลือกจังหวัด"
          onChange={(e) => setProvince(e.target.value)}
          className="w-full px-3 py-2 border border-slate-800 bg-slate-950/60 text-xs text-white focus:outline-none focus:border-trd-primary/50 focus:bg-slate-950 transition-all font-mono rounded-xl"
        >
          <option value="" className="bg-slate-900 text-white">ทุกจังหวัด</option>
          {provinces.map((prov) => (
            <option key={prov} value={prov} className="bg-slate-900 text-white">
              {prov}
            </option>
          ))}
        </select>
      </div>

      {/* District */}
      <div className="w-full font-sans">
        <label className="block text-[9px] font-bold text-trd-primary mb-1 uppercase tracking-widest font-mono">
          อำเภอ / เขต
        </label>
        <input
          id="search-district"
          name="district"
          type="text"
          placeholder="เช่น เมืองอุดรธานี"
          value={district}
          onChange={(e) => setDistrict(e.target.value)}
          className="w-full px-3 py-2 border border-slate-800 bg-slate-950/60 text-xs text-white placeholder:text-slate-600 focus:outline-none focus:border-trd-primary/50 focus:bg-slate-950 transition-all font-mono rounded-xl"
        />
      </div>

      {/* Min Price */}
      <div className="w-full font-sans">
        <label className="block text-[9px] font-bold text-trd-primary mb-1 uppercase tracking-widest font-mono">
          ราคาเริ่มต้น (บาท)
        </label>
        <input
          id="search-min-price"
          name="minPrice"
          type="number"
          placeholder="ระบุราคาต่ำสุด"
          value={minPrice}
          onChange={(e) => setMinPrice(e.target.value)}
          className="w-full px-3 py-2 border border-slate-800 bg-slate-950/60 text-xs text-white placeholder:text-slate-600 focus:outline-none focus:border-trd-primary/50 focus:bg-slate-950 transition-all font-mono rounded-xl"
        />
      </div>

      {/* Max Price */}
      <div className="w-full font-sans">
        <label className="block text-[9px] font-bold text-trd-primary mb-1 uppercase tracking-widest font-mono">
          ราคาสูงสุด (บาท)
        </label>
        <input
          id="search-max-price"
          name="maxPrice"
          type="number"
          placeholder="ระบุราคาสูงสุด"
          value={maxPrice}
          onChange={(e) => setMaxPrice(e.target.value)}
          className="w-full px-3 py-2 border border-slate-800 bg-slate-950/60 text-xs text-white placeholder:text-slate-600 focus:outline-none focus:border-trd-primary/50 focus:bg-slate-950 transition-all font-mono rounded-xl"
        />
      </div>

      {/* Zoning */}
      <div className="w-full font-sans">
        <label className="block text-[9px] font-bold text-trd-primary mb-1 uppercase tracking-widest font-mono">
          เขตการใช้ประโยชน์ที่ดิน
        </label>
        <select
          id="search-zoning"
          name="zoning"
          value={zoning}
          title="เลือกผังเมือง"
          onChange={(e) => setZoning(e.target.value)}
          className="w-full px-3 py-2 border border-slate-800 bg-slate-950/60 text-xs text-white focus:outline-none focus:border-trd-primary/50 focus:bg-slate-950 transition-all font-mono rounded-xl"
        >
          <option value="" className="bg-slate-900 text-white">ทุกเขตการใช้ประโยชน์</option>
          {zones.map((z) => (
            <option key={z} value={z} className="bg-slate-900 text-white">
              {z}
            </option>
          ))}
        </select>
      </div>

      {/* Search Button */}
      <div className="w-full font-sans">
        <Button
          type="submit"
          variant="primary"
          className="w-full py-2 flex items-center justify-center gap-2 text-xs uppercase tracking-wider font-mono font-black border border-slate-850 bg-trd-primary text-white rounded-xl shadow-[0_0_15px_rgba(59,130,246,0.2)] hover:shadow-[0_0_20px_rgba(59,130,246,0.35)] hover:bg-trd-primary-dark transition-all duration-200"
        >
          สืบค้นข้อมูลสัญญาเช่า
        </Button>
      </div>
    </form>
  );
}
