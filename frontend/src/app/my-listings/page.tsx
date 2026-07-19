"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import api from "@/lib/api";
import type { Listing, LeaseContract } from "@/types";

// ──────────────────────────────────────────────
// Mock Fallbacks & Configuration
// ──────────────────────────────────────────────
const MY_SELLER_ID = "my-seller";

const mockContracts: LeaseContract[] = [
  {
    id: "contract-1",
    contract_number: "TRD-66-001",
    parcel_number: "1024/65",
    location_lat: 13.7712,
    location_lng: 100.5401,
    province: "กรุงเทพมหานคร",
    district: "พญาไท",
    sub_district: "สามเสนใน",
    land_area_sqw: 120,
    is_active: true,
    building_type: "อาคารพาณิชย์",
    usable_area_sqm: 250,
    zoning: "พื้นที่สีแดง (พาณิชยกรรม)",
    annual_rent: 72000,
  },
  {
    id: "contract-3",
    contract_number: "TRD-66-003",
    parcel_number: "220/8",
    location_lat: 18.7883,
    location_lng: 98.9853,
    province: "เชียงใหม่",
    district: "เมืองเชียงใหม่",
    sub_district: "ศรีภูมิ",
    land_area_sqw: 150,
    is_active: true,
    building_type: "อาคารพาณิชย์",
    usable_area_sqm: 350,
    zoning: "พื้นที่สีแดง (พาณิชยกรรม)",
    annual_rent: 90000,
  },
  {
    id: "contract-5",
    contract_number: "TRD-66-005",
    parcel_number: "412/10",
    location_lat: 17.8785,
    location_lng: 102.7423,
    province: "หนองคาย",
    district: "เมืองหนองคาย",
    sub_district: "ในเมือง",
    land_area_sqw: 200,
    is_active: true,
    building_type: "ที่ดินเปล่า",
    usable_area_sqm: 0,
    zoning: "พื้นที่สีเขียว (เกษตรกรรม)",
    annual_rent: 24000,
  }
];

const initialMyListings: Listing[] = [
  {
    id: "list-1",
    sellerId: MY_SELLER_ID,
    seller: { id: MY_SELLER_ID, thaid_id: "TH-001", first_name: "สมชาย", last_name: "ใจดี", role: "USER" },
    contractId: "contract-1",
    contract: mockContracts[0],
    asking_price: 1500000,
    estimated_fee: 45000,
    description: "สิทธิ์การเช่าที่ดินเพื่อการพาณิชย์ ทำเลทองพญาไท ใกล้รถไฟฟ้า เหมาะทำร้านกาแฟหรือโชว์รูมสินค้าขนาดเล็ก",
    image_urls: ["/images/images (7).jpg"],
    status: "ACTIVE",
    createdAt: "2026-07-09T00:00:00Z",
    updatedAt: "2026-07-09T00:00:00Z",
  },
];

const PRESET_IMAGES = [
  { url: "/images/images (19).jpg", label: "ที่ดินเปล่า / ธรรมชาติ" },
  { url: "/images/images (7).jpg", label: "อาคารพาณิชย์ / ตึกเมือง" },
  { url: "/images/images (1).jpg", label: "บ้านพักอาศัย / ทรัพย์สินอยู่อาศัย" },
  { url: "/images/images (13).jpg", label: "โรงงาน / คลังสินค้าอุตสาหกรรม" }
];

const STATUS_CONFIG = {
  ACTIVE: {
    label: "กำลังเปิดรับ (Active)",
    color: "text-emerald-400",
    bg: "bg-emerald-500/10 border-emerald-500/30",
    dot: "bg-emerald-400",
  },
  IN_NEGOTIATION: {
    label: "รอการเจรจา (In-Negotiation)",
    color: "text-amber-400",
    bg: "bg-amber-500/10 border-amber-500/30",
    dot: "bg-amber-400",
  },
  SOLD: {
    label: "โอนแล้ว (Closed/Sold)",
    color: "text-slate-400",
    bg: "bg-slate-500/10 border-slate-500/30",
    dot: "bg-slate-400",
  },
  HIDDEN: {
    label: "ปิดการแสดงผล (Hidden)",
    color: "text-red-400",
    bg: "bg-red-500/10 border-red-500/30",
    dot: "bg-red-400",
  },
};

interface Lead {
  id: string;
  listingId: string;
  buyerName: string;
  buyerThaidId: string;
  phone: string;
  message: string;
  offerPrice: number;
  createdAt: string;
  status: "PENDING" | "ACCEPTED" | "DECLINED";
}

const formatBaht = (n: number) =>
  n.toLocaleString("th-TH", { style: "currency", currency: "THB", maximumFractionDigits: 0 });

