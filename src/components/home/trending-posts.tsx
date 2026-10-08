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
  const { data, isPending, isError, refetch } = usePosts({ sort: "popular", limit: 4 });

  return (
    <section id="explore" className="section pt-4 pb-12" aria-labelledby="trending-title">
      <div className="container-page max-w-[1200px]">
        {/* Two-column layout matching user MS Word mockup */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column (4 cols): Budget Card with slider & matching items */}
          <div className="lg:col-span-4">
            <BudgetCard />
          </div>

          {/* Right Column (8 cols): Trending Ideas Section Header & Grid */}
          <div className="lg:col-span-8">
            <SectionHeader
              title={t("trendingTitle")}
              description={t("trendingDesc")}
              href="/explore?sort=popular"
            />
            <span id="trending-title" className="sr-only">
              {t("trendingTitle")}
            </span>

            {isError ? (
              <QueryError onRetry={() => void refetch()} />
            ) : isPending ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4" role="status" aria-label={t("loading")}>
                {Array.from({ length: 4 }, (_, i) => (
                  <PostCardSkeleton key={i} />
                ))}
              </div>
            ) : !data?.items || data.items.length === 0 ? (
              <EmptyState title={t("noPostsYet")} description={t("shareFirstIdea")} />
            ) : (
              <Stagger className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {data.items.map((post) => (
                  <StaggerItem key={post.id}>
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
