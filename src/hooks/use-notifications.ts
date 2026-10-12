import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { useIsAuthenticated } from "@/store/auth-store";

/** GET /notifications/unread-count -> { count } (adjust to your API). Polls every minute. */
export function useUnreadCount() {
  const authed = useIsAuthenticated();
  return useQuery({
    queryKey: ["notifications", "unread-count"],
    queryFn: async () => (await api.get<{ count: number }>("/notifications/unread-count")).data.count,
    enabled: authed,
    refetchInterval: 60_000,
  });
}

/* ---------- Notifications page ---------- */
import { keepPreviousData, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { getErrorMessage } from "@/lib/api";
import type { AppNotification, Paginated } from "@/types";

export type NotificationFilter = "all" | "unread";
const LIST = ["notifications", "list"] as const;

/** GET /me/notifications?filter=all|unread&page=&limit= */
export function useNotifications(filter: NotificationFilter, page: number) {
  return useQuery({
    queryKey: [...LIST, filter, page],
    queryFn: async () => (await api.get<Paginated<AppNotification>>("/me/notifications", { params: { filter, page, limit: 15 } })).data,
    placeholderData: keepPreviousData,
  });
}

/** POST /me/notifications/:id/read (optimistic) */
export function useMarkRead() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => api.post(`/me/notifications/${id}/read`),
    onMutate: async (id) => {
      await qc.cancelQueries({ queryKey: LIST });
      const snapshots = qc.getQueriesData<Paginated<AppNotification>>({ queryKey: LIST });
      qc.setQueriesData<Paginated<AppNotification>>({ queryKey: LIST }, (old) =>
        old ? { ...old, items: old.items.map((n) => (n.id === id ? { ...n, read: true } : n)) } : old,
      );
      return { snapshots };
    },
    onError: (e, _id, ctx) => {
      ctx?.snapshots.forEach(([key, data]) => qc.setQueryData(key, data));
      toast.error(getErrorMessage(e));
    },
    onSettled: () => void qc.invalidateQueries({ queryKey: ["notifications"] }),
  });
}

/** POST /me/notifications/read-all */
export function useMarkAllRead() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: () => api.post("/me/notifications/read-all"),
    onSuccess: () => {
      toast.success("সব নোটিফিকেশন পড়া হিসেবে চিহ্নিত হয়েছে");
      void qc.invalidateQueries({ queryKey: ["notifications"] });
    },
    onError: (e) => toast.error(getErrorMessage(e)),
  });
}

/** DELETE /me/notifications/:id */
export function useDeleteNotification() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => api.delete(`/me/notifications/${id}`),
    onSuccess: () => {
      toast.success("নোটিফিকেশনটি মুছে ফেলা হয়েছে");
      void qc.invalidateQueries({ queryKey: ["notifications"] });
    },
    onError: (e) => toast.error(getErrorMessage(e)),
  });
}

/** DELETE /me/notifications/clear-all */
export function useClearAllNotifications() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: () => api.delete("/me/notifications/clear-all"),
    onSuccess: () => {
      toast.success("সব নোটিফিকেশন মুছে ফেলা হয়েছে");
      void qc.invalidateQueries({ queryKey: ["notifications"] });
    },
    onError: (e) => toast.error(getErrorMessage(e)),
  });
}
