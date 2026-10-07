import type { Metadata } from "next";
import { Suspense } from "react";
import { PostCollectionView } from "@/components/dashboard/post-collection-view";
import { ListSkeleton } from "@/components/ui/skeleton";

export const metadata: Metadata = { title: "লাইক করা পোস্ট" };

/** Reads ?page= / ?filter= via useSearchParams, so it needs Suspense. */
export default function Page() {
  return (
    <Suspense fallback={<ListSkeleton rows={4} />}>
      <PostCollectionView kind="likes" />
    </Suspense>
  );
}
