"use client";

import { useState } from "react";
import Modal from "@/components/ui/Modal";
import Badge from "@/components/ui/Badge";
import Button from "@/components/ui/Button";

interface TransferGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function TransferGuideModal({ isOpen, onClose }: TransferGuideModalProps) {
  const [activeTab, setActiveTab] = useState<"steps" | "fees" | "documents" | "warning">("steps");

  const tabs = [
    { id: "steps", label: "📋 ขั้นตอนการโอน" },
    { id: "fees", label: "💰 อัตราค่าธรรมเนียม" },
    { id: "documents", label: "📄 เอกสารที่ต้องใช้" },
    { id: "warning", label: "⚠️ ข้อควรระวังสำคัญ" },
  ] as const;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="คู่มือการโอนสิทธิการเช่าที่ราชพัสดุ (กรมธนารักษ์)"
      size="lg"
    >
      <div className="bg-val-e/10 border-2 border-trd-border border-l-8 border-l-val-e p-4 mb-5 rounded-none text-xs text-trd-midnight leading-relaxed font-mono">
        <strong>[คำชี้แจงส่วนราชการ]</strong> แพลตฟอร์ม TRD-LEX เป็นเพียงเครื่องมืออำนวยความสะดวกในการค้นหาและเจรจาเท่านั้น 
        <span className="font-bold text-trd-primary"> การทำธุรกรรมเปลี่ยนสิทธิ์ตามกฎหมายจะมีผลสมบูรณ์ก็ต่อเมื่อทั้งสองฝ่ายไปยื่นเรื่องและจดทะเบียนร่วมกัน ณ สำนักงานธนารักษ์พื้นที่เท่านั้น!</span>
      </div>

