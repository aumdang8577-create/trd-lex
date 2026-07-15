"use client";

import { useState } from "react";
import Card, { CardContent, CardFooter } from "@/components/ui/Card";
import Badge from "@/components/ui/Badge";
import Button from "@/components/ui/Button";
import FeeBreakdown from "@/components/features/FeeModal/FeeBreakdown";
import type { Listing } from "@/types";

interface PropertyCardProps {
  listing: Listing;
}

export default function PropertyCard({ listing }: PropertyCardProps) {
  const [showFeeModal, setShowFeeModal] = useState(false);

  const priceFormatted = new Intl.NumberFormat("th-TH").format(listing.asking_price);
  const feeFormatted = new Intl.NumberFormat("th-TH").format(listing.estimated_fee);

  const statusMap: Record<string, { variant: "valid" | "pending" | "invalid"; label: string }> = {
    ACTIVE: { variant: "valid", label: "เปิดขาย" },
    SOLD: { variant: "invalid", label: "ขายแล้ว" },
    HIDDEN: { variant: "pending", label: "ซ่อนอยู่" },
  };

  const statusInfo = statusMap[listing.status] || statusMap.ACTIVE;

  // Extract coordinates or mock if not present
  const lat = listing.contract?.location_lat?.toFixed(4) || "13.7563";
  const lng = listing.contract?.location_lng?.toFixed(4) || "100.5018";

  return (
    <>
      <Card className="overflow-hidden group flex flex-col h-full">
        {/* Image & Badge Overlay */}
        <div className="relative h-48 bg-gray-100 overflow-hidden">
          {listing.image_urls?.[0] ? (
            <img
              src={listing.image_urls[0]}
              alt={`แปลงที่ดิน ${listing.contract?.parcel_number}`}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-gray-300">
              <svg className="w-16 h-16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
          )}

          {/* Status Badge */}
          <div className="absolute top-3 left-3">
            <Badge variant={statusInfo.variant}>{statusInfo.label}</Badge>
          </div>

          {/* Verified Badge */}
          <div className="absolute top-3 right-3">
            <span className="trd-verified-badge animate-pulse-gold text-[10px]">
              ✅ Verified by TRD
            </span>
          </div>
        </div>

        {/* Content */}
        <CardContent className="flex-1 flex flex-col justify-between">
          <div>
            {/* Location */}
            <div className="text-sm text-gray-500 mb-1 flex items-center gap-1">
              <span>📍</span>
              {listing.contract?.province} — {listing.contract?.district}
            </div>

            {/* Coordinates / Title */}
            <h4 className="text-base font-semibold text-trd-primary mb-1">
              ที่ราชพัสดุทะเบียนที่: {listing.contract?.parcel_number}
            </h4>

            {/* Coordinate values */}
            <div className="text-xs text-gray-400 mb-3 flex items-center gap-2 bg-gray-50 p-1.5 rounded border border-gray-100 w-fit">
              <span>🌐 พิกัด:</span>
              <span className="font-mono text-gray-600">{lat}, {lng}</span>
            </div>

            {/* Land & Building Area */}
            <div className="text-xs text-gray-500 mb-3 space-y-1">
              <div>📐 ขนาดที่ดิน: {listing.contract?.land_area_sqw} ตร.ว.</div>
              {listing.contract?.building_type && (
                <div className="flex flex-wrap items-center gap-1.5 mt-1 bg-trd-primary/10 text-trd-primary text-[10px] font-semibold px-2 py-0.5 rounded w-fit">
                  <span>🏢 {listing.contract.building_type}</span>
                  {listing.contract.usable_area_sqm && listing.contract.usable_area_sqm > 0 ? (
                    <span>• {listing.contract.usable_area_sqm} ตร.ม.</span>
                  ) : null}
                </div>
              )}
            </div>

            {/* Description */}
            {listing.description && (
              <p className="text-xs text-gray-500 line-clamp-2 mb-4">
                {listing.description}
              </p>
            )}
          </div>

          {/* Price & Fee Estimation */}
          <div className="flex items-end justify-between border-t border-trd-border/30 pt-3">
            <div>
              <div className="text-[10px] text-gray-400">ราคาเสนอขายสิทธิ์</div>
              <div className="text-lg font-bold text-trd-secondary-dark">
                ฿{priceFormatted}
              </div>
            </div>
            <button
              onClick={() => setShowFeeModal(true)}
              className="text-xs text-trd-primary underline underline-offset-2 hover:text-trd-primary-light transition-colors"
            >
              ค่าธรรมเนียม: ฿{feeFormatted}
            </button>
          </div>
        </CardContent>

        <CardFooter className="bg-gray-50/50 flex gap-2">
          <Button variant="primary" size="sm" className="flex-1">
            ดูรายละเอียดสิทธิ์
          </Button>
          <Button variant="ghost" size="sm" title="แสดงบนแผนที่">
            🗺️
          </Button>
        </CardFooter>
      </Card>

      {/* Fee Modal */}
      <FeeBreakdown
        isOpen={showFeeModal}
        onClose={() => setShowFeeModal(false)}
        askingPrice={listing.asking_price}
        estimatedFee={listing.estimated_fee}
      />
    </>
  );
}
