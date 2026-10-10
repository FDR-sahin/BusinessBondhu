"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { BookOpen, Calendar, Clock, Eye, LayoutGrid, List, PenTool, Plus, Search, Trash2, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { EmptyState } from "@/components/ui/empty-state";
import { Pagination } from "@/components/ui/pagination";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ConfirmDialog } from "@/components/shared/confirm-dialog";
import { QueryError } from "@/components/shared/query-error";
import { useDeleteBlog, useMyBlogs, type MyBlogItem } from "@/hooks/use-blog";
import { getBlogCategory } from "@/lib/blog";
import { formatDateBn } from "@/lib/utils";
import { useLangStore } from "@/store/lang-store";

const STATUS_TABS: { value: "all" | "pending" | "approved" | "draft"; labelBn: string; labelEn: string }[] = [
  { value: "all", labelBn: "সব", labelEn: "All" },
  { value: "pending", labelBn: "অপেক্ষমাণ", labelEn: "Pending" },
  { value: "approved", labelBn: "অনুমোদিত", labelEn: "Approved" },
  { value: "draft", labelBn: "খসড়া", labelEn: "Draft" },
];

function BlogStatusBadge({ status }: { status?: string }) {
  if (status === "approved") {
    return (
      <Badge variant="success" className="px-2.5 py-0.5 text-xs font-semibold">
        অনুমোদিত (লাইভ)
      </Badge>
    );
  }
  if (status === "pending") {
    return (
      <Badge variant="warning" className="px-2.5 py-0.5 text-xs font-semibold">
        অপেক্ষমাণ (পর্যালোচনাধীন)
      </Badge>
    );
  }
  return (
    <Badge variant="muted" className="px-2.5 py-0.5 text-xs font-semibold">
      খসড়া
    </Badge>
  );
}

function BlogGridCard({ blog, onDelete }: { blog: MyBlogItem; onDelete: (b: MyBlogItem) => void }) {
  const category = getBlogCategory(blog.category);
  const cover = blog.coverImage || "/images/blog/default.jpg";
  const readTime = blog.readTime || `${blog.readingTime || 5} মিনিট`;

  return (
    <Card className="flex h-full flex-col overflow-hidden border-line bg-surface shadow-xs transition-all duration-200 hover:border-green hover:shadow-md">
      {/* Cover Image with Status Overlay */}
      <div className="relative aspect-video w-full overflow-hidden bg-muted">
        <Image
          src={cover}
          alt={blog.title}
          fill
          sizes="(min-width: 1024px) 33vw, 50vw"
          className="object-cover"
        />
        <div className="absolute top-3 left-3">
          <Badge variant="default" className="bg-ink/80 text-background backdrop-blur text-xs">
            {category?.label || "ব্যবসা"}
          </Badge>
        </div>
        <div className="absolute top-3 right-3">
          <BlogStatusBadge status={blog.status} />
        </div>
      </div>

      <div className="flex flex-1 flex-col p-5">
        {/* Title */}
        <h3 className="line-clamp-2 font-display text-lg font-bold leading-snug text-ink">
          {blog.title}
        </h3>

        {/* Excerpt */}
        <p className="mt-2 line-clamp-2 text-xs text-muted leading-relaxed">
          {blog.excerpt}
        </p>

        {/* Info Slip */}
        <div className="mt-4 flex items-center justify-between border-t border-line/60 pt-3 text-xs text-muted font-mono">
          <span className="flex items-center gap-1.5">
            <Calendar className="h-3.5 w-3.5" />
            <span>{formatDateBn(blog.publishedAt || blog.createdAt || new Date().toISOString())}</span>
          </span>
          <span className="flex items-center gap-1.5">
            <Clock className="h-3.5 w-3.5" />
            <span>{readTime}</span>
          </span>
        </div>

        {/* Status Callout if Pending */}
        {blog.status === "pending" && (
          <div className="mt-3 rounded-lg border border-amber-200 bg-amber-50 p-2.5 text-xs text-amber-900 dark:border-amber-900/60 dark:bg-amber-950/30 dark:text-amber-200">
            ⏳ আপনার ব্লগটি অ্যাডমিন রিভিউতে আছে। অনুমোদনের পর সবার জন্য লাইভ হবে।
          </div>
        )}

        {/* Actions Footer */}
        <div className="mt-auto pt-4 flex items-center justify-between border-t border-line">
          {blog.status === "approved" ? (
            <Button asChild variant="ghost" size="sm" className="text-green hover:text-green hover:bg-green/10">
              <Link href={`/blog/${blog.slug || blog.id}`} target="_blank">
                <Eye className="mr-1.5 h-3.5 w-3.5" />
                লাইভ দেখুন
              </Link>
            </Button>
          ) : (
            <span className="text-xs text-muted font-medium">
              {blog.status === "pending" ? "পর্যালোচনাধীন" : "খসড়া"}
            </span>
          )}

          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="sm"
              className="text-danger hover:bg-danger-soft hover:text-danger"
              onClick={() => onDelete(blog)}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </Card>
  );
}

