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
import { DETAILED_BLOG_POSTS } from "@/lib/blog-data";
import { estimateReadingMinutes, getBlogCategory } from "@/lib/blog";
import { parseRichBlogText } from "@/lib/blog-formatter";
import { sanitizeContent } from "@/lib/sanitize";
import { findUserBlog } from "@/lib/user-blogs-store";
import type { BlogPostDetail } from "@/types";

interface PageProps {
  params: { slug: string };
}

export const dynamic = "force-dynamic";

/**
 * Direct zero-latency resolution from DETAILED_BLOG_POSTS with decoding and external API fallback.
 */
const getArticle = cache(async (slug: string): Promise<{ post: BlogPostDetail | null; missing: boolean }> => {
  const decodedSlug = decodeURIComponent(slug);

  // 1. Search in local DETAILED_BLOG_POSTS
  const localPost = DETAILED_BLOG_POSTS.find(
    (b) =>
      String(b.id) === slug ||
      String(b.id) === decodedSlug ||
      b.slug === slug ||
      b.slug === decodedSlug ||
      (b.title && b.title.toLowerCase().replace(/\s+/g, "-") === slug) ||
      (b.title && b.title.toLowerCase().replace(/\s+/g, "-") === decodedSlug)
  );

  if (localPost) {
    return {
      post: {
        ...localPost,
        content: parseRichBlogText(localPost.content, localPost.excerpt),
        commentsEnabled: true,
      },
      missing: false,
    };
  }

  // 1.5. Search in user-created blogs store (only if approved)
  const userBlog = findUserBlog(slug) || findUserBlog(decodedSlug);
  if (userBlog && userBlog.status === "approved") {
    return {
      post: {
        id: String(userBlog.id),
        slug: userBlog.slug,
        title: userBlog.title,
        category: userBlog.category || "general",
        excerpt: userBlog.excerpt,
        content: parseRichBlogText(userBlog.content, userBlog.excerpt),
        coverImage: userBlog.coverImage,
        publishedAt: userBlog.createdAt,
        readingTime: userBlog.readingTime || 5,
        author: {
          id: userBlog.author?.id || "u-author",
          name: userBlog.author?.name || "লেখক",
          avatar: userBlog.author?.avatar || "/images/avatars/default.jpg",
        },
        commentsEnabled: true,
      } as BlogPostDetail,
      missing: false,
    };
  }

  // 2. Fetch from backend API /api/blogs
  const base = process.env.NEXT_PUBLIC_API_URL || "https://uddok-admin.vercel.app";
  try {
    const res = await fetch(`${base.replace(/\/$/, "")}/api/blogs`, { cache: "no-store" });
    if (res.ok) {
      const result = await res.json();
      if (result.success && Array.isArray(result.data)) {
        const fetched = result.data.find(
          (b: any) =>
            String(b._id) === slug ||
            String(b.id) === slug ||
            String(b._id) === decodedSlug ||
            String(b.id) === decodedSlug ||
            b.slug === slug ||
            b.slug === decodedSlug ||
            (b.title && b.title.trim().toLowerCase() === decodedSlug.trim().toLowerCase()) ||
            (b.title && b.title.toLowerCase().replace(/\s+/g, "-") === slug) ||
            (b.title && b.title.toLowerCase().replace(/\s+/g, "-") === decodedSlug)
        );
        if (fetched) {
          const rawContent = fetched.content || fetched.excerpt || fetched.title;
          return {
            post: {
              id: String(fetched._id || fetched.id),
              slug: fetched.slug || (fetched.title || "").toLowerCase().replace(/\s+/g, "-"),
              title: fetched.title,
              category: fetched.category || "general",
              excerpt: fetched.excerpt || "",
              content: parseRichBlogText(rawContent, fetched.excerpt),
              publishedAt: fetched.createdAt || fetched.date || new Date().toISOString(),
              readingTime: 5,
              author: {
                id: "u-admin",
                name: typeof fetched.author === "string" ? fetched.author : "Business Hub BD Team",
                avatar: "/images/avatars/default.jpg",
              },
              commentsEnabled: true,
            } as BlogPostDetail,
            missing: false,
          };
        }
      }
    }
  } catch (err) {
    console.error("Failed to fetch blog article:", err);
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
            <h1 className="text-3xl font-bold leading-snug md:text-5xl md:leading-snug text-ink">{post.title}</h1>
            <BlogMeta author={post.author} date={post.publishedAt} readingTime={readingTime} />
          </header>

          {post.coverImage && (
            <div className="relative aspect-video overflow-hidden rounded-2xl border border-border bg-muted">
              <Image src={post.coverImage} alt={post.title} fill priority sizes="(min-width: 768px) 768px, 100vw" className="object-cover" />
            </div>
          )}

          {/* Safe: sanitized on the server with strict paragraph & text formatting */}
          <div className="prose-blog text-ink leading-relaxed font-['Hind_Siliguri',sans-serif] space-y-4" dangerouslySetInnerHTML={{ __html: html }} />

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
