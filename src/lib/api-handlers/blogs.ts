import { NextResponse } from "next/server";
import { DETAILED_BLOG_POSTS } from "@/lib/blog-data";
import { getUserBlogs } from "@/lib/user-blogs-store";
import { handleBlogCreate } from "./blog";

export async function handleBlogsGet() {
  const backendUrl = process.env.NEXT_PUBLIC_API_URL || "https://uddok-admin.vercel.app";
  const userBlogs = getUserBlogs();
  const unapprovedIds = new Set(
    userBlogs
      .filter((b) => b.status !== "approved")
      .map((b) => String(b.id || b._id))
  );

  let adminBlogs: any[] = [];

  try {
    const res = await fetch(`${backendUrl.replace(/\/$/, "")}/api/blogs`, {
      cache: "no-store",
      headers: { "Content-Type": "application/json" },
    });

    if (res.ok) {
      const result = await res.json();
      if (result.success && Array.isArray(result.data)) {
        adminBlogs = result.data
          // Only show approved blogs on the public site
          .filter((post: any) => {
            const id = String(post.id || post._id);
            if (unapprovedIds.has(id)) return false;
            return !post.status || post.status === "approved";
          })
          .map((post: any) => ({
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

  // Merge with approved locally stored user blogs
  const userApproved = getUserBlogs()
    .filter((b) => b.status === "approved")
    .map((b) => ({
      _id: String(b._id || b.id),
      id: String(b.id),
      title: b.title,
      category: b.category,
      excerpt: b.excerpt,
      content: b.content,
      createdAt: b.createdAt,
      author: b.author?.name || "লেখক",
      authorTitle: b.authorTitle || "উদ্যোক্তা ও লেখক",
      readTime: b.readTime || `${b.readingTime || 5} মিনিট`,
    }));

  const combined = [...userApproved, ...adminBlogs, ...fallbackFormatted];

  return NextResponse.json({
    success: true,
    count: combined.length,
    data: combined,
  });
}

export { handleBlogCreate };
