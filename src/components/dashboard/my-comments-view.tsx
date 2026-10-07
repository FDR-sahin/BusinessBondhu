"use client";

import { useQueryClient } from "@tanstack/react-query";
import { CheckCircle2, FileText, Heart, MessageSquare, Reply, Trash2 } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { CommentForm } from "@/components/comments/comment-form";
import { QueryError } from "@/components/shared/query-error";
import { ConfirmDialog } from "@/components/shared/confirm-dialog";
import { UserAvatar } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";
import { Pagination } from "@/components/ui/pagination";
import { ListSkeleton } from "@/components/ui/skeleton";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useDeleteComment } from "@/hooks/use-comments";
import { useMyComments, type CommentFilter } from "@/hooks/use-my-comments";
import { useUrlState } from "@/hooks/use-url-state";
import { timeAgoBn, toBanglaNumber } from "@/lib/utils";
import { useAuthStore } from "@/store/auth-store";
import type { Comment, DashboardComment } from "@/types";

function Bubble({ c, onDelete, canDelete, small }: { c: Comment | DashboardComment; onDelete?: () => void; canDelete: boolean; small?: boolean }) {
  return (
    <div className="flex gap-3">
      <UserAvatar name={c.author.name} src={c.author.avatar} className={small ? "h-8 w-8 shrink-0" : "h-10 w-10 shrink-0"} />
      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-baseline gap-x-2">
          <span className="font-semibold">{c.author.name}</span>
          <time dateTime={c.createdAt} className="text-sm text-ink-secondary" suppressHydrationWarning>{timeAgoBn(c.createdAt)}</time>
        </div>
        {/* plain text, never HTML */}
        <p className="mt-1 whitespace-pre-line break-words">{c.content}</p>
        <div className="mt-1 flex items-center gap-3 text-sm text-ink-secondary">
          <span className="inline-flex items-center gap-1.5" aria-label={`${toBanglaNumber(c.likesCount)}টি লাইক`}><Heart className="h-4 w-4" aria-hidden />{toBanglaNumber(c.likesCount)}</span>
          {canDelete && (
            <button onClick={onDelete} className="inline-flex items-center gap-1.5 rounded transition-colors hover:text-danger"><Trash2 className="h-4 w-4" aria-hidden />মুছুন</button>
          )}
        </div>
      </div>
    </div>
  );
}

function CommentThread({ item }: { item: DashboardComment }) {
  const qc = useQueryClient();
  const userId = useAuthStore((s) => s.user?.id);
  const [replying, setReplying] = useState(false);
  const [deleting, setDeleting] = useState<Comment | DashboardComment | null>(null);
  const del = useDeleteComment(item.post.id);
  const refresh = () => void qc.invalidateQueries({ queryKey: ["my-comments"] });

  return (
    <Card className="space-y-4 p-5">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <Link href={`/post/${item.post.id}`} className="inline-flex min-w-0 items-center gap-2 text-sm font-medium text-link hover:underline">
          <FileText className="h-4 w-4 shrink-0" aria-hidden /><span className="line-clamp-1">{item.post.title}</span>
        </Link>
        {item.replied ? <Badge variant="success"><CheckCircle2 className="h-3.5 w-3.5" aria-hidden />উত্তর দেওয়া হয়েছে</Badge> : <Badge variant="warning">উত্তর বাকি</Badge>}
      </div>

      <Bubble c={item} canDelete={item.author.id === userId} onDelete={() => setDeleting(item)} />

      {item.replies.length > 0 && (
        <ul className="space-y-4 border-l-2 border-border pl-4 sm:pl-6">
          {item.replies.map((r) => (
            <li key={r.id}><Bubble c={r} small canDelete={r.author.id === userId} onDelete={() => setDeleting(r)} /></li>
          ))}
        </ul>
      )}

      {replying ? (
        <CommentForm
          postId={item.post.id}
          parentId={item.id}
          placeholder={`${item.author.name}-কে উত্তর লিখুন…`}
          submitLabel="উত্তর দিন"
          autoFocus
          onDone={() => { setReplying(false); refresh(); }}
          onCancel={() => setReplying(false)}
        />
      ) : (
        <Button variant="outline" size="sm" onClick={() => setReplying(true)}><Reply aria-hidden /> উত্তর দিন</Button>
      )}

      <ConfirmDialog
        open={!!deleting}
        onOpenChange={(o) => !o && setDeleting(null)}
        destructive
        title="মন্তব্যটি মুছে ফেলবেন?"
        description="এই কাজটি আর ফেরানো যাবে না।"
        confirmLabel="মুছে ফেলুন"
        loading={del.isPending}
        onConfirm={() => deleting && del.mutate(deleting.id, { onSuccess: () => { setDeleting(null); refresh(); } })}
      />
    </Card>
  );
}

export function MyCommentsView() {
  const { sp, page, set } = useUrlState();
  const filter: CommentFilter = sp.get("filter") === "unreplied" ? "unreplied" : "all";
  const { data, isPending, isError, refetch } = useMyComments(filter, page);

  return (
    <div className="space-y-6">
      <Tabs value={filter} onValueChange={(v) => set({ filter: v === "all" ? undefined : v, page: undefined })}>
        <TabsList>
          <TabsTrigger value="all">সব মন্তব্য</TabsTrigger>
          <TabsTrigger value="unreplied">উত্তর বাকি</TabsTrigger>
        </TabsList>
      </Tabs>

      {isError ? (
        <QueryError onRetry={() => void refetch()} />
      ) : isPending ? (
        <ListSkeleton rows={4} />
      ) : data.items.length === 0 ? (
        filter === "unreplied" ? (
          <EmptyState icon={CheckCircle2} title="সব মন্তব্যের উত্তর দেওয়া হয়েছে" description="চমৎকার! উত্তর দেওয়ার মতো আর কোনো মন্তব্য নেই।" />
        ) : (
          <EmptyState icon={MessageSquare} title="আপনার পোস্টে এখনো কোনো মন্তব্য আসেনি" description="মানুষ মন্তব্য করলে এখানে দেখতে পাবেন এবং সরাসরি উত্তর দিতে পারবেন।" />
        )
      ) : (
        <ul className="space-y-4">{data.items.map((c) => <li key={c.id}><CommentThread item={c} /></li>)}</ul>
      )}

      {data && <Pagination page={data.page} totalPages={data.totalPages} onPageChange={(p) => set({ page: p > 1 ? String(p) : undefined })} />}
    </div>
  );
}
