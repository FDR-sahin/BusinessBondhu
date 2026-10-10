"use client";

import { Eye, FileText, Heart, LayoutGrid, List, MapPin, MessageCircle, Pencil, Plus, Search, ThumbsDown, ThumbsUp, Trash2, X } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { QueryError } from "@/components/shared/query-error";
import { ConfirmDialog } from "@/components/shared/confirm-dialog";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";
import { Pagination } from "@/components/ui/pagination";
import { PostGridSkeleton, Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useDeletePost, useMyPosts } from "@/hooks/use-dashboard";
import { formatLocation, getDistrictLabel } from "@/lib/bd-data";
import { getCategory } from "@/lib/constants";
import { formatBDT, formatDateBn, formatPriceRange, toBanglaNumber, toFormattedNumber } from "@/lib/utils";
import { useLangStore } from "@/store/lang-store";
import type { MyPost, PostStatus } from "@/types";
import { StatusBadge } from "./status-badge";

const STATUS_TABS: { value: "all" | PostStatus; labelBn: string; labelEn: string }[] = [
  { value: "all", labelBn: "সব", labelEn: "All" },
  { value: "pending", labelBn: "অপেক্ষমান", labelEn: "Pending" },
  { value: "approved", labelBn: "অনুমোদিত", labelEn: "Approved" },
  { value: "rejected", labelBn: "বাতিল", labelEn: "Rejected" },
  { value: "draft", labelBn: "খসড়া", labelEn: "Draft" },
];

function Thumb({ post, className }: { post: MyPost; className?: string }) {
  const Icon = getCategory(post.category)?.icon ?? FileText;
  return (
    <div className={`relative overflow-hidden bg-muted ${className ?? ""}`}>
      {post.image ? (
        <Image src={post.image} alt="" fill sizes="(min-width: 1024px) 25vw, 50vw" className="object-cover" />
      ) : (
        <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-primary/10 to-secondary/15 text-primary/60 dark:text-foreground/50"><Icon className="h-6 w-6" aria-hidden /></div>
      )}
    </div>
  );
}

function Stats({ post }: { post: MyPost }) {
  const lang = useLangStore((s) => s.lang);
  const items = [
    { icon: Eye, v: post.viewsCount, label: lang === "bn" ? "ভিউ" : "Views" },
    { icon: ThumbsUp, v: post.likesCount, label: lang === "bn" ? "লাইক" : "Likes" },
    { icon: ThumbsDown, v: post.dislikesCount, label: lang === "bn" ? "ডিসলাইক" : "Dislikes" },
    { icon: MessageCircle, v: post.commentsCount, label: lang === "bn" ? "মন্তব্য" : "Comments" },
  ];
  return (
    <ul className="flex flex-wrap gap-x-4 gap-y-1 text-sm text-ink-secondary">
      {items.map(({ icon: Icon, v, label }) => (
        <li key={label} className="inline-flex items-center gap-1.5" aria-label={`${toFormattedNumber(v, lang)} ${label}`}>
          <Icon className="h-4 w-4" aria-hidden />{toFormattedNumber(v, lang)}
        </li>
      ))}
    </ul>
  );
}

function Actions({ post, onDelete }: { post: MyPost; onDelete: (p: MyPost) => void }) {
  const lang = useLangStore((s) => s.lang);
  return (
    <div className="flex items-center gap-1">
      {post.status === "approved" && (
        <Button asChild variant="ghost" size="sm"><Link href={`/post/${post.id}`}><Eye aria-hidden /> {lang === "bn" ? "দেখুন" : "View"}</Link></Button>
      )}
      <Button asChild variant="ghost" size="sm"><Link href={`/dashboard/my-posts/${post.id}/edit`}><Pencil aria-hidden /> {lang === "bn" ? "এডিট" : "Edit"}</Link></Button>
      <Button variant="ghost" size="sm" className="text-danger hover:bg-danger-soft hover:text-danger" onClick={() => onDelete(post)}><Trash2 aria-hidden /> {lang === "bn" ? "মুছুন" : "Delete"}</Button>
    </div>
  );
}

