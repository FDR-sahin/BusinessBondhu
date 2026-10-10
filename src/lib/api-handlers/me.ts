import { NextResponse } from "next/server";
import { getUserPosts, findUserPost } from "@/lib/user-posts-store";
import { getUserProfile, saveUserProfile } from "@/lib/user-profile-store";
import { getUserBlogs, findUserBlog } from "@/lib/user-blogs-store";
import { handleBlogDelete } from "./blog";

export async function handleMeDelete() {
  return NextResponse.json({
    success: true,
    message: "অ্যাকাউন্ট সফলভাবে মুছে ফেলা হয়েছে।",
  });
}

export async function handleMeProfileGet(request: Request) {
  const email = request.headers.get("x-user-email") || undefined;
  const id = request.headers.get("x-user-id") || undefined;

  const existing = getUserProfile(email) || getUserProfile(id) || getUserProfile();

  if (existing) {
    return NextResponse.json({ user: existing });
  }

  const defaultUser = {
    id: id || `u-${Date.now()}`,
    name: email ? email.split("@")[0] : "ব্যবহারকারী",
    email: email || "user@example.com",
    role: "user" as const,
    createdAt: new Date().toISOString(),
  };

  return NextResponse.json({ user: defaultUser });
}

export async function handleMeProfilePut(request: Request) {
  try {
    const body = await request.json();
    const emailHeader = request.headers.get("x-user-email");
    const idHeader = request.headers.get("x-user-id");

    const email = body.email || emailHeader || "user@example.com";
    const id = body.id || idHeader;

    const saved = saveUserProfile({
      ...body,
      id,
      email,
    });

    return NextResponse.json({ user: saved });
  } catch (err: any) {
    return NextResponse.json({ message: err.message || "প্রোফাইল আপডেট করতে সমস্যা হয়েছে।" }, { status: 400 });
  }
}

export async function handleMeOverview(request: Request) {
  const { searchParams } = new URL(request.url);
  const userId = searchParams.get("userId") || request.headers.get("x-user-id") || "";
  const userEmail = (searchParams.get("userEmail") || searchParams.get("email") || request.headers.get("x-user-email") || "").toLowerCase().trim();
  const backendUrl = process.env.NEXT_PUBLIC_API_URL || "https://uddok-admin.vercel.app";

  if (!userId && !userEmail) {
    return NextResponse.json({
      totals: { posts: 0, likes: 0, views: 0, comments: 0 },
      weeklyLikes: [],
      postsByCategory: [],
      activity: [],
    });
  }

  let posts: any[] = [];
  try {
    const qParams = new URLSearchParams({ status: "all" });
    if (userId) qParams.set("userId", userId);
    if (userEmail) qParams.set("authorEmail", userEmail);

    const res = await fetch(`${backendUrl.replace(/\/$/, "")}/api/ideas?${qParams.toString()}`, {
      cache: "no-store",
      headers: { "Content-Type": "application/json" },
    });
    if (res.ok) {
      const data = await res.json();
      if (data.success && Array.isArray(data.data)) {
        posts = data.data.filter((item: any) => {
          const matchesId = userId && (item.userId === userId || item.author?.id === userId);
          const itemEmail = (item.authorEmail || item.postedBy?.email || "").toLowerCase().trim();
          const matchesEmail = userEmail && itemEmail === userEmail;
          return Boolean(matchesId || matchesEmail);
        });
      }
    }
  } catch (err) {
    console.error("Failed to fetch overview posts from backend:", err);
  }

  const localItems = getUserPosts().filter((p) => {
    const matchesId = userId && (p.userId === userId || p.author?.id === userId);
    const postEmail = (p.authorEmail || "").toLowerCase().trim();
    const matchesEmail = userEmail && postEmail === userEmail;
    return Boolean(matchesId || matchesEmail);
  });

  const existingTitles = new Set(posts.map((i) => (i.title || "").trim().toLowerCase()));
  const allUserPosts = [...posts, ...localItems.filter((l) => !existingTitles.has(l.title.trim().toLowerCase()))];

  const totalPosts = allUserPosts.length;
  const totalLikes = allUserPosts.reduce((acc, p) => acc + (p.likes || p.likesCount || 0), 0);
  const totalViews = allUserPosts.reduce((acc, p) => acc + (p.viewsCount || 1), 0);
  const totalComments = allUserPosts.reduce((acc, p) => acc + (p.comments?.length || p.commentsCount || 0), 0);

  return NextResponse.json({
    totals: { posts: totalPosts, likes: totalLikes, views: totalViews, comments: totalComments },
    weeklyLikes: [],
    postsByCategory: [],
    activity: [],
  });
}

