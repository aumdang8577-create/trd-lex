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
    <Modal isOpen={isOpen} onClose={onClose} title="โครงสร้างค่าธรรมเนียมการโอนสิทธิ์" size="md">
      <div className="space-y-4">
        {/* Price Summary */}
        <div className="bg-trd-primary/5 rounded-xl p-4">
          <div className="text-sm text-gray-500 mb-1">ราคาเสนอขายสิทธิ์</div>
          <div className="text-2xl font-bold text-trd-primary">
            ฿{fmt(askingPrice)}
          </div>
        </div>

        {/* Fee Breakdown Lines */}
        <div className="space-y-3">
          <div className="flex justify-between items-center py-2 border-b border-trd-border/30">
            <div>
              <div className="text-sm font-medium text-gray-700">
                ค่าธรรมเนียมการโอน
              </div>
              <div className="text-xs text-gray-400">
                {(transferFeeRate * 100).toFixed(1)}% ของราคาเสนอขาย
              </div>
            </div>
            <div className="text-sm font-semibold text-gray-800">
              ฿{fmt(transferFee)}
            </div>
          </div>

          <div className="flex justify-between items-center py-2 border-b border-trd-border/30">
            <div>
              <div className="text-sm font-medium text-gray-700">อากรแสตมป์</div>
              <div className="text-xs text-gray-400">
                {(stampDutyRate * 100).toFixed(1)}% ของราคาเสนอขาย
              </div>
            </div>
            <div className="text-sm font-semibold text-gray-800">
              ฿{fmt(stampDuty)}
            </div>
          </div>

          <div className="flex justify-between items-center py-2 border-b border-trd-border/30">
            <div>
              <div className="text-sm font-medium text-gray-700">
                ค่าดำเนินการ
              </div>
              <div className="text-xs text-gray-400">
                {(adminFeeRate * 100).toFixed(1)}% ของราคาเสนอขาย
              </div>
            </div>
            <div className="text-sm font-semibold text-gray-800">
              ฿{fmt(adminFee)}
            </div>
          </div>
        </div>

        {/* Total */}
        <div className="bg-trd-secondary/10 rounded-xl p-4 flex justify-between items-center">
          <div>
            <div className="text-sm font-semibold text-trd-primary">
              ค่าธรรมเนียมรวมโดยประมาณ
            </div>
            <div className="text-xs text-gray-400">
              (3.0% ของราคาเสนอขาย)
            </div>
          </div>
          <div className="text-xl font-bold text-trd-secondary-dark">
            ฿{fmt(totalFee)}
          </div>
        </div>

        {/* Disclaimer */}
        <p className="text-xs text-gray-400 leading-relaxed">
          ⚠️ ข้อมูลค่าธรรมเนียมเบื้องต้นนี้เป็นเพียงการประมาณการ
          อัตราจริงอาจแตกต่างตามระเบียบของกรมธนารักษ์และข้อกำหนดสัญญาเช่า
        </p>
      </div>
    </Modal>
  );
}
