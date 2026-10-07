import { CheckCircle2, Heart, Info, MessageCircle, Reply, XCircle, type LucideIcon } from "lucide-react";
import Link from "next/link";
import { UserAvatar } from "@/components/ui/avatar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";
import { timeAgoBn } from "@/lib/utils";
import type { ActivityEvent, ActivityType } from "@/types";

const ICONS: Record<ActivityType, { icon: LucideIcon; tone: string }> = {
  like: { icon: Heart, tone: "bg-danger-soft text-danger-soft-foreground" },
  comment: { icon: MessageCircle, tone: "bg-primary-soft text-primary-soft-foreground" },
  reply: { icon: Reply, tone: "bg-primary-soft text-primary-soft-foreground" },
  post_approved: { icon: CheckCircle2, tone: "bg-success-soft text-success-soft-foreground" },
  post_rejected: { icon: XCircle, tone: "bg-danger-soft text-danger-soft-foreground" },
  system: { icon: Info, tone: "bg-muted text-ink-secondary" },
};

function Sentence({ e }: { e: ActivityEvent }) {
  const who = <strong className="font-semibold">{e.actor?.name ?? "কেউ একজন"}</strong>;
  const post = e.postTitle ? <>“{e.postTitle}”</> : "আপনার পোস্টে";
  switch (e.type) {
    case "like": return <>{who} আপনার {post} পোস্টে লাইক দিয়েছেন</>;
    case "comment": return <>{who} আপনার {post} পোস্টে মন্তব্য করেছেন</>;
    case "reply": return <>{who} আপনার মন্তব্যের উত্তর দিয়েছেন</>;
    case "post_approved": return <>আপনার {post} পোস্টটি অনুমোদিত হয়েছে</>;
    case "post_rejected": return <>আপনার {post} পোস্টটি বাতিল হয়েছে</>;
    default: return <>{e.message ?? "নতুন বিজ্ঞপ্তি"}</>;
  }
}

export function ActivityFeed({ events }: { events: ActivityEvent[] }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>সাম্প্রতিক কার্যকলাপ</CardTitle>
        <CardDescription>আপনার পোস্ট ও মন্তব্যে সর্বশেষ যা ঘটেছে</CardDescription>
      </CardHeader>
      <CardContent>
        {events.length === 0 ? (
          <EmptyState title="এখনো কোনো কার্যকলাপ নেই" description="পোস্ট করলে লাইক ও মন্তব্যের খবর এখানে দেখা যাবে।" className="py-10" />
        ) : (
          <ul className="divide-y divide-border">
            {events.slice(0, 10).map((e) => {
              const { icon: Icon, tone } = ICONS[e.type];
              const body = (
                <>
                  <span className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full ${tone}`}><Icon className="h-4 w-4" aria-hidden /></span>
                  <span className="min-w-0 flex-1 text-sm"><Sentence e={e} /></span>
                  <time dateTime={e.createdAt} className="shrink-0 text-sm text-ink-secondary" suppressHydrationWarning>{timeAgoBn(e.createdAt)}</time>
                </>
              );
              return (
                <li key={e.id}>
                  {e.postId ? (
                    <Link href={`/post/${e.postId}`} className="flex items-center gap-3 rounded-lg py-3 transition-colors hover:bg-muted">{body}</Link>
                  ) : (
                    <div className="flex items-center gap-3 py-3">{body}</div>
                  )}
                </li>
              );
            })}
          </ul>
        )}
      </CardContent>
    </Card>
  );
}
// (UserAvatar import kept for future per-actor avatars)
void UserAvatar;
