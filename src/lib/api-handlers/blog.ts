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

  let adminIdeas: any[] = [];
  try {
    const ideasRes = await fetch(`${backendUrl.replace(/\/$/, "")}/api/ideas?status=all`, {
      cache: "no-store",
      headers: { "Content-Type": "application/json" },
    });
    if (ideasRes.ok) {
      const ideasData = await ideasRes.json();
      if (ideasData.success && Array.isArray(ideasData.data)) {
        adminIdeas = ideasData.data;
      }
    }
  } catch (err) {
    console.error("Failed to fetch ideas status from admin backend:", err);
  }

  // Track pending and approved blogs from admin ideas queue
  const newlyApprovedBlogs: any[] = [];
  adminIdeas.forEach((item: any) => {
    const isBlogItem = item.isBlog === true || (item.title && item.title.startsWith("[ব্লগ]"));
    if (isBlogItem) {
      const cleanTitle = (item.blogData?.title || item.title.replace(/^\[ব্লগ\]\s*/, "")).trim();
      const itemId = String(item._id || item.id);

      if (item.status === "approved") {
        unapprovedIds.delete(itemId);
        unapprovedTitles.delete(cleanTitle.toLowerCase());

        // Update local blog store if matching
        const local = userBlogs.find(
          (b) => b.adminIdeaId === itemId || b.id === itemId || b.title.trim().toLowerCase() === cleanTitle.toLowerCase()
        );
        if (local && local.status !== "approved") {
          saveUserBlog({ ...local, status: "approved" });
        }

        const bData = item.blogData || {};
        newlyApprovedBlogs.push({
          id: itemId,
          _id: itemId,
          slug: bData.slug || cleanTitle.toLowerCase().replace(/[^a-zA-Z0-9\u0980-\u09FF]+/g, "-"),
          title: cleanTitle,
          category: bData.category || item.category || "উদ্যোক্তা ব্লগ",
          excerpt: bData.excerpt || item.description?.slice(0, 160) || "",
          content: bData.content || item.description || "",
          coverImage: bData.coverImage || "/images/blog/default.jpg",
          publishedAt: item.createdAt || new Date().toISOString(),
          readingTime: bData.readingTime || 5,
          readTime: bData.readTime || "৫ মিনিট",
          author: {
            name: bData.authorName || item.postedBy?.name || "লেখক",
            role: bData.authorTitle || item.postedBy?.role || "উদ্যোক্তা ও লেখক",
            avatar: "/images/avatars/default.jpg",
          },
          likesCount: 0,
          commentsCount: 0,
          status: "approved",
        });
      } else {
        // Still pending
        unapprovedIds.add(itemId);
        unapprovedTitles.add(cleanTitle.toLowerCase());
      }
    }
  });

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
          // Only show approved blogs on the public site; exclude any pending or unapproved blog
          .filter((post: any) => {
            const id = String(post.id || post._id);
            const titleLower = (post.title || "").trim().toLowerCase();
            if (unapprovedIds.has(id)) return false;
            if (unapprovedTitles.has(titleLower)) return false;
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
  newlyApprovedBlogs.forEach((b) => existingIds.add(String(b.id)));

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
    .filter((b) => b.status === "approved" && !unapprovedIds.has(String(b.id)) && !unapprovedTitles.has(b.title.trim().toLowerCase()))
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

  const existingTitles = new Set<string>();
  const deduplicatedItems: any[] = [];
  [...newlyApprovedBlogs, ...userApproved, ...adminItems, ...fallbackItems].forEach((item) => {
    const tKey = item.title.trim().toLowerCase();
    if (!existingTitles.has(tKey)) {
      existingTitles.add(tKey);
      deduplicatedItems.push(item);
    }
  });

  let items = deduplicatedItems;

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

    // Forward to uddok-admin backend /api/ideas as pending request for the admin approval queue
    if (blogRecord.status === "pending") {
      try {
        const backendRes = await fetch(`${backendUrl.replace(/\/$/, "")}/api/ideas`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            title: `[ব্লগ] ${blogRecord.title}`,
            category: blogRecord.category || "উদ্যোক্তা ব্লগ",
            district: "অনলাইন / ব্লগ",
            exactLocation: "উদ্যোক্তা ব্লগ সেকশন",
            wholesalePrice: 0,
            retailPrice: 0,
            description: `[সারসংক্ষেপ]: ${blogRecord.excerpt}\n\n[মূল লেখা]:\n${blogRecord.content}`,
            status: "pending",
            isBlog: true,
            blogData: {
              title: blogRecord.title,
              category: blogRecord.category,
              excerpt: blogRecord.excerpt,
              content: blogRecord.content,
              authorName,
              authorTitle: blogRecord.authorTitle,
              readTime: blogRecord.readTime,
              coverImage: blogRecord.coverImage,
              slug: cleanSlug,
              userId: blogRecord.userId,
              authorEmail: blogRecord.authorEmail,
            },
            postedBy: {
              name: authorName,
              role: blogRecord.authorTitle || "লেখক",
              email: blogRecord.authorEmail || "",
            },
            authorEmail: blogRecord.authorEmail,
            userId: blogRecord.userId,
          }),
        });

        if (backendRes.ok) {
          const backendData = await backendRes.json();
          if (backendData.data?._id || backendData.data?.id) {
            const ideaId = String(backendData.data._id || backendData.data.id);
            blogRecord.adminIdeaId = ideaId;
            blogRecord.id = ideaId;
            blogRecord._id = ideaId;
          }
        }
      } catch (err) {
        console.warn("Could not forward blog to admin backend approval queue, saved locally:", err);
      }
    }

    // Always persist in local user blogs store
    saveUserBlog(blogRecord);

    return NextResponse.json(
      {
        success: true,
        message:
          blogRecord.status === "pending"
            ? "ব্লগটি সফলভাবে অ্যাডমিন অনুমোদনের জন্য জমা দেওয়া হয়েছে! অ্যাডমিন অ্যাপ্রুভ করার পর তা মূল সাইটে লাইভ হবে।"
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
  const backendUrl = process.env.NEXT_PUBLIC_API_URL || "https://uddok-admin.vercel.app";

  // Check admin ideas to see if this blog has been approved or is still pending
  let isApprovedInAdmin = false;
  let isPendingInAdmin = false;
  let adminBlogMatch: any = null;

  try {
    const ideasRes = await fetch(`${backendUrl.replace(/\/$/, "")}/api/ideas?status=all`, { cache: "no-store" });
    if (ideasRes.ok) {
      const ideasData = await ideasRes.json();
      if (ideasData.success && Array.isArray(ideasData.data)) {
        const match = ideasData.data.find((item: any) => {
          const isBlog = item.isBlog === true || (item.title && item.title.startsWith("[ব্লগ]"));
          if (!isBlog) return false;
          const cleanTitle = (item.blogData?.title || item.title.replace(/^\[ব্লগ\]\s*/, "")).trim();
          const cleanSlug = item.blogData?.slug || cleanTitle.toLowerCase().replace(/[^a-zA-Z0-9\u0980-\u09FF]+/g, "-");
          const itemId = String(item._id || item.id);
          return itemId === slug || itemId === decodedSlug || cleanSlug === slug || cleanSlug === decodedSlug;
        });

        if (match) {
          if (match.status === "approved") {
            isApprovedInAdmin = true;
            adminBlogMatch = match;
          } else {
            isPendingInAdmin = true;
          }
        }
      }
    }
  } catch (err) {
    console.error("Error checking ideas queue in handleBlogSlug:", err);
  }

  // If known to be pending, reject public access
  if (isPendingInAdmin) {
    return NextResponse.json({ message: "এই ব্লগটি এখনও অ্যাডমিন অনুমোদনের অপেক্ষায় রয়েছে।" }, { status: 403 });
  }

  // 1. Check local user blogs
  const localBlog = findUserBlog(slug) || findUserBlog(decodedSlug);
  if (localBlog) {
    if (localBlog.status === "approved" || isApprovedInAdmin) {
      return NextResponse.json({
        ...localBlog,
        commentsEnabled: true,
      });
    }
    return NextResponse.json({ message: "এই ব্লগটি এখনও অনুমোদিত হয়নি।" }, { status: 403 });
  }

  if (isApprovedInAdmin && adminBlogMatch) {
    const bData = adminBlogMatch.blogData || {};
    const cleanTitle = (bData.title || adminBlogMatch.title.replace(/^\[ব্লগ\]\s*/, "")).trim();
    return NextResponse.json({
      id: String(adminBlogMatch._id || adminBlogMatch.id),
      title: cleanTitle,
      slug: bData.slug || cleanTitle.toLowerCase().replace(/[^a-zA-Z0-9\u0980-\u09FF]+/g, "-"),
      category: bData.category || adminBlogMatch.category || "উদ্যোক্তা ব্লগ",
      excerpt: bData.excerpt || adminBlogMatch.description?.slice(0, 160) || "",
      content: bData.content || adminBlogMatch.description || "",
      coverImage: bData.coverImage || "/images/blog/default.jpg",
      publishedAt: adminBlogMatch.createdAt || new Date().toISOString(),
      readingTime: bData.readingTime || 5,
      readTime: bData.readTime || "৫ মিনিট",
      author: {
        name: bData.authorName || adminBlogMatch.postedBy?.name || "লেখক",
        role: bData.authorTitle || adminBlogMatch.postedBy?.role || "উদ্যোক্তা ও লেখক",
        avatar: "/images/avatars/default.jpg",
      },
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

  // 3. Check admin backend official blogs
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
        if (found && (!found.status || found.status === "approved")) {
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
