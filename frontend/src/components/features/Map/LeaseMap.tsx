"use client";

import { useEffect, useRef, useState } from "react";
import type { Listing, TreasuryParcelData, PlacePOIData } from "@/types";
import api from "@/lib/api";

declare global {
  interface Window {
    google?: any;
  }
}

interface LeaseMapProps {
  listings?: Listing[];
  parcels?: TreasuryParcelData[];
  places?: PlacePOIData[];
  center?: [number, number];
  zoom?: number;
  className?: string;
  showParcelsDefault?: boolean;
  showPoiPolygonsDefault?: boolean;
}

const DEFAULT_KEY = "AIzaSyBEV4UG9u7AyYNUc7Ty_SDke8MWi8YDJgE";

const POI_CATEGORIES = [
  { id: "all", label: "ทั้งหมด", icon: "🌐" },
  { id: "ร้านสะดวกซื้อ", label: "ร้านสะดวกซื้อ", icon: "🏪" },
  { id: "ปั๊มน้ำมัน", label: "ปั๊มน้ำมัน", icon: "⛽" },
  { id: "ธนาคาร", label: "ธนาคาร", icon: "🏦" },
  { id: "โรงพยาบาล", label: "โรงพยาบาล", icon: "🏥" },
  { id: "สถานศึกษา", label: "สถานศึกษา", icon: "🎓" },
  { id: "โรงแรม/ที่พัก", label: "โรงแรม/ที่พัก", icon: "🏨" },
  { id: "ห้างสรรพสินค้า", label: "ห้าง/ตลาด", icon: "🛒" },
];

