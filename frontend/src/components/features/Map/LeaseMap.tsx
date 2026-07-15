"use client";

import { useEffect, useRef } from "react";
import type { Listing } from "@/types";

interface LeaseMapProps {
  listings?: Listing[];
  center?: [number, number];
  zoom?: number;
  className?: string;
}

/**
 * LeaseMap — Leaflet-based map for displaying treasury land listings.
 *
 * This component dynamically imports Leaflet on the client side only
 * (Leaflet requires `window`). It renders markers for each active listing.
 */
export default function LeaseMap({
  listings = [],
  center = [17.4138, 102.7872], // Upper Northeast (Udon Thani, Khon Kaen, Nong Khai)
  zoom = 8,
  className = "",
}: LeaseMapProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);

  useEffect(() => {
    if (!mapRef.current || mapInstanceRef.current) return;

    // Dynamic import of leaflet (client-side only)
    import("leaflet").then((L) => {
      // Fix default marker icons (Webpack asset issue)
      delete (L.Icon.Default.prototype as Record<string, unknown>)._getIconUrl;
      L.Icon.Default.mergeOptions({
        iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
        iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
        shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
      });

      // Create map instance
      const map = L.map(mapRef.current!, {
        center,
        zoom,
        scrollWheelZoom: true,
      });

      // Add OpenStreetMap tile layer
      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution:
          '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
        maxZoom: 19,
      }).addTo(map);

      // Custom TRD marker icon (Cyber glow circle)
      const trdIcon = L.divIcon({
        className: "trd-map-marker",
        html: `
          <div style="
            background: #3B82F6;
            width: 28px; height: 28px;
            border: 1.5px solid #1E293B;
            box-shadow: 0 0 10px rgba(59, 130, 246, 0.45);
            display: flex; align-items: center; justify-content: center;
            border-radius: 50%;
          ">
            <span style="color: white; font-family: monospace; font-size: 11px; font-weight: 900;">ธน.</span>
          </div>
        `,
        iconSize: [28, 28],
        iconAnchor: [14, 28],
        popupAnchor: [0, -28],
      });

      // Add listing markers
      listings.forEach((listing) => {
        if (listing.contract?.location_lat && listing.contract?.location_lng) {
          const marker = L.marker(
            [listing.contract.location_lat, listing.contract.location_lng],
            { icon: trdIcon }
          ).addTo(map);

          // Popup with listing info
          const priceFormatted = new Intl.NumberFormat("th-TH").format(
            listing.asking_price
          );

          marker.bindPopup(`
            <div style="font-family: sans-serif; min-width: 200px; padding: 4px; color: #0F172A;">
              <div style="font-weight: 900; color: #3B82F6; margin-bottom: 4px; font-size: 12px; text-transform: uppercase;">
                ${listing.contract.province} — ${listing.contract.district}
              </div>
              <div style="font-size: 11px; color: #64748B; margin-bottom: 8px; font-weight: 500;">
                แปลง ${listing.contract.parcel_number} • ${listing.contract.land_area_sqw} ตร.ว.
              </div>
              <div style="font-size: 15px; font-weight: 900; color: #111827; font-family: monospace;">
                ฿${priceFormatted}
              </div>
              <div style="font-size: 9px; color: #10B981; margin-top: 6px; font-weight: 700; font-family: sans-serif; text-transform: uppercase; letter-spacing: 0.05em;">
                [ผ่านการตรวจสอบสิทธิ์ธนารักษ์]
              </div>
            </div>
          `);
        }
      });

      mapInstanceRef.current = map;
    });

    // Cleanup on unmount
    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, [listings, center, zoom]);

  return (
    <>
      {/* Leaflet CSS loaded from CDN */}
      <link
        rel="stylesheet"
        href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css"
        integrity="sha256-p4NxAoJBhIIN+hmNHrzRCf9tD/miZyoHS5obTRR9BMY="
        crossOrigin=""
      />
      <div
        ref={mapRef}
        className={`w-full h-[400px] rounded-2xl overflow-hidden border border-slate-800 shadow-2xl ${className}`}
      />
    </>
  );
}
