"use client";

import { useState, useEffect } from "react";
import Card, { CardContent, CardHeader } from "@/components/ui/Card";
import Badge from "@/components/ui/Badge";
import Button from "@/components/ui/Button";
import { formatCurrency } from "@/lib/utils";

// Mock historic SOLD transactions to calculate real-time looking dashboard metrics
const mockSoldListings = [
  { id: "sold-1", province: "อุดรธานี", district: "เมืองอุดรธานี", area: 150, price: 2000000, fee: 60000, type: "พาณิชย์ (ร้านอาหาร)" },
  { id: "sold-2", province: "ขอนแก่น", district: "เมืองขอนแก่น", area: 250, price: 3200000, fee: 96000, type: "บริการ (โรงแรม/โฮสเทล)" },
  { id: "sold-3", province: "หนองคาย", district: "เมืองหนองคาย", area: 400, price: 4500000, fee: 135000, type: "เกษตรกรรมแปรรูป" },
  { id: "sold-4", province: "อุดรธานี", district: "กุมภวาปี", area: 180, price: 2800000, fee: 84000, type: "พาณิชย์ (ออฟฟิศทำงาน)" },
  { id: "sold-5", province: "ขอนแก่น", district: "ชุมแพ", area: 320, price: 1900000, fee: 57000, type: "พาณิชย์ (โกดังเก็บสินค้า)" }
];

