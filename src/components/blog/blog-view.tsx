"use client";

import { BookOpen, LayoutGrid, Search, Table as TableIcon } from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useMemo, useState } from "react";
import { QueryError } from "@/components/shared/query-error";
import { Stagger, StaggerItem } from "@/components/shared/motion";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import { Input } from "@/components/ui/input";
import { Pagination } from "@/components/ui/pagination";
import { PostGridSkeleton, Skeleton } from "@/components/ui/skeleton";
import { BLOG_PAGE_SIZE, useBlogPosts, useFeaturedBlog } from "@/hooks/use-blog";
import { BLOG_CATEGORIES } from "@/lib/blog";
import { useT } from "@/lib/i18n";
import { toFormattedNumber } from "@/lib/utils";
import { useLangStore } from "@/store/lang-store";
import { BlogCard, FeaturedBlogCard } from "./blog-card";
import { BlogSidebarLedger } from "./blog-sidebar-ledger";
import { BlogTableView } from "./blog-table-view";

const ALL = "all";

export function BlogView() {
  const router = useRouter();
  const pathname = usePathname();
  const sp = useSearchParams();
  const t = useT();
  const lang = useLangStore((s) => s.lang);

  const [viewMode, setViewMode] = useState<"cards" | "table">("cards");
  const [searchQuery, setSearchQuery] = useState("");

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

  const showFeatured = !category && page === 1 && !searchQuery;
  const featured = useFeaturedBlog(showFeatured);
  const list = useBlogPosts({ category, page, limit: BLOG_PAGE_SIZE });

  const rawItems = useMemo(
    () => (list.data?.items ?? []).filter((p) => !(showFeatured && p.id === featured.data?.id)),
    [list.data, showFeatured, featured.data]
  );

  const filteredItems = useMemo(() => {
    if (!searchQuery.trim()) return rawItems;
    const q = searchQuery.toLowerCase();
    return rawItems.filter(
      (item) => item.title.toLowerCase().includes(q) || item.excerpt.toLowerCase().includes(q)
    );
  }, [rawItems, searchQuery]);

  const activeCategory = category ?? ALL;

  return (
    <div className="container-page py-8 md:py-12">
      {/* Header */}
      <header className="max-w-3xl">
        <h1 className="font-display text-3xl font-extrabold tracking-tight text-ink md:text-5xl">
          {t("blogHeaderTitle")}
        </h1>
        <p className="mt-3 text-base text-muted md:text-lg leading-relaxed">
          {t("blogHeaderDesc")}
        </p>
      </header>

      {/* Featured Article Slip */}
      {showFeatured && (
        <div className="mt-8">
          {featured.isPending ? (
            <Skeleton className="h-[260px] w-full rounded-xl" />
          ) : featured.data ? (
            <FeaturedBlogCard post={featured.data} />
          ) : null}
        </div>
      )}

      {/* Top Status Filter Tab Pills (Ghush.site style) */}
      <div className="mt-10 overflow-x-auto pb-2 scrollbar-hide">
        <div className="inline-flex items-center gap-2 font-mono text-xs uppercase">
          <button
            onClick={() => update({ category: undefined, page: 1 })}
            className={`border-2 border-line px-3.5 py-1.5 font-bold transition-all ${
              activeCategory === ALL
                ? "bg-ink text-background shadow-[2px_2px_0px_0px_rgba(23,19,15,0.75)]"
                : "bg-surface text-ink hover:bg-gold/20"
            }`}
          >
            {t("allOutcomes")}
          </button>
          {BLOG_CATEGORIES.map((c) => {
            const isActive = activeCategory === c.slug;
            const label = lang === "bn" ? c.label : c.labelEn;
            return (
              <button
                key={c.slug}
                onClick={() => update({ category: c.slug, page: 1 })}
                className={`border-2 border-line px-3.5 py-1.5 font-semibold transition-all ${
                  isActive
                    ? "bg-ink text-background shadow-[2px_2px_0px_0px_rgba(23,19,15,0.75)]"
                    : "bg-surface text-ink hover:bg-gold/20"
                }`}
              >
                {label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Toolbar: Search Bar + Cards/Table Toggle */}
      <div className="mt-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-y-2 border-line py-4">
        {/* Search input */}
        <div className="relative max-w-md flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" />
          <Input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={t("searchBlog")}
            className="h-10 border-2 border-line bg-surface pl-9 font-mono text-xs text-ink focus-visible:border-green"
          />
        </div>

        {/* View Mode Toggle & Counter */}
        <div className="flex items-center justify-between gap-4 sm:justify-end">
          <span className="font-mono text-xs text-muted">
            {t("showingReportsCount")
              .replace("{showing}", String(toFormattedNumber(filteredItems.length, lang)))
              .replace("{total}", String(toFormattedNumber(list.data?.total ?? filteredItems.length, lang)))}
          </span>

          <div className="inline-flex border-2 border-line bg-surface font-mono text-xs font-bold">
            <button
              onClick={() => setViewMode("cards")}
              className={`flex items-center gap-1.5 px-3 py-1.5 transition-colors ${
                viewMode === "cards" ? "bg-ink text-background" : "bg-surface text-ink hover:bg-background"
              }`}
            >
              <LayoutGrid className="h-3.5 w-3.5" />
              <span>{t("cardsView")}</span>
            </button>
            <button
              onClick={() => setViewMode("table")}
              className={`flex items-center gap-1.5 px-3 py-1.5 transition-colors ${
                viewMode === "table" ? "bg-ink text-background" : "bg-surface text-ink hover:bg-background"
              }`}
            >
              <TableIcon className="h-3.5 w-3.5" />
              <span>{t("tableView")}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Grid + Sidebar Layout */}
      <div className="mt-8 space-y-12">
        {/* Main Content Area - 3 Cards per row */}
        <main className="space-y-8">
          {list.isError ? (
            <QueryError onRetry={() => void list.refetch()} />
          ) : list.isPending ? (
            <PostGridSkeleton count={6} />
          ) : filteredItems.length === 0 ? (
            <EmptyState
              icon={BookOpen}
              title={t("noPostsYet")}
              description={t("noPostsDesc")}
              action={
                category || searchQuery ? (
                  <Button variant="outline" onClick={() => { setSearchQuery(""); update({}); }}>
                    {t("resetFilters")}
                  </Button>
                ) : undefined
              }
            />
          ) : viewMode === "cards" ? (
            <Stagger key={filteredItems.map((p) => p.id).join("|")} className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {filteredItems.map((p, idx) => (
                <StaggerItem key={p.id} className="h-full">
                  <BlogCard post={p} index={idx + 1} />
                </StaggerItem>
              ))}
            </Stagger>
          ) : (
            <BlogTableView items={filteredItems} />
          )}

          {list.data && list.data.totalPages > 1 && (
            <Pagination
              className="mt-10"
              page={list.data.page}
              totalPages={list.data.totalPages}
              onPageChange={(p) => update({ category, page: p })}
            />
          )}
        </main>

        {/* Sidebar Ledger at bottom */}
        <div className="pt-4 border-t border-line">
          <BlogSidebarLedger totalPosts={list.data?.total ?? 22} />
        </div>
      </div>
    </div>
  );
}
