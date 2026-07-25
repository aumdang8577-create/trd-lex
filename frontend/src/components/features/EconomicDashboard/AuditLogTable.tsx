"use client";

import { useState } from "react";

interface AuditTransaction {
  id: string;
  contractNo: string;
  location: string;
  province: string;
  areaSqw: number;
  businessType: string;
  category: "COMMERCIAL" | "INDUSTRIAL" | "AGRICULTURE" | "RESIDENTIAL";
  transferPrice: number;
  treasuryFee: number;
  completedDate: string;
}

const auditData: AuditTransaction[] = [
  {
    id: "tx-101",
    contractNo: "TRD-66-001",
    location: "หมากแข้ง, เมืองอุดรธานี",
    province: "อุดรธานี",
    areaSqw: 120,
    businessType: "อาคารพาณิชย์ (ร้านค้าโชว์รูม)",
    category: "COMMERCIAL",
    transferPrice: 1500000,
    treasuryFee: 45000,
    completedDate: "2026-07-22 14:30",
  },
  {
    id: "tx-102",
    contractNo: "TRD-66-019",
    location: "ทุ่งสุขลา, ศรีราชา (EEC)",
    province: "ชลบุรี",
    areaSqw: 1200,
    businessType: "คลังสินค้า & โลจิสติกส์",
    category: "INDUSTRIAL",
    transferPrice: 5500000,
    treasuryFee: 165000,
    completedDate: "2026-07-21 11:15",
  },
  {
    id: "tx-103",
    contractNo: "TRD-66-003",
    location: "ในเมือง, เมืองหนองคาย",
    province: "หนองคาย",
    areaSqw: 3677,
    businessType: "โฮมสเตย์ & ร้านอาหารริมโขง",
    category: "COMMERCIAL",
    transferPrice: 2400000,
    treasuryFee: 72000,
    completedDate: "2026-07-20 16:45",
  },
  {
    id: "tx-104",
    contractNo: "TRD-66-018",
    location: "ชุมแพ, ชุมแพ",
    province: "ขอนแก่น",
    areaSqw: 850,
    businessType: "ศูนย์ขนส่งและกระจายสินค้า",
    category: "INDUSTRIAL",
    transferPrice: 4200000,
    treasuryFee: 126000,
    completedDate: "2026-07-19 09:20",
  },
  {
    id: "tx-105",
    contractNo: "TRD-66-007",
    location: "ไทรโยค, ไทรโยค",
    province: "กาญจนบุรี",
    areaSqw: 2400,
    businessType: "เกษตรกรรมท่องเที่ยวเชิงอนุรักษ์",
    category: "AGRICULTURE",
    transferPrice: 450000,
    treasuryFee: 13500,
    completedDate: "2026-07-18 13:10",
  },
];

export default function AuditLogTable() {
  const [filter, setFilter] = useState<string>("ALL");

  const filteredData = auditData.filter((item) => {
    if (filter === "ALL") return true;
    return item.category === filter;
  });

  return (
    <div className="bg-[#0F1A30]/90 backdrop-blur-xl border border-[#1E2E4A] rounded-2xl overflow-hidden shadow-2xl">
      {/* Table Header & Controls */}
      <div className="p-6 border-b border-[#1E2E4A] flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="text-[10px] font-mono text-trd-secondary uppercase tracking-widest font-bold mb-1">
            [ บันทึกประวัติธุรกรรมเรียลไทม์ // AUDIT LOG ]
          </div>
          <h3 className="text-base font-extrabold text-white uppercase tracking-wide font-sans">
            รายการโอนสิทธิการเช่าที่ราชพัสดุเสร็จสิ้น (Verified Transactions)
          </h3>
        </div>

        {/* Filter Tabs */}
        <div className="flex flex-wrap gap-1.5 bg-[#070D1A] p-1 rounded-xl border border-[#1E2E4A] text-xs font-mono">
          {[
            { id: "ALL", label: "ทั้งหมด" },
            { id: "COMMERCIAL", label: "พาณิชยกรรม" },
            { id: "INDUSTRIAL", label: "อุตสาหกรรม EEC" },
            { id: "AGRICULTURE", label: "เกษตรกรรม" },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setFilter(tab.id)}
              className={`px-3 py-1 rounded-lg font-bold transition-all ${
                filter === tab.id
                  ? "bg-trd-secondary text-midnight shadow-neon-gold"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Table Body */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs font-sans">
          <thead className="bg-[#070D1A] text-slate-300 font-mono uppercase tracking-wider border-b border-[#1E2E4A]">
            <tr>
              <th className="px-6 py-4">เลขที่สัญญา</th>
              <th className="px-6 py-4">ทำเลพื้นที่</th>
              <th className="px-6 py-4 text-center">ขนาด (ตร.ว.)</th>
              <th className="px-6 py-4">ธุรกิจที่จัดตั้ง</th>
              <th className="px-6 py-4 text-right">มูลค่าโอนสิทธิ์</th>
              <th className="px-6 py-4 text-right">ค่าธรรมเนียมหลวง</th>
              <th className="px-6 py-4 text-center">การรับรอง</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#1E2E4A]/60 text-slate-200">
            {filteredData.map((tx) => (
              <tr key={tx.id} className="hover:bg-[#1E2E4A]/30 transition-colors font-mono">
                <td className="px-6 py-4 font-bold text-trd-secondary">
                  {tx.contractNo}
                </td>
                <td className="px-6 py-4 font-sans font-medium text-slate-200">
                  {tx.location}
                </td>
                <td className="px-6 py-4 text-center font-bold">
                  {tx.areaSqw.toLocaleString()}
                </td>
                <td className="px-6 py-4 font-sans text-slate-300">
                  {tx.businessType}
                </td>
                <td className="px-6 py-4 text-right font-bold text-white">
                  ฿{tx.transferPrice.toLocaleString()}
                </td>
                <td className="px-6 py-4 text-right font-bold text-emerald-400">
                  ฿{tx.treasuryFee.toLocaleString()}
                </td>
                <td className="px-6 py-4 text-center">
                  <span className="inline-flex items-center gap-1 text-[9px] font-mono font-black uppercase tracking-wider text-emerald-400 bg-emerald-950/60 border border-emerald-800/60 px-2.5 py-1 rounded-full shadow-[0_0_10px_rgba(16,185,129,0.2)]">
                    ✓ Verified by TRD
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
