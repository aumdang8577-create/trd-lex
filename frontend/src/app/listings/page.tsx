"use client";

import { useState, useEffect, Suspense, useMemo } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import SearchBar from "@/components/features/SearchBar/SearchBar";
import PropertyCard from "@/components/features/PropertyCard";
import LeaseMap from "@/components/features/Map/LeaseMap";
import PropertyCardSkeleton from "@/components/ui/PropertyCardSkeleton";
import FetchErrorAlert from "@/components/ui/FetchErrorAlert";
import { useListings, useListingsPaginated } from "@/lib/hooks/useListings";
import type { Listing } from "@/types";
import api from "@/lib/api";

const initialListings: Listing[] = [
  {
    id: "list-1",
    sellerId: "seller-1",
    seller: { id: "seller-1", thaid_id: "1123456789012", first_name: "สมชาย", last_name: "ใจดี", role: "USER" },
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
      land_area_sqw: 120.0,
      is_active: true,
      building_type: "อาคารพาณิชย์",
      usable_area_sqm: 250.0,
      zoning: "พื้นที่สีแดง (พาณิชยกรรม)",
      annual_rent: 12000.0,
    },
    asking_price: 1500000.0,
    estimated_fee: 45000.0,
    description: "สิทธิ์การเช่าที่ดินเพื่อการพาณิชย์ ทำเลทองเมืองอุดรธานี ใกล้เซ็นทรัลอุดรธานี เหมาะทำร้านค้าหรือสำนักงานขนาดเล็ก เดินทางสะดวกติดถนนใหญ่สภาพแวดล้อมดีเยี่ยม",
    image_urls: ["https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=800&q=80"],
    status: "ACTIVE",
    createdAt: "2026-07-09T00:00:00Z",
    updatedAt: "2026-07-09T00:00:00Z",
  },
  {
    id: "list-2",
    sellerId: "seller-2",
    seller: { id: "seller-2", thaid_id: "2123456789012", first_name: "สมหญิง", last_name: "รักดี", role: "USER" },
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
      land_area_sqw: 80.0,
      is_active: true,
      building_type: "บ้านพักอาศัย",
      usable_area_sqm: 140.0,
      zoning: "พื้นที่สีเหลือง (ที่อยู่อาศัยหนาแน่นน้อย)",
      annual_rent: 12000.0,
    },
    asking_price: 980000.0,
    estimated_fee: 29400.0,
    description: "แปลงที่ดินราชพัสดุในเมืองขอนแก่น ทำเลพักอาศัย เงียบสงบ ใกล้วัดหนองแวงและบึงแก่นนคร เดินทางสะดวกมีสาธารณูปโภคครบครัน เหมาะสำหรับสร้างบ้านเดี่ยวหรือบ้านพักตากอากาศส่วนตัว",
    image_urls: ["https://images.unsplash.com/photo-1580587771525-78b9dba3b914?auto=format&fit=crop&w=800&q=80"],
    status: "ACTIVE",
    createdAt: "2026-07-09T00:00:00Z",
    updatedAt: "2026-07-09T00:00:00Z",
  },
  {
    id: "list-3",
    sellerId: "seller-3",
    seller: { id: "seller-3", thaid_id: "3123456789012", first_name: "ประยุทธ์", last_name: "มั่งมี", role: "USER" },
    contractId: "contract-3",
    contract: {
      id: "contract-3",
      contract_number: "TRD-66-003",
      parcel_number: "นค.1507",
      location_lat: 17.8776,
      location_lng: 102.7435,
      province: "หนองคาย",
      district: "เมืองหนองคาย",
      sub_district: "ในเมือง",
      land_area_sqw: 3677.44,
      is_active: true,
      building_type: "อาคารพาณิชย์",
      usable_area_sqm: 350.0,
      zoning: "พื้นที่สีแดง (พาณิชยกรรม)",
      annual_rent: 12000.0,
    },
    asking_price: 2400000.0,
    estimated_fee: 72000.0,
    description: "สิทธิ์การเช่าระยะยาวใกล้ริมแม่น้ำโขง เมืองหนองคาย เหมาะสำหรับทำร้านอาหารหรือโฮมสเตย์รองรับนักท่องเที่ยวริมโขงและตลาดท่าเสด็จ แปลงมุมหน้ากว้างสวยงาม",
    image_urls: ["https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=800&q=80"],
    status: "ACTIVE",
    createdAt: "2026-07-09T00:00:00Z",
    updatedAt: "2026-07-09T00:00:00Z",
  },
  {
    id: "list-4",
    sellerId: "seller-2",
    seller: { id: "seller-2", thaid_id: "2123456789012", first_name: "สมหญิง", last_name: "รักดี", role: "USER" },
    contractId: "contract-4",
    contract: {
      id: "contract-4",
      contract_number: "TRD-66-004",
      parcel_number: "นค.1509",
      location_lat: 17.8752,
      location_lng: 102.7425,
      province: "หนองคาย",
      district: "เมืองหนองคาย",
      sub_district: "ในเมือง",
      land_area_sqw: 6263.67,
      is_active: true,
      building_type: null,
      usable_area_sqm: 0.0,
      zoning: "พื้นที่สีเขียว (ชนบทและเกษตรกรรม)",
      annual_rent: 12000.0,
    },
    asking_price: 3800000.0,
    estimated_fee: 114000.0,
    description: "แปลงที่ดินขนาดใหญ่ใจกลางเมืองหนองคาย เหมาะสำหรับพัฒนาโครงการอาคารพาณิชย์หรือคอนโดมิเนียมรองรับเขตเศรษฐกิจพิเศษ ที่ดินเปล่าสภาพดีพร้อมพัฒนา",
    image_urls: ["https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=800&q=80"],
    status: "ACTIVE",
    createdAt: "2026-07-09T00:00:00Z",
    updatedAt: "2026-07-09T00:00:00Z",
  },
  {
    id: "list-5",
    sellerId: "seller-1",
    seller: { id: "seller-1", thaid_id: "1123456789012", first_name: "สมชาย", last_name: "ใจดี", role: "USER" },
    contractId: "contract-5",
    contract: {
      id: "contract-5",
      contract_number: "TRD-66-005",
      parcel_number: "นค.1496",
      location_lat: 17.8792,
      location_lng: 102.7489,
      province: "หนองคาย",
      district: "เมืองหนองคาย",
      sub_district: "ในเมือง",
      land_area_sqw: 1030.53,
      is_active: true,
      building_type: "บ้านพักอาศัย",
      usable_area_sqm: 120.0,
      zoning: "พื้นที่สีเหลือง (ที่อยู่อาศัยหนาแน่นน้อย)",
      annual_rent: 12000.0,
    },
    asking_price: 1200000.0,
    estimated_fee: 36000.0,
    description: "ที่ดินราชพัสดุทำเลดี ใกล้ถนนสายหลัก เหมาะทำที่พักอาศัยหรือร้านค้าขนาดเล็ก สภาพแวดล้อมดี มีสาธารณูปโภคครบ บ้านพักอาศัย 1 ชั้น",
    image_urls: ["https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&w=800&q=80"],
    status: "ACTIVE",
    createdAt: "2026-07-09T00:00:00Z",
    updatedAt: "2026-07-09T00:00:00Z",
  },
  {
    id: "list-6",
    sellerId: "seller-3",
    seller: { id: "seller-3", thaid_id: "3123456789012", first_name: "ประยุทธ์", last_name: "มั่งมี", role: "USER" },
    contractId: "contract-6",
    contract: {
      id: "contract-6",
      contract_number: "TRD-66-006",
      parcel_number: "กจ.2345",
      location_lat: 14.0227,
      location_lng: 99.5328,
      province: "กาญจนบุรี",
      district: "เมืองกาญจนบุรี",
      sub_district: "ปากแพรก",
      land_area_sqw: 150.0,
      is_active: true,
      building_type: "บ้านพักอาศัย",
      usable_area_sqm: 180.0,
      zoning: "พื้นที่สีเหลือง (ที่อยู่อาศัยหนาแน่นน้อย)",
      annual_rent: 12000.0,
    },
    asking_price: 1250000.0,
    estimated_fee: 37500.0,
    description: "สิทธิ์การเช่าที่ดินพร้อมสิ่งปลูกสร้างสไตล์บ้านพักอาศัย บรรยากาศร่มรื่นใกล้แม่น้ำแคว เดินทางเข้าเมืองกาญจนบุรีสะดวกมาก สภาพบ้านพร้อมย้ายเข้าอยู่ได้ทันที",
    image_urls: ["https://images.unsplash.com/photo-1580587771525-78b9dba3b914?auto=format&fit=crop&w=800&q=80"],
    status: "ACTIVE",
    createdAt: "2026-07-09T00:00:00Z",
    updatedAt: "2026-07-09T00:00:00Z",
  },
  {
    id: "list-7",
    sellerId: "seller-1",
    seller: { id: "seller-1", thaid_id: "1123456789012", first_name: "สมชาย", last_name: "ใจดี", role: "USER" },
    contractId: "contract-7",
    contract: {
      id: "contract-7",
      contract_number: "TRD-66-007",
      parcel_number: "กจ.2346",
      location_lat: 14.1167,
      location_lng: 99.1333,
      province: "กาญจนบุรี",
      district: "ไทรโยค",
      sub_district: "ไทรโยค",
      land_area_sqw: 2400.0,
      is_active: true,
      building_type: null,
      usable_area_sqm: 0.0,
      zoning: "พื้นที่สีเขียว (ชนบทและเกษตรกรรม)",
      annual_rent: 12000.0,
    },
    asking_price: 450000.0,
    estimated_fee: 13500.0,
    description: "ที่ดินเปล่าผืนใหญ่ในอำเภอไทรโยค ทำเลติดธรรมชาติ เหมาะสำหรับการเกษตรกรรมท่องเที่ยวเชิงอนุรักษ์ โฮมสเตย์ หรือแคมป์ปิ้งพักผ่อนเชิงนิเวศ",
    image_urls: ["https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=800&q=80"],
    status: "ACTIVE",
    createdAt: "2026-07-09T00:00:00Z",
    updatedAt: "2026-07-09T00:00:00Z",
  },
  {
    id: "list-8",
    sellerId: "seller-2",
    seller: { id: "seller-2", thaid_id: "2123456789012", first_name: "สมหญิง", last_name: "รักดี", role: "USER" },
    contractId: "contract-8",
    contract: {
      id: "contract-8",
      contract_number: "TRD-66-008",
      parcel_number: "นภ.3456",
      location_lat: 17.2023,
      location_lng: 102.4411,
      province: "หนองบัวลำภู",
      district: "เมืองหนองบัวลำภู",
      sub_district: "ลำภู",
      land_area_sqw: 3200.0,
      is_active: true,
      building_type: null,
      usable_area_sqm: 0.0,
      zoning: "พื้นที่สีเขียว (ชนบทและเกษตรกรรม)",
      annual_rent: 12000.0,
    },
    asking_price: 350000.0,
    estimated_fee: 10500.0,
    description: "แปลงที่ราชพัสดุแปลงว่างเปล่าในหนองบัวลำภู พื้นที่ดินดำอุดมสมบูรณ์ เหมาะสำหรับการทำเกษตรกรรมยั่งยืน หรือสร้างโซลาร์ฟาร์มชุมชนหมุนเวียน",
    image_urls: ["https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=800&q=80"],
    status: "ACTIVE",
    createdAt: "2026-07-09T00:00:00Z",
    updatedAt: "2026-07-09T00:00:00Z",
  },
  {
    id: "list-9",
    sellerId: "seller-1",
    seller: { id: "seller-1", thaid_id: "1123456789012", first_name: "สมชาย", last_name: "ใจดี", role: "USER" },
    contractId: "contract-9",
    contract: {
      id: "contract-9",
      contract_number: "TRD-66-009",
      parcel_number: "นภ.3457",
      location_lat: 16.9634,
      location_lng: 102.2778,
      province: "หนองบัวลำภู",
      district: "ศรีบุญเรือง",
      sub_district: "ศรีบุญเรือง",
      land_area_sqw: 90.0,
      is_active: true,
      building_type: "อาคารพาณิชย์",
      usable_area_sqm: 160.0,
      zoning: "พื้นที่สีแดง (พาณิชยกรรม)",
      annual_rent: 12000.0,
    },
    asking_price: 1100000.0,
    estimated_fee: 33000.0,
    description: "อาคารพาณิชย์สองชั้นใจกลางชุมชนอำเภอศรีบุญเรือง เหมาะทำเป็นหน้าร้านค้าขายปลีก ร้านกาแฟ หรือสำนักงานตัวแทนบริการสาขาของหน่วยงาน",
    image_urls: ["https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=800&q=80"],
    status: "ACTIVE",
    createdAt: "2026-07-09T00:00:00Z",
    updatedAt: "2026-07-09T00:00:00Z",
  },
  {
    id: "list-10",
    sellerId: "seller-3",
    seller: { id: "seller-3", thaid_id: "3123456789012", first_name: "ประยุทธ์", last_name: "มั่งมี", role: "USER" },
    contractId: "contract-10",
    contract: {
      id: "contract-10",
      contract_number: "TRD-66-010",
      parcel_number: "อด.2345",
      location_lat: 17.1165,
      location_lng: 103.0182,
      province: "อุดรธานี",
      district: "กุมภวาปี",
      sub_district: "กุมภวาปี",
      land_area_sqw: 180.0,
      is_active: true,
      building_type: "อาคารพาณิชย์",
      usable_area_sqm: 280.0,
      zoning: "พื้นที่สีแดง (พาณิชยกรรม)",
      annual_rent: 12000.0,
    },
    asking_price: 1350000.0,
    estimated_fee: 40500.0,
    description: "อาคารพาณิชย์ทำเลดีในอำเภอกุมภวาปี ใกล้แหล่งการค้าชุมชนและตลาดใหญ่ เหมาะสำหรับการค้าขาย เปิดออฟฟิศ หรือพัฒนาเป็นศูนย์ขนส่งสินค้า",
    image_urls: ["https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=800&q=80"],
    status: "ACTIVE",
    createdAt: "2026-07-09T00:00:00Z",
    updatedAt: "2026-07-09T00:00:00Z",
  },
  {
    id: "list-11",
    sellerId: "seller-1",
    seller: { id: "seller-1", thaid_id: "1123456789012", first_name: "สมชาย", last_name: "ใจดี", role: "USER" },
    contractId: "contract-11",
    contract: {
      id: "contract-11",
      contract_number: "TRD-66-011",
      parcel_number: "อด.2346",
      location_lat: 17.6833,
      location_lng: 102.7833,
      province: "อุดรธานี",
      district: "เพ็ญ",
      sub_district: "เพ็ญ",
      land_area_sqw: 1200.0,
      is_active: true,
      building_type: null,
      usable_area_sqm: 0.0,
      zoning: "พื้นที่สีเขียว (ชนบทและเกษตรกรรม)",
      annual_rent: 12000.0,
    },
    asking_price: 600000.0,
    estimated_fee: 18000.0,
    description: "ที่ดินเปล่าผืนใหญ่เพื่อการเกษตรกรรมในอำเภอเพ็ญ อุดรธานี ดินดีระบายน้ำดี เหมาะสำหรับเกษตรอินทรีย์ ปลูกสวนผสม หรือโครงการเกษตรทฤษฎีใหม่",
    image_urls: ["https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=800&q=80"],
    status: "ACTIVE",
    createdAt: "2026-07-09T00:00:00Z",
    updatedAt: "2026-07-09T00:00:00Z",
  },
  {
    id: "list-12",
    sellerId: "seller-2",
    seller: { id: "seller-2", thaid_id: "2123456789012", first_name: "สมหญิง", last_name: "รักดี", role: "USER" },
    contractId: "contract-12",
    contract: {
      id: "contract-12",
      contract_number: "TRD-66-012",
      parcel_number: "นค.1601",
      location_lat: 18.0125,
      location_lng: 103.0825,
      province: "หนองคาย",
      district: "โพนพิสัย",
      sub_district: "จุมพล",
      land_area_sqw: 1800.0,
      is_active: true,
      building_type: null,
      usable_area_sqm: 0.0,
      zoning: "พื้นที่สีเขียว (ชนบทและเกษตรกรรม)",
      annual_rent: 12000.0,
    },
    asking_price: 850000.0,
    estimated_fee: 25500.0,
    description: "สิทธิ์การเช่าที่ดินเพื่อเกษตรกรรมและคลังพักของเกษตรกรในโพนพิสัย ติดถนนทางหลวงเดินทางขนส่งผลผลิตทางการเกษตรได้สะดวก รวดเร็ว",
    image_urls: ["https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=800&q=80"],
    status: "ACTIVE",
    createdAt: "2026-07-09T00:00:00Z",
    updatedAt: "2026-07-09T00:00:00Z",
  },
  {
    id: "list-13",
    sellerId: "seller-3",
    seller: { id: "seller-3", thaid_id: "3123456789012", first_name: "ประยุทธ์", last_name: "มั่งมี", role: "USER" },
    contractId: "contract-13",
    contract: {
      id: "contract-13",
      contract_number: "TRD-66-013",
      parcel_number: "นค.1602",
      location_lat: 17.8483,
      location_lng: 102.5833,
      province: "หนองคาย",
      district: "ท่าบ่อ",
      sub_district: "ท่าบ่อ",
      land_area_sqw: 250.0,
      is_active: true,
      building_type: "อาคารพาณิชย์",
      usable_area_sqm: 420.0,
      zoning: "พื้นที่สีแดง (พาณิชยกรรม)",
      annual_rent: 12000.0,
    },
    asking_price: 1650000.0,
    estimated_fee: 49500.0,
    description: "ตึกพาณิชย์ขนาดใหญ่ในย่านการค้าท่าบ่อ หนองคาย เหมาะทำโชว์รูมสินค้า ศูนย์บริการกระจายสินค้ารายย่อย หรือเปิดกิจการศูนย์อาหารเชิงพาณิชย์",
    image_urls: ["https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=800&q=80"],
    status: "ACTIVE",
    createdAt: "2026-07-09T00:00:00Z",
    updatedAt: "2026-07-09T00:00:00Z",
  },
  {
    id: "list-14",
    sellerId: "seller-1",
    seller: { id: "seller-1", thaid_id: "1123456789012", first_name: "สมชาย", last_name: "ใจดี", role: "USER" },
    contractId: "contract-14",
    contract: {
      id: "contract-14",
      contract_number: "TRD-66-014",
      parcel_number: "กจ.2355",
      location_lat: 13.9633,
      location_lng: 99.6333,
      province: "กาญจนบุรี",
      district: "ท่าม่วง",
      sub_district: "ท่าม่วง",
      land_area_sqw: 120.0,
      is_active: true,
      building_type: "อาคารพาณิชย์",
      usable_area_sqm: 220.0,
      zoning: "พื้นที่สีแดง (พาณิชยกรรม)",
      annual_rent: 12000.0,
    },
    asking_price: 1800000.0,
    estimated_fee: 54000.0,
    description: "สิทธิ์เช่าอาคารพาณิชย์ทำเลดีติดถนนแสงชูโต อำเภอท่าม่วง เหมาะสำหรับเปิดคลินิกการแพทย์ ร้านค้าสะดวกซื้อ สำนักงานบริการ หรือสถาบันกวดวิชา",
    image_urls: ["https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=800&q=80"],
    status: "ACTIVE",
    createdAt: "2026-07-09T00:00:00Z",
    updatedAt: "2026-07-09T00:00:00Z",
  },
  {
    id: "list-15",
    sellerId: "seller-2",
    seller: { id: "seller-2", thaid_id: "2123456789012", first_name: "สมหญิง", last_name: "รักดี", role: "USER" },
    contractId: "contract-15",
    contract: {
      id: "contract-15",
      contract_number: "TRD-66-015",
      parcel_number: "กจ.2356",
      location_lat: 14.4167,
      location_lng: 99.1333,
      province: "กาญจนบุรี",
      district: "ศรีสวัสดิ์",
      sub_district: "ศรีสวัสดิ์",
      land_area_sqw: 3500.0,
      is_active: true,
      building_type: null,
      usable_area_sqm: 0.0,
      zoning: "พื้นที่สีเขียว (ชนบทและเกษตรกรรม)",
      annual_rent: 12000.0,
    },
    asking_price: 550000.0,
    estimated_fee: 16500.0,
    description: "ที่ดินเปล่าแปลงขนาดใหญ่ ใกล้เขื่อนศรีนครินทร์ ศรีสวัสดิ์ กาญจนบุรี วิวสวย ท่ามกลางธรรมชาติ เหมาะจัดตั้งแคมป์ปิ้ง ลานกิจกรรม หรือโฮมสเตย์แนวผจญภัย",
    image_urls: ["https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=800&q=80"],
    status: "ACTIVE",
    createdAt: "2026-07-09T00:00:00Z",
    updatedAt: "2026-07-09T00:00:00Z",
  },
  {
    id: "list-16",
    sellerId: "seller-3",
    seller: { id: "seller-3", thaid_id: "3123456789012", first_name: "ประยุทธ์", last_name: "มั่งมี", role: "USER" },
    contractId: "contract-16",
    contract: {
      id: "contract-16",
      contract_number: "TRD-66-016",
      parcel_number: "นภ.3465",
      location_lat: 17.2917,
      location_lng: 102.1833,
      province: "หนองบัวลำภู",
      district: "นากลาง",
      sub_district: "นากลาง",
      land_area_sqw: 160.0,
      is_active: true,
      building_type: "บ้านพักอาศัย",
      usable_area_sqm: 150.0,
      zoning: "พื้นที่สีเหลือง (ที่อยู่อาศัยหนาแน่นน้อย)",
      annual_rent: 12000.0,
    },
    asking_price: 850000.0,
    estimated_fee: 25500.0,
    description: "บ้านพักอาศัยเดี่ยว 1 ชั้น ย่านอำเภอนากลาง ทำเลอยู่อาศัยดี เงียบสงบ ปลอดภัย เหมาะสำหรับย้ายเข้าอยู่เป็นที่พำนักของครอบครัว เดินทางเข้าตัวเมืองง่าย",
    image_urls: ["https://images.unsplash.com/photo-1580587771525-78b9dba3b914?auto=format&fit=crop&w=800&q=80"],
    status: "ACTIVE",
    createdAt: "2026-07-09T00:00:00Z",
    updatedAt: "2026-07-09T00:00:00Z",
  },
];

