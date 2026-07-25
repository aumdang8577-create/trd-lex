/**
 * TRD-LEX API Environment Configuration
 * Centralized API base URL resolution and environment detection.
 */

export const getApiBaseUrl = (): string => {
  // 1. Explicit public env variable
  if (process.env.NEXT_PUBLIC_API_URL) {
    return process.env.NEXT_PUBLIC_API_URL;
  }

  // 2. Browser runtime hostname check
  if (typeof window !== "undefined") {
    const hostname = window.location.hostname;
    if (hostname === "localhost" || hostname === "127.0.0.1") {
      return "http://localhost:8001";
    }
  }

  // 3. Fallback default backend port for local development
  return "http://localhost:8001";
};

export const API_CONFIG = {
  baseUrl: getApiBaseUrl(),
  timeoutMs: 5000,
  retryAttempts: 3,
  endpoints: {
    listings: "/listings",
    contracts: "/contracts",
    auth: "/auth",
    parcels: "/parcels",
    places: "/places",
    calculator: "/calculator/transfer-fee",
    dashboard: "/dashboard/economic-indicators",
  },
} as const;
