"use client";

import Link from "next/link";
import Card, { CardContent } from "@/components/ui/Card";
import Button from "@/components/ui/Button";

/**
 * ContractCheckPlaceholderPage — High-fidelity developer placeholder page for the Contract Check feature.
 * Displayed when user clicks "ตรวจสอบสถานะสัญญาเช่า" which is slated for future sprints.
 */
export default function ContractCheckPlaceholderPage() {
  return (
    <div className="min-h-[85vh] flex items-center justify-center px-4 bg-trd-surface font-sans">
      <Card className="max-w-lg w-full bg-[#0F1A30] border-2 border-[#1E2E4A] rounded-2xl p-8 text-center space-y-6 shadow-[0_20px_50px_rgba(212,175,55,0.12)] relative overflow-hidden">
        
        {/* Cyber top glow */}
        <div className="absolute top-0 left-0 right-0 h-1.5 bg-gold-gradient"></div>

        <div className="w-16 h-16 bg-[#070D1A] border border-[#1E2E4A] text-trd-secondary rounded-full flex items-center justify-center mx-auto text-3xl shadow-inner animate-pulse">
          🚧
        </div>

        <div className="space-y-2">
          <h2 className="text-xl font-black text-white uppercase tracking-wider font-sans">
            Feature Under Development
          </h2>
          <p className="text-[10px] text-trd-secondary font-mono tracking-widest font-bold uppercase">
            [ ฟังก์ชันการทำงานนี้สำหรับพัฒนาในอนาคต ]
          </p>
        </div>

        {/* Developer Dashboard Task Spec */}
        <div className="text-left bg-[#070D1A] rounded-xl border border-[#1E2E4A] p-4 font-mono text-[11px] space-y-2.5 text-slate-350 shadow-inner">
          <div className="flex justify-between border-b border-[#1E2E4A] pb-1.5 font-bold">
            <span className="text-trd-secondary font-black">📌 Task:</span>
            <span className="text-white">Smart Lease Contract Validation (TRD Integration)</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-400">Sprint Status:</span>
            <span className="text-trd-secondary-dark font-black">[ BACKLOG / PHASE 2 DEVELOPMENT ]</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-400">Environment:</span>
            <span className="text-slate-200">Staging-Beta / Next.js App Router v15</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-400">Estimated Delivery:</span>
            <span className="text-emerald-400 font-bold">Q4 2026 (ระบบบูรณาการสารสนเทศกรมธนารักษ์)</span>
          </div>
          
          <div className="border-t border-[#1E2E4A] pt-2 text-[10px] leading-relaxed text-slate-450 font-sans font-medium space-y-1">
            <p className="font-bold text-slate-300">รายละเอียดระบบ:</p>
            <p>
              ระบบตรวจสอบความถูกต้องและดึงข้อมูลเงื่อนไข ข้อตกลงสลักหลังสัญญา และวันสิ้นสุดสัญญาเช่าจากระบบฐานข้อมูลทะเบียนกลางของกรมธนารักษ์โดยตรง (TRD Core DB Integration) เพื่อรับประกันความถูกต้องทางกฎหมาย 100% ก่อนเริ่มดำเนินการเสนอโอนสิทธิ์
            </p>
          </div>
        </div>

        <div className="pt-2">
          <Link href="/">
            <Button variant="primary" className="!bg-gold-gradient text-[#0F1A30] font-mono text-xs font-black uppercase tracking-widest py-2.5 px-6 rounded-xl hover:opacity-90 transition-all cursor-pointer shadow-neon-gold border-transparent">
              ← กลับไปหน้าหลัก (Return to Main)
            </Button>
          </Link>
        </div>
      </Card>
    </div>
  );
}
