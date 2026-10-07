import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { api, getErrorMessage } from "@/lib/api";
import type { NotificationPrefs, UserSettings } from "@/types";

const KEY = ["me", "settings"] as const;

/** GET /me/settings -> { notifications: { likes, comments, replies, system, email } } */
export function useSettings() {
  return useQuery({ queryKey: KEY, queryFn: async () => (await api.get<UserSettings>("/me/settings")).data });
}

/** PUT /me/settings { notifications: { <changed key>: bool } } — optimistic, rolls back on error. */
export function useUpdatePrefs() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (patch: Partial<NotificationPrefs>) => api.put("/me/settings", { notifications: patch }),
    onMutate: async (patch) => {
      await qc.cancelQueries({ queryKey: KEY });
      const prev = qc.getQueryData<UserSettings>(KEY);
      if (prev) qc.setQueryData<UserSettings>(KEY, { ...prev, notifications: { ...prev.notifications, ...patch } });
      return { prev };
    },
    onError: (e, _p, ctx) => {
      if (ctx?.prev) qc.setQueryData(KEY, ctx.prev);
      toast.error(getErrorMessage(e));
    },
  });
}
