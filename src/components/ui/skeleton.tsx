import { cn } from "@/lib/utils";
import { Card } from "./card";

export function Skeleton({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div aria-hidden className={cn("animate-pulse rounded-lg bg-border/70", className)} {...props} />;
}

/** Matches PostCard layout so there is no layout shift when data arrives. */
export function PostCardSkeleton() {
  return (
    <Card className="overflow-hidden">
      <Skeleton className="aspect-video w-full rounded-none" />
      <div className="space-y-3 p-4">
        <Skeleton className="h-5 w-4/5" />
        <Skeleton className="h-4 w-1/2" />
        <Skeleton className="h-4 w-2/3" />
        <div className="flex items-center justify-between pt-2">
          <div className="flex items-center gap-2">
            <Skeleton className="h-8 w-8 rounded-full" />
            <Skeleton className="h-4 w-20" />
          </div>
          <Skeleton className="h-4 w-16" />
        </div>
      </div>
    </Card>
  );
}

export function PostGridSkeleton({ count = 6 }: { count?: number }) {
  return (
    <div role="status" aria-label="লোড হচ্ছে" className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: count }, (_, i) => <PostCardSkeleton key={i} />)}
    </div>
  );
}

export function StatCardSkeleton() {
  return (
    <Card className="space-y-3 p-6">
      <Skeleton className="h-4 w-24" />
      <Skeleton className="h-8 w-20" />
    </Card>
  );
}

export function ListSkeleton({ rows = 5 }: { rows?: number }) {
  return (
    <div role="status" aria-label="লোড হচ্ছে" className="space-y-3">
      {Array.from({ length: rows }, (_, i) => (
        <div key={i} className="flex items-center gap-4 rounded-2xl border border-border bg-card p-4">
          <Skeleton className="h-12 w-12 rounded-full" />
          <div className="flex-1 space-y-2">
            <Skeleton className="h-4 w-1/3" />
            <Skeleton className="h-4 w-2/3" />
          </div>
        </div>
      ))}
    </div>
  );
}
