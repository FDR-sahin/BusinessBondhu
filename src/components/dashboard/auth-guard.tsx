"use client";

import { Loader2 } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, type ReactNode } from "react";
import { useMounted } from "@/hooks/use-mounted";
import { useAuthStore } from "@/store/auth-store";

/**
 * Second line of defense behind middleware.ts (which only checks that a cookie exists):
 * once the real session is loaded from localStorage, send guests to /login.
 * Waits for mount so server HTML and the first client render match.
 */
export function AuthGuard({ children }: { children: ReactNode }) {
  const mounted = useMounted();
  const hasHydrated = useAuthStore((s) => s.hasHydrated);
  const hasToken = useAuthStore((s) => Boolean(s.accessToken));
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (mounted && hasHydrated && !hasToken) router.replace(`/login?redirect=${encodeURIComponent(pathname)}`);
  }, [mounted, hasHydrated, hasToken, router, pathname]);

  if (!mounted || !hasHydrated || !hasToken) {
    return (
      <div role="status" className="flex min-h-screen items-center justify-center">
        <Loader2 className="h-6 w-6 animate-spin text-ink-secondary" aria-hidden />
        <span className="sr-only">লোড হচ্ছে…</span>
      </div>
    );
  }
  return <>{children}</>;
}
