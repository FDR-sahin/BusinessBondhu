"use client";

import Link from "next/link";
import { PostCard } from "@/components/post/post-card";
import { QueryError } from "@/components/shared/query-error";
import { SectionHeader } from "@/components/shared/section-header";
import { Stagger, StaggerItem } from "@/components/shared/motion";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import { PostGridSkeleton } from "@/components/ui/skeleton";
import { usePosts } from "@/hooks/use-posts";

export function RecentPosts() {
  const { data, isPending, isError, refetch } = usePosts({ sort: "newest", limit: 6 });

  return (
    <section className="section" aria-label="সাম্প্রতিক পোস্ট">
      <div className="container-page">
        <SectionHeader title="সাম্প্রতিক পোস্ট" description="কমিউনিটির সদস্যরা সম্প্রতি যা শেয়ার করেছেন" />

        {isError ? (
          <QueryError onRetry={() => void refetch()} />
        ) : isPending ? (
          <PostGridSkeleton count={6} />
        ) : data.items.length === 0 ? (
          <EmptyState title="এখনো কোনো পোস্ট নেই" description="প্রথম ব্যবসার আইডিয়াটি আপনিই শেয়ার করুন।" />
        ) : (
          <>
            <Stagger className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {data.items.map((post) => (
                <StaggerItem key={post.id} className="h-full"><PostCard post={post} /></StaggerItem>
              ))}
            </Stagger>
            <div className="mt-10 flex justify-center">
              <Button asChild variant="outline" size="lg"><Link href="/explore?sort=newest">আরও দেখুন</Link></Button>
            </div>
          </>
        )}
      </div>
    </section>
  );
}
