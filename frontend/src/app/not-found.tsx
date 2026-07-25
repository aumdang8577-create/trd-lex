import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-[#070D1A] flex flex-col">
      <div className="flex-1 flex items-center justify-center px-4 py-20">
        <div className="text-center max-w-2xl mx-auto">
          
          {/* Status Code Badge */}
          <div className="inline-flex items-center gap-2 bg-red-950/30 border border-red-800/40 rounded-full px-4 py-1.5 mb-8">
            <div className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
            <span className="text-red-400 text-[10px] font-mono font-black uppercase tracking-widest">
              ระบบ ERROR 404 — PAGE NOT FOUND
            </span>
          </div>

          {/* Big 404 */}
          <div className="relative mb-6">
            <h1
              className="text-[120px] md:text-[180px] font-black leading-none font-mono select-none"
              style={{
                background: "linear-gradient(135deg, #1E2E4A 0%, #2a3f60 40%, #1E2E4A 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}
            >
              404
            </h1>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-40 h-40 md:w-56 md:h-56 border border-trd-secondary/10 rounded-full animate-ping opacity-20" />
            </div>
          </div>

          {/* Message */}
          <div className="space-y-3 mb-10">
            <h2 className="text-xl md:text-2xl font-black text-white font-mono uppercase tracking-wide">
              ไม่พบหน้าที่ต้องการ
            </h2>
            <p className="text-slate-400 text-sm leading-relaxed font-sans max-w-md mx-auto">
              URL ที่ระบุไม่มีอยู่ในระบบ TRD-LEX หรืออาจถูกลบหรือเปลี่ยนแปลง
              โปรดตรวจสอบ URL อีกครั้ง หรือกลับสู่หน้าหลักเพื่อค้นหาประกาศโอนสิทธิ์ที่ต้องการ
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/"
              className="inline-flex items-center justify-center gap-2 bg-gold-gradient border border-transparent text-[#0F1A30] font-mono font-black text-xs uppercase tracking-widest px-6 py-3 rounded-xl shadow-neon-gold hover:opacity-90 transition-all duration-200 active:scale-95"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
              </svg>
              กลับสู่หน้าหลัก
            </Link>
            <Link
              href="/listings"
              className="inline-flex items-center justify-center gap-2 bg-[#0F1A30] border border-[#1E2E4A] text-slate-200 font-mono font-bold text-xs uppercase tracking-widest px-6 py-3 rounded-xl hover:border-trd-secondary/40 hover:text-white transition-all duration-200 active:scale-95"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              ค้นหาประกาศโอนสิทธิ์
            </Link>
          </div>

          {/* Decorative Footer Info */}
          <div className="mt-16 pt-8 border-t border-[#1E2E4A]/60">
            <p className="text-slate-500 text-[10px] font-mono uppercase tracking-widest">
              [ TRD-LEX — ระบบดิจิทัลจัดการสิทธิการเช่าที่ราชพัสดุ | กรมธนารักษ์ กระทรวงการคลัง ]
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
