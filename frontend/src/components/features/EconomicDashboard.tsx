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
    <div className="w-full bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-trd-primary font-sans">
            ดัชนีชี้วัดเศรษฐกิจหมุนเวียน (Economic Impact)
          </h2>
          <p className="text-sm text-gray-500 mt-1">
            ข้อมูลอัปเดตแบบ {isLive ? "Real-time" : "จำลองสถานะ"} จากระบบ TRD-LEX
          </p>
        </div>
        <div className="flex items-center gap-2 bg-green-50 px-3 py-1.5 rounded-full border border-green-100">
          <span className="relative flex h-3 w-3">
            {isLive && (
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-status-valid opacity-75"></span>
            )}
            <span className={`relative inline-flex rounded-full h-3 w-3 ${isLive ? "bg-status-valid" : "bg-gray-400"}`}></span>
          </span>
          <span className={`text-xs font-semibold uppercase tracking-wider ${isLive ? "text-status-valid" : "text-gray-400"}`}>
            {isLive ? "Live" : "Offline"}
          </span>
        </div>
      </div>

      {/* Grid สำหรับการ์ดทั้ง 3 ใบ */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Card 1: พื้นที่รกร้างที่ถูกพลิกฟื้น */}
        <div className="bg-gradient-to-br from-green-50 to-white p-5 rounded-xl border border-green-100 shadow-sm relative overflow-hidden group hover:shadow-md transition-shadow">
          <div className="absolute -right-4 -top-4 opacity-5 group-hover:opacity-10 transition-opacity">
            <svg className="w-24 h-24" fill="currentColor" viewBox="0 0 24 24"><path d="M14 6l-4.22 5.63 1.22 1.63L14 9.33 19 16h-8v2h10l-7-9.33zM5 16h1.59l5.09-6.78-1.22-1.63L5 14.33V16z"/></svg>
          </div>
          <p className="text-sm font-medium text-gray-500 mb-1">📈 พื้นที่รกร้างถูกเปลี่ยนเป็นธุรกิจใหม่</p>
          <div className="flex items-baseline gap-2">
            <h3 className="text-3xl font-extrabold text-trd-primary">
              {data.revived_land_sqw.toLocaleString()}
            </h3>
            <span className="text-sm font-semibold text-gray-500">ตารางวา</span>
          </div>
        </div>

        {/* Card 2: รายได้รัฐ */}
        <div className="bg-gradient-to-br from-yellow-50 to-white p-5 rounded-xl border border-yellow-100 shadow-sm relative overflow-hidden group hover:shadow-md transition-shadow">
          <div className="absolute -right-4 -top-4 opacity-5 group-hover:opacity-10 transition-opacity">
             <svg className="w-24 h-24 text-trd-secondary" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1.41 16.09V20h-2.67v-1.93c-1.71-.36-3.16-1.46-3.27-3.4h1.96c.1 1.05.82 1.87 2.65 1.87 1.96 0 2.4-.98 2.4-1.59 0-.83-.44-1.61-2.67-2.14-2.48-.6-4.18-1.62-4.18-3.67 0-1.72 1.39-2.84 3.11-3.21V4h2.67v1.95c1.86.45 2.79 1.86 2.85 3.39H14.3c-.05-1.11-.64-1.87-2.22-1.87-1.5 0-2.4.68-2.4 1.64 0 .84.65 1.39 2.67 1.91s4.18 1.39 4.18 3.91c-.01 1.83-1.38 2.83-3.12 3.16z"/></svg>
          </div>
          <p className="text-sm font-medium text-gray-500 mb-1">💰 ประมาณการรายได้ค่าธรรมเนียม</p>
          <div className="flex items-baseline gap-2">
            <h3 className="text-3xl font-extrabold text-trd-secondary">
              {data.state_revenue_baht.toLocaleString()}
            </h3>
            <span className="text-sm font-semibold text-gray-500">บาท</span>
          </div>
        </div>

        {/* Card 3: มูลค่าเศรษฐกิจหมุนเวียน */}
        <div className="bg-gradient-to-br from-blue-50 to-white p-5 rounded-xl border border-blue-100 shadow-sm relative overflow-hidden group hover:shadow-md transition-shadow">
           <div className="absolute -right-4 -top-4 opacity-5 group-hover:opacity-10 transition-opacity">
             <svg className="w-24 h-24 text-blue-500" fill="currentColor" viewBox="0 0 24 24"><path d="M12 4V1L8 5l4 4V6c3.31 0 6 2.69 6 6 0 1.01-.25 1.97-.7 2.8l1.46 1.46C19.54 15.03 20 13.57 20 12c0-4.42-3.58-8-8-8zm0 14c-3.31 0-6-2.69-6-6 0-1.01.25-1.97.7-2.8L5.24 7.74C4.46 8.97 4 10.43 4 12c0 4.42 3.58 8 8 8v3l4-4-4-4v3z"/></svg>
          </div>
          <p className="text-sm font-medium text-gray-500 mb-1">🔄 มูลค่าการลงทุนที่เกิดการหมุนเวียน</p>
          <div className="flex items-baseline gap-2">
            <h3 className="text-3xl font-extrabold text-blue-600">
              {(data.economic_circulation_baht / 1000000).toFixed(2)}
            </h3>
            <span className="text-sm font-semibold text-gray-500">ล้านบาท</span>
          </div>
        </div>

      </div>
    </div>
  );
}
