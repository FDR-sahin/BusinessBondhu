import type { Metadata } from "next";
import { Suspense } from "react";
import { OAuthCallback } from "@/components/auth/oauth-callback";

export const metadata: Metadata = { title: "সাইন ইন হচ্ছে", robots: { index: false } };

/** These forms read ?redirect= / ?token= via useSearchParams, which needs Suspense. */
export default function Page() {
  return (
    <Suspense fallback={null}>
      <OAuthCallback />
    </Suspense>
  );
}
