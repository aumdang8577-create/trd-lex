// ===========================
// TRD-LEX API Client
// Central HTTP client for Backend communication
// ===========================

import type {
  TokenResponse,
  LoginRequest,
  ValidateContractRequest,
  ValidateContractResponse,
  ListingListResponse,
  Listing,
  CreateListingRequest,
  UpdateListingRequest,
  UpdateListingStatusRequest,
  FeeCalculationRequest,
  FeeCalculationResponse,
} from "@/types";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8001";

class ApiClient {
  private token: string | null = null;

  setToken(token: string) {
    this.token = token;
    if (typeof window !== "undefined") {
      localStorage.setItem("trd_lex_token", token);
    }
  }

  getToken(): string | null {
    if (this.token) return this.token;
    if (typeof window !== "undefined") {
      this.token = localStorage.getItem("trd_lex_token");
    }
    return this.token;
  }

  clearToken() {
    this.token = null;
    if (typeof window !== "undefined") {
      localStorage.removeItem("trd_lex_token");
    }
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const headers: HeadersInit = {
      "Content-Type": "application/json",
      ...options.headers,
    };

    const token = this.getToken();
    if (token) {
      (headers as Record<string, string>)["Authorization"] = `Bearer ${token}`;
    }

    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      headers,
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({
        detail: "เกิดข้อผิดพลาดที่ไม่คาดคิด",
      }));
      throw new Error(error.detail || `HTTP Error: ${response.status}`);
    }

    return response.json();
  }

  // ===== Authentication =====
  async login(data: LoginRequest): Promise<TokenResponse> {
    const result = await this.request<TokenResponse>("/auth/login", {
      method: "POST",
      body: JSON.stringify(data),
    });
    this.setToken(result.access_token);
    return result;
  }

  logout() {
    this.clearToken();
  }

  // ===== Contracts =====
  async validateContract(
    data: ValidateContractRequest
  ): Promise<ValidateContractResponse> {
    return this.request<ValidateContractResponse>("/contracts/validate", {
      method: "POST",
      body: JSON.stringify(data),
    });
  }

  // ===== Listings =====
  async getListings(params?: {
    province?: string;
    min_price?: number;
    max_price?: number;
    page?: number;
    per_page?: number;
  }): Promise<ListingListResponse> {
    const searchParams = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          searchParams.set(key, String(value));
        }
      });
    }
    const query = searchParams.toString();
    return this.request<ListingListResponse>(
      `/listings${query ? `?${query}` : ""}`
    );
  }

  async getListingById(id: string): Promise<Listing> {
    return this.request<Listing>(`/listings/${id}`);
  }

  async createListing(data: CreateListingRequest): Promise<Listing> {
    return this.request<Listing>("/listings", {
      method: "POST",
      body: JSON.stringify(data),
    });
  }

  async updateListing(
    id: string,
    data: UpdateListingRequest
  ): Promise<Listing> {
    return this.request<Listing>(`/listings/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    });
  }

  async updateListingStatus(
    id: string,
    data: UpdateListingStatusRequest
  ): Promise<Listing> {
    return this.request<Listing>(`/listings/${id}/status`, {
      method: "PATCH",
      body: JSON.stringify(data),
    });
  }

  async getEconomicIndicators(): Promise<{
    revived_land_sqw: number;
    state_revenue_baht: number;
    economic_circulation_baht: number;
  }> {
    return this.request<{
      revived_land_sqw: number;
      state_revenue_baht: number;
      economic_circulation_baht: number;
    }>("/dashboard/economic-indicators");
  }

  async calculateTransferFee(
    data: FeeCalculationRequest
  ): Promise<FeeCalculationResponse> {
    return this.request<FeeCalculationResponse>("/calculator/transfer-fee", {
      method: "POST",
      body: JSON.stringify(data),
    });
  }
}

// Singleton instance
const api = new ApiClient();
export default api;
