"use client";

import { SearchX, SlidersHorizontal } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import { PostCard } from "@/components/post/post-card";
import { QueryError } from "@/components/shared/query-error";
import { Stagger, StaggerItem } from "@/components/shared/motion";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import { Pagination } from "@/components/ui/pagination";
import { PostGridSkeleton, Skeleton } from "@/components/ui/skeleton";
import { useExploreFilters } from "@/hooks/use-explore-filters";
import { usePosts } from "@/hooks/use-posts";
import { toApiParams } from "@/lib/explore";
import { useT } from "@/lib/i18n";
import { cn, toFormattedNumber } from "@/lib/utils";
import { useLangStore } from "@/store/lang-store";
import { FilterDrawer } from "./filter-drawer";
import { FilterSidebar } from "./filter-sidebar";
import { SortSelect } from "./sort-select";

export function ExploreView() {
  const { filters, setFilters, resetFilters, activeCount } = useExploreFilters();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const resultsRef = useRef<HTMLDivElement>(null);
  const t = useT();
  const lang = useLangStore((s) => s.lang);

  const params = useMemo(() => toApiParams(filters), [filters]);
  const { data, isPending, isError, isFetching, refetch } = usePosts(params);

  const prevPage = useRef(filters.page);
  useEffect(() => {
    if (prevPage.current !== filters.page) resultsRef.current?.scrollIntoView({ block: "start" });
    prevPage.current = filters.page;
  }, [filters.page]);

  const sidebarProps = { filters, onChange: setFilters, onReset: resetFilters, activeCount };
  const resultKey = data?.items.map((p) => p.id).join("|");

  return (
    <div className="container-page py-8 md:py-12">
      <header className="max-w-2xl">
        <h1 className="font-display text-2xl font-bold leading-snug md:text-4xl text-ink">{t("exploreTitle")}</h1>
        <p className="mt-2 text-base text-muted">{t("exploreSubtitle")}</p>
      </header>

      <div className="mt-8 grid gap-8 lg:grid-cols-[17rem_minmax(0,1fr)] xl:grid-cols-[18rem_minmax(0,1fr)]">
        {/* Desktop sidebar */}
        <aside aria-label={t("filterTitle")} className="hidden lg:block">
          <div className="sticky top-24 max-h-[calc(100vh-7rem)] overflow-y-auto rounded-xl border border-line bg-surface p-5 shadow-sm">
            <FilterSidebar {...sidebarProps} />
          </div>
        </aside>

        <div ref={resultsRef} className="min-w-0 scroll-mt-24">
          {/* Top bar: filter button (mobile) · result count · sort */}
          <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <Button variant="outline" className="lg:hidden border-line text-ink" onClick={() => setDrawerOpen(true)}>
                <SlidersHorizontal aria-hidden /> {t("filterTitle")}
                {activeCount > 0 && <Badge className="ml-0.5 px-1.5 bg-green text-white">{toFormattedNumber(activeCount, lang)}</Badge>}
              </Button>
              <div className="text-sm text-muted" aria-live="polite">
                {isPending ? (
                  <Skeleton className="h-5 w-24" />
                ) : (
                  t("totalResults").replace("{count}", toFormattedNumber(data?.total ?? 0, lang))
                )}
              </div>
            </div>
            <SortSelect value={filters.sort} onChange={(sort) => setFilters({ sort })} />
          </div>

          <div aria-busy={isFetching} className={cn("transition-opacity duration-200", isFetching && !isPending && "opacity-60")}>
            {isError ? (
              <QueryError onRetry={() => void refetch()} />
            ) : isPending ? (
              <PostGridSkeleton count={6} />
            ) : data.items.length === 0 ? (
              <EmptyState
                icon={SearchX}
                title={t("noPostsFound")}
                description={t("noPostsDesc")}
                action={<Button onClick={resetFilters} className="bg-green text-white hover:bg-green/90">{t("resetFilters")}</Button>}
              />
            ) : (
              <Stagger key={resultKey} className="grid gap-6 sm:grid-cols-2 2xl:grid-cols-3">
                {data.items.map((post) => (
                  <StaggerItem key={post.id} className="h-full"><PostCard post={post} /></StaggerItem>
                ))}
              </Stagger>
            )}
          </div>

          {data && data.totalPages > 1 && (
            <Pagination className="mt-10" page={data.page} totalPages={data.totalPages} onPageChange={(page) => setFilters({ page })} />
          )}
        </div>
      </div>

      <FilterDrawer open={drawerOpen} onOpenChange={setDrawerOpen} resultCount={data?.total} {...sidebarProps} />
    </div>
  );
}
