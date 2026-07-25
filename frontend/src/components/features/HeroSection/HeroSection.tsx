"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import AnimatedHeading from "@/components/ui/AnimatedHeading";
import FadeIn from "@/components/ui/FadeIn";

export default function HeroSection() {
  const router = useRouter();

  return (
    <section className="relative min-h-screen w-full flex flex-col justify-between overflow-hidden bg-black text-white font-sans">
      {/* Video Background */}
      <video
        autoPlay
        loop
        muted
        playsInline
        poster="https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1920&q=80"
        className="absolute inset-0 w-full h-full object-cover z-0"
        src="https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260403_050628_c4e32401-fab4-4a27-b7a8-6e9291cd5959.mp4"
      />

      {/* Accessible Semi-transparent Overlay (Midnight Tint for contrast) */}
      <div className="absolute inset-0 bg-[#0F1A30]/45 z-10 pointer-events-none" />

      {/* Navbar Container */}
      <header className="relative z-20 w-full px-6 md:px-12 lg:px-16 pt-6">
        <nav className="liquid-glass rounded-xl px-4 py-2 flex items-center justify-between border border-white/20 shadow-2xl">
          {/* Left: Logo */}
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="w-8 h-8 relative transition-transform duration-200 group-hover:scale-105">
              <img
                src="https://upload.wikimedia.org/wikipedia/th/8/81/The_Treasury_Department_Logo.png"
                alt="ตราสัญลักษณ์กรมธนารักษ์"
                className="w-full h-full object-contain"
              />
            </div>
            <div className="flex items-baseline">
              <span className="text-2xl font-semibold tracking-tight text-white">TRD</span>
              <span className="text-2xl font-semibold tracking-tight text-trd-secondary">-LEX</span>
            </div>
          </Link>

          {/* Center Links (Desktop) */}
          <div className="hidden md:flex items-center gap-8 text-sm text-white font-medium">
            <Link
              href="/listings"
              className="hover:text-gray-300 transition-colors"
            >
              ค้นหาประกาศ
            </Link>
            <Link
              href="/#how-it-works"
              className="hover:text-gray-300 transition-colors"
            >
              วิธีใช้งาน
            </Link>
            <Link
              href="/contract-check"
              className="hover:text-gray-300 transition-colors"
            >
              ตรวจสอบสัญญา
            </Link>
            <Link
              href="/dashboard"
              className="hover:text-gray-300 transition-colors"
            >
              แดชบอร์ด
            </Link>
          </div>

          {/* Right: CTA Button */}
          <button
            onClick={() => router.push("/login")}
            className="bg-white text-black px-6 py-2 rounded-lg text-sm font-medium hover:bg-gray-100 transition-colors font-sans"
          >
            เข้าสู่ระบบ ThaID
          </button>
        </nav>
      </header>

      {/* Hero Content at Bottom of Viewport */}
      <div className="relative z-20 flex-1 flex flex-col justify-end px-6 md:px-12 lg:px-16 pb-12 lg:pb-16 pt-24">
        <div className="w-full lg:grid lg:grid-cols-2 lg:items-end gap-8">
          {/* Left Column: Heading, Subheading & Action Buttons */}
          <div>
            <AnimatedHeading
              text={`พลิกโฉมที่ราชพัสดุ\nด้วยนวัตกรรมดิจิทัล`}
              className="text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-normal mb-4 text-white leading-tight"
              initialDelay={200}
              charDelay={30}
              duration={500}
            />

            <FadeIn delay={800} duration={1000}>
              <p className="text-base md:text-lg text-gray-300 mb-5 max-w-xl font-light leading-relaxed">
                แพลตฟอร์มการซื้อขายและโอนสิทธิการเช่าที่ราชพัสดุอย่างโปร่งใส 
                สืบค้นประกาศหาผู้รับโอนสิทธิผ่านระบบ Smart Validation และยืนยันตัวตนผ่าน ThaID
              </p>
            </FadeIn>

            <FadeIn delay={1200} duration={1000}>
              <div className="flex flex-wrap gap-4 items-center">
                <button
                  onClick={() => router.push("/listings")}
                  className="bg-white text-black px-8 py-3 rounded-lg font-medium hover:bg-gray-100 transition-colors text-sm md:text-base shadow-lg"
                >
                  ค้นหาประกาศ
                </button>
                <button
                  onClick={() => {
                    const el = document.getElementById("stats-section");
                    if (el) el.scrollIntoView({ behavior: "smooth" });
                  }}
                  className="liquid-glass border border-white/20 text-white px-8 py-3 rounded-lg font-medium hover:bg-white hover:text-black transition-all duration-200 text-sm md:text-base"
                >
                  สำรวจเพิ่มเติม
                </button>
              </div>
            </FadeIn>
          </div>

          {/* Right Column: Glass Tag */}
          <div className="flex items-end justify-start lg:justify-end mt-8 lg:mt-0">
            <FadeIn delay={1400} duration={1000}>
              <div className="liquid-glass border border-white/20 px-6 py-3 rounded-xl shadow-2xl">
                <span className="text-lg md:text-xl lg:text-2xl font-light tracking-wide text-white font-sans">
                  โปร่งใส. ตรวจสอบได้. ยั่งยืน.
                </span>
              </div>
            </FadeIn>
          </div>
        </div>
      </div>
    </section>
  );
}
