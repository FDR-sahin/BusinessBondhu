import { keepPreviousData, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";
import type { BlogPost, Paginated } from "@/types";

export const BLOG_PAGE_SIZE = 9;

export interface CreateBlogInput {
  title: string;
  category: string;
  excerpt?: string;
  content: string;
  coverImage?: string;
  readingTime?: number;
  readTime?: string;
  authorName?: string;
  authorTitle?: string;
  authorEmail?: string;
  userId?: string;
  status: "draft" | "pending";
}

export interface MyBlogItem extends BlogPost {
  status: "draft" | "pending" | "approved" | "rejected";
  rejectionReason?: string;
  readTime?: string;
  createdAt?: string;
}

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
        return null;
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

/** POST /blog -> Submit a new blog for admin approval or draft */
export function useCreateBlog() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (data: CreateBlogInput) => {
      return (await api.post<{ success: boolean; blog: MyBlogItem; message: string; id: string }>("/blog", data)).data;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["blog"] });
      qc.invalidateQueries({ queryKey: ["me", "blogs"] });
    },
  });
}

/** GET /me/blogs -> Paginated<MyBlogItem> */
export function useMyBlogs(params?: { status?: string; q?: string; page?: number; limit?: number }) {
  return useQuery({
    queryKey: ["me", "blogs", params],
    queryFn: async () => (await api.get<Paginated<MyBlogItem>>("/me/blogs", { params })).data,
    placeholderData: keepPreviousData,
  });
}

/** DELETE /blog/:id -> Delete a user blog */
export function useDeleteBlog() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      return (await api.delete<{ success: boolean }>(`/blog/${encodeURIComponent(id)}`)).data;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["blog"] });
      qc.invalidateQueries({ queryKey: ["me", "blogs"] });
    },
  });
}
