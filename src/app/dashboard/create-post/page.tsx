import type { Metadata } from "next";
import { PostForm } from "@/components/post-form/post-form";

export const metadata: Metadata = { title: "নতুন পোস্ট" };

export default function CreatePostPage() {
  return <PostForm mode="create" />;
}
