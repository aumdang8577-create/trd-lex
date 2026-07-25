import Link from "next/link";

export default function ListingNotFound() {
  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4 py-16">
      <div className="max-w-xl mx-auto text-center">

        {/* Status Badge */}
        <div className="inline-flex items-center gap-2 bg-amber-950/30 border border-amber-800/40 rounded-full px-4 py-1.5 mb-8">
          <div className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
          <span className="text-amber-400 text-[10px] font-mono font-black uppercase tracking-widest">
            ไม่พบข้อมูลประกาศ — LISTING 404
          </span>
        </div>

        {/* Icon */}
        <div className="flex justify-center mb-6">
          <div className="relative w-24 h-24 flex items-center justify-center">
            <div className="absolute inset-0 bg-[#0F1A30] border border-[#1E2E4A] rounded-2xl" />
            <svg
              className="relative w-12 h-12 text-slate-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              />
            </svg>
          </div>
        </div>

        {/* Heading & Description */}
        <h2 className="text-2xl font-black text-white font-mono uppercase tracking-wide mb-3">
          ไม่พบประกาศที่ต้องการ
        </h2>
        <p className="text-slate-400 text-sm leading-relaxed font-sans mb-2">
          ประกาศโอนสิทธิ์เลขที่อ้างอิงนี้ไม่มีอยู่ในฐานข้อมูลระบบ TRD-LEX
        </p>
        <p className="text-slate-500 text-xs leading-relaxed font-sans mb-10">
          อาจถูกปิด ลบ หรือโอนสิทธิ์สำเร็จแล้ว โปรดค้นหาประกาศอื่นที่เปิดรับโอนสิทธิ์อยู่
        </p>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            href="/listings"
            className="inline-flex items-center justify-center gap-2 bg-gold-gradient border border-transparent text-[#0F1A30] font-mono font-black text-xs uppercase tracking-widest px-5 py-2.5 rounded-xl shadow-neon-gold hover:opacity-90 transition-all duration-200 active:scale-95"
          >
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            ค้นหาประกาศอื่น
          </Link>
          <Link
            href="/"
            className="inline-flex items-center justify-center gap-2 bg-[#0F1A30] border border-[#1E2E4A] text-slate-300 font-mono font-bold text-xs uppercase tracking-widest px-5 py-2.5 rounded-xl hover:border-trd-secondary/40 hover:text-white transition-all duration-200 active:scale-95"
          >
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            กลับหน้าแรก
          </Link>
        </div>
      </div>
    </div>
  );
}
