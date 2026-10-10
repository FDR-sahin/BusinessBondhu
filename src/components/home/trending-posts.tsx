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

        {/* Organized Two-Column Layout: Left = Interactive Budget Finder, Right = 2x2 Cards Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column (4 cols): Budget Card Finder */}
          <div className="lg:col-span-4">
            <BudgetCard />
          </div>

          {/* Right Column (8 cols): Trending Business Ideas Grid */}
          <div className="lg:col-span-8">
            {isError ? (
              <QueryError onRetry={() => void refetch()} />
            ) : isPending ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5" role="status" aria-label={t("loading")}>
                {Array.from({ length: 4 }, (_, i) => (
                  <PostCardSkeleton key={i} />
                ))}
              </div>
            ) : !data?.items || data.items.length === 0 ? (
              <EmptyState title={t("noPostsYet")} description={t("shareFirstIdea")} />
            ) : (
              <Stagger className="grid grid-cols-1 sm:grid-cols-2 gap-5">
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
