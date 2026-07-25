"use client";

interface ProvinceRank {
  rank: number;
  province: string;
  region: string;
  tag?: "EEC" | "SEZ";
  investmentValue: string;
  percentage: number;
  badge: string;
}

const topProvinces: ProvinceRank[] = [
  {
    rank: 1,
    province: "อุดรธานี",
    region: "ภาคตะวันออกเฉียงเหนือ",
    tag: "SEZ",
    investmentValue: "฿350,000,000",
    percentage: 100,
    badge: "🥇",
  },
  {
    rank: 2,
    province: "ขอนแก่น",
    region: "ภาคตะวันออกเฉียงเหนือ",
    investmentValue: "฿310,000,000",
    percentage: 88,
    badge: "🥈",
  },
  {
    rank: 3,
    province: "ชลบุรี",
    region: "ภาคตะวันออก (EEC)",
    tag: "EEC",
    investmentValue: "฿280,000,000",
    percentage: 80,
    badge: "🥉",
  },
  {
    rank: 4,
    province: "หนองคาย",
    region: "ภาคตะวันออกเฉียงเหนือ",
    tag: "SEZ",
    investmentValue: "฿150,000,000",
    percentage: 43,
    badge: "4",
  },
  {
    rank: 5,
    province: "กาญจนบุรี",
    region: "ภาคตะวันตก",
    investmentValue: "฿104,600,000",
    percentage: 30,
    badge: "5",
  },
];

export default function RegionalRanking() {
  return (
    <div className="bg-[#0F1A30]/90 backdrop-blur-xl border border-[#1E2E4A] rounded-2xl p-6 shadow-2xl relative">
      {/* Header */}
      <div className="border-b border-[#1E2E4A] pb-4 mb-6 flex items-center justify-between">
        <div>
          <div className="text-[10px] font-mono text-trd-secondary uppercase tracking-widest font-bold mb-1">
            [ ดัชนีทำเลเศรษฐกิจระดับภูมิภาค ]
          </div>
          <h3 className="text-base font-extrabold text-white uppercase tracking-wide font-sans">
            Top 5 จังหวัดที่มีมูลค่าการลงทุนหมุนเวียนสูงสุด
          </h3>
        </div>
        <span className="text-xs font-mono font-bold text-trd-secondary bg-trd-secondary/15 px-3 py-1 rounded-full border border-trd-secondary/30">
          ภูมิภาคฮอตสปอต
        </span>
      </div>

      {/* Rankings List */}
      <div className="space-y-4">
        {topProvinces.map((prov) => (
          <div
            key={prov.province}
            className="bg-[#070D1A]/60 border border-[#1E2E4A] rounded-xl p-4 hover:border-trd-secondary/50 transition-all duration-200"
          >
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-3">
                <span className="w-7 h-7 flex items-center justify-center font-mono font-black text-sm bg-[#0F1A30] border border-[#1E2E4A] rounded-lg text-trd-secondary">
                  {prov.badge}
                </span>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-bold text-white font-sans">
                      {prov.province}
                    </span>
                    {prov.tag && (
                      <span className="text-[9px] font-mono font-black bg-trd-secondary/20 text-trd-secondary border border-trd-secondary/40 px-1.5 py-0.5 rounded">
                        [{prov.tag}]
                      </span>
                    )}
                  </div>
                  <div className="text-[10px] text-slate-400 font-mono">
                    {prov.region}
                  </div>
                </div>
              </div>

              <div className="text-right font-mono">
                <div className="text-sm font-bold text-trd-secondary">
                  {prov.investmentValue}
                </div>
                <div className="text-[9px] text-slate-400">มูลค่าหมุนเวียน</div>
              </div>
            </div>

            {/* Animated Progress Bar */}
            <div className="w-full h-2 bg-[#0F1A30] rounded-full overflow-hidden border border-[#1E2E4A]">
              <div
                className="h-full bg-gradient-to-r from-trd-secondary-dark to-trd-secondary rounded-full transition-all duration-1000"
                style={{ width: `${prov.percentage}%` }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
