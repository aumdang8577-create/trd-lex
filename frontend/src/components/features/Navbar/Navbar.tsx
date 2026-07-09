"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Button from "@/components/ui/Button";

type UserRole = "GUEST" | "SELLER" | "INVESTOR";

export default function Navbar() {
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
    window.location.href = "/";
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
    <nav className="bg-white border-b border-trd-border/50 sticky top-0 z-40 backdrop-blur-sm bg-white/95 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="relative w-10 h-10 transition-transform duration-300 group-hover:scale-105">
              <img
                src="https://upload.wikimedia.org/wikipedia/th/8/81/The_Treasury_Department_Logo.png"
                alt="ตราสัญลักษณ์กรมธนารักษ์"
                className="w-full h-full object-contain"
              />
            </div>
            <div>
              <span className="text-lg font-extrabold text-trd-primary">TRD</span>
              <span className="text-lg font-extrabold text-trd-secondary">-LEX</span>
              <p className="text-[9px] text-gray-400 -mt-1 font-semibold leading-tight">
                ตลาดซื้อขายสิทธิ์ราชพัสดุ
              </p>
            </div>
          </Link>

          {/* Role Demonstration Selector (For testing presentation modes) */}
          <div className="hidden lg:flex items-center gap-1 bg-gray-100 p-1.5 rounded-lg border border-trd-border/40 text-xs">
            <span className="text-gray-400 px-2 font-medium">โหมดทดสอบ:</span>
            {[
              { id: "GUEST", label: "บุคคลทั่วไป" },
              { id: "SELLER", label: "ผู้เช่า/ผู้ขาย" },
              { id: "INVESTOR", label: "นักลงทุน" },
            ].map((r) => (
              <button
                key={r.id}
                onClick={() => handleRoleChange(r.id as UserRole)}
                className={`px-3 py-1 rounded-md transition-all font-semibold ${
                  role === r.id
                    ? "bg-trd-primary text-white shadow-sm"
                    : "text-gray-500 hover:text-trd-primary"
                }`}
              >
                {r.label}
              </button>
            ))}
          </div>

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
                    className="text-sm font-semibold text-gray-600 hover:text-trd-primary transition-colors flex items-center gap-1"
                  >
                    {link.label}
                    <span className="text-[10px] transition-transform duration-200 group-hover:rotate-180">▼</span>
                  </Link>
                </div>
              ) : (
                <Link
                  key={link.label}
                  href={link.href}
                  className="text-sm font-semibold text-gray-600 hover:text-trd-primary transition-colors"
                >
                  {link.label}
                </Link>
              )
            )}
          </div>

          {/* Desktop Actions */}
          <div className="hidden md:flex items-center gap-3">
            {role === "GUEST" ? (
              <Button
                variant="primary"
                size="sm"
                className="!bg-gradient-to-r !from-trd-primary !to-trd-primary-light flex items-center gap-1.5 font-semibold text-xs py-2 px-4 shadow-sm"
                onClick={() => window.location.href = "/login"}
              >
                🛡️ เข้าสู่ระบบด้วย ThaID
              </Button>
            ) : (
              <div className="flex items-center gap-3">
                <div className="flex flex-col text-right">
                  <span className="text-xs font-bold text-trd-primary">
                    {role === "SELLER" ? "คุณสมชาย ใจดี" : "ผู้แทนบริษัท พัฒนาจำกัด"}
                  </span>
                  <span className="text-[10px] text-status-valid">✓ ThaID Verified</span>
                </div>
                <button
                  onClick={handleLogout}
                  className="text-xs font-semibold text-red-500 hover:underline"
                >
                  ออกจากระบบ
                </button>
              </div>
            )}
          </div>

          {/* Mobile Hamburger */}
          <button
            className="md:hidden w-10 h-10 flex items-center justify-center rounded-lg hover:bg-gray-100 transition-colors"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label="เปิดเมนู"
          >
            <svg
              className="w-5 h-5 text-gray-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              {isMobileMenuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>
      </div>

      {/* Mega Menu Dropdown */}
      {isMegaOpen && (
        <div
          className="absolute left-0 right-0 bg-white border-b border-trd-border/50 shadow-lg z-50 animate-slide-down hidden md:block"
          onMouseEnter={() => setIsMegaOpen(true)}
          onMouseLeave={() => setIsMegaOpen(false)}
        >
          <div className="max-w-7xl mx-auto px-8 py-8 grid grid-cols-4 gap-8">
            {/* Column 1 */}
            <div className="space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-trd-primary border-b border-trd-border/50 pb-2 flex items-center gap-1.5">
                🌏 แยกตามภูมิภาค
              </h4>
              <ul className="space-y-2 text-sm">
                {[
                  { name: "ภาคกลาง (กรุงเทพฯ & ปริมณฑล)", query: "province=กรุงเทพมหานคร" },
                  { name: "ภาคเหนือ (เชียงใหม่ & ท่องเที่ยว)", query: "province=เชียงใหม่" },
                  { name: "ภาคตะวันออก (ชลบุรี & ระยอง)", query: "province=ชลบุรี" },
                  { name: "ภาคอีสาน (ขอนแก่น & นครราชสีมา)", query: "query=ขอนแก่น" },
                ].map((item) => (
                  <li key={item.name}>
                    <Link href={`/listings?${item.query}`} className="text-gray-600 hover:text-trd-secondary hover:underline block py-0.5">
                      {item.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Column 2 */}
            <div className="space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-trd-primary border-b border-trd-border/50 pb-2 flex items-center gap-1.5">
                🏭 เขตเศรษฐกิจพิเศษ (EEC)
              </h4>
              <ul className="space-y-2 text-sm">
                {[
                  { name: "พื้นที่อุตสาหกรรมชลบุรี (พัทยา)", query: "province=ชลบุรี" },
                  { name: "พื้นที่พัฒนาพิเศษระยอง", query: "query=ระยอง" },
                  { name: "พื้นที่เชื่อมต่อฉะเชิงเทรา", query: "query=ฉะเชิงเทรา" },
                ].map((item) => (
                  <li key={item.name}>
                    <Link href={`/listings?${item.query}`} className="text-gray-600 hover:text-trd-secondary hover:underline block py-0.5 flex items-center gap-1">
                      <span>{item.name}</span>
                      <span className="text-[9px] bg-trd-secondary/15 text-trd-secondary-dark px-1.5 py-0.5 rounded font-bold">EEC</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Column 3 */}
            <div className="space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-trd-primary border-b border-trd-border/50 pb-2 flex items-center gap-1.5">
                📦 พื้นที่การค้าชายแดน
              </h4>
              <ul className="space-y-2 text-sm">
                {[
                  { name: "ด่านศุลกากรแม่สอด (ตาก)", query: "query=ตาก" },
                  { name: "พื้นที่เศรษฐกิจพิเศษสระแก้ว", query: "query=สระแก้ว" },
                  { name: "พื้นที่ขนส่งสินค้าหนองคาย", query: "query=หนองคาย" },
                ].map((item) => (
                  <li key={item.name}>
                    <Link href={`/listings?${item.query}`} className="text-gray-600 hover:text-trd-secondary hover:underline block py-0.5">
                      {item.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Column 4 */}
            <div className="space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-trd-primary border-b border-trd-border/50 pb-2 flex items-center gap-1.5">
                🔥 ทำเลทองยอดฮิต
              </h4>
              <ul className="space-y-2 text-sm">
                {[
                  { name: "พญาไท, กรุงเทพมหานคร", query: "query=พญาไท" },
                  { name: "ศรีภูมิ, คูเมืองเก่าเชียงใหม่", query: "query=ศรีภูมิ" },
                  { name: "บางละมุง, ชลบุรี", query: "query=บางละมุง" },
                ].map((item) => (
                  <li key={item.name}>
                    <Link href={`/listings?${item.query}`} className="text-gray-600 hover:text-trd-secondary hover:underline block py-0.5 font-medium">
                      ⭐ {item.name}
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
        <div className="md:hidden border-t border-trd-border/50 bg-white animate-fade-in shadow-inner">
          <div className="px-4 py-4 space-y-3">
            {/* Mobile test role pills */}
            <div className="bg-gray-50 p-2 rounded-xl border border-trd-border/30 flex items-center justify-around text-xs mb-2">
              <span className="text-gray-400 font-semibold">โหมดทดลอง:</span>
              {(["GUEST", "SELLER", "INVESTOR"] as UserRole[]).map((r) => (
                <button
                  key={r}
                  onClick={() => handleRoleChange(r)}
                  className={`px-2 py-1 rounded-md font-bold ${
                    role === r ? "bg-trd-primary text-white" : "text-gray-500"
                  }`}
                >
                  {r === "GUEST" ? "ทั่วไป" : r === "SELLER" ? "ผู้ขาย" : "นักลงทุน"}
                </button>
              ))}
            </div>

            {navLinks.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                className="block text-sm font-semibold text-gray-600 py-2 border-b border-gray-50"
              >
                {link.label}
              </Link>
            ))}

            <div className="pt-3 flex flex-col gap-2">
              {role === "GUEST" ? (
                <Button
                  variant="primary"
                  size="sm"
                  className="w-full flex items-center justify-center gap-1.5"
                  onClick={() => window.location.href = "/login"}
                >
                  🛡️ เข้าสู่ระบบด้วย ThaID
                </Button>
              ) : (
                <div className="flex items-center justify-between border-t border-trd-border/30 pt-3">
                  <div className="flex flex-col text-left">
                    <span className="text-xs font-bold text-trd-primary">
                      {role === "SELLER" ? "คุณสมชาย ใจดี" : "ผู้แทนบริษัท พัฒนาจำกัด"}
                    </span>
                    <span className="text-[9px] text-status-valid">✓ ThaID Verified</span>
                  </div>
                  <button
                    onClick={handleLogout}
                    className="text-xs font-semibold text-red-500 hover:underline"
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
