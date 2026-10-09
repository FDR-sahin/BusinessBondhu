import type { Metadata } from "next";
import { AuthGuard } from "@/components/dashboard/auth-guard";
import { DashboardShell } from "@/components/dashboard/dashboard-shell";

export const metadata: Metadata = {
  title: { default: "ড্যাশবোর্ড", template: "%s | ড্যাশবোর্ড | বিজনেস আইডিয়া জোন" },
  robots: { index: false, follow: false }, // private area: keep it out of search engines
};

/** Protected area: middleware (cookie check) + AuthGuard (real session) + sidebar/topbar shell. */
export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <AuthGuard>
      <DashboardShell>{children}</DashboardShell>
    </AuthGuard>
  );
}
