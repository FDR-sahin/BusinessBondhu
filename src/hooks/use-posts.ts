import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";
import type { DistrictStat, Paginated, Post } from "@/types";

/**
 * Multi-value filters (division, district, category, profit) are sent as
 * comma-separated strings: ?division=Dhaka,Sylhet — same format as the page URL.
 */
export interface PostFilters {
  page?: number;
  limit?: number;
  sort?: "newest" | "popular" | "most_liked" | "most_commented" | "price_asc";
  division?: string;
  district?: string;
  category?: string;
  area?: string;
  profit?: string;
  wholesaleMin?: number;
  wholesaleMax?: number;
  retailMin?: number;
  retailMax?: number;
  q?: string;
}

/** GET /posts?… -> Paginated<Post>. Used by Home now, Explore in Step 4. */
export function usePosts(filters: PostFilters = {}) {
  return useQuery({
    queryKey: ["posts", filters],
    queryFn: async () => (await api.get<Paginated<Post>>("/posts", { params: filters })).data,
    placeholderData: keepPreviousData,
  });
}

/** GET /stats/top-districts?limit=12 -> DistrictStat[] */
export function useTopDistricts(limit = 12) {
  return useQuery({
    queryKey: ["stats", "top-districts", limit],
    queryFn: async () => (await api.get<DistrictStat[]>("/stats/top-districts", { params: { limit } })).data,
    staleTime: 5 * 60 * 1000,
  });
}