function GridCard({ post, onDelete }: { post: MyPost; onDelete: (p: MyPost) => void }) {
  const lang = useLangStore((s) => s.lang);
  const category = getCategory(post.category);
  const CategoryIcon = category?.icon;
  const districtName = getDistrictLabel(post.district) || post.district;
  const exactLoc = post.exactLocation || (post.area ? `${post.area}, ${districtName}` : districtName);
  const profit = Math.max(0, (post.retailSellPrice ?? post.retailPrice) - post.wholesalePrice);

  const profitBadgeStyle =
    post.profitPotential === "high"
      ? "bg-green/10 text-green border-green/30"
      : post.profitPotential === "medium"
      ? "bg-gold/15 text-gold border-gold/40"
      : "bg-surface text-muted border-line";

  const profitText =
    post.profitPotential === "high"
      ? (lang === "bn" ? "উচ্চ লাভ" : "High Margin")
      : post.profitPotential === "medium"
      ? (lang === "bn" ? "মাঝারি লাভ" : "Medium Margin")
      : (lang === "bn" ? "সাধারণ লাভ" : "Standard Margin");

  return (
    <Card className="flex h-full flex-col overflow-hidden p-5 shadow-sm transition-all duration-200 hover:border-green hover:shadow-md">
      {/* Top Micro-label row: Category • District + Status Badge */}
      <div className="flex items-center justify-between gap-2 text-[11px] font-mono uppercase tracking-wider text-muted">
        <span className="flex items-center gap-1.5 font-semibold text-ink/80 min-w-0 truncate">
          {CategoryIcon && <CategoryIcon className="h-3.5 w-3.5 text-green shrink-0" aria-hidden />}
          <span className="truncate">{lang === "bn" ? category?.nameBn : category?.nameEn}</span>
        </span>
        <div className="flex items-center gap-2 shrink-0">
          <span className="truncate">{districtName}</span>
          <StatusBadge status={post.status} />
        </div>
      </div>

      {/* Title */}
      <h3 className="mt-3 line-clamp-2 font-display text-lg font-bold leading-snug text-ink">
        {post.title}
      </h3>

      {/* Exact Location Front View Badge */}
      <div className="mt-2 flex items-center gap-1.5 text-xs text-ink-secondary">
        <MapPin className="h-3.5 w-3.5 text-green shrink-0" aria-hidden />
        <span className="truncate font-medium">{exactLoc}</span>
      </div>

      {/* Price Slip Ledger Numbers (Wholesale Range, Retail Range, Profit) */}
      <div className="mt-4 grid grid-cols-3 gap-1.5 rounded-md border border-line bg-surface p-2.5 text-xs shadow-inner">
        <div>
          <span className="block micro-label text-muted">{lang === "bn" ? "পাইকারি রেঞ্জ" : "Wholesale Range"}</span>
          <span className="font-mono text-xs font-semibold tabular-nums text-ink block truncate" title={formatPriceRange(post.wholesalePrice, post.wholesalePriceMax, post.wholesalePriceText, lang)}>
            {formatPriceRange(post.wholesalePrice, post.wholesalePriceMax, post.wholesalePriceText, lang)}
          </span>
        </div>
        <div>
          <span className="block micro-label text-muted">{lang === "bn" ? "খুচরা রেঞ্জ" : "Retail Range"}</span>
          <span className="font-mono text-xs font-semibold tabular-nums text-ink block truncate" title={formatPriceRange(post.retailPrice, post.retailPriceMax, post.retailPriceText, lang)}>
            {formatPriceRange(post.retailPrice, post.retailPriceMax, post.retailPriceText, lang)}
          </span>
        </div>
        <div>
          <span className="block micro-label text-green">{lang === "bn" ? "প্রফিট মার্জিন" : "Margin"}</span>
          <span className="font-mono text-xs font-bold tabular-nums text-green block truncate">
            {formatBDT(profit, lang)}
          </span>
        </div>
      </div>

      {post.status === "rejected" && post.rejectionReason && (
        <p className="mt-3 rounded-lg bg-danger-soft px-3 py-2 text-xs text-danger-soft-foreground">
          {lang === "bn" ? `কারণ: ${post.rejectionReason}` : `Reason: ${post.rejectionReason}`}
        </p>
      )}

      {/* Dotted Tear-off Divider */}
      <div className="my-3 border-t border-dashed border-line" />

      {/* Footer: Profit Badge, Likes & Actions */}
      <div className="mt-auto space-y-3">
        <div className="flex items-center justify-between gap-2 text-xs">
          <span className={`rounded-full border px-2 py-0.5 text-[10px] font-mono font-medium ${profitBadgeStyle}`}>
            {profitText}
          </span>
          <span className="inline-flex items-center gap-1 font-mono text-[11px] text-muted">
            <Heart className="h-3.5 w-3.5" aria-hidden />
            {toFormattedNumber(post.likesCount, lang)}
          </span>
        </div>

        <div className="border-t border-line/60 pt-2 flex items-center justify-end">
          <Actions post={post} onDelete={onDelete} />
        </div>
      </div>
    </Card>
  );
}

