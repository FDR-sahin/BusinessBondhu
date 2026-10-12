import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/db";
import { BlogModel } from "@/lib/models";
import { DETAILED_BLOG_POSTS } from "@/lib/blog-data";
import { handleBlogCreate } from "./blog";

export async function handleBlogsGet() {
  let dbBlogs: any[] = [];

  try {
    await connectToDatabase();
    const blogs = await BlogModel.find({ status: "approved" }).sort({ _id: -1 }).lean();

    if (Array.isArray(blogs) && blogs.length > 0) {
      dbBlogs = blogs.map((post: any) => {
        const blogId = String(post._id || post.id || post.customId);
        return {
          _id: blogId,
          id: blogId,
          customId: post.customId || blogId,
          title: post.title,
          slug: post.slug || (post.title || "").toLowerCase().replace(/\s+/g, "-"),
          category: post.category,
          excerpt: post.excerpt,
          content: post.content,
          createdAt: post.createdAt || post.date || new Date().toISOString(),
          author: typeof post.author === "string" ? post.author : post.author?.name || "Business Hub BD Team",
          authorTitle: post.authorTitle || "Founder & CEO, Regards Tech",
          readTime: post.readTime || `${post.readingTime || 5} মিনিট`,
          readingTime: post.readingTime || 5,
          coverImage: post.coverImage || post.image || "/images/blog/default.jpg",
          status: "approved",
        };
      });
    }
  } catch (err) {
    console.error("Failed to fetch blogs directly from MongoDB:", err);
  }

  // Merge with fallback DETAILED_BLOG_POSTS
  const existingIds = new Set(dbBlogs.map((b) => String(b.id)));
  const existingTitles = new Set(dbBlogs.map((b) => (b.title || "").trim().toLowerCase()));

  const fallbackFormatted = DETAILED_BLOG_POSTS.filter(
    (post) => !existingIds.has(String(post.id)) && !existingTitles.has((post.title || "").trim().toLowerCase())
  ).map((post) => ({
    _id: post.id,
    id: post.id,
    customId: post.id,
    title: post.title,
    slug: post.slug,
    category: post.category,
    excerpt: post.excerpt,
    content: post.content,
    createdAt: post.publishedAt || "2026-01-15T00:00:00.000Z",
    author: post.author?.name || "Business Hub BD Team",
    authorTitle: "Founder & CEO, Regards Tech",
    readTime: `${post.readingTime || 5} মিনিট`,
    readingTime: post.readingTime || 5,
    coverImage: post.coverImage || "/images/blog/default.jpg",
    status: "approved",
  }));

  const combined = dbBlogs.length > 0 ? dbBlogs : fallbackFormatted;

  return NextResponse.json({
    success: true,
    count: combined.length,
    data: combined,
  });
}

export { handleBlogCreate };
