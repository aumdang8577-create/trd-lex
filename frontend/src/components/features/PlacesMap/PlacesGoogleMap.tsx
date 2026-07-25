"use client";

import { useEffect, useRef, useState, useMemo, useCallback } from "react";
import placesData from "../../../../../data/Places_GeoJSON.json";
import { createSimulatedPolygon } from "./PlacesMap";

// ===========================
// TypeScript Interfaces & Types
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
}

export interface PlacesGeoJSONData {
  features: PlaceFeature[];
}

export interface PlacesGoogleMapProps {
  data?: PlacesGeoJSONData;
  center?: { lat: number; lng: number };
  zoom?: number;
  className?: string;
  initialRadius?: number;
}

const DEFAULT_KEY = "AIzaSyBEV4UG9u7AyYNUc7Ty_SDke8MWi8YDJgE";

/**
 * Returns distinct Hex color string based on place type.
 */
export function getColorByType(type: string): string {
  const normalized = type ? type.trim() : "";

  if (normalized.includes("ปั๊มน้ำมัน")) return "#EF4444"; // สีแดง Red
  if (normalized.includes("โรงพยาบาล")) return "#F59E0B"; // สีเหลือง Amber/Yellow
  if (
    normalized.includes("สถานศึกษา") ||
    normalized.includes("โรงเรียน") ||
    normalized.includes("วิทยาลัย") ||
    normalized.includes("มหาวิทยาลัย")
  ) {
    return "#3B82F6"; // สีฟ้า Blue
  }
  if (normalized.includes("สถานีชาร์จไฟฟ้ายานพาหนะ")) return "#10B981"; // สีเขียว Emerald
  if (normalized.includes("ร้านสะดวกซื้อ")) return "#8B5CF6"; // สีม่วง Purple
  if (normalized.includes("ธนาคาร")) return "#F97316"; // สีส้ม Orange
  if (normalized.includes("ห้างสรรพสินค้า") || normalized.includes("ตลาดสด")) return "#EC4899"; // สีชมพู Pink
  if (normalized.includes("โรงแรม") || normalized.includes("ที่พัก")) return "#06B6D4"; // สีฟ้าอมเขียว Cyan
  if (normalized.includes("สถานที่ราชการ")) return "#64748B"; // สีเทาฟ้า Slate

  return "#38BDF8"; // Default Sky Blue
}

