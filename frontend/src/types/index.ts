// ===========================
// TRD-LEX TypeScript Types
// Mirror of Backend Prisma models & API responses
// ===========================

export type Role = "USER" | "ADMIN";
export type ListingStatus = "ACTIVE" | "SOLD" | "HIDDEN";

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
