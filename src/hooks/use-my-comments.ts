import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";
import type { DashboardComment, Paginated } from "@/types";

export type CommentFilter = "all" | "unreplied";

/** GET /me/comments?filter=all|unreplied&page=&limit= */
export function useMyComments(filter: CommentFilter, page: number) {
  return useQuery({
    queryKey: ["my-comments", filter, page],
    queryFn: async () => (await api.get<Paginated<DashboardComment>>("/me/comments", { params: { filter, page, limit: 10 } })).data,
    placeholderData: keepPreviousData,
  });
}
