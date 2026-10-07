"use client";

import { Eye, MapPin, TrendingUp } from "lucide-react";
import Image from "next/image";
import { CommentSection } from "@/components/comments/comment-section";
import { QueryError } from "@/components/shared/query-error";
import { UserAvatar } from "@/components/ui/avatar";
import { Badge, type BadgeProps } from "@/components/ui/badge";
import { Breadcrumb } from "@/components/ui/breadcrumb";
import { Skeleton } from "@/components/ui/skeleton";
import { usePost, useTrackView } from "@/hooks/use-post";
import { formatLocation } from "@/lib/bd-data";
import { getCategory } from "@/lib/constants";
import { formatDateBn, toBanglaNumber } from "@/lib/utils";
import type { PostDetail, ProfitPotential } from "@/types";
import { ActionBar } from "./action-bar";
import { PriceCards } from "./price-cards";
import { RelatedPosts } from "./related-posts";
import { ReportDialog } from "./report-dialog";

const PROFIT: Record<ProfitPotential, { label: string; variant: BadgeProps["variant"] }> = {
  low: { label: "লাভের সম্ভাবনা: কম", variant: "warning" },
  medium: { label: "লাভের সম্ভাবনা: মাঝারি", variant: "secondary" },
  high: { label: "লাভের সম্ভাবনা: বেশি", variant: "success" },
};

function PostDetailSkeleton() {
  return (
    <div className="container-page py-8 md:py-12" role="status" aria-label="লোড হচ্ছে">
      <div className="mx-auto max-w-4xl space-y-6">
        <Skeleton className="h-5 w-64" />
        <Skeleton className="h-10 w-4/5" />
        <Skeleton className="h-8 w-3/5" />
        <Skeleton className="aspect-video w-full rounded-2xl" />
        <div className="grid gap-4 sm:grid-cols-3">{[0, 1, 2].map((i) => <Skeleton key={i} className="h-28 rounded-2xl" />)}</div>
        <Skeleton className="h-40 w-full" />
      </div>
    </div>
  );
}

export function PostDetailView({ id, initialPost }: { id: string; initialPost?: PostDetail }) {
  const { data: post, isPending, isError, refetch } = usePost(id, initialPost);
  useTrackView(id);

  if (isPending) return <PostDetailSkeleton />;
  if (isError || !post) {
    return <div className="container-page py-16"><QueryError onRetry={() => void refetch()} /></div>;
  }

  const category = getCategory(post.category);
  const CategoryIcon = category?.icon;
  const profit = PROFIT[post.profitPotential];

  return (
    <>
      <article className="container-page py-8 md:py-12">
        <div className="mx-auto max-w-4xl space-y-8">
          <Breadcrumb
            items={[
              { label: "হোম", href: "/" },
              { label: "এক্সপ্লোর", href: "/explore" },
              ...(category ? [{ label: category.nameBn, href: `/explore?category=${category.slug}` }] : []),
              { label: post.title },
            ]}
          />

          <header className="space-y-4">
            <h1 className="text-3xl font-bold leading-snug md:text-4xl md:leading-snug">{post.title}</h1>
            <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-ink-secondary">
              <span className="flex items-center gap-2">
                <UserAvatar name={post.author.name} src={post.author.avatar} className="h-8 w-8" />
                <span className="font-medium text-foreground">{post.author.name}</span>
              </span>
              <time dateTime={post.createdAt} suppressHydrationWarning>{formatDateBn(post.createdAt)}</time>
              <Badge variant="outline" className="gap-1.5">
                <MapPin className="h-3.5 w-3.5" aria-hidden />{formatLocation(post)}
              </Badge>
              <span className="flex items-center gap-1.5">
                <Eye className="h-4 w-4" aria-hidden />{toBanglaNumber(post.viewsCount)} বার দেখা হয়েছে
              </span>
            </div>
          </header>

          <div className="relative aspect-video overflow-hidden rounded-2xl border border-border bg-muted">
            {post.image ? (
              <Image src={post.image} alt={post.title} fill priority sizes="(min-width: 1024px) 896px, 100vw" className="object-cover" />
            ) : (
              <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-primary/10 to-secondary/15 text-primary/60 dark:text-foreground/50">
                {CategoryIcon && <CategoryIcon className="h-16 w-16" aria-hidden />}
              </div>
            )}
          </div>

          <section aria-labelledby="price-title" className="space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <h2 id="price-title" className="text-xl font-semibold md:text-2xl">দাম ও লাভ</h2>
              <Badge variant={profit.variant} className="px-3 py-1">
                <TrendingUp className="h-4 w-4" aria-hidden />{profit.label}
              </Badge>
            </div>
            <PriceCards post={post} />
          </section>

          <ActionBar post={post} />

          <section aria-labelledby="desc-title" className="space-y-3">
            <h2 id="desc-title" className="text-xl font-semibold md:text-2xl">বিবরণ</h2>
            {/* Plain text on purpose: descriptions are user-written, so we never render them as HTML. */}
            <p className="whitespace-pre-line break-words text-base leading-8">{post.description}</p>
          </section>

          {post.tags && post.tags.length > 0 && (
            <ul className="flex flex-wrap gap-2" aria-label="ট্যাগ">
              {post.tags.map((t) => <li key={t}><Badge variant="muted" className="px-3 py-1">#{t}</Badge></li>)}
            </ul>
          )}

          <div className="flex justify-end"><ReportDialog postId={post.id} /></div>

          <CommentSection postId={post.id} count={post.commentsCount} />
        </div>
      </article>

      <RelatedPosts postId={post.id} />
    </>
  );
}
