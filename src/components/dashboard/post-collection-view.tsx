"use client";

import { Bookmark, Heart, ThumbsDown, type LucideIcon } from "lucide-react";
import Link from "next/link";
import { PostCard } from "@/components/post/post-card";
import { QueryError } from "@/components/shared/query-error";
import { Stagger, StaggerItem } from "@/components/shared/motion";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import { Pagination } from "@/components/ui/pagination";
import { PostGridSkeleton } from "@/components/ui/skeleton";
import { useCollection, useUnsave, type CollectionKind } from "@/hooks/use-collections";
import { useUrlState } from "@/hooks/use-url-state";

const COPY: Record<CollectionKind, { icon: LucideIcon; title: string; text: string }> = {
  likes: { icon: Heart, title: "এখনো কোনো পোস্টে লাইক দেননি", text: "যে পোস্টগুলো আপনার ভালো লাগবে, সেগুলো এখানে জমা হবে।" },
  dislikes: { icon: ThumbsDown, title: "কোনো পোস্টে ডিসলাইক দেননি", text: "যেসব পোস্টে ডিসলাইক দেবেন, সেগুলো এখানে দেখা যাবে।" },
  saved: { icon: Bookmark, title: "সেভ করা কোনো পোস্ট নেই", text: "পরে দেখার জন্য পোস্টে বুকমার্ক চাপুন, এখানে পাবেন।" },
};

/** One component for Likes, Dislikes and Saved: same card grid as Explore. */
export function PostCollectionView({ kind }: { kind: CollectionKind }) {
  const { page, set } = useUrlState();
  const { data, isPending, isError, refetch } = useCollection(kind, page);
  const unsave = useUnsave();
  const copy = COPY[kind];

  if (isError) return <QueryError onRetry={() => void refetch()} />;
  if (isPending) return <PostGridSkeleton count={6} />;

  if (data.items.length === 0) {
    return <EmptyState icon={copy.icon} title={copy.title} description={copy.text} action={<Button asChild><Link href="/explore">পোস্ট এক্সপ্লোর করুন</Link></Button>} />;
  }

  return (
    <div className="space-y-8">
      <p className="text-sm text-ink-secondary">মোট {new Intl.NumberFormat("bn-BD").format(data.total)}টি পোস্ট</p>

      <Stagger key={data.items.map((p) => p.id).join("|")} className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
        {data.items.map((post) => (
          <StaggerItem key={post.id} className="relative h-full">
            <PostCard post={post} />
            {kind === "saved" && (
              // Sibling of the card link (never nested inside it), pinned to the image corner.
              <Button
                variant="outline"
                size="icon"
                className="absolute right-3 top-3 z-10 h-9 w-9 bg-surface/95 shadow-sm"
                aria-label={`“${post.title}” সেভ করা তালিকা থেকে সরান`}
                title="সেভ থেকে সরান"
                disabled={unsave.isPending && unsave.variables === post.id}
                onClick={() => unsave.mutate(post.id)}
              >
                <Bookmark className="fill-current" aria-hidden />
              </Button>
            )}
          </StaggerItem>
        ))}
      </Stagger>

      <Pagination page={data.page} totalPages={data.totalPages} onPageChange={(p) => set({ page: p > 1 ? String(p) : undefined })} />
    </div>
  );
}
