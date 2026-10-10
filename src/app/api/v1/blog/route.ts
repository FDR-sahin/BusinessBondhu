import { NextResponse } from "next/server";
import { DETAILED_BLOG_POSTS } from "@/lib/blog-data";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const category = searchParams.get("category");
  const page = parseInt(searchParams.get("page") || "1", 10);
  const limit = parseInt(searchParams.get("limit") || "9", 10);
  const backendUrl = process.env.NEXT_PUBLIC_API_URL || "https://uddok-admin.vercel.app";

  let adminItems: any[] = [];

  try {
    const res = await fetch(`${backendUrl.replace(/\/$/, "")}/api/blogs`, {
      cache: "no-store",
      headers: { "Content-Type": "application/json" },
    });

    if (res.ok) {
      const result = await res.json();
      if (result.success && Array.isArray(result.data)) {
        adminItems = result.data.map((post: any) => ({
          id: String(post.id || post._id),
          slug: (post.title || "").toLowerCase().replace(/\s+/g, "-"),
          title: post.title,
          category: post.category,
          excerpt: post.excerpt,
          content: post.content,
          publishedAt: post.createdAt || post.date || new Date().toISOString(),
          readingTime: 5,
          author: {
            name: typeof post.author === "string" ? post.author : "Business Hub BD Team",
            role: post.authorTitle || "Founder & CEO, Regards Tech",
            avatar: "/images/avatars/default.jpg",
          },
          likesCount: post.likes || 12,
          commentsCount: post.comments?.length || 0,
        }));
      }
    }
  } catch (err) {
    console.error("Failed to fetch blogs from admin backend:", err);
  }

  // Merge with DETAILED_BLOG_POSTS
  const existingIds = new Set(adminItems.map((b) => String(b.id)));
  const fallbackItems = DETAILED_BLOG_POSTS.filter((b) => !existingIds.has(String(b.id))).map((post) => ({
    id: String(post.id),
    slug: post.slug,
    title: post.title,
    category: post.category,
    excerpt: post.excerpt,
    content: post.content,
    publishedAt: post.publishedAt,
    readingTime: post.readingTime || 5,
    author: {
      name: post.author?.name || "Business Hub BD Team",
      role: "Founder & CEO, Regards Tech",
      avatar: post.author?.avatar || "/images/avatars/default.jpg",
    },
    likesCount: 15,
    commentsCount: 3,
  }));

  let items = [...adminItems, ...fallbackItems];

  if (category && category !== "all") {
    items = items.filter((b) => b.category === category);
  }

  const total = items.length;
  const totalPages = Math.ceil(total / limit);
  const start = (page - 1) * limit;
  const paginatedItems = items.slice(start, start + limit);

  return NextResponse.json({
    items: paginatedItems,
    total,
    page,
    limit,
    totalPages,
  });
}
