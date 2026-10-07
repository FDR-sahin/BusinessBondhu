import type { Metadata } from "next";
import { Suspense } from "react";
import { NotificationsView } from "@/components/dashboard/notifications-view";
import { ListSkeleton } from "@/components/ui/skeleton";

export const metadata: Metadata = { title: "নোটিফিকেশন" };

/** Reads ?page= / ?filter= via useSearchParams, so it needs Suspense. */
export default function Page() {
  return (
    <Suspense fallback={<ListSkeleton rows={4} />}>
      <NotificationsView />
    </Suspense>
  );
}
