import { NextResponse } from "next/server";
import { DETAILED_BLOG_POSTS } from "@/lib/blog-data";
import {
  getUserBlogs,
  saveUserBlog,
  deleteUserBlog,
  findUserBlog,
  type UserStoredBlog,
} from "@/lib/user-blogs-store";
import { getUserProfile } from "@/lib/user-profile-store";

export async function handleBlogList(request: Request) {
  const { searchParams } = new URL(request.url);
  const category = searchParams.get("category");
  const page = parseInt(searchParams.get("page") || "1", 10);
  const limit = parseInt(searchParams.get("limit") || "9", 10);
  const backendUrl = process.env.NEXT_PUBLIC_API_URL || "https://uddok-admin.vercel.app";

  const userBlogs = getUserBlogs();
  const unapprovedIds = new Set(
    userBlogs
      .filter((b) => b.status !== "approved")
      .map((b) => String(b.id || b._id))
  );

  let adminItems: any[] = [];

  try {
    const res = await fetch(`${backendUrl.replace(/\/$/, "")}/api/blogs`, {
      cache: "no-store",
      headers: { "Content-Type": "application/json" },
    });

    if (res.ok) {
      const result = await res.json();
      if (result.success && Array.isArray(result.data)) {
        adminItems = result.data
          // Only show approved blogs on the public site
          .filter((post: any) => {
            const id = String(post.id || post._id);
            if (unapprovedIds.has(id)) return false;
            return !post.status || post.status === "approved";
          })
          .map((post: any) => ({
            id: String(post.id || post._id),
            _id: String(post._id || post.id),
            slug: post.slug || (post.title || "").toLowerCase().replace(/\s+/g, "-"),
            title: post.title,
            category: post.category || "general",
            excerpt: post.excerpt || "",
            content: post.content || "",
            coverImage: post.image || post.coverImage || "/images/blog/default.jpg",
            publishedAt: post.createdAt || post.date || new Date().toISOString(),
            readingTime: post.readingTime || 5,
            readTime: post.readTime || `${post.readingTime || 5} মিনিট`,
            author: {
              name: typeof post.author === "string" ? post.author : post.author?.name || "ব্যবসা বন্ধু টিম",
              role: post.authorTitle || "উদ্যোক্তা ও লেখক",
              avatar: "/images/avatars/default.jpg",
            },
            likesCount: post.likesCount ?? post.likes ?? 12,
            commentsCount: post.comments?.length || 0,
            status: "approved",
          }));
      }
    }
  } catch (err) {
    console.error("Failed to fetch blogs from admin backend:", err);
  }

  // Merge with fallback DETAILED_BLOG_POSTS
  const existingIds = new Set(adminItems.map((b) => String(b.id)));
  const fallbackItems = DETAILED_BLOG_POSTS.filter((b) => !existingIds.has(String(b.id))).map((post) => ({
    id: String(post.id),
    _id: String(post.id),
    slug: post.slug,
    title: post.title,
    category: post.category,
    excerpt: post.excerpt,
    content: post.content,
    coverImage: post.coverImage || "/images/blog/default.jpg",
    publishedAt: post.publishedAt,
    readingTime: post.readingTime || 5,
    readTime: `${post.readingTime || 5} মিনিট`,
    author: {
      name: post.author?.name || "ব্যবসা বন্ধু টিম",
      role: "উদ্যোক্তা ও লেখক",
      avatar: post.author?.avatar || "/images/avatars/default.jpg",
    },
    likesCount: 15,
    commentsCount: 3,
    status: "approved",
  }));

  // Merge with approved locally stored user blogs
  const userApproved = getUserBlogs()
    .filter((b) => b.status === "approved")
    .map((b) => ({
      id: String(b.id),
      _id: String(b._id || b.id),
      slug: b.slug,
      title: b.title,
      category: b.category,
      excerpt: b.excerpt,
      content: b.content,
      coverImage: b.coverImage || "/images/blog/default.jpg",
      publishedAt: b.createdAt,
      readingTime: b.readingTime || 5,
      readTime: b.readTime || `${b.readingTime || 5} মিনিট`,
      author: {
        name: b.author?.name || "ব্যবহারকারী",
        role: b.authorTitle || "উদ্যোক্তা ও লেখক",
        avatar: b.author?.avatar || "/images/avatars/default.jpg",
      },
      likesCount: b.likesCount || 0,
      commentsCount: b.commentsCount || 0,
      status: "approved",
    }));

  let items = [...userApproved, ...adminItems, ...fallbackItems];

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

export async function handleBlogCreate(request: Request) {
  try {
    const body = await request.json();
    const backendUrl = process.env.NEXT_PUBLIC_API_URL || "https://uddok-admin.vercel.app";

    const headerName = request.headers.get("x-user-name")
      ? decodeURIComponent(request.headers.get("x-user-name")!)
      : "";
    const emailHeader = request.headers.get("x-user-email") || "";
    const idHeader = request.headers.get("x-user-id") || "";

    const userProfile = emailHeader ? getUserProfile(emailHeader) : undefined;
    const authorName = (
      body.authorName ||
      body.author?.name ||
      headerName ||
      userProfile?.name ||
      (emailHeader ? emailHeader.split("@")[0] : "লেখক")
    ).trim();

    const authorEmail = body.authorEmail || emailHeader || userProfile?.email || "";
    const userId = body.userId || idHeader || userProfile?.id || "";

    const title = (body.title || "").trim();
    if (!title) {
      return NextResponse.json({ success: false, message: "ব্লগের শিরোনাম আবশ্যক" }, { status: 400 });
    }

    const readingTime = Number(body.readingTime || Math.max(2, Math.ceil((body.content || "").length / 500)));
    const readTime = body.readTime || `${readingTime} মিনিট`;
    const cleanSlug =
      (body.slug || title)
        .toLowerCase()
        .replace(/[^a-zA-Z0-9\u0980-\u09FF]+/g, "-")
        .replace(/^-|-$/g, "") || `blog-${Date.now()}`;

    const blogRecord: UserStoredBlog = {
      id: `blog-${Date.now()}`,
      slug: cleanSlug,
      title,
      category: body.category || "ব্যবসা শুরু",
      excerpt: body.excerpt || (body.content || "").slice(0, 160).trim(),
      content: body.content || "",
      coverImage: body.coverImage || body.image || "/images/blog/default.jpg",
      readingTime,
      readTime,
      author: {
        id: userId,
        name: authorName,
        avatar: "/images/avatars/default.jpg",
        role: body.authorTitle || "উদ্যোক্তা ও লেখক",
      },
      authorTitle: body.authorTitle || "উদ্যোক্তা ও লেখক",
      userId,
      authorEmail,
      status: body.status === "draft" ? "draft" : "pending",
      likesCount: 0,
      commentsCount: 0,
      createdAt: new Date().toISOString(),
    };

    // Forward to uddok-admin backend /api/blogs if status is pending (needs admin approval)
    if (blogRecord.status === "pending") {
      try {
        const backendRes = await fetch(`${backendUrl.replace(/\/$/, "")}/api/blogs`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            title: blogRecord.title,
            category: blogRecord.category,
            excerpt: blogRecord.excerpt,
            content: blogRecord.content,
            author: authorName,
            authorTitle: blogRecord.authorTitle,
            readTime: blogRecord.readTime,
            status: "pending",
            userId: blogRecord.userId,
            authorEmail: blogRecord.authorEmail,
            image: blogRecord.coverImage,
          }),
        });

        if (backendRes.ok) {
          const backendData = await backendRes.json();
          if (backendData.data?._id || backendData.data?.id) {
            blogRecord.id = String(backendData.data._id || backendData.data.id);
            blogRecord._id = String(backendData.data._id || backendData.data.id);
          }
        }
      } catch (err) {
        console.warn("Could not forward blog to admin backend, saved locally:", err);
      }
    }

    // Always persist in local user blogs store
    saveUserBlog(blogRecord);

    return NextResponse.json(
      {
        success: true,
        message:
          blogRecord.status === "pending"
            ? "ব্লগটি সফলভাবে জমা দেওয়া হয়েছে! অ্যাডমিন অনুমোদনের পর তা পাবলিক ব্লগে প্রকাশিত হবে।"
            : "ব্লগের খসড়া সফলভাবে সংরক্ষণ করা হয়েছে।",
        blog: blogRecord,
        id: blogRecord.id,
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("Failed to create blog:", error);
    return NextResponse.json(
      { success: false, message: error?.message || "ব্লগ তৈরি করতে সমস্যা হয়েছে" },
      { status: 500 }
    );
  }
}

