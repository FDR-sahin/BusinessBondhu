"use client";

import { useEffect, type ReactNode } from "react";
import { api } from "@/lib/api";
import { useAuthStore } from "@/store/auth-store";
import type { User } from "@/types";

/**
 * On first load with a stored session, re-fetch the current user so profile
 * changes made elsewhere (admin, another device) show up. Expired tokens are
 * handled by the axios 401 interceptor, so failures here are ignored.
 *
 * Assumes GET /auth/me -> { user }. Adjust to your API.
 */
export function AuthProvider({ children }: { children: ReactNode }) {
  const hasHydrated = useAuthStore((s) => s.hasHydrated);
  const hasToken = useAuthStore((s) => Boolean(s.accessToken));
  const setUser = useAuthStore((s) => s.setUser);

  useEffect(() => {
    if (!hasHydrated || !hasToken) return;
    let cancelled = false;

    api
      .get<{ user: User }>("/auth/me")
      .then(({ data }) => {
        if (!cancelled && data?.user?.id) {
          const currentStoreUser = useAuthStore.getState().user;
          const emailPrefix = (data.user.email || currentStoreUser?.email || "").split("@")[0];
          const serverName = (data.user.name || "").trim();

          let clientName = (currentStoreUser?.name || "").trim();
          if ((!clientName || clientName === emailPrefix || clientName === "উদ্যোক্তা") && typeof window !== "undefined") {
            try {
              const raw = localStorage.getItem("bhbd_user_profile");
              if (raw) {
                const p = JSON.parse(raw);
                if (p?.name && p.name !== "উদ্যোক্তা" && p.name !== emailPrefix) {
                  clientName = p.name;
                }
              }
            } catch {}
          }

          // If client has a valid custom name, don't let a fallback email prefix wipe it out
          let resolvedName = serverName;
          if (clientName && clientName !== "উদ্যোক্তা" && clientName !== emailPrefix) {
            if (!serverName || serverName === emailPrefix || serverName === "উদ্যোক্তা" || serverName === "ব্যবহারকারী") {
              resolvedName = clientName;
            }
          }

          const finalUser: User = {
            ...data.user,
            name: resolvedName || serverName || clientName || emailPrefix || "ব্যবহারকারী",
          };

          setUser(finalUser);
          if (typeof window !== "undefined") {
            try {
              localStorage.setItem("bhbd_user_profile", JSON.stringify(finalUser));
            } catch {}
          }
        }
      })
      .catch(() => undefined);

    return () => {
      cancelled = true;
    };
  }, [hasHydrated, hasToken, setUser]);

  return <>{children}</>;
}
