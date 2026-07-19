// ===========================
// TRD-LEX TypeScript Types
// Mirror of Backend Prisma models & API responses
// ===========================

export type Role = "USER" | "ADMIN";
export type ListingStatus = "ACTIVE" | "SOLD" | "HIDDEN" | "IN_NEGOTIATION";

export interface User {
  id: string;
  thaid_id: string;
  first_name: string;
  last_name: string;
  phone_number?: string | null;
  role: Role;
}

export interface LeaseContract {
  id: string;
  contract_number: string;
  parcel_number: string;
  location_lat: number;
  location_lng: number;
  province: string;
  district: string;
  sub_district: string;
  land_area_sqw: number;
  is_active: boolean;
  building_type?: string | null;
  usable_area_sqm?: number | null;
  zoning?: string | null;
  annual_rent?: number;
}

export interface Listing {
  id: string;
  sellerId: string;
  seller: User;
  contractId: string;
  contract: LeaseContract;
  asking_price: number;
  estimated_fee: number;
  description?: string | null;
  image_urls: string[];
  status: ListingStatus;
  createdAt: string;
  updatedAt: string;
}

// API Response types
export interface TokenResponse {
  access_token: string;
  token_type: string;
  user: User;
}

export interface ValidateContractResponse {
  is_valid: boolean;
  message: string;
  contract_data?: LeaseContract;
}

export interface ListingMeta {
  total_items: number;
  page: number;
  per_page: number;
}

export interface ListingListResponse {
  data: Listing[];
  meta: ListingMeta;
}

// Request types
export interface LoginRequest {
  thaid_id: string;
}

export interface ValidateContractRequest {
  contract_number: string;
}

export interface CreateListingRequest {
  contractId: string;
  asking_price: number;
  description?: string;
  image_urls?: string[];
}

export interface UpdateListingRequest {
  asking_price?: number;
  description?: string;
  image_urls?: string[];
}

export interface UpdateListingStatusRequest {
  status: ListingStatus;
}

export type TransferType = "GENERAL" | "FAMILY" | "CO_LESSEE";

export interface FeeCalculationRequest {
  annual_rent?: number;
  transfer_type: TransferType;
  transfer_share?: number;
  contract_number?: string;

  // Advanced calculation fields
  lease_purpose?: string;
  region_type?: string;
  location_class?: string;
  land_area_sqw?: number;
  appraisal_land_sqw?: number;
  building_type?: string;
  usable_area_sqm?: number;
  appraisal_bld_sqm?: number;
  building_depreciation?: number;
}

export interface FeeCalculationResponse {
  annual_rent: number;
  base_fee: number;
  discount_description: string;
  final_fee: number;
  calculated_arrangement_fee?: number;
  calculation_details?: {
    method?: string;
    land_value?: number;
    building_value?: number;
    total_asset_value?: number;
    rate_per_sqw_month?: number;
    exceeding_value?: number;
  };
}
