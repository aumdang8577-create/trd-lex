"use client";

import { useEffect, useState, useMemo, useRef, useCallback } from "react";
import placesData from "../../../../../data/Places_GeoJSON.json";

// ===========================
// TypeScript Interfaces
// ===========================

export interface PlaceAttributes {
  FID: number;
  Type: string;
  Name: string;
  Latitude: number;
  Longitude: number;
}

export interface PlaceFeature {
  attributes: PlaceAttributes;
  geometry?: {
    x?: number;
    y?: number;
  };
}

export interface PlacesGeoJSONData {
  displayFieldName?: string;
  fieldAliases?: Record<string, string>;
  geometryType?: string;
  features: PlaceFeature[];
}

export interface PlacesMapProps {
  /** Optional custom GeoJSON data. Defaults to data/Places_GeoJSON.json */
  data?: PlacesGeoJSONData;
  /** Default map center [latitude, longitude]. Defaults to Udon Thani center */
  center?: [number, number];
  /** Default zoom level (1-18) */
  zoom?: number;
  /** Custom container class names */
  className?: string;
  /** Initial polygon radius in meters (default: 50m) */
  initialRadius?: number;
}

/**
 * Calculates a simulated regular polygon (4 or 8 vertices) around a center point (Lat, Lng)
 * converting distance in meters into accurate Lat/Lng coordinates.
 */
export function createSimulatedPolygon(
  lat: number,
  lng: number,
  radiusInMeters: number,
  sides: number = 8
): { lat: number; lng: number }[] {
  const coords: { lat: number; lng: number }[] = [];
  const latRad = (lat * Math.PI) / 180;

  const metersPerDegreeLat = 111320;
  const metersPerDegreeLng = 111320 * Math.cos(latRad);

  for (let i = 0; i < sides; i++) {
    const angle = (i * 2 * Math.PI) / sides;
    const deltaLat = (radiusInMeters * Math.cos(angle)) / metersPerDegreeLat;
    const deltaLng = (radiusInMeters * Math.sin(angle)) / metersPerDegreeLng;

    coords.push({
      lat: lat + deltaLat,
      lng: lng + deltaLng,
    });
  }

  return coords;
}

// Color & Icon Registry per Category
const CATEGORY_CONFIG: Record<string, { icon: string; bg: string; text: string; border: string; fillColor: string }> = {
  "ปั๊มน้ำมัน": { icon: "⛽", bg: "bg-amber-950/80", text: "text-amber-300", border: "border-amber-500/40", fillColor: "#EF4444" },
  "สถานีชาร์จไฟฟ้ายานพาหนะ": { icon: "⚡", bg: "bg-emerald-950/80", text: "text-emerald-300", border: "border-emerald-500/40", fillColor: "#10B981" },
  "ร้านสะดวกซื้อ": { icon: "🏪", bg: "bg-purple-950/80", text: "text-purple-300", border: "border-purple-500/40", fillColor: "#8B5CF6" },
  "ธนาคาร": { icon: "🏦", bg: "bg-orange-950/80", text: "text-orange-300", border: "border-orange-500/40", fillColor: "#F97316" },
  "โรงพยาบาล": { icon: "🏥", bg: "bg-amber-950/80", text: "text-amber-300", border: "border-amber-500/40", fillColor: "#F59E0B" },
  "สถานศึกษา": { icon: "🎓", bg: "bg-blue-950/80", text: "text-blue-300", border: "border-blue-500/40", fillColor: "#3B82F6" },
  "โรงแรม/ที่พัก": { icon: "🏨", bg: "bg-cyan-950/80", text: "text-cyan-300", border: "border-cyan-500/40", fillColor: "#06B6D4" },
  "ห้างสรรพสินค้า": { icon: "🛒", bg: "bg-fuchsia-950/80", text: "text-fuchsia-300", border: "border-fuchsia-500/40", fillColor: "#EC4899" },
  "ตลาดสด": { icon: "🧺", bg: "bg-pink-950/80", text: "text-pink-300", border: "border-pink-500/40", fillColor: "#EC4899" },
  "ร้านอาหาร/เครื่องดื่ม": { icon: "🍽️", bg: "bg-yellow-950/80", text: "text-yellow-300", border: "border-yellow-500/40", fillColor: "#EAB308" },
  "สถานที่ราชการ": { icon: "🏛️", bg: "bg-slate-900/90", text: "text-slate-300", border: "border-slate-500/40", fillColor: "#64748B" },
  "สวนสาธารณะ": { icon: "🌳", bg: "bg-teal-950/80", text: "text-teal-300", border: "border-teal-500/40", fillColor: "#14B8A6" },
  "สถานที่ท่องเที่ยว": { icon: "🎡", bg: "bg-rose-950/80", text: "text-rose-300", border: "border-rose-500/40", fillColor: "#F43F5E" },
};

