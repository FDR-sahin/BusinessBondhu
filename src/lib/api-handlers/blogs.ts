import { NextResponse } from "next/server";
import { DETAILED_BLOG_POSTS } from "@/lib/blog-data";

export async function handleBlogsGet() {
  const backendUrl = process.env.NEXT_PUBLIC_API_URL || "https://uddok-admin.vercel.app";
  let adminBlogs: any[] = [];

  try {
    const res = await fetch(`${backendUrl.replace(/\/$/, "")}/api/blogs`, {
      cache: "no-store",
      headers: { "Content-Type": "application/json" },
    });

    if (res.ok) {
      const result = await res.json();
      if (result.success && Array.isArray(result.data)) {
        adminBlogs = result.data.map((post: any) => ({
          _id: String(post._id || post.id),
          id: String(post.id || post._id),
          title: post.title,
          category: post.category,
          excerpt: post.excerpt,
          content: post.content,
          createdAt: post.createdAt || post.date || new Date().toISOString(),
          author: typeof post.author === "string" ? post.author : "Business Hub BD Team",
          authorTitle: post.authorTitle || "Founder & CEO, Regards Tech",
          readTime: post.readTime || "৫ মিনিট",
        }));
      }
    }
  } catch (err) {
    console.error("Failed to fetch blogs from admin backend:", err);
  }

  // Merge admin blogs with DETAILED_BLOG_POSTS
  const existingIds = new Set(adminBlogs.map((b) => String(b.id)));
  const fallbackFormatted = DETAILED_BLOG_POSTS.filter((post) => !existingIds.has(String(post.id))).map((post) => ({
    _id: post.id,
    id: post.id,
    title: post.title,
    category: post.category,
    excerpt: post.excerpt,
    content: post.content,
    createdAt: post.publishedAt || "2026-01-15T00:00:00.000Z",
    author: post.author?.name || "Business Hub BD Team",
    authorTitle: "Founder & CEO, Regards Tech",
    readTime: `${post.readingTime || 5} মিনিট`,
  }));

  const combined = [...adminBlogs, ...fallbackFormatted];

  return NextResponse.json({
    success: true,
    count: combined.length,
    data: combined,
  });
}
