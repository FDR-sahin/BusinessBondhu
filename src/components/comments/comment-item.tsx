"use client";

import { Heart, Reply, Trash2 } from "lucide-react";
import { useState } from "react";
import { ConfirmDialog } from "@/components/shared/confirm-dialog";
import { UserAvatar } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { useDeleteComment, useToggleCommentLike, type CommentScope } from "@/hooks/use-comments";
import { useMounted } from "@/hooks/use-mounted";
import { useRequireAuth } from "@/hooks/use-require-auth";
import { cn, timeAgoBn, toBanglaNumber } from "@/lib/utils";
import { useAuthStore } from "@/store/auth-store";
import type { Comment } from "@/types";
import { CommentForm } from "./comment-form";

interface CommentItemProps {
  comment: Comment;
  postId: string;
  scope?: CommentScope;
  /** Replies can't be replied to: the thread stays one level deep. */
  isReply?: boolean;
}

export function CommentItem({ comment, postId, scope = "posts", isReply = false }: CommentItemProps) {
  const mounted = useMounted();
  const requireAuth = useRequireAuth();
  const userId = useAuthStore((s) => s.user?.id);
  const [replying, setReplying] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const like = useToggleCommentLike(postId, scope);
  const del = useDeleteComment(postId, scope);

  const isOwn = mounted && !!userId && comment.author.id === userId;
  const liked = mounted && !!comment.likedByMe;

  return (
    <li className="flex gap-3">
      <UserAvatar name={comment.author.name} src={comment.author.avatar} className={cn("shrink-0", isReply ? "h-8 w-8" : "h-10 w-10")} />

      <div className="min-w-0 flex-1">
        <div className="rounded-2xl border border-border bg-card px-4 py-3 shadow-sm">
          <div className="flex flex-wrap items-baseline gap-x-2">
            <span className="font-semibold">{comment.author.name}</span>
            <time dateTime={comment.createdAt} className="text-sm text-ink-secondary" suppressHydrationWarning>
              {timeAgoBn(comment.createdAt)}
            </time>
          </div>
          {/* Rendered as plain text (never HTML) so user content can't inject markup */}
          <p className="mt-1 whitespace-pre-line break-words">{comment.content}</p>
        </div>

        <div className="mt-1 flex items-center gap-1">
          <Button
            variant="ghost"
            size="sm"
            aria-pressed={liked}
            aria-label={`লাইক (${toBanglaNumber(comment.likesCount)})`}
            className={cn("h-8 px-2", liked && "text-danger")}
            onClick={() => requireAuth("লাইক দিতে লগইন করুন") && like.mutate(comment.id)}
          >
            <Heart className={cn(liked && "fill-current")} aria-hidden />
            {comment.likesCount > 0 && toBanglaNumber(comment.likesCount)}
          </Button>

          {!isReply && (
            <Button
              variant="ghost"
              size="sm"
              className="h-8 px-2"
              onClick={() => requireAuth("উত্তর দিতে লগইন করুন") && setReplying((v) => !v)}
            >
              <Reply aria-hidden /> উত্তর
            </Button>
          )}

          {isOwn && (
            <Button variant="ghost" size="sm" className="h-8 px-2 text-ink-secondary hover:text-danger" onClick={() => setConfirmOpen(true)}>
              <Trash2 aria-hidden /> মুছুন
            </Button>
          )}
        </div>

        {replying && (
          <div className="mt-3">
            <CommentForm
              postId={postId}
              scope={scope}
              parentId={comment.id}
              placeholder={`${comment.author.name}-কে উত্তর লিখুন…`}
              submitLabel="উত্তর দিন"
              autoFocus
              onDone={() => setReplying(false)}
              onCancel={() => setReplying(false)}
            />
          </div>
        )}

        {!isReply && comment.replies && comment.replies.length > 0 && (
          <ul className="mt-4 space-y-4 border-l-2 border-border pl-4 sm:pl-6">
            {comment.replies.map((r) => <CommentItem key={r.id} comment={r} postId={postId} scope={scope} isReply />)}
          </ul>
        )}
      </div>

      <ConfirmDialog
        open={confirmOpen}
        onOpenChange={setConfirmOpen}
        destructive
        title="মন্তব্যটি মুছে ফেলবেন?"
        description={isReply ? "এই কাজটি আর ফেরানো যাবে না।" : "মন্তব্যটি এবং এর সব উত্তর মুছে যেতে পারে। এই কাজটি আর ফেরানো যাবে না।"}
        confirmLabel="মুছে ফেলুন"
        loading={del.isPending}
        onConfirm={() => del.mutate(comment.id, { onSuccess: () => setConfirmOpen(false) })}
      />
    </li>
  );
}