function PostsTable({ posts, onDelete }: { posts: MyPost[]; onDelete: (p: MyPost) => void }) {
  const lang = useLangStore((s) => s.lang);
  return (
    <Card className="overflow-x-auto">
      <table className="w-full min-w-[860px] text-sm">
        <caption className="sr-only">{lang === "bn" ? "আমার পোস্টের তালিকা" : "My Posts List"}</caption>
        <thead>
          <tr className="border-b border-border text-left text-ink-secondary">
            {(lang === "bn"
              ? ["পোস্ট", "অবস্থা", "ভিউ", "লাইক", "ডিসলাইক", "মন্তব্য", "তারিখ", ""]
              : ["Post", "Status", "Views", "Likes", "Dislikes", "Comments", "Date", ""]
            ).map((h, i) => <th key={i} scope="col" className="px-4 py-3 font-medium">{h}</th>)}
          </tr>
        </thead>
        <tbody>
          {posts.map((p) => (
            <tr key={p.id} className="border-b border-border last:border-0">
              <td className="px-4 py-3">
                <div className="flex items-center gap-3">
                  <Thumb post={p} className="h-12 w-20 shrink-0 rounded-lg" />
                  <div className="min-w-0">
                    <p className="line-clamp-1 max-w-[16rem] font-medium">{p.title}</p>
                    <p className="line-clamp-1 text-ink-secondary">{formatLocation(p)}</p>
                    {p.status === "rejected" && p.rejectionReason && (
                      <p className="line-clamp-1 text-danger">
                        {lang === "bn" ? `কারণ: ${p.rejectionReason}` : `Reason: ${p.rejectionReason}`}
                      </p>
                    )}
                  </div>
                </div>
              </td>
              <td className="px-4 py-3"><StatusBadge status={p.status} /></td>
              <td className="px-4 py-3 tabular-nums">{toFormattedNumber(p.viewsCount, lang)}</td>
              <td className="px-4 py-3 tabular-nums">{toFormattedNumber(p.likesCount, lang)}</td>
              <td className="px-4 py-3 tabular-nums">{toFormattedNumber(p.dislikesCount, lang)}</td>
              <td className="px-4 py-3 tabular-nums">{toFormattedNumber(p.commentsCount, lang)}</td>
              <td className="whitespace-nowrap px-4 py-3 text-ink-secondary">{formatDateBn(p.createdAt)}</td>
              <td className="px-4 py-3"><Actions post={p} onDelete={onDelete} /></td>
            </tr>
          ))}
        </tbody>
      </table>
    </Card>
  );
}

