import type { Metadata } from "next";
import { Suspense } from "react";
import { BlogView } from "@/components/blog/blog-view";
import { PostGridSkeleton, Skeleton } from "@/components/ui/skeleton";

export const metadata: Metadata = {
  title: "ব্লগ",
  description: "সফল উদ্যোক্তাদের গল্প, এলাকাভিত্তিক গাইড, পাইকারি বাজার ও সরকারি সুবিধার তথ্য।",
};

/** useSearchParams() (category + page) needs a Suspense boundary. */
export default function BlogPage() {
  return (
    <Suspense
      fallback={
        <div className="container-page py-8 md:py-12">
          <Skeleton className="h-10 w-40" />
          <div className="mt-12"><PostGridSkeleton count={6} /></div>
        </div>
      }
    >
      <BlogView />
    </Suspense>
  );
}
