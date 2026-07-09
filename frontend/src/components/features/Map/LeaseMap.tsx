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
  center = [13.7563, 100.5018], // Bangkok
  zoom = 10,
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

      // Custom TRD marker icon
      const trdIcon = L.divIcon({
        className: "trd-map-marker",
        html: `
          <div style="
            background: linear-gradient(135deg, #00594C, #007A68);
            width: 32px; height: 32px;
            border-radius: 50% 50% 50% 0;
            transform: rotate(-45deg);
            border: 3px solid #D4AF37;
            box-shadow: 0 2px 8px rgba(0,0,0,0.3);
            display: flex; align-items: center; justify-content: center;
          ">
            <span style="transform: rotate(45deg); color: white; font-size: 14px; font-weight: bold;">T</span>
          </div>
        `,
        iconSize: [32, 32],
        iconAnchor: [16, 32],
        popupAnchor: [0, -32],
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
            <div style="font-family: 'Noto Sans Thai', sans-serif; min-width: 200px;">
              <div style="font-weight: 600; color: #00594C; margin-bottom: 4px;">
                ${listing.contract.province} — ${listing.contract.district}
              </div>
              <div style="font-size: 12px; color: #6B7280; margin-bottom: 8px;">
                แปลง ${listing.contract.parcel_number} • ${listing.contract.land_area_sqw} ตร.ว.
              </div>
              <div style="font-size: 16px; font-weight: 700; color: #D4AF37;">
                ฿${priceFormatted}
              </div>
              <div style="font-size: 11px; color: #2E7D32; margin-top: 4px;">
                ✅ Verified by TRD
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
        className={`w-full h-[400px] rounded-xl overflow-hidden border border-trd-border/50 shadow-card ${className}`}
      />
    </>
  );
}
