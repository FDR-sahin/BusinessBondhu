import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { cache } from "react";
import { PostDetailView } from "@/components/post/post-detail-view";
import type { PostDetail } from "@/types";

interface PageProps {
  params: { id: string };
}

/**
 * Server-side fetch (cached 60s). `cache()` makes generateMetadata and the page
 * share one request. A 404 from the API becomes a real 404 page; any other
 * failure just means the client component will fetch the post itself.
 */
const getPost = cache(async (id: string): Promise<{ post: PostDetail | null; missing: boolean }> => {
  const base = process.env.NEXT_PUBLIC_API_URL;
  if (!base) return { post: null, missing: false };
  try {
    const res = await fetch(`${base}/posts/${encodeURIComponent(id)}`, { next: { revalidate: 60 } });
    if (res.status === 404) return { post: null, missing: true };
    if (!res.ok) return { post: null, missing: false };
    return { post: (await res.json()) as PostDetail, missing: false };
  } catch {
    return { post: null, missing: false };
  }
});

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { post } = await getPost(params.id);
  if (!post) return { title: "পোস্ট" };

  const description = post.description.replace(/\s+/g, " ").slice(0, 160);
  return {
    title: post.title,
    description,
    openGraph: {
      title: post.title,
      description,
      type: "article",
      images: post.image ? [{ url: post.image }] : undefined,
    },
  };
}

export default async function PostPage({ params }: PageProps) {
  const { post, missing } = await getPost(params.id);
  if (missing) notFound();
  return <PostDetailView id={params.id} initialPost={post ?? undefined} />;
}