export function MyPostsView() {
  const router = useRouter();
  const pathname = usePathname();
  const sp = useSearchParams();
  const lang = useLangStore((s) => s.lang);

  // URL state: ?status=pending&q=চা&page=2
  const rawStatus = sp.get("status");
  const status = STATUS_TABS.some((t) => t.value === rawStatus && t.value !== "all") ? (rawStatus as PostStatus) : undefined;
  const q = (sp.get("q") ?? "").slice(0, 80) || undefined;
  const pageNum = Number(sp.get("page"));
  const page = Number.isInteger(pageNum) && pageNum > 0 ? pageNum : 1;

  const [view, setView] = useState<"grid" | "table">("grid");
  const [toDelete, setToDelete] = useState<MyPost | null>(null);

  const { data, isPending, isError, refetch } = useMyPosts({ status, q, page, limit: 12 });
  const del = useDeletePost();

  function update(next: { status?: PostStatus; q?: string; page?: number }) {
    const p = new URLSearchParams();
    if (next.status) p.set("status", next.status);
    if (next.q) p.set("q", next.q);
    if (next.page && next.page > 1) p.set("page", String(next.page));
    const qs = p.toString();
    router.replace(qs ? `${pathname}?${qs}` : pathname, { scroll: false });
  }

  const filtered = Boolean(status || q);

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <Tabs value={status ?? "all"} onValueChange={(v) => update({ status: v === "all" ? undefined : (v as PostStatus), q })}>
          <div className="-mx-4 overflow-x-auto px-4 pb-1 scrollbar-hide md:mx-0 md:px-0">
            <TabsList>
              {STATUS_TABS.map((t) => (
                <TabsTrigger key={t.value} value={t.value}>
                  {lang === "bn" ? t.labelBn : t.labelEn}
                </TabsTrigger>
              ))}
            </TabsList>
          </div>
        </Tabs>

        <div className="flex items-center gap-2">
          <div className="inline-flex rounded-lg border border-border bg-surface p-0.5" role="group" aria-label={lang === "bn" ? "দেখার ধরন" : "View Mode"}>
            {([["grid", LayoutGrid, lang === "bn" ? "গ্রিড" : "Grid"], ["table", List, lang === "bn" ? "তালিকা" : "List"]] as const).map(([v, Icon, label]) => (
              <button key={v} type="button" aria-pressed={view === v} aria-label={`${label} ${lang === "bn" ? "ভিউ" : "View"}`} onClick={() => setView(v)}
                className={`flex h-9 w-9 items-center justify-center rounded-md transition-colors ${view === v ? "bg-primary text-primary-foreground" : "text-ink-secondary hover:text-foreground"}`}>
                <Icon className="h-4 w-4" aria-hidden />
              </button>
            ))}
          </div>
          <Button asChild><Link href="/dashboard/create-post"><Plus aria-hidden /> {lang === "bn" ? "নতুন পোস্ট" : "New Post"}</Link></Button>
        </div>
      </div>

      {q && (
        <p className="flex items-center gap-2 text-sm text-ink-secondary">
          <Search className="h-4 w-4" aria-hidden />
          {lang === "bn" ? `“${q}” এর ফলাফল` : `Results for "${q}"`}
          <button onClick={() => update({ status })} className="inline-flex items-center gap-1 rounded-lg border border-border px-2 py-0.5 hover:bg-muted">
            <X className="h-3.5 w-3.5" aria-hidden />
            {lang === "bn" ? "মুছুন" : "Clear"}
          </button>
        </p>
      )}

      {isError ? (
        <QueryError onRetry={() => void refetch()} />
      ) : isPending ? (
        view === "grid" ? <PostGridSkeleton count={6} /> : <Skeleton className="h-72 w-full rounded-2xl" />
      ) : data.items.length === 0 ? (
        filtered ? (
          <EmptyState
            icon={Search}
            title={lang === "bn" ? "এই ফিল্টারে কোনো পোস্ট নেই" : "No posts found in this filter"}
            description={lang === "bn" ? "অন্য অবস্থা বা শব্দ দিয়ে খুঁজে দেখুন।" : "Try searching with another status or keyword."}
            action={<Button variant="outline" onClick={() => update({})}>{lang === "bn" ? "ফিল্টার মুছুন" : "Clear Filters"}</Button>}
          />
        ) : (
          <EmptyState
            icon={FileText}
            title={lang === "bn" ? "এখনো কোনো পোস্ট করেননি" : "You haven't posted anything yet"}
            description={lang === "bn" ? "আপনার জানা ব্যবসার তথ্য শেয়ার করে কমিউনিটিকে সাহায্য করুন।" : "Share your business insights and help the community grow."}
            action={<Button asChild><Link href="/dashboard/create-post">{lang === "bn" ? "প্রথম পোস্ট করুন" : "Create Your First Post"}</Link></Button>}
          />
        )
      ) : view === "grid" ? (
        <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">{data.items.map((p) => <GridCard key={p.id} post={p} onDelete={setToDelete} />)}</div>
      ) : (
        <PostsTable posts={data.items} onDelete={setToDelete} />
      )}

      {data && data.totalPages > 1 && <Pagination page={data.page} totalPages={data.totalPages} onPageChange={(p) => update({ status, q, page: p })} />}

      <ConfirmDialog
        open={!!toDelete}
        onOpenChange={(o) => !o && setToDelete(null)}
        destructive
        title={lang === "bn" ? "পোস্টটি মুছে ফেলবেন?" : "Delete Post?"}
        description={toDelete ? (lang === "bn" ? `“${toDelete.title}” স্থায়ীভাবে মুছে যাবে, সঙ্গে এর লাইক ও মন্তব্যও। এই কাজটি আর ফেরানো যাবে না।` : `"${toDelete.title}" will be permanently deleted along with its likes and comments. This action cannot be undone.`) : ""}
        confirmLabel={lang === "bn" ? "মুছে ফেলুন" : "Delete"}
        loading={del.isPending}
        onConfirm={() => toDelete && del.mutate(toDelete.id, { onSuccess: () => setToDelete(null) })}
      />
    </div>
  );
}