export default function PlacesGoogleMap({
  data = placesData as PlacesGeoJSONData,
  center = { lat: 17.4065, lng: 102.7905 },
  zoom = 13,
  className = "",
  initialRadius = 50,
}: PlacesGoogleMapProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const googleMapRef = useRef<any>(null);
  const activePolygonsRef = useRef<any[]>([]);
  const activeMarkersRef = useRef<any[]>([]);
  const infoWindowRef = useRef<any>(null);

  const [isLoaded, setIsLoaded] = useState<boolean>(false);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [polygonRadius, setPolygonRadius] = useState<number>(initialRadius);
  const [polygonShape, setPolygonShape] = useState<number>(8); // 4 = square, 8 = octagon
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [showFilterDropdown, setShowFilterDropdown] = useState<boolean>(false);

  // Extract all unique place categories
  const categories = useMemo(() => {
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

  // Filter features
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

  // Load Google Maps Script
  useEffect(() => {
    const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || DEFAULT_KEY;

    if (typeof window !== "undefined" && window.google?.maps) {
      setIsLoaded(true);
      return;
    }

    const scriptId = "google-maps-places-script";
    const existingScript = document.getElementById(scriptId);
    if (existingScript) {
      existingScript.addEventListener("load", () => setIsLoaded(true));
      return;
    }

    const script = document.createElement("script");
    script.id = scriptId;
    script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places`;
    script.async = true;
    script.defer = true;

    script.onload = () => setIsLoaded(true);
    script.onerror = () => setLoadError("Failed to load Google Maps script.");

    document.head.appendChild(script);
  }, []);

  // Initialize Map instance
  useEffect(() => {
    if (!isLoaded || !mapRef.current || googleMapRef.current) return;

    const mapOptions: any = {
      center,
      zoom,
      mapTypeId: "roadmap",
      disableDefaultUI: true,
      zoomControl: true,
      zoomControlOptions: { position: window.google.maps.ControlPosition.RIGHT_BOTTOM },
      styles: [
        { elementType: "geometry", stylers: [{ color: "#0F1A30" }] },
        { elementType: "labels.text.stroke", stylers: [{ color: "#070D1A" }] },
        { elementType: "labels.text.fill", stylers: [{ color: "#94A3B8" }] },
        { featureType: "road", elementType: "geometry", stylers: [{ color: "#1E2E4A" }] },
        { featureType: "water", elementType: "geometry", stylers: [{ color: "#0B1528" }] },
      ],
    };

    googleMapRef.current = new window.google.maps.Map(mapRef.current, mapOptions);
    infoWindowRef.current = new window.google.maps.InfoWindow();
  }, [isLoaded, center, zoom]);

  // High performance update for Polygons & Markers
  useEffect(() => {
    if (!isLoaded || !googleMapRef.current) return;

    const map = googleMapRef.current;

    // Clear existing polygons & markers
    activePolygonsRef.current.forEach((poly) => poly.setMap(null));
    activeMarkersRef.current.forEach((marker) => marker.setMap(null));
    activePolygonsRef.current = [];
    activeMarkersRef.current = [];

    filteredFeatures.forEach((feature) => {
      const { Name, Type, Latitude, Longitude, FID } = feature.attributes;
      const hexColor = getColorByType(Type);
      const displayName = Name && Name.trim() !== "" ? Name : `${Type} (ไม่ระบุชื่อ)`;

      // 1. Calculate polygon paths
      const polygonPaths = createSimulatedPolygon(Latitude, Longitude, polygonRadius, polygonShape);

      // 2. Instantiate Polygon
      const googlePolygon = new window.google.maps.Polygon({
        paths: polygonPaths,
        strokeColor: hexColor,
        strokeOpacity: 0.9,
        strokeWeight: 2,
        fillColor: hexColor,
        fillOpacity: 0.3,
        map,
      });

      // 3. Instantiate Marker
      const marker = new window.google.maps.Marker({
        position: { lat: Latitude, lng: Longitude },
        map,
        title: displayName,
      });

      const infoWindowContent = `
        <div style="font-family: sans-serif; padding: 6px; min-width: 220px; color: #0F1A30;">
          <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 6px;">
            <span style="background-color: ${hexColor}; color: #ffffff; padding: 2px 8px; border-radius: 6px; font-size: 11px; font-weight: bold;">
              ${Type}
            </span>
            <span style="font-size: 10px; color: #64748B; font-family: monospace;">#${FID}</span>
          </div>
          <h4 style="color: #0F1A30; font-weight: 800; font-size: 14px; margin: 0 0 8px 0;">
            ${displayName}
          </h4>
          <div style="font-size: 11px; color: #475569; background-color: #F8FAFC; padding: 8px; border-radius: 8px; border: 1px solid #E2E8F0; margin-bottom: 8px;">
            <div>📐 รัศมีพื้นที่จำลอง: <strong style="color: ${hexColor};">${polygonRadius} เมตร (${polygonShape} เหลี่ยม)</strong></div>
            <div>📍 พิกัด: <strong>${Latitude.toFixed(5)}, ${Longitude.toFixed(5)}</strong></div>
          </div>
          <a href="https://www.google.com/maps/dir/?api=1&destination=${Latitude},${Longitude}" target="_blank" style="display: block; text-align: center; background-color: #0F1A30; color: #10B981; font-size: 11px; font-weight: bold; text-decoration: none; padding: 6px 12px; border-radius: 6px;">
            🚀 นำทางด้วย Google Maps
          </a>
        </div>
      `;

      const showInfoWindow = (event: any) => {
        const anchorPos = event.latLng ? event.latLng : { lat: Latitude, lng: Longitude };
        infoWindowRef.current.setContent(infoWindowContent);
        infoWindowRef.current.setPosition(anchorPos);
        infoWindowRef.current.open(map);
      };

      googlePolygon.addListener("click", showInfoWindow);
      marker.addListener("click", showInfoWindow);

      activePolygonsRef.current.push(googlePolygon);
      activeMarkersRef.current.push(marker);
    });
  }, [isLoaded, filteredFeatures, polygonRadius, polygonShape]);

  return (
    <div className={`relative h-[620px] w-full bg-[#070D1A] border border-[#1E2E4A] rounded-2xl overflow-hidden shadow-2xl ${className}`}>
      
      {/* Floating Controls Overlay */}
      <div className="absolute top-4 left-4 right-4 z-20 pointer-events-none flex flex-col sm:flex-row gap-3 items-start justify-between">
        
        {/* Slider & Shape Panel */}
        <div className="pointer-events-auto bg-[#0F1A30]/90 backdrop-blur-md border border-[#1E2E4A] p-3.5 rounded-2xl shadow-2xl flex flex-col gap-2.5 max-w-sm text-white font-mono">
          <div className="flex items-center justify-between gap-2 border-b border-[#1E2E4A] pb-2">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-xs font-black tracking-wider uppercase text-white">
                Google Maps Polygon Radius Control
              </span>
            </div>
            <span className="text-[10px] bg-[#070D1A] text-emerald-400 border border-[#1E2E4A] px-2 py-0.5 rounded-full font-bold">
              {filteredFeatures.length} รายการ
            </span>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-[10px] text-slate-400">รัศมี:</span>
            <input
              type="range"
              min={10}
              max={200}
              step={5}
              value={polygonRadius}
              onChange={(e) => setPolygonRadius(Number(e.target.value))}
              className="w-full accent-emerald-400 cursor-pointer h-1.5 bg-[#070D1A] rounded-lg"
            />
            <span className="text-xs font-black text-emerald-400 min-w-[45px] text-right">
              {polygonRadius}m
            </span>
          </div>

          <div className="flex items-center justify-between text-[10px] pt-1 border-t border-[#1E2E4A]/60">
            <span className="text-slate-400">รูปทรง:</span>
            <div className="flex items-center gap-1">
              <button
                onClick={() => setPolygonShape(4)}
                className={`px-2.5 py-1 rounded-lg font-bold transition-all ${
                  polygonShape === 4
                    ? "bg-emerald-400 text-[#0F1A30] font-black"
                    : "bg-[#070D1A] text-slate-400 border border-[#1E2E4A] hover:text-white"
                }`}
              >
                4 มุม
              </button>
              <button
                onClick={() => setPolygonShape(8)}
                className={`px-2.5 py-1 rounded-lg font-bold transition-all ${
                  polygonShape === 8
                    ? "bg-emerald-400 text-[#0F1A30] font-black"
                    : "bg-[#070D1A] text-slate-400 hover:text-white"
                }`}
              >
                8 มุม
              </button>
            </div>
          </div>
        </div>

        {/* Multi-Select Category Dropdown & Search */}
        <div className="pointer-events-auto flex flex-col sm:flex-row items-end sm:items-center gap-2">
          
          <div className="relative">
            <input
              type="text"
              placeholder="ค้นหาชื่อสถานที่..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-[#0F1A30]/90 backdrop-blur-md border border-[#1E2E4A] focus:border-emerald-400 text-white font-sans text-xs px-3.5 py-2.5 rounded-xl outline-none shadow-2xl placeholder:text-slate-500 w-48 sm:w-56"
            />
          </div>

          <div className="relative">
            <button
              onClick={() => setShowFilterDropdown(!showFilterDropdown)}
              className="bg-[#0F1A30]/90 backdrop-blur-md border border-[#1E2E4A] hover:border-emerald-400 text-white font-mono text-xs font-bold px-3.5 py-2.5 rounded-xl shadow-2xl flex items-center gap-2 transition-all active:scale-95"
            >
              <span>🎯 กรองประเภท ({selectedCategories.length === 0 ? "ทั้งหมด" : selectedCategories.length})</span>
            </button>

            {showFilterDropdown && (
              <div className="absolute right-0 mt-2 w-64 bg-[#0F1A30]/95 backdrop-blur-xl border border-[#1E2E4A] p-3 rounded-2xl shadow-2xl z-30 space-y-2 max-h-80 overflow-y-auto font-mono text-xs text-white">
                <div className="flex items-center justify-between pb-2 border-b border-[#1E2E4A]">
                  <span className="text-[10px] text-slate-400 uppercase tracking-widest font-bold">เลือกประเภทที่ต้องการ</span>
                  {selectedCategories.length > 0 && (
                    <button
                      onClick={() => setSelectedCategories([])}
                      className="text-[10px] text-emerald-400 hover:underline"
                    >
                      ล้างทั้งหมด
                    </button>
                  )}
                </div>

                <div className="space-y-1.5 pt-1">
                  {categories.map((cat) => {
                    const hex = getColorByType(cat);
                    const isChecked = selectedCategories.includes(cat);
                    const count = data.features.filter((f) => f.attributes.Type === cat).length;

                    return (
                      <label
                        key={cat}
                        onClick={() => toggleCategory(cat)}
                        className={`flex items-center justify-between p-2 rounded-xl border transition-all cursor-pointer ${
                          isChecked
                            ? "bg-emerald-500/15 border-emerald-400 text-white font-bold"
                            : "bg-[#070D1A]/60 border-[#1E2E4A] text-slate-400 hover:text-white"
                        }`}
                      >
                        <div className="flex items-center gap-2 truncate">
                          <input
                            type="checkbox"
                            checked={isChecked}
                            onChange={() => {}}
                            className="accent-emerald-400 cursor-pointer"
                          />
                          <span className="w-2.5 h-2.5 rounded-full inline-block" style={{ backgroundColor: hex }} />
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

      {/* Google Maps Container */}
      <div className="relative h-full w-full bg-[#070D1A]">
        <div ref={mapRef} className="absolute inset-0 z-0 h-full w-full" />

        {loadError && (
          <div className="absolute inset-0 z-10 bg-[#070D1A] flex flex-col items-center justify-center p-6 text-center">
            <span className="text-red-400 font-mono text-xs font-bold mb-2">⚠️ {loadError}</span>
          </div>
        )}

        {!isLoaded && !loadError && (
          <div className="absolute inset-0 z-10 bg-[#070D1A] flex flex-col items-center justify-center gap-3">
            <div className="w-8 h-8 border-2 border-emerald-400 border-t-transparent rounded-full animate-spin" />
            <span className="text-slate-400 text-xs font-mono uppercase tracking-widest">
              [ กำลังเริ่มทำงาน Google Maps... ]
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
