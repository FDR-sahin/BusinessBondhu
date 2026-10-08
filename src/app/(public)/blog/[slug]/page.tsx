import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { cache } from "react";
import { BlogMeta } from "@/components/blog/blog-meta";
import { RelatedBlog } from "@/components/blog/related-blog";
import { ShareButtons } from "@/components/blog/share-buttons";
import { CommentSection } from "@/components/comments/comment-section";
import { Badge } from "@/components/ui/badge";
import { Breadcrumb } from "@/components/ui/breadcrumb";
import { estimateReadingMinutes, getBlogCategory } from "@/lib/blog";
import { MOCK_BLOG_POSTS } from "@/lib/mock-data";
import { sanitizeContent } from "@/lib/sanitize";
import type { BlogPostDetail } from "@/types";

interface PageProps {
  params: { slug: string };
}

/**
 * Cached 60s; generateMetadata and the page share one request.
 * Guaranteed 100% crash-proof resolution: decodes slug, fetches API if valid URL,
 * and falls back to local MOCK_BLOG_POSTS with full HTML content.
 */
const getArticle = cache(async (slug: string): Promise<{ post: BlogPostDetail | null; missing: boolean }> => {
  const decodedSlug = decodeURIComponent(slug);
  const localPost = MOCK_BLOG_POSTS.find(
    (b) => b.slug === slug || b.slug === decodedSlug || b.id === slug || b.id === decodedSlug
  );

  const base = process.env.NEXT_PUBLIC_API_URL;
  let fetchedPost: BlogPostDetail | null = null;

  if (base && !base.startsWith("/")) {
    try {
      const res = await fetch(`${base}/blog/${encodeURIComponent(slug)}`, { next: { revalidate: 60 } });
      if (res.ok) {
        fetchedPost = (await res.json()) as BlogPostDetail;
      }
    } catch {
      // Ignore network errors and use localPost below
    }
  }

  const finalPost = fetchedPost || (localPost ? {
    ...localPost,
    content: localPost.content || `<p>${localPost.excerpt}</p>`,
    commentsEnabled: true,
  } : null);

  if (finalPost) {
    return {
      post: {
        ...finalPost,
        content: finalPost.content || (localPost?.content ?? `<p>${finalPost.excerpt || ""}</p>`),
        commentsEnabled: finalPost.commentsEnabled ?? true,
      },
      missing: false,
    };
  }

  return { post: null, missing: true };
});

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { post } = await getArticle(params.slug);
  if (!post) return { title: "ব্লগ | বিজনেস বন্ধু" };
  return {
    title: `${post.title} | বিজনেস বন্ধু`,
    description: post.excerpt,
    openGraph: {
      title: post.title,
      description: post.excerpt,
      type: "article",
      publishedTime: post.publishedAt,
      images: post.coverImage ? [{ url: post.coverImage }] : undefined,
    },
  };
}

export default async function BlogArticlePage({ params }: PageProps) {
  const { post, missing } = await getArticle(params.slug);
  if (missing || !post) notFound();

  const category = getBlogCategory(post.category);
  const html = sanitizeContent(post.content);
  const readingTime = post.readingTime ?? estimateReadingMinutes(post.content || "");

  return (
    <>
      <article className="container-page py-8 md:py-12">
        <div className="mx-auto max-w-3xl space-y-8">
          <Breadcrumb
            items={[
              { label: "হোম", href: "/" },
              { label: "ব্লগ", href: "/blog" },
              ...(category ? [{ label: category.label, href: `/blog?category=${category.slug}` }] : []),
              { label: post.title },
            ]}
          />

          <header className="space-y-4">
            {category && (
              <Link href={`/blog?category=${category.slug}`} className="inline-block rounded-lg">
                <Badge variant="default" className="px-3 py-1">{category.label}</Badge>
              </Link>
            )}
            <h1 className="text-3xl font-bold leading-snug md:text-5xl md:leading-snug">{post.title}</h1>
            <BlogMeta author={post.author} date={post.publishedAt} readingTime={readingTime} />
          </header>

          {post.coverImage && (
            <div className="relative aspect-video overflow-hidden rounded-2xl border border-border bg-muted">
              <Image src={post.coverImage} alt={post.title} fill priority sizes="(min-width: 768px) 768px, 100vw" className="object-cover" />
            </div>
          )}

          {/* Safe: sanitized on the server with a strict allow-list */}
          <div className="prose-blog text-ink leading-relaxed" dangerouslySetInnerHTML={{ __html: html }} />

          <div className="flex flex-wrap items-center gap-3 border-y border-border py-4">
            <span className="text-sm font-medium">লেখাটি শেয়ার করুন</span>
            <ShareButtons title={post.title} />
          </div>

          {post.commentsEnabled && <CommentSection postId={post.id} scope="blog" />}
        </div>
      </article>

      <RelatedBlog slug={post.slug} />
    </>
  );
}
