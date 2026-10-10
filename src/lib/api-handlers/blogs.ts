import { NextResponse } from "next/server";
import { DETAILED_BLOG_POSTS } from "@/lib/blog-data";
import { getUserBlogs } from "@/lib/user-blogs-store";
import { handleBlogCreate } from "./blog";

export async function handleBlogsGet() {
  const backendUrl = process.env.NEXT_PUBLIC_API_URL || "https://uddok-admin.vercel.app";
  const userBlogs = getUserBlogs();
  const unapprovedIds = new Set<string>();
  const unapprovedTitles = new Set<string>();

  userBlogs.forEach((b) => {
    if (b.status !== "approved") {
      if (b.id) unapprovedIds.add(String(b.id));
      if (b._id) unapprovedIds.add(String(b._id));
      if (b.adminIdeaId) unapprovedIds.add(String(b.adminIdeaId));
      if (b.title) unapprovedTitles.add(b.title.trim().toLowerCase());
    }
  });

  try {
    const ideasRes = await fetch(`${backendUrl.replace(/\/$/, "")}/api/ideas?status=all`, {
      cache: "no-store",
      headers: { "Content-Type": "application/json" },
    });
    if (ideasRes.ok) {
      const ideasData = await ideasRes.json();
      if (ideasData.success && Array.isArray(ideasData.data)) {
        ideasData.data.forEach((item: any) => {
          const isBlog = item.isBlog === true || (item.title && item.title.startsWith("[ব্লগ]"));
          if (isBlog && item.status !== "approved") {
            const clean = (item.blogData?.title || item.title.replace(/^\[ব্লগ\]\s*/, "")).trim().toLowerCase();
            unapprovedTitles.add(clean);
            unapprovedIds.add(String(item._id || item.id));
          }
        });
      }
    }
  } catch (err) {
    console.error("Failed to fetch ideas status in blogs.ts:", err);
  }

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
            const titleLower = (post.title || "").trim().toLowerCase();
            if (unapprovedIds.has(id)) return false;
            if (unapprovedTitles.has(titleLower)) return false;
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