const localImageFiles = [
  "images.jpg",
  "images (1).jpg",
  "images (2).jpg",
  "images (3).jpg",
  "images (4).jpg",
  "images (5).jpg",
  "images (6).jpg",
  "images (7).jpg",
  "images (8).jpg",
  "images (9).jpg",
  "images (10).jpg",
  "images (11).jpg",
  "images (12).jpg",
  "images (13).jpg",
  "images (14).jpg",
  "images (15).jpg",
  "images (16).jpg",
  "images (17).jpg",
  "images (18).jpg",
  "images (19).jpg",
  "images (20).jpg",
  "images (21).jpg",
  "images (22).jpg",
  "images (23).jpg",
  // cspell:disable-next-line
  "dszfgdrhtrj.jpg",
  // cspell:disable-next-line
  "esdgdxfh.jpg"
];

const replaceWith6LocalImages = (id: string, existingUrls: string[]): string[] => {
  let hash = 0;
  for (let i = 0; i < id.length; i++) {
    hash = id.charCodeAt(i) + ((hash << 5) - hash);
  }
  const baseIdx = Math.abs(hash) % localImageFiles.length;

  const results: string[] = [];
  for (let j = 0; j < 6; j++) {
    if (existingUrls[j] && existingUrls[j].startsWith("/images/")) {
      results.push(existingUrls[j]);
    } else {
      const idx = (baseIdx + j * 3) % localImageFiles.length;
      results.push(`/images/${localImageFiles[idx]}`);
    }
  }
  return results;
};

