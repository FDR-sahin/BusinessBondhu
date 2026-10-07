"use client";

import { Bookmark, ThumbsDown, ThumbsUp, type LucideIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useMounted } from "@/hooks/use-mounted";
import { usePostViewer, useReaction, useToggleSave } from "@/hooks/use-post";
import { useRequireAuth } from "@/hooks/use-require-auth";
import { cn, toBanglaNumber } from "@/lib/utils";
import type { PostDetail } from "@/types";
import { ShareMenu } from "./share-menu";

interface ActionButtonProps {
  icon: LucideIcon;
  label: string;
  count?: number;
  active: boolean;
  onClick: () => void;
}

function ActionButton({ icon: Icon, label, count, active, onClick }: ActionButtonProps) {
  return (
    <Button
      variant="outline"
      aria-pressed={active}
      onClick={onClick}
      className={cn(active && "border-primary/40 bg-primary-soft text-primary-soft-foreground hover:bg-primary-soft")}
    >
      <Icon className={cn(active && "fill-current")} aria-hidden />
      <span>{label}</span>
      {count !== undefined && <span className="tabular-nums">{toBanglaNumber(count)}</span>}
    </Button>
  );
}

/** Like · Dislike · Save · Share. Guests get a "log in" toast instead of a silent failure. */
export function ActionBar({ post }: { post: PostDetail }) {
  const mounted = useMounted();
  const requireAuth = useRequireAuth();
  const { data: viewer } = usePostViewer(post.id);
  const react = useReaction(post.id);
  const save = useToggleSave(post.id);

  // Until mounted, render the guest state so server and client HTML match.
  const reaction = mounted ? viewer?.reaction : null;
  const saved = mounted && !!viewer?.saved;

  return (
    <div className="flex flex-wrap items-center gap-2 border-y border-border py-4" role="group" aria-label="পোস্টের অ্যাকশন">
      <ActionButton icon={ThumbsUp} label="লাইক" count={post.likesCount} active={reaction === "like"}
        onClick={() => requireAuth("লাইক দিতে লগইন করুন") && react.mutate("like")} />
      <ActionButton icon={ThumbsDown} label="ডিসলাইক" count={post.dislikesCount} active={reaction === "dislike"}
        onClick={() => requireAuth("ডিসলাইক দিতে লগইন করুন") && react.mutate("dislike")} />
      <ActionButton icon={Bookmark} label={saved ? "সেভ করা হয়েছে" : "সেভ"} active={saved}
        onClick={() => requireAuth("পোস্ট সেভ করতে লগইন করুন") && save.mutate()} />
      <div className="ml-auto"><ShareMenu title={post.title} /></div>
    </div>
  );
}
