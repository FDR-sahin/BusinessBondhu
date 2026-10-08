"use client";

import Link from "next/link";
import { QueryError } from "@/components/shared/query-error";
import { SectionHeader } from "@/components/shared/section-header";
import { Stagger, StaggerItem } from "@/components/shared/motion";
import { Badge } from "@/components/ui/badge";
import { EmptyState } from "@/components/ui/empty-state";
import { Skeleton } from "@/components/ui/skeleton";
import { useTopDistricts } from "@/hooks/use-posts";
import { getDistrictLabel, getDivisionLabel } from "@/lib/bd-data";
import { useT } from "@/lib/i18n";
import { toFormattedNumber } from "@/lib/utils";
import { useLangStore } from "@/store/lang-store";

const GRID = "grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6";

export function TopDistricts() {
  const t = useT();
  const lang = useLangStore((s) => s.lang);
  const { data, isPending, isError, refetch } = useTopDistricts(12);

  return (
    <section className="section border-y border-border bg-surface" aria-label={t("activeDistrictsTitle")}>
      <div className="container-page">
        <SectionHeader
          title={t("activeDistrictsTitle")}
          description={t("activeDistrictsDesc")}
          href="/explore"
          linkLabel={t("allDistricts")}
        />

        {isError ? (
          <QueryError onRetry={() => void refetch()} />
        ) : isPending ? (
          <div className={GRID} role="status" aria-label={t("loading")}>
            {Array.from({ length: 12 }, (_, i) => <Skeleton key={i} className="h-[76px] rounded-xl" />)}
          </div>
        ) : data.length === 0 ? (
          <EmptyState title={t("noPostsYet")} />
        ) : (
          <Stagger className={GRID}>
            {data.map((s) => (
              <StaggerItem key={s.district}>
                <Link
                  href={`/explore?district=${encodeURIComponent(s.district)}`}
                  className="flex h-full flex-col gap-2 rounded-xl border border-border bg-card p-4 shadow-sm transition-all duration-200 hover:border-primary/40 hover:shadow-md"
                >
                  <span className="font-semibold leading-snug">{getDistrictLabel(s.district, lang)}</span>
                  <span className="flex items-center justify-between gap-2">
                    <span className="line-clamp-1 text-sm text-ink-secondary">
                      {s.division ? getDivisionLabel(s.division, lang) : "\u00A0"}
                    </span>
                    <Badge variant="default">{toFormattedNumber(s.count, lang)}</Badge>
                  </span>
                </Link>
              </StaggerItem>
            ))}
          </Stagger>
        )}
      </div>
    </section>
  );
}
