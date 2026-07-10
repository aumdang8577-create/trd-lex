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
    "กรุงเทพมหานคร",
    "ชลบุรี",
    "เชียงใหม่",
    "ภูเก็ต",
    "ขอนแก่น",
    "สงขลา",
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
        bg-white/70 backdrop-blur-md rounded-2xl shadow-xl border border-gray-100/80
        p-6 w-full max-w-5xl mx-auto
        grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 items-end
        ${className}
      `}
    >
      {/* Province */}
      <div className="w-full">
        <label className="block text-xs font-semibold text-trd-primary mb-1.5 uppercase tracking-wide">
          จังหวัด
        </label>
        <select
          value={province}
          title="เลือกจังหวัด"
          onChange={(e) => setProvince(e.target.value)}
          className="w-full px-3 py-2.5 rounded-lg border border-trd-border bg-white text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-trd-primary/30 focus:border-trd-primary transition-all duration-200"
        >
          <option value="">เลือกจังหวัดทั้งหมด</option>
          {provinces.map((prov) => (
            <option key={prov} value={prov}>
              {prov}
            </option>
          ))}
        </select>
      </div>

      {/* District */}
      <div className="w-full">
        <label className="block text-xs font-semibold text-trd-primary mb-1.5 uppercase tracking-wide">
          อำเภอ / เขต
        </label>
        <input
          type="text"
          placeholder="เช่น พญาไท, บางละมุง"
          value={district}
          onChange={(e) => setDistrict(e.target.value)}
          className="w-full px-3 py-2 rounded-lg border border-trd-border bg-white text-sm text-gray-700 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-trd-primary/30 focus:border-trd-primary transition-all duration-200"
        />
      </div>

      {/* Min Price */}
      <div className="w-full">
        <label className="block text-xs font-semibold text-trd-primary mb-1.5 uppercase tracking-wide">
          ราคาต่ำสุด (บาท)
        </label>
        <input
          type="number"
          placeholder="ไม่มีขั้นต่ำ"
          value={minPrice}
          onChange={(e) => setMinPrice(e.target.value)}
          className="w-full px-3 py-2 rounded-lg border border-trd-border bg-white text-sm text-gray-700 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-trd-primary/30 focus:border-trd-primary transition-all duration-200"
        />
      </div>

      {/* Max Price */}
      <div className="w-full">
        <label className="block text-xs font-semibold text-trd-primary mb-1.5 uppercase tracking-wide">
          ราคาสูงสุด (บาท)
        </label>
        <input
          type="number"
          placeholder="ไม่จำกัด"
          value={maxPrice}
          onChange={(e) => setMaxPrice(e.target.value)}
          className="w-full px-3 py-2 rounded-lg border border-trd-border bg-white text-sm text-gray-700 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-trd-primary/30 focus:border-trd-primary transition-all duration-200"
        />
      </div>

      {/* Zoning */}
      <div className="w-full">
        <label className="block text-xs font-semibold text-trd-primary mb-1.5 uppercase tracking-wide">
          ผังสีผังเมือง
        </label>
        <select
          value={zoning}
          title="เลือกผังเมือง"
          onChange={(e) => setZoning(e.target.value)}
          className="w-full px-3 py-2.5 rounded-lg border border-trd-border bg-white text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-trd-primary/30 focus:border-trd-primary transition-all duration-200"
        >
          <option value="">เลือกผังเมืองทั้งหมด</option>
          {zones.map((z) => (
            <option key={z} value={z}>
              {z}
            </option>
          ))}
        </select>
      </div>

      {/* Search Button */}
      <div className="w-full">
        <Button
          type="submit"
          variant="primary"
          className="w-full py-2.5 flex items-center justify-center gap-2 text-sm shadow-md"
        >
          <span>🔍</span> ค้นหาสิทธิ์
        </Button>
      </div>
    </form>
  );
}