const DEFAULT_CATEGORY = { icon: "📍", bg: "bg-slate-900/80", text: "text-slate-300", border: "border-slate-600/40", fillColor: "#38BDF8" };

export default function PlacesMap({
  data = placesData as PlacesGeoJSONData,
  center = [17.4065, 102.7905],
  zoom = 13,
  className = "",
  initialRadius = 50,
}: PlacesMapProps) {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);
  const layerGroupRef = useRef<any>(null);

  // States
  const [polygonRadius, setPolygonRadius] = useState<number>(initialRadius);
  const [polygonShape, setPolygonShape] = useState<number>(8); // 4 or 8 sides
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [showFilterDropdown, setShowFilterDropdown] = useState<boolean>(false);
  const [isMapLoaded, setIsMapLoaded] = useState<boolean>(false);

  // Extract unique place categories
  const allCategories = useMemo(() => {
    const set = new Set<string>();
    data.features.forEach((f) => {
      if (f.attributes?.Type) set.add(f.attributes.Type.trim());
    });
    return Array.from(set);
  }, [data]);

  // Toggle single category in multi-select filter
  const toggleCategory = useCallback((cat: string) => {
    setSelectedCategories((prev) =>
      prev.includes(cat) ? prev.filter((c) => c !== cat) : [...prev, cat]
    );
  }, []);

  // Select/Clear All
  const clearAllCategories = useCallback(() => setSelectedCategories([]), []);

  // Filter features efficiently with useMemo
  const filteredFeatures = useMemo(() => {
    return data.features.filter((f) => {
      const typeMatch =
        selectedCategories.length === 0 || selectedCategories.includes(f.attributes.Type);
      const searchMatch =
        !searchQuery ||
        f.attributes.Name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        f.attributes.Type?.toLowerCase().includes(searchQuery.toLowerCase());
      return typeMatch && searchMatch && f.attributes.Latitude && f.attributes.Longitude;
    });
  }, [data, selectedCategories, searchQuery]);

  // Initialize Map Instance (Only ONCE on mount)
  useEffect(() => {
    if (!mapContainerRef.current || mapInstanceRef.current) return;

    let isMounted = true;

    import("leaflet").then((L) => {
      if (!isMounted || !mapContainerRef.current) return;

      delete (L.Icon.Default.prototype as any)._getIconUrl;
      L.Icon.Default.mergeOptions({
        iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
        iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
        shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
      });

      const map = L.map(mapContainerRef.current, {
        center,
        zoom,
        zoomControl: false,
      });

      L.tileLayer("https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png", {
        attribution: '&copy; <a href="https://carto.com/">CARTO</a>',
        subdomains: "abcd",
        maxZoom: 19,
      }).addTo(map);

      L.control.zoom({ position: "bottomright" }).addTo(map);

      const layerGroup = L.layerGroup().addTo(map);

      mapInstanceRef.current = map;
      layerGroupRef.current = layerGroup;
      setIsMapLoaded(true);
    });

    return () => {
      isMounted = false;
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, [center, zoom]);

  // High-Performance Layer Update (Only clears & updates layerGroup without re-initializing map)
  useEffect(() => {
    if (!mapInstanceRef.current || !layerGroupRef.current) return;

    import("leaflet").then((L) => {
      const layerGroup = layerGroupRef.current;
      layerGroup.clearLayers();

      filteredFeatures.forEach((feature) => {
        const { Name, Type, Latitude, Longitude, FID } = feature.attributes;
        const config = CATEGORY_CONFIG[Type] || DEFAULT_CATEGORY;
        const displayName = Name && Name.trim() !== "" ? Name : `${Type} (ไม่ระบุชื่อ)`;

        // 1. Polygon Layer
        const googleCoords = createSimulatedPolygon(Latitude, Longitude, polygonRadius, polygonShape);
        const leafletCoords: [number, number][] = googleCoords.map((c) => [c.lat, c.lng]);

        const polygon = L.polygon(leafletCoords, {
          color: config.fillColor,
          weight: 2,
          fillColor: config.fillColor,
          fillOpacity: 0.3,
          dashArray: "4, 4",
        });

        // 2. Custom Marker Icon
        const customIcon = L.divIcon({
          className: "custom-leaflet-marker",
          html: `
            <div class="flex items-center gap-1.5 bg-[#0F1A30]/95 backdrop-blur-md border border-[#1E2E4A] hover:border-trd-secondary text-white font-mono text-[11px] px-2.5 py-1 rounded-full shadow-lg transition-transform transform hover:scale-105 cursor-pointer">
              <span class="text-sm">${config.icon}</span>
              <span class="font-bold tracking-tight max-w-[110px] truncate">${displayName}</span>
            </div>
          `,
          iconSize: [130, 30],
          iconAnchor: [65, 15],
        });

        const marker = L.marker([Latitude, Longitude], { icon: customIcon });

        // Popup Content
        const popupContent = `
          <div class="font-sans text-trd-midnight p-1 min-w-[240px]">
            <div class="flex items-center justify-between mb-2">
              <span class="px-2 py-0.5 text-[10px] font-mono font-bold uppercase rounded-md ${config.bg} ${config.text} border ${config.border}">
                ${config.icon} ${Type}
              </span>
              <span class="text-[9px] font-mono text-slate-400">#${FID}</span>
            </div>
            <h4 class="font-black text-sm text-slate-900 leading-tight mb-2">
              ${displayName}
            </h4>
            <div class="text-[10px] font-mono text-slate-600 space-y-1 bg-slate-50 p-2 rounded-lg border border-slate-200 mb-3">
              <div>📐 รัศมีพื้นที่: <strong style="color: ${config.fillColor};">${polygonRadius} เมตร (${polygonShape} เหลี่ยม)</strong></div>
              <div>📍 พิกัด: <strong>${Latitude.toFixed(5)}, ${Longitude.toFixed(5)}</strong></div>
            </div>
            <a
              href="https://www.google.com/maps/dir/?api=1&destination=${Latitude},${Longitude}"
              target="_blank"
              rel="noopener noreferrer"
              class="inline-flex items-center justify-center gap-1.5 w-full bg-[#0F1A30] hover:bg-trd-secondary text-trd-secondary hover:text-[#0F1A30] font-mono font-bold text-[10px] uppercase tracking-wider py-1.5 px-3 rounded-lg transition-colors text-center"
            >
              🚀 นำทางด้วย Google Maps
            </a>
          </div>
        `;

        polygon.bindPopup(popupContent, { maxWidth: 280 });
        marker.bindPopup(popupContent, { maxWidth: 280 });

        layerGroup.addLayer(polygon);
        layerGroup.addLayer(marker);
      });
    });
  }, [filteredFeatures, polygonRadius, polygonShape]);

  return (
    <div className={`relative h-[620px] w-full bg-[#070D1A] border border-[#1E2E4A] rounded-2xl overflow-hidden shadow-2xl ${className}`}>
      
      {/* ------------------------------------------------------------- */}
      {/* Floating Glassmorphism Controls Panel (Absolute Top Layer) */}
      {/* ------------------------------------------------------------- */}
      <div className="absolute top-4 left-4 right-4 z-20 pointer-events-none flex flex-col sm:flex-row gap-3 items-start justify-between">
        
        {/* Left Side: Real-time Radius Slider & Shape Controls */}
        <div className="pointer-events-auto bg-[#0F1A30]/90 backdrop-blur-md border border-[#1E2E4A] p-3.5 rounded-2xl shadow-2xl flex flex-col gap-2.5 max-w-sm text-white font-mono">
          
          {/* Header Title */}
          <div className="flex items-center justify-between gap-2 border-b border-[#1E2E4A] pb-2">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-trd-secondary animate-pulse" />
              <span className="text-xs font-black tracking-wider uppercase text-white">
                ตัวควบคุมขนาดรัศมีพื้นที่ (Radius)
              </span>
            </div>
            <span className="text-[10px] bg-[#070D1A] text-trd-secondary border border-[#1E2E4A] px-2 py-0.5 rounded-full font-bold">
              {filteredFeatures.length} รายการ
            </span>
          </div>

          {/* Real-time Slider (10m - 200m) */}
          <div className="flex items-center gap-3">
            <span className="text-[10px] text-slate-400">รัศมี:</span>
            <input
              type="range"
              min={10}
              max={200}
              step={5}
              value={polygonRadius}
              onChange={(e) => setPolygonRadius(Number(e.target.value))}
              className="w-full accent-trd-secondary cursor-pointer h-1.5 bg-[#070D1A] rounded-lg"
            />
            <span className="text-xs font-black text-trd-secondary min-w-[45px] text-right">
              {polygonRadius}m
            </span>
          </div>

          {/* Shape Vertices Selector */}
          <div className="flex items-center justify-between text-[10px] pt-1 border-t border-[#1E2E4A]/60">
            <span className="text-slate-400">รูปแบบรูปทรง:</span>
            <div className="flex items-center gap-1">
              <button
                onClick={() => setPolygonShape(4)}
                className={`px-2.5 py-1 rounded-lg font-bold transition-all ${
                  polygonShape === 4
                    ? "bg-trd-secondary text-[#0F1A30] font-black"
                    : "bg-[#070D1A] text-slate-400 border border-[#1E2E4A] hover:text-white"
                }`}
              >
                4 มุม (สี่เหลี่ยม)
              </button>
              <button
                onClick={() => setPolygonShape(8)}
                className={`px-2.5 py-1 rounded-lg font-bold transition-all ${
                  polygonShape === 8
                    ? "bg-trd-secondary text-[#0F1A30] font-black"
                    : "bg-[#070D1A] text-slate-400 border border-[#1E2E4A] hover:text-white"
                }`}
              >
                8 มุม (แปดเหลี่ยม)
              </button>
            </div>
          </div>
        </div>

        {/* Right Side: Multi-Select Category Filter Dropdown & Search */}
        <div className="pointer-events-auto flex flex-col sm:flex-row items-end sm:items-center gap-2">
          
          {/* Search Box */}
          <div className="relative">
            <input
              type="text"
              placeholder="ค้นหาชื่อสถานที่..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-[#0F1A30]/90 backdrop-blur-md border border-[#1E2E4A] focus:border-trd-secondary text-white font-sans text-xs px-3.5 py-2.5 rounded-xl outline-none shadow-2xl placeholder:text-slate-500 w-48 sm:w-56"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white text-xs"
              >
                ✕
              </button>
            )}
          </div>

          {/* Multi-Select Category Filter Button */}
          <div className="relative">
            <button
              onClick={() => setShowFilterDropdown(!showFilterDropdown)}
              className="bg-[#0F1A30]/90 backdrop-blur-md border border-[#1E2E4A] hover:border-trd-secondary text-white font-mono text-xs font-bold px-3.5 py-2.5 rounded-xl shadow-2xl flex items-center gap-2 transition-all active:scale-95"
            >
              <span>🎯 ตัวกรองประเภท ({selectedCategories.length === 0 ? "ทั้งหมด" : selectedCategories.length})</span>
              <svg className={`w-3.5 h-3.5 transition-transform ${showFilterDropdown ? "rotate-180" : ""}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>

            {/* Checkbox Popover Menu */}
            {showFilterDropdown && (
              <div className="absolute right-0 mt-2 w-64 bg-[#0F1A30]/95 backdrop-blur-xl border border-[#1E2E4A] p-3 rounded-2xl shadow-2xl z-30 space-y-2 max-h-80 overflow-y-auto font-mono text-xs text-white">
                <div className="flex items-center justify-between pb-2 border-b border-[#1E2E4A]">
                  <span className="text-[10px] text-slate-400 uppercase tracking-widest font-bold">เลือกประเภทที่ต้องการ</span>
                  {selectedCategories.length > 0 && (
                    <button
                      onClick={clearAllCategories}
                      className="text-[10px] text-trd-secondary hover:underline"
                    >
                      ล้างทั้งหมด
                    </button>
                  )}
                </div>

                <div className="space-y-1.5 pt-1">
                  {allCategories.map((cat) => {
                    const config = CATEGORY_CONFIG[cat] || DEFAULT_CATEGORY;
                    const isChecked = selectedCategories.includes(cat);
                    const count = data.features.filter((f) => f.attributes.Type === cat).length;

                    return (
                      <label
                        key={cat}
                        onClick={() => toggleCategory(cat)}
                        className={`flex items-center justify-between p-2 rounded-xl border transition-all cursor-pointer ${
                          isChecked
                            ? "bg-trd-secondary/15 border-trd-secondary text-white font-bold"
                            : "bg-[#070D1A]/60 border-[#1E2E4A] text-slate-400 hover:text-white"
                        }`}
                      >
                        <div className="flex items-center gap-2 truncate">
                          <input
                            type="checkbox"
                            checked={isChecked}
                            onChange={() => {}}
                            className="accent-trd-secondary rounded cursor-pointer"
                          />
                          <span className="text-sm">{config.icon}</span>
                          <span className="text-[11px] truncate">{cat}</span>
                        </div>
                        <span className="text-[9px] text-slate-500 font-mono">({count})</span>
                      </label>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

        </div>
      </div>

      {/* Leaflet Canvas Map */}
      <div className="relative h-full w-full bg-[#070D1A]">
        <div ref={mapContainerRef} className="absolute inset-0 z-0 h-full w-full" />

        {!isMapLoaded && (
          <div className="absolute inset-0 z-10 bg-[#070D1A] flex flex-col items-center justify-center gap-3">
            <div className="w-8 h-8 border-2 border-trd-secondary border-t-transparent rounded-full animate-spin" />
            <span className="text-slate-400 text-xs font-mono uppercase tracking-widest">
              [ กำลังโหลดแผนที่และประมวลผล GIS Polygon... ]
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
