import { keepPreviousData, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { api, getErrorMessage } from "@/lib/api";
import { useAuthStore } from "@/store/auth-store";
import type { DashboardOverview, MyPost, MyPostDetail, Paginated, PostStatus } from "@/types";

/** GET /me/overview */
export function useOverview() {
  const user = useAuthStore((s) => s.user);
  return useQuery({
    queryKey: ["me", "overview", user?.id || user?.email],
    queryFn: async () =>
      (
        await api.get<DashboardOverview>("/me/overview", {
          params: {
            userId: user?.id,
            userEmail: user?.email,
          },
        })
      ).data,
    staleTime: 60_000,
  });
}

export interface MyPostsParams {
  status?: PostStatus;
  q?: string;
  page?: number;
  limit?: number;
  userId?: string;
  userEmail?: string;
}

/** GET /me/posts?status=&q=&page=&limit= */
export function useMyPosts(params: MyPostsParams) {
  const user = useAuthStore((s) => s.user);
  return useQuery({
    queryKey: ["my-posts", user?.id || user?.email, params],
    queryFn: async () =>
      (
        await api.get<Paginated<MyPost>>("/me/posts", {
          params: {
            ...params,
            userId: user?.id,
            userEmail: user?.email,
          },
        })
      ).data,
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
