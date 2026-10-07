"use client";

import { useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { api } from "@/lib/api";
import { useT } from "@/lib/i18n";
import { useAuthStore } from "@/store/auth-store";

/** Tells the API (best effort), wipes local session + cache, goes home. */
export function useLogout() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const t = useT();

  return async function logout() {
    const { refreshToken, logout: clearSession } = useAuthStore.getState();
    try {
      await api.post("/auth/logout", { refreshToken });
    } catch {
      // Server-side revoke failing must never block a local logout.
    }
    clearSession();
    queryClient.clear(); // never leak one user's cached data to the next
    toast.success(t("loggedOut"));
    router.push("/");
    router.refresh();
  };
}
