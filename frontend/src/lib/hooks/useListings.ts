import useSWR from "swr";
import useSWRInfinite from "swr/infinite";
import api from "@/lib/api";
import type { Listing, ListingListResponse } from "@/types";

export interface UseListingsParams {
  province?: string;
  min_price?: number;
  max_price?: number;
  page?: number;
  per_page?: number;
}

/**
 * Custom SWR hook to fetch listings list with automatic caching, deduplication, and revalidation.
 */
export function useListings(params?: UseListingsParams) {
  const key = ["/api/listings", JSON.stringify(params || {})];

  const { data, error, isLoading, isValidating, mutate } = useSWR<ListingListResponse>(
    key,
    async () => {
      const response = await api.getListings(params);
      return response;
    },
    {
      revalidateOnFocus: false,
      dedupingInterval: 10000,
      shouldRetryOnError: true,
      errorRetryCount: 3,
    }
  );

  const listings: Listing[] = Array.isArray(data?.data) ? data.data : [];

  return {
    listings,
    meta: data?.meta,
    isLoading,
    isValidating,
    error,
    mutate,
  };
}

/**
 * Custom SWR Infinite hook for Server-Side Pagination and "Load More" capability with Retry Error Handling and initial page support.
 */
export function useListingsPaginated(
  params?: UseListingsParams,
  pageSize: number = 6,
  initialPage: number = 1
) {
  const getKey = (pageIndex: number, previousPageData: ListingListResponse | null) => {
    // Reached the end
    if (previousPageData && previousPageData.data.length < pageSize) return null;

    return [
      "/api/listings/paginated",
      pageIndex + 1,
      pageSize,
      JSON.stringify(params || {}),
    ];
  };

  const { data, error, size, setSize, isValidating, mutate } = useSWRInfinite<ListingListResponse>(
    getKey,
    async (keyArray: [string, number, number, string]) => {
      const pageNum = keyArray[1];
      const response = await api.getListings({
        ...params,
        page: pageNum,
        per_page: pageSize,
      });
      return response;
    },
    {
      initialSize: initialPage,
      revalidateOnFocus: false,
      dedupingInterval: 10000,
      shouldRetryOnError: true,
      errorRetryCount: 3,
    }
  );

  // Combine list items across loaded pages
  const listings: Listing[] = data ? data.flatMap((page: ListingListResponse) => page.data || []) : [];
  const isPageError = Boolean(error);
  const isLoadingInitialData = !data && !error;
  const isLoadingMore =
    isLoadingInitialData ||
    (size > 0 && data && typeof data[size - 1] === "undefined" && !isPageError);

  const isEmpty = data?.[0]?.data?.length === 0;
  const isReachingEnd =
    isEmpty || (data && data[data.length - 1]?.data?.length < pageSize);

  const totalCount = data?.[0]?.meta?.total_items || listings.length;

  return {
    listings,
    totalCount,
    isLoadingInitialData,
    isLoadingMore,
    isPageError,
    isReachingEnd,
    page: size,
    setPage: setSize,
    loadMore: () => setSize(size + 1),
    retryLoadMore: () => setSize(size),
    error,
    mutate,
  };
}

/**
 * Custom SWR hook to fetch a single listing by ID with caching and revalidation.
 */
export function useListingById(id: string) {
  const key = id ? `/api/listings/${id}` : null;

  const { data, error, isLoading, isValidating, mutate } = useSWR<Listing>(
    key,
    async () => {
      if (!id) throw new Error("Missing listing ID");
      return await api.getListingById(id);
    },
    {
      revalidateOnFocus: false,
      dedupingInterval: 15000,
      shouldRetryOnError: true,
    }
  );

  return {
    listing: data,
    isLoading,
    isValidating,
    error,
    mutate,
  };
}

/**
 * Custom SWR hook to fetch featured listings for homepage.
 */
export function useFeaturedListings(limit: number = 3) {
  const { data, error, isLoading, isValidating, mutate } = useSWR<ListingListResponse>(
    ["/api/listings/featured", limit],
    async () => {
      return await api.getListings({ page: 1, per_page: limit });
    },
    {
      revalidateOnFocus: false,
      dedupingInterval: 30000,
    }
  );

  const listings: Listing[] = Array.isArray(data?.data) ? data.data.slice(0, limit) : [];

  return {
    listings,
    isLoading,
    isValidating,
    error,
    mutate,
  };
}
