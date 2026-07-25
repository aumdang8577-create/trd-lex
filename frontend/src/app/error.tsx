"use client";

import { useEffect } from "react";
import Link from "next/link";

interface ErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function GlobalError({ error, reset }: ErrorProps) {
  useEffect(() => {
    console.error("[TRD-LEX] Runtime Error:", error);
  }, [error]);

  return (
    <div className="min-h-screen bg-[#070D1A] flex items-center justify-center px-4 py-20">
      <div className="text-center max-w-xl mx-auto">

        {/* Status Badge */}
        <div className="inline-flex items-center gap-2 bg-red-950/30 border border-red-800/40 rounded-full px-4 py-1.5 mb-8">
          <div className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
          <span className="text-red-400 text-[10px] font-mono font-black uppercase tracking-widest">
            SYSTEM ERROR — RUNTIME EXCEPTION
          </span>
        </div>

        {/* Icon */}
        <div className="flex justify-center mb-6">
          <div className="relative w-20 h-20 flex items-center justify-center">
            <div className="absolute inset-0 bg-red-950/20 border border-red-800/30 rounded-2xl" />
            <svg
              className="relative w-10 h-10 text-red-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
              />
            </svg>
          </div>
        </div>

        {/* Heading & Description */}
        <h2 className="text-2xl font-black text-white font-mono uppercase tracking-wide mb-3">
          เกิดข้อผิดพลาดในระบบ
        </h2>
        <p className="text-slate-400 text-sm leading-relaxed font-sans mb-2">
          ระบบ TRD-LEX พบข้อผิดพลาดที่ไม่คาดคิด กรุณาลองใหม่อีกครั้ง หรือกลับสู่หน้าหลัก
        </p>
        {error?.digest && (
          <p className="text-slate-600 text-[10px] font-mono mt-1 mb-6">
            Error Reference: {error.digest}
          </p>
        )}

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-3 justify-center mt-8">
          <button
            type="button"
            onClick={reset}
            className="inline-flex items-center justify-center gap-2 bg-red-700/30 hover:bg-red-700/50 border border-red-600/40 text-red-200 font-mono font-bold text-xs uppercase tracking-widest px-5 py-2.5 rounded-xl transition-all duration-200 active:scale-95"
          >
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            ลองใหม่อีกครั้ง
          </button>
          <Link
            href="/"
            className="inline-flex items-center justify-center gap-2 bg-gold-gradient border border-transparent text-[#0F1A30] font-mono font-black text-xs uppercase tracking-widest px-5 py-2.5 rounded-xl shadow-neon-gold hover:opacity-90 transition-all duration-200 active:scale-95"
          >
            กลับหน้าหลัก
          </Link>
        </div>
      </div>
    </div>
  );
}
