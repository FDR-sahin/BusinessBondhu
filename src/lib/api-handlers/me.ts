import { NextResponse } from "next/server";
import mongoose from "mongoose";
import { connectToDatabase } from "@/lib/db";
import { BusinessIdeaModel, BlogModel, SavedItemModel, UserModel } from "@/lib/models";
import { getUserProfile, saveUserProfile, getCookieValue, sanitizeUser } from "@/lib/user-profile-store";
import { getDistrictLabel } from "@/lib/bd-data";
import { getQueryForId } from "./posts";
export { handleMePasswordPut } from "./auth";

export async function handleMeDelete() {
  return NextResponse.json({
    success: true,
    message: "অ্যাকাউন্ট সফলভাবে মুছে ফেলা হয়েছে।",
  });
}

export async function handleMeProfileGet(request: Request) {
  const emailHeader = request.headers.get("x-user-email");
  const cookieEmail = getCookieValue(request, "bhbd_user_email");
  const email = (emailHeader || cookieEmail || "").toLowerCase().trim() || undefined;
  const id = request.headers.get("x-user-id") || undefined;

  let existing = getUserProfile(email) || getUserProfile(id);

  if (!existing && email) {
    try {
      await connectToDatabase();
      const dbUser = await UserModel.findOne({ email }).lean();
      if (dbUser) {
        existing = {
          id: String(dbUser._id || dbUser.id || dbUser.customId),
          name: dbUser.name,
          email: dbUser.email,
          avatar: dbUser.avatar || "",
          bio: dbUser.bio || "",
          division: dbUser.division || "",
          district: dbUser.district || "",
          area: dbUser.area || "",
          role: dbUser.role || "user",
          createdAt: dbUser.createdAt,
          updatedAt: dbUser.updatedAt,
        };
        saveUserProfile(existing);
      }
    } catch (e) {
      console.error("Error reading profile from DB:", e);
    }
  }

  const emailPrefix = email ? email.split("@")[0] : "ব্যবহারকারী";
  const resolvedName = existing?.name && existing.name !== "উদ্যোক্তা" ? existing.name : emailPrefix;

  const user = {
    id: existing?.id || id || `u-${Date.now()}`,
    name: resolvedName,
    email: existing?.email || email || "user@example.com",
    role: (existing?.role || "user") as "user" | "admin",
    createdAt: existing?.createdAt || new Date().toISOString(),
    avatar: existing?.avatar || "",
    bio: existing?.bio || "",
    division: existing?.division || "",
    district: existing?.district || "",
    area: existing?.area || "",
  };

  const res = NextResponse.json({ user: sanitizeUser(user as any) });
  const maxAge = 60 * 60 * 24 * 30;
  if (resolvedName && resolvedName !== emailPrefix) {
    res.cookies.set("bhbd_user_name", encodeURIComponent(resolvedName), { path: "/", maxAge, sameSite: "lax" });
  }
  return res;
}

export async function handleMeProfilePut(request: Request) {
  try {
    const body = await request.json();
    const emailHeader = request.headers.get("x-user-email");
    const cookieEmail = getCookieValue(request, "bhbd_user_email");
    const idHeader = request.headers.get("x-user-id");

    const email = (body.email || emailHeader || cookieEmail || "user@example.com").toLowerCase().trim();
    const id = body.id || idHeader;

    const existing = getUserProfile(email) || getUserProfile(id);
    const rawName = (body.name || "").trim();
    const emailPrefix = email.includes("@") ? email.split("@")[0] : "ব্যবহারকারী";
    const name = rawName && rawName !== "উদ্যোক্তা" ? rawName : (existing?.name || emailPrefix);

    const saved = saveUserProfile({
      ...existing,
      ...body,
      id,
      email,
      name,
    });

    try {
      await connectToDatabase();
      await UserModel.findOneAndUpdate(
        { email },
        {
          $set: {
            name: saved.name,
            avatar: saved.avatar || "",
            bio: saved.bio || "",
            division: saved.division || "",
            district: saved.district || "",
            area: saved.area || "",
            updatedAt: new Date().toISOString(),
          },
        },
        { upsert: true }
      );
    } catch (e) {
      console.error("Error updating profile in DB:", e);
    }

    const res = NextResponse.json({ user: sanitizeUser(saved) });
    const maxAge = 60 * 60 * 24 * 30;
    res.cookies.set("bhbd_user_name", encodeURIComponent(saved.name), { path: "/", maxAge, sameSite: "lax" });
    if (email && email !== "user@example.com") {
      res.cookies.set("bhbd_user_email", email, { path: "/", maxAge, sameSite: "lax" });
    }
    return res;
  } catch (err: any) {
    return NextResponse.json({ message: err.message || "প্রোফাইল আপডেট করতে সমস্যা হয়েছে।" }, { status: 400 });
  }
}

