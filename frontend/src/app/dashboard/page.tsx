"use client";

import { useState, useEffect } from "react";
import TopStatCards from "@/components/features/EconomicDashboard/TopStatCards";
import RevenueGrowthChart from "@/components/features/EconomicDashboard/RevenueGrowthChart";
import ZoningDistributionChart from "@/components/features/EconomicDashboard/ZoningDistributionChart";
import RegionalRanking from "@/components/features/EconomicDashboard/RegionalRanking";
import AuditLogTable from "@/components/features/EconomicDashboard/AuditLogTable";

export default function DashboardPage() {
  const [userRole, setUserRole] = useState<string | null>(null);

  useEffect(() => {
    const checkRole = () => {
      setUserRole(localStorage.getItem("trd_user_role") || "GUEST");
    };
    checkRole();
    window.addEventListener("trd-role-changed", checkRole);
    window.addEventListener("storage", checkRole);
    return () => {
      window.removeEventListener("trd-role-changed", checkRole);
      window.removeEventListener("storage", checkRole);
    };
  }, []);

  const setRoleToOfficer = () => {
    localStorage.setItem("trd_user_role", "OFFICER");
    setUserRole("OFFICER");
    window.dispatchEvent(new Event("trd-role-changed"));
  };

  return (
    <div className="min-h-screen bg-[#070D1A] text-white font-sans pb-20">
      {/* Top Banner Status Bar */}
      <div className="bg-[#0F1A30] border-b border-[#1E2E4A] px-4 sm:px-6 lg:px-8 py-2 flex items-center justify-between text-xs font-mono">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse shadow-[0_0_10px_#10B981]" />
          <span className="text-emerald-400 font-bold tracking-widest uppercase">
            WAR ROOM LIVE STREAMING // ONLINE
          </span>
        </div>
        <div className="hidden sm:flex items-center gap-4 text-slate-400">
          <span>ระบบศูนย์ข้อมูลดัชนีเศรษฐกิจกรมธนารักษ์</span>
          <span>|</span>
          <span>เวลาเซิร์ฟเวอร์: 2026-07-23 TH</span>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 space-y-8">
        {/* Page Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 bg-[#0F1A30]/80 backdrop-blur-xl border border-[#1E2E4A] p-6 rounded-2xl shadow-2xl">
          <div>
            <div className="inline-flex items-center gap-2 text-[10px] font-mono text-trd-secondary uppercase tracking-widest font-black mb-1">
              <span>🏛️</span> รายงานระดับยุทธศาสตร์ชาติ // NATIONAL STRATEGIC DASHBOARD
            </div>
            <h1 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight uppercase font-sans">
              แดชบอร์ดดัชนีเศรษฐกิจและรายได้รัฐ
            </h1>
            <p className="text-xs text-slate-300 mt-1 font-medium leading-relaxed">
              วิเคราะห์ผลกระทบทางเศรษฐกิจ รายรับค่าธรรมเนียมหลวง และการใช้ประโยชน์ที่ดินราชพัสดุในเชิงพาณิชย์และยุทธศาสตร์
            </p>
          </div>

          {/* Quick Actions & Demo Mode Role Switcher */}
          <div className="flex flex-wrap items-center gap-3">
            {userRole !== "OFFICER" && (
              <button
                onClick={setRoleToOfficer}
                className="bg-gold-gradient text-midnight px-4 py-2 rounded-xl text-xs font-mono font-black uppercase tracking-wider shadow-neon-gold hover:opacity-90 transition-all flex items-center gap-1.5"
              >
                <span>⚡</span> ปลดล็อกสิทธิ์พรีวิว (Demo Mode)
              </button>
            )}

            <button
              onClick={() => window.print()}
              className="bg-[#070D1A] text-white border border-[#1E2E4A] px-4 py-2 rounded-xl text-xs font-mono font-bold hover:border-trd-secondary/50 transition-all flex items-center gap-2"
            >
              <span>🖨️</span> พิมพ์รายงานสรุป
            </button>
          </div>
        </div>

        {/* 1. Top Impact KPI Cards */}
        <TopStatCards />

        {/* 2. Charts Section (Bento Grid 2 Columns) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-7">
            <RevenueGrowthChart />
          </div>
          <div className="lg:col-span-5">
            <ZoningDistributionChart />
          </div>
        </div>

        {/* 3. Regional Ranking & Audit Log Section */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          <div className="lg:col-span-5">
            <RegionalRanking />
          </div>
          <div className="lg:col-span-7">
            <AuditLogTable />
          </div>
        </div>
      </div>
    </div>
  );
}