export async function handleBlogFeatured() {
  return NextResponse.json(DETAILED_BLOG_POSTS[0] || null);
}

export async function handleBlogSlug(slug: string) {
  const decodedSlug = decodeURIComponent(slug);

  // 1. Check local user blogs
  const localBlog = findUserBlog(slug) || findUserBlog(decodedSlug);
  if (localBlog) {
    return NextResponse.json({
      ...localBlog,
      commentsEnabled: true,
    });
  }

  // 2. Check DETAILED_BLOG_POSTS
  const blog = DETAILED_BLOG_POSTS.find(
    (b) => b.slug === slug || b.slug === decodedSlug || b.id === slug || b.id === decodedSlug
  );

  if (blog) {
    return NextResponse.json({
      ...blog,
      content: blog.content || `<p>${blog.excerpt}</p>`,
      commentsEnabled: true,
    });
  }

  // 3. Check admin backend
  const backendUrl = process.env.NEXT_PUBLIC_API_URL || "https://uddok-admin.vercel.app";
  try {
    const res = await fetch(`${backendUrl.replace(/\/$/, "")}/api/blogs`, { cache: "no-store" });
    if (res.ok) {
      const result = await res.json();
      if (result.success && Array.isArray(result.data)) {
        const found = result.data.find(
          (b: any) =>
            String(b._id) === slug ||
            String(b.id) === slug ||
            String(b._id) === decodedSlug ||
            String(b.id) === decodedSlug ||
            b.slug === slug ||
            b.slug === decodedSlug
        );
        if (found) {
          return NextResponse.json({
            id: String(found._id || found.id),
            title: found.title,
            slug: found.slug || (found.title || "").toLowerCase().replace(/\s+/g, "-"),
            category: found.category || "general",
            excerpt: found.excerpt || "",
            content: found.content || "",
            publishedAt: found.createdAt || new Date().toISOString(),
            readingTime: 5,
            author: {
              name: typeof found.author === "string" ? found.author : "ব্যবসা বন্ধু টিম",
              role: found.authorTitle || "উদ্যোক্তা ও লেখক",
              avatar: "/images/avatars/default.jpg",
            },
            commentsEnabled: true,
          });
        }
      }
    }
  } catch (e) {
    console.error("Error looking up blog slug:", e);
  }

  return NextResponse.json({ message: "Blog post not found" }, { status: 404 });
}

export async function handleBlogDelete(id: string) {
  const decodedId = decodeURIComponent(id);
  const backendUrl = process.env.NEXT_PUBLIC_API_URL || "https://uddok-admin.vercel.app";

  try {
    await fetch(`${backendUrl.replace(/\/$/, "")}/api/blogs?id=${encodeURIComponent(decodedId)}`, {
      method: "DELETE",
    });
  } catch (err) {
    console.warn("Backend blog delete error:", err);
  }

  deleteUserBlog(decodedId);
  return NextResponse.json({ success: true, message: "Blog deleted" });
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
