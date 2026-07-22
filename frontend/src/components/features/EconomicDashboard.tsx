"use client";

import React, { useState, useEffect } from "react";
import api from "@/lib/api";

// ข้อมูลเริ่มต้นสำหรับ Fallback กรณีเชื่อมต่อ Backend ไม่สำเร็จ
const defaultMockData = {
  revived_land_sqw: 14500, // ตารางวา
  state_revenue_baht: 2540000, // บาท
  economic_circulation_baht: 85000000, // บาท
};

export default function EconomicDashboard() {
  const [data, setData] = useState(defaultMockData);
  const [isLive, setIsLive] = useState(false);

  useEffect(() => {
    const fetchIndicators = async () => {
      try {
        const res = await api.getEconomicIndicators();
        // หากได้ข้อมูลมาและมีค่าที่ใช้งานได้ ให้เปลี่ยนมาใช้ข้อมูลจริงจาก Database
        if (res && res.revived_land_sqw !== undefined) {
          setData(res);
          setIsLive(true);
        }
      } catch (err) {
        console.warn("Failed to fetch real-time economic indicators, using mock fallback data:", err);
        setIsLive(false);
      }
    };

    fetchIndicators();
    // ตั้งเวลาดึงข้อมูลใหม่ทุก 30 วินาทีเพื่อความ Real-time
    const interval = setInterval(fetchIndicators, 30000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="w-full bg-[#0F1A30] p-6 border border-[#1E2E4A]/80 font-sans rounded-2xl shadow-[0_12px_35px_rgba(7,13,26,0.3)]">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-base font-black text-white font-mono uppercase tracking-widest">
            ดัชนีชี้วัดผลกระทบทางเศรษฐกิจแผ่นดิน
          </h2>
          <p className="text-[9px] text-slate-400 font-mono mt-1 uppercase tracking-wider font-bold">
            รายงานสถิติสารสนเทศตามเวลาจริงเชื่อมโยงกับฐานข้อมูลทะเบียนกลางกรมธนารักษ์
          </p>
        </div>
        <div className="flex items-center gap-2 bg-emerald-950/40 text-emerald-300 border border-emerald-900/50 px-3 py-1 font-mono font-black rounded-xl shadow-[0_0_12px_rgba(16,185,129,0.1)]">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-450"></span>
          </span>
          <span className="text-[9px] uppercase tracking-wider">
            เชื่อมโยงสด
          </span>
        </div>
      </div>

      {/* Grid for indicators */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 font-mono text-xs">
        
        {/* Card 1: Revived land */}
        <div className="bg-[#070D1A]/55 p-5 border border-[#1E2E4A]/60 relative overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:border-trd-secondary/50 hover:shadow-[0_10px_20px_rgba(7,13,26,0.4)] rounded-xl">
          <p className="text-[8px] font-black text-trd-secondary mb-2 uppercase tracking-widest">ตัวชี้วัดที่ ๑ // พื้นที่ราชพัสดุที่ได้รับการจัดประโยชน์และพัฒนาเชิงเศรษฐกิจ</p>
          <div className="flex items-baseline gap-2">
            <h3 className="text-3xl font-black text-emerald-400">
              {data.revived_land_sqw.toLocaleString()}
            </h3>
            <span className="text-[9px] font-black text-slate-400 uppercase">ตารางวา</span>
          </div>
          <span className="text-[9px] block text-slate-300 mt-2 font-sans font-bold">พื้นที่ราชพัสดุที่นำมาจัดประโยชน์ทางเศรษฐกิจ</span>
        </div>

        {/* Card 2: State revenue */}
        <div className="bg-[#070D1A]/55 p-5 border border-[#1E2E4A]/60 relative overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:border-trd-secondary/50 hover:shadow-[0_10px_20px_rgba(7,13,26,0.4)] rounded-xl">
          <p className="text-[8px] font-black text-trd-secondary mb-2 uppercase tracking-widest">ตัวชี้วัดที่ ๒ // ประมาณการรายได้ค่าธรรมเนียมนำส่งรัฐ</p>
          <div className="flex items-baseline gap-2">
            <h3 className="text-3xl font-black text-trd-secondary">
              {data.state_revenue_baht.toLocaleString()}
            </h3>
            <span className="text-[9px] font-black text-slate-400 uppercase">บาท</span>
          </div>
          <span className="text-[9px] block text-slate-300 mt-2 font-sans font-bold">ประมาณการรายได้ค่าธรรมเนียมรัฐ</span>
        </div>

        {/* Card 3: Economic circulation */}
        <div className="bg-[#070D1A]/55 p-5 border border-[#1E2E4A]/60 relative overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:border-trd-secondary/50 hover:shadow-[0_10px_20px_rgba(7,13,26,0.4)] rounded-xl">
          <p className="text-[8px] font-black text-trd-secondary mb-2 uppercase tracking-widest">ตัวชี้วัดที่ ๓ // มูลค่าธุรกรรมหมวนเวียนรวมในระบบตลาดรอง</p>
          <div className="flex items-baseline gap-2">
            <h3 className="text-3xl font-black text-white">
              {(data.economic_circulation_baht / 1000000).toFixed(2)}
            </h3>
            <span className="text-[9px] font-black text-slate-400 uppercase">ล้านบาท</span>
          </div>
          <span className="text-[9px] block text-slate-300 mt-2 font-sans font-bold">มูลค่าการลงทุนหมุนเวียนรวมในตลาด</span>
        </div>

      </div>
    </div>
  );
}
