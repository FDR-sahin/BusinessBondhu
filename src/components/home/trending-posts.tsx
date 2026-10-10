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
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 xl:gap-8 items-start">
          {/* Left Column: Budget Calculator — narrow on desktop */}
          <div className="lg:col-span-3">
            <BudgetCard />
          </div>

          {/* Right Column: Cards Grid — gets more space now */}
          <div className="lg:col-span-9">
            {isError ? (
              <QueryError onRetry={() => void refetch()} />
            ) : isPending ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6" role="status" aria-label={t("loading")}>
                {Array.from({ length: 6 }, (_, i) => (
                  <PostCardSkeleton key={i} />
                ))}
              </div>
            ) : !data?.items || data.items.length === 0 ? (
              <EmptyState title={t("noPostsYet")} description={t("shareFirstIdea")} />
            ) : (
              /* Breakpoints: 1 card mobile, 2 on tablet/laptop, 3 from xl desktop onwards */
              <Stagger className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
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
