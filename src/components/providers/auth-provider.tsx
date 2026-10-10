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
          let profileStorageUser: Partial<User> | null = null;
          let authStorageUser: Partial<User> | null = null;

          if (typeof window !== "undefined") {
            try {
              const rawProfile = localStorage.getItem("bhbd_user_profile");
              if (rawProfile) profileStorageUser = JSON.parse(rawProfile);
            } catch {}
            try {
              const rawAuth = localStorage.getItem("bhbd-auth");
              if (rawAuth) {
                const parsed = JSON.parse(rawAuth);
                if (parsed?.state?.user) authStorageUser = parsed.state.user;
              }
            } catch {}
          }

          const emailPrefix = (data.user.email || currentStoreUser?.email || profileStorageUser?.email || "").split("@")[0];
          const serverName = (data.user.name || "").trim();

          let clientName = (currentStoreUser?.name || profileStorageUser?.name || authStorageUser?.name || "").trim();
          if (clientName === "উদ্যোক্তা" || clientName === emailPrefix) {
            clientName = "";
          }

          // If client has a valid custom name, don't let a fallback email prefix wipe it out
          let resolvedName = serverName;
          if (clientName && clientName !== "উদ্যোক্তা" && clientName !== emailPrefix) {
            if (!serverName || serverName === emailPrefix || serverName === "উদ্যোক্তা" || serverName === "ব্যবহারকারী") {
              resolvedName = clientName;
            }
          }

          // Merge fields carefully: preserve non-empty values from client if server returns empty/undefined
          const pickField = (serverVal?: string | null, fieldKey?: keyof User) => {
            if (serverVal && serverVal.trim()) return serverVal;
            const clientVal =
              (fieldKey && currentStoreUser?.[fieldKey]) ||
              (fieldKey && profileStorageUser?.[fieldKey]) ||
              (fieldKey && authStorageUser?.[fieldKey]);
            return (typeof clientVal === "string" && clientVal.trim()) ? clientVal : (serverVal || "");
          };

          const finalUser: User = {
            ...data.user,
            name: resolvedName || serverName || clientName || emailPrefix || "ব্যবহারকারী",
            bio: pickField(data.user.bio, "bio"),
            division: pickField(data.user.division, "division"),
            district: pickField(data.user.district, "district"),
            area: pickField(data.user.area, "area"),
            avatar: pickField(data.user.avatar, "avatar"),
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
