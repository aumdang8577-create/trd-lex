"use client";

import { useEffect } from "react";
import Link from "next/link";

interface ErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function ListingDetailError({ error, reset }: ErrorProps) {
  useEffect(() => {
    console.error("[TRD-LEX] Listing Detail Error:", error);
  }, [error]);

  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4 py-16">
      <div className="max-w-lg mx-auto text-center">

        {/* Status Badge */}
        <div className="inline-flex items-center gap-2 bg-red-950/30 border border-red-800/40 rounded-full px-4 py-1.5 mb-8">
          <div className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
          <span className="text-red-400 text-[10px] font-mono font-black uppercase tracking-widest">
            เกิดข้อผิดพลาด — LISTING ERROR
          </span>
        </div>

        {/* Icon */}
        <div className="flex justify-center mb-5">
          <div className="relative w-16 h-16 flex items-center justify-center">
            <div className="absolute inset-0 bg-red-950/20 border border-red-800/30 rounded-2xl" />
            <svg className="relative w-8 h-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
        </div>

        {/* Heading & Description */}
        <h2 className="text-xl font-black text-white font-mono uppercase tracking-wide mb-3">
          ไม่สามารถโหลดรายละเอียดประกาศได้
        </h2>
        <p className="text-slate-400 text-sm leading-relaxed font-sans mb-6">
          เกิดข้อผิดพลาดขณะโหลดข้อมูลรายละเอียดประกาศ กรุณาลองใหม่หรือกลับไปค้นหาประกาศอื่น
        </p>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <button
            type="button"
            onClick={reset}
            className="inline-flex items-center justify-center gap-2 bg-red-700/30 hover:bg-red-700/50 border border-red-600/40 text-red-200 font-mono font-bold text-xs uppercase tracking-widest px-5 py-2.5 rounded-xl transition-all duration-200 active:scale-95"
          >
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            ลองใหม่
          </button>
          <Link
            href="/listings"
            className="inline-flex items-center justify-center gap-2 bg-[#0F1A30] border border-[#1E2E4A] text-slate-300 font-mono font-bold text-xs uppercase tracking-widest px-5 py-2.5 rounded-xl hover:border-trd-secondary/40 hover:text-white transition-all duration-200 active:scale-95"
          >
            ค้นหาประกาศอื่น
          </Link>
        </div>
      </div>
    </div>
  );
}
