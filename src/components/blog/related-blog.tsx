"use client";

import { Stagger, StaggerItem } from "@/components/shared/motion";
import { SectionHeader } from "@/components/shared/section-header";
import { PostCardSkeleton } from "@/components/ui/skeleton";
import { useRelatedBlog } from "@/hooks/use-blog";
import { BlogCard } from "./blog-card";

export function RelatedBlog({ slug }: { slug: string }) {
  const { data, isPending, isError } = useRelatedBlog(slug);
  if (isError || (data && data.length === 0)) return null; // a bonus section: hide quietly

  return (
    <section className="section border-t border-border bg-surface" aria-label="সম্পর্কিত লেখা">
      <div className="container-page">
        <SectionHeader title="আরও পড়ুন" description="এই লেখার সঙ্গে মিল আছে এমন আরও লেখা" href="/blog" linkLabel="সব লেখা" />
        {isPending ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3" role="status" aria-label="লোড হচ্ছে">{[0, 1, 2].map((i) => <PostCardSkeleton key={i} />)}</div>
        ) : (
          <Stagger className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {data.slice(0, 3).map((p) => <StaggerItem key={p.id} className="h-full"><BlogCard post={p} /></StaggerItem>)}
          </Stagger>
        )}
      </div>
    </section>
  );
}
