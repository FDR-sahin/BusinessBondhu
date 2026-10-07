"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useCallback, useMemo, useRef } from "react";
import { DIVISIONS } from "@/lib/bd-data";
import {
  DEFAULT_FILTERS,
  countActiveFilters,
  parseFilters,
  serializeFilters,
  type ExploreFilters,
} from "@/lib/explore";

/**
 * The URL is the single source of truth for Explore filters:
 * shareable links, back/forward buttons and refresh all just work.
 */
export function useExploreFilters() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const filters = useMemo(() => parseFilters(searchParams), [searchParams]);

  // Latest filters for callbacks, so two quick changes compose instead of overwriting each other.
  const latest = useRef(filters);
  latest.current = filters;

  const push = useCallback(
    (next: ExploreFilters) => {
      latest.current = next;
      const qs = serializeFilters(next);
      router.replace(qs ? `${pathname}?${qs}` : pathname, { scroll: false });
    },
    [router, pathname],
  );

  const setFilters = useCallback(
    (patch: Partial<ExploreFilters>) => {
      const current = latest.current;
      const next: ExploreFilters = { ...current, ...patch };

      // Un-selecting a division also drops that division's districts.
      if (patch.division && !patch.district) {
        const removed = current.division.filter((v) => !patch.division!.includes(v));
        if (removed.length) {
          const drop = new Set(
            DIVISIONS.filter((d) => removed.includes(d.value)).flatMap((d) => d.districts.map((x) => x.value)),
          );
          next.district = next.district.filter((v) => !drop.has(v));
        }
      }

      // Any filter change goes back to page 1 (unless we're explicitly changing the page).
      if (!("page" in patch)) next.page = 1;
      push(next);
    },
    [push],
  );

  /** Clears all filters but keeps the chosen sort order. */
  const resetFilters = useCallback(
    () => push({ ...DEFAULT_FILTERS, sort: latest.current.sort }),
    [push],
  );

  return { filters, setFilters, resetFilters, activeCount: countActiveFilters(filters) };
}
