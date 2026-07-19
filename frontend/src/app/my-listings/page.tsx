"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import api from "@/lib/api";
import type { Listing, LeaseContract } from "@/types";

// ──────────────────────────────────────────────
// Mock Fallbacks (ใช้งานกรณีออฟไลน์ / Backend ไม่ได้รัน)
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
  {
    url: "/images/images (19).jpg",
    label: "ที่ดินเปล่า / ธรรมชาติ"
  },
  {
    url: "/images/images (7).jpg",
    label: "อาคารพาณิชย์ / ตึกเมือง"
  },
  {
    url: "/images/images (1).jpg",
    label: "บ้านพักอาศัย / ทรัพย์สินอยู่อาศัย"
  },
  {
    url: "/images/images (13).jpg",
    label: "โรงงาน / คลังสินค้าอุตสาหกรรม"
  }
];

const STATUS_CONFIG = {
  ACTIVE: { label: "เปิดประกาศ", color: "text-emerald-400", bg: "bg-emerald-500/10 border-emerald-500/30", dot: "bg-emerald-400" },
  HIDDEN: { label: "ซ่อนประกาศ", color: "text-amber-400", bg: "bg-amber-500/10 border-amber-500/30", dot: "bg-amber-400" },
  SOLD: { label: "โอนแล้ว", color: "text-slate-400", bg: "bg-slate-500/10 border-slate-500/30", dot: "bg-slate-400" },
};

