"use client";

import Modal from "@/components/ui/Modal";

interface FeeBreakdownProps {
  isOpen: boolean;
  onClose: () => void;
  askingPrice: number;
  estimatedFee: number;
  annualRent?: number;
}

export default function FeeBreakdown({
  isOpen,
  onClose,
  askingPrice,
  estimatedFee,
  annualRent = 12000, // Default fallback matching database seed
}: FeeBreakdownProps) {
  const fmt = (n: number) => new Intl.NumberFormat("th-TH").format(n);

  // Calculations based strictly on Treasury Department Order 683/2560 (การคิดค่าเช่าค่าธรรมเนียม.md)
  const annualRentValue = annualRent;
  const generalTransferFee = annualRentValue * 6; // Rule 3.1: 6 times annual rent
  const familyTransferFee = annualRentValue * 1.5; // Rule 3.3: 25% of standard fee (1.5 times annual rent)
  const arrangementFee = annualRentValue * 2; // Rule 24.2/Calculations: 2 times annual rent for general

  // Apply rounding to nearest 10 Baht (Rule 23.2)
  const roundedGeneral = Math.round(generalTransferFee / 10) * 10;
  const roundedFamily = Math.round(familyTransferFee / 10) * 10;
  const roundedArrangement = Math.round(arrangementFee / 10) * 10;

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="ประมาณการค่าธรรมเนียมโอนสิทธิ์ (ระเบียบกรมธนารักษ์)" size="md">
      <div className="space-y-4 font-sans text-trd-midnight">
        
        {/* Info Header */}
        <div className="bg-[#070D1A]/10 border border-[#1E2E4A]/30 rounded-xl p-3.5 font-mono text-[9px] text-slate-500 uppercase tracking-wide leading-relaxed">
          ⚠️ คำนวณตามคำสั่งกรมธนารักษ์ ที่ 683/2560 เรื่อง หลักเกณฑ์การกำหนดอัตราค่าเช่า ค่าทดแทน และค่าธรรมเนียมเกี่ยวกับการจัดหาประโยชน์ในที่ราชพัสดุ
        </div>

        {/* Current Annual Rent Summary */}
        <div className="bg-[#FAFAFA] rounded-xl border border-trd-border/80 p-4 font-mono">
          <div className="text-[9px] text-trd-text-muted mb-1 uppercase tracking-widest font-bold">ค่าเช่ารายปีของสัญญาเช่าปัจจุบัน</div>
          <div className="text-2xl font-black text-trd-midnight">
            ฿{fmt(annualRentValue)} <span className="text-xs font-normal text-slate-400">/ ปี</span>
          </div>
        </div>

        {/* Fee Breakdown Lines (Strict Treasury Rules) */}
        <div className="space-y-3.5 font-mono">
          
          {/* General Transfer */}
          <div className="flex justify-between items-center py-2.5 border-b border-trd-border/20">
            <div>
              <div className="text-xs font-black text-trd-midnight uppercase tracking-wider">
                1. อัตราโอนสิทธิ์ทั่วไป (บุคคลทั่วไป)
              </div>
              <div className="text-[9px] text-trd-text-muted mt-0.5 leading-normal">
                อัตราปกติ ๖ เท่าของค่าเช่ารายปีตามสัญญาที่ปรับปรุงแล้ว (ข้อ 3.1)
              </div>
            </div>
            <div className="text-sm font-black text-trd-primary">
              ฿{fmt(roundedGeneral)}
            </div>
          </div>

          {/* Family Transfer */}
          <div className="flex justify-between items-center py-2.5 border-b border-trd-border/20">
            <div>
              <div className="text-xs font-black text-status-valid uppercase tracking-wider">
                2. อัตราโอนสิทธิ์ครอบครัว (บุพการี / ผู้สืบสันดาน / คู่สมรส)
              </div>
              <div className="text-[9px] text-trd-text-muted mt-0.5 leading-normal">
                ลดหย่อนร้อยละ ๗๕ เรียกเก็บเพียงร้อยละ ๒๕ ของอัตราปกติ (ข้อ 3.3)
              </div>
            </div>
            <div className="text-sm font-black text-status-valid">
              ฿{fmt(roundedFamily)}
            </div>
          </div>

          {/* Arrangement Fee */}
          <div className="flex justify-between items-center py-2.5 border-b border-trd-border/20">
            <div>
              <div className="text-xs font-black text-trd-midnight uppercase tracking-wider">
                3. ค่าธรรมเนียมจัดให้เช่าใหม่
              </div>
              <div className="text-[9px] text-trd-text-muted mt-0.5 leading-normal">
                ๒ เท่าของค่าเช่ารายปี เพื่อจัดทำสัญญาฉบับใหม่ให้กับผู้รับโอน
              </div>
            </div>
            <div className="text-sm font-black text-trd-midnight">
              ฿{fmt(roundedArrangement)}
            </div>
          </div>
        </div>

        {/* Total Summary box */}
        <div className="bg-trd-primary/10 border border-trd-primary/20 rounded-xl p-4 flex justify-between items-center font-mono">
          <div>
            <div className="text-xs font-black text-trd-primary uppercase tracking-wider">
              ค่าโอนสิทธิ์เบื้องต้น (อัตราทั่วไป)
            </div>
            <div className="text-[9px] text-trd-text-muted mt-0.5">
              *ไม่รวมค่าธรรมเนียมจัดให้เช่าใหม่ และค่าธรรมเนียมคำร้อง
            </div>
          </div>
          <div className="text-xl font-black text-trd-primary">
            ฿{fmt(roundedGeneral)}
          </div>
        </div>

        {/* Disclaimer */}
        <p className="text-[9px] font-mono text-trd-text-muted leading-relaxed uppercase tracking-wider border-t border-trd-border/30 pt-3">
          [หมายเหตุ] การโอนสิทธิ์ระหว่างผู้เช่าร่วม (Co-lessee) จะคิดส่วนลดตามสัดส่วนการถือครองจริง (ข้อ 3.2) และการคิดปัดเศษทศนิยมจะถูกปัดเศษขึ้นเป็นหลักสิบบาทตามระเบียบกรมธนารักษ์ (ข้อ 23.2)
        </p>
      </div>
    </Modal>
  );
}
