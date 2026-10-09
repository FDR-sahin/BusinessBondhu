import { NextResponse } from "next/server";
import { DETAILED_BLOG_POSTS } from "@/lib/blog-data";

export const dynamic = "force-dynamic";

export async function GET() {
  const backendUrl = process.env.NEXT_PUBLIC_API_URL || "https://uddok-admin.vercel.app";

  try {
    const res = await fetch(`${backendUrl.replace(/\/$/, "")}/api/blogs`, {
      cache: "no-store",
      headers: { "Content-Type": "application/json" },
    });

    if (res.ok) {
      const result = await res.json();
      if (result.success && Array.isArray(result.data) && result.data.length > 0) {
        const data = result.data.map((post: any) => ({
          _id: post._id || post.id,
          id: post.id || post._id,
          title: post.title,
          category: post.category,
          excerpt: post.excerpt,
          content: post.content,
          createdAt: post.createdAt || post.date || new Date().toISOString(),
          author: post.author || "Business Hub BD Team",
          authorTitle: post.authorTitle || "Founder & CEO, Regards Tech",
          readTime: post.readTime || "৫ মিনিট",
        }));

        return NextResponse.json({
          success: true,
          count: data.length,
          data,
        });
      }
    }
  } catch (err) {
    console.error("Failed to fetch blogs from admin backend, using fallback:", err);
  }

  // Fallback to static detailed posts if backend is offline
  const fallbackData = DETAILED_BLOG_POSTS.map((post) => ({
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

  return NextResponse.json({
    success: true,
    count: fallbackData.length,
    data: fallbackData,
  });
}
