"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Button from "@/components/ui/Button";

interface SearchBarProps {
  onSearch?: (searchData: {
    province: string;
    district: string;
    minPrice: string;
    maxPrice: string;
    zoning: string;
    buildingType: string;
  }) => void;
  className?: string;
  layout?: "horizontal" | "vertical";
}

// แหล่งข้อมูลเขต/อำเภอของกลุ่มจังหวัดเป้าหมายหลัก
const districtsByProvince: Record<string, string[]> = {
  "อุดรธานี": ["เมืองอุดรธานี", "กุมภวาปี", "บ้านดุง", "หนองหาน", "เพ็ญ", "บ้านผือ", "น้ำโสม", "ศรีธาตุ"],
  "หนองคาย": ["เมืองหนองคาย", "ท่าบ่อ", "โพนพิสัย", "ศรีเชียงใหม่", "สระใคร", "เฝ้าไร่", "รัตนวาปี", "สังคม"],
  "กาญจนบุรี": ["เมืองกาญจนบุรี", "ท่าม่วง", "ทองผาภูมิ", "ไทรโยค", "ศรีสวัสดิ์", "ท่ามะกา", "บ่อพลอย", "พนมทวน", "สังขละบุรี"],
  "หนองบัวลำภู": ["เมืองหนองบัวลำภู", "ศรีบุญเรือง", "นากลาง", "สุวรรณคูหา", "โนนสัง", "นาวัง"],
  "กรุงเทพมหานคร": ["พญาไท", "ปทุมวัน", "บางรัก", "วัฒนา", "ห้วยขวาง"],
  "ชลบุรี": ["บางละมุง", "เมืองชลบุรี", "ศรีราชา", "สัตหีบ"],
  "เชียงใหม่": ["เมืองเชียงใหม่", "หางดง", "แม่ริม", "สันทราย"]
};

// รายชื่อจังหวัดทั้งหมด
const provinces = [
  "อุดรธานี",
  "หนองคาย",
  "กาญจนบุรี",
  "หนองบัวลำภู",
  "กรุงเทพมหานคร",
  "ชลบุรี",
  "เชียงใหม่",
];

// รายการผังเมือง
const zones = [
  "พื้นที่สีแดง (พาณิชยกรรม)",
  "พื้นที่สีเหลือง (ที่อยู่อาศัยหนาแน่นน้อย)",
  "พื้นที่สีเขียว (เกษตรกรรม)",
  "พื้นที่สีม่วง (อุตสาหกรรม)",
];

// รายการประเภทสิ่งปลูกสร้าง
const buildingTypes = [
  "อาคารพาณิชย์",
  "บ้านพักอาศัย",
  "ที่ดินเปล่า",
  "คลังสินค้า",
];

