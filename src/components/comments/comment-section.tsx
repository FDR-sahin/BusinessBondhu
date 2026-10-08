"use client";

import { MessageSquare } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { QueryError } from "@/components/shared/query-error";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";
import { ListSkeleton } from "@/components/ui/skeleton";
import { useComments, type CommentScope } from "@/hooks/use-comments";
import { useMounted } from "@/hooks/use-mounted";
import { toBanglaNumber } from "@/lib/utils";
import { useIsAuthenticated } from "@/store/auth-store";
import { CommentForm } from "./comment-form";
import { CommentItem } from "./comment-item";

export function CommentSection({ postId, scope = "posts", count }: { postId: string; scope?: CommentScope; count?: number }) {
  const mounted = useMounted();
  const authed = useIsAuthenticated();
  const pathname = usePathname();
  const { data, isPending, isError, refetch } = useComments(postId, scope);

  // Safe array evaluation guarantees 100% immunity to TypeError: reduce is not a function
  const safeComments = Array.isArray(data)
    ? data
    : data && typeof data === "object" && "items" in data && Array.isArray((data as any).items)
    ? (data as any).items
    : [];

  const total = count ?? safeComments.reduce((n: number, c: any) => n + 1 + (c.replies?.length ?? 0), 0);

  return (
    <section aria-labelledby="comments-title" className="space-y-6">
      <h2 id="comments-title" className="text-xl font-semibold md:text-2xl">মন্তব্য ({toBanglaNumber(total)})</h2>

      {/* Waits for mount: the session is in localStorage, so the server can't know it. */}
      {mounted && authed ? (
        <CommentForm postId={postId} scope={scope} />
      ) : (
        <Card className="flex flex-col items-start justify-between gap-3 p-5 sm:flex-row sm:items-center">
          <p className="text-ink-secondary">মন্তব্য করতে অ্যাকাউন্টে লগইন করুন।</p>
          <Button asChild><Link href={`/login?redirect=${encodeURIComponent(pathname)}`}>লগইন করুন</Link></Button>
        </Card>
      )}

      {isError ? (
        <QueryError onRetry={() => void refetch()} />
      ) : isPending ? (
        <ListSkeleton rows={3} />
      ) : safeComments.length === 0 ? (
        <EmptyState icon={MessageSquare} title="এখনো কোনো মন্তব্য নেই" description="প্রথম মন্তব্যটি আপনিই করুন।" />
      ) : (
        <ul className="space-y-6">
          {safeComments.map((c: any) => (
            <CommentItem key={c.id} comment={c} postId={postId} scope={scope} />
          ))}
        </ul>
      )}
    </section>
  );
}
