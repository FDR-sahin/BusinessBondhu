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
import { cn, toBanglaNumber } from "@/lib/utils";
import { FilterDrawer } from "./filter-drawer";
import { FilterSidebar } from "./filter-sidebar";
import { SortSelect } from "./sort-select";

export function ExploreView() {
  const { filters, setFilters, resetFilters, activeCount } = useExploreFilters();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const resultsRef = useRef<HTMLDivElement>(null);

  const params = useMemo(() => toApiParams(filters), [filters]);
  const { data, isPending, isError, isFetching, refetch } = usePosts(params);

  // After changing page, bring the top of the results into view.
  // (Uses default scroll behavior, which already honors the CSS reduced-motion rule.)
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
        <h1 className="text-2xl font-semibold leading-snug md:text-4xl">ব্যবসার আইডিয়া এক্সপ্লোর করুন</h1>
        <p className="mt-2 text-ink-secondary">বিভাগ, জেলা, ক্যাটাগরি ও দাম অনুযায়ী ফিল্টার করে আপনার জন্য সঠিক আইডিয়া বেছে নিন।</p>
      </header>

      <div className="mt-8 grid gap-8 lg:grid-cols-[17rem_minmax(0,1fr)] xl:grid-cols-[18rem_minmax(0,1fr)]">
        {/* Desktop sidebar */}
        <aside aria-label="ফিল্টার" className="hidden lg:block">
          <div className="sticky top-24 max-h-[calc(100vh-7rem)] overflow-y-auto rounded-2xl border border-border bg-card p-5 shadow-sm">
            <FilterSidebar {...sidebarProps} />
          </div>
        </aside>

        <div ref={resultsRef} className="min-w-0 scroll-mt-24">
          {/* Top bar: filter button (mobile) · result count · sort */}
          <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <Button variant="outline" className="lg:hidden" onClick={() => setDrawerOpen(true)}>
                <SlidersHorizontal aria-hidden /> ফিল্টার
                {activeCount > 0 && <Badge className="ml-0.5 px-1.5">{toBanglaNumber(activeCount)}</Badge>}
              </Button>
              <p className="text-sm text-ink-secondary" aria-live="polite">
                {isPending ? <Skeleton className="h-5 w-24" /> : <>মোট <strong className="font-semibold text-foreground">{toBanglaNumber(data?.total ?? 0)}</strong>টি ফলাফল</>}
              </p>
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
                title="কোনো পোস্ট পাওয়া যায়নি"
                description="এই ফিল্টারে কোনো ফলাফল মেলেনি। ফিল্টার কমিয়ে বা বদলে আবার চেষ্টা করুন।"
                action={<Button onClick={resetFilters}>ফিল্টার রিসেট করুন</Button>}
              />
            ) : (
              <Stagger key={resultKey} className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
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
