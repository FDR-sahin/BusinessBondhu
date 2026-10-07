import { keepPreviousData, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { api, getErrorMessage } from "@/lib/api";
import type { DashboardOverview, MyPost, MyPostDetail, Paginated, PostStatus } from "@/types";

/** GET /me/overview */
export function useOverview() {
  return useQuery({
    queryKey: ["me", "overview"],
    queryFn: async () => (await api.get<DashboardOverview>("/me/overview")).data,
    staleTime: 60_000,
  });
}

export interface MyPostsParams {
  status?: PostStatus;
  q?: string;
  page?: number;
  limit?: number;
}

/** GET /me/posts?status=&q=&page=&limit= */
export function useMyPosts(params: MyPostsParams) {
  return useQuery({
    queryKey: ["my-posts", params],
    queryFn: async () => (await api.get<Paginated<MyPost>>("/me/posts", { params })).data,
    placeholderData: keepPreviousData,
  });
}

/** GET /me/posts/:id (owner can read drafts / pending posts too) */
export function useMyPost(id: string) {
  return useQuery({
    queryKey: ["my-posts", "detail", id],
    queryFn: async () => (await api.get<MyPostDetail>(`/me/posts/${id}`)).data,
  });
}

/** DELETE /posts/:id */
export function useDeletePost() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => api.delete(`/posts/${id}`),
    onSuccess: () => {
      toast.success("পোস্ট মুছে ফেলা হয়েছে");
      void qc.invalidateQueries({ queryKey: ["my-posts"] });
      void qc.invalidateQueries({ queryKey: ["me", "overview"] });
    },
    onError: (e) => toast.error(getErrorMessage(e)),
  });
}
