"use client";

import { useState, useEffect } from "react";
import Card, { CardContent, CardHeader } from "@/components/ui/Card";
import Badge from "@/components/ui/Badge";
import Button from "@/components/ui/Button";
import { formatCurrency } from "@/lib/utils";

// Mock historic SOLD transactions to calculate real-time looking dashboard metrics
const mockSoldListings = [
  { id: "sold-1", province: "กรุงเทพมหานคร", district: "พญาไท", area: 150, price: 2000000, fee: 60000, type: "พาณิชย์ (ร้านอาหาร)" },
  { id: "sold-2", province: "ชลบุรี", district: "บางละมุง", area: 250, price: 3200000, fee: 96000, type: "บริการ (โรงแรม/โฮสเทล)" },
  { id: "sold-3", province: "เชียงใหม่", district: "หางดง", area: 400, price: 4500000, fee: 135000, type: "เกษตรกรรมแปรรูป" },
  { id: "sold-4", province: "ภูเก็ต", district: "ถลาง", area: 180, price: 2800000, fee: 84000, type: "พาณิชย์ (ออฟฟิศทำงาน)" },
  { id: "sold-5", province: "ขอนแก่น", district: "เมืองขอนแก่น", area: 320, price: 1900000, fee: 57000, type: "พาณิชย์ (โกดังเก็บสินค้า)" }
];

export default function DashboardPage() {
  const [activeTab, setActiveTab] = useState<"overview" | "provincial">("overview");

  // Sum calculations
  const totalAreaDeveloped = mockSoldListings.reduce((sum, item) => sum + item.area, 0);
  const totalFeesCollected = mockSoldListings.reduce((sum, item) => sum + item.fee, 0);
  const totalInvestmentCirculated = mockSoldListings.reduce((sum, item) => sum + item.price, 0);

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
              พื้นที่ราชพัสดุแปรรูปเป็นธุรกิจใหม่
            </h3>
            <div className="flex items-baseline gap-2 mt-2">
              <span className="text-3xl font-bold text-trd-primary">
                {totalAreaDeveloped.toLocaleString()}
              </span>
              <span className="text-sm text-gray-500 font-medium">ตารางวา</span>
            </div>
            <p className="text-[10px] text-gray-400 mt-3">
              สะท้อนการใช้ประโยชน์ที่ดินว่างเปล่าให้เกิดโครงสร้างพื้นฐานใหม่
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
                  { name: "กรุงเทพมหานคร", val: 150, pct: "25%" },
                  { name: "ชลบุรี", val: 250, pct: "41.6%" },
                  { name: "เชียงใหม่", val: 400, pct: "66.6%" },
                  { name: "ภูเก็ต", val: 180, pct: "30%" },
                  { name: "ขอนแก่น", val: 320, pct: "53.3%" },
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
                  { name: "เชียงใหม่", val: 4500000, pct: "90%" },
                  { name: "ชลบุรี", val: 3200000, pct: "64%" },
                  { name: "ภูเก็ต", val: 2800000, pct: "56%" },
                  { name: "กรุงเทพมหานคร", val: 2000000, pct: "40%" },
                  { name: "ขอนแก่น", val: 1900000, pct: "38%" },
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
