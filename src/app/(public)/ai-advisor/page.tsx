import type { Metadata } from "next";
import { Suspense } from "react";
import { AdvisorView } from "@/components/advisor/advisor-view";
import { Skeleton } from "@/components/ui/skeleton";

export const metadata: Metadata = {
  title: "এআই পরামর্শক",
  description: "আপনার বাজেট ও এলাকা বলুন, খরচ-লাভ-ঝুঁকিসহ ব্যবসার আইডিয়া পান।",
};

/** useSearchParams() (budget prefill) needs a Suspense boundary. */
export default function AiAdvisorPage() {
  return (
    <Suspense fallback={<div className="container-page py-8 md:py-12"><Skeleton className="h-10 w-72" /></div>}>
      <AdvisorView />
    </Suspense>
  );
}