export default function LeaseMap({
  listings = [],
  parcels: initialParcels,
  places: initialPlaces,
  center,
  zoom = 13,
  className = "",
  showParcelsDefault = true,
  showPoiPolygonsDefault = true,
}: LeaseMapProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);
  const markersRef = useRef<any[]>([]);
  const polygonRefs = useRef<any[]>([]);
  const poiMarkersRef = useRef<any[]>([]);
  const poiPolygonRefs = useRef<any[]>([]);
  const infoWindowRef = useRef<any>(null);

  const [isLoaded, setIsLoaded] = useState(false);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [parcelsData, setParcelsData] = useState<TreasuryParcelData[]>(initialParcels || []);
  const [placesData, setPlacesData] = useState<PlacePOIData[]>(initialPlaces || []);
  const [activePoiCategory, setActivePoiCategory] = useState<string | null>("all");
  const [showParcels, setShowParcels] = useState(showParcelsDefault);
  const [showPoiPolygons, setShowPoiPolygons] = useState(showPoiPolygonsDefault);

  const lastCenterRef = useRef<[number, number] | null>(null);

  // 1. Script Loader Effect
  useEffect(() => {
    const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || DEFAULT_KEY;

    if (!apiKey) {
      setLoadError("Google Maps API Key is missing.");
      return;
    }

    if (typeof window !== "undefined") {
      (window as any).gm_authFailure = () => {
        setLoadError(
          "ApiNotActivatedMapError: Maps JavaScript API ยังไม่เปิดใช้งาน หรือ API Key ถูกจำกัดสิทธิ์ใน Google Cloud Console"
        );
      };
    }

    if (typeof window !== "undefined" && window.google?.maps) {
      setIsLoaded(true);
      return;
    }

    const existingScript = document.getElementById("google-maps-script");
    if (existingScript) {
      existingScript.addEventListener("load", () => setIsLoaded(true));
      existingScript.addEventListener("error", () =>
        setLoadError("Failed to load Google Maps script.")
      );
      return;
    }

    const script = document.createElement("script");
    script.id = "google-maps-script";
    script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places`;
    script.async = true;
    script.defer = true;

    script.onload = () => setIsLoaded(true);
    script.onerror = () => setLoadError("Failed to load Google Maps script.");

    document.head.appendChild(script);
  }, []);

  // 2. Fetch Parcels and POIs if not provided in props
  useEffect(() => {
    if (!initialParcels || initialParcels.length === 0) {
      api.getParcels()
        .then((data) => {
          if (Array.isArray(data) && data.length > 0) setParcelsData(data);
        })
        .catch((err) => console.error("Error fetching parcels:", err));
    }
  }, [initialParcels]);

  useEffect(() => {
    if (!initialPlaces || initialPlaces.length === 0) {
      api.getPlaces()
        .then((data) => {
          if (Array.isArray(data) && data.length > 0) setPlacesData(data);
        })
        .catch((err) => console.error("Error fetching places:", err));
    }
  }, [initialPlaces]);

  // 3. Initialize Google Map instance
  useEffect(() => {
    if (!isLoaded || !mapRef.current || mapInstanceRef.current) return;

    const defaultCenter = { lat: 17.4063, lng: 102.7898 }; // Udon Thani city center
    const mapCenter = center
      ? { lat: center[0], lng: center[1] }
      : defaultCenter;

    const google = window.google;
    if (!google?.maps) return;

    const map = new google.maps.Map(mapRef.current, {
      center: mapCenter,
      zoom,
      disableDefaultUI: false,
      zoomControl: true,
      mapTypeControl: true,
      streetViewControl: false,
      fullscreenControl: true,
    });

    infoWindowRef.current = new google.maps.InfoWindow();
    mapInstanceRef.current = map;
    lastCenterRef.current = center || [defaultCenter.lat, defaultCenter.lng];

    renderAllLayers();
  }, [isLoaded]);

  // Render Listing Markers
  const renderListings = () => {
    const map = mapInstanceRef.current;
    const google = window.google;
    if (!map || !google?.maps) return;

    markersRef.current.forEach((m) => m.setMap(null));
    markersRef.current = [];

    const svgPin = `data:image/svg+xml;utf8,${encodeURIComponent(`
      <svg width="34" height="42" viewBox="0 0 34 42" fill="none" xmlns="http://www.w3.org/2000/svg">
        <filter id="glow" x="0" y="0" width="34" height="42" filterUnits="userSpaceOnUse">
          <feDropShadow dx="0" dy="0" stdDeviation="3" flood-color="#D4AF37" flood-opacity="0.9"/>
        </filter>
        <g filter="url(#glow)">
          <path d="M17 40 C17 40 31 25 31 16 C31 8.26801 24.732 2 17 2 C9.26801 2 3 8.26801 3 16 C3 25 17 40 17 40 Z" fill="#0F1A30" stroke="#D4AF37" stroke-width="2.5"/>
          <circle cx="17" cy="15" r="9" fill="#0F1A30" stroke="#D4AF37" stroke-width="1.5"/>
          <text x="17" y="18.5" fill="#D4AF37" font-size="9" font-weight="900" font-family="monospace" text-anchor="middle">ธน.</text>
        </g>
      </svg>
    `)}`;

    const icon = {
      url: svgPin,
      scaledSize: new google.maps.Size(34, 42),
      anchor: new google.maps.Point(17, 40),
    };

    listings.forEach((listing) => {
      if (listing.contract?.location_lat && listing.contract?.location_lng) {
        const position = {
          lat: listing.contract.location_lat,
          lng: listing.contract.location_lng,
        };

        const marker = new google.maps.Marker({
          position,
          map,
          title: `${listing.contract.province} — แปลง ${listing.contract.parcel_number}`,
          icon,
          zIndex: 100,
        });

        const priceFormatted = new Intl.NumberFormat("th-TH").format(
          listing.asking_price
        );

        const contentString = `
          <div style="font-family: system-ui, -apple-system, sans-serif; background: #0F1A30; padding: 12px; border-radius: 12px; color: #FFFFFF; border: 1px solid rgba(212, 175, 55, 0.4); box-shadow: 0 10px 25px rgba(0,0,0,0.8); min-width: 220px;">
            <div style="font-weight: 900; color: #D4AF37; margin-bottom: 4px; font-size: 12px; text-transform: uppercase; font-family: monospace; letter-spacing: 0.05em;">
              ${listing.contract.province} — ${listing.contract.district}
            </div>
            <div style="font-size: 11px; color: #94A3B8; margin-bottom: 8px; font-weight: 500;">
              แปลง ${listing.contract.parcel_number} • ${listing.contract.land_area_sqw} ตร.ว.
            </div>
            <div style="font-size: 16px; font-weight: 900; color: #FFFFFF; font-family: monospace; display: flex; align-items: center; margin-bottom: 6px;">
              <span>฿${priceFormatted}</span>
            </div>
            <div style="font-size: 10px; color: #10B981; font-weight: 700; text-transform: uppercase; letter-spacing: 0.05em; background: rgba(16, 185, 129, 0.1); padding: 4px 8px; border-radius: 6px; display: inline-block;">
              ✓ ประกาศพร้อมสิทธิ์เปลี่ยนมือ
            </div>
          </div>
        `;

        marker.addListener("click", () => {
          if (infoWindowRef.current) {
            infoWindowRef.current.setContent(contentString);
            infoWindowRef.current.open(map, marker);
          }
        });

        markersRef.current.push(marker);
      }
    });
  };

  // Render Land Lease Polygons (รูปแปลงเขตเช่า)
  const renderParcels = () => {
    const map = mapInstanceRef.current;
    const google = window.google;
    if (!map || !google?.maps) return;

    polygonRefs.current.forEach((p) => p.setMap(null));
    polygonRefs.current = [];

    if (!showParcels || parcelsData.length === 0) return;

    parcelsData.forEach((parcel) => {
      if (!parcel.geometry || !parcel.geometry.coordinates) return;

      const coords = parcel.geometry.coordinates;
      // Polygon coordinates are [number, number][][] (multiple rings)
      if (!Array.isArray(coords) || coords.length === 0) return;
      const rings = coords as [number, number][][];
      
      const paths = rings[0].map((pt) => {
        // GeoJSON standard stores coordinates as [longitude, latitude]
        // Thailand: Longitude ~ 102°, Latitude ~ 17°
        const raw0 = Number(pt[0]);
        const raw1 = Number(pt[1]);
        const lng = raw0 > raw1 ? raw0 : raw1;
        const lat = raw0 > raw1 ? raw1 : raw0;
        return { lat, lng };
      });

      // Zoning color mapping
      let fillColor = "#3B82F6"; // default blue
      let strokeColor = "#1D4ED8";

      const plan = (parcel.land_plan || "").toLowerCase();
      if (plan.includes("แดง")) {
        fillColor = "#EF4444"; // พาณิชยกรรม Red
        strokeColor = "#B91C1C";
      } else if (plan.includes("เหลือง")) {
        fillColor = "#F59E0B"; // ที่อยู่อาศัย Yellow/Gold
        strokeColor = "#B45309";
      } else if (plan.includes("ม่วง")) {
        fillColor = "#A855F7"; // อุตสาหกรรม Purple
        strokeColor = "#7E22CE";
      } else if (plan.includes("เขียว")) {
        fillColor = "#10B981"; // เกษตรกรรม Green
        strokeColor = "#047857";
      }

      const polygon = new google.maps.Polygon({
        paths,
        strokeColor,
        strokeOpacity: 0.9,
        strokeWeight: 2,
        fillColor,
        fillOpacity: 0.35,
        map,
        zIndex: 10,
      });

      polygon.addListener("mouseover", () => {
        polygon.setOptions({ fillOpacity: 0.65, strokeWeight: 3 });
      });
      polygon.addListener("mouseout", () => {
        polygon.setOptions({ fillOpacity: 0.35, strokeWeight: 2 });
      });

      const rentName = parcel.rent_name || "ผู้เช่าในระบบธนารักษ์";
      const planText = parcel.land_plan || "เขตการใช้ประโยชน์ที่ดินราชพัสดุ";

      const infoContent = `
        <div style="font-family: system-ui, -apple-system, sans-serif; background: #070D1A; padding: 14px; border-radius: 12px; color: #FFFFFF; border: 1.5px solid ${strokeColor}; box-shadow: 0 10px 30px rgba(0,0,0,0.9); max-width: 260px;">
          <div style="display: flex; items-center; justify-content: space-between; margin-bottom: 6px;">
            <span style="font-weight: 900; color: #D4AF37; font-size: 12px; font-family: monospace;">แปลงเลขที่ ${parcel.parcel_number}</span>
            <span style="font-size: 9px; background: rgba(255,255,255,0.1); padding: 2px 6px; border-radius: 4px; color: #E2E8F0; font-family: monospace;">${parcel.status || "ACTIVE"}</span>
          </div>
          <div style="font-size: 13px; font-weight: 800; color: #FFFFFF; margin-bottom: 4px;">
            👤 ${rentName}
          </div>
          <div style="font-size: 10px; color: #94A3B8; margin-bottom: 6px;">
            📍 ${parcel.sub_district} อ.${parcel.district} จ.${parcel.province}
          </div>
          <div style="font-size: 10px; color: #CBD5E1; background: rgba(30, 46, 74, 0.6); padding: 6px; border-radius: 6px; margin-bottom: 6px; border: 1px solid rgba(255,255,255,0.08);">
            📐 เนื้อที่: <b>${parcel.land_area_sqw} ตร.ว.</b> (${parcel.area_rai || 0} ไร่ ${parcel.area_ngan || 0} งาน ${parcel.area_wa || 0} วา)
          </div>
          <div style="font-size: 9px; color: ${fillColor}; font-weight: 700;">
            🏙️ ${planText}
          </div>
        </div>
      `;

      polygon.addListener("click", (e: any) => {
        if (infoWindowRef.current) {
          infoWindowRef.current.setContent(infoContent);
          infoWindowRef.current.setPosition(e.latLng);
          infoWindowRef.current.open(map);
        }
      });

      polygonRefs.current.push(polygon);
    });
  };

  // Helper to extract or generate WGS84 polygon path for a POI place
  const getPoiPolygonPaths = (poi: PlacePOIData) => {
    if (poi.geometry && poi.geometry.coordinates) {
      const coords = poi.geometry.coordinates;
      // Polygon coordinates are [number, number][][] (multiple rings)
      if (Array.isArray(coords) && coords.length > 0) {
        const rings = coords as [number, number][][];
        return rings[0].map((pt) => {
          const raw0 = Number(pt[0]);
          const raw1 = Number(pt[1]);
          const lng = raw0 > raw1 ? raw0 : raw1;
          const lat = raw0 > raw1 ? raw1 : raw0;
          return { lat, lng };
        });
      }
    }
    // Dynamic client fallback: generate 12-point circular polygon around lat/lng
    if (poi.latitude && poi.longitude) {
      const R = 6378137.0;
      const latRad = (poi.latitude * Math.PI) / 180;
      const lngRad = (poi.longitude * Math.PI) / 180;
      const t = (poi.place_type || "").toLowerCase();
      const radiusMeters = (t.includes("โรงพยาบาล") || t.includes("มหาวิทยาลัย") || t.includes("ห้างสรรพสินค้า") || t.includes("สวนสาธารณะ"))
        ? 85.0
        : (t.includes("ปั๊มน้ำมัน") || t.includes("โรงแรม") || t.includes("ราชการ"))
        ? 55.0
        : 35.0;

      const numPoints = 12;
      const paths = [];
      for (let i = 0; i < numPoints; i++) {
        const angle = (2 * Math.PI * i) / numPoints;
        const dLat = (radiusMeters * Math.cos(angle)) / R;
        const dLng = (radiusMeters * Math.sin(angle)) / (R * Math.cos(latRad));
        const ptLat = (latRad + dLat) * (180 / Math.PI);
        const ptLng = (lngRad + dLng) * (180 / Math.PI);
        paths.push({ lat: ptLat, lng: ptLng });
      }
      paths.push({ lat: paths[0].lat, lng: paths[0].lng }); // Close ring loop
      return paths;
    }
    return null;
  };

  // Render Nearby POIs & POI Polygons (รูปแปลงและหมุดสถานที่สำคัญจาก Places_GeoJSON)
  const renderPOIs = () => {
    const map = mapInstanceRef.current;
    const google = window.google;
    if (!map || !google?.maps) return;

    poiMarkersRef.current.forEach((m) => m.setMap(null));
    poiMarkersRef.current = [];

    poiPolygonRefs.current.forEach((p) => p.setMap(null));
    poiPolygonRefs.current = [];

    if (!activePoiCategory) return;

    const filtered =
      activePoiCategory === "all"
        ? placesData
        : placesData.filter((p) => p.place_type === activePoiCategory);

    filtered.forEach((poi) => {
      const categoryObj = POI_CATEGORIES.find((c) => c.id === poi.place_type);
      const iconEmoji = categoryObj ? categoryObj.icon : "📍";

      // Color mapping for POI Polygons
      let poiFillColor = "#8B5CF6"; // Purple default
      let poiStrokeColor = "#7C3AED";

      const t = (poi.place_type || "").toLowerCase();
      if (t.includes("ปั๊มน้ำมัน") || t.includes("ชาร์จ")) {
        poiFillColor = "#06B6D4"; // Cyan
        poiStrokeColor = "#0891B2";
      } else if (t.includes("ร้านสะดวกซื้อ") || t.includes("ตลาด")) {
        poiFillColor = "#F59E0B"; // Amber
        poiStrokeColor = "#D97706";
      } else if (t.includes("ธนาคาร")) {
        poiFillColor = "#3B82F6"; // Blue
        poiStrokeColor = "#2563EB";
      } else if (t.includes("โรงพยาบาล")) {
        poiFillColor = "#F43F5E"; // Rose
        poiStrokeColor = "#E11D48";
      } else if (t.includes("สถานศึกษา") || t.includes("มหาวิทยาลัย")) {
        poiFillColor = "#6366F1"; // Indigo
        poiStrokeColor = "#4F46E5";
      } else if (t.includes("โรงแรม") || t.includes("ที่พัก")) {
        poiFillColor = "#10B981"; // Emerald
        poiStrokeColor = "#059669";
      }

      // 1. Render POI Area Polygon when showPoiPolygons is true
      if (showPoiPolygons) {
        const paths = getPoiPolygonPaths(poi);
        if (paths && paths.length > 0) {
          const poiPolygon = new google.maps.Polygon({
            paths,
            strokeColor: poiStrokeColor,
            strokeOpacity: 0.95,
            strokeWeight: 2.5,
            fillColor: poiFillColor,
            fillOpacity: 0.45,
            map,
            zIndex: 30,
            clickable: true,
          });

          poiPolygon.addListener("mouseover", () => {
            poiPolygon.setOptions({ fillOpacity: 0.75, strokeWeight: 3.5 });
          });
          poiPolygon.addListener("mouseout", () => {
            poiPolygon.setOptions({ fillOpacity: 0.45, strokeWeight: 2.5 });
          });

          const polygonInfoWindowString = `
            <div style="font-family: system-ui, -apple-system, sans-serif; background: #0F1A30; padding: 12px; border-radius: 12px; color: #FFFFFF; border: 1px solid ${poiStrokeColor}; box-shadow: 0 10px 25px rgba(0,0,0,0.8); min-width: 180px;">
              <div style="font-size: 10px; color: ${poiFillColor}; font-weight: 900; text-transform: uppercase; font-family: monospace; letter-spacing: 0.05em; margin-bottom: 2px;">
                🔷 รูปแปลงเขตสถานที่: ${poi.place_type}
              </div>
              <div style="font-size: 13px; font-weight: 800; color: #FFFFFF; margin-bottom: 4px;">
                ${iconEmoji} ${poi.name}
              </div>
              <div style="font-size: 9px; color: #94A3B8; font-family: monospace;">
                พิกัด: ${poi.latitude.toFixed(5)}, ${poi.longitude.toFixed(5)}
              </div>
            </div>
          `;

          poiPolygon.addListener("click", (e: any) => {
            if (infoWindowRef.current) {
              infoWindowRef.current.setContent(polygonInfoWindowString);
              infoWindowRef.current.setPosition(e.latLng);
              infoWindowRef.current.open(map);
            }
          });

          poiPolygonRefs.current.push(poiPolygon);
        }
      }

      // 2. Render POI Marker
      const svgPoiPin = `data:image/svg+xml;utf8,${encodeURIComponent(`
        <svg width="28" height="28" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="14" cy="14" r="13" fill="#0F1A30" stroke="${poiStrokeColor}" stroke-width="2"/>
          <text x="14" y="18" fill="#FFFFFF" font-size="12" text-anchor="middle">${iconEmoji}</text>
        </svg>
      `)}`;

      const marker = new google.maps.Marker({
        position: { lat: poi.latitude, lng: poi.longitude },
        map,
        title: poi.name,
        icon: {
          url: svgPoiPin,
          scaledSize: new google.maps.Size(28, 28),
          anchor: new google.maps.Point(14, 14),
        },
        zIndex: 50,
      });

      const poiContent = `
        <div style="font-family: system-ui, -apple-system, sans-serif; background: #0F1A30; padding: 10px; border-radius: 10px; color: #FFFFFF; border: 1px solid ${poiStrokeColor}; min-width: 170px;">
          <div style="font-size: 10px; color: ${poiFillColor}; font-weight: 800; font-family: monospace;">${poi.place_type}</div>
          <div style="font-size: 12px; font-weight: 700; color: #FFFFFF;">${iconEmoji} ${poi.name}</div>
        </div>
      `;

      marker.addListener("click", () => {
        if (infoWindowRef.current) {
          infoWindowRef.current.setContent(poiContent);
          infoWindowRef.current.open(map, marker);
        }
      });

      poiMarkersRef.current.push(marker);
    });
  };

  const renderAllLayers = () => {
    renderListings();
    renderParcels();
    renderPOIs();
  };

  // Re-render when states change
  useEffect(() => {
    if (isLoaded && mapInstanceRef.current) {
      renderAllLayers();
    }
  }, [listings, parcelsData, placesData, showParcels, showPoiPolygons, activePoiCategory, isLoaded]);

  // Dynamic center/zoom update
  useEffect(() => {
    if (mapInstanceRef.current && center) {
      const latChanged =
        !lastCenterRef.current || lastCenterRef.current[0] !== center[0];
      const lngChanged =
        !lastCenterRef.current || lastCenterRef.current[1] !== center[1];

      if (latChanged || lngChanged) {
        mapInstanceRef.current.setCenter({ lat: center[0], lng: center[1] });
        mapInstanceRef.current.setZoom(zoom);
        lastCenterRef.current = center;
      }
    }
  }, [center, zoom]);

  if (loadError) {
    return (
      <div
        className={`w-full h-[450px] rounded-2xl border border-red-800/50 bg-slate-950 flex flex-col items-center justify-center p-6 text-center ${className}`}
      >
        <p className="text-red-400 font-semibold mb-2">Google Maps Error</p>
        <p className="text-xs text-slate-400 max-w-sm">{loadError}</p>
      </div>
    );
  }

  return (
    <div className={`relative w-full h-[450px] rounded-2xl overflow-hidden border border-slate-800 shadow-2xl ${className}`}>
      
      {/* Loading Overlay */}
      {!isLoaded && (
        <div className="absolute inset-0 z-20 bg-slate-950 flex flex-col items-center justify-center gap-3 text-slate-400">
          <div className="w-8 h-8 border-2 border-trd-gold border-t-transparent rounded-full animate-spin" />
          <span className="text-xs font-mono text-trd-gold">
            กำลังโหลดระบบแผนที่แปลงเช่าราชพัสดุ...
          </span>
        </div>
      )}

      {/* Top Map Control Bar */}
      {isLoaded && (
        <div className="absolute top-3 left-3 right-3 z-10 flex flex-wrap items-center justify-between gap-2 pointer-events-none">
          
          {/* Parcel & POI Overlay Toggles */}
          <div className="flex flex-wrap items-center gap-1.5">
            <button
              type="button"
              onClick={() => setShowParcels(!showParcels)}
              className={`pointer-events-auto px-3 py-1.5 rounded-xl text-xs font-mono font-bold transition-all shadow-lg border backdrop-blur-md flex items-center gap-1.5 ${
                showParcels
                  ? "bg-[#0F1A30]/90 text-trd-gold border-trd-gold/50 shadow-neon-gold"
                  : "bg-slate-900/80 text-slate-400 border-slate-700 hover:text-white"
              }`}
            >
              <span>🗺️</span>
              <span>รูปแปลงเขตเช่า ({parcelsData.length})</span>
            </button>

            <button
              type="button"
              onClick={() => setShowPoiPolygons(!showPoiPolygons)}
              className={`pointer-events-auto px-3 py-1.5 rounded-xl text-xs font-mono font-bold transition-all shadow-lg border backdrop-blur-md flex items-center gap-1.5 ${
                showPoiPolygons
                  ? "bg-[#0F1A30]/90 text-sky-400 border-sky-500/50 shadow-[0_0_12px_rgba(56,189,248,0.3)]"
                  : "bg-slate-900/80 text-slate-400 border-slate-700 hover:text-white"
              }`}
            >
              <span>🔷</span>
              <span>Polygon สถานที่ ({placesData.length})</span>
            </button>
          </div>

          {/* POI Layer Chips */}
          <div className="pointer-events-auto flex items-center gap-1 overflow-x-auto max-w-full pb-1 scrollbar-none">
            {POI_CATEGORIES.map((cat) => {
              const isActive = activePoiCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => setActivePoiCategory(isActive ? null : cat.id)}
                  className={`px-2.5 py-1 rounded-lg text-[10px] font-mono font-bold transition-all border backdrop-blur-md flex items-center gap-1 whitespace-nowrap shadow-md ${
                    isActive
                      ? "bg-sky-500 text-slate-950 border-sky-300 font-black shadow-[0_0_10px_rgba(56,189,248,0.5)]"
                      : "bg-[#0F1A30]/80 text-slate-300 border-slate-700/80 hover:bg-slate-800 hover:text-white"
                  }`}
                >
                  <span>{cat.icon}</span>
                  <span>{cat.label}</span>
                </button>
              );
            })}
          </div>

        </div>
      )}

      {/* Map Canvas */}
      <div ref={mapRef} className="w-full h-full" />
    </div>
  );
}
