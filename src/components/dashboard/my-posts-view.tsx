"use client";

import { Eye, FileText, LayoutGrid, List, MessageCircle, Pencil, Plus, Search, ThumbsDown, ThumbsUp, Trash2, X } from "lucide-react";
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
import { formatLocation } from "@/lib/bd-data";
import { getCategory } from "@/lib/constants";
import { formatDateBn, toBanglaNumber } from "@/lib/utils";
import type { MyPost, PostStatus } from "@/types";
import { StatusBadge } from "./status-badge";

const STATUS_TABS: { value: "all" | PostStatus; label: string }[] = [
  { value: "all", label: "সব" },
  { value: "pending", label: "অপেক্ষমান" },
  { value: "approved", label: "অনুমোদিত" },
  { value: "rejected", label: "বাতিল" },
  { value: "draft", label: "খসড়া" },
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
  const items = [
    { icon: Eye, v: post.viewsCount, label: "ভিউ" },
    { icon: ThumbsUp, v: post.likesCount, label: "লাইক" },
    { icon: ThumbsDown, v: post.dislikesCount, label: "ডিসলাইক" },
    { icon: MessageCircle, v: post.commentsCount, label: "মন্তব্য" },
  ];
  return (
    <ul className="flex flex-wrap gap-x-4 gap-y-1 text-sm text-ink-secondary">
      {items.map(({ icon: Icon, v, label }) => (
        <li key={label} className="inline-flex items-center gap-1.5" aria-label={`${toBanglaNumber(v)} ${label}`}><Icon className="h-4 w-4" aria-hidden />{toBanglaNumber(v)}</li>
      ))}
    </ul>
  );
}

function Actions({ post, onDelete }: { post: MyPost; onDelete: (p: MyPost) => void }) {
  return (
    <div className="flex items-center gap-1">
      {post.status === "approved" && (
        <Button asChild variant="ghost" size="sm"><Link href={`/post/${post.id}`}><Eye aria-hidden /> দেখুন</Link></Button>
      )}
      <Button asChild variant="ghost" size="sm"><Link href={`/dashboard/my-posts/${post.id}/edit`}><Pencil aria-hidden /> এডিট</Link></Button>
      <Button variant="ghost" size="sm" className="text-danger hover:bg-danger-soft hover:text-danger" onClick={() => onDelete(post)}><Trash2 aria-hidden /> মুছুন</Button>
    </div>
  );
}

function GridCard({ post, onDelete }: { post: MyPost; onDelete: (p: MyPost) => void }) {
  return (
    <Card className="flex h-full flex-col overflow-hidden">
      <div className="relative">
        <Thumb post={post} className="aspect-video" />
        <div className="absolute left-3 top-3"><StatusBadge status={post.status} /></div>
      </div>
      <div className="flex flex-1 flex-col gap-3 p-4">
        <h3 className="line-clamp-2 font-semibold leading-snug">{post.title}</h3>
        <p className="text-sm text-ink-secondary">{formatDateBn(post.createdAt)}</p>
        <Stats post={post} />
        {post.status === "rejected" && post.rejectionReason && (
          <p className="rounded-lg bg-danger-soft px-3 py-2 text-sm text-danger-soft-foreground">কারণ: {post.rejectionReason}</p>
        )}
        <div className="mt-auto border-t border-border pt-2"><Actions post={post} onDelete={onDelete} /></div>
      </div>
    </Card>
  );
}

function PostsTable({ posts, onDelete }: { posts: MyPost[]; onDelete: (p: MyPost) => void }) {
  return (
    <Card className="overflow-x-auto">
      <table className="w-full min-w-[860px] text-sm">
        <caption className="sr-only">আমার পোস্টের তালিকা</caption>
        <thead>
          <tr className="border-b border-border text-left text-ink-secondary">
            {["পোস্ট", "অবস্থা", "ভিউ", "লাইক", "ডিসলাইক", "মন্তব্য", "তারিখ", ""].map((h, i) => <th key={i} scope="col" className="px-4 py-3 font-medium">{h}</th>)}
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
                    {p.status === "rejected" && p.rejectionReason && <p className="line-clamp-1 text-danger">কারণ: {p.rejectionReason}</p>}
                  </div>
                </div>
              </td>
              <td className="px-4 py-3"><StatusBadge status={p.status} /></td>
              <td className="px-4 py-3 tabular-nums">{toBanglaNumber(p.viewsCount)}</td>
              <td className="px-4 py-3 tabular-nums">{toBanglaNumber(p.likesCount)}</td>
              <td className="px-4 py-3 tabular-nums">{toBanglaNumber(p.dislikesCount)}</td>
              <td className="px-4 py-3 tabular-nums">{toBanglaNumber(p.commentsCount)}</td>
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
            <TabsList>{STATUS_TABS.map((t) => <TabsTrigger key={t.value} value={t.value}>{t.label}</TabsTrigger>)}</TabsList>
          </div>
        </Tabs>

        <div className="flex items-center gap-2">
          <div className="inline-flex rounded-lg border border-border bg-surface p-0.5" role="group" aria-label="দেখার ধরন">
            {([["grid", LayoutGrid, "গ্রিড"], ["table", List, "তালিকা"]] as const).map(([v, Icon, label]) => (
              <button key={v} type="button" aria-pressed={view === v} aria-label={`${label} ভিউ`} onClick={() => setView(v)}
                className={`flex h-9 w-9 items-center justify-center rounded-md transition-colors ${view === v ? "bg-primary text-primary-foreground" : "text-ink-secondary hover:text-foreground"}`}>
                <Icon className="h-4 w-4" aria-hidden />
              </button>
            ))}
          </div>
          <Button asChild><Link href="/dashboard/create-post"><Plus aria-hidden /> নতুন পোস্ট</Link></Button>
        </div>
      </div>

      {q && (
        <p className="flex items-center gap-2 text-sm text-ink-secondary">
          <Search className="h-4 w-4" aria-hidden />“{q}” এর ফলাফল
          <button onClick={() => update({ status })} className="inline-flex items-center gap-1 rounded-lg border border-border px-2 py-0.5 hover:bg-muted"><X className="h-3.5 w-3.5" aria-hidden />মুছুন</button>
        </p>
      )}

      {isError ? (
        <QueryError onRetry={() => void refetch()} />
      ) : isPending ? (
        view === "grid" ? <PostGridSkeleton count={6} /> : <Skeleton className="h-72 w-full rounded-2xl" />
      ) : data.items.length === 0 ? (
        filtered ? (
          <EmptyState icon={Search} title="এই ফিল্টারে কোনো পোস্ট নেই" description="অন্য অবস্থা বা শব্দ দিয়ে খুঁজে দেখুন।" action={<Button variant="outline" onClick={() => update({})}>ফিল্টার মুছুন</Button>} />
        ) : (
          <EmptyState icon={FileText} title="এখনো কোনো পোস্ট করেননি" description="আপনার জানা ব্যবসার তথ্য শেয়ার করে কমিউনিটিকে সাহায্য করুন।" action={<Button asChild><Link href="/dashboard/create-post">প্রথম পোস্ট করুন</Link></Button>} />
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
        title="পোস্টটি মুছে ফেলবেন?"
        description={toDelete ? `“${toDelete.title}” স্থায়ীভাবে মুছে যাবে, সঙ্গে এর লাইক ও মন্তব্যও। এই কাজটি আর ফেরানো যাবে না।` : ""}
        confirmLabel="মুছে ফেলুন"
        loading={del.isPending}
        onConfirm={() => toDelete && del.mutate(toDelete.id, { onSuccess: () => setToDelete(null) })}
      />
    </div>
  );
}
