"use client";

import { useState, useEffect } from "react";
import Button from "@/components/ui/Button";
import Card, { CardContent, CardHeader } from "@/components/ui/Card";
import Badge from "@/components/ui/Badge";
import Input from "@/components/ui/Input";

// 1. กำหนดข้อมูลจังหวัดและกลยุทธ์จำเพาะ
interface ProvinceData {
  id: string;
  name: string;
  nameEn: string;
  focus: string;
  appraisalBase: number; // บาทต่อตารางวา
  rentBase: number;      // บาทต่อตารางวาต่อปี
  icon: string;
  color: string;
  description: string;
  developments: {
    id: string;
    name: string;
    profitFactor: number; // ตัวคูณรายได้ธุรกิจต่อพื้นที่
    description: string;
  }[];
}

const provinceConfigs: Record<string, ProvinceData> = {
  nongkhai: {
    id: "nongkhai",
    name: "หนองคาย",
    nameEn: "Nong Khai",
    focus: "เขตพัฒนาเศรษฐกิจพิเศษชายแดน (SEZ) & โลจิสติกส์อาเซียน",
    appraisalBase: 4500,
    rentBase: 90,
    icon: "🌉",
    color: "#D4AF37", // Gold
    description: "พื้นที่ประตูการค้าชายแดนเชื่อมโยงรถไฟความเร็วสูงไทย-ลาว-จีน เหมาะสำหรับธุรกิจนำเข้า-ส่งออก ศูนย์กระจายสินค้า และการท่องเที่ยวริมโขง",
    developments: [
      { id: "logistics", name: "ศูนย์คลังสินค้าชายแดนและคลังสินค้าทัณฑ์บน", profitFactor: 1600, description: "ธุรกิจโกดังสินค้าและกระจายสินค้าสำหรับนำเข้า-ส่งออก" },
      { id: "duty_free", name: "ห้างค้าปลีกปลอดภาษีและศูนย์บริการนักท่องเที่ยว", profitFactor: 2200, description: "ร้านค้าปลอดภาษีและศูนย์บริการจุดจอดรถเดินทางข้ามแดน" },
      { id: "resort", name: "รีสอร์ตเพื่อการท่องเที่ยวเชิงวัฒนธรรมริมโขง", profitFactor: 1800, description: "ที่พักแนวอนุรักษ์ธรรมชาติและทัศนียภาพริมแม่น้ำโขง" },
      { id: "packaging", name: "ศูนย์บรรจุและแปรรูปผลไม้เพื่อการส่งออก", profitFactor: 1400, description: "ลานคัดเกรดผลไม้ บรรจุหีบห่อเพื่อส่งผ่านรถไฟด่วนไปจีน" }
    ]
  },
  kanchanaburi: {
    id: "kanchanaburi",
    name: "กาญจนบุรี",
    nameEn: "Kanchanaburi",
    focus: "เมืองท่องเที่ยวเชิงนิเวศประวัติศาสตร์ & ประตูการค้าตะวันตก",
    appraisalBase: 3800,
    rentBase: 75,
    icon: "🧗",
    color: "#2E7D32", // Green
    description: "พื้นที่เชื่อมโยงชายแดนด่านพุน้ำร้อน โครงการทวาย และป่าอนุรักษ์ระดับโลก เหมาะสำหรับรีสอร์ตเชิงสุขภาพและเกษตรแปรรูป",
    developments: [
      { id: "glamping", name: "แคมป์ปิ้งและรีสอร์ตแนวผจญภัยเชิงนิเวศ", profitFactor: 1900, description: "โฮมสเตย์ระดับพรีเมียมและลานกางเต็นท์หรูริมแม่น้ำแคว" },
      { id: "agri_factory", name: "โรงงานแปรรูปพืชไร่และอุตสาหกรรมชีวภาพ", profitFactor: 1300, description: "แปรรูปอ้อย มันสำปะหลัง หรือสมุนไพรท้องถิ่นส่งออก" },
      { id: "wellness", name: "ศูนย์ฟื้นฟูสุขภาพธรรมชาติบำบัด", profitFactor: 2100, description: "สปาธรรมชาติบำบัดและที่พักสำหรับวัยเกษียณ" },
      { id: "checkpoint_wh", name: "คลังสินค้าด่านพุน้ำร้อนเชื่องโยงท่าเรือน้ำลึก", profitFactor: 1500, description: "พักสินค้าผ่านแดนเพื่อเชื่อมต่อภาคตะวันตกและพม่า" }
    ]
  },
  nongbualamphu: {
    id: "nongbualamphu",
    name: "หนองบัวลำภู",
    nameEn: "Nong Bua Lamphu",
    focus: "นวัตกรรมเกษตรอินทรีย์ชีวภาพ & พลังงานหมุนเวียนชุมชน",
    appraisalBase: 1800,
    rentBase: 35,
    icon: "🌱",
    color: "#8E24AA", // Purple
    description: "จังหวัดนำร่องเกษตรอินทรีย์และเศรษฐกิจสีเขียว (BCG) เหมาะสำหรับการแปรรูปอาหารชุมชน พลังงานสะอาด และวัฒนธรรมผ้าทอพื้นเมือง",
    developments: [
      { id: "solar", name: "โครงการโรงไฟฟ้าพลังงานแสงอาทิตย์ชุมชน", profitFactor: 1100, description: "ติดตั้งแผงโซลาร์เซลล์เพื่อจำหน่ายไฟให้ภาครัฐและอุตสาหกรรมในพื้นที่" },
      { id: "organic_processing", name: "ศูนย์แปรรูปและบรรจุภัณฑ์อาหารอินทรีย์", profitFactor: 1200, description: "โรงอบแห้ง คัดล้าง และกระจายผลผลิตเกษตรอินทรีย์ของชุมชน" },
      { id: "textile_hub", name: "ศูนย์สร้างสรรค์และแสดงสินค้าทอผ้าพื้นเมือง", profitFactor: 1500, description: "ศูนย์ออกแบบ พัฒนา และจำหน่ายผ้าขิดหมี่และผ้าย้อมสีธรรมชาติ" },
      { id: "community_res", name: "โฮมสเตย์ชุมชนเกษตรท่องเที่ยวและวิถีไทย", profitFactor: 1000, description: "บ้านพักเรียนรู้วิถีเกษตรและการทอผ้าพื้นถิ่น" }
    ]
  },
  udonthani: {
    id: "udonthani",
    name: "อุดรธานี",
    nameEn: "Udon Thani",
    focus: "ศูนย์กลาง MICE และเมืองธุรกิจแห่งอีสานตอนบน",
    appraisalBase: 8500,
    rentBase: 170,
    icon: "🏢",
    color: "#0F1A30", // Royal Navy
    description: "จุดศูนย์กลางโลจิสติกส์ทางอากาศ ทางบก และรถไฟรางคู่ มีการเติบโตของเมืองสูง เหมาะสำหรับธุรกิจเชิงพาณิชย์ บริการ ศูนย์ประชุม และการแพทย์ครบวงจร",
    developments: [
      { id: "mice_hotel", name: "โรงแรมจัดประชุมระดับภูมิภาคและบิสิเนสโฮเทล", profitFactor: 2800, description: "ห้องพักและบริการจัดเลี้ยงสัมมนาสำหรับนักธุรกิจไทย-ลาว" },
      { id: "office_space", name: "อาคารสำนักงานอัจฉริยะและโคเวิร์กกิ้งสเปซ", profitFactor: 2400, description: "ออฟฟิศระดับพรีเมียมให้เช่าสำหรับบริษัทสาขาต่างชาติและ Startups" },
      { id: "medical_wellness", name: "คลินิกแพทย์ทางเลือกและศูนย์ดูแลผู้สูงอายุระดับภูมิภาค", profitFactor: 2600, description: "สถาบันการแพทย์และความงามที่เชื่อมต่อลูกค้าในภาคอีสานและประเทศเพื่อนบ้าน" },
      { id: "community_mall", name: "ไลฟ์สไตล์บ็อกซ์คอมมูนิตี้มอลล์และย่านอาหารฮิป", profitFactor: 2500, description: "ศูนย์รวมร้านค้าเช่าและร้านกาแฟชิคๆ ของวัยรุ่นอุดรฯ" }
    ]
  }
};

