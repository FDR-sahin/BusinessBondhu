"use client";

import { PostCard } from "@/components/post/post-card";
import { QueryError } from "@/components/shared/query-error";
import { SectionHeader } from "@/components/shared/section-header";
import { Stagger, StaggerItem } from "@/components/shared/motion";
import { EmptyState } from "@/components/ui/empty-state";
import { PostCardSkeleton } from "@/components/ui/skeleton";
import { usePosts } from "@/hooks/use-posts";
import { useT } from "@/lib/i18n";

// Mobile: horizontal snap-scroll. md+: normal grid.
const ROW = "-mx-4 flex snap-x snap-mandatory gap-4 overflow-x-auto px-4 pb-2 scrollbar-hide md:mx-0 md:grid md:grid-cols-2 md:overflow-visible md:px-0 lg:grid-cols-4";
const CELL = "w-[78%] shrink-0 snap-start sm:w-[45%] md:w-auto";

export function TrendingPosts() {
  const t = useT();
  const { data, isPending, isError, refetch } = usePosts({ sort: "popular", limit: 4 });

  return (
    <section className="section" aria-labelledby="trending-title">
      <div className="container-page">
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
          <div className={ROW} role="status" aria-label={t("loading")}>
            {Array.from({ length: 4 }, (_, i) => (
              <div key={i} className={CELL}>
                <PostCardSkeleton />
              </div>
            ))}
          </div>
        ) : data.items.length === 0 ? (
          <EmptyState title={t("noPostsYet")} description={t("shareFirstIdea")} />
        ) : (
          <Stagger className={ROW}>
            {data.items.map((post) => (
              <StaggerItem key={post.id} className={CELL}>
                <PostCard post={post} />
              </StaggerItem>
            ))}
          </Stagger>
        )}
      </div>
    </section>
  );
}
