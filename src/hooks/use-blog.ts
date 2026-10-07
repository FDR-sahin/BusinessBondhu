import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";
import type { BlogPost, Paginated } from "@/types";

export const BLOG_PAGE_SIZE = 9;

/** GET /blog?category=&page=&limit= -> Paginated<BlogPost> */
export function useBlogPosts(params: { category?: string; page?: number; limit?: number }) {
  return useQuery({
    queryKey: ["blog", "list", params],
    queryFn: async () => (await api.get<Paginated<BlogPost>>("/blog", { params })).data,
    placeholderData: keepPreviousData,
  });
}

/** GET /blog/featured -> BlogPost (or null / 404 when none is featured) */
export function useFeaturedBlog(enabled = true) {
  return useQuery({
    queryKey: ["blog", "featured"],
    queryFn: async () => {
      try {
        return (await api.get<BlogPost | null>("/blog/featured")).data ?? null;
      } catch {
        return null; // a missing featured post must never break the page
      }
    },
    enabled,
    staleTime: 5 * 60_000,
  });
}

/** GET /blog/:slug/related?limit=3 -> BlogPost[] */
export function useRelatedBlog(slug: string) {
  return useQuery({
    queryKey: ["blog", slug, "related"],
    queryFn: async () => (await api.get<BlogPost[]>(`/blog/${slug}/related`, { params: { limit: 3 } })).data,
    staleTime: 5 * 60_000,
  });
}
