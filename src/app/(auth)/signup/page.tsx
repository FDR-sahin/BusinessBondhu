import type { Metadata } from "next";
import { Suspense } from "react";
import { SignupForm } from "@/components/auth/signup-form";

export const metadata: Metadata = { title: "সাইন আপ", description: "নতুন অ্যাকাউন্ট খুলে ব্যবসার আইডিয়া শেয়ার করুন ও খুঁজুন।" };

/** These forms read ?redirect= / ?token= via useSearchParams, which needs Suspense. */
export default function Page() {
  return (
    <Suspense fallback={null}>
      <SignupForm />
    </Suspense>
  );
}