const fmt = (n: number) =>
  n.toLocaleString("th-TH", { style: "currency", currency: "THB", maximumFractionDigits: 0 });

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("th-TH", { year: "numeric", month: "short", day: "numeric" });
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
            className="flex-1 py-2 px-4 rounded-xl border border-[#1E2E4A] text-xs font-bold text-slate-300 hover:border-slate-500 transition-all cursor-pointer"
          >
            ยกเลิก
          </button>
          <button
            onClick={onConfirm}
            className={`flex-1 py-2 px-4 rounded-xl text-xs font-black uppercase tracking-wider transition-all cursor-pointer ${
              danger
                ? "bg-red-650 text-white hover:bg-red-600"
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
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

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
      <div className="max-w-lg w-full bg-[#0F1A30] border-2 border-trd-secondary/30 rounded-2xl p-6.5 space-y-5 shadow-2xl relative">
        <div className="absolute top-0 left-0 right-0 h-1 bg-gold-gradient"></div>

        <div className="flex justify-between items-start">
          <div>
            <h3 className="text-base font-black text-white uppercase tracking-wider">
              ลงประกาศเสนอขายสิทธิ์
            </h3>
            <p className="text-[11px] text-trd-secondary font-mono tracking-widest uppercase mt-0.5">
              Publish Lease Contract Transfer Listing
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white text-lg font-bold font-mono cursor-pointer"
          >
            ✕
          </button>
        </div>

        {error && (
          <div className="bg-red-500/10 border border-red-500/30 text-red-400 rounded-xl p-3 text-xs flex items-center gap-2">
            <span>⚠️</span> {error}
          </div>
        )}

        {/* Contract summary card */}
        <div className="bg-[#070D1A] rounded-xl border border-[#1E2E4A] p-4.5 space-y-3 font-mono text-xs">
          <span className="text-trd-secondary-dark font-black text-[10px] uppercase tracking-wider block">
            [ ข้อมูลสัญญาอ้างอิงจากกรมธนารักษ์ ]
          </span>
          <div className="grid grid-cols-2 gap-3.5 text-slate-355">
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
            <span className="text-slate-450 font-sans font-bold">ค่าเช่าของหลวงรายปี:</span>
            <span className="text-trd-secondary font-black font-mono">{fmt(annualRent)} / ปี</span>
          </div>
        </div>

        <form onSubmit={handleFormSubmit} className="space-y-4.5">
          {/* 1. Price input */}
          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-slate-300">
              ราคาเสนอโอนสิทธิ์ (บาท) <span className="text-red-400">*</span>
            </label>
            <input
              type="text"
              required
              value={askingPrice}
              onChange={(e) => handlePriceChange(e.target.value)}
              className="w-full bg-[#070D1A] border border-[#1E2E4A] rounded-xl px-4 py-2 text-sm text-white font-bold font-mono focus:outline-none focus:border-trd-secondary"
              placeholder="เช่น 1,500,000"
            />
            <p className="text-xs text-slate-400 leading-relaxed font-medium font-sans">
              💡 <strong>ราคาเสนอโอนสิทธิ์:</strong> คือมูลค่าชดเชยค่าเซ้งสิทธิ์การเช่าที่ตกลงและชำระกันเองภายนอกระหว่างผู้โอนและผู้รับโอน โดยผู้รับโอนจะยังคงมีหน้าที่ชำระค่าธรรมเนียมการโอนหลวงต่างหากประมาณ <strong>{fmt(estimatedGovFee)}</strong> (คำนวณตามระเบียบ ๖ เท่าของค่าเช่ารายปี)
            </p>
          </div>

          {/* 2. Description */}
          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-slate-300">
              คำอธิบาย / รายละเอียดเพิ่มเติมประกาศ
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              className="w-full bg-[#070D1A] border border-[#1E2E4A] rounded-xl px-4 py-2.5 text-xs text-slate-300 focus:outline-none focus:border-trd-secondary resize-none font-sans"
              placeholder="เช่น ใกล้แหล่งความเจริญ, เหมาะสำหรับทำค้าขาย, เดินทางสะดวก, พร้อมสิ่งปลูกสร้าง..."
            />
          </div>

          {/* 3. Image Selection */}
          <div className="space-y-2">
            <label className="block text-xs font-bold text-slate-300">
              เลือกรูปภาพแสดงหน้าประกาศ
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {PRESET_IMAGES.map((img) => (
                <button
                  key={img.url}
                  type="button"
                  onClick={() => setSelectedImg(img.url)}
                  className={`relative h-18 rounded-lg overflow-hidden border-2 transition-all cursor-pointer text-left ${
                    selectedImg === img.url ? "border-trd-secondary ring-1 ring-trd-secondary/40" : "border-[#1E2E4A] hover:border-slate-500"
                  }`}
                >
                  <img src={img.url} alt={img.label} className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-black/45 hover:bg-black/20 transition-all flex items-end p-1">
                    <span className="text-[10px] text-white font-bold leading-tight font-sans line-clamp-1">{img.label}</span>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* 4. Action buttons */}
          <div className="flex gap-2.5 pt-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2.5 rounded-xl border border-[#1E2E4A] text-xs font-bold text-slate-450 hover:border-slate-500 hover:text-white transition-all cursor-pointer font-mono"
            >
              ยกเลิก
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="flex-1 py-2.5 rounded-xl bg-trd-secondary text-[#0F1A30] text-xs font-black uppercase tracking-widest hover:opacity-90 transition-all cursor-pointer disabled:opacity-55 shadow-neon-gold"
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
// Component: MyListingCard (Inline Editable)
// ──────────────────────────────────────────────
function MyListingCard({
  listing,
  onUpdate,
  onDelete,
  onStatusChange,
}: {
  listing: Listing;
  onUpdate: (id: string, data: { asking_price: number; description: string }) => Promise<void>;
  onDelete: (id: string) => Promise<void>;
  onStatusChange: (id: string, status: "ACTIVE" | "HIDDEN" | "SOLD") => Promise<void>;
}) {
  const [isEditing, setIsEditing] = useState(false);
  const [editPrice, setEditPrice] = useState(listing.asking_price.toString());
  const [editDesc, setEditDesc] = useState(listing.description || "");
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [savedFlash, setSavedFlash] = useState(false);

  const statusCfg = STATUS_CONFIG[listing.status as keyof typeof STATUS_CONFIG] || STATUS_CONFIG.ACTIVE;
  const annualRent = listing.contract?.annual_rent || 0;
  const feeGeneral = Math.ceil((annualRent * 6) / 10) * 10;

  const handleSave = async () => {
    const price = parseFloat(editPrice.replace(/,/g, ""));
    if (isNaN(price) || price <= 0) return;
    setIsSaving(true);
    try {
      await onUpdate(listing.id, { asking_price: price, description: editDesc });
      setIsSaving(false);
      setIsEditing(false);
      setSavedFlash(true);
      setTimeout(() => setSavedFlash(false), 2000);
    } catch (e) {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    setEditPrice(listing.asking_price.toString());
    setEditDesc(listing.description || "");
    setIsEditing(false);
  };

  return (
    <>
      {showDeleteConfirm && (
        <ConfirmDialog
          title="⚠ ยืนยันการลบประกาศ"
          message={`คุณต้องการลบประกาศเสนอขายสิทธิ์แปลงทะเบียนที่ราชพัสดุ ${listing.contract?.parcel_number} (${listing.contract?.province}) หรือไม่? ประกาศนี้จะหายไปจากกระดานซื้อขายหลัก`}
          confirmLabel="ยืนยันการลบ"
          onConfirm={async () => {
            setShowDeleteConfirm(false);
            await onDelete(listing.id);
          }}
          onCancel={() => setShowDeleteConfirm(false)}
          danger
        />
      )}

      <div className={`bg-[#0F1A30] border-2 rounded-2xl overflow-hidden transition-all duration-300 ${
        savedFlash ? "border-emerald-500 shadow-[0_0_20px_rgba(52,211,153,0.15)]" : "border-[#1E2E4A] hover:border-[#2E4A6E]"
      }`}>
        
        {/* Image + Status Header */}
        <div className="relative h-36 overflow-hidden">
          <img
            src={listing.image_urls[0] || PRESET_IMAGES[0].url}
            alt="ภาพประกาศ"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0F1A30] via-[#0F1A30]/40 to-transparent" />
          
          {/* Status badge */}
          <div className={`absolute top-3 left-3 inline-flex items-center gap-1.5 px-3 py-1 rounded-full border text-xs font-black uppercase tracking-wider font-mono ${statusCfg.bg} ${statusCfg.color}`}>
            <span className={`w-1.5 h-1.5 rounded-full ${statusCfg.dot} ${listing.status === "ACTIVE" ? "animate-pulse" : ""}`} />
            {statusCfg.label}
          </div>

          {/* Quick status change buttons */}
          <div className="absolute top-3 right-3 flex gap-1">
            {(["ACTIVE", "HIDDEN", "SOLD"] as const).map((s) => (
              <button
                key={s}
                title={STATUS_CONFIG[s].label}
                disabled={listing.status === s}
                onClick={() => onStatusChange(listing.id, s)}
                className={`w-6 h-6 rounded-full border text-[10px] font-black flex items-center justify-center transition-all cursor-pointer ${
                  listing.status === s
                    ? `${STATUS_CONFIG[s].dot} border-transparent text-trd-midnight opacity-100`
                    : "bg-[#070D1A]/80 border-[#1E2E4A] hover:border-slate-400 opacity-60 hover:opacity-100 text-slate-300"
                }`}
              >
                {s === "ACTIVE" ? "●" : s === "HIDDEN" ? "◐" : "✔"}
              </button>
            ))}
          </div>

          {/* Contract Number */}
          <div className="absolute bottom-2 left-3 font-mono text-xs text-trd-secondary font-black uppercase tracking-widest">
            {listing.contract?.contract_number} · {listing.contract?.province}
          </div>
        </div>

        {/* Card Content */}
        <div className="p-4 space-y-3">

          {/* Parcel info row */}
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm font-black text-white">{listing.contract?.district} · {listing.contract?.sub_district}</div>
              <div className="text-xs text-slate-400 font-mono">{listing.contract?.land_area_sqw} ตร.ว. · {listing.contract?.building_type || "ที่ดินเปล่า"}</div>
            </div>
            <div className="text-right">
              <div className="text-[10px] text-slate-500 font-mono uppercase tracking-widest">ค่าเช่าราชการ/ปี</div>
              <div className="text-sm text-trd-secondary font-black font-mono">{fmt(annualRent)}</div>
            </div>
          </div>

          {/* Editable: Price & Description */}
          {isEditing ? (
            <div className="space-y-2.5 border border-[#2E4A6E] rounded-xl p-3 bg-[#070D1A]">
              <div>
                <label className="block text-[10px] text-trd-secondary font-mono font-black uppercase tracking-widest mb-1">ราคาเสนอโอนสิทธิ์ (บาท)</label>
                <input
                  type="text"
                  value={editPrice}
                  onChange={(e) => setEditPrice(e.target.value)}
                  className="w-full bg-[#0F1A30] border border-[#2E4A6E] rounded-lg px-3 py-1.5 text-xs text-white font-bold focus:outline-none focus:border-trd-secondary font-mono"
                  placeholder="เช่น 1,500,000"
                />
              </div>
              <div>
                <label className="block text-[10px] text-trd-secondary font-mono font-black uppercase tracking-widest mb-1">รายละเอียดประกาศ</label>
                <textarea
                  value={editDesc}
                  onChange={(e) => setEditDesc(e.target.value)}
                  rows={3}
                  className="w-full bg-[#0F1A30] border border-[#2E4A6E] rounded-lg px-3 py-1.5 text-xs text-slate-350 focus:outline-none focus:border-trd-secondary resize-none font-sans"
                  placeholder="คำอธิบายเพิ่มเติม..."
                />
              </div>
              <div className="flex gap-2 pt-1">
                <button
                  onClick={handleCancel}
                  className="flex-1 py-1 rounded-lg border border-[#1E2E4A] text-xs font-bold text-slate-450 hover:border-slate-550 transition-all font-mono uppercase cursor-pointer"
                >
                  ยกเลิก
                </button>
                <button
                  onClick={handleSave}
                  disabled={isSaving}
                  className="flex-1 py-1 rounded-lg bg-trd-secondary text-[#0F1A30] text-xs font-black uppercase tracking-wider hover:opacity-90 transition-all font-mono disabled:opacity-60 cursor-pointer"
                >
                  {isSaving ? "บันทึก..." : "✓ บันทึก"}
                </button>
              </div>
            </div>
          ) : (
            <div className="space-y-1.5">
              <div className="flex items-baseline justify-between">
                <div>
                  <div className="text-[10px] text-slate-500 font-mono uppercase tracking-widest">ราคาเสนอโอนสิทธิ์</div>
                  <div className="text-xl font-black text-white font-mono">{fmt(listing.asking_price)}</div>
                </div>
                <div className="text-right">
                  <div className="text-[10px] text-slate-500 font-mono uppercase tracking-widest">ค่าธรรมเนียมโอน (6 เท่า)</div>
                  <div className="text-sm font-black text-trd-secondary-dark font-mono">{fmt(feeGeneral)}</div>
                </div>
              </div>
              {listing.description && (
                <p className="text-xs text-slate-400 leading-relaxed font-sans line-clamp-2">{listing.description}</p>
              )}
            </div>
          )}

          {/* Footer: Date + Actions */}
          <div className="flex items-center justify-between pt-2 border-t border-[#1E2E4A]">
            <div className="text-xs text-slate-500 font-mono">
              ลงประกาศ: {formatDate(listing.createdAt)}
            </div>
            <div className="flex items-center gap-2">
              <Link
                href={`/listings/${listing.id}`}
                className="text-xs text-slate-400 hover:text-trd-secondary transition-colors font-mono font-bold uppercase tracking-widest"
              >
                ดูรายละเอียด →
              </Link>
              {!isEditing && listing.status !== "SOLD" && (
                <button
                  onClick={() => setIsEditing(true)}
                  className="text-xs text-trd-secondary hover:text-trd-secondary-dark transition-colors font-mono font-black uppercase tracking-widest cursor-pointer"
                >
                  ✎ แก้ไข
                </button>
              )}
              <button
                onClick={() => setShowDeleteConfirm(true)}
                className="text-xs text-red-400 hover:text-red-300 transition-colors font-mono font-black uppercase tracking-widest cursor-pointer"
              >
                ✕ ลบ
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

// ──────────────────────────────────────────────
// Main Manager Component
// ──────────────────────────────────────────────
export default function MyListingsPage() {
  const [userRole, setUserRole] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<"LISTINGS" | "CONTRACTS">("LISTINGS");
  const [listings, setListings] = useState<Listing[]>([]);
  const [contracts, setContracts] = useState<LeaseContract[]>([]);
  const [loadingData, setLoadingData] = useState(false);
  const [filter, setFilter] = useState<"ALL" | "ACTIVE" | "HIDDEN" | "SOLD">("ALL");
  const [toast, setToast] = useState<string | null>(null);

  // Modal State
  const [selectedContractForListing, setSelectedContractForListing] = useState<LeaseContract | null>(null);

  // Role simulation change check
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

  // Fetch data (Real Database with Mock fallbacks)
  const loadData = async () => {
    if (userRole !== "SELLER") return;
    setLoadingData(true);
    try {
      // 1. ตรวจสอบและ Auto Login ด้วยเลขประจำตัวจำลอง หากยังไม่มี Token เพื่อความรวดเร็วในการทดสอบสิทธิ์
      if (!api.getToken()) {
        try {
          await api.login({ thaid_id: "1123456789012" });
        } catch (authErr) {
          console.warn("Failed auto login (backend offline?):", authErr);
        }
      }

      // 2. ดึงข้อมูลประกาศของฉันจาก Database
      const fetchedListings = await api.getMyListings();
      setListings(fetchedListings);

      // 3. ดึงข้อมูลสัญญาของฉันจาก Database
      const fetchedContracts = await api.getMyContracts();
      setContracts(fetchedContracts);
    } catch (err) {
      console.warn("Using offline fallback mock values because backend is offline:", err);
      // Fallback
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
  const handleUpdate = async (id: string, data: { asking_price: number; description: string }) => {
    try {
      await api.updateListing(id, data);
      showToast("✓ แก้ไขรายละเอียดประกาศเรียบร้อยแล้ว");
      loadData();
    } catch (err) {
      // Offline fallback
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
      // Offline fallback
      setListings((prev) => prev.filter((l) => l.id !== id));
      showToast("✕ ลบประกาศเรียบร้อยแล้ว (จำลองสิทธิ์ออฟไลน์)");
    }
  };

  // 3. CHANGE Listing Status
  const handleStatusChange = async (id: string, status: "ACTIVE" | "HIDDEN" | "SOLD") => {
    try {
      await api.updateListingStatus(id, { status });
      showToast(`สถานะเปลี่ยนเป็น: ${STATUS_CONFIG[status].label}`);
      loadData();
    } catch (err) {
      // Offline fallback
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
      showToast("📢 ยืนยันการลงประกาศโอนสิทธิ์สำเร็จ!");
      // reload
      await loadData();
      // Switch tab to list
      setActiveTab("LISTINGS");
    } catch (err: any) {
      // If backend fails/offline, simulate creation in frontend state
      console.warn("Backend error during create. Simulating locally:", err);
      
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
      showToast("📢 ยืนยันการลงประกาศโอนสิทธิ์สำเร็จ (จำลองสิทธิ์ออฟไลน์)");
      setActiveTab("LISTINGS");
    }
  };

  // Filtering listings
  const filteredListings = filter === "ALL" ? listings : listings.filter((l) => l.status === filter);

  // Render auth barrier
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
            <h2 className="text-sm font-black text-white uppercase tracking-wider">
              HTTP 403 — Forbidden
            </h2>
            <p className="text-[10px] text-amber-400 font-mono tracking-widest font-bold uppercase">
              [ Seller Role Required ]
            </p>
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

  const counts = {
    ALL: listings.length,
    ACTIVE: listings.filter((l) => l.status === "ACTIVE").length,
    HIDDEN: listings.filter((l) => l.status === "HIDDEN").length,
    SOLD: listings.filter((l) => l.status === "SOLD").length,
  };

  return (
    <div className="bg-trd-bg text-trd-primary min-h-screen py-10 relative">
      
      {/* Toast Alert */}
      {toast && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#0F1A30] border border-trd-secondary/40 text-trd-secondary text-[10.5px] font-mono font-black uppercase tracking-widest px-4 py-2.5 rounded-xl shadow-neon-gold animate-slide-up">
          {toast}
        </div>
      )}

      {/* Create Modal */}
      {selectedContractForListing && (
        <CreateListingModal
          contract={selectedContractForListing}
          onClose={() => setSelectedContractForListing(null)}
          onSubmit={handleCreateListing}
        />
      )}

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Page Header */}
        <div className="border-b-2 border-trd-border pb-6 mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex items-center gap-3">
              <span className="text-3xl">📋</span>
              <div>
                <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
                  จัดการประกาศของฉัน
                </h1>
                <p className="text-xs text-slate-500 font-bold uppercase tracking-widest font-mono mt-1">
                  TRD Lease Exchange // My Listings & Contracts Manager
                </p>
              </div>
            </div>

            {/* TAB SELECTOR */}
            <div className="inline-flex bg-[#070D1A] p-1 border border-[#1E2E4A] rounded-xl self-start sm:self-center font-mono text-xs font-black uppercase tracking-wider">
              <button
                onClick={() => setActiveTab("LISTINGS")}
                className={`px-4 py-2 rounded-lg transition-all cursor-pointer ${
                  activeTab === "LISTINGS" ? "bg-trd-secondary text-[#0F1A30] font-black" : "text-slate-400 hover:text-white"
                }`}
              >
                ประกาศเสนอขายสิทธิ์ ({listings.length})
              </button>
              <button
                onClick={() => setActiveTab("CONTRACTS")}
                className={`px-4 py-2 rounded-lg transition-all cursor-pointer ${
                  activeTab === "CONTRACTS" ? "bg-trd-secondary text-[#0F1A30] font-black" : "text-slate-400 hover:text-white"
                }`}
              >
                สัญญาเช่าของฉัน ({contracts.length})
              </button>
            </div>
          </div>
        </div>

        {/* ────────────────────────────────────────────── */}
        {/* VIEW 1: ACTIVE LISTINGS TAB */}
        {/* ────────────────────────────────────────────── */}
        {activeTab === "LISTINGS" && (
          <div className="space-y-6">
            {/* Filter buttons */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {(["ALL", "ACTIVE", "HIDDEN", "SOLD"] as const).map((s) => (
                <button
                  key={s}
                  onClick={() => setFilter(s)}
                  className={`p-3 rounded-xl border-2 transition-all text-left cursor-pointer ${
                    filter === s
                      ? "border-trd-secondary bg-trd-secondary/10"
                      : "border-[#1E2E4A] bg-[#0F1A30] hover:border-[#2E4A6E]"
                  }`}
                >
                  <div className="text-xl font-black text-white font-mono">{counts[s]}</div>
                  <div className={`text-[10px] font-black uppercase tracking-widest font-mono mt-0.5 ${
                    filter === s ? "text-trd-secondary" : "text-slate-500"
                  }`}>
                    {s === "ALL" ? "ทั้งหมด" : STATUS_CONFIG[s].label}
                  </div>
                </button>
              ))}
            </div>

            {loadingData ? (
              <div className="text-center py-20 animate-pulse text-xs font-mono text-slate-550 uppercase tracking-widest font-black">
                [ ⏳ กำลังโหลดข้อมูลประกาศของคุณจากฐานข้อมูล... ]
              </div>
            ) : filteredListings.length === 0 ? (
              <div className="bg-[#0F1A30] border border-[#1E2E4A] rounded-2xl py-20 text-center space-y-4">
                <div className="text-4xl text-slate-500">📭</div>
                <div className="text-sm font-black text-white uppercase tracking-wider font-mono">
                  No Active Listings Found
                </div>
                <p className="text-xs text-slate-450 max-w-sm mx-auto leading-relaxed">
                  คุณไม่มีประกาศขายที่มีสถานะนี้อยู่ในปัจจุบัน สามารถตรวจสอบรายการสัญญาเช่าทั้งหมดและเริ่มต้นลงประกาศโอนสิทธิ์ใหม่ได้ทันที
                </p>
                <button
                  onClick={() => setActiveTab("CONTRACTS")}
                  className="inline-flex items-center gap-1.5 px-4 py-2 bg-trd-secondary text-[#0F1A30] text-xs font-black uppercase tracking-wider font-mono rounded-xl hover:opacity-90 transition-all cursor-pointer shadow-neon-gold"
                >
                  ดูรายการสัญญาเพื่อลงประกาศ →
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {filteredListings.map((listing) => (
                  <MyListingCard
                    key={listing.id}
                    listing={listing}
                    onUpdate={handleUpdate}
                    onDelete={handleDelete}
                    onStatusChange={handleStatusChange}
                  />
                ))}
              </div>
            )}
          </div>
        )}

        {/* ────────────────────────────────────────────── */}
        {/* VIEW 2: CONTRACTS TAB */}
        {/* ────────────────────────────────────────────── */}
        {activeTab === "CONTRACTS" && (
          <div className="space-y-6">
            <div className="bg-[#070D1A] border border-[#1E2E4A] rounded-xl px-4 py-3 flex items-start gap-2.5">
              <span className="text-trd-secondary text-sm mt-0.5">💡</span>
              <div className="text-xs text-slate-450 leading-normal font-medium font-sans">
                <p className="text-white font-bold mb-0.5">คู่มือการนำสัญญาเช่ามาประกาศเสนอขายสิทธิ์:</p>
                ข้อมูลสัญญาเช่าด้านล่างเป็นข้อมูลโดยตรงจากฐานข้อมูลทะเบียนหลวงของกรมธนารักษ์ (TRD database) คุณสามารถเลือกสัญญาที่ยังไม่ได้ลงทะเบียนเพื่อกรอกข้อมูลการเปลี่ยนมือ เช่น ราคาที่ตกลงภายนอก (Asking Price) และคำอธิบาย เพื่อเปิดตลาดขายให้แก่นักลงทุนภายนอก
              </div>
            </div>

            {loadingData ? (
              <div className="text-center py-20 animate-pulse text-xs font-mono text-slate-550 uppercase tracking-widest font-black">
                [ ⏳ กำลังดึงข้อมูลสัญญาทะเบียนจากกรมธนารักษ์... ]
              </div>
            ) : contracts.length === 0 ? (
              <div className="bg-[#0F1A30] border border-[#1E2E4A] rounded-2xl py-20 text-center space-y-4">
                <div className="text-4xl">📁</div>
                <div className="text-sm font-black text-white uppercase tracking-wider font-mono">
                  No Contracts Registered
                </div>
                <p className="text-xs text-slate-450 max-w-sm mx-auto leading-relaxed">
                  ไม่พบสัญญาเช่าที่จดทะเบียนภายใต้หมายเลขประชาชนของคุณในระบบจำลอง หากคุณมีสัญญาเช่าที่ประสงค์ต้องการโอนสิทธิ์ กรุณาติดต่อนายทะเบียน
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {contracts.map((contract) => {
                  // Check if this contract has any active listing in our listings array
                  const associatedListing = listings.find(
                    (l) => l.contractId === contract.id && l.status !== "SOLD"
                  );
                  
                  return (
                    <div
                      key={contract.id}
                      className={`bg-[#0F1A30] border-2 rounded-2xl p-4.5 space-y-4 flex flex-col justify-between transition-all duration-200 ${
                        associatedListing ? "border-[#1E2E4A] opacity-80" : "border-trd-secondary/30 hover:border-trd-secondary/60"
                      }`}
                    >
                      {/* Top Meta */}
                      <div className="space-y-1.5">
                        <div className="flex justify-between items-start">
                          <span className="text-xs text-slate-550 font-mono font-bold tracking-widest">
                            CONTRACT NUMBER:
                          </span>
                          {associatedListing ? (
                            <span className="px-2 py-0.5 bg-trd-secondary/10 border border-trd-secondary/30 text-trd-secondary text-xs font-mono font-black uppercase tracking-wider rounded">
                              [ ลงประกาศขายแล้ว ]
                            </span>
                          ) : (
                            <span className="px-2 py-0.5 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-mono font-black uppercase tracking-wider rounded">
                              [ สัญญาว่างพร้อมลงขาย ]
                            </span>
                          )}
                        </div>
                        <div className="text-base font-black text-white font-mono uppercase tracking-wider">
                          {contract.contract_number}
                        </div>
                      </div>

                      {/* Info grid */}
                      <div className="grid grid-cols-2 gap-3.5 border-t border-b border-[#1E2E4A] py-3 font-mono text-xs text-slate-350">
                        <div>
                          <span className="text-slate-500 block">เลขทะเบียนราชพัสดุ:</span>
                          <span className="text-white font-bold">{contract.parcel_number}</span>
                        </div>
                        <div>
                          <span className="text-slate-500 block">ขนาดพื้นที่ดิน:</span>
                          <span className="text-white font-bold">{contract.land_area_sqw} ตร.ว.</span>
                        </div>
                        <div>
                          <span className="text-slate-500 block">การใช้ประโยชน์ปัจจุบัน:</span>
                          <span className="text-slate-200">{contract.building_type || "ที่ดินเปล่า"}</span>
                        </div>
                        <div>
                          <span className="text-slate-500 block">พื้นที่เช่าปัจจุบัน:</span>
                          <span className="text-slate-200">{contract.sub_district}, {contract.district}, {contract.province}</span>
                        </div>
                      </div>

                      {/* Footer Actions */}
                      <div className="flex justify-between items-center pt-1.5">
                        <div className="font-mono">
                          <span className="text-xs text-slate-500 uppercase block tracking-wider">ค่าเช่ารายปีราชการ:</span>
                          <span className="text-trd-secondary text-sm font-black">{fmt(contract.annual_rent || 0)}</span>
                        </div>

                        {associatedListing ? (
                          <div className="flex items-center gap-2">
                            <span className="text-xs text-slate-400 font-bold">
                              ราคาขาย: {fmt(associatedListing.asking_price)}
                            </span>
                            <button
                              onClick={() => {
                                setActiveTab("LISTINGS");
                                setFilter("ALL");
                              }}
                              className="text-xs bg-[#070D1A] border border-[#1E2E4A] text-slate-350 font-mono font-black uppercase tracking-widest px-3 py-1.5 rounded-lg hover:border-slate-500 transition-all cursor-pointer"
                            >
                              จัดการประกาศ
                            </button>
                          </div>
                        ) : (
                          <button
                            onClick={() => setSelectedContractForListing(contract)}
                            className="bg-gold-gradient text-[#0F1A30] font-mono text-xs font-black uppercase tracking-widest px-4.5 py-2.5 rounded-xl hover:opacity-90 transition-all cursor-pointer shadow-neon-gold"
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

        {/* Tab Legend */}
        <div className="mt-8 border-t border-[#1E2E4A] pt-4 text-xs font-mono text-slate-500 font-bold uppercase tracking-widest flex justify-between">
          <span>ระบบเชื่อมต่อทะเบียนสารสนเทศภูมิศาสตร์ (GIS) กรมธนารักษ์</span>
          <span>TRD-LEX Engine v1.2</span>
        </div>

      </div>
    </div>
  );
}
