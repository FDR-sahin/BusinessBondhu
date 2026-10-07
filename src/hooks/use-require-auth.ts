"use client";

import { usePathname, useRouter } from "next/navigation";
import { useCallback } from "react";
import { toast } from "sonner";
import { useIsAuthenticated } from "@/store/auth-store";

/**
 * const requireAuth = useRequireAuth();
 * if (!requireAuth("লাইক দিতে লগইন করুন")) return;
 * Guests get a toast with a Login button that returns them to this page.
 */
export function useRequireAuth() {
  const authed = useIsAuthenticated();
  const router = useRouter();
  const pathname = usePathname();

  return useCallback(
    (message = "এই কাজের জন্য লগইন করুন") => {
      if (authed) return true;
      toast.info(message, {
        action: { label: "লগইন", onClick: () => router.push(`/login?redirect=${encodeURIComponent(pathname)}`) },
      });
      return false;
    },
    [authed, router, pathname],
  );
}
