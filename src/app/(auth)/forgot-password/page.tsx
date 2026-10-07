import type { Metadata } from "next";
import { Suspense } from "react";
import { ForgotPasswordForm } from "@/components/auth/forgot-password-form";

export const metadata: Metadata = { title: "পাসওয়ার্ড রিসেট", description: "ইমেইলে পাসওয়ার্ড রিসেটের লিংক নিন।" };

/** These forms read ?redirect= / ?token= via useSearchParams, which needs Suspense. */
export default function Page() {
  return (
    <Suspense fallback={null}>
      <ForgotPasswordForm />
    </Suspense>
  );
}