export default function BenefitsEvaluatorPage() {
  const [selectedProvince, setSelectedProvince] = useState<string>("nongkhai");
  const [landArea, setLandArea] = useState<number>(400); // 1 ไร่
  const [landType, setLandType] = useState<"COMMERCIAL" | "RESIDENTIAL" | "AGRICULTURE" | "INDUSTRIAL">("COMMERCIAL");
  const [selectedDevId, setSelectedDevId] = useState<string>("logistics");
  
  const [userRole, setUserRole] = useState<string | null>(null);

  useEffect(() => {
    const checkRole = () => {
      setUserRole(localStorage.getItem("trd_user_role") || "GUEST");
    };
    checkRole();
    window.addEventListener("trd-role-changed", checkRole);
    window.addEventListener("storage", checkRole);
    return () => {
      window.removeEventListener("trd-role-changed", checkRole);
      window.removeEventListener("storage", checkRole);
    };
  }, []);

  const [askingPrice, setAskingPrice] = useState<number>(1200000);
  const [transferType, setTransferType] = useState<"GENERAL" | "FAMILY">("GENERAL");
  const [customPriceInput, setCustomPriceInput] = useState<string>("1,200,000");

  const province = provinceConfigs[selectedProvince];

  // 2. เมื่อจังหวัดหรือขนาดที่ดินเปลี่ยน ให้คำนวณราคาประเมินกับราคาตั้งโอนสิทธิ์จำลอง
  useEffect(() => {
    const dev = province.developments.find(d => d.id === selectedDevId) || province.developments[0];
    if (dev) {
      setSelectedDevId(dev.id);
    }
  }, [selectedProvince]);

  useEffect(() => {
    // อัตราตัวคูณตามการจัดโซนการใช้งานที่ดิน
    const typeFactor = {
      COMMERCIAL: 1.0,
      RESIDENTIAL: 0.6,
      INDUSTRIAL: 1.2,
      AGRICULTURE: 0.2
    }[landType];

    // คำนวณราคาประเมินและราคาขอโอนสิทธิ์สมเหตุสมผลโดยประมาณ
    const estAppraisal = landArea * province.appraisalBase * typeFactor;
    // ราคาเปลี่ยนมือ (Asking Price) ในสิทธิการเช่า มักมีมูลค่าเฉลี่ยประมาณ 50-70% ของราคาประเมินที่ดินจริง
    const defaultAskingPrice = Math.round(estAppraisal * 0.6);
    setAskingPrice(defaultAskingPrice);
    setCustomPriceInput(defaultAskingPrice.toLocaleString("th-TH"));
  }, [selectedProvince, landArea, landType]);

  const handlePriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawVal = e.target.value.replace(/,/g, "");
    if (!rawVal || isNaN(Number(rawVal))) {
      setCustomPriceInput(e.target.value);
      return;
    }
    const val = parseInt(rawVal, 10);
    setAskingPrice(val);
    setCustomPriceInput(val.toLocaleString("th-TH"));
  };

  // 3. โมเดลการคำนวณทางเศรษฐศาสตร์ (Mathematical Calculations)
  const typeFactor = {
    COMMERCIAL: 1.0,
    RESIDENTIAL: 0.6,
    INDUSTRIAL: 1.2,
    AGRICULTURE: 0.2
  }[landType];

  const currentAppraisal = landArea * province.appraisalBase * typeFactor;
  
  // ค่าเช่าของทางราชการต่อปี (เดิม)
  const annualRent = landArea * province.rentBase * typeFactor;
  
  // ค่าธรรมเนียมสลักหลังการโอนสิทธิ์เข้ารัฐ (6 เท่าสำหรับคนทั่วไป, 1.5 เท่าสำหรับครอบครัว)
  const transferFeeMultiplier = transferType === "GENERAL" ? 6 : 1.5;
  const upfrontTransferFee = annualRent * transferFeeMultiplier;
  
  // อากรแสตมป์ 1% ของมูลค่าเปลี่ยนมือตามสิทธิการเช่า
  const stampDuty = askingPrice * 0.01;
  const upfrontGovRevenue = upfrontTransferFee + stampDuty;

  // ประมาณการรายได้ค่าเช่าใหม่ที่จะเกิดขึ้นของกรมธนารักษ์ (หลังการพัฒนาใหม่ ค่าเช่าจะถูกปรับเกรดขึ้น 35%)
  const newAnnualRent = annualRent * 1.35;
  const govCumulative10Years = (newAnnualRent - annualRent) * 10;

  // ประโยชน์ของฝั่งผู้โอน (ผู้เช่าเดิม)
  const sellerCashReceived = askingPrice;
  const sellerLiabilitiesSaved = annualRent * 10; // ลดภาระจ่ายค่าเช่ารายปีที่ดินทิ้งร้างไป 10 ปีข้างหน้า
  const totalSellerBenefit = sellerCashReceived + sellerLiabilitiesSaved;

  // ประโยชน์ของฝั่งผู้รับโอน (นักลงทุน)
  // ประหยัดต้นทุนจากการ 'เช่าสิทธิ์ที่รัฐ' แทนการ 'ซื้อที่ดินส่วนบุคคล' (ที่ดินส่วนบุคคลจะมีราคาสูงกว่าที่ประเมินรัฐ 1.8 เท่าโดยเฉลี่ย)
  const privateLandPurchaseCost = currentAppraisal * 1.8;
  const buyerAcquisitionSavings = privateLandPurchaseCost - askingPrice;
  
  // ประมาณการรายได้จากการทำธุรกิจต่อปีในอนาคตตามประเภทพัฒนาที่เลือก
  const dev = province.developments.find(d => d.id === selectedDevId) || province.developments[0];
  const estAnnualBusinessRevenue = landArea * (dev?.profitFactor || 1000) * typeFactor;
  const estAnnualNetProfit = estAnnualBusinessRevenue * 0.20; // กำไรสุทธิคิดเฉลี่ยที่ 20% ของรายรับรวม
  const paybackPeriod = estAnnualNetProfit > newAnnualRent 
    ? (askingPrice / (estAnnualNetProfit - newAnnualRent)) 
    : 10.0;

  // ผลประโยชน์ต่อระบบเศรษฐกิจท้องถิ่น (GDP Multiplier Effect: เงินที่สะพัดในจังหวัดจากการก่อสร้างและการจ้างงาน)
  // อัตราทวีคูณทางการคลังระดับท้องถิ่น (Local GDP Multiplier) สำหรับจังหวัดภูมิภาคคิดเป็น 3.2 เท่าของมูลค่าการเปลี่ยนมือและการลงทุนตั้งต้น
  const localEconomicGdpMultiplier = (askingPrice + (landArea * 500)) * 3.2;
  if (userRole === null) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="animate-pulse text-slate-450 font-mono text-xs uppercase tracking-widest font-bold">
          [ Authenticating User ACL... ]
        </div>
      </div>
    );
  }

  if (userRole !== "OFFICER") {
    return (
      <div className="min-h-[75vh] flex items-center justify-center px-4 py-12 bg-trd-surface font-sans">
        <div className="max-w-md w-full bg-[#0F1A30] border-2 border-red-500/40 rounded-2xl p-8 text-center space-y-6 shadow-[0_15px_40px_rgba(239,68,68,0.15)] relative overflow-hidden">
          {/* Cyber top decoration */}
          <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-red-650 to-orange-500"></div>
          
          <div className="w-16 h-16 bg-[#070D1A] border border-red-500/30 text-red-500 rounded-full flex items-center justify-center mx-auto text-3xl shadow-inner animate-pulse">
            🚫
          </div>

          <div className="space-y-2">
            <h2 className="text-base font-black text-white uppercase tracking-wider">
              HTTP 403 Forbidden
            </h2>
            <p className="text-[10px] text-red-400 font-mono tracking-widest font-bold uppercase">
              [ Access Denied: Insufficient Privileges ]
            </p>
          </div>

          <p className="text-xs text-slate-300 leading-relaxed font-medium">
            สิทธิ์การเข้าถึงข้อมูลระบบการจำลองโครงการลงทุนหลวงและการประเมินความคุ้มค่าทางการเงิน (Benefits Evaluator Engine) ถูกจำกัดสิทธิ์ในระดับ Access Control List (ACL) ให้เข้าถึงได้เฉพาะบัญชีประเภทเจ้าหน้าที่ธนารักษ์ที่มีสิทธิ์รักษาความปลอดภัยระดับ 2 ขึ้นไปเท่านั้น
          </p>

          <div className="bg-[#070D1A] rounded-xl border border-[#1E2E4A] p-4 text-[10.5px] text-trd-secondary-dark font-mono text-left space-y-1.5 text-slate-300">
            <span className="font-black">[Dev-Console Tips]</span>
            <p className="text-slate-400 font-sans leading-normal font-medium mt-0.5">
              ระบบตรวจพบบทบาทปัจจุบันของคุณเป็น <strong className="text-white">"{userRole}"</strong> โปรดจำลองสิทธิ์ความมั่นคงปลอดภัยโดยเลือกบทบาทเป็น **"เจ้าหน้าที่ธนารักษ์"** ผ่านแถบเมนูจำลองสิทธิ์ส่วนหัวของแอปพลิเคชันเพื่อปลดล็อกโมดูลคำนวณโครงการ
            </p>
            <div className="text-[9px] text-slate-500 pt-1 border-t border-[#1E2E4A] mt-1 flex justify-between font-mono">
              <span>Error Code: TRD_ERR_ACL_FORBIDDEN</span>
              <span>Ref: 0x7E3A9F</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-trd-bg text-trd-primary min-h-screen py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header Section */}
        <div className="border-b-2 border-trd-border pb-6 mb-8">
          <div className="flex items-center gap-3">
            <span className="text-3xl">📊</span>
            <div>
              <h1 className="text-2xl sm:text-3xl font-black text-trd-primary tracking-tight">
                เครื่องประเมินความคุ้มค่าและผลประโยชน์ในการเปลี่ยนมือสิทธิการเช่า
              </h1>
              <p className="text-xs text-slate-500 font-bold uppercase tracking-widest font-mono mt-1">
                TRD Lease Exchange // Economic Benefit Evaluator
              </p>
            </div>
          </div>
          <p className="text-sm text-slate-600 mt-3 max-w-4xl leading-relaxed">
            ระบบจำลองและคำนวณผลลัพธ์ทางเศรษฐกิจในการเปลี่ยนมือสิทธิเช่าที่ราชพัสดุในพื้นที่นำร่อง 4 จังหวัดหลัก 
            (<strong>หนองคาย, กาญจนบุรี, หนองบัวลำภู และ อุดรธานี</strong>) เพื่อประเมินสิทธิประโยชน์ของทั้ง 
            ผู้โอน (ผู้เช่าเดิม), ผู้รับโอน (นักลงทุน), ภาครัฐ และมูลค่าทางเศรษฐกิจในท้องถิ่นแบบเรียลไทม์
          </p>
        </div>

        {/* main grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* LEFT: Input & Controls (5 Columns) */}
          <div className="lg:col-span-5 space-y-6">
            
            <Card hoverable={false} className="border-2 border-trd-border">
              <CardHeader className="border-b border-trd-border/60 pb-3">
                <h3 className="text-xs font-black uppercase tracking-widest text-trd-secondary-dark font-mono flex items-center gap-2">
                  <span>🛠️</span> ๑. ระบุเงื่อนไขแปลงที่ดินและวัตถุประสงค์
                </h3>
              </CardHeader>
              <CardContent className="space-y-5 pt-5">
                
                {/* 1.1 เลือกจังหวัด */}
                <div className="space-y-2">
                  <label className="block text-xs font-bold text-slate-700">จังหวัดที่ตั้งแปลงที่ราชพัสดุ</label>
                  <div className="grid grid-cols-2 gap-2.5">
                    {Object.values(provinceConfigs).map((prov) => (
                      <button
                        key={prov.id}
                        onClick={() => setSelectedProvince(prov.id)}
                        className={`
                          px-4 py-3 rounded-xl border-2 flex items-center gap-2 transition-all text-xs font-bold text-left
                          ${selectedProvince === prov.id 
                            ? "border-trd-secondary bg-slate-50 shadow-sm" 
                            : "border-slate-200 bg-white hover:border-slate-350"}
                        `}
                      >
                        <span className="text-lg">{prov.icon}</span>
                        <div>
                          <div className="text-trd-primary">{prov.name}</div>
                          <div className="text-[9px] text-slate-400 font-mono uppercase tracking-wide">{prov.nameEn}</div>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* กลยุทธ์รายพื้นที่ */}
                <div className="bg-slate-50 border border-slate-200 p-3.5 rounded-xl text-xs space-y-1">
                  <span className="font-bold text-trd-secondary-dark text-[10px] font-mono uppercase tracking-wider block">
                    ⚡ จุดเน้นและยุทธศาสตร์ของจังหวัด {province.name}
                  </span>
                  <p className="text-slate-600 font-medium leading-relaxed font-sans">{province.description}</p>
                </div>

                {/* 1.2 ขนาดพื้นที่ */}
                <div className="space-y-2">
                  <div className="flex justify-between text-xs font-bold text-slate-700">
                    <label>ขนาดพื้นที่เช่าที่ดิน</label>
                    <span className="font-mono text-trd-secondary-dark font-black">
                      {landArea} ตร.ว. ({Math.floor(landArea / 400)} ไร่ {Math.floor((landArea % 400) / 100)} งาน {(landArea % 100)} ตร.ว.)
                    </span>
                  </div>
                  <input
                    type="range"
                    min="20"
                    max="4000"
                    step="20"
                    value={landArea}
                    onChange={(e) => setLandArea(parseInt(e.target.value, 10))}
                    className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-trd-secondary"
                  />
                  <div className="flex justify-between text-[9px] text-slate-400 font-mono font-bold">
                    <span>20 ตร.ว.</span>
                    <span>2 ไร่ (800 ตร.ว.)</span>
                    <span>10 ไร่ (4,000 ตร.ว.)</span>
                  </div>
                </div>

                {/* 1.3 โซนผังเมือง */}
                <div className="space-y-2">
                  <label className="block text-xs font-bold text-slate-700">การกำหนดประเภทใช้ประโยชน์ (ตามสีผังเมืองปัจจุบัน)</label>
                  <div className="grid grid-cols-2 gap-2 text-xs font-mono">
                    {[
                      { id: "COMMERCIAL", label: "🔴 พาณิชยกรรม", desc: "ห้าง/ออฟฟิศ/ค้าขาย" },
                      { id: "RESIDENTIAL", label: "🟡 ที่อยู่อาศัย", desc: "บ้าน/หอพัก/อพาร์ตเม้นต์" },
                      { id: "INDUSTRIAL", label: "🟣 อุตสาหกรรม", desc: "คลังสินค้า/แปรรูป" },
                      { id: "AGRICULTURE", label: "🟢 เกษตรกรรม", desc: "ปลูกพืช/ฟาร์มชุมชน" }
                    ].map((type) => (
                      <button
                        key={type.id}
                        onClick={() => setLandType(type.id as any)}
                        className={`
                          p-2 rounded-lg border text-left transition-all
                          ${landType === type.id 
                            ? "border-trd-primary bg-[#0F1A30]/5 shadow-sm font-bold" 
                            : "border-slate-200 bg-white hover:bg-slate-50"}
                        `}
                      >
                        <div className="text-trd-primary text-[11px]">{type.label}</div>
                        <div className="text-[8px] text-slate-400 mt-0.5 font-sans font-medium">{type.desc}</div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* 1.4 โครงการธุรกิจที่จะจัดตั้งใหม่ */}
                <div className="space-y-2">
                  <label className="block text-xs font-bold text-slate-700">ประเภทโครงการธุรกิจที่ผู้เช่าใหม่จะนำมาพัฒนาในพื้นที่</label>
                  <select
                    value={selectedDevId}
                    onChange={(e) => setSelectedDevId(e.target.value)}
                    className="w-full px-3 py-2.5 border-2 border-slate-200 bg-white text-trd-primary rounded-xl text-xs font-bold focus:outline-none focus:border-trd-secondary"
                  >
                    {province.developments.map((dev) => (
                      <option key={dev.id} value={dev.id}>
                        {dev.name}
                      </option>
                    ))}
                  </select>
                  <p className="text-[10px] text-slate-500 font-sans font-medium leading-relaxed italic bg-amber-50 border border-amber-250/40 p-2.5 rounded-lg">
                    💡 {province.developments.find(d => d.id === selectedDevId)?.description}
                  </p>
                </div>

                {/* 1.5 ราคาที่ต้องการตกลงโอนสิทธิ์ */}
                <div className="space-y-2">
                  <label className="block text-xs font-bold text-slate-700">มูลค่าสิ่งตอบแทนการเปลี่ยนมือสิทธิ์ที่ต้องการ (บาท)</label>
                  <Input
                    type="text"
                    value={customPriceInput}
                    onChange={handlePriceChange}
                    className="font-mono text-base font-bold text-trd-primary !py-2.5"
                    placeholder="เช่น 1,000,000"
                  />
                  <div className="flex justify-between text-[9px] text-slate-400 font-mono font-bold">
                    <span>ราคาประเมินสิทธิ์ที่ราชพัสดุเชิงมูลค่าจริง:</span>
                    <span className="text-trd-primary">฿{Math.round(currentAppraisal * 0.6).toLocaleString()} บาท</span>
                  </div>
                </div>

                {/* 1.6 ความสัมพันธ์ผู้โอนและผู้รับโอน */}
                <div className="space-y-2">
                  <label className="block text-xs font-bold text-slate-700">ความสัมพันธ์ทางกฎหมายของผู้โอนสิทธิ์</label>
                  <div className="grid grid-cols-2 gap-2 text-xs font-mono">
                    {[
                      { id: "GENERAL", label: "👥 บุคคลทั่วไป", desc: "ค่าโอนสิทธิ์ 6 เท่า" },
                      { id: "FAMILY", label: "👨‍👩‍👧‍👦 โอนในครอบครัว", desc: "ค่าโอนสิทธิ์ 1.5 เท่า" }
                    ].map((type) => (
                      <button
                        key={type.id}
                        onClick={() => setTransferType(type.id as any)}
                        className={`
                          p-2.5 rounded-lg border text-left transition-all
                          ${transferType === type.id 
                            ? "border-trd-secondary bg-amber-50/20 font-bold" 
                            : "border-slate-200 bg-white hover:bg-slate-50"}
                        `}
                      >
                        <div className="text-trd-primary text-[11px]">{type.label}</div>
                        <div className="text-[8px] text-slate-400 mt-0.5 font-sans font-medium">{type.desc}</div>
                      </button>
                    ))}
                  </div>
                </div>

              </CardContent>
            </Card>

          </div>

          {/* RIGHT: Economic Output Dashboard (7 Columns) */}
          <div className="lg:col-span-7 space-y-6">
            
            {/* 1. Summary Card */}
            <div className="bg-[#0F1A30] text-white p-6 rounded-2xl border-2 border-trd-secondary relative overflow-hidden shadow-2xl">
              {/* background decoration */}
              <div className="absolute top-0 right-0 w-32 h-32 bg-[#D4AF37]/5 rounded-full blur-2xl pointer-events-none" />
              
              <div className="flex items-center justify-between mb-4 font-mono">
                <span className="text-[9px] font-black text-trd-secondary uppercase tracking-widest">[ ผลวิเคราะห์ดัชนีคุณค่าทางเศรษฐกิจ ]</span>
                <span className="text-[8px] bg-emerald-500/10 border border-emerald-450/30 text-emerald-400 px-2 py-0.5 font-black uppercase rounded shadow-flat">
                  วิเคราะห์โดยระบบ TRD-LEX
                </span>
              </div>
              
              <h2 className="text-2xl font-black mb-2 text-white">
                มูลค่าหมุนเวียนในพื้นที่จังหวัด {province.name}
              </h2>
              <p className="text-[11px] text-slate-300 font-sans font-medium max-w-xl leading-relaxed">
                การโอนสิทธิเช่าและพัฒนาโครงการธุรกิจ <strong>{dev?.name}</strong> บนที่ดินราชพัสดุแปลงนี้ 
                จะก่อให้เกิดมูลค่าการจ้างงาน การลงทุนก่อสร้าง และการซื้อขายวัตถุดิบสะพัดในท้องถิ่นทันที
              </p>

              <div className="mt-6 flex flex-col sm:flex-row items-baseline gap-2">
                <span className="text-5xl font-black text-trd-secondary font-mono tracking-tight">
                  ฿{localEconomicGdpMultiplier.toLocaleString("th-TH", { maximumFractionDigits: 0 })}
                </span>
                <span className="text-xs font-black text-slate-350 font-mono uppercase">บาท (GDP Multiplier)</span>
              </div>

              <div className="mt-4 pt-4 border-t border-slate-700/50 grid grid-cols-2 gap-4 text-xs font-mono">
                <div>
                  <span className="text-slate-400 block text-[9px] uppercase tracking-wider">ประมาณการระยะเวลาคืนทุนของนักลงทุน</span>
                  <span className="text-sm font-bold text-white mt-0.5 block">
                    {paybackPeriod < 1 ? "น้อยกว่า 1" : paybackPeriod.toFixed(1)} ปี
                  </span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[9px] uppercase tracking-wider">ประมาณการกำไรสุทธิทางธุรกิจ/ปี</span>
                  <span className="text-sm font-bold text-emerald-400 mt-0.5 block">
                    ฿{Math.round(estAnnualNetProfit).toLocaleString()} บาท
                  </span>
                </div>
              </div>
            </div>

            {/* 2. Bento Stakeholder Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              {/* 2.1 Benefits to Seller */}
              <div className="bg-white rounded-2xl border border-slate-200 p-6 flex flex-col justify-between hover:shadow-lg transition-all duration-300">
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs font-black font-mono text-trd-primary uppercase tracking-wider">🙋‍♂️ ๑. ประโยชน์ของฝั่งผู้โอน (ผู้เช่าเดิม)</span>
                    <Badge variant="outline">ผู้เช่าเดิม</Badge>
                  </div>
                  <h4 className="text-lg font-black text-slate-800 font-mono">ดึงเงินทุนที่จมอยู่กลับคืนมา</h4>
                  <p className="text-[11px] text-slate-500 font-sans font-medium mt-1 leading-relaxed">
                    สำหรับผู้เช่าเดิมที่ไม่มีความประสงค์ในการทำประโยชน์หรือขาดสภาพคล่อง จะสามารถรับเงินสดก้อนใหม่แทนการปล่อยที่ดินถูกปรับริบสิทธิ์คืน
                  </p>
                  
                  <div className="mt-5 space-y-2 text-xs font-mono border-t border-slate-100 pt-4">
                    <div className="flex justify-between">
                      <span className="text-slate-500">💰 ทุนสดดึงกลับเข้ากระเป๋า:</span>
                      <span className="font-bold text-slate-800">฿{sellerCashReceived.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">🛡️ ลดหนี้สินค่าเช่าสะสม 10 ปี:</span>
                      <span className="font-bold text-slate-800">฿{sellerLiabilitiesSaved.toLocaleString()}</span>
                    </div>
                  </div>
                </div>
                
                <div className="mt-6 pt-4 border-t border-slate-150 flex justify-between items-baseline font-mono text-xs">
                  <span className="font-black text-trd-primary">รวมผลประโยชน์สุทธิ:</span>
                  <span className="text-lg font-black text-trd-primary">
                    ฿{totalSellerBenefit.toLocaleString()}
                  </span>
                </div>
              </div>

              {/* 2.2 Benefits to Buyer */}
              <div className="bg-white rounded-2xl border border-slate-200 p-6 flex flex-col justify-between hover:shadow-lg transition-all duration-300">
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs font-black font-mono text-trd-primary uppercase tracking-wider">🚀 ๒. ประโยชน์ของฝั่งนักลงทุน (ผู้รับโอน)</span>
                    <Badge variant="gold">นักลงทุนใหม่</Badge>
                  </div>
                  <h4 className="text-lg font-black text-slate-800 font-mono">ประหยัดต้นทุนที่ดินมหาศาล</h4>
                  <p className="text-[11px] text-slate-500 font-sans font-medium mt-1 leading-relaxed">
                    สิทธิการเช่าที่ดินของรัฐมีราคาเริ่มต้นต่ำกว่าการซื้อที่ดินจากเอกชนหลายเท่าตัว ทำให้นักลงทุนเหลืองบประมาณสดไปหมุนเวียนพัฒนาธุรกิจได้เต็มที่
                  </p>
                  
                  <div className="mt-5 space-y-2 text-xs font-mono border-t border-slate-100 pt-4">
                    <div className="flex justify-between">
                      <span className="text-slate-500">💎 ประหยัดทุนเทียบซื้อขาด:</span>
                      <span className="font-bold text-emerald-600">฿{buyerAcquisitionSavings.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">ค่าเช่ากรมธนารักษ์ใหม่/ปี:</span>
                      <span className="font-bold text-slate-800">฿{Math.round(newAnnualRent).toLocaleString()}</span>
                    </div>
                  </div>
                </div>

                <div className="mt-6 pt-4 border-t border-slate-150 flex justify-between items-baseline font-mono text-xs">
                  <span className="font-black text-trd-primary">ความประหยัดเริ่มต้น:</span>
                  <span className="text-lg font-black text-emerald-600">
                    {Math.round((buyerAcquisitionSavings / privateLandPurchaseCost) * 100)}%
                  </span>
                </div>
              </div>

            </div>

            {/* 2.3 Government Revenue Card */}
            <div className="bg-white rounded-2xl border border-slate-200 p-6 hover:shadow-lg transition-all duration-300">
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs font-black font-mono text-trd-primary uppercase tracking-wider">🏦 ๓. ประโยชน์และรายได้จัดเก็บเข้ารัฐ (กรมธนารักษ์)</span>
                <Badge variant="default">รายได้แผ่นดิน</Badge>
              </div>
              <p className="text-xs text-slate-600 font-sans font-medium leading-relaxed mb-4">
                ระบบตลาดรอง TRD-LEX ดึงธุรกรรมการโอนสิทธิ์ที่เคยอยู่นอกระบบ (การตกลงกันเอง ป้องกันการโกง) 
                ให้กลับเข้าสู่ระบบกฎหมาย ช่วยให้กระทรวงการคลังสามารถจัดเก็บค่าธรรมเนียมนำส่งคลังและพัฒนาที่ดินทิ้งร้างได้อย่างโปร่งใส
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-slate-50 p-4 border border-slate-200 rounded-xl font-mono text-xs">
                <div className="space-y-2">
                  <span className="text-slate-500 text-[10px] uppercase block tracking-wider">รายได้แผ่นดินทันที (Upfront Revenue)</span>
                  <div className="text-xl font-black text-trd-secondary-dark">
                    ฿{Math.round(upfrontGovRevenue).toLocaleString()} บาท
                  </div>
                  <div className="text-[9px] text-slate-400 font-sans leading-tight">
                    * ประกอบด้วย ค่าโอนสิทธิ์ ({transferType === "GENERAL" ? "6 เท่า" : "1.5 เท่า"}: ฿{Math.round(upfrontTransferFee).toLocaleString()}) 
                    และ อากรแสตมป์ 1%: ฿{Math.round(stampDuty).toLocaleString()}
                  </div>
                </div>

                <div className="space-y-2">
                  <span className="text-slate-500 text-[10px] uppercase block tracking-wider">ส่วนต่างค่าเช่าสะสม 10 ปี (Future Increment)</span>
                  <div className="text-xl font-black text-trd-primary">
                    + ฿{Math.round(govCumulative10Years).toLocaleString()} บาท
                  </div>
                  <div className="text-[9px] text-slate-400 font-sans leading-tight">
                    * ส่วนต่างการปรับอัตราค่าเช่าขึ้น 35% ตามราคาตลาดเนื่องจากผู้เช่าใหม่นำมาใช้ในเชิงพาณิชย์/พัฒนาเต็มประสิทธิภาพ
                  </div>
                </div>
              </div>
            </div>

            {/* 3. Cost Comparison SVG Chart */}
            <div className="bg-white rounded-2xl border border-slate-200 p-6">
              <h3 className="text-xs font-black uppercase tracking-widest text-trd-secondary-dark font-mono mb-4">
                📈 กราฟเปรียบเทียบค่าใช้จ่าย 10 ปี (ซื้อขาดที่ดินส่วนบุคคล vs เช่าสิทธิที่ราชพัสดุและจดทะเบียน)
              </h3>
              <p className="text-[11px] text-slate-500 font-sans font-medium mb-5 leading-relaxed">
                การเปรียบเทียบต้นทุนจมรวมในการเริ่มต้นทำธุรกิจ ณ จังหวัด {province.name} 
                (ขนาด {landArea} ตร.ว. โซน {landType === "COMMERCIAL" ? "พาณิชยกรรม" : "ปกติ"}) แสดงผลลัพธ์ความประหยัดของระบบรัฐ
              </p>

              {/* Simple Responsive SVG Chart */}
              <div className="w-full bg-slate-50 p-6 rounded-xl border border-slate-200">
                <div className="h-72 w-full flex items-end gap-12 justify-center font-mono text-[10px] pb-2">
                  
                  {/* Option A: Private Land */}
                  <div className="flex flex-col items-center flex-grow max-w-[140px]">
                    <span className="font-bold text-slate-700 mb-3 text-center leading-tight">
                      ฿{Math.round(privateLandPurchaseCost).toLocaleString()}<br/>
                      <span className="text-[8px] text-slate-400 font-normal">(ซื้อที่ดินขาด)</span>
                    </span>
                    <div 
                      className="w-16 bg-slate-300 border-2 border-slate-400/80 rounded-t-lg transition-all duration-500 shadow-sm"
                      style={{ height: "220px" }}
                    />
                    <span className="font-black text-slate-800 text-[9px] mt-2 uppercase tracking-wide text-center leading-tight">ที่ดินเอกชน</span>
                  </div>

                  {/* Option B: State Land Lease via TRD-LEX */}
                  <div className="flex flex-col items-center flex-grow max-w-[140px]">
                    <span className="font-black text-trd-secondary-dark mb-3 text-center leading-tight">
                      ฿{Math.round(askingPrice + (newAnnualRent * 10)).toLocaleString()}<br/>
                      <span className="text-[8px] text-emerald-500 font-black">(ประหยัด {(100 - ((askingPrice + (newAnnualRent * 10)) / privateLandPurchaseCost * 100)).toFixed(0)}%)</span>
                    </span>
                    <div 
                      className="w-16 bg-gold-gradient border-2 border-trd-secondary-dark rounded-t-lg transition-all duration-500 shadow-md"
                      style={{ height: `${Math.max(30, Math.round(((askingPrice + (newAnnualRent * 10)) / privateLandPurchaseCost) * 220))}px` }}
                    />
                    <span className="font-black text-trd-primary text-[9px] mt-2 uppercase tracking-wide text-center leading-tight">สิทธิเช่าราชพัสดุ</span>
                  </div>

                </div>
                <div className="mt-4 pt-3 border-t border-slate-200 text-[9px] text-slate-400 text-center font-sans font-medium">
                  * ค่าใช้จ่ายที่ดินราชพัสดุรวม = ค่าตอบแทนการเปลี่ยนมือ (฿{askingPrice.toLocaleString()}) + ค่าเช่ารายปีสะสม 10 ปี (฿{Math.round(newAnnualRent * 10).toLocaleString()})
                </div>
              </div>
            </div>

            {/* 4. Actions Footer */}
            <div className="flex flex-col sm:flex-row gap-4 justify-end font-mono text-xs uppercase tracking-widest pt-4">
              <Button 
                variant="outline" 
                className="font-black border border-slate-200 text-trd-primary bg-white rounded-xl hover:bg-slate-50"
                onClick={() => window.print()}
              >
                🖨️ พิมพ์เอกสารสิทธิ์ประเมิน
              </Button>
              <Button 
                variant="primary" 
                className="font-black border border-transparent bg-gold-gradient text-[#0F1A30] rounded-xl shadow-neon-gold hover:opacity-90"
                onClick={() => window.location.href = "/listings?province=" + province.name}
              >
                🔍 ค้นหาแปลงในพื้นที่จังหวัด {province.name}
              </Button>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
}
