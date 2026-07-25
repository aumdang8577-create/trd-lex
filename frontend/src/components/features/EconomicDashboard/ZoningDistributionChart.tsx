"use client";

interface ZoningItem {
  name: string;
  code: string;
  value: string;
  percentage: number;
  colorClass: string;
  badgeBg: string;
}

const zoningItems: ZoningItem[] = [
  {
    name: "พื้นที่สีแดง (พาณิชยกรรม)",
    code: "COMMERCIAL",
    value: "฿537,570,000",
    percentage: 45,
    colorClass: "bg-red-500",
    badgeBg: "bg-red-950/60 text-red-400 border-red-800/60",
  },
  {
    name: "พื้นที่สีม่วง (อุตสาหกรรม EEC & โลจิสติกส์)",
    code: "EEC / INDUSTRIAL",
    value: "฿358,380,000",
    percentage: 30,
    colorClass: "bg-purple-500",
    badgeBg: "bg-purple-950/60 text-purple-300 border-purple-800/60",
  },
  {
    name: "พื้นที่สีเหลือง (ที่อยู่อาศัยหนาแน่นน้อย)",
    code: "RESIDENTIAL",
    value: "฿179,190,000",
    percentage: 15,
    colorClass: "bg-amber-400",
    badgeBg: "bg-amber-950/60 text-amber-300 border-amber-800/60",
  },
  {
    name: "พื้นที่สีเขียว (เกษตรกรรมยั่งยืน)",
    code: "AGRICULTURE",
    value: "฿119,460,000",
    percentage: 10,
    colorClass: "bg-emerald-500",
    badgeBg: "bg-emerald-950/60 text-emerald-300 border-emerald-800/60",
  },
];

export default function ZoningDistributionChart() {
  return (
    <div className="bg-[#0F1A30]/90 backdrop-blur-xl border border-[#1E2E4A] rounded-2xl p-6 shadow-2xl relative">
      {/* Header */}
      <div className="border-b border-[#1E2E4A] pb-4 mb-6">
        <div className="text-[10px] font-mono text-trd-secondary uppercase tracking-widest font-bold mb-1">
          [ สัดส่วนการลงทุนตามประเภทผังเมือง ]
        </div>
        <h3 className="text-base font-extrabold text-white uppercase tracking-wide font-sans">
          สัดส่วนการลงทุนแยกตามประเภทการใช้ประโยชน์ที่ดิน (Zoning)
        </h3>
      </div>

      {/* Multi-segment Progress Bar */}
      <div className="w-full h-4 bg-[#070D1A] rounded-full overflow-hidden flex p-0.5 border border-[#1E2E4A] mb-6 shadow-inner">
        {zoningItems.map((item) => (
          <div
            key={item.code}
            className={`h-full transition-all duration-1000 ${item.colorClass}`}
            style={{ width: `${item.percentage}%` }}
            title={`${item.name}: ${item.percentage}%`}
          />
        ))}
      </div>

      {/* Breakdown Items List */}
      <div className="space-y-4">
        {zoningItems.map((item) => (
          <div
            key={item.code}
            className="p-3 bg-[#070D1A]/50 border border-[#1E2E4A]/80 rounded-xl hover:border-trd-secondary/40 transition-all"
          >
            <div className="flex items-center justify-between mb-1.5">
              <div className="flex items-center gap-2">
                <span className={`w-3 h-3 rounded-full ${item.colorClass}`} />
                <span className="text-xs font-bold text-white font-sans">
                  {item.name}
                </span>
              </div>
              <span
                className={`text-[9px] font-mono font-bold px-2 py-0.5 rounded border uppercase ${item.badgeBg}`}
              >
                {item.percentage}%
              </span>
            </div>

            <div className="flex justify-between items-center text-xs font-mono">
              <span className="text-slate-400 text-[10px]">มูลค่าการลงทุนรวม:</span>
              <span className="font-bold text-white">{item.value}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
