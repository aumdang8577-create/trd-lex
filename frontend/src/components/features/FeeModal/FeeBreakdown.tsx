"use client";

import Modal from "@/components/ui/Modal";

interface FeeBreakdownProps {
  isOpen: boolean;
  onClose: () => void;
  askingPrice: number;
  estimatedFee: number;
}

export default function FeeBreakdown({
  isOpen,
  onClose,
  askingPrice,
  estimatedFee,
}: FeeBreakdownProps) {
  const fmt = (n: number) => new Intl.NumberFormat("th-TH").format(n);

  // Fee breakdown structure (3% of asking price)
  const transferFeeRate = 0.02; // 2% ค่าธรรมเนียมโอน
  const stampDutyRate = 0.005;  // 0.5% อากรแสตมป์
  const adminFeeRate = 0.005;   // 0.5% ค่าดำเนินการ

  const transferFee = askingPrice * transferFeeRate;
  const stampDuty = askingPrice * stampDutyRate;
  const adminFee = askingPrice * adminFeeRate;
  const totalFee = transferFee + stampDuty + adminFee;
  return (
    <Modal isOpen={isOpen} onClose={onClose} title="รายละเอียดอัตราประมาณการค่าโอนสิทธิ์" size="md">
      <div className="space-y-4 font-sans text-trd-midnight">
        
        {/* Price Summary */}
        <div className="bg-[#FAFAFA] rounded-none border-2 border-trd-border p-4 font-mono">
          <div className="text-[9px] text-trd-text-muted mb-1 uppercase tracking-widest font-bold">ราคาเสนอโอนสิทธิ์สัญญาเช่า</div>
          <div className="text-2xl font-black text-trd-midnight">
            ฿{fmt(askingPrice)}
          </div>
        </div>

        {/* Fee Breakdown Lines */}
        <div className="space-y-3 font-mono">
          <div className="flex justify-between items-center py-2.5 border-b-2 border-trd-border/20">
            <div>
              <div className="text-xs font-bold text-trd-midnight uppercase tracking-wider">
                ค่าธรรมเนียมการโอนสิทธิ์
              </div>
              <div className="text-[9px] text-trd-text-muted mt-0.5">
                อัตราร้อยละ {(transferFeeRate * 100).toFixed(1)} ของมูลค่าการโอน
              </div>
            </div>
            <div className="text-sm font-black text-trd-midnight">
              ฿{fmt(transferFee)}
            </div>
          </div>

          <div className="flex justify-between items-center py-2.5 border-b-2 border-trd-border/20">
            <div>
              <div className="text-xs font-bold text-trd-midnight uppercase tracking-wider">
                ค่าอากรแสตมป์
              </div>
              <div className="text-[9px] text-trd-text-muted mt-0.5">
                อัตราร้อยละ {(stampDutyRate * 100).toFixed(1)} ของมูลค่าการโอน
              </div>
            </div>
            <div className="text-sm font-black text-trd-midnight">
              ฿{fmt(stampDuty)}
            </div>
          </div>

          <div className="flex justify-between items-center py-2.5 border-b-2 border-trd-border/20">
            <div>
              <div className="text-xs font-bold text-trd-midnight uppercase tracking-wider">
                ค่าธรรมเนียมการบริหารจัดการธุรการ
              </div>
              <div className="text-[9px] text-trd-text-muted mt-0.5">
                อัตราร้อยละ {(adminFeeRate * 100).toFixed(1)} ของมูลค่าการโอน
              </div>
            </div>
            <div className="text-sm font-black text-trd-midnight">
              ฿{fmt(adminFee)}
            </div>
          </div>
        </div>

        {/* Total */}
        <div className="bg-trd-primary/10 border-2 border-trd-border rounded-none p-4 flex justify-between items-center font-mono">
          <div>
            <div className="text-xs font-black text-trd-primary uppercase tracking-wider">
              รวมประมาณการค่าโอนสิทธิ์เบื้องต้น
            </div>
            <div className="text-[9px] text-trd-text-muted mt-0.5">
              (อัตราเฉลี่ยร้อยละ ๓.๐ ของมูลค่าการโอน)
            </div>
          </div>
          <div className="text-xl font-black text-trd-primary">
            ฿{fmt(totalFee)}
          </div>
        </div>

        {/* Disclaimer */}
        <p className="text-[9px] font-mono text-trd-text-muted leading-relaxed uppercase tracking-wider border-t-2 border-trd-border/20 pt-3">
          [ข้อควรระวัง] ข้อมูลการแจกแจงข้างต้นเป็นเพียงการคำนวณและประเมินเบื้องต้นเท่านั้น อัตราที่เรียกเก็บจริงอาจเปลี่ยนแปลงตามเงื่อนไขวัตถุประสงค์และระเบียบข้อบังคับฉบับจริงของกรมธนารักษ์
        </p>
      </div>
    </Modal>
  );
}
