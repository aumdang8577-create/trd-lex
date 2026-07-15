"use client";

import { useState } from "react";
import Modal from "@/components/ui/Modal";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import api from "@/lib/api";
import type { LeaseContract } from "@/types";

interface CreateListingModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

enum STEPS {
  VALIDATE = 0,
  DETAILS = 1,
  IMAGES = 2,
  CONFIRM = 3,
}

export default function CreateListingModal({
  isOpen,
  onClose,
  onSuccess,
}: CreateListingModalProps) {
  const [step, setStep] = useState(STEPS.VALIDATE);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Step 1: Validation State
  const [contractNumber, setContractNumber] = useState("");
  const [contractData, setContractData] = useState<LeaseContract | null>(null);

  // Step 2: Details State
  const [askingPrice, setAskingPrice] = useState("");
  const [description, setDescription] = useState("");

  // Step 3: Images State
  const [imageUrls, setImageUrls] = useState<string[]>([""]);

  const onBack = () => {
    if (step > STEPS.VALIDATE) {
      setStep((value) => value - 1);
    }
  };

  const onNext = () => {
    if (step < STEPS.CONFIRM) {
      setStep((value) => value + 1);
    }
  };

  // Step 1 handler
  const handleValidate = async () => {
    setError("");
    setLoading(true);

    if (!contractNumber) {
      setError("กรุณากรอกเลขที่สัญญาเช่า");
      setLoading(false);
      return;
    }

    try {
      const res = await api.validateContract({ contract_number: contractNumber });
      if (res.is_valid && res.contract_data) {
        setContractData(res.contract_data);
        onNext();
      } else {
        setError(res.message || "สัญญาเช่าไม่ผ่านการตรวจสอบความถูกต้อง");
      }
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "เกิดข้อผิดพลาดในการเชื่อมต่อข้อมูล");
    } finally {
      setLoading(false);
    }
  };

  // Step 2 validation
  const validateDetails = () => {
    setError("");
    if (!askingPrice || parseFloat(askingPrice) <= 0) {
      setError("กรุณากรอกราคาเสนอขายสิทธิ์ที่ถูกต้อง");
      return;
    }
    onNext();
  };

  // Step 3 validation
  const validateImages = () => {
    setError("");
    const validUrls = imageUrls.filter((url) => url.trim() !== "");
    if (validUrls.length === 0) {
      setError("กรุณาใส่ลิงก์รูปภาพอย่างน้อย 1 รูป");
      return;
    }
    onNext();
  };

  // Submit listing creation
  const handleSubmit = async () => {
    if (!contractData) return;
    setError("");
    setLoading(true);

    try {
      await api.createListing({
        contractId: contractData.id,
        asking_price: parseFloat(askingPrice),
        description: description,
        image_urls: imageUrls.filter((url) => url.trim() !== ""),
      });
      
      if (onSuccess) onSuccess();
      // Reset state and close modal
      setStep(STEPS.VALIDATE);
      setContractNumber("");
      setContractData(null);
      setAskingPrice("");
      setDescription("");
      setImageUrls([""]);
      onClose();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "เกิดข้อผิดพลาดในการลงประกาศ");
    } finally {
      setLoading(false);
    }
  };

  // Dynamic content based on step
  const renderContent = () => {
    switch (step) {
      case STEPS.VALIDATE:
        return (
          <div className="space-y-4">
            <h4 className="font-black text-trd-primary uppercase tracking-wider font-mono text-sm">ขั้นตอนที่ 1: ตรวจสอบสัญญาเช่าที่ราชพัสดุ</h4>
            <p className="text-xs text-trd-text-muted font-bold">กรุณากรอกรหัสเลขสัญญาของคุณเพื่อยืนยันตัวตนและความถูกต้องของแปลงที่ดินกับฐานข้อมูลกรมธนารักษ์</p>
            <Input
              label="เลขที่สัญญาเช่า"
              placeholder="ตัวอย่าง: TRD-66-001 หรือ TRD-66-002"
              value={contractNumber}
              onChange={(e) => setContractNumber(e.target.value)}
              required
            />
            {error && <p className="text-xs text-val-e font-mono font-bold">[ข้อผิดพลาด] {error}</p>}
            <div className="flex justify-end gap-2 pt-4">
              <Button variant="outline" size="sm" className="rounded-none border-2 border-trd-border font-black text-xs" onClick={onClose} disabled={loading}>ยกเลิก</Button>
              <Button variant="primary" size="sm" className="rounded-none border-2 border-trd-border bg-trd-primary text-white shadow-flat hover:shadow-flat-hover transition-all font-black text-xs" onClick={handleValidate} isLoading={loading}>ตรวจสอบสถานะ</Button>
            </div>
          </div>
        );

      case STEPS.DETAILS:
        return (
          <div className="space-y-4">
            <h4 className="font-black text-trd-primary uppercase tracking-wider font-mono text-sm">ขั้นตอนที่ 2: ระบุข้อมูลการเสนอขายและตั้งราคา</h4>
            <p className="text-xs text-trd-text-muted font-bold">แปลง {contractData?.parcel_number} ({contractData?.province}) ขนาด {contractData?.land_area_sqw} ตร.ว.</p>
            <Input
              label="ราคาเสนอขายสิทธิ์ (บาท)"
              type="number"
              placeholder="ระบุตัวเลขจำนวนเงิน"
              value={askingPrice}
              onChange={(e) => setAskingPrice(e.target.value)}
              required
            />
            <div className="w-full font-sans">
              <label className="block text-xs font-black text-trd-midnight mb-1.5 uppercase tracking-widest font-mono">คำอธิบายรายละเอียดที่ดิน</label>
              <textarea
                className="trd-input min-h-[100px] resize-none"
                placeholder="ระบุข้อดี จุดเด่น ทำเล สภาพสิ่งปลูกสร้าง"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>
            {error && <p className="text-xs text-val-e font-mono font-bold">[ข้อผิดพลาด] {error}</p>}
            <div className="flex justify-between pt-4">
              <Button variant="outline" size="sm" className="rounded-none border-2 border-trd-border font-black text-xs" onClick={onBack}>ย้อนกลับ</Button>
              <Button variant="primary" size="sm" className="rounded-none border-2 border-trd-border bg-trd-primary text-white shadow-flat hover:shadow-flat-hover transition-all font-black text-xs" onClick={validateDetails}>ขั้นตอนถัดไป</Button>
            </div>
          </div>
        );

      case STEPS.IMAGES:
        return (
          <div className="space-y-4">
            <h4 className="font-black text-trd-primary uppercase tracking-wider font-mono text-sm">ขั้นตอนที่ 3: เพิ่มรูปภาพประกอบ</h4>
            <p className="text-xs text-trd-text-muted font-bold">ใส่ลิงก์ URL รูปภาพที่ดินหรือสภาพทำเลโดยรอบเพื่อให้ผู้ซื้อประกอบการตัดสินใจ</p>
            {imageUrls.map((url, index) => (
              <div key={index} className="flex gap-2 items-center">
                <Input
                  placeholder="https://images.unsplash.com/..."
                  value={url}
                  onChange={(e) => {
                    const newUrls = [...imageUrls];
                    newUrls[index] = e.target.value;
                    setImageUrls(newUrls);
                  }}
                />
                {imageUrls.length > 1 && (
                  <button
                    onClick={() => setImageUrls(imageUrls.filter((_, i) => i !== index))}
                    className="p-2.5 text-val-e border-2 border-trd-border hover:bg-red-50 font-black rounded-none"
                    type="button"
                  >
                    🗑️
                  </button>
                )}
              </div>
            ))}
            <button
              onClick={() => setImageUrls([...imageUrls, ""])}
              className="text-xs text-trd-primary hover:underline block mt-2 font-black font-mono uppercase tracking-wider"
              type="button"
            >
              [เพิ่มช่องกรอกลิงก์รูปภาพเพิ่มเติม]
            </button>
            {error && <p className="text-xs text-val-e font-mono font-bold">[ข้อผิดพลาด] {error}</p>}
            <div className="flex justify-between pt-4">
              <Button variant="outline" size="sm" className="rounded-none border-2 border-trd-border font-black text-xs" onClick={onBack}>ย้อนกลับ</Button>
              <Button variant="primary" size="sm" className="rounded-none border-2 border-trd-border bg-trd-primary text-white shadow-flat hover:shadow-flat-hover transition-all font-black text-xs" onClick={validateImages}>ขั้นตอนถัดไป</Button>
            </div>
          </div>
        );

      case STEPS.CONFIRM:
        return (
          <div className="space-y-4">
            <h4 className="font-black text-trd-primary uppercase tracking-wider font-mono text-sm">ขั้นตอนสุดท้าย: ตรวจสอบข้อมูลก่อนยืนยันประกาศ</h4>
            <div className="bg-[#FAFAFA] border-2 border-trd-border p-4 space-y-2 text-xs font-mono rounded-none">
              <p><strong className="text-trd-text-muted font-bold uppercase">เลขที่สัญญาเช่า:</strong> {contractData?.contract_number}</p>
              <p><strong className="text-trd-text-muted font-bold uppercase">ทะเบียนที่ราชพัสดุ:</strong> {contractData?.parcel_number}</p>
              <p><strong className="text-trd-text-muted font-bold uppercase">เนื้อที่ดินครอบครอง:</strong> {contractData?.land_area_sqw} ตารางวา</p>
              <p><strong className="text-trd-text-muted font-bold uppercase">สถานที่ตั้งที่ราชพัสดุ:</strong> {contractData?.sub_district} - {contractData?.district} - {contractData?.province}</p>
              <p><strong className="text-trd-text-muted font-bold uppercase">ราคาเสนอโอนสิทธิ์ที่ระบุ:</strong> ฿{parseFloat(askingPrice).toLocaleString()} บาท</p>
              <p><strong className="text-trd-text-muted font-bold uppercase">จำนวนภาพถ่ายประกอบ:</strong> {imageUrls.filter(u => u.trim() !== "").length} รูป</p>
            </div>

            {/* Transparent Fees Breakdown */}
            <div className="border-2 border-trd-border overflow-hidden text-xs rounded-none">
              <div className="bg-slate-100 px-4 py-2 border-b-2 border-trd-border font-black text-trd-midnight font-mono uppercase tracking-widest flex items-center gap-1.5">
                ตารางคำนวณและสรุปภาระอัตราค่าธรรมเนียมตามระเบียบหลวง
              </div>
              <div className="p-4 space-y-3 bg-white font-mono">
                <div className="space-y-1.5 border-b border-slate-100 pb-2">
                  <div className="flex justify-between font-bold text-trd-midnight">
                    <span>1. ประมาณการตลาดรอง (C2C)</span>
                    <span className="text-trd-primary font-black">฿{(parseFloat(askingPrice) * 0.03 || 0).toLocaleString()}</span>
                  </div>
                  <div className="pl-3 text-[10px] text-trd-text-muted space-y-0.5 font-bold">
                    <div className="flex justify-between">
                      <span>• ค่าธรรมเนียมการโอน (2.0%):</span>
                      <span>฿{(parseFloat(askingPrice) * 0.02 || 0).toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>• อากรแสตมป์ (0.5%):</span>
                      <span>฿{(parseFloat(askingPrice) * 0.005 || 0).toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>• ค่าดำเนินการ (0.5%):</span>
                      <span>฿{(parseFloat(askingPrice) * 0.005 || 0).toLocaleString()}</span>
                    </div>
                  </div>
                </div>

                <div className="flex justify-between font-bold text-trd-midnight">
                  <div>
                    <span>2. ค่าโอนสิทธิ์ราชการ (ระเบียบธนารักษ์)</span>
                    <span className="block text-[9px] text-trd-text-muted font-bold mt-0.5">(6 เท่าของค่าเช่ารายปีปกติ)</span>
                  </div>
                  <div className="text-right">
                    <span className="text-trd-primary font-black">฿{((contractData?.annual_rent || 12000.0) * 6.0).toLocaleString()}</span>
                    <span className="block text-[9px] text-trd-text-muted font-bold mt-0.5">ค่าเช่ารายปี: ฿{(contractData?.annual_rent || 12000.0).toLocaleString()} / ปี</span>
                  </div>
                </div>
              </div>
            </div>

            <p className="text-[9px] font-mono text-trd-text-muted uppercase tracking-wider font-bold">การกดยืนยันหมายถึงคุณยินดีที่จะเผยแพร่ประกาศนี้สู่ตลาดรองอย่างเป็นทางการ</p>
            {error && <p className="text-xs text-val-e font-mono font-bold">[ข้อผิดพลาด] {error}</p>}
            <div className="flex justify-between pt-4">
              <Button variant="outline" size="sm" className="rounded-none border-2 border-trd-border font-black text-xs" onClick={onBack} disabled={loading}>ย้อนกลับ</Button>
              <Button variant="primary" size="sm" className="rounded-none border-2 border-trd-border bg-trd-primary text-white shadow-flat hover:shadow-flat-hover transition-all font-black text-xs" onClick={handleSubmit} isLoading={loading}>ยืนยันและประกาศขาย</Button>
            </div>
          </div>
        );
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={() => {
        if (!loading) {
          setStep(STEPS.VALIDATE);
          onClose();
        }
      }}
      title="ลงประกาศโอนสิทธิการเช่าที่ราชพัสดุ"
      size="md"
    >
      {/* Steps Indicator */}
      <div className="flex justify-between items-center mb-6 border-b-2 border-trd-border pb-4">
        {Object.values(STEPS).filter(v => typeof v === "number").map((stepValue) => (
          <div key={stepValue} className="flex items-center gap-2">
            <div
              className={`
                w-7 h-7 border-2 border-trd-border flex items-center justify-center text-xs font-black rounded-none
                ${step === stepValue ? "bg-trd-primary text-white border-trd-border" : step > (stepValue as number) ? "bg-val-v text-white border-trd-border" : "bg-[#FAFAFA] text-trd-text-muted border-trd-border"}
              `}
            >
              {step > (stepValue as number) ? "✓" : (stepValue as number) + 1}
            </div>
            <span
              className={`
                text-xs hidden sm:inline
                ${step === stepValue ? "text-trd-midnight font-black font-mono" : "text-trd-text-muted font-bold font-mono"}
              `}
            >
              {stepValue === STEPS.VALIDATE ? "ตรวจสอบ" : stepValue === STEPS.DETAILS ? "รายละเอียด" : stepValue === STEPS.IMAGES ? "รูปภาพ" : "ยืนยัน"}
            </span>
          </div>
        ))}
      </div>

      {renderContent()}
    </Modal>
  );
}
