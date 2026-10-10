import type { Metadata } from "next";
import { MyBlogsView } from "@/components/dashboard/my-blogs-view";

export const metadata: Metadata = {
  title: "আমার ব্লগসমূহ",
  description: "আপনার প্রকাশিত ও খসড়া ব্লগের তালিকা ও স্ট্যাটাস।",
};

export default function MyBlogsPage() {
  return (
    <div className="space-y-6">
      <div className="border-b border-border pb-4">
        <h1 className="text-2xl font-bold tracking-tight text-ink md:text-3xl">আমার ব্লগসমূহ</h1>
        <p className="mt-1 text-sm text-ink-secondary">
          আপনার লিখিত ব্লগের অনুমোদন স্ট্যাটাস, পর্যালোচনা এবং প্রকাশিত আর্টিকেলের তালিকা।
        </p>
      </div>
      <MyBlogsView />
    </div>
  );
}
