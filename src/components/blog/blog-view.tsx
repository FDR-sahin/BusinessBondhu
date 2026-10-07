"use client";

import { BookOpen } from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useMemo } from "react";
import { QueryError } from "@/components/shared/query-error";
import { Stagger, StaggerItem } from "@/components/shared/motion";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import { Pagination } from "@/components/ui/pagination";
import { PostGridSkeleton, Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BLOG_PAGE_SIZE, useBlogPosts, useFeaturedBlog } from "@/hooks/use-blog";
import { BLOG_CATEGORIES } from "@/lib/blog";
import { BlogCard, FeaturedBlogCard } from "./blog-card";

const ALL = "all";

export function BlogView() {
  const router = useRouter();
  const pathname = usePathname();
  const sp = useSearchParams();

  // URL is the source of truth: /blog?category=area-guides&page=2
  const rawCategory = sp.get("category");
  const category = BLOG_CATEGORIES.some((c) => c.slug === rawCategory) ? rawCategory! : undefined;
  const pageNum = Number(sp.get("page"));
  const page = Number.isInteger(pageNum) && pageNum > 0 ? pageNum : 1;

  function update(next: { category?: string; page?: number }) {
    const p = new URLSearchParams();
    if (next.category) p.set("category", next.category);
    if (next.page && next.page > 1) p.set("page", String(next.page));
    const qs = p.toString();
    router.replace(qs ? `${pathname}?${qs}` : pathname, { scroll: false });
  }

  const showFeatured = !category && page === 1;
  const featured = useFeaturedBlog(showFeatured);
  const list = useBlogPosts({ category, page, limit: BLOG_PAGE_SIZE });

  // Don't show the featured article twice.
  const items = useMemo(
    () => (list.data?.items ?? []).filter((p) => !(showFeatured && p.id === featured.data?.id)),
    [list.data, showFeatured, featured.data],
  );

  const active = category ?? ALL;

  return (
    <div className="container-page py-8 md:py-12">
      <header className="max-w-2xl">
        <h1 className="text-2xl font-semibold leading-snug md:text-4xl">ব্লগ</h1>
        <p className="mt-2 text-ink-secondary">সফল উদ্যোক্তাদের গল্প, এলাকাভিত্তিক গাইড, পাইকারি বাজারের খবর এবং সরকারি সুবিধার তথ্য।</p>
      </header>

      {showFeatured && (
        <div className="mt-8">
          {featured.isPending ? <Skeleton className="h-[340px] w-full rounded-2xl" /> : featured.data ? <FeaturedBlogCard post={featured.data} /> : null}
        </div>
      )}

      <Tabs value={active} onValueChange={(v) => update({ category: v === ALL ? undefined : v })} className="mt-10">
        {/* Scrolls sideways on phones; the scrollbar is hidden but touch/keyboard still work */}
        <div className="-mx-4 overflow-x-auto px-4 pb-1 scrollbar-hide md:mx-0 md:px-0">
          <TabsList>
            <TabsTrigger value={ALL}>সব লেখা</TabsTrigger>
            {BLOG_CATEGORIES.map((c) => <TabsTrigger key={c.slug} value={c.slug}>{c.label}</TabsTrigger>)}
          </TabsList>
        </div>

        <TabsContent value={active} className="mt-8">
          {list.isError ? (
            <QueryError onRetry={() => void list.refetch()} />
          ) : list.isPending ? (
            <PostGridSkeleton count={6} />
          ) : items.length === 0 ? (
            <EmptyState
              icon={BookOpen}
              title="এই বিভাগে এখনো কোনো লেখা নেই"
              description="অন্য বিভাগ দেখুন, শিগগিরই নতুন লেখা আসছে।"
              action={category ? <Button variant="outline" onClick={() => update({})}>সব লেখা দেখুন</Button> : undefined}
            />
          ) : (
            <Stagger key={items.map((p) => p.id).join("|")} className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {items.map((p) => <StaggerItem key={p.id} className="h-full"><BlogCard post={p} /></StaggerItem>)}
            </Stagger>
          )}

          {list.data && list.data.totalPages > 1 && (
            <Pagination className="mt-10" page={list.data.page} totalPages={list.data.totalPages} onPageChange={(p) => update({ category, page: p })} />
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
