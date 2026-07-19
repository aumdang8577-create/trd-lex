"use client";

import { useState, useEffect } from "react";
import SearchBar from "@/components/features/SearchBar/SearchBar";
import PropertyCard from "@/components/features/PropertyCard";
import LeaseMap from "@/components/features/Map/LeaseMap";
import type { Listing } from "@/types";
import api from "@/lib/api";

const initialListings: Listing[] = [
  {
    id: "list-1",
    sellerId: "seller-1",
    seller: { id: "seller-1", thaid_id: "123", first_name: "สมชาย", last_name: "ใจดี", role: "USER" },
    contractId: "contract-1",
    contract: {
      id: "contract-1",
      contract_number: "TRD-66-001",
      parcel_number: "อด.1234",
      location_lat: 17.4138,
      location_lng: 102.7872,
      province: "อุดรธานี",
      district: "เมืองอุดรธานี",
      sub_district: "หมากแข้ง",
      land_area_sqw: 120,
      is_active: true,
      building_type: "อาคารพาณิชย์",
      usable_area_sqm: 250,
      zoning: "พื้นที่สีแดง (พาณิชยกรรม)",
    },
    asking_price: 1500000,
    estimated_fee: 45000,
    description: "สิทธิ์การเช่าที่ดินเพื่อการพาณิชย์ ทำเลทองเมืองอุดรธานี ใกล้เซ็นทรัลอุดรธานี เหมาะทำร้านค้าหรือสำนักงานขนาดเล็ก",
    image_urls: ["https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=800&q=80"],
    status: "ACTIVE",
    createdAt: "2026-07-09T00:00:00Z",
    updatedAt: "2026-07-09T00:00:00Z",
  },
  {
    id: "list-2",
    sellerId: "seller-2",
    seller: { id: "seller-2", thaid_id: "456", first_name: "สมหญิง", last_name: "รักดี", role: "USER" },
    contractId: "contract-2",
    contract: {
      id: "contract-2",
      contract_number: "TRD-66-002",
      parcel_number: "ขก.5678",
      location_lat: 16.4322,
      location_lng: 102.8236,
      province: "ขอนแก่น",
      district: "เมืองขอนแก่น",
      sub_district: "ในเมือง",
      land_area_sqw: 80,
      is_active: true,
      building_type: "บ้านพักอาศัย",
      usable_area_sqm: 140,
      zoning: "พื้นที่สีเหลือง (ที่อยู่อาศัยหนาแน่นน้อย)",
    },
    asking_price: 980000,
    estimated_fee: 29400,
    description: "แปลงที่ดินราชพัสดุในเมืองขอนแก่น ทำเลพักอาศัย เงียบสงบ ใกล้วัดหนองแวงและบึงแก่นนคร เดินทางสะดวกมีสาธารณูปโภคครบครัน",
    image_urls: ["https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=800&q=80"],
    status: "ACTIVE",
    createdAt: "2026-07-09T00:00:00Z",
    updatedAt: "2026-07-09T00:00:00Z",
  },
  {
    id: "list-3",
    sellerId: "seller-3",
    seller: { id: "seller-3", thaid_id: "789", first_name: "ประยุทธ์", last_name: "มั่งมี", role: "USER" },
    contractId: "contract-3",
    contract: {
      id: "contract-3",
      contract_number: "TRD-66-003",
      parcel_number: "นค.1507",
      location_lat: 17.87762258070912,
      location_lng: 102.7435163606957,
      province: "หนองคาย",
      district: "เมืองหนองคาย",
      sub_district: "ในเมือง",
      land_area_sqw: 3677.44,
      is_active: true,
      building_type: "อาคารพาณิชย์",
      usable_area_sqm: 350,
      zoning: "พื้นที่สีแดง (พาณิชยกรรม)",
    },
    asking_price: 2400000,
    estimated_fee: 72000,
    description: "สิทธิ์การเช่าระยะยาวใกล้ริมแม่น้ำโขง เมืองหนองคาย เหมาะสำหรับทำร้านอาหารหรือโฮมสเตย์รองรับนักท่องเที่ยวริมโขงและตลาดท่าเสด็จ",
    image_urls: ["https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=800&q=80"],
    status: "ACTIVE",
    createdAt: "2026-07-09T00:00:00Z",
    updatedAt: "2026-07-09T00:00:00Z",
  },
  {
    id: "list-4",
    sellerId: "seller-2",
    seller: { id: "seller-2", thaid_id: "456", first_name: "สมหญิง", last_name: "รักดี", role: "USER" },
    contractId: "contract-4",
    contract: {
      id: "contract-4",
      contract_number: "TRD-66-004",
      parcel_number: "นค.1509",
      location_lat: 17.87523837156668,
      location_lng: 102.7425037912517,
      province: "หนองคาย",
      district: "เมืองหนองคาย",
      sub_district: "ในเมือง",
      land_area_sqw: 6263.67,
      is_active: true,
      building_type: null,
      usable_area_sqm: 0,
      zoning: "พื้นที่สีเขียว (ชนบทและเกษตรกรรม)",
    },
    asking_price: 3800000,
    estimated_fee: 114000,
    description: "แปลงที่ดินขนาดใหญ่ใจกลางเมืองหนองคาย เหมาะสำหรับพัฒนาโครงการอาคารพาณิชย์หรือคอนโดมิเนียมรองรับเขตเศรษฐกิจพิเศษ",
    image_urls: ["https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=800&q=80"],
    status: "ACTIVE",
    createdAt: "2026-07-10T00:00:00Z",
    updatedAt: "2026-07-10T00:00:00Z",
  },
  {
    id: "list-5",
    sellerId: "seller-1",
    seller: { id: "seller-1", thaid_id: "123", first_name: "สมชาย", last_name: "ใจดี", role: "USER" },
    contractId: "contract-5",
    contract: {
      id: "contract-5",
      contract_number: "TRD-66-005",
      parcel_number: "นค.1496",
      location_lat: 17.8792408132012,
      location_lng: 102.7489926859958,
      province: "หนองคาย",
      district: "เมืองหนองคาย",
      sub_district: "ในเมือง",
      land_area_sqw: 1030.53,
      is_active: true,
      building_type: "บ้านพักอาศัย",
      usable_area_sqm: 120,
      zoning: "พื้นที่สีเหลือง (ที่อยู่อาศัยหนาแน่นน้อย)",
    },
    asking_price: 1200000,
    estimated_fee: 36000,
    description: "ที่ดินราชพัสดุทำเลดี ใกล้ถนนสายหลัก เหมาะทำที่พักอาศัยหรือร้านค้าขนาดเล็ก สภาพแวดล้อมดี มีสาธารณูปโภคครบ",
    image_urls: ["https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&w=800&q=80"],
    status: "ACTIVE",
    createdAt: "2026-07-11T00:00:00Z",
    updatedAt: "2026-07-11T00:00:00Z",
  }
];

