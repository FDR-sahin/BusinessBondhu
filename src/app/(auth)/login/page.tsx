import type { Metadata } from "next";
import { Suspense } from "react";
import { LoginForm } from "@/components/auth/login-form";

export const metadata: Metadata = { title: "লগইন", description: "Business Hub BD অ্যাকাউন্টে লগইন করুন।" };

/** These forms read ?redirect= / ?token= via useSearchParams, which needs Suspense. */
export default function Page() {
  return (
    <Suspense fallback={null}>
      <LoginForm />
    </Suspense>
  );
}
