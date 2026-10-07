import type { Metadata } from "next";
import { EditPostView } from "@/components/post-form/edit-post-view";

export const metadata: Metadata = { title: "পোস্ট সম্পাদনা" };

export default function EditPostPage({ params }: { params: { id: string } }) {
  return <EditPostView id={params.id} />;
}
