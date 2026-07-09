import Button from "@/components/ui/Button";
import Badge from "@/components/ui/Badge";

export default function HomePage() {
  return (
    <>
      {/* Hero Section */}
      <section className="relative bg-hero-gradient text-white overflow-hidden">
        {/* Decorative gold accent */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-trd-secondary/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
        <div className="absolute bottom-0 left-0 w-72 h-72 bg-trd-secondary/5 rounded-full blur-2xl translate-y-1/2 -translate-x-1/2" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 lg:py-32">
          <div className="max-w-3xl animate-fade-in">
            {/* Verified badge */}
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-4 py-2 mb-6">
              <span className="w-2 h-2 bg-trd-secondary rounded-full animate-pulse-gold" />
              <span className="text-sm font-medium">Smart &amp; Sustainable Treasury</span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
              ตลาดรองสิทธิการเช่า
              <br />
              <span className="text-trd-secondary">ที่ราชพัสดุ</span>
            </h1>

            <p className="text-lg sm:text-xl text-white/80 mb-8 max-w-2xl leading-relaxed">
              แพลตฟอร์มเพื่อเปลี่ยนมือสิทธิการเช่าอย่างโปร่งใส ตรวจสอบได้
              ผ่านการยืนยันตัวตนจากระบบ ThaID ของกรมธนารักษ์
            </p>

            <div className="flex flex-col sm:flex-row gap-4">
              <Button variant="secondary" size="lg">
                🔍 ค้นหาประกาศ
              </Button>
              <Button variant="outline" size="lg">
                📋 ลงประกาศขายสิทธิ์
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-12 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            { label: "ประกาศเปิดขาย", value: "128", icon: "📋" },
            { label: "ผู้ใช้งานในระบบ", value: "1,240", icon: "👥" },
            { label: "มูลค่ารวม (ล้านบาท)", value: "356", icon: "💰" },
          ].map((stat) => (
            <div
              key={stat.label}
              className="trd-card px-6 py-5 flex items-center gap-4 animate-slide-up"
            >
              <div className="text-3xl">{stat.icon}</div>
              <div>
                <div className="text-2xl font-bold text-trd-primary">
                  {stat.value}
                </div>
                <div className="text-sm text-gray-500">{stat.label}</div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Features Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center mb-12">
          <h2 className="trd-section-title text-3xl">ฟีเจอร์หลักของระบบ</h2>
          <div className="trd-gold-divider mx-auto mt-4" />
          <p className="mt-4 text-gray-500 max-w-xl mx-auto">
            ออกแบบเพื่อความโปร่งใสและการตรวจสอบได้ทุกขั้นตอน
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[
            {
              icon: "🛡️",
              title: "ยืนยันตัวตน ThaID",
              desc: "ระบบจำลองการยืนยันตัวตนผ่าน ThaID ของกรมการปกครอง เพื่อความปลอดภัยสูงสุด",
              badge: "ความปลอดภัย",
            },
            {
              icon: "📄",
              title: "ตรวจสอบสัญญาเช่า",
              desc: "ตรวจสอบสถานะสัญญาเช่าที่ราชพัสดุแบบอัตโนมัติ ลดเวลาดำเนินการด้วยมือ",
              badge: "Smart Validation",
            },
            {
              icon: "🗺️",
              title: "ค้นหาเชิงพื้นที่",
              desc: "แสดงหมุดประกาศที่เปิดขายบนแผนที่ ค้นหาตามจังหวัดและอำเภอได้ทันที",
              badge: "Map Search",
            },
            {
              icon: "💵",
              title: "ประเมินค่าธรรมเนียม",
              desc: "คำนวณค่าธรรมเนียมการโอนสิทธิ์เบื้องต้นอัตโนมัติ โปร่งใสทุกรายการ",
              badge: "Fee Estimator",
            },
            {
              icon: "📊",
              title: "จัดการประกาศ",
              desc: "สร้าง แก้ไข และปิดประกาศได้ด้วยตนเอง มีสถานะชัดเจน (ACTIVE/SOLD/HIDDEN)",
              badge: "CRUD",
            },
            {
              icon: "✅",
              title: "Verified by TRD",
              desc: "ทุกประกาศผ่านการตรวจสอบสิทธิ์จากระบบฐานข้อมูลกรมธนารักษ์",
              badge: "Trust Badge",
            },
          ].map((feature) => (
            <div key={feature.title} className="trd-card p-6 group">
              <div className="text-4xl mb-4">{feature.icon}</div>
              <Badge variant="gold" className="mb-3">
                {feature.badge}
              </Badge>
              <h3 className="text-lg font-semibold text-trd-primary mb-2">
                {feature.title}
              </h3>
              <p className="text-sm text-gray-500 leading-relaxed">
                {feature.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA Footer */}
      <section className="bg-trd-gradient text-white py-16">
        <div className="max-w-4xl mx-auto text-center px-4">
          <h2 className="text-3xl font-bold mb-4">
            พร้อมเริ่มต้นใช้งาน?
          </h2>
          <p className="text-white/80 mb-8 text-lg">
            เข้าสู่ระบบด้วย ThaID เพื่อเริ่มค้นหาหรือลงประกาศสิทธิการเช่าที่ราชพัสดุ
          </p>
          <Button variant="secondary" size="lg">
            เข้าสู่ระบบด้วย ThaID →
          </Button>
        </div>
      </section>
    </>
  );
}