export async function handleMePosts(request: Request) {
  const { searchParams } = new URL(request.url);
  const status = searchParams.get("status");
  const q = searchParams.get("q")?.toLowerCase();
  const page = Number(searchParams.get("page") || 1);
  const limit = Number(searchParams.get("limit") || 12);
  const userId = searchParams.get("userId") || request.headers.get("x-user-id") || "";
  const userEmail = (searchParams.get("userEmail") || searchParams.get("email") || request.headers.get("x-user-email") || "").toLowerCase().trim();
  const backendUrl = process.env.NEXT_PUBLIC_API_URL || "https://uddok-admin.vercel.app";

  if (!userId && !userEmail) {
    return NextResponse.json({
      items: [],
      total: 0,
      page,
      limit,
      totalPages: 0,
    });
  }

  let adminIdeas: any[] = [];
  try {
    const qParams = new URLSearchParams({ status: "all" });
    if (userId) qParams.set("userId", userId);
    if (userEmail) qParams.set("authorEmail", userEmail);

    const res = await fetch(`${backendUrl.replace(/\/$/, "")}/api/ideas?${qParams.toString()}`, {
      cache: "no-store",
      headers: { "Content-Type": "application/json" },
    });
    if (res.ok) {
      const data = await res.json();
      if (data.success && Array.isArray(data.data)) {
        adminIdeas = data.data
          .filter((item: any) => {
            const matchesId = userId && (item.userId === userId || item.author?.id === userId);
            const itemEmail = (item.authorEmail || item.postedBy?.email || "").toLowerCase().trim();
            const matchesEmail = userEmail && itemEmail === userEmail;
            return Boolean(matchesId || matchesEmail);
          })
          .map((item: any) => ({
            id: String(item.id || item._id),
            _id: String(item._id || item.id),
            title: item.title,
            category: item.category || "general",
            division: item.division || "Dhaka",
            district: item.district || "ঢাকা",
            area: item.upazilaOrArea || item.area || "",
            exactLocation: item.exactLocation || `${item.district || "ঢাকা"}, বাংলাদেশ`,
            wholesalePrice: Number(item.wholesalePrice || 0),
            wholesalePriceMax: item.wholesalePriceMax ? Number(item.wholesalePriceMax) : undefined,
            wholesalePriceText: item.wholesalePriceText,
            retailPrice: Number(item.retailPrice || 0),
            retailPriceMax: item.retailPriceMax ? Number(item.retailPriceMax) : undefined,
            retailPriceText: item.retailPriceText,
            retailSellPrice: Number(item.retailPrice || 0),
            profitPotential: "medium",
            description: item.description || "",
            image: item.image || "/images/ideas/default.jpg",
            tags: item.tags || [],
            status: item.status || "approved",
            author: {
              name: item.postedBy?.name || "ব্যবহারকারী",
              avatar: "/images/avatars/default.jpg",
            },
            viewsCount: item.viewsCount || 1,
            likesCount: item.likesCount || item.likes || 0,
            dislikesCount: item.dislikesCount || item.dislikes || 0,
            commentsCount: item.comments?.length || 0,
            createdAt: item.createdAt || new Date().toISOString(),
          }));
      }
    }
  } catch (err) {
    console.error("Failed to fetch user posts from backend in me/posts:", err);
  }

  const localItems = getUserPosts().filter((p) => {
    const matchesId = userId && (p.userId === userId || p.author?.id === userId);
    const postEmail = (p.authorEmail || "").toLowerCase().trim();
    const matchesEmail = userEmail && postEmail === userEmail;
    return Boolean(matchesId || matchesEmail);
  });

  const existingTitles = new Set(adminIdeas.map((i) => i.title.trim().toLowerCase()));
  const existingIds = new Set(adminIdeas.map((i) => i.id));
  const filteredLocal = localItems.filter((l) => !existingTitles.has(l.title.trim().toLowerCase()) && !existingIds.has(l.id));
  let items = [...adminIdeas, ...filteredLocal];

  if (status && status !== "all") {
    items = items.filter((p) => p.status === status);
  }

  if (q) {
    items = items.filter(
      (p) =>
        p.title.toLowerCase().includes(q) ||
        (p.district && p.district.toLowerCase().includes(q)) ||
        (p.category && p.category.toLowerCase().includes(q))
    );
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

export async function handleMePostDetail(id: string) {
  const decodedId = decodeURIComponent(id);
  const localPost = findUserPost(decodedId);
  if (localPost) {
    return NextResponse.json(localPost);
  }

  const backendUrl = process.env.NEXT_PUBLIC_API_URL || "https://uddok-admin.vercel.app";
  try {
    const res = await fetch(`${backendUrl.replace(/\/$/, "")}/api/ideas?status=all`, {
      cache: "no-store",
    });
    if (res.ok) {
      const data = await res.json();
      if (data.success && Array.isArray(data.data)) {
        const item = data.data.find((i: any) => String(i._id) === decodedId || String(i.id) === decodedId);
        if (item) {
          return NextResponse.json({
            id: String(item._id || item.id),
            _id: String(item._id || item.id),
            title: item.title,
            category: item.category || "general",
            division: item.division || "Dhaka",
            district: item.district || "ঢাকা",
            area: item.upazilaOrArea || item.area || "",
            exactLocation: item.exactLocation || `${item.district || "ঢাকা"}, বাংলাদেশ`,
            wholesalePrice: Number(item.wholesalePrice || 0),
            wholesalePriceMax: item.wholesalePriceMax ? Number(item.wholesalePriceMax) : undefined,
            wholesalePriceText: item.wholesalePriceText,
            retailPrice: Number(item.retailPrice || 0),
            retailPriceMax: item.retailPriceMax ? Number(item.retailPriceMax) : undefined,
            retailPriceText: item.retailPriceText,
            retailSellPrice: Number(item.retailPrice || 0),
            profitPotential: "medium",
            description: item.description || "",
            image: item.image || "/images/ideas/default.jpg",
            tags: item.tags || [],
            status: item.status || "approved",
            author: {
              name: item.postedBy?.name || "ব্যবহারকারী",
              avatar: "/images/avatars/default.jpg",
            },
            viewsCount: item.viewsCount || 1,
            likesCount: item.likesCount || item.likes || 0,
            dislikesCount: item.dislikesCount || item.dislikes || 0,
            commentsCount: item.comments?.length || 0,
            createdAt: item.createdAt || new Date().toISOString(),
          });
        }
      }
    }
  } catch (e) {
    console.error("Error looking up post in backend:", e);
  }

  return NextResponse.json({ message: "Post not found" }, { status: 404 });
}

export async function handleMeSaved() {
  return NextResponse.json({
    items: [],
    total: 0,
    page: 1,
    limit: 12,
    totalPages: 0,
  });
}

export async function handleMeSettings() {
  return NextResponse.json({
    notifications: {
      likes: true,
      comments: true,
      replies: true,
      system: true,
      email: true,
    },
  });
}

export async function handleMeComments() {
  return NextResponse.json({
    items: [],
    total: 0,
    page: 1,
    limit: 10,
    totalPages: 1,
  });
}

export async function handleMeDislikes() {
  return NextResponse.json({
    items: [],
    total: 0,
    page: 1,
    limit: 12,
    totalPages: 0,
  });
}

export async function handleMeLikes() {
  return NextResponse.json({
    items: [],
    total: 0,
    page: 1,
    limit: 12,
    totalPages: 0,
  });
}

export async function handleMeNotifications() {
  return NextResponse.json({
    items: [],
    total: 0,
    page: 1,
    limit: 15,
    totalPages: 1,
  });
}

export async function handleMeBlogs(request: Request) {
  const { searchParams } = new URL(request.url);
  const status = searchParams.get("status");
  const q = searchParams.get("q")?.toLowerCase();
  const page = Number(searchParams.get("page") || 1);
  const limit = Number(searchParams.get("limit") || 12);
  const userId = searchParams.get("userId") || request.headers.get("x-user-id") || "";
  const userEmail = (searchParams.get("userEmail") || searchParams.get("email") || request.headers.get("x-user-email") || "").toLowerCase().trim();
  const backendUrl = process.env.NEXT_PUBLIC_API_URL || "https://uddok-admin.vercel.app";

  if (!userId && !userEmail) {
    return NextResponse.json({
      items: [],
      total: 0,
      page,
      limit,
      totalPages: 0,
    });
  }

  let adminBlogs: any[] = [];
  try {
    const res = await fetch(`${backendUrl.replace(/\/$/, "")}/api/blogs`, {
      cache: "no-store",
      headers: { "Content-Type": "application/json" },
    });
    if (res.ok) {
      const data = await res.json();
      if (data.success && Array.isArray(data.data)) {
        adminBlogs = data.data
          .filter((item: any) => {
            const matchesId = userId && (item.userId === userId || item.author?.id === userId);
            const itemEmail = (item.authorEmail || "").toLowerCase().trim();
            const matchesEmail = userEmail && itemEmail === userEmail;
            return Boolean(matchesId || matchesEmail);
          })
          .map((item: any) => ({
            id: String(item.id || item._id),
            _id: String(item._id || item.id),
            title: item.title,
            slug: item.slug || (item.title || "").toLowerCase().replace(/\s+/g, "-"),
            category: item.category || "ব্যবসা শুরু",
            excerpt: item.excerpt || "",
            content: item.content || "",
            coverImage: item.image || item.coverImage || "/images/blog/default.jpg",
            readTime: item.readTime || "৫ মিনিট",
            readingTime: item.readingTime || 5,
            status: item.status || "approved",
            author: {
              name: typeof item.author === "string" ? item.author : item.author?.name || "ব্যবহারকারী",
              avatar: "/images/avatars/default.jpg",
            },
            likesCount: item.likesCount || item.likes || 0,
            commentsCount: item.comments?.length || 0,
            createdAt: item.createdAt || new Date().toISOString(),
          }));
      }
    }
  } catch (err) {
    console.error("Failed to fetch user blogs from backend in me/blogs:", err);
  }

  const localItems = getUserBlogs().filter((b) => {
    const matchesId = userId && (b.userId === userId || b.author?.id === userId);
    const postEmail = (b.authorEmail || "").toLowerCase().trim();
    const matchesEmail = userEmail && postEmail === userEmail;
    return Boolean(matchesId || matchesEmail);
  });

  const existingTitles = new Set(adminBlogs.map((i) => i.title.trim().toLowerCase()));
  const existingIds = new Set(adminBlogs.map((i) => i.id));
  const filteredLocal = localItems.filter((l) => !existingTitles.has(l.title.trim().toLowerCase()) && !existingIds.has(l.id));
  let items = [...adminBlogs, ...filteredLocal];

  if (status && status !== "all") {
    items = items.filter((b) => b.status === status);
  }

  if (q) {
    items = items.filter(
      (b) =>
        b.title.toLowerCase().includes(q) ||
        (b.category && b.category.toLowerCase().includes(q)) ||
        (b.excerpt && b.excerpt.toLowerCase().includes(q))
    );
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

export async function handleMeBlogDetail(id: string) {
  const decodedId = decodeURIComponent(id);
  const localBlog = findUserBlog(decodedId);
  if (localBlog) {
    return NextResponse.json(localBlog);
  }
  return NextResponse.json({ message: "Blog not found" }, { status: 404 });
}

export async function handleMeBlogDelete(id: string) {
  return handleBlogDelete(id);
}

