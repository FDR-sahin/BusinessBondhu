import { NextResponse } from "next/server";
import { DETAILED_BLOG_POSTS } from "@/lib/blog-data";

export async function handleBlogList(request: Request) {
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

export async function handleBlogFeatured() {
  return NextResponse.json(DETAILED_BLOG_POSTS[0] || null);
}

export async function handleBlogSlug(slug: string) {
  const decodedSlug = decodeURIComponent(slug);
  const blog = DETAILED_BLOG_POSTS.find(
    (b) => b.slug === slug || b.slug === decodedSlug || b.id === slug || b.id === decodedSlug
  );

  if (!blog) {
    return NextResponse.json({ message: "Blog post not found" }, { status: 404 });
  }

  return NextResponse.json({
    ...blog,
    content: blog.content || `<p>${blog.excerpt}</p>`,
    commentsEnabled: true,
  });
}

export async function handleBlogCommentsGet(request: Request) {
  const origin = request.headers.get("origin") || "*";
  return NextResponse.json([], {
    headers: {
      "Access-Control-Allow-Origin": origin,
      "Access-Control-Allow-Credentials": "true",
      "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type, Authorization",
    },
  });
}

export async function handleBlogCommentsOptions(request: Request) {
  const origin = request.headers.get("origin") || "*";
  return new NextResponse(null, {
    status: 200,
    headers: {
      "Access-Control-Allow-Origin": origin,
      "Access-Control-Allow-Credentials": "true",
      "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type, Authorization",
    },
  });
}

export async function handleBlogRelated(slug: string) {
  const decodedSlug = decodeURIComponent(slug);

  const related = DETAILED_BLOG_POSTS.filter(
    (b) => b.slug !== slug && b.slug !== decodedSlug && b.id !== slug
  ).slice(0, 3);

  return NextResponse.json(related);
}