function formatDateThai(iso: string) {
  return new Date(iso).toLocaleDateString("th-TH", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

function formatDateShort(iso: string) {
  return new Date(iso).toLocaleDateString("th-TH", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

// ──────────────────────────────────────────────
// Component: ConfirmDialog
// ──────────────────────────────────────────────
function ConfirmDialog({
  title,
  message,
  confirmLabel,
  onConfirm,
  onCancel,
  danger = false,
}: {
  title: string;
  message: string;
  confirmLabel: string;
  onConfirm: () => void;
  onCancel: () => void;
  danger?: boolean;
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4" style={{ background: "rgba(7,13,26,0.85)" }}>
      <div className="max-w-sm w-full bg-[#0F1A30] border border-[#1E2E4A] rounded-2xl p-6 space-y-4 shadow-2xl">
        <h3 className={`text-sm font-black uppercase tracking-wider ${danger ? "text-red-400" : "text-trd-secondary"}`}>{title}</h3>
        <p className="text-xs text-slate-350 leading-relaxed font-medium">{message}</p>
        <div className="flex gap-2 pt-2">
          <button
            onClick={onCancel}
            className="flex-1 py-2 px-4 rounded-xl border border-[#1E2E4A] text-xs font-bold text-slate-400 hover:text-white transition-all cursor-pointer"
          >
            ยกเลิก
          </button>
          <button
            onClick={onConfirm}
            className={`flex-1 py-2 px-4 rounded-xl text-xs font-black uppercase tracking-wider transition-all cursor-pointer ${
              danger
                ? "bg-red-600 text-white hover:bg-red-500"
                : "bg-trd-secondary text-[#0F1A30] hover:opacity-90"
            }`}
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}

// ──────────────────────────────────────────────
// Component: AvailableContractsModal
// ──────────────────────────────────────────────
function AvailableContractsModal({
  contracts,
  listings,
  onClose,
  onSelectContract,
}: {
  contracts: LeaseContract[];
  listings: Listing[];
  onClose: () => void;
  onSelectContract: (contract: LeaseContract) => void;
}) {
  // Filter contracts that don't have an active or in-negotiation listing
  const availableContracts = contracts.filter((contract) => {
    const listing = listings.find((l) => l.contractId === contract.id);
    return !listing || listing.status === "SOLD";
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4 overflow-y-auto py-10" style={{ background: "rgba(7,13,26,0.85)" }}>
      <div className="max-w-xl w-full bg-[#0F1A30] border border-[#1E2E4A] rounded-2xl p-6 space-y-5 shadow-2xl relative">
        <div className="absolute top-0 left-0 right-0 h-1 bg-gold-gradient rounded-t-2xl"></div>
        <div className="flex justify-between items-start">
          <div>
            <h3 className="text-base font-black text-white uppercase tracking-wider">เลือกสัญญาเช่าเพื่อลงประกาศขาย</h3>
            <p className="text-[10px] text-trd-secondary font-mono tracking-widest uppercase mt-0.5">Select Lease Contract to Sell</p>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-white text-lg font-bold cursor-pointer">✕</button>
        </div>

        {availableContracts.length === 0 ? (
          <div className="bg-[#070D1A] rounded-xl border border-[#1E2E4A] p-8 text-center space-y-2">
            <span className="text-3xl block">📋</span>
            <p className="text-xs text-slate-450 font-medium">ไม่พบสัญญาเช่าที่พร้อมลงประกาศใหม่</p>
            <p className="text-[10px] text-slate-500">สัญญาเช่าทั้งหมดของคุณได้ถูกลงประกาศในตลาดเรียบร้อยแล้ว</p>
          </div>
        ) : (
          <div className="space-y-3 max-h-96 overflow-y-auto pr-1">
            {availableContracts.map((c) => (
              <div key={c.id} className="bg-[#070D1A] rounded-xl border border-[#1E2E4A] hover:border-trd-secondary/45 p-4 flex flex-col sm:flex-row justify-between sm:items-center gap-4 transition-all">
                <div className="space-y-1">
                  <div className="text-xs font-black text-white font-mono">{c.contract_number}</div>
                  <div className="text-[10.5px] text-slate-400">
                    เลขที่ราชพัสดุ: <span className="font-mono text-slate-300">{c.parcel_number}</span> · {c.sub_district}, {c.district}, {c.province}
                  </div>
                  <div className="text-[10px] text-trd-secondary font-mono">
                    ขนาด: {c.land_area_sqw} ตร.ว. ({c.building_type || "ที่ดินเปล่า"})
                  </div>
                </div>
                <button
                  onClick={() => onSelectContract(c)}
                  className="px-4 py-2 bg-trd-secondary hover:opacity-90 text-[#0F1A30] text-xs font-black uppercase tracking-wider rounded-xl transition-all cursor-pointer text-center"
                >
                  เลือกสัญญานี้
                </button>
              </div>
            ))}
          </div>
        )}

        <div className="flex justify-end pt-2">
          <button
            onClick={onClose}
            className="py-2 px-5 rounded-xl border border-[#1E2E4A] text-xs font-bold text-slate-400 hover:text-white transition-all cursor-pointer"
          >
            ปิดหน้าต่าง
          </button>
        </div>
      </div>
    </div>
  );
}

// ──────────────────────────────────────────────
// Component: CreateListingModal
// ──────────────────────────────────────────────
function CreateListingModal({
  contract,
  onClose,
  onSubmit,
}: {
  contract: LeaseContract;
  onClose: () => void;
  onSubmit: (data: { asking_price: number; description: string; image_url: string }) => Promise<void>;
}) {
  const [askingPrice, setAskingPrice] = useState("");
  const [description, setDescription] = useState("");
  const [selectedImg, setSelectedImg] = useState(PRESET_IMAGES[0].url);
  const [uploadedImgName, setUploadedImgName] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      setError("ขนาดไฟล์ภาพถ่ายต้องไม่เกิน 5MB");
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const base64Url = event.target?.result as string;
      setSelectedImg(base64Url);
      setUploadedImgName(file.name);
    };
    reader.readAsDataURL(file);
  };

  const handlePriceChange = (val: string) => {
    const numeric = val.replace(/\D/g, "");
    if (!numeric) {
      setAskingPrice("");
      return;
    }
    setAskingPrice(parseInt(numeric, 10).toLocaleString("th-TH"));
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    const priceNum = parseFloat(askingPrice.replace(/,/g, ""));
    if (isNaN(priceNum) || priceNum <= 0) {
      setError("กรุณากรอกราคาเสนอโอนสิทธิ์ที่ถูกต้อง");
      return;
    }

    setSubmitting(true);
    try {
      await onSubmit({
        asking_price: priceNum,
        description,
        image_url: selectedImg,
      });
      onClose();
    } catch (err: any) {
      setError(err.message || "เกิดข้อผิดพลาดในการลงประกาศ");
    } finally {
      setSubmitting(false);
    }
  };

  const annualRent = contract.annual_rent || 0;
  const estimatedGovFee = Math.ceil((annualRent * 6) / 10) * 10;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4 overflow-y-auto py-10" style={{ background: "rgba(7,13,26,0.85)" }}>
      <div className="max-w-lg w-full bg-[#0F1A30] border-2 border-trd-secondary/30 rounded-2xl p-6 space-y-5 shadow-2xl relative">
        <div className="absolute top-0 left-0 right-0 h-1 bg-gold-gradient"></div>

        <div className="flex justify-between items-start">
          <div>
            <h3 className="text-base font-black text-white uppercase tracking-wider">ลงประกาศเสนอขายสิทธิ์</h3>
            <p className="text-[11px] text-trd-secondary font-mono tracking-widest uppercase mt-0.5">Publish Lease Contract Transfer Listing</p>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-white text-lg font-bold cursor-pointer">✕</button>
        </div>

        {error && (
          <div className="bg-red-500/10 border border-red-500/30 text-red-400 rounded-xl p-3 text-xs flex items-center gap-2">
            <span>⚠️</span> {error}
          </div>
        )}

        {/* Contract summary card */}
        <div className="bg-[#070D1A] rounded-xl border border-[#1E2E4A] p-4.5 space-y-3 font-mono text-xs">
          <span className="text-trd-secondary-dark font-black text-[10px] uppercase tracking-wider block">[ ข้อมูลสัญญาอ้างอิงจากกรมธนารักษ์ ]</span>
          <div className="grid grid-cols-2 gap-3.5 text-slate-300">
            <div>
              <span className="text-slate-500 block">เลขที่สัญญาเช่า:</span>
              <span className="text-white font-bold">{contract.contract_number}</span>
            </div>
            <div>
              <span className="text-slate-500 block">เลขที่ราชพัสดุ:</span>
              <span className="text-white font-bold">{contract.parcel_number}</span>
            </div>
            <div>
              <span className="text-slate-500 block">ตำแหน่งที่ตั้ง:</span>
              <span className="text-slate-200">{contract.sub_district}, {contract.district}, {contract.province}</span>
            </div>
            <div>
              <span className="text-slate-500 block">ขนาดพื้นที่ / ประเภท:</span>
              <span className="text-slate-200">{contract.land_area_sqw} ตร.ว. ({contract.building_type || "ที่ดินเปล่า"})</span>
            </div>
          </div>
          <div className="border-t border-[#1E2E4A] pt-2 flex justify-between items-baseline text-xs">
            <span className="text-slate-400 font-sans font-bold">ค่าเช่าของหลวงรายปี:</span>
            <span className="text-trd-secondary font-black font-mono">{formatBaht(annualRent)} / ปี</span>
          </div>
        </div>

        <form onSubmit={handleFormSubmit} className="space-y-4.5">
          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-slate-300">ราคาเสนอโอนสิทธิ์ (บาท) <span className="text-red-400">*</span></label>
            <input
              type="text"
              required
              value={askingPrice}
              onChange={(e) => handlePriceChange(e.target.value)}
              className="w-full bg-[#070D1A] border border-[#1E2E4A] rounded-xl px-4 py-2 text-sm text-white font-bold font-mono focus:outline-none focus:border-trd-secondary"
              placeholder="เช่น 1,500,000"
            />
            <p className="text-[11px] text-slate-400 leading-relaxed font-medium">
              💡 <strong>ราคาเสนอโอนสิทธิ์:</strong> คือมูลค่าชดเชยค่าเปลี่ยนมือที่ตกลงภายนอกกับผู้รับโอน โดยผู้รับโอนจะต้องชำระค่าธรรมเนียมโอนหลวงต่างหากประมาณ <strong>{formatBaht(estimatedGovFee)}</strong> (คำนวณตามระเบียบ ๖ เท่าของค่าเช่ารายปี)
            </p>
          </div>

          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-slate-300">คำอธิบาย / รายละเอียดเพิ่มเติมประกาศ</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              className="w-full bg-[#070D1A] border border-[#1E2E4A] rounded-xl px-4 py-2.5 text-xs text-slate-300 focus:outline-none focus:border-trd-secondary resize-none font-sans"
              placeholder="เช่น ใกล้ตลาดและสถานศึกษา, คูหามุมริมถนน, เหมาะค้าขาย..."
            />
          </div>

          <div className="space-y-3">
            <label className="block text-xs font-bold text-slate-300">รูปภาพแสดงหน้าประกาศ (เลือกรูปต้นแบบ หรือ อัปโหลดรูปภาพใหม่)</label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {PRESET_IMAGES.map((img) => (
                <button
                  key={img.url}
                  type="button"
                  onClick={() => {
                    setSelectedImg(img.url);
                    setUploadedImgName("");
                  }}
                  className={`relative h-18 rounded-lg overflow-hidden border-2 transition-all cursor-pointer text-left ${
                    selectedImg === img.url && !uploadedImgName ? "border-trd-secondary ring-1 ring-trd-secondary/40" : "border-[#1E2E4A] hover:border-slate-500"
                  }`}
                >
                  <img src={img.url} alt={img.label} className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-black/45 hover:bg-black/20 transition-all flex items-end p-1">
                    <span className="text-[10px] text-white font-bold leading-tight font-sans line-clamp-1">{img.label}</span>
                  </div>
                </button>
              ))}
            </div>

            <div className="border-2 border-dashed border-[#1E2E4A] hover:border-trd-secondary/60 rounded-xl p-4.5 text-center cursor-pointer relative bg-[#070D1A] transition-all">
              <input type="file" accept="image/*" onChange={handleFileChange} className="absolute inset-0 opacity-0 cursor-pointer w-full h-full" />
              {uploadedImgName ? (
                <div className="space-y-1">
                  <span className="text-xs text-emerald-400 font-mono font-black block">✓ อัปโหลดสำเร็จ: {uploadedImgName}</span>
                  <span className="text-[10px] text-slate-500 block">(คลิกหรือลากไฟล์ใหม่เพื่อเปลี่ยนรูปภาพ)</span>
                </div>
              ) : (
                <div className="space-y-1">
                  <span className="text-2xl">📸</span>
                  <span className="text-xs text-slate-350 font-bold block">คลิก หรือ ลากไฟล์รูปอสังหาริมทรัพย์ของคุณมาวางที่นี่</span>
                  <span className="text-[10px] text-slate-500 block">รองรับไฟล์ภาพ JPEG, PNG (ไม่เกิน 5MB)</span>
                </div>
              )}
            </div>
          </div>

          <div className="flex gap-2.5 pt-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2.5 rounded-xl border border-[#1E2E4A] text-xs font-bold text-slate-400 hover:border-slate-550 hover:text-white transition-all cursor-pointer"
            >
              ยกเลิก
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="flex-1 py-2.5 rounded-xl bg-trd-secondary text-[#0F1A30] text-xs font-black uppercase tracking-widest hover:opacity-90 transition-all cursor-pointer disabled:opacity-50"
            >
              {submitting ? "กำลังลงประกาศ..." : "📢 ยืนยันการลงประกาศ"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// ──────────────────────────────────────────────
// Component: EditListingModal
// ──────────────────────────────────────────────
function EditListingModal({
  listing,
  onClose,
  onUpdate,
}: {
  listing: Listing;
  onClose: () => void;
  onUpdate: (id: string, data: { asking_price: number; description: string; image_urls?: string[] }) => Promise<void>;
}) {
  const [askingPrice, setAskingPrice] = useState(listing.asking_price.toString());
  const [description, setDescription] = useState(listing.description || "");
  const [selectedImg, setSelectedImg] = useState(listing.image_urls[0] || PRESET_IMAGES[0].url);
  const [uploadedImgName, setUploadedImgName] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    setAskingPrice(listing.asking_price.toLocaleString("th-TH"));
    setDescription(listing.description || "");
    setSelectedImg(listing.image_urls[0] || PRESET_IMAGES[0].url);
  }, [listing]);

  const handlePriceChange = (val: string) => {
    const numeric = val.replace(/\D/g, "");
    if (!numeric) {
      setAskingPrice("");
      return;
    }
    setAskingPrice(parseInt(numeric, 10).toLocaleString("th-TH"));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      setError("ขนาดไฟล์ภาพต้องไม่เกิน 5MB");
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const base64Url = event.target?.result as string;
      setSelectedImg(base64Url);
      setUploadedImgName(file.name);
    };
    reader.readAsDataURL(file);
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    const priceNum = parseFloat(askingPrice.replace(/,/g, ""));
    if (isNaN(priceNum) || priceNum <= 0) {
      setError("กรุณากรอกราคาเสนอโอนสิทธิ์ที่ถูกต้อง");
      return;
    }

    setSubmitting(true);
    try {
      const data: { asking_price: number; description: string; image_urls?: string[] } = {
        asking_price: priceNum,
        description,
        image_urls: [selectedImg],
      };
      await onUpdate(listing.id, data);
      onClose();
    } catch (err: any) {
      setError(err.message || "เกิดข้อผิดพลาดในการแก้ไขประกาศ");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4 overflow-y-auto py-10" style={{ background: "rgba(7,13,26,0.85)" }}>
      <div className="max-w-lg w-full bg-[#0F1A30] border-2 border-trd-secondary/30 rounded-2xl p-6 space-y-5 shadow-2xl relative">
        <div className="absolute top-0 left-0 right-0 h-1 bg-gold-gradient"></div>

        <div className="flex justify-between items-start">
          <div>
            <h3 className="text-base font-black text-white uppercase tracking-wider">แก้ไขประกาศเสนอขายสิทธิ์</h3>
            <p className="text-[11px] text-trd-secondary font-mono tracking-widest uppercase mt-0.5">Edit Lease Transfer Listing</p>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-white text-lg font-bold cursor-pointer">✕</button>
        </div>

        {error && (
          <div className="bg-red-500/10 border border-red-500/30 text-red-400 rounded-xl p-3 text-xs flex items-center gap-2">
            <span>⚠️</span> {error}
          </div>
        )}

        <form onSubmit={handleFormSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-slate-300">ราคาเสนอโอนสิทธิ์ (บาท) <span className="text-red-400">*</span></label>
            <input
              type="text"
              required
              value={askingPrice}
              onChange={(e) => handlePriceChange(e.target.value)}
              className="w-full bg-[#070D1A] border border-[#1E2E4A] rounded-xl px-4 py-2 text-sm text-white font-bold font-mono focus:outline-none focus:border-trd-secondary"
            />
          </div>

          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-slate-300">คำอธิบาย / รายละเอียดเพิ่มเติมประกาศ</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={4}
              className="w-full bg-[#070D1A] border border-[#1E2E4A] rounded-xl px-4 py-2.5 text-xs text-slate-350 focus:outline-none focus:border-trd-secondary resize-none"
            />
          </div>

          <div className="space-y-3">
            <label className="block text-xs font-bold text-slate-300">เปลี่ยนรูปภาพแสดงประกาศ</label>
            <div className="grid grid-cols-4 gap-2">
              {PRESET_IMAGES.map((img) => (
                <button
                  key={img.url}
                  type="button"
                  onClick={() => {
                    setSelectedImg(img.url);
                    setUploadedImgName("");
                  }}
                  className={`relative h-14 rounded-lg overflow-hidden border-2 transition-all cursor-pointer ${
                    selectedImg === img.url && !uploadedImgName ? "border-trd-secondary" : "border-[#1E2E4A]"
                  }`}
                >
                  <img src={img.url} className="w-full h-full object-cover" />
                </button>
              ))}
            </div>

            <div className="border border-dashed border-[#1E2E4A] hover:border-trd-secondary/60 rounded-xl p-3 text-center cursor-pointer relative bg-[#070D1A] transition-all">
              <input type="file" accept="image/*" onChange={handleFileChange} className="absolute inset-0 opacity-0 cursor-pointer w-full h-full" />
              {uploadedImgName ? (
                <span className="text-[11px] text-emerald-400 font-mono block">✓ ไฟล์ที่อัปเดต: {uploadedImgName}</span>
              ) : (
                <span className="text-[11px] text-slate-400 block">📸 อัปโหลดรูปภาพใหม่เพื่อมาเปลี่ยนแทนรูปภาพเดิม</span>
              )}
            </div>
          </div>

          <div className="flex gap-2.5 pt-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2.5 rounded-xl border border-[#1E2E4A] text-xs font-bold text-slate-400 hover:border-slate-550 transition-all cursor-pointer"
            >
              ยกเลิก
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="flex-1 py-2.5 rounded-xl bg-trd-secondary text-[#0F1A30] text-xs font-black uppercase tracking-wider hover:opacity-90 transition-all cursor-pointer"
            >
              {submitting ? "กำลังบันทึก..." : "✓ บันทึกการแก้ไข"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// ──────────────────────────────────────────────
// Component: ViewLeadsModal
// ──────────────────────────────────────────────
function ViewLeadsModal({
  listing,
  leads,
  onClose,
  onAcceptLead,
}: {
  listing: Listing;
  leads: Lead[];
  onClose: () => void;
  onAcceptLead: (leadId: string) => void;
}) {
  const listingLeads = leads.filter((l) => l.listingId === listing.id);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4 overflow-y-auto py-10" style={{ background: "rgba(7,13,26,0.85)" }}>
      <div className="max-w-2xl w-full bg-[#0F1A30] border border-[#1E2E4A] rounded-2xl p-6 space-y-5 shadow-2xl relative">
        <div className="absolute top-0 left-0 right-0 h-1 bg-gold-gradient rounded-t-2xl"></div>

        <div className="flex justify-between items-start">
          <div>
            <h3 className="text-base font-black text-white uppercase tracking-wider">ผู้สนใจและข้อความสอบถามสิทธิ์การเช่า</h3>
            <p className="text-[10px] text-trd-secondary font-mono tracking-widest uppercase mt-0.5">
              Leads & Inquiries for Contract: {listing.contract?.contract_number}
            </p>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-white text-lg font-bold cursor-pointer">✕</button>
        </div>

        {listingLeads.length === 0 ? (
          <div className="bg-[#070D1A] rounded-xl border border-[#1E2E4A] p-10 text-center space-y-2">
            <span className="text-3xl block">💬</span>
            <p className="text-xs text-slate-450 font-bold">ยังไม่มีผู้แสดงความสนใจประกาศนี้</p>
            <p className="text-[10px] text-slate-500">ระบบจะคอยจับคู่และนำส่งรายชื่อผู้ประสงค์ขอเจรจาเปลี่ยนสิทธิ์มาแสดงไว้ที่นี่โดยอัตโนมัติ</p>
          </div>
        ) : (
          <div className="space-y-4 max-h-96 overflow-y-auto pr-1">
            {listingLeads.map((lead) => (
              <div
                key={lead.id}
                className={`bg-[#070D1A] rounded-xl border p-4.5 space-y-3 transition-all ${
                  lead.status === "ACCEPTED"
                    ? "border-emerald-500/40 bg-emerald-500/5"
                    : "border-[#1E2E4A] hover:border-slate-600"
                }`}
              >
                <div className="flex justify-between items-start gap-4">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-black text-white">{lead.buyerName}</span>
                      <span className="px-2 py-0.5 bg-emerald-500/10 border border-emerald-500/30 text-emerald-450 text-[9px] font-bold rounded">
                        ✓ ยืนยันตัวตน (ThaID)
                      </span>
                    </div>
                    <div className="text-[10px] text-slate-500 mt-0.5">
                      เบอร์ติดต่อ: <span className="font-mono text-slate-300 font-bold">{lead.phone}</span> · วันที่: {formatDateShort(lead.createdAt)}
                    </div>
                  </div>

                  <div className="text-right">
                    <span className="text-[9px] text-slate-500 block uppercase font-mono tracking-widest">ราคาเสนอซื้อ</span>
                    <span className="text-sm font-black text-trd-secondary font-mono">{formatBaht(lead.offerPrice)}</span>
                  </div>
                </div>

                <div className="bg-[#0F1A30]/85 p-3 rounded-lg border border-[#1E2E4A]/80 text-xs text-slate-300 font-sans leading-relaxed">
                  <span className="text-[10px] text-trd-secondary-dark font-black font-mono block uppercase mb-1">ข้อความจากผู้สนใจ:</span>
                  "{lead.message}"
                </div>

                <div className="flex justify-between items-center pt-2">
                  <div className="text-[10.5px]">
                    สถานะการโอน:{" "}
                    {lead.status === "ACCEPTED" ? (
                      <span className="text-emerald-400 font-bold">ยอมรับข้อเสนอแล้ว - อยู่ระหว่างเตรียมเอกสาร</span>
                    ) : (
                      <span className="text-amber-400 font-medium">รอการตอบรับข้อเสนอ</span>
                    )}
                  </div>

                  {lead.status === "PENDING" && (
                    <div className="flex gap-2">
                      <button
                        onClick={() => onAcceptLead(lead.id)}
                        className="py-1.5 px-3 bg-emerald-600 hover:bg-emerald-500 text-white text-[10px] font-black uppercase tracking-wider rounded-lg transition-all cursor-pointer"
                      >
                        🤝 ตอบรับการเจรจา
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="flex justify-end pt-2">
          <button
            onClick={onClose}
            className="py-2 px-5 rounded-xl border border-[#1E2E4A] text-xs font-bold text-slate-400 hover:text-white transition-all cursor-pointer"
          >
            ปิดหน้าต่าง
          </button>
        </div>
      </div>
    </div>
  );
}

// ──────────────────────────────────────────────
// Component: AutoPDFModal
// ──────────────────────────────────────────────
function AutoPDFModal({
  listing,
  leads,
  onClose,
}: {
  listing: Listing;
  leads: Lead[];
  onClose: () => void;
}) {
  // Find if there is an accepted lead for buyer details
  const acceptedLead = leads.find((l) => l.listingId === listing.id && l.status === "ACCEPTED");
  
  // Format Thai Buddhist Era Year
  const today = new Date();
  const thaiDay = today.getDate();
  const thaiMonthName = today.toLocaleDateString("th-TH", { month: "long" });
  const thaiYear = today.getFullYear() + 543;

  const annualRent = listing.contract?.annual_rent || 0;
  const transferFee = Math.ceil((annualRent * 6) / 10) * 10;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4 overflow-y-auto py-10" style={{ background: "rgba(7,13,26,0.85)" }}>
      {/* Container holding both UI Preview and Printable-only component */}
      <div className="max-w-3xl w-full bg-[#0F1A30] border border-[#1E2E4A] rounded-2xl p-6.5 space-y-6 shadow-2xl relative print:hidden">
        <div className="absolute top-0 left-0 right-0 h-1 bg-gold-gradient rounded-t-2xl"></div>

        <div className="flex justify-between items-start">
          <div>
            <h3 className="text-base font-black text-white uppercase tracking-wider">จัดเตรียมคำขอโอนสิทธิ์สำเร็จ (ท.บ. ๙)</h3>
            <p className="text-[10px] text-trd-secondary font-mono tracking-widest uppercase mt-0.5">O2O PDF Document Auto-Generation</p>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-white text-lg font-bold cursor-pointer">✕</button>
        </div>

        <div className="bg-amber-500/10 border border-amber-500/30 text-amber-300 rounded-xl p-3.5 text-xs space-y-1">
          <p className="font-bold">📝 ระบบสืบค้นข้อมูลสัญญาเช่าจากระบบทะเบียนกรมธนารักษ์ และกรอกเอกสาร ท.บ. ๙ อัตโนมัติ:</p>
          <p className="text-slate-400 font-sans leading-normal font-medium">
            ข้อมูลผู้โอนสิทธิ์ ข้อมูลสัญญาเช่าราชพัสดุ และชื่อผู้รับโอน (กรณีที่ยอมรับข้อเสนอการเจรจา) ถูกกรอกลงบนแบบฟอร์มคำขอแล้ว คุณสามารถสั่งพิมพ์เอกสารนำไปประกอบการยื่นขอโอนสิทธิ์จริง ณ สำนักงานธนารักษ์พื้นที่
          </p>
        </div>

        {/* Preview Container: stylized as a white page sheet */}
        <div className="border border-slate-700 bg-white rounded-lg p-8 max-h-[50vh] overflow-y-auto text-black font-sans leading-relaxed text-xs shadow-inner">
          <div className="flex flex-col items-center text-center space-y-2 mb-4">
            {/* Garuda Emblem SVG */}
            <svg viewBox="0 0 512 512" className="w-14 h-14 fill-current text-black" xmlns="http://www.w3.org/2000/svg">
              <path d="M256,0 C256,0 230,60 210,90 C190,120 120,130 90,140 C110,160 130,220 130,220 C130,220 100,210 70,200 C80,240 100,280 120,300 C90,320 60,320 40,320 C60,340 100,360 140,350 C130,380 110,420 80,440 C110,440 150,420 170,390 C175,410 180,440 180,470 C190,460 210,430 220,400 C230,420 240,450 256,512 C272,450 282,420 292,400 C302,430 322,460 332,470 C332,440 337,410 342,390 C362,420 402,440 432,440 C402,420 382,380 372,350 C412,360 452,340 472,320 C452,320 422,320 392,300 C412,280 432,240 442,200 C412,210 382,220 382,220 C382,220 402,160 422,140 C392,130 322,120 302,90 C282,60 256,0 256,0 Z" />
            </svg>
            <div className="font-bold text-sm">แบบ ท.บ. ๙</div>
            <div className="font-bold text-sm -mt-1">คำขอโอนสิทธิการเช่าที่ดินราชพัสดุ</div>
          </div>

          <div className="text-right space-y-1 mb-4">
            <div>เขียนที่ สำนักงานธนารักษ์พื้นที่ {listing.contract?.province || "........"}</div>
            <div>วันที่ {thaiDay} เดือน {thaiMonthName} พ.ศ. {thaiYear}</div>
          </div>

          <div className="space-y-3 font-medium">
            <p>
              เรื่อง ขอโอนสิทธิการเช่าที่ราชพัสดุแปลงหมายเลขทะเบียน <span className="font-bold underline font-mono">{listing.contract?.parcel_number}</span>
            </p>
            <p>
              เรียน อธิบดีกรมธนารักษ์ / ธนารักษ์พื้นที่ {listing.contract?.province}
            </p>
            <p className="indent-8">
              ด้วย ข้าพเจ้า <span className="font-bold underline">{listing.seller.first_name} {listing.seller.last_name}</span> บัตรประจำตัวประชาชนเลขที่ <span className="underline font-mono">{listing.seller.thaid_id || "......................"}</span> อยู่บ้านเลขที่ ๑๒/๓ ถนนราชดำเนิน อำเภอเมือง จังหวัดอุบลราชธานี ปัจจุบันเป็นผู้เช่าที่ดินราชพัสดุ แปลงหมายเลขทะเบียน <span className="font-bold underline font-mono">{listing.contract?.parcel_number}</span> สัญญาเช่าเลขที่ <span className="font-bold underline font-mono">{listing.contract?.contract_number}</span> ลงวันที่ ๑๐ พฤษภาคม ๒๕๖๖ มีขนาดเนื้อที่ <span className="underline font-mono">{listing.contract?.land_area_sqw}</span> ตารางวา ตั้งอยู่ ณ ตำบล {listing.contract?.sub_district} อำเภอ {listing.contract?.district} จังหวัด {listing.contract?.province} อัตราค่าเช่าของหลวงรายปี <span className="underline">{formatBaht(annualRent)}</span>
            </p>
            <p className="indent-8">
              มีความประสงค์ขออนุมัติโอนสิทธิการเช่าที่ดินราชพัสดุดังกล่าวทั้งหมด/บางส่วน ให้แก่{" "}
              {acceptedLead ? (
                <span className="font-bold underline">{acceptedLead.buyerName}</span>
              ) : (
                <span className="text-slate-450 font-bold">........................................................................... (ผู้รับโอนสิทธิ์)</span>
              )}{" "}
              อายุ {acceptedLead ? "๓๘" : "........"} ปี สัญชาติ ไทย ถือบัตรประจำตัวประชาชนเลขที่{" "}
              {acceptedLead ? (
                <span className="underline font-mono">{acceptedLead.buyerThaidId}</span>
              ) : (
                <span className="text-slate-400 font-mono">................................................</span>
              )}{" "}
              เพื่อใช้ประโยชน์สำหรับ {listing.contract?.building_type || "ที่อยู่อาศัย / พาณิชยกรรม"} โดยผู้รับโอนตกลงจะยินดีรับภาระชำระค่าธรรมเนียมการโอนสิทธิ์ตามระเบียบกระทรวงการคลัง เป็นมูลค่าโอนสิทธิ์หลวงประมาณ <span className="underline">{formatBaht(transferFee)}</span>
            </p>
            <p className="indent-8">
              ข้าพเจ้าขอรับรองว่าการโอนสิทธิในครั้งนี้เป็นไปตามความสมัครใจของทั้งสองฝ่ายและไม่มีคดีความใดๆ ผูกพันกับสิทธิการเช่าของที่ดินแปลงดังกล่าว
            </p>

            <div className="grid grid-cols-2 gap-8 pt-8 text-center">
              <div className="space-y-4">
                <div>(ลงชื่อ)........................................................ ผู้ขอโอนสิทธิ์</div>
                <div className="text-slate-500 font-normal">({listing.seller.first_name} {listing.seller.last_name})</div>
              </div>
              <div className="space-y-4">
                <div>(ลงชื่อ)........................................................ ผู้รับโอนสิทธิ์</div>
                <div className="text-slate-500 font-normal">({acceptedLead ? acceptedLead.buyerName : "................................................"})</div>
              </div>
            </div>
          </div>
        </div>

        <div className="flex gap-3 justify-end">
          <button
            onClick={onClose}
            className="py-2.5 px-5 rounded-xl border border-[#1E2E4A] text-xs font-bold text-slate-400 hover:text-white transition-all cursor-pointer font-mono"
          >
            ยกเลิก
          </button>
          <button
            onClick={handlePrint}
            className="py-2.5 px-6 rounded-xl bg-trd-secondary text-[#0F1A30] text-xs font-black uppercase tracking-wider hover:opacity-90 transition-all cursor-pointer font-mono flex items-center gap-2 shadow-neon-gold"
          >
            🖨️ สั่งพิมพ์ใบคำขอ ท.บ. ๙
          </button>
        </div>
      </div>

      {/* Printable Sheet View - Only rendered & visible to browser print layout */}
      <div id="print-area" className="hidden print:block absolute inset-0 bg-white text-black p-16 font-sans leading-relaxed text-sm">
        <div className="flex flex-col items-center text-center space-y-3 mb-6">
          <svg viewBox="0 0 512 512" className="w-18 h-18 fill-current text-black" xmlns="http://www.w3.org/2000/svg">
            <path d="M256,0 C256,0 230,60 210,90 C190,120 120,130 90,140 C110,160 130,220 130,220 C130,220 100,210 70,200 C80,240 100,280 120,300 C90,320 60,320 40,320 C60,340 100,360 140,350 C130,380 110,420 80,440 C110,440 150,420 170,390 C175,410 180,440 180,470 C190,460 210,430 220,400 C230,420 240,450 256,512 C272,450 282,420 292,400 C302,430 322,460 332,470 C332,440 337,410 342,390 C362,420 402,440 432,440 C402,420 382,380 372,350 C412,360 452,340 472,320 C452,320 422,320 392,300 C412,280 432,240 442,200 C412,210 382,220 382,220 C382,220 402,160 422,140 C392,130 322,120 302,90 C282,60 256,0 256,0 Z" />
          </svg>
          <div className="font-bold text-lg">แบบ ท.บ. ๙</div>
          <div className="font-bold text-base -mt-1">คำขอโอนสิทธิการเช่าที่ดินราชพัสดุ</div>
        </div>

        <div className="text-right space-y-1 mb-6 text-sm">
          <div>เขียนที่ สำนักงานธนารักษ์พื้นที่ {listing.contract?.province || "........"}</div>
          <div>วันที่ {thaiDay} เดือน {thaiMonthName} พ.ศ. {thaiYear}</div>
        </div>

        <div className="space-y-4 font-medium text-sm leading-8">
          <p>
            เรื่อง ขอโอนสิทธิการเช่าที่ดินราชพัสดุแปลงหมายเลขทะเบียน <span className="font-bold underline">{listing.contract?.parcel_number}</span>
          </p>
          <p>
            เรียน อธิบดีกรมธนารักษ์ / ธนารักษ์พื้นที่ {listing.contract?.province}
          </p>
          <p className="indent-12 text-justify">
            ด้วย ข้าพเจ้า <span className="font-bold underline">{listing.seller.first_name} {listing.seller.last_name}</span> บัตรประจำตัวประชาชนเลขที่ <span className="underline font-mono">{listing.seller.thaid_id || "......................"}</span> อยู่บ้านเลขที่ ๑๒/๓ ถนนราชดำเนิน อำเภอเมือง จังหวัดอุบลราชธานี ปัจจุบันเป็นผู้เช่าที่ดินราชพัสดุ แปลงหมายเลขทะเบียน <span className="font-bold underline font-mono">{listing.contract?.parcel_number}</span> สัญญาเช่าเลขที่ <span className="font-bold underline font-mono">{listing.contract?.contract_number}</span> ลงวันที่ ๑๐ พฤษภาคม ๒๕๖๖ มีขนาดเนื้อที่ <span className="underline font-mono">{listing.contract?.land_area_sqw}</span> ตารางวา ตั้งอยู่ ณ ตำบล {listing.contract?.sub_district} อำเภอ {listing.contract?.district} จังหวัด {listing.contract?.province} อัตราค่าเช่าของหลวงรายปี <span className="underline">{formatBaht(annualRent)}</span>
          </p>
          <p className="indent-12 text-justify">
            มีความประสงค์ขออนุมัติโอนสิทธิการเช่าที่ดินราชพัสดุดังกล่าวทั้งหมด/บางส่วน ให้แก่{" "}
            {acceptedLead ? (
              <span className="font-bold underline">{acceptedLead.buyerName}</span>
            ) : (
              <span>........................................................................... (ผู้รับโอนสิทธิ์)</span>
            )}{" "}
            อายุ {acceptedLead ? "๓๘" : "........"} ปี สัญชาติ ไทย ถือบัตรประจำตัวประชาชนเลขที่{" "}
            {acceptedLead ? (
              <span className="underline font-mono">{acceptedLead.buyerThaidId}</span>
            ) : (
              <span>................................................</span>
            )}{" "}
            เพื่อใช้ประโยชน์สำหรับ {listing.contract?.building_type || "ที่อยู่อาศัย / พาณิชยกรรม"} โดยผู้รับโอนตกลงจะยินดีรับภาระชำระค่าธรรมเนียมการโอนสิทธิ์ตามระเบียบกระทรวงการคลัง เป็นมูลค่าโอนสิทธิ์หลวงประมาณ <span className="underline">{formatBaht(transferFee)}</span>
          </p>
          <p className="indent-12 text-justify">
            ข้าพเจ้าขอรับรองว่าการโอนสิทธิในครั้งนี้เป็นไปตามความสมัครใจของทั้งสองฝ่ายและไม่มีคดีความใดๆ ผูกพันกับสิทธิการเช่าของที่ดินแปลงดังกล่าว
          </p>

          <div className="grid grid-cols-2 gap-8 pt-16 text-center text-sm">
            <div className="space-y-6">
              <div>(ลงชื่อ)........................................................ ผู้ขอโอนสิทธิ์</div>
              <div>({listing.seller.first_name} {listing.seller.last_name})</div>
            </div>
            <div className="space-y-6">
              <div>(ลงชื่อ)........................................................ ผู้รับโอนสิทธิ์</div>
              <div>({acceptedLead ? acceptedLead.buyerName : "................................................"})</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ──────────────────────────────────────────────
// Main Dashboard Component
// ──────────────────────────────────────────────
export default function MyListingsPage() {
  const [userRole, setUserRole] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<"LISTINGS" | "CONTRACTS">("LISTINGS");
  const [listings, setListings] = useState<Listing[]>([]);
  const [contracts, setContracts] = useState<LeaseContract[]>([]);
  const [loadingData, setLoadingData] = useState(false);
  const [statusFilter, setStatusFilter] = useState<"ALL" | "ACTIVE" | "IN_NEGOTIATION" | "CLOSED_SOLD">("ALL");
  const [searchTerm, setSearchTerm] = useState("");
  const [toast, setToast] = useState<string | null>(null);

  // Leads state
  const [leads, setLeads] = useState<Lead[]>([
    {
      id: "lead-1",
      listingId: "list-1",
      buyerName: "คุณ นงนุช รักเกษตร",
      buyerThaidId: "3120199048123",
      phone: "081-234-5678",
      message: "สนใจที่ดินแปลงนี้มากค่ะ อยากรบกวนถามข้อมูลเรื่องขั้นตอนการยื่นหนังสือขอจดทะเบียนโอนสิทธิ์ของสำนักงานธนารักษ์พื้นที่พญาไท และผังสีเมืองสีแดงทำตึกแถวพาณิชย์ 4 ชั้นได้ไหมคะ",
      offerPrice: 1480000,
      createdAt: "2026-07-18T10:30:00Z",
      status: "PENDING",
    },
    {
      id: "lead-2",
      listingId: "list-1",
      buyerName: "คุณ วรวุฒิ ตั้งมั่น (บจก. เอสเตทกรุ๊ป)",
      buyerThaidId: "0105562089123",
      phone: "089-876-5432",
      message: "บริษัทกำลังหาทำเลทองย่านพญาไทเพื่อลงทุนเช่าทำอาคารมินิโชว์รูมครับ ราคาเสนอโอนสิทธิ์ 1,500,000 ถ้วนนี้พร้อมเจรจาทันทีครับ หากตกลงรบกวนตอบรับกลับผ่านระบบได้เลยเพื่อจะได้เข้าทำสัญญาคำขอหลวงครับ",
      offerPrice: 1500000,
      createdAt: "2026-07-19T08:15:00Z",
      status: "PENDING",
    }
  ]);

  // Dialog / Modal States
  const [selectedContractForListing, setSelectedContractForListing] = useState<LeaseContract | null>(null);
  const [selectedListingForEdit, setSelectedListingForEdit] = useState<Listing | null>(null);
  const [selectedListingForLeads, setSelectedListingForLeads] = useState<Listing | null>(null);
  const [selectedListingForPrint, setSelectedListingForPrint] = useState<Listing | null>(null);
  const [showCreateListingSelector, setShowCreateListingSelector] = useState(false);
  const [deleteConfirmListingId, setDeleteConfirmListingId] = useState<string | null>(null);

  // Role simulation check
  useEffect(() => {
    const checkRole = () => setUserRole(localStorage.getItem("trd_user_role") || "GUEST");
    checkRole();
    window.addEventListener("trd-role-changed", checkRole);
    window.addEventListener("storage", checkRole);
    return () => {
      window.removeEventListener("trd-role-changed", checkRole);
      window.removeEventListener("storage", checkRole);
    };
  }, []);

  // Fetch data
  const loadData = async () => {
    if (userRole !== "SELLER") return;
    setLoadingData(true);
    try {
      if (!api.getToken()) {
        try {
          await api.login({ thaid_id: "1123456789012" });
        } catch (authErr) {
          console.warn("Failed auto login (backend offline?):", authErr);
        }
      }

      const fetchedListings = await api.getMyListings();
      setListings(fetchedListings);

      const fetchedContracts = await api.getMyContracts();
      setContracts(fetchedContracts);
    } catch (err) {
      console.warn("Using offline fallback mock values:", err);
      setListings(initialMyListings);
      setContracts(mockContracts);
    } finally {
      setLoadingData(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [userRole]);

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 2500);
  };

  // 1. UPDATE Listing
  const handleUpdate = async (
    id: string,
    data: { asking_price: number; description: string; image_urls?: string[] }
  ) => {
    try {
      await api.updateListing(id, data);
      showToast("✓ แก้ไขรายละเอียดประกาศเรียบร้อยแล้ว");
      loadData();
    } catch (err) {
      setListings((prev) =>
        prev.map((l) => (l.id === id ? { ...l, ...data, updatedAt: new Date().toISOString() } : l))
      );
      showToast("✓ แก้ไขประกาศเรียบร้อยแล้ว (จำลองสิทธิ์ออฟไลน์)");
    }
  };

  // 2. DELETE Listing
  const handleDelete = async (id: string) => {
    try {
      await api.deleteListing(id);
      showToast("✕ ลบประกาศเรียบร้อยแล้ว");
      loadData();
    } catch (err) {
      setListings((prev) => prev.filter((l) => l.id !== id));
      showToast("✕ ลบประกาศเรียบร้อยแล้ว (จำลองสิทธิ์ออฟไลน์)");
    }
    setDeleteConfirmListingId(null);
  };

  // 3. CHANGE Listing Status
  const handleStatusChange = async (id: string, status: "ACTIVE" | "HIDDEN" | "SOLD" | "IN_NEGOTIATION") => {
    try {
      await api.updateListingStatus(id, { status: status as any });
      showToast(`สถานะเปลี่ยนเป็น: ${STATUS_CONFIG[status].label}`);
      loadData();
    } catch (err) {
      setListings((prev) => prev.map((l) => (l.id === id ? { ...l, status } : l)));
      showToast(`สถานะเปลี่ยนเป็น: ${STATUS_CONFIG[status].label} (ออฟไลน์)`);
    }
  };

  // 4. CREATE Listing
  const handleCreateListing = async (data: { asking_price: number; description: string; image_url: string }) => {
    if (!selectedContractForListing) return;

    try {
      await api.createListing({
        contractId: selectedContractForListing.id,
        asking_price: data.asking_price,
        description: data.description,
        image_urls: [data.image_url],
      });
      showToast("📢 ลงประกาศโอนสิทธิ์สำเร็จ!");
      await loadData();
      setActiveTab("LISTINGS");
    } catch (err: any) {
      console.warn("Backend error. Simulating locally:", err);
      const newListing: Listing = {
        id: `list-temp-${Date.now()}`,
        sellerId: MY_SELLER_ID,
        seller: { id: MY_SELLER_ID, thaid_id: "TH-001", first_name: "สมชาย", last_name: "ใจดี", role: "USER" },
        contractId: selectedContractForListing.id,
        contract: selectedContractForListing,
        asking_price: data.asking_price,
        estimated_fee: data.asking_price * 0.03,
        description: data.description,
        image_urls: [data.image_url],
        status: "ACTIVE",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      setListings((prev) => [newListing, ...prev]);
      showToast("📢 ลงประกาศโอนสิทธิ์สำเร็จ (จำลองสิทธิ์ออฟไลน์)");
      setActiveTab("LISTINGS");
    }
  };

  // 5. Accept Negotiation Lead
  const handleAcceptLead = (leadId: string) => {
    setLeads((prev) =>
      prev.map((l) => (l.id === leadId ? { ...l, status: "ACCEPTED" } : l))
    );
    const acceptedLead = leads.find((l) => l.id === leadId);
    if (acceptedLead) {
      // Automatically switch listing to IN_NEGOTIATION
      handleStatusChange(acceptedLead.listingId, "IN_NEGOTIATION");
      showToast("🤝 ตอบรับการเจรจา! สถานะประกาศเปลี่ยนเป็น 'รอการเจรจา' แล้ว");
      
      // Update local listing state instantly if API response delays
      setListings((prev) =>
        prev.map((l) => (l.id === acceptedLead.listingId ? { ...l, status: "IN_NEGOTIATION" } : l))
      );

      // Close leads modal and open print auto-pdf modal immediately to wow the user!
      setSelectedListingForLeads(null);
      const targetListing = listings.find((l) => l.id === acceptedLead.listingId);
      if (targetListing) {
        setSelectedListingForPrint(targetListing);
      }
    }
  };

  // ──────────────────────────────────────────────
  // Filtering and Searching
  // ──────────────────────────────────────────────
  const filteredListings = listings.filter((l) => {
    // Status Filter
    if (statusFilter === "ACTIVE" && l.status !== "ACTIVE") return false;
    if (statusFilter === "IN_NEGOTIATION" && l.status !== "IN_NEGOTIATION") return false;
    if (statusFilter === "CLOSED_SOLD" && l.status !== "SOLD" && l.status !== "HIDDEN") return false;

    // Search query
    if (searchTerm) {
      const s = searchTerm.toLowerCase();
      const contractNo = l.contract?.contract_number?.toLowerCase() || "";
      const parcelNo = l.contract?.parcel_number?.toLowerCase() || "";
      const subDistrict = l.contract?.sub_district?.toLowerCase() || "";
      const district = l.contract?.district?.toLowerCase() || "";
      const province = l.contract?.province?.toLowerCase() || "";
      const desc = l.description?.toLowerCase() || "";

      return (
        contractNo.includes(s) ||
        parcelNo.includes(s) ||
        subDistrict.includes(s) ||
        district.includes(s) ||
        province.includes(s) ||
        desc.includes(s)
      );
    }
    return true;
  });

  const getListingLeads = (listingId: string) => leads.filter((l) => l.listingId === listingId);

  // Counter calculations for tabs and stats
  const totalListingsCount = listings.length;
  const activeListingsCount = listings.filter((l) => l.status === "ACTIVE").length;
  const negotiationListingsCount = listings.filter((l) => l.status === "IN_NEGOTIATION").length;
  const closedSoldListingsCount = listings.filter((l) => l.status === "SOLD" || l.status === "HIDDEN").length;

  const totalInquiriesCount = listings.reduce((sum, l) => sum + getListingLeads(l.id).length, 0);

  // Seller Details fallback
  const sellerName = listings.length > 0
    ? `${listings[0].seller.first_name} ${listings[0].seller.last_name}`
    : "สมชาย ใจดี";

  if (userRole === null) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="animate-pulse text-slate-400 font-mono text-xs uppercase tracking-widest font-bold">
          [ Authenticating Session... ]
        </div>
      </div>
    );
  }

  if (userRole !== "SELLER") {
    return (
      <div className="min-h-[75vh] flex items-center justify-center px-4 py-12 bg-trd-surface font-sans">
        <div className="max-w-md w-full bg-[#0F1A30] border-2 border-amber-500/40 rounded-2xl p-8 text-center space-y-6 shadow-[0_15px_40px_rgba(245,158,11,0.12)] relative overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-amber-500 to-yellow-400" />
          <div className="w-16 h-16 bg-[#070D1A] border border-amber-500/30 text-amber-400 rounded-full flex items-center justify-center mx-auto text-3xl shadow-inner">
            🔐
          </div>
          <div className="space-y-2">
            <h2 className="text-sm font-black text-white uppercase tracking-wider">HTTP 403 — Forbidden</h2>
            <p className="text-[10px] text-amber-400 font-mono tracking-widest font-bold uppercase">[ Seller Role Required ]</p>
          </div>
          <p className="text-xs text-slate-300 leading-relaxed font-medium">
            หน้า "จัดการประกาศของฉัน" สงวนสิทธิ์สำหรับผู้ใช้ในบทบาท **ผู้โอนสิทธิ์ (SELLER)** เท่านั้น เพื่อจัดการข้อมูลสัญญาและลงประกาศโอนสิทธิ์
          </p>
          <div className="bg-[#070D1A] rounded-xl border border-[#1E2E4A] p-4 text-[10.5px] font-mono text-left space-y-1.5">
            <span className="font-black text-amber-400">[Dev-Console] Role ACL Check</span>
            <p className="text-slate-400 font-sans leading-normal font-medium mt-0.5">
              ตรวจพบบทบาทปัจจุบัน: <strong className="text-white">"{userRole}"</strong>
              <br />
              โปรดเลือกบทบาทเป็น <strong className="text-white">"ผู้โอนสิทธิ์ (SELLER)"</strong> บนแถบสลับบทบาทจำลองของ Navbar ด้านบนเพื่อเข้าใช้งาน
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-trd-bg text-trd-primary min-h-screen py-10 relative">
      
      {/* Toast Alert */}
      {toast && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#0F1A30] border border-trd-secondary/40 text-trd-secondary text-[11px] font-mono font-black uppercase tracking-widest px-4 py-2.5 rounded-xl shadow-neon-gold animate-slide-up">
          {toast}
        </div>
      )}

      {/* MODALS */}
      {showCreateListingSelector && (
        <AvailableContractsModal
          contracts={contracts}
          listings={listings}
          onClose={() => setShowCreateListingSelector(false)}
          onSelectContract={(c) => {
            setShowCreateListingSelector(false);
            setSelectedContractForListing(c);
          }}
        />
      )}

      {selectedContractForListing && (
        <CreateListingModal
          contract={selectedContractForListing}
          onClose={() => setSelectedContractForListing(null)}
          onSubmit={handleCreateListing}
        />
      )}

      {selectedListingForEdit && (
        <EditListingModal
          listing={selectedListingForEdit}
          onClose={() => setSelectedListingForEdit(null)}
          onUpdate={handleUpdate}
        />
      )}

      {selectedListingForLeads && (
        <ViewLeadsModal
          listing={selectedListingForLeads}
          leads={leads}
          onClose={() => setSelectedListingForLeads(null)}
          onAcceptLead={handleAcceptLead}
        />
      )}

      {selectedListingForPrint && (
        <AutoPDFModal
          listing={selectedListingForPrint}
          leads={leads}
          onClose={() => setSelectedListingForPrint(null)}
        />
      )}

      {deleteConfirmListingId && (
        <ConfirmDialog
          title="⚠ ยืนยันการลบประกาศ"
          message="คุณต้องการลบประกาศเสนอขายสิทธิ์นี้ หรือไม่? ข้อมูลประกาศจะถูกลบออกจากสารบบกระดานซื้อขายตลาดรองของกรมธนารักษ์ และไม่สามารถกู้คืนได้"
          confirmLabel="ยืนยันการลบประกาศ"
          onConfirm={() => handleDelete(deleteConfirmListingId)}
          onCancel={() => setDeleteConfirmListingId(null)}
          danger
        />
      )}

      {/* DASHBOARD CONTENT CONTAINER */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8 print:hidden">

        {/* 1. Header & Summary Stats */}
        <div className="flex flex-col space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-[#1E2E4A] pb-5">
            <div className="flex items-center gap-3">
              <span className="text-3xl">📋</span>
              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">จัดการประกาศของฉัน</h1>
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-500/10 border border-emerald-500/30 text-emerald-450 text-xs font-bold rounded-full mt-0.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                    ยืนยันตัวตนผ่าน ThaID แล้ว
                  </span>
                </div>
                <p className="text-xs text-slate-400 mt-1 font-medium font-sans">
                  สวัสดีคุณ <strong className="text-white font-bold">{sellerName}</strong> · สถิติข้อมูลประกาศเปลี่ยนมือและสิทธิ์ครอบครองที่ราชพัสดุ
                </p>
              </div>
            </div>

            {/* Top Right Main CTA */}
            <button
              onClick={() => setShowCreateListingSelector(true)}
              className="inline-flex items-center justify-center gap-2 px-5 py-3 bg-emerald-600 hover:bg-emerald-550 text-white font-mono text-xs font-black uppercase tracking-wider rounded-xl transition-all duration-300 shadow-lg hover:shadow-emerald-950/20 hover:-translate-y-0.5 border border-emerald-500 cursor-pointer self-start sm:self-center"
            >
              ➕ สร้างประกาศใหม่ (Create New Listing)
            </button>
          </div>

          {/* Stat Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
            <div className="bg-[#0F1A30]/80 backdrop-blur-md border border-[#1E2E4A] rounded-2xl p-5 hover:border-[#2E4A6E] transition-all flex items-center justify-between group shadow-lg">
              <div className="space-y-1">
                <span className="text-[10px] text-slate-550 font-mono uppercase tracking-widest font-black block">จำนวนประกาศทั้งหมด</span>
                <span className="text-2xl font-black text-white font-mono block">{totalListingsCount}</span>
                <span className="text-[10.5px] text-slate-400 font-sans block">รวมประกาศทุกสถานะในระบบ</span>
              </div>
              <div className="w-12 h-12 bg-[#070D1A] rounded-xl flex items-center justify-center border border-[#1E2E4A] text-2xl group-hover:scale-105 transition-all shadow-inner">
                📋
              </div>
            </div>

            <div className="bg-[#0F1A30]/80 backdrop-blur-md border border-[#1E2E4A] rounded-2xl p-5 hover:border-[#2E4A6E] transition-all flex items-center justify-between group shadow-lg">
              <div className="space-y-1">
                <span className="text-[10px] text-slate-550 font-mono uppercase tracking-widest font-black block">กำลังเปิดรับผู้สนใจ (Active)</span>
                <span className="text-2xl font-black text-emerald-400 font-mono block">{activeListingsCount}</span>
                <span className="text-[10.5px] text-slate-400 font-sans block">กำลังประกาศบนกระดานซื้อขาย</span>
              </div>
              <div className="w-12 h-12 bg-[#070D1A] rounded-xl flex items-center justify-center border border-emerald-500/20 text-2xl group-hover:scale-105 transition-all shadow-inner">
                🟢
              </div>
            </div>

            <div className="bg-[#0F1A30]/80 backdrop-blur-md border border-[#1E2E4A] rounded-2xl p-5 hover:border-[#2E4A6E] transition-all flex items-center justify-between group shadow-lg">
              <div className="space-y-1">
                <span className="text-[10px] text-slate-550 font-mono uppercase tracking-widest font-black block">ข้อความติดต่อ / ผู้สนใจ</span>
                <span className="text-2xl font-black text-trd-secondary font-mono block">{totalInquiriesCount}</span>
                <span className="text-[10.5px] text-slate-400 font-sans block">จำนวนคำขอเจรจาเสนอซื้อสิทธิ์</span>
              </div>
              <div className="w-12 h-12 bg-[#070D1A] rounded-xl flex items-center justify-center border border-[#1E2E4A] text-2xl group-hover:scale-105 transition-all shadow-inner">
                💬
              </div>
            </div>
          </div>
        </div>

        {/* TAB SELECTOR (LISTINGS VS CONTRACTS) */}
        <div className="flex border-b border-[#1E2E4A] gap-4">
          <button
            onClick={() => setActiveTab("LISTINGS")}
            className={`pb-3.5 text-sm font-black uppercase tracking-wider font-mono border-b-2 transition-all cursor-pointer ${
              activeTab === "LISTINGS"
                ? "border-trd-secondary text-trd-secondary"
                : "border-transparent text-slate-400 hover:text-white"
            }`}
          >
            ประกาศเสนอขายสิทธิ์ ({listings.length})
          </button>
          <button
            onClick={() => setActiveTab("CONTRACTS")}
            className={`pb-3.5 text-sm font-black uppercase tracking-wider font-mono border-b-2 transition-all cursor-pointer ${
              activeTab === "CONTRACTS"
                ? "border-trd-secondary text-trd-secondary"
                : "border-transparent text-slate-400 hover:text-white"
            }`}
          >
            สัญญาเช่าของฉัน ({contracts.length})
          </button>
        </div>

        {/* ────────────────────────────────────────────── */}
        {/* VIEW 1: ACTIVE LISTINGS TAB */}
        {/* ────────────────────────────────────────────── */}
        {activeTab === "LISTINGS" && (
          <div className="space-y-6">
            
            {/* 2. Filters & Search Bar */}
            <div className="bg-[#0F1A30]/80 backdrop-blur-md border border-[#1E2E4A] rounded-2xl p-4.5 flex flex-col md:flex-row gap-4 items-center justify-between shadow-lg">
              
              {/* Search Bar */}
              <div className="relative w-full md:max-w-md">
                <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-500 pointer-events-none">🔍</span>
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full bg-[#070D1A] border border-[#1E2E4A] focus:border-trd-secondary rounded-xl pl-9 pr-4 py-2.5 text-xs text-white placeholder-slate-500 font-sans focus:outline-none transition-all"
                  placeholder="ค้นหาจาก เลขที่สัญญา, เลขที่ราชพัสดุ, หรือ ตำบล/อำเภอ..."
                />
                {searchTerm && (
                  <button
                    onClick={() => setSearchTerm("")}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-555 hover:text-white cursor-pointer"
                  >
                    ✕
                  </button>
                )}
              </div>

              {/* Status Filters */}
              <div className="flex flex-wrap gap-2 w-full md:w-auto font-mono text-[10.5px]">
                <button
                  onClick={() => setStatusFilter("ALL")}
                  className={`px-3.5 py-2.5 rounded-xl border font-bold uppercase transition-all cursor-pointer ${
                    statusFilter === "ALL"
                      ? "bg-trd-secondary text-[#0F1A30] border-transparent font-black shadow-neon-gold"
                      : "bg-[#070D1A] border-[#1E2E4A] text-slate-400 hover:text-white hover:border-[#2E4A6E]"
                  }`}
                >
                  ทั้งหมด ({totalListingsCount})
                </button>
                <button
                  onClick={() => setStatusFilter("ACTIVE")}
                  className={`px-3.5 py-2.5 rounded-xl border font-bold uppercase transition-all cursor-pointer ${
                    statusFilter === "ACTIVE"
                      ? "bg-trd-secondary text-[#0F1A30] border-transparent font-black shadow-neon-gold"
                      : "bg-[#070D1A] border-[#1E2E4A] text-slate-400 hover:text-white hover:border-[#2E4A6E]"
                  }`}
                >
                  กำลังเปิดรับ ({activeListingsCount})
                </button>
                <button
                  onClick={() => setStatusFilter("IN_NEGOTIATION")}
                  className={`px-3.5 py-2.5 rounded-xl border font-bold uppercase transition-all cursor-pointer ${
                    statusFilter === "IN_NEGOTIATION"
                      ? "bg-trd-secondary text-[#0F1A30] border-transparent font-black shadow-neon-gold"
                      : "bg-[#070D1A] border-[#1E2E4A] text-slate-400 hover:text-white hover:border-[#2E4A6E]"
                  }`}
                >
                  รอการเจรจา ({negotiationListingsCount})
                </button>
                <button
                  onClick={() => setStatusFilter("CLOSED_SOLD")}
                  className={`px-3.5 py-2.5 rounded-xl border font-bold uppercase transition-all cursor-pointer ${
                    statusFilter === "CLOSED_SOLD"
                      ? "bg-trd-secondary text-[#0F1A30] border-transparent font-black shadow-neon-gold"
                      : "bg-[#070D1A] border-[#1E2E4A] text-slate-400 hover:text-white hover:border-[#2E4A6E]"
                  }`}
                >
                  ปิดประกาศ/โอนแล้ว ({closedSoldListingsCount})
                </button>
              </div>

            </div>

            {/* Listings output */}
            {loadingData ? (
              <div className="text-center py-20 animate-pulse text-xs font-mono text-slate-500 uppercase tracking-widest font-black">
                [ ⏳ กำลังโหลดข้อมูลประกาศจากระบบฐานข้อมูล... ]
              </div>
            ) : filteredListings.length === 0 ? (
              <div className="bg-[#0F1A30]/80 backdrop-blur-md border border-[#1E2E4A] rounded-2xl py-20 text-center space-y-4 shadow-lg">
                <div className="text-4xl">📭</div>
                <div className="text-xs font-black text-white uppercase tracking-wider font-mono">No Listings Found</div>
                <p className="text-xs text-slate-450 max-w-sm mx-auto leading-relaxed">
                  ไม่พบประกาศขายสิทธิ์การเช่าที่ตรงตามเงื่อนไขค้นหาของคุณในปัจจุบัน สามารถตรวจสอบข้อมูลสัญญาและลงขายสิทธิ์ได้ทันที
                </p>
                <button
                  onClick={() => setShowCreateListingSelector(true)}
                  className="inline-flex items-center gap-1.5 px-4 py-2.5 bg-trd-secondary text-[#0F1A30] text-xs font-black uppercase tracking-wider font-mono rounded-xl hover:opacity-90 transition-all cursor-pointer shadow-neon-gold"
                >
                  ลงประกาศจากสัญญาเช่าของฉัน →
                </button>
              </div>
            ) : (
              <>
                {/* 3. รายการประกาศ (Listing Table for Desktop / Cards for Mobile) */}
                
                {/* Desktop Data Table Layout (Visible on md and larger) */}
                <div className="hidden md:block overflow-hidden bg-[#0F1A30]/80 backdrop-blur-md border border-[#1E2E4A] rounded-2xl shadow-lg">
                  <table className="min-w-full divide-y divide-[#1E2E4A] text-left">
                    <thead className="bg-[#070D1A]/85 text-[10px] font-mono text-slate-500 uppercase tracking-wider font-black">
                      <tr>
                        <th scope="col" className="px-6 py-4">ทรัพย์สินและสัญญา</th>
                        <th scope="col" className="px-6 py-4">ที่ตั้งราชพัสดุ</th>
                        <th scope="col" className="px-6 py-4 text-right">ราคาเสนอโอน</th>
                        <th scope="col" className="px-6 py-4">สถานะประกาศ</th>
                        <th scope="col" className="px-6 py-4 text-center">การจัดการ</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#1E2E4A]/60 text-xs text-slate-200">
                      {filteredListings.map((listing) => {
                        const statusCfg = STATUS_CONFIG[listing.status as keyof typeof STATUS_CONFIG] || STATUS_CONFIG.ACTIVE;
                        const listingLeads = getListingLeads(listing.id);

                        return (
                          <tr key={listing.id} className="hover:bg-[#070D1A]/20 transition-colors">
                            <td className="px-6 py-4 flex items-center gap-3">
                              <div className="w-14 h-14 rounded-lg overflow-hidden border border-[#1E2E4A] bg-[#070D1A]">
                                <img src={listing.image_urls[0] || PRESET_IMAGES[0].url} className="w-full h-full object-cover" />
                              </div>
                              <div className="space-y-1">
                                <span className="font-bold text-white block text-sm line-clamp-1">
                                  สิทธิ์การเช่า{listing.contract?.building_type || "ที่ดินเปล่า"} {listing.contract?.land_area_sqw} ตร.ว.
                                </span>
                                <span className="font-mono text-[10.5px] text-trd-secondary block">
                                  สัญญา: {listing.contract?.contract_number} · ทะเบียน: {listing.contract?.parcel_number}
                                </span>
                              </div>
                            </td>
                            <td className="px-6 py-4">
                              <div className="font-medium text-white">{listing.contract?.district} · {listing.contract?.sub_district}</div>
                              <div className="text-[10px] text-slate-500 font-mono mt-0.5">{listing.contract?.province}</div>
                            </td>
                            <td className="px-6 py-4 text-right font-mono text-sm font-black text-white">
                              {formatBaht(listing.asking_price)}
                            </td>
                            <td className="px-6 py-4">
                              <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full border text-[10px] font-black uppercase tracking-wider font-mono ${statusCfg.bg} ${statusCfg.color}`}>
                                <span className={`w-1.5 h-1.5 rounded-full ${statusCfg.dot}`} />
                                {statusCfg.label}
                              </span>
                            </td>
                            <td className="px-6 py-4">
                              <div className="flex items-center justify-center gap-2">
                                <Link
                                  href={`/listings/${listing.id}`}
                                  title="ดูมุมมองนักลงทุน"
                                  className="w-8 h-8 rounded-lg bg-[#070D1A] border border-[#1E2E4A] hover:border-slate-500 flex items-center justify-center text-slate-300 hover:text-white transition-all"
                                >
                                  👁️
                                </Link>
                                <button
                                  onClick={() => setSelectedListingForEdit(listing)}
                                  title="แก้ไขประกาศ"
                                  className="w-8 h-8 rounded-lg bg-[#070D1A] border border-[#1E2E4A] hover:border-slate-500 flex items-center justify-center text-trd-secondary hover:text-white transition-all cursor-pointer"
                                >
                                  ✏️
                                </button>
                                <button
                                  onClick={() => setSelectedListingForLeads(listing)}
                                  title="ดูข้อความผู้สนใจ"
                                  className="relative w-8 h-8 rounded-lg bg-[#070D1A] border border-[#1E2E4A] hover:border-slate-550 flex items-center justify-center text-amber-400 hover:text-white transition-all cursor-pointer"
                                >
                                  💬
                                  {listingLeads.length > 0 && (
                                    <span className="absolute -top-1.5 -right-1.5 w-4.5 h-4.5 bg-red-650 border border-white text-white font-mono font-black text-[9px] rounded-full flex items-center justify-center animate-bounce">
                                      {listingLeads.length}
                                    </span>
                                  )}
                                </button>
                                <button
                                  onClick={() => setSelectedListingForPrint(listing)}
                                  title="พิมพ์คำขอโอนสิทธิ์ ท.บ. ๙"
                                  className="w-8 h-8 rounded-lg bg-[#070D1A] border border-[#1E2E4A] hover:border-slate-500 flex items-center justify-center text-emerald-450 hover:text-white transition-all cursor-pointer"
                                >
                                  🖨️
                                </button>
                                <button
                                  onClick={() => setDeleteConfirmListingId(listing.id)}
                                  title="ลบประกาศ"
                                  className="w-8 h-8 rounded-lg bg-[#070D1A] border border-[#1E2E4A] hover:border-red-500/50 flex items-center justify-center text-red-400 hover:text-white transition-all cursor-pointer"
                                >
                                  ✕
                                </button>
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>

                {/* Mobile Cards List Layout (Visible on screen size smaller than md) */}
                <div className="grid grid-cols-1 gap-5 md:hidden">
                  {filteredListings.map((listing) => {
                    const statusCfg = STATUS_CONFIG[listing.status as keyof typeof STATUS_CONFIG] || STATUS_CONFIG.ACTIVE;
                    const listingLeads = getListingLeads(listing.id);

                    return (
                      <div key={listing.id} className="bg-[#0F1A30]/80 border border-[#1E2E4A] rounded-2xl overflow-hidden shadow-lg space-y-4 p-4.5">
                        
                        {/* Mobile Header: image & title & status */}
                        <div className="flex gap-3">
                          <div className="w-16 h-16 rounded-xl overflow-hidden border border-[#1E2E4A] flex-shrink-0 bg-[#070D1A]">
                            <img src={listing.image_urls[0] || PRESET_IMAGES[0].url} className="w-full h-full object-cover" />
                          </div>
                          <div className="space-y-1">
                            <span className="font-bold text-white text-sm block leading-snug line-clamp-2">
                              สิทธิ์การเช่า{listing.contract?.building_type || "ที่ดินเปล่า"} {listing.contract?.land_area_sqw} ตร.ว.
                            </span>
                            <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full border text-[9px] font-black uppercase tracking-wider font-mono ${statusCfg.bg} ${statusCfg.color}`}>
                              {statusCfg.label}
                            </span>
                          </div>
                        </div>

                        {/* Mobile mid info */}
                        <div className="bg-[#070D1A] rounded-xl border border-[#1E2E4A]/80 p-3 space-y-2 text-[11px] font-mono">
                          <div className="flex justify-between">
                            <span className="text-slate-550">เลขที่สัญญา:</span>
                            <span className="text-white font-bold">{listing.contract?.contract_number}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-slate-555">เลขราชพัสดุ:</span>
                            <span className="text-white font-bold">{listing.contract?.parcel_number}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-slate-555">ที่ตั้ง:</span>
                            <span className="text-slate-200 font-sans">{listing.contract?.district}, {listing.contract?.province}</span>
                          </div>
                          <div className="border-t border-[#1E2E4A] pt-2 flex justify-between items-baseline">
                            <span className="text-slate-400 font-sans">ราคาเสนอโอน:</span>
                            <span className="text-base text-trd-secondary font-black">{formatBaht(listing.asking_price)}</span>
                          </div>
                        </div>

                        {/* Mobile Actions: Icon Menu Grid */}
                        <div className="grid grid-cols-5 gap-2 pt-1 border-t border-[#1E2E4A]">
                          <Link
                            href={`/listings/${listing.id}`}
                            className="py-2.5 bg-[#070D1A] border border-[#1E2E4A] rounded-xl flex flex-col items-center justify-center text-slate-300 hover:text-white"
                          >
                            <span className="text-sm">👁️</span>
                            <span className="text-[8px] mt-0.5 font-bold">ดูรายละเอียด</span>
                          </Link>
                          <button
                            onClick={() => setSelectedListingForEdit(listing)}
                            className="py-2.5 bg-[#070D1A] border border-[#1E2E4A] rounded-xl flex flex-col items-center justify-center text-trd-secondary hover:text-white cursor-pointer"
                          >
                            <span className="text-sm">✏️</span>
                            <span className="text-[8px] mt-0.5 font-bold">แก้ไข</span>
                          </button>
                          <button
                            onClick={() => setSelectedListingForLeads(listing)}
                            className="relative py-2.5 bg-[#070D1A] border border-[#1E2E4A] rounded-xl flex flex-col items-center justify-center text-amber-400 hover:text-white cursor-pointer"
                          >
                            <span className="text-sm">💬</span>
                            <span className="text-[8px] mt-0.5 font-bold">ผู้สนใจ</span>
                            {listingLeads.length > 0 && (
                              <span className="absolute top-1 right-2 w-3.5 h-3.5 bg-red-650 text-white font-mono text-[8px] rounded-full flex items-center justify-center">
                                {listingLeads.length}
                              </span>
                            )}
                          </button>
                          <button
                            onClick={() => setSelectedListingForPrint(listing)}
                            className="py-2.5 bg-[#070D1A] border border-[#1E2E4A] rounded-xl flex flex-col items-center justify-center text-emerald-450 hover:text-white cursor-pointer"
                          >
                            <span className="text-sm">🖨️</span>
                            <span className="text-[8px] mt-0.5 font-bold">พิมพ์คำขอ</span>
                          </button>
                          <button
                            onClick={() => setDeleteConfirmListingId(listing.id)}
                            className="py-2.5 bg-[#070D1A] border border-[#1E2E4A] rounded-xl flex flex-col items-center justify-center text-red-400 hover:text-white cursor-pointer"
                          >
                            <span className="text-sm">✕</span>
                            <span className="text-[8px] mt-0.5 font-bold">ลบ</span>
                          </button>
                        </div>

                      </div>
                    );
                  })}
                </div>
              </>
            )}
          </div>
        )}

        {/* ────────────────────────────────────────────── */}
        {/* VIEW 2: CONTRACTS TAB */}
        {/* ────────────────────────────────────────────── */}
        {activeTab === "CONTRACTS" && (
          <div className="space-y-6">
            <div className="bg-[#070D1A]/80 border border-[#1E2E4A] rounded-xl px-4 py-3.5 flex items-start gap-2.5 shadow-inner">
              <span className="text-trd-secondary text-sm mt-0.5">💡</span>
              <div className="text-xs text-slate-400 leading-relaxed font-medium font-sans">
                <p className="text-white font-bold mb-0.5">คู่มือการนำสัญญาเช่ามาประกาศเสนอขายสิทธิ์:</p>
                ข้อมูลสัญญาเช่าด้านล่างดึงข้อมูลโดยตรงจากฐานข้อมูลทะเบียนหลวงของกรมธนารักษ์ (TRD database) คุณสามารถเลือกสัญญาเช่าที่ประสงค์ต้องการเปลี่ยนสิทธิ์ครอบครองเพื่อกรอกรายละเอียดและโอนสิทธิ์ออนไลน์ผ่านตลาดรอง
              </div>
            </div>

            {loadingData ? (
              <div className="text-center py-20 animate-pulse text-xs font-mono text-slate-550 uppercase tracking-widest font-black">
                [ ⏳ กำลังดึงข้อมูลทะเบียนสัญญาจากกรมธนารักษ์... ]
              </div>
            ) : contracts.length === 0 ? (
              <div className="bg-[#0F1A30]/80 border border-[#1E2E4A] rounded-2xl py-20 text-center space-y-4">
                <div className="text-4xl">📁</div>
                <div className="text-xs font-black text-white uppercase tracking-wider font-mono">No Contracts Registered</div>
                <p className="text-xs text-slate-450 max-w-sm mx-auto leading-relaxed">
                  ไม่พบสัญญาเช่าที่จดทะเบียนภายใต้หมายเลขประชาชนของคุณในระบบจำลอง หากคุณมีสัญญาเช่าที่ต้องการดำเนินการ กรุณาติดต่อธนารักษ์พื้นที่
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {contracts.map((contract) => {
                  const associatedListing = listings.find(
                    (l) => l.contractId === contract.id && l.status !== "SOLD"
                  );
                  
                  return (
                    <div
                      key={contract.id}
                      className={`bg-[#0F1A30]/80 border-2 rounded-2xl p-4.5 space-y-4 flex flex-col justify-between transition-all duration-200 ${
                        associatedListing ? "border-[#1E2E4A] opacity-80" : "border-trd-secondary/30 hover:border-trd-secondary/60"
                      }`}
                    >
                      <div className="space-y-1.5">
                        <div className="flex justify-between items-start">
                          <span className="text-[10px] text-slate-500 font-mono font-bold tracking-widest">CONTRACT NUMBER:</span>
                          {associatedListing ? (
                            <span className="px-2 py-0.5 bg-trd-secondary/10 border border-trd-secondary/30 text-trd-secondary text-[9px] font-mono font-black uppercase tracking-wider rounded">
                              [ ลงประกาศขายแล้ว ]
                            </span>
                          ) : (
                            <span className="px-2 py-0.5 bg-emerald-500/10 border border-emerald-500/30 text-emerald-450 text-[9px] font-mono font-black uppercase tracking-wider rounded">
                              [ สัญญาว่างพร้อมลงขาย ]
                            </span>
                          )}
                        </div>
                        <div className="text-base font-black text-white font-mono uppercase tracking-wider">
                          {contract.contract_number}
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-3.5 border-t border-b border-[#1E2E4A]/80 py-3 font-mono text-[11px] text-slate-300">
                        <div>
                          <span className="text-slate-500 block">เลขทะเบียนราชพัสดุ:</span>
                          <span className="text-white font-bold">{contract.parcel_number}</span>
                        </div>
                        <div>
                          <span className="text-slate-500 block">ขนาดพื้นที่ดิน:</span>
                          <span className="text-white font-bold">{contract.land_area_sqw} ตร.ว.</span>
                        </div>
                        <div>
                          <span className="text-slate-500 block">การใช้ประโยชน์:</span>
                          <span className="text-slate-200">{contract.building_type || "ที่ดินเปล่า"}</span>
                        </div>
                        <div>
                          <span className="text-slate-500 block">พื้นที่ตั้งเช่า:</span>
                          <span className="text-slate-200 font-sans">{contract.sub_district}, {contract.district}</span>
                        </div>
                      </div>

                      <div className="flex justify-between items-center pt-1.5">
                        <div className="font-mono">
                          <span className="text-[9px] text-slate-500 uppercase block tracking-wider">ค่าเช่าหลวงรายปี:</span>
                          <span className="text-trd-secondary text-sm font-black">{formatBaht(contract.annual_rent || 0)}</span>
                        </div>

                        {associatedListing ? (
                          <div className="flex items-center gap-2">
                            <span className="text-[11px] text-slate-400 font-bold">
                              ราคาตั้งขาย: {formatBaht(associatedListing.asking_price)}
                            </span>
                            <button
                              onClick={() => {
                                setActiveTab("LISTINGS");
                                setStatusFilter("ALL");
                              }}
                              className="text-[10px] bg-[#070D1A] border border-[#1E2E4A] text-slate-300 font-mono font-black uppercase tracking-widest px-3 py-1.5 rounded-lg hover:border-slate-550 transition-all cursor-pointer"
                            >
                              จัดการประกาศ
                            </button>
                          </div>
                        ) : (
                          <button
                            onClick={() => setSelectedContractForListing(contract)}
                            className="bg-gold-gradient text-[#0F1A30] font-mono text-[10.5px] font-black uppercase tracking-widest px-4 py-2.5 rounded-xl hover:opacity-90 transition-all cursor-pointer shadow-neon-gold border-0"
                          >
                            📢 ลงประกาศขายสิทธิ์
                          </button>
                        )}
                      </div>

                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* 4. ส่วนชี้แจงและช่วยเหลือ (Help & Disclaimer) */}
        <div className="bg-[#0F1A30]/50 border-2 border-[#1E2E4A] rounded-2xl p-5 space-y-4 shadow-lg">
          <div className="flex gap-3 items-start">
            <span className="text-2xl mt-0.5">⚖️</span>
            <div className="space-y-1.5">
              <h4 className="text-sm font-black text-white uppercase tracking-wider font-mono">คำชี้แจงและข้อกำหนดด้านกฎหมาย (Disclaimer)</h4>
              <p className="text-xs text-slate-350 leading-relaxed font-sans font-medium">
                การทำธุรกรรมโอนสิทธิการเช่าที่ราชพัสดุจะสมบูรณ์และถูกต้องตามระเบียบกระทรวงการคลัง **ก็ต่อเมื่อคู่สัญญาโอนและรับโอนได้ทำการจดทะเบียนและลงนามในเอกสารต่อหน้าเจ้าหน้าที่ ณ สำนักงานธนารักษ์พื้นที่ที่ที่ดินตั้งอยู่เท่านั้น** ระบบออนไลน์ TRD-LEX จัดทำขึ้นเพื่อช่วยอำนวยความสะดวกในการจับคู่ติดต่อเจรจา ประเมินค่าธรรมเนียมโอน และจัดพิมพ์แบบคำขอโอนสิทธิ์ล่วงหน้า (ท.บ. ๙) เท่านั้น
              </p>
            </div>
          </div>

          <div className="border-t border-[#1E2E4A]/80 pt-3.5 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 text-xs font-mono">
            <div className="flex flex-wrap gap-4 text-slate-400">
              <a href="https://www.treasury.go.th" target="_blank" rel="noopener noreferrer" className="hover:text-trd-secondary transition-colors font-bold underline flex items-center gap-1 font-sans">
                📕 ระเบียบการโอนสิทธิ์การเช่า
              </a>
              <a href="#guide" className="hover:text-trd-secondary transition-colors font-bold underline flex items-center gap-1 font-sans">
                📘 คู่มือการใช้งานระบบ
              </a>
              <a href="#support" className="hover:text-trd-secondary transition-colors font-bold underline flex items-center gap-1 font-sans">
                📞 ติดต่อเจ้าหน้าที่กองบริหารที่ราชพัสดุ
              </a>
            </div>
            <div className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">
              ระบบเช่าที่ราชพัสดุออนไลน์ · TRD-LEX v1.5
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