export async function handleMeOverview(request: Request) {
  const { searchParams } = new URL(request.url);
  const userId = searchParams.get("userId") || request.headers.get("x-user-id") || "";
  const userEmail = (
    searchParams.get("userEmail") ||
    searchParams.get("email") ||
    request.headers.get("x-user-email") ||
    getCookieValue(request, "bhbd_user_email") ||
    ""
  ).toLowerCase().trim();

  if (!userId && !userEmail) {
    return NextResponse.json({
      totals: { posts: 0, likes: 0, views: 0, comments: 0 },
      weeklyLikes: [],
      postsByCategory: [],
      activity: [],
    });
  }

  try {
    await connectToDatabase();
    const filter: any = {
      $or: [
        ...(userId ? [{ userId }, { "author.id": userId }] : []),
        ...(userEmail ? [{ authorEmail: userEmail }, { "postedBy.email": userEmail }] : []),
      ],
    };

    const userPosts = await BusinessIdeaModel.find(filter).lean();
    const totalPosts = userPosts.length;
    const totalLikes = userPosts.reduce((acc, p: any) => acc + (p.likes || 0), 0);
    const totalViews = userPosts.reduce((acc, p: any) => acc + (p.viewsCount || 1), 0);
    const totalComments = userPosts.reduce((acc, p: any) => acc + (Array.isArray(p.comments) ? p.comments.length : 0), 0);

    const catCounts: Record<string, number> = {};
    userPosts.forEach((p: any) => {
      const cat = p.category || "general";
      catCounts[cat] = (catCounts[cat] || 0) + 1;
    });
    const postsByCategory = Object.entries(catCounts).map(([category, count]) => ({ category, count }));

    return NextResponse.json({
      totals: { posts: totalPosts, likes: totalLikes, views: totalViews, comments: totalComments },
      weeklyLikes: [],
      postsByCategory,
      activity: [],
    });
  } catch (err) {
    console.error("Overview error in MongoDB:", err);
  }

  return NextResponse.json({
    totals: { posts: 0, likes: 0, views: 0, comments: 0 },
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
  const userEmail = (
    searchParams.get("userEmail") ||
    searchParams.get("email") ||
    request.headers.get("x-user-email") ||
    getCookieValue(request, "bhbd_user_email") ||
    ""
  ).toLowerCase().trim();

  if (!userId && !userEmail) {
    return NextResponse.json({ items: [], total: 0, page, limit, totalPages: 0 });
  }

  let items: any[] = [];
  try {
    await connectToDatabase();
    const filter: any = {
      $or: [
        ...(userId ? [{ userId }, { "author.id": userId }] : []),
        ...(userEmail ? [{ authorEmail: userEmail }, { "postedBy.email": userEmail }] : []),
      ],
    };
    if (status && status !== "all") {
      filter.status = status;
    }

    const posts = await BusinessIdeaModel.find(filter).sort({ _id: -1 }).lean();
    items = posts.map((item: any) => {
      const districtName = getDistrictLabel(item.district) || item.district || "ঢাকা";
      const exactLoc =
        item.exactLocation ||
        (item.upazilaOrArea ? `${item.upazilaOrArea}, ${districtName}` : `${districtName}, Bangladesh`);

      return {
        id: String(item._id || item.id || item.customId),
        _id: String(item._id || item.id || item.customId),
        title: item.title,
        category: item.category || "general",
        division: item.division || "Dhaka",
        district: districtName,
        area: item.upazilaOrArea || item.area || "",
        exactLocation: exactLoc,
        wholesalePrice: Number(item.wholesalePrice || 0),
        wholesalePriceMax: item.wholesalePriceMax ? Number(item.wholesalePriceMax) : undefined,
        wholesalePriceText: item.wholesalePriceText,
        retailPrice: Number(item.retailPrice || 0),
        retailPriceMax: item.retailPriceMax ? Number(item.retailPriceMax) : undefined,
        retailPriceText: item.retailPriceText,
        retailSellPrice: Number(item.retailPrice || 0),
        profitPotential: item.profitPotential || "medium",
        description: item.description || "",
        image: item.image || "/images/ideas/default.jpg",
        tags: item.tags || [],
        status: item.status || "approved",
        author: {
          name: item.postedBy?.name || "ব্যবহারকারী",
          avatar: "/images/avatars/default.jpg",
        },
        viewsCount: item.viewsCount || 1,
        likesCount: item.likes || 0,
        dislikesCount: item.dislikes || 0,
        commentsCount: Array.isArray(item.comments) ? item.comments.length : 0,
        createdAt: item.createdAt || new Date().toISOString(),
      };
    });
  } catch (err) {
    console.error("handleMePosts error:", err);
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

  try {
    await connectToDatabase();
    const query = getQueryForId(decodedId);
    const item = await BusinessIdeaModel.findOne(query).lean();
    if (item) {
      const districtName = getDistrictLabel(item.district) || item.district || "ঢাকা";
      const exactLoc =
        item.exactLocation ||
        (item.upazilaOrArea ? `${item.upazilaOrArea}, ${districtName}` : `${districtName}, Bangladesh`);

      return NextResponse.json({
        id: String(item._id || item.id || item.customId),
        _id: String(item._id || item.id || item.customId),
        title: item.title,
        category: item.category || "general",
        division: item.division || "Dhaka",
        district: districtName,
        area: item.upazilaOrArea || item.area || "",
        exactLocation: exactLoc,
        wholesalePrice: Number(item.wholesalePrice || 0),
        wholesalePriceMax: item.wholesalePriceMax ? Number(item.wholesalePriceMax) : undefined,
        wholesalePriceText: item.wholesalePriceText,
        retailPrice: Number(item.retailPrice || 0),
        retailPriceMax: item.retailPriceMax ? Number(item.retailPriceMax) : undefined,
        retailPriceText: item.retailPriceText,
        retailSellPrice: Number(item.retailPrice || 0),
        profitPotential: item.profitPotential || "medium",
        description: item.description || "",
        image: item.image || "/images/ideas/default.jpg",
        tags: item.tags || [],
        status: item.status || "approved",
        author: {
          name: item.postedBy?.name || "ব্যবহারকারী",
          avatar: "/images/avatars/default.jpg",
        },
        viewsCount: item.viewsCount || 1,
        likesCount: item.likes || 0,
        dislikesCount: item.dislikes || 0,
        commentsCount: Array.isArray(item.comments) ? item.comments.length : 0,
        createdAt: item.createdAt || new Date().toISOString(),
      });
    }
  } catch (e) {
    console.error("handleMePostDetail error:", e);
  }

  return NextResponse.json({ message: "Post not found" }, { status: 404 });
}

export async function handleMeSaved(request?: Request) {
  let userEmail = "";
  let userId = "";

  if (request) {
    userEmail = (
      request.headers.get("x-user-email") ||
      getCookieValue(request, "bhbd_user_email") ||
      ""
    ).toLowerCase().trim();
    userId = request.headers.get("x-user-id") || "";
  }

  const { searchParams } = request ? new URL(request.url) : { searchParams: new URLSearchParams() };
  const page = Number(searchParams.get("page") || 1);
  const limit = Number(searchParams.get("limit") || 12);

  if (!userEmail && !userId) {
    return NextResponse.json({ items: [], total: 0, page, limit, totalPages: 0 });
  }

  try {
    await connectToDatabase();
    const filter: any = {};
    if (userEmail) filter.userEmail = userEmail;
    else if (userId) filter.userId = userId;

    const savedBookmarks = await SavedItemModel.find(filter).sort({ createdAt: -1 }).lean();
    const postIds = savedBookmarks.map((s: any) => s.postId);

    if (postIds.length > 0) {
      const ideas = await BusinessIdeaModel.find({
        $or: [
          { _id: { $in: postIds.filter((id) => mongoose.Types.ObjectId.isValid(id)) } },
          { id: { $in: postIds } },
          { customId: { $in: postIds } },
        ],
      }).lean();

      const items = ideas.map((item: any) => {
        const districtName = getDistrictLabel(item.district) || item.district || "ঢাকা";
        const exactLoc =
          item.exactLocation ||
          (item.upazilaOrArea ? `${item.upazilaOrArea}, ${districtName}` : `${districtName}, Bangladesh`);

        return {
          id: String(item._id || item.id || item.customId),
          _id: String(item._id || item.id || item.customId),
          title: item.title,
          category: item.category || "agriculture-livestock",
          division: item.division || "Dhaka",
          district: districtName,
          area: item.upazilaOrArea || item.area || districtName,
          exactLocation: exactLoc,
          wholesalePrice: Number(item.wholesalePrice || 0),
          wholesalePriceMax: item.wholesalePriceMax,
          wholesalePriceText: item.wholesalePriceText,
          retailPrice: Number(item.retailPrice || 0),
          retailPriceMax: item.retailPriceMax,
          retailPriceText: item.retailPriceText,
          retailSellPrice: Number(item.retailPrice || 0),
          profitPotential: item.profitPotential || "medium",
          description: item.description || "",
          image: item.image || "/images/ideas/default.jpg",
          tags: item.tags || [],
          author: {
            name: item.postedBy?.name || "ব্যবসা বন্ধু",
            avatar: "/images/avatars/default.jpg",
          },
          likesCount: item.likes || 0,
          dislikesCount: item.dislikes || 0,
          viewsCount: item.viewsCount || 15,
          commentsCount: Array.isArray(item.comments) ? item.comments.length : 0,
          createdAt: item.createdAt || new Date().toISOString(),
        };
      });

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
  } catch (err) {
    console.error("handleMeSaved error:", err);
  }

  return NextResponse.json({ items: [], total: 0, page, limit, totalPages: 0 });
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

export async function handleMeComments(request?: Request) {
  let userEmail = "";
  let userId = "";

  if (request) {
    userEmail = (
      request.headers.get("x-user-email") ||
      getCookieValue(request, "bhbd_user_email") ||
      ""
    ).toLowerCase().trim();
    userId = request.headers.get("x-user-id") || "";
  }

  const { searchParams } = request ? new URL(request.url) : { searchParams: new URLSearchParams() };
  const page = Number(searchParams.get("page") || 1);
  const limit = Number(searchParams.get("limit") || 10);

  if (!userEmail && !userId) {
    return NextResponse.json({ items: [], total: 0, page, limit, totalPages: 0 });
  }

  try {
    await connectToDatabase();
    const query: any = {
      $or: [
        ...(userEmail ? [{ "comments.authorEmail": userEmail }] : []),
        ...(userId ? [{ "comments.authorId": userId }] : []),
      ],
    };

    const postsWithComments = await BusinessIdeaModel.find(query).lean();
    const dashboardComments: any[] = [];

    postsWithComments.forEach((post: any) => {
      const postId = String(post._id || post.id || post.customId);
      (post.comments || []).forEach((c: any) => {
        const matchesUser =
          (userEmail && c.authorEmail && c.authorEmail.toLowerCase() === userEmail) ||
          (userId && c.authorId && c.authorId === userId);

        if (matchesUser) {
          dashboardComments.push({
            id: String(c.id || c._id),
            content: c.comment || c.content,
            createdAt: c.createdAt || new Date().toISOString(),
            author: {
              id: c.authorId || userId,
              name: c.authorName || "ব্যবহারকারী",
              avatar: c.authorAvatar || "/images/avatars/default.jpg",
            },
            post: { id: postId, title: post.title },
            likesCount: c.likes || 0,
            replied: Array.isArray(c.replies) && c.replies.length > 0,
            replies: (c.replies || []).map((r: any) => ({
              id: String(r.id || r._id),
              postId,
              parentId: String(c.id || c._id),
              author: {
                id: r.authorId || "reply-user",
                name: r.authorName || "টিম",
                avatar: r.authorAvatar || "/images/avatars/default.jpg",
              },
              content: r.comment || r.content,
              createdAt: r.createdAt || new Date().toISOString(),
              likesCount: r.likes || 0,
            })),
          });
        }
      });
    });

    const total = dashboardComments.length;
    const totalPages = Math.ceil(total / limit);
    const start = (page - 1) * limit;
    const items = dashboardComments.slice(start, start + limit);

    return NextResponse.json({ items, total, page, limit, totalPages });
  } catch (e) {
    console.error("handleMeComments error:", e);
  }

  return NextResponse.json({ items: [], total: 0, page, limit, totalPages: 0 });
}

export async function handleMeLikes(request?: Request) {
  let userEmail = "";
  let userId = "";

  if (request) {
    userEmail = (
      request.headers.get("x-user-email") ||
      getCookieValue(request, "bhbd_user_email") ||
      ""
    ).toLowerCase().trim();
    userId = request.headers.get("x-user-id") || "";
  }

  const { searchParams } = request ? new URL(request.url) : { searchParams: new URLSearchParams() };
  const page = Number(searchParams.get("page") || 1);
  const limit = Number(searchParams.get("limit") || 12);

  if (!userEmail && !userId) {
    return NextResponse.json({ items: [], total: 0, page, limit, totalPages: 0 });
  }

  try {
    await connectToDatabase();
    const filter: any = {
      $or: [
        ...(userEmail ? [{ likedBy: userEmail }] : []),
        ...(userId ? [{ likedBy: userId }] : []),
      ],
    };

    const likedPosts = await BusinessIdeaModel.find(filter).sort({ _id: -1 }).lean();
    const items = likedPosts.map((item: any) => {
      const districtName = getDistrictLabel(item.district) || item.district || "ঢাকা";
      const exactLoc =
        item.exactLocation ||
        (item.upazilaOrArea ? `${item.upazilaOrArea}, ${districtName}` : `${districtName}, Bangladesh`);

      return {
        id: String(item._id || item.id || item.customId),
        _id: String(item._id || item.id || item.customId),
        title: item.title,
        category: item.category || "agriculture-livestock",
        division: item.division || "Dhaka",
        district: districtName,
        area: item.upazilaOrArea || item.area || districtName,
        exactLocation: exactLoc,
        wholesalePrice: Number(item.wholesalePrice || 0),
        wholesalePriceMax: item.wholesalePriceMax,
        wholesalePriceText: item.wholesalePriceText,
        retailPrice: Number(item.retailPrice || 0),
        retailPriceMax: item.retailPriceMax,
        retailPriceText: item.retailPriceText,
        retailSellPrice: Number(item.retailPrice || 0),
        profitPotential: item.profitPotential || "medium",
        description: item.description || "",
        image: item.image || "/images/ideas/default.jpg",
        tags: item.tags || [],
        author: {
          name: item.postedBy?.name || "ব্যবসা বন্ধু",
          avatar: "/images/avatars/default.jpg",
        },
        likesCount: item.likes || 0,
        dislikesCount: item.dislikes || 0,
        viewsCount: item.viewsCount || 15,
        commentsCount: Array.isArray(item.comments) ? item.comments.length : 0,
        createdAt: item.createdAt || new Date().toISOString(),
      };
    });

    const total = items.length;
    const totalPages = Math.ceil(total / limit);
    const start = (page - 1) * limit;
    const paginatedItems = items.slice(start, start + limit);

    return NextResponse.json({ items: paginatedItems, total, page, limit, totalPages });
  } catch (err) {
    console.error("handleMeLikes error:", err);
  }

  return NextResponse.json({ items: [], total: 0, page, limit, totalPages: 0 });
}

export async function handleMeDislikes(request?: Request) {
  let userEmail = "";
  let userId = "";

  if (request) {
    userEmail = (
      request.headers.get("x-user-email") ||
      getCookieValue(request, "bhbd_user_email") ||
      ""
    ).toLowerCase().trim();
    userId = request.headers.get("x-user-id") || "";
  }

  const { searchParams } = request ? new URL(request.url) : { searchParams: new URLSearchParams() };
  const page = Number(searchParams.get("page") || 1);
  const limit = Number(searchParams.get("limit") || 12);

  if (!userEmail && !userId) {
    return NextResponse.json({ items: [], total: 0, page, limit, totalPages: 0 });
  }

  try {
    await connectToDatabase();
    const filter: any = {
      $or: [
        ...(userEmail ? [{ dislikedBy: userEmail }] : []),
        ...(userId ? [{ dislikedBy: userId }] : []),
      ],
    };

    const dislikedPosts = await BusinessIdeaModel.find(filter).sort({ _id: -1 }).lean();
    const items = dislikedPosts.map((item: any) => {
      const districtName = getDistrictLabel(item.district) || item.district || "ঢাকা";
      const exactLoc =
        item.exactLocation ||
        (item.upazilaOrArea ? `${item.upazilaOrArea}, ${districtName}` : `${districtName}, Bangladesh`);

      return {
        id: String(item._id || item.id || item.customId),
        _id: String(item._id || item.id || item.customId),
        title: item.title,
        category: item.category || "agriculture-livestock",
        division: item.division || "Dhaka",
        district: districtName,
        area: item.upazilaOrArea || item.area || districtName,
        exactLocation: exactLoc,
        wholesalePrice: Number(item.wholesalePrice || 0),
        wholesalePriceMax: item.wholesalePriceMax,
        wholesalePriceText: item.wholesalePriceText,
        retailPrice: Number(item.retailPrice || 0),
        retailPriceMax: item.retailPriceMax,
        retailPriceText: item.retailPriceText,
        retailSellPrice: Number(item.retailPrice || 0),
        profitPotential: item.profitPotential || "medium",
        description: item.description || "",
        image: item.image || "/images/ideas/default.jpg",
        tags: item.tags || [],
        author: {
          name: item.postedBy?.name || "ব্যবসা বন্ধু",
          avatar: "/images/avatars/default.jpg",
        },
        likesCount: item.likes || 0,
        dislikesCount: item.dislikes || 0,
        viewsCount: item.viewsCount || 15,
        commentsCount: Array.isArray(item.comments) ? item.comments.length : 0,
        createdAt: item.createdAt || new Date().toISOString(),
      };
    });

    const total = items.length;
    const totalPages = Math.ceil(total / limit);
    const start = (page - 1) * limit;
    const paginatedItems = items.slice(start, start + limit);

    return NextResponse.json({ items: paginatedItems, total, page, limit, totalPages });
  } catch (err) {
    console.error("handleMeDislikes error:", err);
  }

  return NextResponse.json({ items: [], total: 0, page, limit, totalPages: 0 });
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
  const userEmail = (
    searchParams.get("userEmail") ||
    searchParams.get("email") ||
    request.headers.get("x-user-email") ||
    getCookieValue(request, "bhbd_user_email") ||
    ""
  ).toLowerCase().trim();

  if (!userId && !userEmail) {
    return NextResponse.json({ items: [], total: 0, page, limit, totalPages: 0 });
  }

  let items: any[] = [];
  try {
    await connectToDatabase();
    const filter: any = {
      $or: [
        ...(userId ? [{ userId }] : []),
        ...(userEmail ? [{ authorEmail: userEmail }] : []),
      ],
    };
    if (status && status !== "all") {
      filter.status = status;
    }

    const blogs = await BlogModel.find(filter).sort({ _id: -1 }).lean();
    items = blogs.map((item: any) => ({
      id: String(item._id || item.id || item.customId),
      _id: String(item._id || item.id || item.customId),
      title: item.title,
      slug: item.slug || (item.title || "").toLowerCase().replace(/\s+/g, "-"),
      category: item.category || "ব্যবসা শুরু",
      excerpt: item.excerpt || "",
      content: item.content || "",
      coverImage: item.coverImage || item.image || "/images/blog/default.jpg",
      readTime: item.readTime || "৫ মিনিট",
      readingTime: item.readingTime || 5,
      status: item.status || "approved",
      author: {
        name: typeof item.author === "string" ? item.author : item.author?.name || "ব্যবহারকারী",
        avatar: "/images/avatars/default.jpg",
      },
      likesCount: item.likes || 0,
      commentsCount: Array.isArray(item.comments) ? item.comments.length : 0,
      createdAt: item.createdAt || new Date().toISOString(),
    }));
  } catch (err) {
    console.error("handleMeBlogs error:", err);
  }

  if (q) {
    items = items.filter((b) => b.title.toLowerCase().includes(q) || b.category.toLowerCase().includes(q));
  }

  const total = items.length;
  const totalPages = Math.ceil(total / limit);
  const start = (page - 1) * limit;
  const paginatedItems = items.slice(start, start + limit);

  return NextResponse.json({ items: paginatedItems, total, page, limit, totalPages });
}

export async function handleMeBlogDetail(id: string) {
  const decodedId = decodeURIComponent(id);

  try {
    await connectToDatabase();
    const query: any = {
      $or: [{ id: decodedId }, { customId: decodedId }, { slug: decodedId }],
    };
    if (mongoose.Types.ObjectId.isValid(decodedId)) {
      query.$or.push({ _id: decodedId });
    }

    const item = await BlogModel.findOne(query).lean();
    if (item) {
      return NextResponse.json({
        id: String(item._id || item.id || item.customId),
        _id: String(item._id || item.id || item.customId),
        title: item.title,
        slug: item.slug || (item.title || "").toLowerCase().replace(/\s+/g, "-"),
        category: item.category || "ব্যবসা শুরু",
        excerpt: item.excerpt || "",
        content: item.content || "",
        coverImage: item.coverImage || item.image || "/images/blog/default.jpg",
        readTime: item.readTime || "৫ মিনিট",
        readingTime: item.readingTime || 5,
        status: item.status || "approved",
        author: {
          name: typeof item.author === "string" ? item.author : item.author?.name || "ব্যবহারকারী",
          avatar: "/images/avatars/default.jpg",
        },
        likesCount: item.likes || 0,
        commentsCount: Array.isArray(item.comments) ? item.comments.length : 0,
        createdAt: item.createdAt || new Date().toISOString(),
      });
    }
  } catch (e) {
    console.error("handleMeBlogDetail error:", e);
  }

  return NextResponse.json({ message: "Blog not found" }, { status: 404 });
}

export async function handleMeBlogDelete(id: string, request?: Request) {
  const decodedId = decodeURIComponent(id);

  try {
    await connectToDatabase();
    const query: any = {
      $or: [{ id: decodedId }, { customId: decodedId }, { slug: decodedId }],
    };
    if (mongoose.Types.ObjectId.isValid(decodedId)) {
      query.$or.push({ _id: decodedId });
    }

    await BlogModel.findOneAndDelete(query);
    return NextResponse.json({ success: true, message: "Blog deleted" });
  } catch (e: any) {
    console.error("handleMeBlogDelete error:", e);
    return NextResponse.json({ success: false, message: e.message }, { status: 500 });
  }
}
