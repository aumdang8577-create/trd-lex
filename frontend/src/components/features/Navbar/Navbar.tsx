"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Button from "@/components/ui/Button";

type UserRole = "GUEST" | "SELLER" | "INVESTOR";

export default function Navbar() {
  const router = useRouter();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [role, setRole] = useState<UserRole>("GUEST");

  useEffect(() => {
    const savedRole = localStorage.getItem("trd_user_role") as UserRole;
    if (savedRole) {
      setRole(savedRole);
    }
  }, []);

  const handleRoleChange = (newRole: UserRole) => {
    setRole(newRole);
    localStorage.setItem("trd_user_role", newRole);
  };

  const handleLogout = () => {
    handleRoleChange("GUEST");
    router.push("/");
  };

  // Dynamic menu definitions
  const getNavLinks = () => {
    switch (role) {
      case "SELLER":
        return [
          { label: "จัดการประกาศของฉัน", href: "/my-listings" },
          { label: "ตรวจสอบสถานะสัญญาเช่า", href: "/contract-check" },
          { label: "แดชบอร์ดรายได้", href: "/dashboard" },
        ];
      case "INVESTOR":
        return [
          { label: "ค้นหาทำเลศักยภาพ", href: "/listings", hasMega: true },
          { label: "รายการที่บันทึกไว้ (Wishlist)", href: "/wishlist" },
          { label: "เปรียบเทียบค่าธรรมเนียม", href: "/dashboard" },
          { label: "ประวัติการติดต่อ", href: "/messages" },
        ];
      case "GUEST":
      default:
        return [
          { label: "ค้นหาทำเลศักยภาพ", href: "/listings", hasMega: true },
          { label: "วิธีการใช้งาน", href: "/#how-it-works" },
        ];
    }
  };

  const navLinks = getNavLinks();
  const [isMegaOpen, setIsMegaOpen] = useState(false);

  return (
    <nav className="sticky top-0 z-40 backdrop-blur-lg bg-[#0F1A30]/95 border-b-2 border-trd-secondary shadow-[0_4px_20px_rgba(15,26,48,0.25)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Left Section: Logo & Nav Links */}
          <div className="flex items-center gap-8">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2.5 group">
              <div className="relative w-10 h-10 transition-transform duration-200 group-hover:-translate-y-0.5">
                <img
                  src="https://upload.wikimedia.org/wikipedia/th/8/81/The_Treasury_Department_Logo.png"
                  alt="ตราสัญลักษณ์กรมธนารักษ์"
                  className="w-full h-full object-contain"
                />
              </div>
              <div>
                <span className="text-lg font-black text-white uppercase tracking-tight">TRD</span>
                <span className="text-lg font-black text-trd-secondary uppercase tracking-tight">-LEX</span>
                <p className="text-[8px] text-slate-300 -mt-1 font-bold leading-tight font-mono uppercase tracking-widest">
                  ตลาดรองสิทธิการเช่าที่ราชพัสดุ
                </p>
              </div>
            </Link>

            {/* Desktop Nav Links */}
            <div className="hidden md:flex items-center gap-6">
              {navLinks.map((link) =>
                link.hasMega ? (
                  <div
                    key={link.label}
                    className="relative h-16 flex items-center"
                    onMouseEnter={() => setIsMegaOpen(true)}
                    onMouseLeave={() => setIsMegaOpen(false)}
                  >
                    <Link
                      href={link.href}
                      className="text-xs font-bold uppercase tracking-wider text-slate-300 hover:text-trd-secondary transition-colors flex items-center gap-1 font-mono"
                    >
                      {link.label}
                      <span className="text-[8px]">▼</span>
                    </Link>
                  </div>
                ) : (
                  <Link
                    key={link.label}
                    href={link.href}
                    className="text-xs font-bold uppercase tracking-wider text-slate-300 hover:text-trd-secondary transition-colors font-mono"
                  >
                    {link.label}
                  </Link>
                )
              )}
            </div>
          </div>

          {/* Right Section: Role Selector, Actions, Mobile Hamburger */}
          <div className="flex items-center gap-4">
            {/* Role Demonstration Selector (Cyber glass tabs) */}
            <div className="hidden lg:flex items-center gap-1.5 bg-[#070D1A] p-1 border border-[#1E2E4A] rounded-xl text-[10px] font-mono shadow-[0_0_15px_rgba(0,0,0,0.5)]">
              <span className="text-slate-400 px-2 font-bold uppercase">ระบบจำลองบทบาท:</span>
              {[
                { id: "GUEST", label: "ผู้เข้าชมทั่วไป" },
                { id: "SELLER", label: "ผู้โอนสิทธิ์ (ผู้เช่าเดิม)" },
                { id: "INVESTOR", label: "ผู้รับโอนสิทธิ์ (ผู้ลงทุน)" },
              ].map((r) => (
                <button
                  key={r.id}
                  onClick={() => handleRoleChange(r.id as UserRole)}
                  className={`px-3 py-1 transition-all font-black border rounded-lg ${
                    role === r.id
                      ? "bg-gold-gradient text-[#0F1A30] border-transparent shadow-neon-gold"
                      : "text-slate-400 border-transparent hover:text-white"
                  }`}
                >
                  {r.label}
                </button>
              ))}
            </div>

            {/* Desktop Actions */}
            <div className="hidden md:flex items-center gap-3">
              {role === "GUEST" ? (
                <Button
                  variant="primary"
                  size="sm"
                  className="!bg-gold-gradient border border-transparent text-[#0F1A30] text-xs font-black font-mono py-1.5 px-4 rounded-xl shadow-neon-gold hover:opacity-90 transition-all duration-150"
                  onClick={() => router.push("/login")}
                >
                  ลงชื่อเข้าใช้ด้วย ThaID
                </Button>
              ) : (
                <div className="flex items-center gap-3">
                  <div className="flex flex-col text-right font-mono">
                    <span className="text-xs font-black text-white">
                      {role === "SELLER" ? "สมชาย ใจดี" : "ผู้แทนบริษัท พัฒนาจำกัด"}
                    </span>
                    <span className="text-[8px] text-trd-secondary uppercase tracking-wider font-extrabold">
                      [ยืนยันตัวตนผ่าน ThaID]
                    </span>
                  </div>
                  <button
                    onClick={handleLogout}
                    className="text-xs font-black text-red-400 hover:text-red-300 font-mono uppercase tracking-wider border border-[#1E2E4A] rounded-lg px-2.5 py-1 bg-[#1E2E4A]/30 hover:bg-[#1E2E4A]/60 transition-colors"
                  >
                    ออกจากระบบ
                  </button>
                </div>
              )}
            </div>

            {/* Mobile Hamburger */}
            <button
              className="md:hidden w-10 h-10 flex items-center justify-center border border-[#1E2E4A] hover:bg-[#1E2E4A]/50 rounded-xl transition-colors"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              aria-label="เปิดเมนู"
            >
              <svg
                className="w-5 h-5 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                {isMobileMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mega Menu Dropdown */}
      {isMegaOpen && (
        <div
          className="absolute left-0 right-0 bg-[#0F1A30]/95 backdrop-blur-xl border-b border-[#1E2E4A] shadow-2xl shadow-black/50 z-50 animate-slide-down hidden md:block"
          onMouseEnter={() => setIsMegaOpen(true)}
          onMouseLeave={() => setIsMegaOpen(false)}
        >
          <div className="max-w-7xl mx-auto px-8 py-8 grid grid-cols-4 gap-8">
            {/* Column 1 */}
            <div className="space-y-3 font-sans">
              <h4 className="text-xs font-black uppercase tracking-wider text-trd-secondary border-b border-[#1E2E4A] pb-2 flex items-center gap-1.5 font-mono">
                กลุ่มจังหวัดภูมิภาค
              </h4>
              <ul className="space-y-2 text-xs">
                {[
                  { name: "ภาคอีสาน (อุดรฯ & ขอนแก่น & หนองคาย)", query: "query=ภาคตะวันออกเฉียงเหนือ" },
                  { name: "ภาคกลาง (กรุงเทพฯ & ปริมณฑล)", query: "province=กรุงเทพมหานคร" },
                  { name: "ภาคเหนือ (เชียงใหม่ & ท่องเที่ยว)", query: "province=เชียงใหม่" },
                  { name: "ภาคตะวันออก (ชลบุรี & ระยอง)", query: "province=ชลบุรี" },
                ].map((item) => (
                  <li key={item.name}>
                    <Link href={`/listings?${item.query}`} className="text-slate-300 hover:text-white hover:underline block py-0.5 font-bold">
                      {item.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Column 2 */}
            <div className="space-y-3">
              <h4 className="text-xs font-black uppercase tracking-wider text-trd-secondary border-b border-[#1E2E4A] pb-2 flex items-center gap-1.5 font-mono">
                เขตพัฒนาพิเศษภาคตะวันออก (EEC)
              </h4>
              <ul className="space-y-2 text-xs">
                {[
                  { name: "พื้นที่อุตสาหกรรมชลบุรี (พัทยา)", query: "province=ชลบุรี" },
                  { name: "พื้นที่พัฒนาพิเศษระยอง", query: "query=ระยอง" },
                  { name: "พื้นที่เชื่อมต่อฉะเชิงเทรา", query: "query=ฉะเชิงเทรา" },
                ].map((item) => (
                  <li key={item.name}>
                    <Link href={`/listings?${item.query}`} className="text-slate-300 hover:text-white hover:underline block py-0.5 flex items-center gap-1.5 font-bold">
                      <span>{item.name}</span>
                      <span className="text-[8px] bg-trd-secondary/15 text-trd-secondary border border-trd-secondary/30 px-1 py-0.5 font-mono font-black rounded">EEC</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Column 3 */}
            <div className="space-y-3">
              <h4 className="text-xs font-black uppercase tracking-wider text-trd-secondary border-b border-[#1E2E4A] pb-2 flex items-center gap-1.5 font-mono">
                เขตเศรษฐกิจพิเศษชายแดน (SEZ)
              </h4>
              <ul className="space-y-2 text-xs">
                {[
                  { name: "ด่านศุลกากรแม่สอด (ตาก)", query: "query=ตาก" },
                  { name: "พื้นที่เศรษฐกิจพิเศษสระแก้ว", query: "query=สระแก้ว" },
                  { name: "พื้นที่ขนส่งสินค้าหนองคาย", query: "query=หนองคาย" },
                ].map((item) => (
                  <li key={item.name}>
                    <Link href={`/listings?${item.query}`} className="text-slate-300 hover:text-white hover:underline block py-0.5 font-bold">
                      {item.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Column 4 */}
            <div className="space-y-3">
              <h4 className="text-xs font-black uppercase tracking-wider text-trd-secondary border-b border-[#1E2E4A] pb-2 flex items-center gap-1.5 font-mono">
                ทำเลศักยภาพสูง
              </h4>
              <ul className="space-y-2 text-xs">
                {[
                  { name: "หมากแข้ง, อุดรธานี", query: "query=หมากแข้ง" },
                  { name: "ในเมือง, ขอนแก่น", query: "query=ขอนแก่น" },
                  { name: "ในเมือง, หนองคาย", query: "query=หนองคาย" },
                ].map((item) => (
                  <li key={item.name}>
                    <Link href={`/listings?${item.query}`} className="text-slate-300 hover:text-white hover:underline block py-0.5 font-bold">
                      {item.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden border-t border-[#1E2E4A] bg-[#0F1A30]/95 backdrop-blur-lg animate-fade-in">
          <div className="px-4 py-4 space-y-3">
            {/* Mobile test role pills */}
            <div className="bg-[#1E2E4A]/30 p-2 border border-[#1E2E4A]/60 flex items-center justify-around text-[9px] font-mono mb-2 rounded-xl">
              <span className="text-slate-400 font-bold">ระบบจำลองบทบาท:</span>
              {[
                { id: "GUEST", label: "ผู้เข้าชมทั่วไป" },
                { id: "SELLER", label: "ผู้โอนสิทธิ์ (ผู้เช่าเดิม)" },
                { id: "INVESTOR", label: "ผู้รับโอนสิทธิ์ (ผู้ลงทุน)" },
              ].map((r) => (
                <button
                  key={r.id}
                  onClick={() => handleRoleChange(r.id as UserRole)}
                  className={`px-2 py-0.5 font-black border rounded-lg ${
                    role === r.id ? "bg-gold-gradient text-[#0F1A30] border-transparent shadow-neon-gold" : "text-slate-400 border-transparent"
                  }`}
                >
                  {r.label}
                </button>
              ))}
            </div>

            {navLinks.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                className="block text-xs font-black uppercase tracking-wider text-slate-300 py-2.5 border-b border-[#1E2E4A]/40 hover:text-white font-mono"
              >
                {link.label}
              </Link>
            ))}

            <div className="pt-3 flex flex-col gap-2">
              {role === "GUEST" ? (
                <Button
                  variant="primary"
                  size="sm"
                  className="w-full flex items-center justify-center gap-1.5 rounded-xl border border-transparent text-xs py-2 shadow-neon-gold bg-gold-gradient text-[#0F1A30] font-mono font-black"
                  onClick={() => router.push("/login")}
                >
                  ลงชื่อเข้าใช้ด้วย ThaID
                </Button>
              ) : (
                <div className="flex items-center justify-between border-t border-[#1E2E4A] pt-3">
                  <div className="flex flex-col text-left font-mono">
                    <span className="text-xs font-bold text-white">
                      {role === "SELLER" ? "คุณสมชาย ใจดี" : "ผู้แทนบริษัท พัฒนาจำกัด"}
                    </span>
                    <span className="text-[8px] text-trd-secondary uppercase tracking-wider font-extrabold">
                      [ยืนยันตัวตนผ่าน ThaID]
                    </span>
                  </div>
                  <button
                    onClick={handleLogout}
                    className="text-xs font-black text-red-400 hover:underline font-mono border border-[#1E2E4A] bg-[#1E2E4A]/30 rounded-lg px-2 py-0.5"
                  >
                    ออกจากระบบ
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
