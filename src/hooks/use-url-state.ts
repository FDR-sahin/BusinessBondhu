"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useCallback } from "react";

/** Read/write ?page= and any other query param without touching the rest. */
export function useUrlState() {
  const router = useRouter();
  const pathname = usePathname();
  const sp = useSearchParams();

  const n = Number(sp.get("page"));
  const page = Number.isInteger(n) && n > 0 ? n : 1;

  const set = useCallback(
    (patch: Record<string, string | undefined>) => {
      const p = new URLSearchParams(sp.toString());
      for (const [k, v] of Object.entries(patch)) (v ? p.set(k, v) : p.delete(k));
      const qs = p.toString();
      router.replace(qs ? `${pathname}?${qs}` : pathname, { scroll: false });
    },
    [router, pathname, sp],
  );

  return { sp, page, set };
}
