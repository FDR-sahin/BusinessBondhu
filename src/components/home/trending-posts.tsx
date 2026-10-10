"use client";

import { PostCard } from "@/components/post/post-card";
import { QueryError } from "@/components/shared/query-error";
import { SectionHeader } from "@/components/shared/section-header";
import { Stagger, StaggerItem } from "@/components/shared/motion";
import { EmptyState } from "@/components/ui/empty-state";
import { PostCardSkeleton } from "@/components/ui/skeleton";
import { usePosts } from "@/hooks/use-posts";
import { useT } from "@/lib/i18n";
import { BudgetCard } from "./budget-card";

export function TrendingPosts() {
  const t = useT();
  const { data, isPending, isError, refetch } = usePosts({ sort: "popular", limit: 6 });

  return (
    <section id="explore" className="section pt-4 pb-12" aria-labelledby="trending-title">
      <div className="container-page">
        {/* Full-width Section Header at Top */}
        <SectionHeader
          title={t("trendingTitle")}
          description={t("trendingDesc")}
          href="/explore?sort=popular"
          className="mb-8"
        />
        <span id="trending-title" className="sr-only">
          {t("trendingTitle")}
        </span>

        {/* Device Optimized Two-Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Budget Calculator (4 cols on lg, 3 cols on xl desktop) */}
          <div className="lg:col-span-4 xl:col-span-3">
            <BudgetCard />
          </div>

          {/* Right Column: Cards Grid (8 cols on lg, 9 cols on xl desktop) */}
          <div className="lg:col-span-8 xl:col-span-9">
            {isError ? (
              <QueryError onRetry={() => void refetch()} />
            ) : isPending ? (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6" role="status" aria-label={t("loading")}>
                {Array.from({ length: 6 }, (_, i) => (
                  <PostCardSkeleton key={i} />
                ))}
              </div>
            ) : !data?.items || data.items.length === 0 ? (
              <EmptyState title={t("noPostsYet")} description={t("shareFirstIdea")} />
            ) : (
              /* Breakpoints: 1 card on mobile, 2 cards on tablet & laptop, 3 cards on 24-inch desktop monitors */
              <Stagger className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {data.items.map((post) => (
                  <StaggerItem key={post.id} className="h-full">
                    <PostCard post={post} />
                  </StaggerItem>
                ))}
              </Stagger>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
