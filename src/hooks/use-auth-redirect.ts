"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useCallback } from "react";
import { safeRedirect } from "@/lib/auth";

/** Where to go after logging in: ?redirect=/post/123, else /dashboard. */
export function useAuthRedirect() {
  const router = useRouter();
  const params = useSearchParams();
  const target = safeRedirect(params.get("redirect"));

  const go = useCallback(
    (to: string = target) => {
      router.replace(to);
      router.refresh(); // re-run middleware/server components with the new session
    },
    [router, target],
  );

  /** Keep the destination when switching between login <-> signup. */
  const withRedirect = (path: string) => (params.get("redirect") ? `${path}?redirect=${encodeURIComponent(target)}` : path);

  return { target, go, withRedirect };
}
