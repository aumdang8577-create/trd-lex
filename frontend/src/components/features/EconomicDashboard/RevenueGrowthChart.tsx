"use client";

import { useState } from "react";

interface QuarterData {
  quarter: string;
  actual: number; // in Million Baht
  target: number;
  growth: string;
}

const quarterlyData: QuarterData[] = [
  { quarter: "Q1/68", actual: 6.2, target: 5.0, growth: "+24.0%" },
  { quarter: "Q2/68", actual: 7.8, target: 6.5, growth: "+20.0%" },
  { quarter: "Q3/68", actual: 9.5, target: 8.0, growth: "+18.75%" },
  { quarter: "Q4/68", actual: 12.3, target: 10.0, growth: "+23.0%" },
];

export default function RevenueGrowthChart() {
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);

  const maxVal = 15; // Max scale for chart (15M Baht)

  return (
    <div className="bg-[#0F1A30]/90 backdrop-blur-xl border border-[#1E2E4A] rounded-2xl p-6 shadow-2xl relative">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-6 border-b border-[#1E2E4A] pb-4">
        <div>
          <div className="text-[10px] font-mono text-trd-secondary uppercase tracking-widest font-bold mb-1">
            [ รายงานดัชนีการจัดเก็บรายได้รายไตรมาส ]
          </div>
          <h3 className="text-base font-extrabold text-white uppercase tracking-wide font-sans">
            การเติบโตของรายได้ค่าธรรมเนียมรัฐรายไตรมาส (ล้านบาท)
          </h3>
        </div>

        {/* Legend */}
        <div className="flex items-center gap-4 text-xs font-mono">
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 bg-trd-secondary rounded-sm shadow-neon-gold" />
            <span className="text-slate-300">จัดเก็บได้จริง</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-0.5 bg-slate-500 border border-dashed border-slate-300" />
            <span className="text-slate-400">เป้าหมายรัฐ</span>
          </div>
        </div>
      </div>

      {/* SVG Bar & Line Chart Container */}
      <div className="relative h-64 w-full flex items-end justify-between gap-4 pt-8 px-4 border-b border-[#1E2E4A]">
        {/* Horizontal Guide Lines */}
        <div className="absolute inset-0 flex flex-col justify-between pointer-events-none pb-8">
          {[15, 10, 5, 0].map((val) => (
            <div key={val} className="w-full flex items-center gap-2">
              <span className="text-[9px] font-mono text-slate-450 w-6 text-right">
                {val}M
              </span>
              <div className="w-full border-b border-[#1E2E4A]/60 border-dashed" />
            </div>
          ))}
        </div>

        {/* Bars for each Quarter */}
        {quarterlyData.map((d, idx) => {
          const heightPct = (d.actual / maxVal) * 100;
          const targetPct = (d.target / maxVal) * 100;
          const isHovered = hoveredIdx === idx;

          return (
            <div
              key={d.quarter}
              className="relative flex-1 flex flex-col items-center justify-end h-full group z-10 cursor-pointer"
              onMouseEnter={() => setHoveredIdx(idx)}
              onMouseLeave={() => setHoveredIdx(null)}
            >
              {/* Tooltip on Hover */}
              {isHovered && (
                <div className="absolute -top-12 z-30 bg-[#070D1A] border border-trd-secondary/60 px-3 py-1.5 rounded-lg text-center shadow-2xl animate-fade-in pointer-events-none">
                  <div className="text-[10px] font-mono text-trd-secondary font-bold">
                    {d.quarter} // {d.growth}
                  </div>
                  <div className="text-xs font-bold text-white">
                    ฿{d.actual} ล้านบาท
                  </div>
                </div>
              )}

              {/* Target Line Marker */}
              <div
                className="absolute w-full border-t-2 border-dashed border-slate-400 z-20"
                style={{ bottom: `${targetPct}%` }}
              />

              {/* Bar */}
              <div
                className={`w-full max-w-[48px] rounded-t-lg transition-all duration-300 relative ${
                  isHovered
                    ? "bg-gradient-to-t from-trd-secondary-dark via-trd-secondary to-trd-secondary-light shadow-[0_0_20px_rgba(212,175,55,0.6)]"
                    : "bg-gradient-to-t from-[#AA7C11]/80 to-[#D4AF37] shadow-neon-gold"
                }`}
                style={{ height: `${heightPct}%` }}
              >
                {/* Top Glow Cap */}
                <div className="w-full h-1 bg-white rounded-t-lg opacity-80" />
              </div>

              {/* Quarter Label */}
              <div className="mt-3 text-xs font-mono font-bold text-slate-300 group-hover:text-trd-secondary transition-colors">
                {d.quarter}
              </div>
            </div>
          );
        })}
      </div>

      {/* Chart Footer Summary */}
      <div className="mt-4 flex items-center justify-between text-xs text-slate-400 font-mono">
        <div>
          รวมสะสม 4 ไตรมาส: <span className="font-bold text-white">฿35.84 ล้านบาท</span>
        </div>
        <div className="text-emerald-400 font-bold">
          ↑ สูงกว่าเป้าหมายรวม 21.4%
        </div>
      </div>
    </div>
  );
}