      {/* Tabs Header */}
      <div className="flex border-b-2 border-trd-border mb-5 overflow-x-auto scrollbar-none font-mono">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`
              px-4 py-2.5 text-xs font-black whitespace-nowrap border-b-2 transition-all duration-150
              ${activeTab === tab.id 
                ? "border-trd-primary text-trd-primary bg-slate-50" 
                : "border-transparent text-trd-text-muted hover:text-trd-midnight"}
            `}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab Contents */}
      <div className="text-xs text-trd-midnight space-y-4 max-h-[380px] overflow-y-auto pr-1">
        
        {/* TAB 1: STEPS */}
        {activeTab === "steps" && (
          <div className="space-y-4">
            <h4 className="text-xs font-black text-trd-primary border-b-2 border-trd-border pb-1.5 flex items-center gap-1.5 font-mono uppercase tracking-widest">
              ขั้นตอนระเบียบปฏิบัติในการเปลี่ยนมือสิทธิการเช่าที่ราชพัสดุ
            </h4>
            <div className="relative border-l-2 border-trd-border ml-3.5 pl-6 space-y-5">
              {/* Step 1 */}
              <div className="relative">
                <span className="absolute -left-9 top-0 w-6 h-6 border-2 border-trd-border bg-white text-trd-midnight font-black flex items-center justify-center text-xs rounded-none">
                  1
                </span>
                <h5 className="font-black text-trd-midnight text-xs font-mono">ขั้นตอนที่ ๑: การเจรจาตกลงเงื่อนไขการโอนสิทธิ์ระหว่างบุคคล</h5>
                <p className="text-[11px] text-trd-text-muted mt-1 font-sans font-medium">
                  ผู้เช่าเดิมและผู้รับโอนทำการติดต่อพูดคุยเพื่อตกลงเงื่อนไขและค่าตอบแทนการโอนสิทธิเช่าด้วยตนเองนอกระบบ (สามารถกดปุ่ม "แสดงความสนใจ" ในหน้าประกาศเพื่อโทรติดต่อ)
                </p>
              </div>

              {/* Step 2 */}
              <div className="relative">
                <span className="absolute -left-9 top-0 w-6 h-6 border-2 border-trd-border bg-white text-trd-midnight font-black flex items-center justify-center text-xs rounded-none">
                  2
                </span>
                <h5 className="font-black text-trd-midnight text-xs font-mono">ขั้นตอนที่ ๒: การจัดเตรียมคำร้องและยื่นขออนุญาต ณ สำนักงานธนารักษ์</h5>
                <p className="text-[11px] text-trd-text-muted mt-1 font-sans font-medium">
                  ทั้งสองฝ่ายร่วมกันเดินทางไปยื่นคำร้อง ณ <span className="font-bold text-trd-midnight">สำนักงานธนารักษ์พื้นที่</span> ที่แปลงที่ดินนั้นตั้งอยู่ (เช่น สำนักงานธนารักษ์พื้นที่อุดรธานี, ขอนแก่น, หรือหนองคาย) หรือกองบริหารที่ราชพัสดุกรุงเทพมหานคร
                </p>
              </div>

              {/* Step 3 */}
              <div className="relative">
                <span className="absolute -left-9 top-0 w-6 h-6 border-2 border-trd-border bg-white text-trd-midnight font-black flex items-center justify-center text-xs rounded-none">
                  3
                </span>
                <h5 className="font-black text-trd-midnight text-xs font-mono">ขั้นตอนที่ ๓: เจ้าหน้าที่ทำการรังวัดและตรวจสอบสภาพใช้ประโยชน์จริง</h5>
                <p className="text-[11px] text-trd-text-muted mt-1 font-sans font-medium">
                  เจ้าหน้าที่ธนารักษ์จะทำการตรวจสอบคุณสมบัติของผู้รับโอนสิทธิ์ รวมถึงลงพื้นที่รังวัดและตรวจสอบสภาพการใช้ประโยชน์ที่ดินจริง เพื่อนำมาประเมินค่าเช่าและคำนวณอัตราค่าธรรมเนียมตามกฎระเบียบ
                </p>
              </div>

              {/* Step 4 */}
              <div className="relative">
                <span className="absolute -left-9 top-0 w-6 h-6 border-2 border-trd-border bg-white text-trd-midnight font-black flex items-center justify-center text-xs rounded-none">
                  4
                </span>
                <h5 className="font-black text-trd-midnight text-xs font-mono">ขั้นตอนที่ ๔: การชำระเงินค่าธรรมเนียมการโอนและค่าจดทะเบียนตามระเบียบ</h5>
                <p className="text-[11px] text-trd-text-muted mt-1 font-sans font-medium">
                  ชำระค่าธรรมเนียมการโอนสิทธิเช่า ค่าจดทะเบียน และค่าดำเนินการอื่น ๆ ตามกฎหมาย ณ ช่องบริการของสำนักงานธนารักษ์พื้นที่ <span className="font-bold text-val-e">(ระบบออนไลน์ไม่มีการเก็บค่าธรรมเนียมหรือรับชำระเงินใด ๆ ทั้งสิ้น)</span>
                </p>
              </div>

              {/* Step 5 */}
              <div className="relative">
                <span className="absolute -left-9 top-0 w-6 h-6 border-2 border-trd-border bg-white text-trd-midnight font-black flex items-center justify-center text-xs rounded-none">
                  5
                </span>
                <h5 className="font-black text-trd-midnight text-xs font-mono">ขั้นตอนที่ ๕: การลงนามสลักหลังสัญญาหรือทำสัญญาเช่าฉบับใหม่</h5>
                <p className="text-[11px] text-trd-text-muted mt-1 font-sans font-medium">
                  เมื่อขั้นตอนได้รับการอนุมัติและชำระค่าธรรมเนียมเรียบร้อยแล้ว ทั้งสองฝ่ายจะเซ็นชื่อสลักหลังสัญญาหรือทำสัญญาเช่าฉบับใหม่กับกรมธนารักษ์ เพื่อเปลี่ยนตัวผู้เช่าอย่างเป็นทางการ
                </p>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: FEES */}
        {activeTab === "fees" && (
          <div className="space-y-4">
            <h4 className="text-xs font-black text-trd-primary border-b-2 border-trd-border pb-1.5 flex items-center gap-1.5 font-mono uppercase tracking-widest">
              คำสั่งกรมธนารักษ์ว่าด้วยอัตราค่าธรรมเนียมการโอน
            </h4>
            <p className="text-[11px] text-trd-text-muted font-sans font-medium leading-relaxed">
              การคำนวณค่าธรรมเนียมการโอนสิทธิเช่าจะคิดบนฐานของ <strong className="text-trd-midnight">"ค่าเช่ารายปีที่ปรับปรุงแล้ว"</strong> ตามสภาพทำเลและประเภทการใช้ประโยชน์ ณ ปัจจุบัน ดังนี้:
            </p>
            <div className="border-2 border-trd-border rounded-none overflow-hidden shadow-flat">
              <table className="w-full text-left border-collapse text-[11px] font-mono">
                <thead className="bg-slate-50 text-trd-midnight font-black border-b-2 border-trd-border">
                  <tr>
                    <th className="px-4 py-3">กรณีการโอนสิทธิ์</th>
                    <th className="px-4 py-3">อัตราค่าธรรมเนียมหลวง</th>
                    <th className="px-4 py-3">คำอธิบาย/เงื่อนไข</th>
                  </tr>
                </thead>
                <tbody className="divide-y-2 divide-trd-border text-trd-midnight">
                  <tr>
                    <td className="px-4 py-3 font-bold">1. บุคคลทั่วไป (ทั่วไป)</td>
                    <td className="px-4 py-3 text-trd-primary font-black">6 เท่าของค่าเช่า 1 ปี</td>
                    <td className="px-4 py-3 text-trd-text-muted font-bold font-sans">อัตราปกติสำหรับการเปลี่ยนมือสิทธิเช่าเชิงพาณิชย์/อยู่อาศัยทั่วไป</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-3 font-bold">2. โอนให้ครอบครัว (ขณะยังมีชีวิต)</td>
                    <td className="px-4 py-3 text-trd-primary font-black">1.5 เท่าของค่าเช่า 1 ปี</td>
                    <td className="px-4 py-3 text-trd-text-muted font-bold font-sans">ลดเหลือ <span className="text-val-v font-black">25% ของอัตราปกติ</span> สำหรับบุพการี, ผู้สืบสันดานโดยตรง หรือคู่สมรส</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-3 font-bold">3. โอนให้ทายาทโดยธรรม (ผู้เช่าเดิมเสียชีวิต)</td>
                    <td className="px-4 py-3 text-val-v font-black">ยกเว้นค่าธรรมเนียม</td>
                    <td className="px-4 py-3 text-trd-text-muted font-bold font-sans">
                      ต้องยื่นเรื่อง <span className="font-bold text-trd-midnight">ภายใน 1 ปี</span> (กรณีเช่าที่ดิน) หรือ <span className="font-bold text-trd-midnight">ภายใน 3 เดือน</span> (กรณีเช่าอาคาร) นับแต่วันที่เสียชีวิต
                    </td>
                  </tr>
                  <tr>
                    <td className="px-4 py-3 font-bold">4. โอนให้ทายาท (เกินกำหนดเวลา)</td>
                    <td className="px-4 py-3 text-val-e font-black">2 เท่าของค่าเช่า 1 ปี</td>
                    <td className="px-4 py-3 text-trd-text-muted font-bold font-sans">หากยื่นเรื่องหลังพ้นกำหนดเวลา 1 ปี (ที่ดิน) หรือ 3 เดือน (อาคาร)</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-3 font-bold">5. โอนระหว่างผู้เช่าร่วม</td>
                    <td className="px-4 py-3 text-trd-midnight">คิดตามส่วนของสิทธิ์</td>
                    <td className="px-4 py-3 text-trd-text-muted font-bold font-sans">คิดค่าธรรมเนียมโอนเฉพาะสัดส่วนที่ทำการเปลี่ยนมือสิทธิ์จริง</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <div className="bg-[#FAFAFA] border-2 border-trd-border rounded-none p-3.5 text-[10px] text-trd-midnight font-mono flex items-start gap-2">
              <span>[ข้อแนะนำทางทะเบียน]</span>
              <p className="font-sans font-medium">
                <strong>คำแนะนำการประเมินเบื้องต้น:</strong> คุณสามารถใช้เครื่องมือ <strong>"คำนวณค่าธรรมเนียมสิทธิ์การเช่า (Estimator)"</strong> ในหน้าประกาศของแต่ละแปลงเพื่อประเมินค่าโอนสุทธิได้ทันที
              </p>
            </div>
          </div>
        )}

        {/* TAB 3: DOCUMENTS */}
        {activeTab === "documents" && (
          <div className="space-y-4">
            <h4 className="text-xs font-black text-trd-primary border-b-2 border-trd-border pb-1.5 flex items-center gap-1.5 font-mono uppercase tracking-widest">
              รายการเอกสารและหลักฐานประกอบการยื่นคำร้องขอโอนสิทธิ์
            </h4>
            <p className="text-[11px] text-trd-text-muted font-sans font-medium">กรุณาจัดเตรียมเอกสารเหล่านี้อย่างละ 1 ชุด เพื่อนำไปแสดงสิทธิ์และยื่นคำร้อง ณ สำนักงานธนารักษ์พื้นที่:</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Transferor */}
              <div className="bg-[#FAFAFA] p-4 border-2 border-trd-border rounded-none space-y-2">
                <h5 className="font-black text-trd-midnight border-b-2 border-trd-border pb-1 text-xs font-mono uppercase tracking-wider">เอกสารของผู้ขอโอนสิทธิการเช่า (ผู้เช่าเดิม)</h5>
                <ul className="space-y-1.5 text-[11px] text-trd-text-muted font-sans font-medium">
                  <li className="flex items-start gap-2">
                    <input type="checkbox" readOnly checked className="mt-0.5 rounded text-trd-primary accent-trd-primary" />
                    <span>สัญญาเช่าที่ราชพัสดุฉบับจริง (คู่ฉบับของผู้เช่า)</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <input type="checkbox" readOnly checked className="mt-0.5 rounded text-trd-primary accent-trd-primary" />
                    <span>ใบเสร็จรับเงินค่าเช่าปีล่าสุด</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <input type="checkbox" readOnly checked className="mt-0.5 rounded text-trd-primary accent-trd-primary" />
                    <span>สำเนาบัตรประชาชน และสำเนาทะเบียนบ้าน</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <input type="checkbox" readOnly checked className="mt-0.5 rounded text-trd-primary accent-trd-primary" />
                    <span>หลักฐานยืนยันความสัมพันธ์ครอบครัว (ถ้ามี เพื่อขอรับส่วนลด)</span>
                  </li>
                </ul>
              </div>

              {/* Transferee */}
              <div className="bg-[#FAFAFA] p-4 border-2 border-trd-border rounded-none space-y-2">
                <h5 className="font-black text-trd-midnight border-b-2 border-trd-border pb-1 text-xs font-mono uppercase tracking-wider">เอกสารของผู้ขอรับโอนสิทธิการเช่า (ผู้เช่ารายใหม่)</h5>
                <ul className="space-y-1.5 text-[11px] text-trd-text-muted font-sans font-medium">
                  <li className="flex items-start gap-2">
                    <input type="checkbox" readOnly checked className="mt-0.5 rounded text-trd-primary accent-trd-primary" />
                    <span>สำเนาบัตรประชาชน และสำเนาทะเบียนบ้าน</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <input type="checkbox" readOnly checked className="mt-0.5 rounded text-trd-primary accent-trd-primary" />
                    <span>หนังสือแสดงความจำนงขอเช่าที่ดินราชพัสดุ (กรอกที่สำนักงาน)</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <input type="checkbox" readOnly checked className="mt-0.5 rounded text-trd-primary accent-trd-primary" />
                    <span>แผนที่สังเขปแสดงขอบเขตที่ต้องการใช้งาน</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <input type="checkbox" readOnly checked className="mt-0.5 rounded text-trd-primary accent-trd-primary" />
                    <span>แผนดำเนินงานพัฒนาธุรกิจ/วัตถุประสงค์การใช้ประโยชน์</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        )}

        {/* TAB 4: WARNING */}
        {activeTab === "warning" && (
          <div className="space-y-4">
            <h4 className="text-xs font-black text-val-e border-b-2 border-trd-border pb-1.5 flex items-center gap-1.5 font-mono uppercase tracking-widest">
              บทบัญญัติและข้อจำกัดทางกฎหมายที่พึงระวัง
            </h4>
            <div className="space-y-3 font-sans">
              <div className="bg-val-e/10 border-2 border-trd-border border-l-8 border-l-val-e p-4 text-trd-midnight rounded-none space-y-1.5">
                <h5 className="font-black text-val-e text-xs font-mono">บทบัญญัติที่ ๑: ธุรกรรมต้องทำต่อหน้าเจ้าหน้าที่ธนารักษ์เท่านั้น</h5>
                <p className="text-[11px] text-trd-midnight leading-relaxed font-medium">
                  ห้ามโอนเงินค่าสิทธิเช่าหรือค่าธรรมเนียมให้แก่บุคคลภายนอก หรือทำสัญญากันเองโดยพลการโดยคิดว่าจะเสร็จสิ้นกระบวนการโอน สัญญาจะเปลี่ยนสิทธิ์สมบูรณ์ก็ต่อเมื่อเจ้าหน้าที่ลงนามจดทะเบียนในสัญญาเช่าฉบับใหม่ ณ สำนักงานธนารักษ์เท่านั้น
                </p>
              </div>

              <div className="bg-val-l/10 border-2 border-trd-border border-l-8 border-l-val-l p-4 text-trd-midnight rounded-none space-y-1.5">
                <h5 className="font-black text-amber-800 text-xs font-mono">บทบัญญัติที่ ๒: การตรวจสอบหนี้ค้างชำระ</h5>
                <p className="text-[11px] text-trd-midnight leading-relaxed font-medium">
                  ก่อนทำการโอนสิทธิ์ ผู้รับโอนต้องตรวจสอบกับสำนักงานธนารักษ์พื้นที่ว่าสัญญาเช่าแปลงนี้ไม่มีการค้างชำระค่าเช่าหรือค่าธรรมเนียมรายปี หากมีหนี้ค้างชำระ ผู้โอนเดิมต้องดำเนินการชำระหนี้ค้างชำระทั้งหมดให้เสร็จสิ้นก่อนจึงจะทำการอนุมัติโอนสิทธิ์ได้
                </p>
              </div>

              <div className="bg-slate-50 border-2 border-trd-border border-l-8 border-l-trd-border p-4 text-trd-midnight rounded-none space-y-1.5">
                <h5 className="font-black text-trd-midnight text-xs font-mono">บทบัญญัติที่ ๓: การเปลี่ยนแปลงวัตถุประสงค์การใช้ประโยชน์</h5>
                <p className="text-[11px] text-trd-text-muted leading-relaxed font-medium">
                  หากผู้รับโอนต้องการเปลี่ยนวัตถุประสงค์การใช้ประโยชน์ (เช่น เปลี่ยนจากอยู่อาศัยเป็นร้านค้า/พาณิชย์) อัตราค่าเช่ารายปีและค่าธรรมเนียมอาจถูกปรับปรุงใหม่ให้เหมาะสมกับวัตถุประสงค์ใหม่ตามระเบียบของกรมธนารักษ์
                </p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="flex justify-end pt-5 border-t-2 border-trd-border mt-5">
        <Button 
          variant="primary" 
          size="sm" 
          onClick={onClose}
          className="rounded-none border-2 border-trd-border font-black text-xs shadow-flat hover:shadow-flat-hover bg-trd-primary text-white font-mono uppercase tracking-wider px-4 py-2"
        >
          รับทราบและปิดการแสดงผล
        </Button>
      </div>
    </Modal>
  );
}
