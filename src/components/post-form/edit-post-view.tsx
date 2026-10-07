"use client";

import { QueryError } from "@/components/shared/query-error";
import { Skeleton } from "@/components/ui/skeleton";
import { useMyPost } from "@/hooks/use-dashboard";
import { fromPost } from "@/lib/post-schema";
import { PostForm } from "./post-form";

export function EditPostView({ id }: { id: string }) {
  const { data, isPending, isError, refetch } = useMyPost(id);

  if (isError) return <QueryError onRetry={() => void refetch()} />;
  if (isPending) return <div role="status" aria-label="লোড হচ্ছে" className="space-y-6"><Skeleton className="h-48 w-full rounded-2xl" /><Skeleton className="h-64 w-full rounded-2xl" /></div>;
  return <PostForm mode="edit" postId={id} initial={fromPost(data)} />;
}
