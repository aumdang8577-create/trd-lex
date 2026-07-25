"use client";

export default function TopStatCards() {
  const stats = [
    {
      title: "พื้นที่ได้รับการพลิกฟื้นและจัดประโยชน์",
      value: "1,240,500",
      unit: "ตารางวา",
      trend: "+18.4% YoY",
      trendPositive: true,
      description: "เปลี่ยนพื้นที่ดินรกร้างให้เกิดมูลค่าทางเศรษฐกิจเพิ่มขึ้น",
      icon: "📈",
      glowClass: "shadow-[0_0_20px_rgba(15,26,48,0.4)] border-[#1E2E4A]",
      valueColor: "text-white",
      badgeBg: "bg-blue-950/60 text-blue-300 border-blue-800/60",
    },
    {
      title: "รายได้ค่าธรรมเนียมรัฐจัดเก็บได้รวม",
      value: "฿35,840,000",
      unit: "บาท",
      trend: "+24.2% YoY",
      trendPositive: true,
      description: "ประมาณการรายรับค่าธรรมเนียมหลวงนำส่งกรมธนารักษ์",
      icon: "💰",
      glowClass: "shadow-[0_0_25px_rgba(212,175,55,0.25)] border-[#D4AF37]/40",
      valueColor: "text-trd-secondary",
      badgeBg: "bg-[#D4AF37]/15 text-trd-secondary border-[#D4AF37]/40",
    },
    {
      title: "มูลค่าเศรษฐกิจหมุนเวียนรวมการลงทุน",
      value: "฿1,194,600,000",
      unit: "บาท",
      trend: "+31.5% YoY",
      trendPositive: true,
      description: "เม็ดเงินหมุนเวียนในตลาดรองและเงินลงทุนภาคเอกชน",
      icon: "🔄",
      glowClass: "shadow-[0_0_25px_rgba(16,185,129,0.2)] border-emerald-500/40",
      valueColor: "text-emerald-400",
      badgeBg: "bg-emerald-950/60 text-emerald-300 border-emerald-800/60",
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {stats.map((stat, idx) => (
        <div
          key={idx}
          className={`bg-[#0F1A30]/90 backdrop-blur-xl border rounded-2xl p-6 relative overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:border-opacity-80 ${stat.glowClass}`}
        >
          {/* Subtle Cyber Grid Accent */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-white/5 to-transparent rounded-full blur-2xl pointer-events-none" />

          {/* Card Header */}
          <div className="flex items-center justify-between mb-4">
            <span className="text-3xl">{stat.icon}</span>
            <span
              className={`text-[10px] font-mono font-bold uppercase tracking-widest px-2.5 py-1 rounded-full border ${stat.badgeBg}`}
            >
              {stat.trend}
            </span>
          </div>

          {/* Title */}
          <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wide font-sans mb-1">
            {stat.title}
          </h3>

          {/* Main Metric Value */}
          <div className="flex items-baseline gap-2 my-2">
            <span className={`text-3xl lg:text-4xl font-extrabold font-mono tracking-tight ${stat.valueColor}`}>
              {stat.value}
            </span>
            <span className="text-xs text-slate-400 font-mono font-medium">
              {stat.unit}
            </span>
          </div>

          {/* Description Footer */}
          <p className="text-[11px] text-slate-400 font-medium leading-relaxed mt-3 border-t border-[#1E2E4A]/80 pt-3">
            {stat.description}
          </p>
        </div>
      ))}
    </div>
  );
}
