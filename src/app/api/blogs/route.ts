import { NextResponse } from "next/server";
import { DETAILED_BLOG_POSTS } from "@/lib/blog-data";

export async function GET() {
  const data = DETAILED_BLOG_POSTS.map((post) => ({
    _id: post.id,
    id: post.id,
    title: post.title,
    category: post.category,
    excerpt: post.excerpt,
    content: post.content,
    createdAt: post.publishedAt || "2026-01-15T00:00:00.000Z",
    author: post.author?.name || "Business Hub BD Team",
  }));

  return NextResponse.json({
    success: true,
    count: data.length,
    data,
  });
}
