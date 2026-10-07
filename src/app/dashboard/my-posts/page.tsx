import type { Metadata } from "next";
import { Suspense } from "react";
import { MyPostsView } from "@/components/dashboard/my-posts-view";
import { PostGridSkeleton } from "@/components/ui/skeleton";

export const metadata: Metadata = { title: "আমার পোস্ট" };

/** MyPostsView reads ?status= ?q= ?page= via useSearchParams, so it needs Suspense. */
export default function MyPostsPage() {
  return (
    <Suspense fallback={<PostGridSkeleton count={6} />}>
      <MyPostsView />
    </Suspense>
  );
}