export default function DashboardPage() {
  const [activeTab, setActiveTab] = useState<"overview" | "provincial">("overview");
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

  // Sum calculations
  const totalAreaDeveloped = mockSoldListings.reduce((sum, item) => sum + item.area, 0);
  const totalFeesCollected = mockSoldListings.reduce((sum, item) => sum + item.fee, 0);
  const totalInvestmentCirculated = mockSoldListings.reduce((sum, item) => sum + item.price, 0);

  if (userRole === null) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="animate-pulse text-slate-450 font-mono text-xs uppercase tracking-widest font-bold">
          [ กำลังตรวจสอบสิทธิ์การเข้าใช้งาน... ]
        </div>
      </div>
    );
  }

  if (userRole !== "OFFICER") {
    return (
      <div className="min-h-[70vh] flex items-center justify-center px-4 py-12">
        <div className="max-w-md w-full bg-[#0F1A30] border-2 border-red-500/40 rounded-2xl p-8 text-center space-y-6 shadow-[0_15px_40px_rgba(239,68,68,0.15)] relative overflow-hidden">
          {/* Cyber grid bg pattern or subtle red top bar */}
          <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-red-600 to-orange-500"></div>
          
          <div className="w-16 h-16 bg-[#070D1A] border border-red-500/30 text-red-500 rounded-full flex items-center justify-center mx-auto text-3xl shadow-inner animate-pulse">
            🔒
          </div>

          <div className="space-y-2">
            <h2 className="text-base font-black text-white uppercase tracking-wider font-sans">
              เข้าถึงแบบจำกัดสิทธิ์ (เฉพาะเจ้าหน้าที่เท่านั้น)
            </h2>
            <p className="text-[10px] text-slate-400 uppercase tracking-widest font-mono font-bold">
              Restricted to Treasury Officials Only
            </p>
          </div>

          <p className="text-xs text-slate-300 leading-relaxed font-medium">
            ระบบหน้ารายงานสถิติและเครื่องมือวิเคราะห์มูลค่าทางเศรษฐกิจของรัฐ (แดชบอร์ดรายได้) สงวนสิทธิ์ไว้เฉพาะผู้ปฏิบัติงานและเจ้าหน้าที่ของกรมธนารักษ์เท่านั้น
          </p>

          <div className="bg-[#070D1A] rounded-xl border border-[#1E2E4A] p-4 text-[10.5px] text-trd-secondary-dark font-mono text-left space-y-1">
            <span className="font-black">[คำแนะนำการจำลองสิทธิ์]</span>
            <p className="text-slate-400 font-sans leading-normal font-medium mt-0.5">
              คุณสามารถเข้าใช้งานหน้านี้เพื่อทดสอบฟังก์ชันงานได้ทันที โดยทำการเปลี่ยนบทบาทผู้ใช้ให้เป็น **"เจ้าหน้าที่ธนารักษ์"** ผ่านแผงระบบจำลองบทบาทด้านบนสุดของแถบนำทาง Navbar ครับ
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-10 border-b border-trd-border/50 pb-6">
        <div>
          <h1 className="text-3xl font-extrabold text-trd-primary tracking-tight">
            ดัชนีชี้วัดความคุ้มค่าทางเศรษฐกิจ (Economic Indicators)
          </h1>
          <p className="text-gray-500 mt-2 text-sm md:text-base">
            รายงานวิเคราะห์ข้อมูลและมูลค่าทางเศรษฐกิจจริงที่เกิดขึ้นผ่านแพลตฟอร์มตลาดรองสิทธิการเช่าที่ราชพัสดุ
          </p>
        </div>

        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={() => window.print()}>
            🖨️ พิมพ์รายงานสรุป
          </Button>
        </div>
      </div>

      {/* KPI Section - จุดขายเชิงนวัตกรรม */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        {/* KPI 1 */}
        <Card className="border-l-4 border-l-trd-primary bg-gradient-to-br from-white to-trd-primary/5">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <span className="text-2xl">🔄</span>
              <Badge variant="gold">การเปลี่ยนมือสิทธิ์</Badge>
            </div>
            <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide">
              พื้นที่ราชพัสดุที่ได้รับการจัดประโยชน์และพัฒนาเชิงเศรษฐกิจ
            </h3>
            <div className="flex items-baseline gap-2 mt-2">
              <span className="text-3xl font-bold text-trd-primary">
                {totalAreaDeveloped.toLocaleString()}
              </span>
              <span className="text-sm text-gray-500 font-medium">ตารางวา</span>
            </div>
            <p className="text-[10px] text-gray-400 mt-3">
              สะท้อนการบริหารจัดการและส่งเสริมการใช้ประโยชน์ที่ดินราชพัสดุให้เกิดมูลค่าทางเศรษฐกิจเพิ่มขึ้น
            </p>
          </CardContent>
        </Card>

        {/* KPI 2 */}
        <Card className="border-l-4 border-l-trd-secondary bg-gradient-to-br from-white to-trd-secondary/5">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <span className="text-2xl">💰</span>
              <Badge variant="default">รายได้รัฐส่วนกลาง</Badge>
            </div>
            <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide">
              รายได้ค่าธรรมเนียมโอนที่รัฐจัดเก็บได้
            </h3>
            <div className="flex items-baseline gap-2 mt-2">
              <span className="text-3xl font-bold text-trd-secondary-dark">
                ฿{totalFeesCollected.toLocaleString()}
              </span>
              <span className="text-sm text-gray-500 font-medium">บาท</span>
            </div>
            <p className="text-[10px] text-gray-400 mt-3">
              ประมาณการรายรับเข้าระบบกรมธนารักษ์ (โอน 2% + อากร 0.5% + ดำเนินการ 0.5%)
            </p>
          </CardContent>
        </Card>

        {/* KPI 3 */}
        <Card className="border-l-4 border-l-status-valid bg-gradient-to-br from-white to-status-valid/5">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <span className="text-2xl">📈</span>
              <Badge variant="outline">การลงทุนสะสม</Badge>
            </div>
            <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide">
              มูลค่าการหมุนเวียนการลงทุนในพื้นที่
            </h3>
            <div className="flex items-baseline gap-2 mt-2">
              <span className="text-3xl font-bold text-status-valid">
                ฿{totalInvestmentCirculated.toLocaleString()}
              </span>
              <span className="text-sm text-gray-500 font-medium">บาท</span>
            </div>
            <p className="text-[10px] text-gray-400 mt-3">
              ผลรวมของมูลค่าธุรกรรมการเช่าที่ดินเพื่อนำไปประกอบกิจการหมุนเวียนในตลาด
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Tabs Menu */}
      <div className="flex border-b border-trd-border/50 mb-8">
        <button
          onClick={() => setActiveTab("overview")}
          className={`px-5 py-3 text-sm font-medium border-b-2 transition-all ${
            activeTab === "overview"
              ? "border-trd-primary text-trd-primary font-bold"
              : "border-transparent text-gray-400 hover:text-gray-600"
          }`}
        >
          📂 ธุรกรรมเปลี่ยนมือล่าสุด
        </button>
        <button
          onClick={() => setActiveTab("provincial")}
          className={`px-5 py-3 text-sm font-medium border-b-2 transition-all ${
            activeTab === "provincial"
              ? "border-trd-primary text-trd-primary font-bold"
              : "border-transparent text-gray-400 hover:text-gray-600"
          }`}
        >
          📊 สถิติแบ่งตามจังหวัด
        </button>
      </div>

      {/* Dynamic Content */}
      {activeTab === "overview" ? (
        <div className="space-y-6">
          <div className="bg-white border border-trd-border/50 rounded-2xl overflow-hidden shadow-sm">
            <div className="p-5 bg-gray-50 border-b border-trd-border/30">
              <h3 className="font-semibold text-trd-primary text-base">รายการโอนสิทธิราชพัสดุสำเร็จ (ประวัติ 30 วันล่าสุด)</h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm text-gray-600">
                <thead className="bg-gray-100/70 text-trd-primary font-semibold border-b border-trd-border/30">
                  <tr>
                    <th className="px-6 py-4">ทำเลพื้นที่</th>
                    <th className="px-6 py-4">ขนาดแปลง (ตร.ว.)</th>
                    <th className="px-6 py-4">ธุรกิจที่จัดตั้งใหม่</th>
                    <th className="px-6 py-4">มูลค่าโอนสิทธิ์</th>
                    <th className="px-6 py-4">ค่าธรรมเนียมจัดเก็บเข้ารัฐ</th>
                    <th className="px-6 py-4 text-center">สถานะ</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-trd-border/30">
                  {mockSoldListings.map((item) => (
                    <tr key={item.id} className="hover:bg-gray-50/50 transition-colors">
                      <td className="px-6 py-4 font-medium text-gray-800">
                        {item.district}, {item.province}
                      </td>
                      <td className="px-6 py-4">{item.area}</td>
                      <td className="px-6 py-4">
                        <Badge variant="outline">{item.type}</Badge>
                      </td>
                      <td className="px-6 py-4 font-semibold">฿{item.price.toLocaleString()}</td>
                      <td className="px-6 py-4 text-status-valid font-semibold">฿{item.fee.toLocaleString()}</td>
                      <td className="px-6 py-4 text-center">
                        <Badge variant="valid">โอนสิทธิ์เสร็จสิ้น</Badge>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Provincial Stats Chart mock using SVG */}
          <Card>
            <CardHeader>
              <h3 className="font-semibold text-trd-primary">สัดส่วนพื้นที่พัฒนาใหม่แยกตามจังหวัด (ตร.ว.)</h3>
            </CardHeader>
            <CardContent className="p-6">
              <div className="space-y-4">
                {[
                  { name: "ขอนแก่น", val: 570, pct: "95%" },
                  { name: "หนองคาย", val: 400, pct: "66.6%" },
                  { name: "อุดรธานี", val: 330, pct: "55%" },
                ].map((prov) => (
                  <div key={prov.name} className="space-y-1.5">
                    <div className="flex justify-between text-xs font-semibold text-gray-700">
                      <span>{prov.name}</span>
                      <span>{prov.val} ตร.ว. ({prov.pct})</span>
                    </div>
                    <svg className="w-full h-2.5 bg-gray-100 rounded-full overflow-hidden">
                      <rect
                        width={prov.pct}
                        height="100%"
                        className="fill-trd-primary transition-all duration-1000"
                      />
                    </svg>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Value distribution SVG Chart */}
          <Card>
            <CardHeader>
              <h3 className="font-semibold text-trd-primary">สัดส่วนเม็ดเงินการลงทุนสะสมแยกตามจังหวัด (บาท)</h3>
            </CardHeader>
            <CardContent className="p-6">
              <div className="space-y-4">
                {[
                  { name: "ขอนแก่น", val: 5100000, pct: "100%" },
                  { name: "อุดรธานี", val: 4800000, pct: "94%" },
                  { name: "หนองคาย", val: 4500000, pct: "88%" },
                ].map((prov) => (
                  <div key={prov.name} className="space-y-1.5">
                    <div className="flex justify-between text-xs font-semibold text-gray-700">
                      <span>{prov.name}</span>
                      <span>฿{prov.val.toLocaleString()} ({prov.pct})</span>
                    </div>
                    <svg className="w-full h-2.5 bg-gray-100 rounded-full overflow-hidden">
                      <rect
                        width={prov.pct}
                        height="100%"
                        className="fill-trd-secondary transition-all duration-1000"
                      />
                    </svg>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
