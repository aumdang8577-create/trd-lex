"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import SearchBar from "@/components/features/SearchBar/SearchBar";
import PropertyCard from "@/components/features/PropertyCard";
import LeaseMap from "@/components/features/Map/LeaseMap";
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
  {
    id: "list-17",
    sellerId: "seller-1",
    seller: { id: "seller-1", thaid_id: "1123456789012", first_name: "สมชาย", last_name: "ใจดี", role: "USER" },
    contractId: "contract-17",
    contract: {
      id: "contract-17",
      contract_number: "TRD-66-017",
      parcel_number: "นภ.3466",
      location_lat: 16.8667,
      location_lng: 102.5667,
      province: "หนองบัวลำภู",
      district: "โนนสัง",
      sub_district: "โนนสัง",
      land_area_sqw: 1500.0,
      is_active: true,
      building_type: null,
      usable_area_sqm: 0.0,
      zoning: "พื้นที่สีเขียว (ชนบทและเกษตรกรรม)",
      annual_rent: 12000.0,
    },
    asking_price: 400000.0,
    estimated_fee: 12000.0,
    description: "ที่ดินราชพัสดุเพื่อการเกษตรกรรมใกล้เขื่อนอุบลรัตน์ อำเภอโนนสัง บรรยากาศดี ดินอุดมสมบูรณ์ เหมาะสำหรับทำการเกษตรประยุกต์ หรือพัฒนาโครงการรีสอร์ทบ้านสวน",
    image_urls: ["https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=800&q=80"],
    status: "ACTIVE",
    createdAt: "2026-07-09T00:00:00Z",
    updatedAt: "2026-07-09T00:00:00Z",
  },
  {
    id: "list-18",
    sellerId: "seller-2",
    seller: { id: "seller-2", thaid_id: "2123456789012", first_name: "สมหญิง", last_name: "รักดี", role: "USER" },
    contractId: "contract-18",
    contract: {
      id: "contract-18",
      contract_number: "TRD-66-018",
      parcel_number: "ขก.5791",
      location_lat: 16.5444,
      location_lng: 102.1333,
      province: "ขอนแก่น",
      district: "ชุมแพ",
      sub_district: "ชุมแพ",
      land_area_sqw: 850.0,
      is_active: true,
      building_type: "คลังสินค้า",
      usable_area_sqm: 600.0,
      zoning: "พื้นที่สีม่วง (อุตสาหกรรม)",
      annual_rent: 12000.0,
    },
    asking_price: 4200000.0,
    estimated_fee: 126000.0,
    description: "สิทธิ์การเช่าคลังสินค้าและอาคารสำนักงานอุตสาหกรรมในอำเภอชุมแพ ขอนแก่น รองรับการขนส่งกระจายสินค้าไปยังภาคอีสานตอนบนและตอนกลาง มีลานจอดรถบรรทุกกว้างขวาง",
    image_urls: ["https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=800&q=80"],
    status: "ACTIVE",
    createdAt: "2026-07-09T00:00:00Z",
    updatedAt: "2026-07-09T00:00:00Z",
  },
  {
    id: "list-19",
    sellerId: "seller-3",
    seller: { id: "seller-3", thaid_id: "3123456789012", first_name: "ประยุทธ์", last_name: "มั่งมี", role: "USER" },
    contractId: "contract-19",
    contract: {
      id: "contract-19",
      contract_number: "TRD-66-019",
      parcel_number: "ชบ.9102",
      location_lat: 13.1733,
      location_lng: 100.9333,
      province: "ชลบุรี",
      district: "ศรีราชา",
      sub_district: "ทุ่งสุขลา",
      land_area_sqw: 1200.0,
      is_active: true,
      building_type: "คลังสินค้า",
      usable_area_sqm: 950.0,
      zoning: "พื้นที่สีม่วง (อุตสาหกรรม)",
      annual_rent: 12000.0,
    },
    asking_price: 5500000.0,
    estimated_fee: 165000.0,
    description: "โกดังโรงงานและคลังสินค้าให้เช่าทำเลเขตเศรษฐกิจพิเศษ EEC ศรีราชา ชลบุรี ใกล้ท่าเรือแหลมฉบัง เหมาะสำหรับงานโลจิสติกส์ จัดเก็บ หรือแปรรูปอุตสาหกรรมขั้นกลาง",
    image_urls: ["https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=800&q=80"],
    status: "ACTIVE",
    createdAt: "2026-07-09T00:00:00Z",
    updatedAt: "2026-07-09T00:00:00Z",
  },
  {
    id: "list-20",
    sellerId: "seller-1",
    seller: { id: "seller-1", thaid_id: "1123456789012", first_name: "สมชาย", last_name: "ใจดี", role: "USER" },
    contractId: "contract-20",
    contract: {
      id: "contract-20",
      contract_number: "TRD-66-020",
      parcel_number: "กท.1001",
      location_lat: 13.78,
      location_lng: 100.54,
      province: "กรุงเทพมหานคร",
      district: "พญาไท",
      sub_district: "สามเสนใน",
      land_area_sqw: 65.0,
      is_active: true,
      building_type: "อาคารพาณิชย์",
      usable_area_sqm: 220.0,
      zoning: "พื้นที่สีแดง (พาณิชยกรรม)",
      annual_rent: 12000.0,
    },
    asking_price: 8500000.0,
    estimated_fee: 255000.0,
    description: "สิทธิ์การเช่าอาคารพาณิชย์ 4 ชั้น ทำเลทองพญาไท กรุงเทพฯ เหมาะทำคลินิกเสริมความงาม สปา สำนักงานใหญ่ขนาดย่อม หรือร้านอาหารพรีเมียม ใกล้สถานีรถไฟฟ้า BTS",
    image_urls: ["https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=800&q=80"],
    status: "ACTIVE",
    createdAt: "2026-07-09T00:00:00Z",
    updatedAt: "2026-07-09T00:00:00Z",
  },
];

function ListingsContent() {
  const [listings, setListings] = useState<Listing[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const searchParams = useSearchParams();

  useEffect(() => {
    const fetchListings = async () => {
      try {
        setLoading(true);
        await new Promise((resolve) => setTimeout(resolve, 500));
        
        // 1. Fetch initial data from API
        const res = await api.getListings();
        let listData = res.data;
        
        // 2. Read query parameters from URL
        const p = searchParams.get("province");
        const d = searchParams.get("district");
        const min = searchParams.get("minPrice");
        const max = searchParams.get("maxPrice");
        const z = searchParams.get("zoning");
        const bt = searchParams.get("buildingType");

        // 3. Apply active filters from URL parameters if present
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
          listData = listData.filter((l) => l.contract.zoning.includes(zoneKeyword));
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
        
        setListings(listData);
      } catch (err) {
        console.error("Error fetching listings, using initial mock:", err);
        let listData = [...initialListings];
        
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
          listData = listData.filter((l) => l.contract.zoning.includes(zoneKeyword));
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
        
        setListings(listData);
      } finally {
        setLoading(false);
      }
    };
    fetchListings();
  }, [searchParams]);

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
        const zoneKeyword = searchData.zoning.split(" ")[0]; // Get "พื้นที่สีแดง", "พื้นที่สีเขียว", etc.
        filtered = filtered.filter((l) => l.contract.zoning.includes(zoneKeyword));
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
        const zoneKeyword = searchData.zoning.split(" ")[0];
        filtered = filtered.filter((l) => l.contract.zoning.includes(zoneKeyword));
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
