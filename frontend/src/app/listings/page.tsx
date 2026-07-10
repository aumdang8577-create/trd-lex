"use client";

import { useState } from "react";
import SearchBar from "@/components/features/SearchBar/SearchBar";
import PropertyCard from "@/components/features/PropertyCard";
import LeaseMap from "@/components/features/Map/LeaseMap";
import type { Listing } from "@/types";

const initialListings: Listing[] = [
  {
    id: "list-1",
    sellerId: "seller-1",
    seller: { id: "seller-1", thaid_id: "123", first_name: "สมชาย", last_name: "ใจดี", role: "USER" },
    contractId: "contract-1",
    contract: {
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
    },
    asking_price: 1500000,
    estimated_fee: 45000,
    description: "สิทธิ์การเช่าที่ดินเพื่อการพาณิชย์ ทำเลทองพญาไท ใกล้รถไฟฟ้า เหมาะทำร้านกาแฟหรือโชว์รูมสินค้าขนาดเล็ก",
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
      parcel_number: "589/12",
      location_lat: 12.9235,
      location_lng: 100.8824,
      province: "ชลบุรี",
      district: "บางละมุง",
      sub_district: "หนองปรือ",
      land_area_sqw: 80,
      is_active: true,
      building_type: "บ้านพักอาศัย",
      usable_area_sqm: 140,
      zoning: "พื้นที่สีเหลือง (ที่อยู่อาศัยหนาแน่นน้อย)",
    },
    asking_price: 980000,
    estimated_fee: 29400,
    description: "แปลงที่ดินราชพัสดุพัทยาใต้ ทำเลพักอาศัย เงียบสงบ ใกล้สิ่งอำนวยความสะดวกมากมาย",
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
    },
    asking_price: 2400000,
    estimated_fee: 72000,
    description: "สิทธิ์การเช่าระยะยาวสำหรับทำธุรกิจเกสท์เฮ้าส์หรือร้านอาหารในเขตคูเมืองเก่าเชียงใหม่ ดึงดูดนักท่องเที่ยวได้ดีเยี่ยม",
    image_urls: ["https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=800&q=80"],
    status: "ACTIVE",
    createdAt: "2026-07-09T00:00:00Z",
    updatedAt: "2026-07-09T00:00:00Z",
  }
];

export default function ListingsPage() {
  const [listings, setListings] = useState<Listing[]>(initialListings);

  const handleSearch = (searchData: { province: string; district: string; minPrice: string; maxPrice: string; zoning: string }) => {
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

    setListings(filtered);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-trd-primary">ค้นหาประกาศสิทธิการเช่า</h1>
        <p className="text-gray-500 mt-2">
          ค้นหาและเปรียบเทียบสิทธิการเช่าที่ราชพัสดุผ่านแผนที่และระบบการค้นหาแบบละเอียด
        </p>
      </div>

      {/* Search Filter Bar */}
      <div className="mb-10">
        <SearchBar onSearch={handleSearch} />
      </div>

      {/* Main Grid: Listings + Map Split View */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Listings List */}
        <div className="lg:col-span-7 space-y-6">
          <div className="flex justify-between items-center pb-4 border-b border-trd-border/50">
            <h2 className="text-lg font-semibold text-trd-primary">
              พบประกาศทั้งหมด ({listings.length} รายการ)
            </h2>
          </div>

          {listings.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                />
              ))}
            </div>
          ) : (
            <div className="bg-white rounded-2xl border border-trd-border p-12 text-center text-gray-400">
              <span className="text-5xl block mb-4">🔍</span>
              ไม่พบประกาศที่ตรงตามเงื่อนไขการค้นหาของคุณ
            </div>
          )}
        </div>

        {/* Map View */}
        <div className="lg:col-span-5 lg:sticky lg:top-24">
          <div className="bg-white rounded-2xl border border-trd-border/50 overflow-hidden shadow-sm">
            <div className="p-4 bg-trd-primary text-white font-semibold flex items-center justify-between">
              <span>🗺️ แสดงผลบนแผนที่</span>
              <span className="text-xs bg-trd-secondary text-trd-primary-dark font-bold px-2 py-0.5 rounded-full">
                Active Listings
              </span>
            </div>
            <LeaseMap listings={listings} className="!rounded-none !border-none !h-[450px]" />
          </div>
        </div>
      </div>
    </div>
  );
}
