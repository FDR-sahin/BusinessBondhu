"use client";

import { FileText, MapPin, MessageSquare, Users } from "lucide-react";
import { useMemo } from "react";
import { QueryError } from "@/components/shared/query-error";
import { StatCard } from "@/components/ui/stat-card";
import { Skeleton, StatCardSkeleton } from "@/components/ui/skeleton";
import { Card } from "@/components/ui/card";
import { useAnalysis } from "@/hooks/use-analysis";
import { getDistrictLabel, getDivisionLabel } from "@/lib/bd-data";
import { CHART_COLORS } from "@/lib/chart-colors";
import { getCategory } from "@/lib/constants";
import { useT } from "@/lib/i18n";
import { monthLabel, toFormattedNumber } from "@/lib/utils";
import { useLangStore } from "@/store/lang-store";
import type { AnalysisData } from "@/types";
import { ChartCard } from "./chart-card";
import { CategoryChart, DistrictsChart, DivisionChart, GrowthChart, PriceTrendChart } from "./charts";
import { ActiveCategories, TopContributors } from "./lists";

/** API data -> chart-ready rows with localized labels. */
function shape(d: AnalysisData, lang: "bn" | "en") {
  const byCount = <T extends { count: number }>(rows: T[]) => [...rows].sort((a, b) => b.count - a.count);
  const divisions = byCount(d.postsByDivision).map((r) => ({ name: getDivisionLabel(r.division, lang), count: r.count }));
  const categories = byCount(d.postsByCategory).map((r) => {
    const cat = getCategory(r.category);
    const name = cat ? (lang === "bn" ? cat.nameBn : cat.nameEn) : r.category;
    return { name, count: r.count };
  });
  const districts = byCount(d.topDistricts).slice(0, 10).map((r) => ({ name: getDistrictLabel(r.district, lang), count: r.count }));
  const growth = d.growth.map((r) => ({ name: monthLabel(r.month, lang), posts: r.posts }));
  const prices = d.priceTrends.map((r) => ({ name: monthLabel(r.month, lang), wholesale: r.avgWholesale, retail: r.avgRetail }));
  const active = d.activeCategories ?? byCount(d.postsByCategory);
  return { divisions, categories, districts, growth, prices, active, categoryTotal: categories.reduce((s, c) => s + c.count, 0) };
}

function LoadingState() {
  const t = useT();
  return (
    <div role="status" aria-label={t("loading")} className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">{[0, 1, 2, 3].map((i) => <StatCardSkeleton key={i} />)}</div>
      <div className="grid gap-6 lg:grid-cols-2">{[0, 1, 2, 3].map((i) => <Card key={i} className="p-6"><Skeleton className="mb-4 h-6 w-1/2" /><Skeleton className="h-64 w-full" /></Card>)}</div>
    </div>
  );
}

export function AnalysisView() {
  const t = useT();
  const lang = useLangStore((s) => s.lang);
  const { data, isPending, isError, refetch } = useAnalysis();
  const view = useMemo(() => (data ? shape(data, lang) : null), [data, lang]);

  const sum = (rows: { name: string; count: number }[]) =>
    rows.map((r) => `${r.name} ${toFormattedNumber(r.count, lang)}`).join(", ");

  return (
    <div className="container-page py-8 md:py-12">
      <header className="max-w-3xl">
        <h1 className="font-display text-2xl font-bold leading-snug text-ink md:text-4xl">
          {t("analysisTitle")}
        </h1>
        <p className="mt-2 text-muted text-base leading-relaxed">
          {t("analysisDesc")}
        </p>
      </header>

      <div className="mt-8">
        {isError ? (
          <QueryError onRetry={() => void refetch()} />
        ) : isPending || !data || !view ? (
          <LoadingState />
        ) : (
          <div className="space-y-6">
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <StatCard label={t("totalPostsLabel")} value={data.totals.posts} icon={FileText} />
              <StatCard label={t("totalUsersLabel")} value={data.totals.users} icon={Users} />
              <StatCard label={t("totalCommentsLabel")} value={data.totals.comments} icon={MessageSquare} />
              <StatCard label={t("coveredDistrictsLabel")} value={data.totals.districts} icon={MapPin} />
            </div>

            <div className="grid gap-6 lg:grid-cols-2">
              <ChartCard
                title={t("postsByDivisionTitle")}
                description={t("postsByDivisionDesc")}
                summary={sum(view.divisions)}
                minWidth={520}
                empty={view.divisions.length === 0}
              >
                <DivisionChart data={view.divisions} />
              </ChartCard>

              <ChartCard
                title={t("postsByCategoryTitle")}
                description={t("postsByCategoryDesc")}
                summary={sum(view.categories)}
                height={240}
                empty={view.categories.length === 0}
                footer={
                  <ul className="mt-5 grid grid-cols-1 gap-x-6 gap-y-2 text-sm sm:grid-cols-2">
                    {view.categories.map((c, i) => (
                      <li key={c.name} className="flex items-center gap-2">
                        <span aria-hidden className="h-3 w-3 shrink-0 rounded-full" style={{ background: CHART_COLORS[i % CHART_COLORS.length] }} />
                        <span className="line-clamp-1 flex-1 text-muted">{c.name}</span>
                        <span className="font-mono font-medium text-ink tabular-nums">{toFormattedNumber(c.count, lang)}</span>
                      </li>
                    ))}
                  </ul>
                }
              >
                <CategoryChart data={view.categories} />
              </ChartCard>

              <ChartCard
                title={t("postGrowthTitle")}
                description={t("postGrowthDesc")}
                summary={sum(view.growth.map((g) => ({ name: g.name, count: g.posts })))}
                empty={view.growth.length === 0}
              >
                <GrowthChart data={view.growth} />
              </ChartCard>

              <ChartCard
                title={t("avgPriceTrendTitle")}
                description={t("avgPriceTrendDesc")}
                summary={t("priceTrendSummaryText")}
                empty={view.prices.length === 0}
              >
                <PriceTrendChart data={view.prices} />
              </ChartCard>
            </div>

            <ChartCard
              title={t("top10DistrictsTitle")}
              description={t("top10DistrictsDesc")}
              summary={sum(view.districts)}
              height={Math.max(260, view.districts.length * 40)}
              minWidth={380}
              empty={view.districts.length === 0}
            >
              <DistrictsChart data={view.districts} />
            </ChartCard>

            <div className="grid gap-6 lg:grid-cols-2">
              <TopContributors items={data.topContributors} />
              <ActiveCategories items={view.active} />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
