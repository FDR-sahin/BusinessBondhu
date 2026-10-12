"use client";

import { BellOff, Check, CheckCheck, Heart, Info, MessageCircle, Reply, ShieldCheck, Trash2, type LucideIcon } from "lucide-react";
import Link from "next/link";
import { QueryError } from "@/components/shared/query-error";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import { Pagination } from "@/components/ui/pagination";
import { ListSkeleton } from "@/components/ui/skeleton";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  useClearAllNotifications,
  useDeleteNotification,
  useMarkAllRead,
  useMarkRead,
  useNotifications,
  useUnreadCount,
  type NotificationFilter,
} from "@/hooks/use-notifications";
import { useUrlState } from "@/hooks/use-url-state";
import { cn, timeAgoBn } from "@/lib/utils";
import type { AppNotification, NotificationType } from "@/types";

const META: Record<NotificationType, { icon: LucideIcon; tone: string; title: string }> = {
  like: { icon: Heart, tone: "bg-danger-soft text-danger-soft-foreground", title: "নতুন লাইক" },
  comment: { icon: MessageCircle, tone: "bg-primary-soft text-primary-soft-foreground", title: "নতুন মন্তব্য" },
  reply: { icon: Reply, tone: "bg-primary-soft text-primary-soft-foreground", title: "নতুন উত্তর" },
  admin: { icon: ShieldCheck, tone: "bg-secondary-soft text-secondary-soft-foreground", title: "অ্যাডমিনের বার্তা" },
  system: { icon: Info, tone: "bg-muted text-ink-secondary", title: "সিস্টেম বিজ্ঞপ্তি" },
};

function Item({ n }: { n: AppNotification }) {
  const markRead = useMarkRead();
  const deleteNotif = useDeleteNotification();
  const { icon: Icon, tone, title } = META[n.type];

  const text = (
    <>
      <p className="font-medium">{n.title ?? title}</p>
      <p className="text-ink-secondary">{n.message}</p>
      <time dateTime={n.createdAt} className="mt-1 block text-sm text-ink-secondary" suppressHydrationWarning>{timeAgoBn(n.createdAt)}</time>
    </>
  );

  return (
    <li className={cn("group flex items-start gap-3 rounded-2xl border p-4 transition-colors", n.read ? "border-border bg-card" : "border-primary/30 bg-primary-soft/40")}>
      <span className={cn("flex h-10 w-10 shrink-0 items-center justify-center rounded-full", tone)}><Icon className="h-4 w-4" aria-hidden /></span>

      {n.postId ? (
        // Opening the related post also marks the notification as read.
        <Link href={`/post/${n.postId}`} className="min-w-0 flex-1" onClick={() => !n.read && markRead.mutate(n.id)}>{text}</Link>
      ) : (
        <div className="min-w-0 flex-1">{text}</div>
      )}

      <div className="flex shrink-0 items-center gap-1">
        {!n.read ? (
          <>
            <span className="h-2.5 w-2.5 rounded-full bg-primary" aria-label="অপঠিত" role="img" />
            <Button variant="ghost" size="icon" aria-label="পড়া হয়েছে হিসেবে চিহ্নিত করুন" title="পড়া হয়েছে" onClick={() => markRead.mutate(n.id)}>
              <Check className="h-4 w-4" />
            </Button>
          </>
        ) : null}

        <Button
          variant="ghost"
          size="icon"
          className="text-muted-foreground hover:text-danger hover:bg-danger-soft/30 transition-colors"
          aria-label="মুছে ফেলুন"
          title="মুছে ফেলুন"
          disabled={deleteNotif.isPending}
          onClick={() => deleteNotif.mutate(n.id)}
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>
    </li>
  );
}

export function NotificationsView() {
  const { sp, page, set } = useUrlState();
  const filter: NotificationFilter = sp.get("filter") === "unread" ? "unread" : "all";
  const { data, isPending, isError, refetch } = useNotifications(filter, page);
  const { data: unread = 0 } = useUnreadCount();
  const markAll = useMarkAllRead();
  const clearAll = useClearAllNotifications();

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <Tabs value={filter} onValueChange={(v) => set({ filter: v === "all" ? undefined : v, page: undefined })}>
          <TabsList>
            <TabsTrigger value="all">সব</TabsTrigger>
            <TabsTrigger value="unread">অপঠিত</TabsTrigger>
          </TabsList>
        </Tabs>
        <div className="flex items-center gap-2">
          <Button variant="outline" disabled={unread === 0} loading={markAll.isPending} onClick={() => markAll.mutate()}>
            {!markAll.isPending && <CheckCheck aria-hidden />}সব পড়া হয়েছে
          </Button>

          {data && data.items.length > 0 && (
            <Button
              variant="outline"
              className="text-danger hover:bg-danger-soft/20 border-danger/30"
              disabled={clearAll.isPending}
              loading={clearAll.isPending}
              onClick={() => {
                if (confirm("আপনি কি নিশ্চিত যে সকল নোটিফিকেশন মুছে ফেলতে চান?")) {
                  clearAll.mutate();
                }
              }}
            >
              {!clearAll.isPending && <Trash2 className="h-4 w-4 mr-1" />}সব মুছুন
            </Button>
          )}
        </div>
      </div>

      {isError ? (
        <QueryError onRetry={() => void refetch()} />
      ) : isPending ? (
        <ListSkeleton rows={5} />
      ) : data.items.length === 0 ? (
        <EmptyState icon={BellOff} title={filter === "unread" ? "কোনো অপঠিত নোটিফিকেশন নেই" : "এখনো কোনো নোটিফিকেশন নেই"} description="লাইক, মন্তব্য বা অ্যাডমিনের বার্তা এলে এখানে জানানো হবে।" />
      ) : (
        <ul className="space-y-3" aria-live="polite">{data.items.map((n) => <Item key={n.id} n={n} />)}</ul>
      )}

      {data && <Pagination page={data.page} totalPages={data.totalPages} onPageChange={(p) => set({ page: p > 1 ? String(p) : undefined })} />}
    </div>
  );
}
