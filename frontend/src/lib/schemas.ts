// ===========================
// TRD-LEX Data Schema Validation (Zod)
// Prevents UI crashes from missing or corrupted API payload fields
// ===========================

import { z } from "zod";
import type { Listing, ListingListResponse, LeaseContract, User } from "@/types";

export const RoleSchema = z.enum(["USER", "ADMIN"]);
export const ListingStatusSchema = z.enum(["ACTIVE", "SOLD", "HIDDEN", "IN_NEGOTIATION"]);

export const UserSchema = z.object({
  id: z.string(),
  thaid_id: z.string().default("0000000000000"),
  first_name: z.string().default("ไม่ระบุชื่อ"),
  last_name: z.string().default("ไม่ระบุนามสกุล"),
  phone_number: z.string().nullable().optional(),
  role: RoleSchema.default("USER"),
});

export const LeaseContractSchema = z.object({
  id: z.string(),
  contract_number: z.string().default("TRD-00-000"),
  parcel_number: z.string().default("ไม่ระบุแปลง"),
  location_lat: z.number().default(13.7563),
  location_lng: z.number().default(100.5018),
  province: z.string().default("กรุงเทพมหานคร"),
  district: z.string().default("ไม่ระบุอำเภอ"),
  sub_district: z.string().default("ไม่ระบุตำบล"),
  land_area_sqw: z.number().default(0),
  is_active: z.boolean().default(true),
  building_type: z.string().nullable().optional(),
  usable_area_sqm: z.number().nullable().optional(),
  zoning: z.string().nullable().optional(),
  annual_rent: z.number().optional(),

  // Extended Treasury Valuation Attributes with defaults
  region_type: z.string().nullable().optional(),
  location_class: z.string().nullable().optional(),
  purpose: z.string().nullable().optional(),
  tenant_category: z.string().nullable().optional(),
  appraisal_land_sqw: z.number().nullable().optional(),
  appraisal_bld_sqm: z.number().nullable().optional(),
  building_depreciation: z.number().nullable().optional(),
  calculated_annual_rent: z.number().nullable().optional(),
  calculated_arrange_fee: z.number().nullable().optional(),
});

export const ListingSchema = z.object({
  id: z.string(),
  sellerId: z.string(),
  seller: UserSchema,
  contractId: z.string(),
  contract: LeaseContractSchema,
  asking_price: z.number().default(0),
  estimated_fee: z.number().default(0),
  description: z.string().nullable().optional(),
  image_urls: z.array(z.string()).default([]),
  status: ListingStatusSchema.default("ACTIVE"),
  createdAt: z.string().default(() => new Date().toISOString()),
  updatedAt: z.string().default(() => new Date().toISOString()),
});

export const ListingMetaSchema = z.object({
  total_items: z.number().default(0),
  page: z.number().default(1),
  per_page: z.number().default(10),
});

export const ListingListResponseSchema = z.object({
  data: z.array(ListingSchema).default([]),
  meta: ListingMetaSchema.default({ total_items: 0, page: 1, per_page: 10 }),
});

/**
 * Safely parses API listings response using Zod.
 * Returns validated data or fallback array if severe format error occurs.
 */
export function safeParseListings(rawData: unknown, fallbackData: Listing[] = []): Listing[] {
  if (!rawData) return fallbackData;

  // Handle direct array response
  if (Array.isArray(rawData)) {
    const parsedList = rawData.map((item: unknown) => safeParseListing(item)).filter((item): item is Listing => item !== null);
    return parsedList.length > 0 ? parsedList : fallbackData;
  }

  // Handle Paginated response object
  const result = ListingListResponseSchema.safeParse(rawData);
  if (result.success) {
    return result.data.data;
  }

  console.warn("[Zod Validation Warning] Invalid listing API list response structure:", result.error.format());

  // Partial recovery: filter items that pass individual validation
  if (rawData && typeof rawData === "object" && "data" in rawData && Array.isArray((rawData as { data: unknown[] }).data)) {
    const recovered = (rawData as { data: unknown[] }).data
      .map((item: unknown) => safeParseListing(item))
      .filter((item): item is Listing => item !== null);
    if (recovered.length > 0) return recovered;
  }

  return fallbackData;
}

/**
 * Safely parses a single Listing object using Zod.
 */
export function safeParseListing(rawData: unknown): Listing | null {
  if (!rawData || typeof rawData !== "object") return null;

  const result = ListingSchema.safeParse(rawData);
  if (result.success) {
    return result.data as Listing;
  }

  console.warn("[Zod Validation Warning] Invalid listing object structure:", result.error.format());

  // Attempt fallback correction for essential fields if ID exists
  const d = rawData as Record<string, any>;
  if (d.id) {
    return {
      id: String(d.id),
      sellerId: String(d.sellerId || "seller-unknown"),
      seller: {
        id: String(d.seller?.id || "seller-unknown"),
        thaid_id: String(d.seller?.thaid_id || "0000000000000"),
        first_name: String(d.seller?.first_name || "ไม่ระบุ"),
        last_name: String(d.seller?.last_name || "ไม่ระบุ"),
        role: d.seller?.role === "ADMIN" ? "ADMIN" : "USER",
      },
      contractId: String(d.contractId || "contract-unknown"),
      contract: {
        id: String(d.contract?.id || "contract-unknown"),
        contract_number: String(d.contract?.contract_number || "TRD-UNKNOWN"),
        parcel_number: String(d.contract?.parcel_number || "N/A"),
        location_lat: Number(d.contract?.location_lat) || 13.7563,
        location_lng: Number(d.contract?.location_lng) || 100.5018,
        province: String(d.contract?.province || "ไม่ระบุ"),
        district: String(d.contract?.district || "ไม่ระบุ"),
        sub_district: String(d.contract?.sub_district || "ไม่ระบุ"),
        land_area_sqw: Number(d.contract?.land_area_sqw) || 0,
        is_active: Boolean(d.contract?.is_active ?? true),
        building_type: d.contract?.building_type || null,
        usable_area_sqm: d.contract?.usable_area_sqm || null,
        zoning: d.contract?.zoning || null,
        annual_rent: d.contract?.annual_rent || 0,
      },
      asking_price: Number(d.asking_price) || 0,
      estimated_fee: Number(d.estimated_fee) || 0,
      description: d.description || "",
      image_urls: Array.isArray(d.image_urls) ? d.image_urls : ["/images/images (7).jpg"],
      status: ["ACTIVE", "SOLD", "HIDDEN", "IN_NEGOTIATION"].includes(d.status) ? d.status : "ACTIVE",
      createdAt: d.createdAt || new Date().toISOString(),
      updatedAt: d.updatedAt || new Date().toISOString(),
    };
  }

  return null;
}
