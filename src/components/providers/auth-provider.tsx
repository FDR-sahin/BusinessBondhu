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
        if (!cancelled && data?.user?.id && data.user.name) {
          setUser(data.user);
        }
      })
      .catch(() => undefined);

    return () => {
      cancelled = true;
    };
  }, [hasHydrated, hasToken, setUser]);

  return <>{children}</>;
}
