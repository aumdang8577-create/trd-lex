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
 * This component dynamically imports Leaflet on the client side only.
 * It renders markers for each active listing and updates them reactively.
 */
export default function LeaseMap({
  listings = [],
  center = [17.4138, 102.7872], // Upper Northeast (Udon Thani, Khon Kaen, Nong Khai)
  zoom = 8,
  className = "",
}: LeaseMapProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const markerGroupRef = useRef<L.FeatureGroup | null>(null);
  const LRef = useRef<any>(null);

  // Helper to draw markers
  const triggerMarkerUpdate = () => {
    const map = mapInstanceRef.current;
    const markerGroup = markerGroupRef.current;
    const L = LRef.current;

    if (!map || !markerGroup || !L) return;

    // Clear old markers
    markerGroup.clearLayers();

    // Custom TRD marker icon (Gold border & Navy circle with cyber glow)
    const trdIcon = L.divIcon({
      className: "trd-map-marker",
      html: `
        <div style="
          background: #0F1A30;
          width: 28px; height: 28px;
          border: 2px solid #D4AF37;
          box-shadow: 0 0 12px rgba(212, 175, 55, 0.7);
          display: flex; align-items: center; justify-content: center;
          border-radius: 50%;
          transition: all 0.2s ease-in-out;
        ">
          <span style="color: #D4AF37; font-family: monospace; font-size: 11px; font-weight: 900;">ธน.</span>
        </div>
      `,
      iconSize: [28, 28],
      iconAnchor: [14, 28],
      popupAnchor: [0, -28],
    });

    // Add new markers
    listings.forEach((listing) => {
      if (listing.contract?.location_lat && listing.contract?.location_lng) {
        const marker = L.marker(
          [listing.contract.location_lat, listing.contract.location_lng],
          { icon: trdIcon }
        );

        const priceFormatted = new Intl.NumberFormat("th-TH").format(
          listing.asking_price
        );

        marker.bindPopup(`
          <div style="font-family: sans-serif; min-width: 200px; padding: 4px;">
            <div style="font-weight: 900; color: #D4AF37; margin-bottom: 4px; font-size: 12px; text-transform: uppercase; font-family: monospace; tracking-wide: 0.05em;">
              ${listing.contract.province} — ${listing.contract.district}
            </div>
            <div style="font-size: 11px; color: #94A3B8; margin-bottom: 8px; font-weight: 500;">
              แปลง ${listing.contract.parcel_number} • ${listing.contract.land_area_sqw} ตร.ว.
            </div>
            <div style="font-size: 15px; font-weight: 900; color: #FFFFFF; font-family: monospace; display: flex; align-items: center; gap: 4px;">
              <span>฿${priceFormatted}</span>
            </div>
            <div style="font-size: 9px; color: #10B981; margin-top: 6px; font-weight: 700; font-family: sans-serif; text-transform: uppercase; letter-spacing: 0.05em;">
              [ผ่านการตรวจสอบสิทธิ์ธนารักษ์]
            </div>
          </div>
        `);

        markerGroup.addLayer(marker);
      }
    });
  };

  // 1. Initialize map once on mount
  useEffect(() => {
    if (!mapRef.current || mapInstanceRef.current) return;

    let active = true;

    // Dynamic import of leaflet (client-side only)
    import("leaflet").then((L) => {
      if (!active) return;
      LRef.current = L;

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

      // Add CartoDB Dark Matter tile layer (Dark/Midnight Map)
      L.tileLayer("https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png", {
        attribution:
          '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
        subdomains: "abcd",
        maxZoom: 20,
      }).addTo(map);

      // Create a layer group to hold markers
      const markerGroup = L.featureGroup().addTo(map);
      markerGroupRef.current = markerGroup;
      mapInstanceRef.current = map;

      // Trigger initial marker draw
      triggerMarkerUpdate();
    });

    return () => {
      active = false;
      if (mapInstanceRef.current) {
        try {
          mapInstanceRef.current.remove();
        } catch (e) {
          console.error("Error removing leaflet map instance:", e);
        }
        mapInstanceRef.current = null;
        markerGroupRef.current = null;
      }
    };
  }, []); // Empty dependencies -> initialize once

  // 2. Handle map view changes (center/zoom) dynamically
  useEffect(() => {
    if (mapInstanceRef.current && center) {
      mapInstanceRef.current.setView(center, zoom);
    }
  }, [center, zoom]);

  // 3. Handle markers update reactively when listings list changes
  useEffect(() => {
    triggerMarkerUpdate();
  }, [listings]);

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