export default function ListingsPage() {
  const [listings, setListings] = useState<Listing[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchListings = async () => {
      try {
        setLoading(true);
        // Simulate a slight delay to let the user admire the skeleton animation (500ms)
        await new Promise((resolve) => setTimeout(resolve, 500));
        const res = await api.getListings();
        setListings(res.data);
      } catch (err) {
        console.error("Error fetching listings, using initial mock:", err);
        setListings(initialListings);
      } finally {
        setLoading(false);
      }
    };
    fetchListings();
  }, []);

  const handleSearch = async (searchData: {
    province: string;
    district: string;
    minPrice: string;
    maxPrice: string;
    zoning: string;
    buildingType?: string;
  }) => {
    try {
      setLoading(true);
      await new Promise((resolve) => setTimeout(resolve, 400));
      const res = await api.getListings({
        province: searchData.province || undefined,
        min_price: searchData.minPrice ? parseFloat(searchData.minPrice) : undefined,
        max_price: searchData.maxPrice ? parseFloat(searchData.maxPrice) : undefined,
      });

      let filtered = res.data;

      if (searchData.district) {
        filtered = filtered.filter((l) =>
          l.contract.district.toLowerCase().includes(searchData.district.toLowerCase())
        );
      }
      if (searchData.zoning) {
        filtered = filtered.filter((l) => l.contract.zoning === searchData.zoning);
      }
      if (searchData.buildingType) {
        filtered = filtered.filter((l) => l.contract.building_type === searchData.buildingType);
      }

      setListings(filtered);
    } catch (err) {
      console.error("Search fetch failed, using local filter on initial mock:", err);
      let filtered = [...initialListings];
      if (searchData.province) {
        filtered = filtered.filter((l) => l.contract.province === searchData.province);
      }
      if (searchData.district) {
        filtered = filtered.filter((l) =>
          l.contract.district.toLowerCase().includes(searchData.district.toLowerCase())
        );
      }
      if (searchData.minPrice) {
        filtered = filtered.filter((l) => l.asking_price >= parseFloat(searchData.minPrice));
      }
      if (searchData.maxPrice) {
        filtered = filtered.filter((l) => l.asking_price <= parseFloat(searchData.maxPrice));
      }
      if (searchData.zoning) {
        filtered = filtered.filter((l) => l.contract.zoning === searchData.zoning);
      }
      if (searchData.buildingType) {
        filtered = filtered.filter((l) => l.contract.building_type === searchData.buildingType);
      }
      setListings(filtered);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 font-sans text-trd-midnight">
      {/* Title Header */}
      <div className="mb-8 border-b-2 border-trd-border pb-4">
        <span className="text-[9px] font-mono text-trd-primary uppercase tracking-widest font-black">
          ระบบสืบค้นข้อมูลประกาศสิทธิ์เชิงพื้นที่สำหรับประชาชนทั่วไป
        </span>
        <h1 className="text-2xl font-black text-trd-midnight uppercase mt-1 font-sans tracking-wide">ค้นหาประกาศสิทธิการเช่าที่ราชพัสดุ</h1>
        <p className="text-xs text-trd-text-muted mt-1 leading-relaxed font-medium">
          สืบค้น ตรวจสอบตำแหน่งทางภูมิศาสตร์ และตรวจสอบความถูกต้องของสิทธิการเช่าเพื่อประกอบการตัดสินใจของประชาชนอย่างโปร่งใส
        </p>
      </div>

      {/* Main Grid Layout: Sidebar Filter + Listings List + Map Split View */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Side: Persistent Sidebar Filter (col-span-3) */}
        <div className="lg:col-span-3 lg:sticky lg:top-24 z-10">
          <SearchBar onSearch={handleSearch} layout="vertical" />
        </div>

        {/* Center: Listings List (col-span-5) */}
        <div className="lg:col-span-5 space-y-6">
          <div className="flex justify-between items-center pb-4 border-b border-trd-border/80">
            <h2 className="text-[10px] font-black text-trd-midnight font-mono uppercase tracking-widest">
              รายการประกาศเสนอโอนสิทธิ์ที่พบบนเงื่อนไขการค้นหา ({listings.length} รายการ)
            </h2>
          </div>

          {loading ? (
            <div className="space-y-6">
              {[1, 2, 3].map((i) => (
                <div key={i} className="bg-[#0F1A30] border border-[#1E2E4A]/80 overflow-hidden animate-pulse rounded-2xl shadow-lg">
                  <div className="h-44 bg-slate-900/80" />
                  <div className="p-5 space-y-4">
                    <div className="flex justify-between items-center">
                      <div className="h-3 bg-slate-800 rounded w-1/3" />
                      <div className="h-4 bg-slate-800 rounded w-1/4" />
                    </div>
                    <div className="h-5 bg-slate-800 rounded w-3/4" />
                    <div className="space-y-2 pt-2">
                      <div className="h-2.5 bg-slate-800 rounded w-5/6" />
                      <div className="h-2.5 bg-slate-800 rounded w-4/5" />
                    </div>
                    <div className="flex gap-2 pt-3 border-t border-[#1E2E4A]/60">
                      <div className="h-3 bg-slate-800 rounded w-1/4" />
                      <div className="h-3 bg-slate-800 rounded w-1/4" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : listings.length > 0 ? (
            <div className="space-y-6">
              {listings.map((listing) => (
                <PropertyCard
                  key={listing.id}
                  id={listing.id}
                  price={listing.asking_price}
                  province={listing.contract.province}
                  district={listing.contract.district}
                  landArea={listing.contract.land_area_sqw}
                  imageUrl={listing.image_urls[0] || ""}
                  isVerified={listing.status === "ACTIVE"}
                  buildingType={listing.contract.building_type}
                  usableAreaSqm={listing.contract.usable_area_sqm}
                  zoning={listing.contract.zoning}
                  locationLat={listing.contract.location_lat}
                  locationLng={listing.contract.location_lng}
                />
              ))}
            </div>
          ) : (
            <div className="bg-[#0F1A30] border border-[#1E2E4A]/80 p-12 text-center text-slate-400 font-mono text-xs uppercase tracking-widest font-bold rounded-2xl shadow-lg">
              [ ไม่พบข้อมูลสัญญาเช่าที่ตรงตามตัวกรองปัจจุบัน ]
            </div>
          )}
        </div>

        {/* Right: Map View (col-span-4) */}
        <div className="lg:col-span-4 lg:sticky lg:top-24">
          <div className="bg-[#0F1A30] border border-[#1E2E4A]/80 overflow-hidden shadow-[0_12px_35px_rgba(7,13,26,0.35)] rounded-2xl">
            <div className="p-4 bg-[#070D1A] text-white font-mono text-xs uppercase tracking-widest font-black flex items-center justify-between border-b border-[#1E2E4A]">
              <span>พิกัดแผนที่ภูมิสารสนเทศ (GIS)</span>
              <span className="text-[8px] bg-gold-gradient border border-transparent text-[#0F1A30] px-2 py-0.5 font-extrabold font-mono rounded-lg shadow-neon-gold">
                MAP VIEW
              </span>
            </div>
            <LeaseMap listings={listings} className="!rounded-none !border-none !h-[450px]" />
          </div>
        </div>

      </div>
    </div>
  );
}
