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

import mongoose from "mongoose";
import { connectToDatabase } from "@/lib/db";
import { BlogModel } from "@/lib/models";

/**
 * Direct query from MongoDB database with local fallbacks.
 */
const getArticle = cache(async (slug: string): Promise<{ post: BlogPostDetail | null; missing: boolean }> => {
  const decodedSlug = decodeURIComponent(slug);

  // 1. Direct MongoDB Database query
  try {
    await connectToDatabase();
    const query: any = {
      $or: [
        { slug: slug },
        { slug: decodedSlug },
        { id: slug },
        { id: decodedSlug },
        { customId: slug },
        { customId: decodedSlug },
        { title: decodedSlug },
      ],
    };
    if (mongoose.Types.ObjectId.isValid(decodedSlug)) {
      query.$or.push({ _id: decodedSlug });
    }
    const dbBlog = await BlogModel.findOne(query).lean();
    if (dbBlog) {
      const rawContent = dbBlog.content || dbBlog.excerpt || dbBlog.title;
      return {
        post: {
          id: String(dbBlog._id || dbBlog.id || dbBlog.customId),
          _id: String(dbBlog._id || dbBlog.id || dbBlog.customId),
          slug: dbBlog.slug || (dbBlog.title || "").toLowerCase().replace(/\s+/g, "-"),
          title: dbBlog.title,
          category: dbBlog.category || "general",
          excerpt: dbBlog.excerpt || "",
          content: parseRichBlogText(rawContent, dbBlog.excerpt),
          coverImage: dbBlog.coverImage || dbBlog.image || "/images/blog/default.jpg",
          publishedAt: dbBlog.createdAt || dbBlog.date || new Date().toISOString(),
          readingTime: dbBlog.readingTime || 5,
          author: {
            id: dbBlog.userId || "u-admin",
            name: typeof dbBlog.author === "string" ? dbBlog.author : dbBlog.author?.name || "Business Hub BD Team",
            avatar: "/images/avatars/default.jpg",
          },
          commentsEnabled: true,
        } as BlogPostDetail,
        missing: false,
      };
    }
  } catch (err) {
    console.error("Direct MongoDB query error in getArticle:", err);
  }

  // 2. Search in local DETAILED_BLOG_POSTS
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

  // 3. Search in user-created blogs store
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

          {/* Safe: sanitized on the server with strict paragraph & text formatting */}
          <div className="prose-blog text-ink leading-relaxed font-['Hind_Siliguri',sans-serif] space-y-4" dangerouslySetInnerHTML={{ __html: html }} />

          <div className="flex flex-wrap items-center gap-3 border-y border-border py-4">
            <span className="text-sm font-medium">লেখাটি শেয়ার করুন</span>
            <ShareButtons title={post.title} />
          </div>

          {post.commentsEnabled && <CommentSection postId={post.slug || post.id} scope="blog" />}
        </div>
      </article>

      <RelatedBlog slug={post.slug} />
    </>
  );
}
