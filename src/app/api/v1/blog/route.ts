import { NextResponse } from "next/server";
import { DETAILED_BLOG_POSTS } from "@/lib/blog-data";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const category = searchParams.get("category");
  const page = parseInt(searchParams.get("page") || "1", 10);
  const limit = parseInt(searchParams.get("limit") || "9", 10);
  const backendUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";

  try {
    const res = await fetch(`${backendUrl.replace(/\/$/, "")}/api/blogs`, {
      cache: "no-store",
      headers: { "Content-Type": "application/json" },
    });

    if (res.ok) {
      const result = await res.json();
      if (result.success && Array.isArray(result.data) && result.data.length > 0) {
        let items: any[] = result.data.map((post: any) => ({
          id: post.id || post._id,
          slug: (post.title || "").toLowerCase().replace(/\s+/g, "-"),
          title: post.title,
          category: post.category,
          excerpt: post.excerpt,
          content: post.content,
          publishedAt: post.createdAt || post.date || new Date().toISOString(),
          readTimeMinutes: 5,
          author: {
            name: post.author || "Business Hub BD Team",
            role: post.authorTitle || "Founder & CEO, Regards Tech",
            avatar: "/images/avatars/default.jpg",
          },
          likesCount: post.likes || 12,
          commentsCount: post.comments?.length || 0,
        }));

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
    }
  } catch (err) {
    console.error("Failed to fetch blogs from admin backend, using fallback:", err);
  }

  // Fallback if backend server is offline
  let filtered = DETAILED_BLOG_POSTS;
  if (category && category !== "all") {
    filtered = filtered.filter((b) => b.category === category);
  }

  const start = (page - 1) * limit;
  const items = filtered.slice(start, start + limit);
  const total = filtered.length;
  const totalPages = Math.ceil(total / limit);

  return NextResponse.json({
    items,
    total,
    page,
    limit,
    totalPages,
  });
}
