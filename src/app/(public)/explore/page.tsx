import type { Metadata } from "next";
import { Suspense } from "react";
import { ExploreView } from "@/components/explore/explore-view";
import { PostGridSkeleton, Skeleton } from "@/components/ui/skeleton";

export const metadata: Metadata = {
  title: "এক্সপ্লোর",
  description: "বিভাগ, জেলা, ক্যাটাগরি ও দাম অনুযায়ী বাংলাদেশের ব্যবসার আইডিয়া খুঁজুন।",
};

/** useSearchParams() (inside ExploreView) requires a Suspense boundary in the App Router. */
export default function ExplorePage() {
  return (
    <Suspense
      fallback={
        <div className="container-page py-8 md:py-12">
          <Skeleton className="h-10 w-2/3 max-w-md" />
          <div className="mt-12"><PostGridSkeleton count={6} /></div>
        </div>
      }
    >
      <ExploreView />
    </Suspense>
  );
}
