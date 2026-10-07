"use client";

import { PostCard } from "@/components/post/post-card";
import { Stagger, StaggerItem } from "@/components/shared/motion";
import { SectionHeader } from "@/components/shared/section-header";
import { PostCardSkeleton } from "@/components/ui/skeleton";
import { useRelatedPosts } from "@/hooks/use-post";

const GRID = "grid gap-6 sm:grid-cols-2 lg:grid-cols-4";

export function RelatedPosts({ postId }: { postId: string }) {
  const { data, isPending, isError } = useRelatedPosts(postId);

  // Related posts are a bonus: hide the section on error or when there are none.
  if (isError || (data && data.length === 0)) return null;

  return (
    <section className="section border-t border-border bg-surface" aria-labelledby="related-title">
      <div className="container-page">
        <SectionHeader title="সম্পর্কিত পোস্ট" description="একই ক্যাটাগরি বা এলাকার আরও আইডিয়া" />
        <span id="related-title" className="sr-only">সম্পর্কিত পোস্ট</span>
        {isPending ? (
          <div className={GRID} role="status" aria-label="লোড হচ্ছে">
            {Array.from({ length: 4 }, (_, i) => <PostCardSkeleton key={i} />)}
          </div>
        ) : (
          <Stagger className={GRID}>
            {data.slice(0, 4).map((p) => <StaggerItem key={p.id} className="h-full"><PostCard post={p} /></StaggerItem>)}
          </Stagger>
        )}
      </div>
    </section>
  );
}
