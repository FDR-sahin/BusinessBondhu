import type { Metadata } from "next";
import { Suspense } from "react";
import { MyCommentsView } from "@/components/dashboard/my-comments-view";
import { ListSkeleton } from "@/components/ui/skeleton";

export const metadata: Metadata = { title: "মন্তব্য" };

/** Reads ?page= / ?filter= via useSearchParams, so it needs Suspense. */
export default function Page() {
  return (
    <Suspense fallback={<ListSkeleton rows={4} />}>
      <MyCommentsView />
    </Suspense>
  );
}