export default function SearchBar({ onSearch, className = "", layout = "horizontal" }: SearchBarProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [province, setProvince] = useState("");
  const [district, setDistrict] = useState("");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [zoning, setZoning] = useState("");
  const [buildingType, setBuildingType] = useState("");
  const [activePreset, setActivePreset] = useState<string | null>(null);

  // ตั้งค่าเริ่มต้นจาก URL parameters เมื่อเปิดหน้าเว็บครั้งแรก
  useEffect(() => {
    if (searchParams) {
      const p = searchParams.get("province") || "";
      const d = searchParams.get("district") || "";
      const min = searchParams.get("minPrice") || "";
      const max = searchParams.get("maxPrice") || "";
      const z = searchParams.get("zoning") || "";
      const bt = searchParams.get("buildingType") || "";

      if (p) setProvince(p);
      if (d) setDistrict(d);
      if (min) setMinPrice(min);
      if (max) setMaxPrice(max);
      if (z) setZoning(z);
      if (bt) setBuildingType(bt);
    }
  }, [searchParams]);

  // เคลียร์ค่าอำเภอเมื่อจังหวัดเปลี่ยนแปลง (เฉพาะตอนผู้ใช้เลือกเอง ไม่ใช่โหลดจาก URL)
  useEffect(() => {
    if (province && searchParams && searchParams.get("province") !== province) {
      setDistrict("");
    }
  }, [province]);

  const handleSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (onSearch) {
      onSearch({ province, district, minPrice, maxPrice, zoning, buildingType });
    } else {
      // หากรันจากหน้าโฮมเพจ (ไม่มี prop onSearch) ให้ทำการเปลี่ยนเส้นทางไปยังหน้าประกาศ /listings พร้อมส่งตัวแปรค้นหาไปที่ URL
      const q = new URLSearchParams();
      if (province) q.set("province", province);
      if (district) q.set("district", district);
      if (minPrice) q.set("minPrice", minPrice);
      if (maxPrice) q.set("maxPrice", maxPrice);
      if (zoning) q.set("zoning", zoning);
      if (buildingType) q.set("buildingType", buildingType);
      
      router.push(`/listings?${q.toString()}`);
    }
  };

  const handleClear = () => {
    setProvince("");
    setDistrict("");
    setMinPrice("");
    setMaxPrice("");
    setZoning("");
    setBuildingType("");
    setActivePreset(null);
    if (onSearch) {
      onSearch({ province: "", district: "", minPrice: "", maxPrice: "", zoning: "", buildingType: "" });
    }
  };

  const applyPricePreset = (presetName: string, min: string, max: string) => {
    if (activePreset === presetName) {
      setMinPrice("");
      setMaxPrice("");
      setActivePreset(null);
    } else {
      setMinPrice(min);
      setMaxPrice(max);
      setActivePreset(presetName);
    }
  };

  const districts = province ? districtsByProvince[province] || [] : [];

  // ==========================================
  // LAYOUT 1: VERTICAL SIDEBAR
  // ==========================================
  if (layout === "vertical") {
    return (
      <div className={`bg-white rounded-2xl border-2 border-trd-border p-6 shadow-card space-y-6 ${className}`}>
        
        {/* Title */}
        <div className="border-b border-trd-border/80 pb-3 flex items-center justify-between">
          <h3 className="text-xs font-black uppercase tracking-widest text-trd-secondary-dark font-mono flex items-center gap-1.5">
            <span>⚙️</span> ตัวกรองสืบค้นละเอียด
          </h3>
          <button 
            type="button" 
            onClick={handleClear} 
            className="text-[10px] font-black text-red-500 hover:text-red-700 font-mono uppercase tracking-wider"
          >
            ล้างตัวกรอง
          </button>
        </div>

        <div className="space-y-4 text-xs font-mono">
          
          {/* จังหวัด */}
          <div className="space-y-1.5">
            <label className="block text-[10px] font-bold text-slate-700">จังหวัด</label>
            <select
              value={province}
              onChange={(e) => setProvince(e.target.value)}
              className="w-full px-3 py-2 border border-slate-200 bg-white text-trd-primary font-bold rounded-xl focus:outline-none focus:border-trd-secondary"
            >
              <option value="">ทุกจังหวัด</option>
              {provinces.map((p) => (
                <option key={p} value={p}>{p}</option>
              ))}
            </select>
          </div>

          {/* อำเภอ/เขต */}
          <div className="space-y-1.5">
            <label className="block text-[10px] font-bold text-slate-700">อำเภอ / เขต</label>
            <select
              value={district}
              onChange={(e) => setDistrict(e.target.value)}
              disabled={!province}
              className="w-full px-3 py-2 border border-slate-200 bg-white text-trd-primary font-bold rounded-xl disabled:bg-slate-50 disabled:text-slate-400 focus:outline-none focus:border-trd-secondary"
            >
              <option value="">{province ? "ทุกอำเภอ" : "กรุณาเลือกจังหวัดก่อน"}</option>
              {districts.map((d) => (
                <option key={d} value={d}>{d}</option>
              ))}
            </select>
          </div>

          {/* โซนผังเมือง */}
          <div className="space-y-1.5">
            <label className="block text-[10px] font-bold text-slate-700">เขตการใช้ประโยชน์ (ผังสี)</label>
            <select
              value={zoning}
              onChange={(e) => setZoning(e.target.value)}
              className="w-full px-3 py-2 border border-slate-200 bg-white text-trd-primary font-bold rounded-xl focus:outline-none focus:border-trd-secondary"
            >
              <option value="">ทุกโซนการใช้ประโยชน์</option>
              {zones.map((z) => (
                <option key={z} value={z}>{z}</option>
              ))}
            </select>
          </div>

          {/* ประเภทอาคาร */}
          <div className="space-y-1.5">
            <label className="block text-[10px] font-bold text-slate-700">ประเภทสิ่งปลูกสร้าง</label>
            <select
              value={buildingType}
              onChange={(e) => setBuildingType(e.target.value)}
              className="w-full px-3 py-2 border border-slate-200 bg-white text-trd-primary font-bold rounded-xl focus:outline-none focus:border-trd-secondary"
            >
              <option value="">ทุกประเภท</option>
              {buildingTypes.map((bt) => (
                <option key={bt} value={bt}>{bt}</option>
              ))}
            </select>
          </div>

          {/* ราคาขั้นต่ำ-สูงสุด */}
          <div className="space-y-1.5">
            <label className="block text-[10px] font-bold text-slate-700">ช่วงงบประมาณการโอนสิทธิ์ (บาท)</label>
            <div className="flex gap-2">
              <input
                type="number"
                placeholder="ต่ำสุด"
                value={minPrice}
                onChange={(e) => {
                  setMinPrice(e.target.value);
                  setActivePreset(null);
                }}
                className="w-1/2 px-3 py-2 border border-slate-200 bg-white rounded-xl focus:outline-none focus:border-trd-secondary font-mono"
              />
              <input
                type="number"
                placeholder="สูงสุด"
                value={maxPrice}
                onChange={(e) => {
                  setMaxPrice(e.target.value);
                  setActivePreset(null);
                }}
                className="w-1/2 px-3 py-2 border border-slate-200 bg-white rounded-xl focus:outline-none focus:border-trd-secondary font-mono"
              />
            </div>
          </div>

          {/* ปุ่มลัดราคาด่วน (Quick Presets) */}
          <div className="space-y-2 pt-2">
            <label className="block text-[9px] font-black text-slate-400 uppercase tracking-wider">ปุ่มเลือกราคาด่วน</label>
            <div className="grid grid-cols-2 gap-1.5 font-sans">
              {[
                { name: "ต่ำกว่า 5 แสน", min: "", max: "500000" },
                { name: "5 แสน - 1.5 ล้าน", min: "500000", max: "1500000" },
                { name: "1.5 ล้าน - 3 ล้าน", min: "1500000", max: "3000000" },
                { name: "3 ล้านขึ้นไป", min: "3000000", max: "" }
              ].map((preset) => (
                <button
                  key={preset.name}
                  type="button"
                  onClick={() => applyPricePreset(preset.name, preset.min, preset.max)}
                  className={`
                    px-2 py-1.5 border rounded-lg text-[9px] font-bold text-center transition-all
                    ${activePreset === preset.name 
                      ? "border-trd-secondary bg-amber-50/30 text-trd-secondary-dark font-black" 
                      : "border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-650"}
                  `}
                >
                  {preset.name}
                </button>
              ))}
            </div>
          </div>

        </div>

        {/* Action Button */}
        <div className="pt-4 border-t border-trd-border/80">
          <Button
            onClick={() => handleSubmit()}
            variant="primary"
            className="w-full py-2.5 flex items-center justify-center gap-2 text-xs uppercase tracking-wider font-mono font-black border border-transparent bg-trd-primary text-white rounded-xl shadow-neon-gold"
          >
            🔍 สืบค้นผลการกรอง
          </Button>
        </div>

      </div>
    );
  }

  // ==========================================
  // LAYOUT 2: HORIZONTAL BAR (Home Page)
  // ==========================================
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
        <label className="block text-[9px] font-bold text-slate-300 mb-1 uppercase tracking-widest font-mono">
          จังหวัด
        </label>
        <select
          value={province}
          onChange={(e) => setProvince(e.target.value)}
          className="w-full px-3 py-2 border border-slate-800 bg-slate-950/60 text-xs text-white focus:outline-none focus:border-trd-secondary/50 focus:bg-slate-950 transition-all font-mono rounded-xl"
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
        <label className="block text-[9px] font-bold text-slate-300 mb-1 uppercase tracking-widest font-mono">
          อำเภอ / เขต
        </label>
        {province ? (
          <select
            value={district}
            onChange={(e) => setDistrict(e.target.value)}
            className="w-full px-3 py-2 border border-slate-800 bg-slate-950/60 text-xs text-white focus:outline-none focus:border-trd-secondary/50 focus:bg-slate-950 transition-all font-mono rounded-xl"
          >
            <option value="" className="bg-slate-900 text-white">ทุกอำเภอ</option>
            {districts.map((dist) => (
              <option key={dist} value={dist} className="bg-slate-900 text-white">
                {dist}
              </option>
            ))}
          </select>
        ) : (
          <input
            type="text"
            placeholder="กรุณาเลือกจังหวัด"
            disabled
            className="w-full px-3 py-2 border border-slate-800 bg-slate-950/20 text-xs text-slate-500 placeholder:text-slate-650 focus:outline-none font-mono rounded-xl"
          />
        )}
      </div>

      {/* Min Price */}
      <div className="w-full font-sans">
        <label className="block text-[9px] font-bold text-slate-300 mb-1 uppercase tracking-widest font-mono">
          ราคาเริ่มต้น (บาท)
        </label>
        <input
          type="number"
          placeholder="ระบุราคาต่ำสุด"
          value={minPrice}
          onChange={(e) => setMinPrice(e.target.value)}
          className="w-full px-3 py-2 border border-slate-800 bg-slate-950/60 text-xs text-white placeholder:text-slate-600 focus:outline-none focus:border-trd-secondary/50 focus:bg-slate-950 transition-all font-mono rounded-xl"
        />
      </div>

      {/* Max Price */}
      <div className="w-full font-sans">
        <label className="block text-[9px] font-bold text-slate-300 mb-1 uppercase tracking-widest font-mono">
          ราคาสูงสุด (บาท)
        </label>
        <input
          type="number"
          placeholder="ระบุราคาสูงสุด"
          value={maxPrice}
          onChange={(e) => setMaxPrice(e.target.value)}
          className="w-full px-3 py-2 border border-slate-800 bg-slate-950/60 text-xs text-white placeholder:text-slate-600 focus:outline-none focus:border-trd-secondary/50 focus:bg-slate-950 transition-all font-mono rounded-xl"
        />
      </div>

      {/* Zoning */}
      <div className="w-full font-sans">
        <label className="block text-[9px] font-bold text-slate-300 mb-1 uppercase tracking-widest font-mono">
          เขตการใช้ประโยชน์ที่ดิน
        </label>
        <select
          value={zoning}
          onChange={(e) => setZoning(e.target.value)}
          className="w-full px-3 py-2 border border-slate-800 bg-slate-950/60 text-xs text-white focus:outline-none focus:border-trd-secondary/50 focus:bg-slate-950 transition-all font-mono rounded-xl"
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
          className="w-full py-2 flex items-center justify-center gap-2 text-xs uppercase tracking-wider font-mono font-black border border-transparent bg-trd-secondary text-midnight rounded-xl shadow-[0_0_15px_rgba(212,175,55,0.25)] hover:shadow-[0_0_20px_rgba(212,175,55,0.45)] hover:opacity-90 transition-all duration-200"
        >
          สืบค้นประกาศหาผู้รับโอนสิทธิการเช่า
        </Button>
      </div>
    </form>
  );
}
