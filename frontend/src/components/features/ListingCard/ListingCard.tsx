"use client";

import { useState } from "react";
import Card, { CardContent, CardFooter } from "@/components/ui/Card";
import Badge from "@/components/ui/Badge";
import Button from "@/components/ui/Button";
import FeeBreakdown from "@/components/features/FeeModal/FeeBreakdown";
import type { Listing } from "@/types";

interface ListingCardProps {
  listing: Listing;
}

export default function ListingCard({ listing }: ListingCardProps) {
  const [showFeeModal, setShowFeeModal] = useState(false);

  const priceFormatted = new Intl.NumberFormat("th-TH").format(listing.asking_price);
  const feeFormatted = new Intl.NumberFormat("th-TH").format(listing.estimated_fee);

  const statusMap: Record<string, { variant: "valid" | "pending" | "invalid"; label: string }> = {
    ACTIVE: { variant: "valid", label: "เปิดขาย" },
    SOLD: { variant: "invalid", label: "ขายแล้ว" },
    HIDDEN: { variant: "pending", label: "ซ่อนอยู่" },
  };

  const statusInfo = statusMap[listing.status] || statusMap.ACTIVE;

  return (
    <>
      <Card className="overflow-hidden">
        {/* Image */}
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
            <span className="trd-verified-badge">
              ✅ Verified
            </span>
          </div>
        </div>

        <CardContent>
          {/* Location */}
          <div className="text-sm text-gray-500 mb-1 flex items-center gap-1">
            <span>📍</span>
            {listing.contract?.province} — {listing.contract?.district}
          </div>

          {/* Parcel Info */}
          <div className="text-xs text-gray-400 mb-3">
            แปลง {listing.contract?.parcel_number} • {listing.contract?.land_area_sqw} ตร.ว.
          </div>

          {/* Description */}
          {listing.description && (
            <p className="text-sm text-gray-600 line-clamp-2 mb-4">
              {listing.description}
            </p>
          )}

          {/* Price */}
          <div className="flex items-end justify-between">
            <div>
              <div className="text-xs text-gray-400">ราคาเสนอขาย</div>
              <div className="text-xl font-bold text-trd-secondary-dark">
                ฿{priceFormatted}
              </div>
            </div>
            <button
              onClick={() => setShowFeeModal(true)}
              className="text-xs text-trd-primary underline underline-offset-2 hover:text-trd-primary-light transition-colors"
            >
              ค่าธรรมเนียม ฿{feeFormatted}
            </button>
          </div>
        </CardContent>

        <CardFooter className="flex gap-2">
          <Button variant="primary" size="sm" className="flex-1">
            ดูรายละเอียด
          </Button>
          <Button variant="ghost" size="sm">
            🗺️
          </Button>
        </CardFooter>
      </Card>

      {/* Fee Breakdown Modal */}
      <FeeBreakdown
        isOpen={showFeeModal}
        onClose={() => setShowFeeModal(false)}
        askingPrice={listing.asking_price}
        estimatedFee={listing.estimated_fee}
      />
    </>
  );
}
