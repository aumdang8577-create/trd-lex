"use client";

import { useState, use, useEffect } from "react";
import Image from "next/image";
import Button from "@/components/ui/Button";
import Badge from "@/components/ui/Badge";
import Card, { CardContent } from "@/components/ui/Card";
import LeaseMap from "@/components/features/Map/LeaseMap";
import Breadcrumb from "@/components/features/Breadcrumb";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { formatCurrency } from "@/lib/utils";
import type { Listing } from "@/types";
import api from "@/lib/api";
import TransferGuideModal from "@/components/features/TransferGuideModal";

const mockListings: Record<string, Listing> = {
  "list-1": {
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
  "list-2": {
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
  "list-3": {
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
  "list-4": {
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
  "list-5": {
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
  "list-6": {
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
  "list-7": {
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
  "list-8": {
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
  "list-9": {
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
  "list-10": {
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
  "list-11": {
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
  "list-12": {
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
  "list-13": {
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
  "list-14": {
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
  "list-15": {
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
  "list-16": {
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
  "list-17": {
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
  "list-18": {
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
  "list-19": {
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
  "list-20": {
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
};

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
  "dszfgdrhtrj.jpg",
  "esdgdxfh.jpg"
];

const replaceWithLocalImage = (imgUrl: string, id: string): string => {
  if (imgUrl.includes("unsplash.com") || !imgUrl.startsWith("/images/")) {
    let hash = 0;
    for (let i = 0; i < id.length; i++) {
      hash = id.charCodeAt(i) + ((hash << 5) - hash);
    }
    const idx = Math.abs(hash) % localImageFiles.length;
    return `/images/${localImageFiles[idx]}`;
  }
  return imgUrl;
};

const mapListingWithLocalImages = (item: Listing): Listing => {
  if (!item) return item;
  return {
    ...item,
    image_urls: item.image_urls.map((url) => replaceWithLocalImage(url, item.id))
  };
};

interface PropertyDetailPageProps {
  params: Promise<{ id: string }>;
}

export default function PropertyDetailPage({ params }: PropertyDetailPageProps) {
  const router = useRouter();
  const { id } = use(params);
  const [listing, setListing] = useState<Listing>(mapListingWithLocalImages(mockListings[id] || mockListings["list-1"]));
  const [loadingListing, setLoadingListing] = useState<boolean>(true);
  const [userRole, setUserRole] = useState<string>("GUEST");
  const [isAuthModalOpen, setIsAuthModalOpen] = useState<boolean>(false);

  useEffect(() => {
    const checkRole = () => {
      const role = localStorage.getItem("trd_user_role") || "GUEST";
      setUserRole(role);
    };
    checkRole();
    const interval = setInterval(checkRole, 1000);
    window.addEventListener("storage", checkRole);
    return () => {
      clearInterval(interval);
      window.removeEventListener("storage", checkRole);
    };
  }, []);

  useEffect(() => {
    let active = true;
    const fetchListing = async () => {
      try {
        setLoadingListing(true);
        const data = await api.getListingById(id);
        if (active && data) {
          setListing(mapListingWithLocalImages(data));
        }
      } catch (err) {
        console.error("Error fetching listing from DB, using fallback mock:", err);
      } finally {
        if (active) {
          setLoadingListing(false);
        }
      }
    };
    fetchListing();
    return () => {
      active = false;
    };
  }, [id]);

  const [requestSuccess, setRequestSuccess] = useState(false);
  const [showContact, setShowContact] = useState(false);
  const [isGuideOpen, setIsGuideOpen] = useState(false);
  const [calcType, setCalcType] = useState<"GENERAL" | "FAMILY" | "CO_LESSEE">("GENERAL");
  const [calcShare, setCalcShare] = useState<number>(100);
  const [calcResult, setCalcResult] = useState<any>(null);

  // Advanced calculator states
  const [isDetailedCalc, setIsDetailedCalc] = useState(false);
  const [calcPurpose, setCalcPurpose] = useState<"RESIDENTIAL" | "AGRICULTURE" | "COMMERCIAL">("RESIDENTIAL");
  const [calcRegion, setCalcRegion] = useState<"BKK" | "PROVINCIAL">("PROVINCIAL");
  const [calcClass, setCalcClass] = useState<"CLASS_1" | "CLASS_2" | "CLASS_3">("CLASS_1");
  const [calcAppraisal, setCalcAppraisal] = useState<number>(20000);
  const [calcLandArea, setCalcLandArea] = useState<number>(listing.contract.land_area_sqw);
  const [calcBuildingType, setCalcBuildingType] = useState<string>("ที่ดินเปล่า");
  const [calcUsableArea, setCalcUsableArea] = useState<number>(0);
  const [calcBldAppraisal, setCalcBldAppraisal] = useState<number>(8000);
  const [calcDepreciation, setCalcDepreciation] = useState<number>(0);

  useEffect(() => {
    if (listing) {
      setCalcRegion(listing.contract.province === "กรุงเทพมหานคร" ? "BKK" : "PROVINCIAL");
      setCalcLandArea(listing.contract.land_area_sqw);
      setCalcBuildingType(listing.contract.building_type || "ที่ดินเปล่า");
      setCalcUsableArea(listing.contract.usable_area_sqm || 0);
    }
  }, [listing]);

  useEffect(() => {
    const calculateOfficialFee = async () => {
      try {
        let reqData: any = {
          transfer_type: calcType,
          transfer_share: calcType === "CO_LESSEE" ? calcShare : 100,
          contract_number: listing.contract.contract_number
        };

        if (isDetailedCalc) {
          reqData = {
            ...reqData,
            lease_purpose: calcPurpose,
            region_type: calcRegion,
            location_class: calcClass,
            land_area_sqw: isNaN(calcLandArea) ? 0 : calcLandArea,
            appraisal_land_sqw: isNaN(calcAppraisal) ? 0 : calcAppraisal,
            building_type: calcBuildingType,
            usable_area_sqm: calcBuildingType !== "ที่ดินเปล่า" ? (isNaN(calcUsableArea) ? 0 : calcUsableArea) : 0,
            appraisal_bld_sqm: calcBuildingType !== "ที่ดินเปล่า" ? (isNaN(calcBldAppraisal) ? 0 : calcBldAppraisal) : 0,
            building_depreciation: calcBuildingType !== "ที่ดินเปล่า" ? (isNaN(calcDepreciation) ? 0 : calcDepreciation) : 0,
          };
        } else {
          reqData.annual_rent = listing.contract.annual_rent || 12000.0;
        }

        const res = await api.calculateTransferFee(reqData);
        setCalcResult(res);
      } catch (err) {
        console.error("Error calculating official fee via API, using frontend fallback:", err);
        // Fallback calculation logic matching the backend rules
        let rent = listing.contract.annual_rent || 12000.0;
        if (isDetailedCalc) {
          if (calcPurpose === "AGRICULTURE") {
            rent = Math.max(200, (calcLandArea / 400.0) * 200.0);
          } else if (calcPurpose === "COMMERCIAL") {
            rent = (calcLandArea * calcAppraisal) * 0.03;
          } else {
            // Residential
            const rate = calcRegion === "BKK" ? 10.0 : 4.5;
            rent = calcLandArea * rate * 12.0;
          }
        }
        
        const base = rent * 6.0;
        let final = base;
        let desc = "คิดอัตราปกติ (6 เท่าของค่าเช่ารายปี)";

        if (calcType === "FAMILY") {
          final = base * 0.25;
          desc = "ได้รับสิทธิลดหย่อนร้อยละ 75 (โอนให้บุพการี/ผู้สืบสันดาน/คู่สมรส)";
        } else if (calcType === "CO_LESSEE") {
          const ratio = calcShare / 100.0;
          final = base * ratio;
          desc = `คิดตามสัดส่วนสิทธิที่โอน (${calcShare}%) ระหว่างผู้เช่าร่วม`;
        }

        setCalcResult({
          annual_rent: rent,
          base_fee: base,
          discount_description: desc,
          final_fee: final,
          calculated_arrangement_fee: rent * 2.0
        });
      }
    };

    const timer = setTimeout(() => {
      calculateOfficialFee();
    }, 400);

    return () => clearTimeout(timer);
  }, [
    calcType,
    calcShare,
    listing,
    isDetailedCalc,
    calcPurpose,
    calcRegion,
    calcClass,
    calcAppraisal,
    calcLandArea,
    calcBuildingType,
    calcUsableArea,
    calcBldAppraisal,
    calcDepreciation
  ]);

  // Fee calculation strictly based on Treasury Department Order 683/2560 (การคิดค่าเช่าค่าธรรมเนียม.md)
  const annualRentValue = listing.contract.annual_rent || 12000.0;
  const generalTransferFee = annualRentValue * 6.0;
  const arrangementFee = annualRentValue * 2.0;
  const familyTransferFee = annualRentValue * 1.5;
  
  // Rounded per Rule 23.2 (nearest 10 Baht)
  const roundedGeneral = Math.round(generalTransferFee / 10) * 10;
  const roundedArrangement = Math.round(arrangementFee / 10) * 10;
  const roundedFamily = Math.round(familyTransferFee / 10) * 10;
  const roundedTotalFee = roundedGeneral + roundedArrangement;

  const handleRequestTransfer = () => {
    setRequestSuccess(true);
    setTimeout(() => setRequestSuccess(false), 3000);
  };

  const getRegionName = (prov: string) => {
    if (["อุดรธานี", "ขอนแก่น", "หนองคาย"].includes(prov)) return "ภาคตะวันออกเฉียงเหนือ";
    if (["เชียงใหม่", "ตาก"].includes(prov)) return "ภาคเหนือ";
    if (["ชลบุรี", "ระยอง"].includes(prov)) return "ภาคตะวันออก";
    return "ภาคกลาง";
  };

  const breadcrumbItems = [
    { label: "ค้นหาทำเลศักยภาพ", href: "/listings" },
    { label: getRegionName(listing.contract.province), href: `/listings?query=${getRegionName(listing.contract.province)}` },
    { label: listing.contract.province, href: `/listings?province=${listing.contract.province}` },
    { label: `อ. ${listing.contract.district}`, href: `/listings?query=${listing.contract.district}` },
    { label: `สัญญาเช่าเลขที่ ${listing.contract.contract_number}` }
  ];

  return (
    <>
      <Breadcrumb items={breadcrumbItems} />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Back link */}
        <Link href="/listings" className="inline-flex items-center gap-1.5 text-xs text-trd-primary font-medium hover:underline mb-6">
          ← ย้อนกลับไปหน้าค้นหา
        </Link>

      {/* Main Image Banner Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8 h-[350px] md:h-[450px]">
        <div className="md:col-span-2 relative h-full w-full rounded-2xl overflow-hidden shadow-sm">
          <Image
            src={listing.image_urls[0]}
            alt={`ภาพแปลงที่ดิน ${listing.contract.parcel_number}`}
            fill
            className="object-cover"
            priority
            sizes="(max-width: 768px) 100vw, 66vw"
          />
        </div>
        <div className="hidden md:flex flex-col gap-4 h-full">
          {listing.image_urls[1] ? (
            <div className="relative flex-1 w-full rounded-2xl overflow-hidden shadow-sm">
              <Image
                src={listing.image_urls[1]}
                alt="ภาพแปลงที่ดินเพิ่มเติม"
                fill
                className="object-cover"
                sizes="33vw"
              />
            </div>
          ) : (
            <div className="relative flex-1 w-full rounded-2xl overflow-hidden shadow-sm bg-gray-50 flex items-center justify-center text-gray-300 border border-trd-border">
              <span>ไม่มีรูปภาพเพิ่มเติม</span>
            </div>
          )}
          <div className="relative flex-1 w-full rounded-2xl overflow-hidden shadow-sm">
            <LeaseMap listings={[listing]} center={[listing.contract.location_lat, listing.contract.location_lng]} zoom={14} className="!h-full !rounded-none !border-none" />
          </div>
        </div>
      </div>

      {/* Warning Banner (Disclaimer) */}
      <div className="bg-yellow-50 border-l-4 border-trd-gold p-4 my-6 rounded-md shadow-sm">
        <div className="flex">
          <div className="flex-shrink-0">
            <svg className="h-5 w-5 text-trd-gold" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
          </div>
          <div className="ml-3">
            <h3 className="text-sm font-medium text-yellow-800">
              ข้อควรทราบก่อนการเจรจาโอนสิทธิ
            </h3>
            <div className="mt-2 text-xs text-yellow-700 leading-relaxed">
              <p>
                TRD-LEX เป็นเพียงแพลตฟอร์มกลางในการแสดงข้อมูลทำเลศักยภาพเท่านั้น 
                <strong> การทำธุรกรรมเพื่อเปลี่ยนแปลงชื่อผู้เช่าในสัญญาอย่างสมบูรณ์ จะต้องดำเนินการ ณ สำนักงานธนารักษ์พื้นที่ที่รับผิดชอบเท่านั้น</strong> 
                โปรดระวังการโอนเงินหรือทำธุรกรรมผ่านบุคคลที่สาม
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Layout Split: Content vs Sticky Sidebar */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Details */}
        <div className="lg:col-span-8 space-y-8">
          <div>
            <div className="flex flex-wrap items-center gap-3 mb-3">
              <Badge variant="valid">เปิดข้อเสนอหาผู้รับโอนสิทธิ</Badge>
              <span className="trd-verified-badge text-[10px]">
                ✅ Verified by TRD (Smart Validation)
              </span>
              {loadingListing ? (
                <Badge variant="outline" className="border-trd-secondary text-trd-secondary bg-[#070D1A] text-[9px] font-mono animate-pulse">
                  [ DATABASE: กำลังดึงข้อมูล... ]
                </Badge>
              ) : (
                <Badge variant="outline" className="border-emerald-500 text-emerald-400 bg-[#070D1A] text-[9px] font-mono">
                  [ DATABASE: ดึงข้อมูลสำเร็จ ]
                </Badge>
              )}
            </div>
            <h1 className="text-3xl font-bold text-trd-primary leading-tight">
              สิทธิ์การเช่าที่ดินราชพัสดุ อำเภอ{listing.contract.district}, จังหวัด{listing.contract.province}
            </h1>
            <p className="text-gray-500 mt-2">
              เลขที่สัญญาเช่า: {listing.contract.contract_number} • หมายเลขทะเบียนที่ราชพัสดุ: {listing.contract.parcel_number}
            </p>
          </div>

          {/* Quick Specs Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-4">
            {[
              { label: "ขนาดที่ดิน", val: `${listing.contract.land_area_sqw} ตร.ว.`, icon: "📐" },
              { label: "ประเภทอาคาร", val: listing.contract.building_type || "ที่ดินเปล่า", icon: "🏢" },
              { label: "พื้นที่ใช้สอย", val: listing.contract.usable_area_sqm && listing.contract.usable_area_sqm > 0 ? `${listing.contract.usable_area_sqm} ตร.ม.` : "ไม่มี (ที่ดินเปล่า)", icon: "🏗️" },
              { label: "ผังเมือง (Zoning)", val: listing.contract.zoning || "ไม่ระบุ", icon: "🎨" },
              { label: "จังหวัด", val: listing.contract.province, icon: "📍" },
              { label: "ที่ราชพัสดุแปลงหมายเลขทะเบียนที่", val: listing.contract.parcel_number, icon: "🗺️" },
              { label: "สถานะสัญญา", val: "ปกติ (Active)", icon: "🛡️" },
            ].map((spec) => (
              <div key={spec.label} className="bg-gray-50/80 border border-trd-border/50 rounded-xl p-4 flex flex-col items-center justify-center text-center">
                <span className="text-2xl mb-1">{spec.icon}</span>
                <span className="text-[10px] text-gray-400 font-medium uppercase tracking-wider">{spec.label}</span>
                <span className="text-sm font-bold text-trd-primary mt-0.5">{spec.val}</span>
              </div>
            ))}
          </div>

          {/* Description */}
          <div className="border-t border-trd-border/50 pt-6">
            <h3 className="text-lg font-semibold text-trd-primary mb-3">รายละเอียดคำอธิบาย</h3>
            <p className="text-gray-600 leading-relaxed text-sm whitespace-pre-line">
              {listing.description}
            </p>
          </div>

          {/* Facilities / Infrastructure */}
          <div className="border-t border-trd-border/50 pt-6">
            <h3 className="text-lg font-semibold text-trd-primary mb-4">สิ่งอำนวยความสะดวกและระบบสาธารณูปโภค</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm text-gray-600">
              {[
                { title: "ระบบไฟฟ้าแรงดันต่ำ", check: true },
                { title: "ระบบน้ำประปาส่วนภูมิภาค", check: true },
                { title: "ติดถนนสาธารณะหลัก", check: true },
                { title: "ใกล้แหล่งชุมชนและร้านค้า", check: true },
              ].map((fac) => (
                <div key={fac.title} className="flex items-center gap-2">
                  <span className="text-status-valid">✓</span>
                  <span>{fac.title}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Pricing & Action Box (Sticky) */}
        <div className="lg:col-span-4 lg:sticky lg:top-24">
          <Card className="overflow-hidden border border-trd-border shadow-md">
            <div className="bg-trd-primary text-white p-6">
              <span className="text-xs text-white/70 block mb-1">ราคาเสนอโอนสิทธิ์</span>
              <h2 className="text-3xl font-extrabold text-trd-secondary">
                {formatCurrency(listing.asking_price)}
              </h2>
            </div>
            
            <CardContent className="p-6 space-y-6">
              {/* Fee Breakdown Table */}
              <div className="space-y-3">
                <h4 className="text-xs font-bold text-trd-primary uppercase tracking-wide border-b border-trd-border/50 pb-2">
                  ประมาณการค่าธรรมเนียม (ระเบียบธนารักษ์)
                </h4>

                <div className="space-y-2 text-xs">
                  <div className="flex justify-between">
                    <span className="text-gray-500">1. ค่าธรรมเนียมการโอนสิทธิ์ (6 เท่า)</span>
                    <span className="font-semibold text-gray-800">{formatCurrency(roundedGeneral)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">2. ค่าธรรมเนียมจัดให้เช่า (2 เท่า)</span>
                    <span className="font-semibold text-gray-800">{formatCurrency(roundedArrangement)}</span>
                  </div>
                  <div className="flex justify-between text-status-valid font-medium">
                    <span>3. โอนสิทธิ์กรณีทายาท (1.5 เท่า)</span>
                    <span>{formatCurrency(roundedFamily)}</span>
                  </div>
                  
                  <div className="flex justify-between border-t border-trd-border/50 pt-2 font-bold text-sm text-trd-primary">
                    <span>รวมอัตราปกติ (1 + 2)</span>
                    <span className="text-trd-secondary-dark">{formatCurrency(roundedTotalFee)}</span>
                  </div>
                </div>
              </div>

              {/* Official Transfer Fee Calculator */}
              <div className="border-t border-trd-border/50 pt-4 space-y-3">
                <h4 className="text-xs font-bold text-trd-primary uppercase tracking-wide border-b border-trd-border/50 pb-2 flex items-center justify-between">
                  <span>🧮 เครื่องคิดเลขประเมินค่าธรรมเนียม</span>
                  <span className="text-[10px] bg-trd-primary/10 text-trd-primary px-1.5 py-0.5 rounded">
                    ระเบียบราชการ
                  </span>
                </h4>
                
                <div className="space-y-2.5 text-xs">
                  {/* Detailed Switch */}
                  <div className="flex items-center justify-between bg-trd-primary/5 px-2.5 py-2 rounded-lg border border-trd-primary/10">
                    <span className="text-[10px] font-semibold text-trd-primary">เปิดเครื่องคำนวณขั้นสูง (ระเบียบราชการ)</span>
                    <input
                      id="calc-detailed-mode"
                      name="detailedCalc"
                      type="checkbox"
                      checked={isDetailedCalc}
                      title="คำนวณแบบละเอียด"
                      onChange={(e) => setIsDetailedCalc(e.target.checked)}
                      className="w-3.5 h-3.5 text-trd-primary border-gray-300 rounded focus:ring-trd-primary accent-trd-primary cursor-pointer"
                    />
                  </div>

                  {isDetailedCalc && (
                    <div className="space-y-2 border border-dashed border-trd-border/60 p-2.5 rounded-lg bg-gray-50/50">
                      <div>
                        <label className="block text-[9px] text-gray-500 font-semibold mb-0.5">วัตถุประสงค์การเช่า</label>
                        <select
                          id="calc-purpose"
                          name="calcPurpose"
                          value={calcPurpose}
                          onChange={(e: any) => setCalcPurpose(e.target.value)}
                          className="w-full px-2 py-1 rounded border border-trd-border bg-white text-[11px] text-gray-700"
                        >
                          <option value="RESIDENTIAL">เพื่ออยู่อาศัย (เอกสาร 1)</option>
                          <option value="AGRICULTURE">เพื่อประกอบเกษตรกรรม (เอกสาร 2)</option>
                          <option value="COMMERCIAL">เพื่อการพาณิชยกรรม (เอกสาร 3)</option>
                        </select>
                      </div>

                      <div className="grid grid-cols-2 gap-1.5">
                        <div>
                          <label className="block text-[9px] text-gray-500 font-semibold mb-0.5">ภูมิภาค</label>
                          <select
                            id="calc-region"
                            name="calcRegion"
                            value={calcRegion}
                            onChange={(e: any) => setCalcRegion(e.target.value)}
                            className="w-full px-2 py-1 rounded border border-trd-border bg-white text-[11px] text-gray-700"
                          >
                            <option value="BKK">กรุงเทพมหานคร (ก)</option>
                            <option value="PROVINCIAL">จังหวัดอื่น (ข)</option>
                          </select>
                        </div>
                        <div>
                          <label className="block text-[9px] text-gray-500 font-semibold mb-0.5">ระดับทำเล</label>
                          <select
                            id="calc-class"
                            name="calcClass"
                            value={calcClass}
                            onChange={(e: any) => setCalcClass(e.target.value)}
                            className="w-full px-2 py-1 rounded border border-trd-border bg-white text-[11px] text-gray-700"
                          >
                            <option value="CLASS_1">ทำเลชั้น 1</option>
                            <option value="CLASS_2">ทำเลชั้น 2</option>
                            <option value="CLASS_3">ทำเลชั้น 3</option>
                          </select>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-1.5">
                        <div>
                          <label className="block text-[9px] text-gray-500 font-semibold mb-0.5">เนื้อที่ดิน (ตร.ว.)</label>
                          <input
                            id="calc-land-area"
                            name="calcLandArea"
                            type="number"
                            value={calcLandArea}
                            onChange={(e) => setCalcLandArea(Number(e.target.value))}
                            className="w-full px-2 py-1 rounded border border-trd-border bg-white text-[11px] text-gray-700"
                          />
                        </div>
                        <div>
                          <label className="block text-[9px] text-gray-500 font-semibold mb-0.5">ป.ม. ที่ดิน (บาท/ตร.ว.)</label>
                          <input
                            id="calc-appraisal"
                            name="calcAppraisal"
                            type="number"
                            value={calcAppraisal}
                            onChange={(e) => setCalcAppraisal(Number(e.target.value))}
                            className="w-full px-2 py-1 rounded border border-trd-border bg-white text-[11px] text-gray-700"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-[9px] text-gray-500 font-semibold mb-0.5">ประเภทอาคาร</label>
                        <select
                          id="calc-building-type"
                          name="calcBuildingType"
                          value={calcBuildingType}
                          onChange={(e: any) => setCalcBuildingType(e.target.value)}
                          className="w-full px-2 py-1 rounded border border-trd-border bg-white text-[11px] text-gray-700"
                        >
                          <option value="ที่ดินเปล่า">ที่ดินเปล่า</option>
                          <option value="บ้านพักอาศัย">บ้านพักอาศัย</option>
                          <option value="อาคารพาณิชย์">อาคารพาณิชย์</option>
                          <option value="โรงงาน/คลังสินค้า">โรงงาน/คลังสินค้า</option>
                          <option value="BOT">โครงการ B.O.T</option>
                        </select>
                      </div>

                      {calcBuildingType !== "ที่ดินเปล่า" && (
                        <div className="grid grid-cols-3 gap-1 border-t border-trd-border/30 pt-1.5 mt-1.5">
                          <div>
                            <label className="block text-[8px] text-gray-500 font-semibold mb-0.5">พท.ใช้สอย(ตรม.)</label>
                            <input
                              id="calc-usable-area"
                              name="calcUsableArea"
                              type="number"
                              value={calcUsableArea}
                              onChange={(e) => setCalcUsableArea(Number(e.target.value))}
                              className="w-full px-1 py-0.5 rounded border border-trd-border bg-white text-[10px] text-gray-700"
                            />
                          </div>
                          <div>
                            <label className="block text-[8px] text-gray-500 font-semibold mb-0.5">ป.ม.อาคาร(/ตรม)</label>
                            <input
                              id="calc-bld-appraisal"
                              name="calcBldAppraisal"
                              type="number"
                              value={calcBldAppraisal}
                              onChange={(e) => setCalcBldAppraisal(Number(e.target.value))}
                              className="w-full px-1 py-0.5 rounded border border-trd-border bg-white text-[10px] text-gray-700"
                            />
                          </div>
                          <div>
                            <label className="block text-[8px] text-gray-500 font-semibold mb-0.5">ค่าเสื่อมสะสม(%)</label>
                            <input
                              id="calc-depreciation"
                              name="calcDepreciation"
                              type="number"
                              value={calcDepreciation}
                              onChange={(e) => setCalcDepreciation(Number(e.target.value))}
                              className="w-full px-1 py-0.5 rounded border border-trd-border bg-white text-[10px] text-gray-700"
                            />
                          </div>
                        </div>
                      )}
                    </div>
                  )}

                  <div>
                    <label className="block text-[10px] text-gray-400 font-semibold mb-1 uppercase">
                      ประเภทผู้รับโอน
                    </label>
                    <select
                      id="calc-transfer-type"
                      name="calcType"
                      value={calcType}
                      title="เลือกประเภทผู้รับโอน"
                      onChange={(e) => setCalcType(e.target.value as any)}
                      className="w-full px-2.5 py-1.5 rounded border border-trd-border bg-white text-xs text-gray-700 focus:outline-none focus:ring-1 focus:ring-trd-primary"
                    >
                      <option value="GENERAL">บุคคลทั่วไป (อัตราปกติ)</option>
                      <option value="FAMILY">บุพการี/ผู้สืบสันดาน/คู่สมรส (ลด 75%)</option>
                      <option value="CO_LESSEE">ผู้เช่าร่วมกัน (ตามสัดส่วน)</option>
                    </select>
                  </div>

                  {calcType === "CO_LESSEE" && (
                    <div>
                      <label className="block text-[10px] text-gray-400 font-semibold mb-1 uppercase flex justify-between">
                        <span>สัดส่วนที่โอนสิทธิ์</span>
                        <span className="text-trd-primary font-bold">{calcShare}%</span>
                      </label>
                      <input
                        id="calc-share"
                        name="calcShare"
                        type="range"
                        min="1"
                        max="100"
                        value={calcShare}
                        title="สัดส่วนการโอน"
                        onChange={(e) => setCalcShare(parseFloat(e.target.value))}
                        className="w-full h-1.5 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-trd-primary"
                      />
                    </div>
                  )}

                  <div className="bg-gray-50 rounded-lg p-3 border border-gray-100 space-y-1.5 mt-2">
                    <div className="flex justify-between text-[11px]">
                      <span className="text-gray-500">
                        {isDetailedCalc ? "ประมาณการค่าเช่ารายปี:" : "ค่าเช่ารายปีสัญญา:"}
                      </span>
                      <span className="font-semibold text-gray-700">
                        {calcResult ? `฿${new Intl.NumberFormat("th-TH").format(calcResult.annual_rent)} / ปี` : "กำลังคำนวณ..."}
                      </span>
                    </div>
                    {calcResult?.calculated_arrangement_fee !== undefined && (
                      <div className="flex justify-between text-[11px] border-b border-gray-200/40 pb-1">
                        <span className="text-gray-500">ค่าธรรมเนียมจัดให้เช่า:</span>
                        <span className="font-semibold text-gray-700">
                          ฿{new Intl.NumberFormat("th-TH").format(calcResult.calculated_arrangement_fee)}
                        </span>
                      </div>
                    )}
                    {calcResult ? (
                      <>
                        <div className="flex justify-between text-[11px]">
                          <span className="text-gray-500">ฐานค่าธรรมเนียม (6 เท่า):</span>
                          <span className="font-semibold text-gray-700">
                            ฿{new Intl.NumberFormat("th-TH").format(calcResult.base_fee)}
                          </span>
                        </div>
                        {calcResult.calculation_details?.method && (
                          <div className="text-[9px] text-gray-400 font-medium">
                            วิธีประเมิน: {calcResult.calculation_details.method}
                          </div>
                        )}
                        <div className="text-[10px] text-status-valid font-medium bg-status-valid/5 px-2 py-0.5 rounded border border-status-valid/10 w-fit leading-relaxed">
                          💡 {calcResult.discount_description}
                        </div>
                        <div className="flex justify-between items-baseline border-t border-gray-200/55 pt-1.5 font-bold text-xs">
                          <span className="text-trd-primary">ค่าโอนสิทธิ์สุทธิ:</span>
                          <span className="text-base text-trd-secondary-dark font-extrabold">
                            ฿{new Intl.NumberFormat("th-TH").format(calcResult.final_fee)}
                          </span>
                        </div>
                      </>
                    ) : (
                      <div className="text-center text-[10px] text-gray-400 py-1">
                        กำลังคำนวณ...
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-3 pt-2">
                {showContact && (
                  <div className="bg-status-valid/10 border border-status-valid/20 text-status-valid text-xs rounded-lg p-3 text-center space-y-1">
                    <p className="font-semibold text-gray-700">ข้อมูลติดต่อผู้เช่าเดิม:</p>
                    <p className="font-bold text-base text-trd-primary">📞 {listing.seller.phone_number || "081-234-5678"}</p>
                    <p className="text-[10px] text-gray-500">โปรดโทรติดต่อเพื่อทำการเจรจาโอนสิทธิ์นอกระบบ</p>
                  </div>
                )}
                <Button
                  variant="primary"
                  className="w-full py-3 text-sm font-semibold animate-pulse hover:animate-none"
                  onClick={() => {
                    if (userRole === "GUEST") {
                      setIsAuthModalOpen(true);
                    } else {
                      setShowContact(!showContact);
                    }
                  }}
                >
                  {showContact ? "ซ่อนข้อมูลติดต่อ" : "แสดงความสนใจ (Contact Lessee)"}
                </Button>
                <Button variant="ghost" className="w-full py-2.5 text-xs text-gray-500 font-bold hover:text-trd-primary" onClick={() => setIsGuideOpen(true)}>
                  📘 เปิดคู่มือและขั้นตอนการโอนสิทธิ์
                </Button>
              </div>

              {/* Seller details */}
              <div className="border-t border-trd-border/30 pt-4 text-center">
                <p className="text-[10px] text-gray-400">ผู้ถือสิทธิ์คนปัจจุบัน</p>
                <p className="text-xs font-semibold text-gray-700 mt-1">คุณ{listing.seller.first_name} {listing.seller.last_name}</p>
                <p className="text-[10px] text-status-valid mt-1">✓ ยืนยันตัวตนผ่าน ThaID เรียบร้อย</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
    
    {/* Transfer Guide Modal */}
    <TransferGuideModal isOpen={isGuideOpen} onClose={() => setIsGuideOpen(false)} />

    {/* ThaID Auth Modal */}
    <ThaidAuthModal
      isOpen={isAuthModalOpen}
      onClose={() => setIsAuthModalOpen(false)}
      onLogin={() => router.push("/login")}
    />
  </>
  );
}

interface ThaidAuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLogin: () => void;
}

function ThaidAuthModal({ isOpen, onClose, onLogin }: ThaidAuthModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#070D1A]/80 backdrop-blur-md p-4 transition-all duration-300">
      <div className="bg-[#0F1A30] border-2 border-trd-secondary/60 rounded-2xl max-w-md w-full overflow-hidden shadow-[0_20px_50px_rgba(212,175,55,0.25)] relative p-6 space-y-6 animate-scale-up">
        
        {/* Header decoration */}
        <div className="absolute top-0 left-0 right-0 h-1.5 bg-gold-gradient"></div>
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-white transition-colors font-bold font-mono text-sm"
          title="ปิด"
        >
          ✕
        </button>

        {/* Content */}
        <div className="text-center space-y-4 pt-2">
          {/* Logo or Icon */}
          <div className="mx-auto w-16 h-16 bg-[#070D1A] rounded-full border border-[#1E2E4A] flex items-center justify-center p-2.5 shadow-inner">
            <img
              src="https://upload.wikimedia.org/wikipedia/th/8/81/The_Treasury_Department_Logo.png"
              alt="ตราสัญลักษณ์กรมธนารักษ์"
              className="w-full h-full object-contain animate-pulse"
            />
          </div>

          <h3 className="text-base font-black text-white uppercase tracking-wide font-sans">
            จำเป็นต้องยืนยันตัวตน (ThaID Required)
          </h3>
          
          <p className="text-xs text-slate-300 leading-relaxed font-medium font-sans">
            เพื่อความปลอดภัยและป้องกันผู้ไม่ประสงค์ดี ระบบกำหนดให้เฉพาะผู้ใช้ที่ยืนยันตัวตนดิจิทัลผ่านระบบ ThaID ของกรมการปกครองแล้วเท่านั้น จึงจะสามารถแสดงความสนใจหรือเข้าถึงข้อมูลติดต่อของผู้เสนอขายสิทธิ์สัญญาเช่าได้
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col gap-2.5 pt-2">
          <button
            onClick={onLogin}
            className="w-full bg-gold-gradient border border-transparent text-[#0F1A30] text-xs font-mono uppercase tracking-widest font-black py-3 rounded-xl shadow-neon-gold hover:opacity-90 transition-all duration-150 text-center cursor-pointer"
          >
            เข้าสู่ระบบด้วย ThaID
          </button>
          
          <button
            onClick={onClose}
            className="w-full border border-[#1E2E4A] text-slate-300 bg-[#070D1A]/50 text-xs font-mono uppercase tracking-widest font-black py-2.5 rounded-xl hover:bg-[#1E2E4A]/30 transition-all duration-150 text-center cursor-pointer"
          >
            ยกเลิก
          </button>
        </div>
      </div>
    </div>
  );
}