const mapListingsWithLocalImages = (data: Listing[]) => {
  return data.map((l) => ({
    ...l,
    image_urls: replaceWith6LocalImages(l.id, l.image_urls)
  }));
};

function ListingsContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [filteredListingsOverride, setFilteredListingsOverride] = useState<Listing[] | null>(null);

  const urlPage = parseInt(searchParams.get("page") || "1", 10);
  const initialPage = isNaN(urlPage) || urlPage < 1 ? 1 : urlPage;

  // 1. Fetch paginated data with SWR Infinite (6 items per page)
  const {
    listings: rawSwrListings,
    totalCount,
    isLoadingInitialData,
    isLoadingMore,
    isPageError,
    isReachingEnd,
    page,
    loadMore,
    retryLoadMore,
    error,
    mutate,
  } = useListingsPaginated(undefined, 6, initialPage);

  // Sync URL query param `?page=X` when page changes
  useEffect(() => {
    if (page > 1) {
      const currentUrlPage = parseInt(searchParams.get("page") || "1", 10);
      if (currentUrlPage !== page) {
        const newParams = new URLSearchParams(searchParams.toString());
        newParams.set("page", String(page));
        router.replace(`/listings?${newParams.toString()}`, { scroll: false });
      }
    }
  }, [page, searchParams, router]);

  const activeSourceListings = rawSwrListings.length > 0 ? rawSwrListings : initialListings;

  // 2. Filter listings based on URL query parameters or search override
  const listings = useMemo(() => {
    let listData = filteredListingsOverride !== null ? filteredListingsOverride : [...activeSourceListings];
    
    // Only include properties that have valid parcel shape / image data
    listData = listData.filter(
      (l) => l.image_urls && l.image_urls.length > 0 && l.image_urls[0] && l.image_urls[0].trim() !== ""
    );
    
    const p = searchParams.get("province");
    const d = searchParams.get("district");
    const min = searchParams.get("minPrice");
    const max = searchParams.get("maxPrice");
    const z = searchParams.get("zoning");
    const bt = searchParams.get("buildingType");

    if (p) {
      listData = listData.filter((l) => l.contract.province === p);
    }
    if (d) {
      listData = listData.filter((l) => l.contract.district.toLowerCase().includes(d.toLowerCase()));
    }
    if (min) {
      listData = listData.filter((l) => l.asking_price >= parseFloat(min));
    }
    if (max) {
      listData = listData.filter((l) => l.asking_price <= parseFloat(max));
    }
    if (z) {
      const zoneKeyword = z.split(" ")[0];
      listData = listData.filter((l) => l.contract.zoning?.includes(zoneKeyword));
    }
    if (bt) {
      if (bt === "ที่ดินเปล่า") {
        listData = listData.filter((l) => 
          l.contract.building_type === "ที่ดินเปล่า" || 
          l.contract.building_type === null || 
          l.contract.building_type === ""
        );
      } else {
        listData = listData.filter((l) => l.contract.building_type === bt);
      }
    }

    return mapListingsWithLocalImages(listData);
  }, [searchParams, activeSourceListings, filteredListingsOverride]);

  const handleSearch = async (searchData: {
    province: string;
    district: string;
    minPrice: string;
    maxPrice: string;
    zoning: string;
    buildingType?: string;
  }) => {
    let filtered = [...activeSourceListings];
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
      const zoneKeyword = searchData.zoning.split(" ")[0];
      filtered = filtered.filter((l) => l.contract.zoning?.includes(zoneKeyword));
    }
    if (searchData.buildingType) {
      if (searchData.buildingType === "ที่ดินเปล่า") {
        filtered = filtered.filter((l) => 
          l.contract.building_type === "ที่ดินเปล่า" || 
          l.contract.building_type === null || 
          l.contract.building_type === ""
        );
      } else {
        filtered = filtered.filter((l) => l.contract.building_type === searchData.buildingType);
      }
    }
    setFilteredListingsOverride(filtered);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 font-sans text-trd-midnight">
      {/* Title Header */}
      <div className="mb-8 border-b-2 border-trd-border pb-4">
        <span className="text-[9px] font-mono text-trd-primary uppercase tracking-widest font-black">
          ระบบค้นหาประกาศหาผู้รับโอนสิทธิการเช่าเชิงพื้นที่สำหรับประชาชนทั่วไป
        </span>
        <h1 className="text-2xl font-black text-trd-midnight uppercase mt-1 font-sans tracking-wide">ค้นหาประกาศโอนสิทธิการเช่าที่ราชพัสดุ</h1>
        <p className="text-xs text-trd-text-muted mt-1 leading-relaxed font-medium">
          ค้นหา ตรวจสอบตำแหน่งทางภูมิศาสตร์ และตรวจสอบความถูกต้องของสิทธิการเช่าเพื่อประกอบการตัดสินใจของประชาชนอย่างโปร่งใส
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
              รายการประกาศเสนอโอนสิทธิ์ที่พบบนเงื่อนไขการค้นหา ({listings.length} จาก {totalCount > 0 ? totalCount : listings.length} รายการ)
            </h2>
          </div>

          {error && (
            <FetchErrorAlert onRetry={() => mutate()} />
          )}

          {isLoadingInitialData ? (
            <PropertyCardSkeleton count={3} />
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
                  imageUrls={listing.image_urls}
                  isVerified={listing.status === "ACTIVE"}
                  buildingType={listing.contract.building_type}
                  usableAreaSqm={listing.contract.usable_area_sqm}
                  zoning={listing.contract.zoning}
                  locationLat={listing.contract.location_lat}
                  locationLng={listing.contract.location_lng}
                  annualRent={listing.contract.annual_rent}
                />
              ))}

              {/* Load More Pagination Controls & Retry Error Handling */}
              {!isReachingEnd && (
                <div className="pt-4 text-center">
                  {isPageError ? (
                    <div className="bg-red-950/30 border border-red-800/40 p-4 rounded-xl space-y-3 max-w-md mx-auto">
                      <div className="flex items-center justify-center gap-2 text-red-400 font-mono text-xs font-bold">
                        <svg className="w-4 h-4 text-red-500 animate-pulse" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                        </svg>
                        <span>เกิดข้อผิดพลาดในการโหลดข้อมูลประกาศหน้าถัดไป</span>
                      </div>
                      <button
                        type="button"
                        onClick={retryLoadMore}
                        className="inline-flex items-center gap-2 bg-red-700/30 hover:bg-red-700/50 border border-red-600/40 text-red-200 font-mono text-xs uppercase tracking-widest font-black py-2.5 px-5 rounded-xl transition-all duration-200 shadow-md active:scale-95"
                      >
                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                        </svg>
                        ลองใหม่อีกครั้ง (Retry)
                      </button>
                    </div>
                  ) : (
                    <button
                      type="button"
                      onClick={loadMore}
                      disabled={isLoadingMore}
                      className="inline-flex items-center gap-2 bg-[#0F1A30] hover:bg-[#1E2E4A] border border-trd-secondary/40 text-trd-secondary hover:text-white font-mono text-xs uppercase tracking-widest font-black py-3 px-6 rounded-xl transition-all duration-200 shadow-lg disabled:opacity-50 active:scale-95"
                    >
                      {isLoadingMore ? (
                        <>
                          <div className="w-3.5 h-3.5 border-2 border-trd-secondary border-t-transparent rounded-full animate-spin" />
                          <span>กำลังโหลดข้อมูลเพิ่ม...</span>
                        </>
                      ) : (
                        <>
                          <span>โหลดประกาศเพิ่มอีก ({listings.length}/{totalCount})</span>
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                          </svg>
                        </>
                      )}
                    </button>
                  )}
                </div>
              )}
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

export default function ListingsPage() {
  return (
    <Suspense fallback={
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center font-mono text-xs text-slate-400">
        [ กำลังประมวลผลข้อมูลสิทธิ์เชิงพื้นที่... ]
      </div>
    }>
      <ListingsContent />
    </Suspense>
  );
}