function BlogTable({ items, onDelete }: { items: MyBlogItem[]; onDelete: (b: MyBlogItem) => void }) {
  return (
    <Card className="overflow-x-auto border-line">
      <table className="w-full min-w-[750px] text-sm">
        <thead>
          <tr className="border-b border-line text-left text-xs uppercase tracking-wider text-muted font-mono bg-muted/40">
            <th className="px-4 py-3 font-semibold">ব্লগ শিরোনাম</th>
            <th className="px-4 py-3 font-semibold">ক্যাটাগরি</th>
            <th className="px-4 py-3 font-semibold">অবস্থা</th>
            <th className="px-4 py-3 font-semibold">পড়ার সময়</th>
            <th className="px-4 py-3 font-semibold">তারিখ</th>
            <th className="px-4 py-3 text-right font-semibold">অ্যাকশন</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-line/60">
          {items.map((b) => (
            <tr key={b.id} className="hover:bg-muted/20 transition-colors">
              <td className="px-4 py-3">
                <div className="flex items-center gap-3">
                  <div className="relative h-12 w-16 shrink-0 overflow-hidden rounded-md bg-muted">
                    <Image src={b.coverImage || "/images/blog/default.jpg"} alt="" fill className="object-cover" />
                  </div>
                  <div className="min-w-0 max-w-xs">
                    <p className="line-clamp-1 font-semibold text-ink">{b.title}</p>
                    <p className="line-clamp-1 text-xs text-muted">{b.excerpt}</p>
                  </div>
                </div>
              </td>
              <td className="px-4 py-3 text-xs font-medium text-ink">
                {getBlogCategory(b.category)?.label || "ব্যবসা"}
              </td>
              <td className="px-4 py-3">
                <BlogStatusBadge status={b.status} />
              </td>
              <td className="px-4 py-3 text-xs font-mono text-muted">
                {b.readTime || `${b.readingTime || 5} মিনিট`}
              </td>
              <td className="px-4 py-3 text-xs font-mono text-muted whitespace-nowrap">
                {formatDateBn(b.publishedAt || b.createdAt || new Date().toISOString())}
              </td>
              <td className="px-4 py-3 text-right">
                <div className="inline-flex items-center gap-1">
                  {b.status === "approved" && (
                    <Button asChild variant="ghost" size="sm" className="h-8 px-2 text-green">
                      <Link href={`/blog/${b.slug || b.id}`} target="_blank">
                        <Eye className="h-3.5 w-3.5 mr-1" />
                        দেখুন
                      </Link>
                    </Button>
                  )}
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-8 w-8 p-0 text-danger hover:bg-danger-soft hover:text-danger"
                    onClick={() => onDelete(b)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </Card>
  );
}

export function MyBlogsView() {
  const router = useRouter();
  const pathname = usePathname();
  const sp = useSearchParams();
  const lang = useLangStore((s) => s.lang);
  const isEn = lang === "en";

  const rawStatus = sp.get("status");
  const status = STATUS_TABS.some((t) => t.value === rawStatus && t.value !== "all") ? rawStatus! : undefined;
  const q = (sp.get("q") ?? "").slice(0, 80) || undefined;
  const pageNum = Number(sp.get("page"));
  const page = Number.isInteger(pageNum) && pageNum > 0 ? pageNum : 1;

  const [view, setView] = useState<"grid" | "table">("grid");
  const [toDelete, setToDelete] = useState<MyBlogItem | null>(null);

  const { data, isPending, isError, refetch } = useMyBlogs({ status, q, page, limit: 12 });
  const del = useDeleteBlog();

  function update(next: { status?: string; q?: string; page?: number }) {
    const p = new URLSearchParams();
    if (next.status) p.set("status", next.status);
    if (next.q) p.set("q", next.q);
    if (next.page && next.page > 1) p.set("page", String(next.page));
    const qs = p.toString();
    router.replace(qs ? `${pathname}?${qs}` : pathname, { scroll: false });
  }

  const items = data?.items ?? [];
  const filtered = Boolean(status || q);

  return (
    <div className="space-y-6">
      {/* Top Filter and Actions Row */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <Tabs
          value={status ?? "all"}
          onValueChange={(v) => update({ status: v === "all" ? undefined : v, q })}
        >
          <div className="-mx-4 overflow-x-auto px-4 pb-1 scrollbar-hide md:mx-0 md:px-0">
            <TabsList>
              {STATUS_TABS.map((t) => (
                <TabsTrigger key={t.value} value={t.value}>
                  {isEn ? t.labelEn : t.labelBn}
                </TabsTrigger>
              ))}
            </TabsList>
          </div>
        </Tabs>

        <div className="flex items-center gap-2">
          <div className="inline-flex rounded-lg border border-border bg-surface p-0.5">
            <button
              type="button"
              onClick={() => setView("grid")}
              className={`flex h-9 w-9 items-center justify-center rounded-md transition-colors ${
                view === "grid" ? "bg-primary text-primary-foreground" : "text-ink-secondary hover:text-foreground"
              }`}
            >
              <LayoutGrid className="h-4 w-4" />
            </button>
            <button
              type="button"
              onClick={() => setView("table")}
              className={`flex h-9 w-9 items-center justify-center rounded-md transition-colors ${
                view === "table" ? "bg-primary text-primary-foreground" : "text-ink-secondary hover:text-foreground"
              }`}
            >
              <List className="h-4 w-4" />
            </button>
          </div>

          <Button asChild className="bg-green text-white hover:bg-green/90 shadow-sm">
            <Link href="/dashboard/create-blog">
              <Plus className="mr-1.5 h-4 w-4" />
              {isEn ? "Write Blog" : "নতুন ব্লগ লিখুন"}
            </Link>
          </Button>
        </div>
      </div>

      {/* Query filter indicator */}
      {q && (
        <p className="flex items-center gap-2 text-sm text-ink-secondary">
          <Search className="h-4 w-4" />
          {`“${q}” এর ফলাফল`}
          <button
            onClick={() => update({ status })}
            className="inline-flex items-center gap-1 rounded-lg border border-border px-2 py-0.5 hover:bg-muted"
          >
            <X className="h-3.5 w-3.5" />
            মুছুন
          </button>
        </p>
      )}

      {/* Content Rendering */}
      {isError ? (
        <QueryError onRetry={() => void refetch()} />
      ) : isPending ? (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="h-72 w-full rounded-xl" />
          ))}
        </div>
      ) : items.length === 0 ? (
        filtered ? (
          <EmptyState
            icon={Search}
            title="এই ফিল্টারে কোনো ব্লগ নেই"
            description="অন্য ফিল্টার বা স্ট্যাটাস সিলেক্ট করে দেখুন।"
            action={
              <Button variant="outline" onClick={() => update({})}>
                ফিল্টার মুছুন
              </Button>
            }
          />
        ) : (
          <EmptyState
            icon={BookOpen}
            title="এখনো কোনো ব্লগ পোস্ট করেননি"
            description="অন্যান্য উদ্যোক্তাদের সাথে আপনার ব্যবসায়িক অভিজ্ঞতা, সোর্সিং টিপস বা কেস স্টাডি শেয়ার করুন।"
            action={
              <Button asChild className="bg-green text-white hover:bg-green/90">
                <Link href="/dashboard/create-blog">
                  <PenTool className="mr-2 h-4 w-4" />
                  প্রথম ব্লগ লিখুন
                </Link>
              </Button>
            }
          />
        )
      ) : view === "grid" ? (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((blog) => (
            <BlogGridCard key={blog.id} blog={blog} onDelete={setToDelete} />
          ))}
        </div>
      ) : (
        <BlogTable items={items} onDelete={setToDelete} />
      )}

      {data && data.totalPages > 1 && (
        <Pagination
          page={data.page}
          totalPages={data.totalPages}
          onPageChange={(p) => update({ status, q, page: p })}
        />
      )}

      <ConfirmDialog
        open={!!toDelete}
        onOpenChange={(o) => !o && setToDelete(null)}
        destructive
        title="ব্লগটি মুছে ফেলতে চান?"
        description={
          toDelete
            ? `“${toDelete.title}” ব্লগটি স্থায়ীভাবে মুছে ফেলা হবে। এই কাজটি আর ফেরানো যাবে না।`
            : ""
        }
        confirmLabel="মুছে ফেলুন"
        loading={del.isPending}
        onConfirm={() => toDelete && del.mutate(toDelete.id, { onSuccess: () => setToDelete(null) })}
      />
    </div>
  );
}
