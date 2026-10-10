import type { Metadata } from "next";
import { BlogForm } from "@/components/blog-form/blog-form";

export const metadata: Metadata = {
  title: "ব্লগ লিখুন",
  description: "আপনার ব্যবসার অভিজ্ঞতা ও পরামর্শ শেয়ার করুন।",
};

export default function CreateBlogPage() {
  return (
    <div className="space-y-6">
      <div className="border-b border-border pb-4">
        <h1 className="text-2xl font-bold tracking-tight text-ink md:text-3xl">নতুন ব্লগ লিখুন</h1>
        <p className="mt-1 text-sm text-ink-secondary">
          অন্যান্য উদ্যোক্তা ও পাঠকদের সাথে আপনার ব্যবসায়িক অভিজ্ঞতা, গাইড ও পরামর্শ শেয়ার করুন।
        </p>
      </div>
      <BlogForm />
    </div>
  );
}
