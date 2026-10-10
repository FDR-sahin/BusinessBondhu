import { NextResponse } from "next/server";
import { getMockComments, MOCK_POSTS } from "@/lib/mock-data";
import { getDistrictLabel } from "@/lib/bd-data";
import {
  deleteUserPost,
  findUserPost,
  getUserPosts,
  saveUserPost,
  type UserStoredPost,
} from "@/lib/user-posts-store";
import { getUserProfile, getCookieValue } from "@/lib/user-profile-store";
import type { PostDetail } from "@/types";

export async function handlePostsGet(request: Request) {
  const { searchParams } = new URL(request.url);
  const params = Object.fromEntries(searchParams.entries());
  const backendUrl = process.env.NEXT_PUBLIC_API_URL || "https://uddok-admin.vercel.app";

  let adminItems: any[] = [];

  try {
    const res = await fetch(`${backendUrl.replace(/\/$/, "")}/api/ideas?status=approved`, {
      cache: "no-store",
      headers: { "Content-Type": "application/json" },
    });

    if (res.ok) {
      const result = await res.json();
      if (result.success && Array.isArray(result.data)) {
        adminItems = result.data
          .filter(
            (item: any) =>
              (!item.status || item.status === "approved") &&
              !item.isBlog &&
              !item.isUserAccount &&
              item.status !== "user_account" &&
              !(typeof item.title === "string" && item.title.startsWith("[ইউজার]"))
          )
          .map((item: any) => {
            const districtName = getDistrictLabel(item.district) || item.district || "ঢাকা";
            const exactLoc =
              item.exactLocation ||
              (item.upazilaOrArea ? `${item.upazilaOrArea}, ${districtName}` : `${districtName}, Bangladesh`);
            const wholesalePrice = Number(item.wholesalePrice || 0);
            const wholesalePriceMax = item.wholesalePriceMax ? Number(item.wholesalePriceMax) : undefined;
            const retailPrice = Number(item.retailPrice || item.retailSellPrice || 0);
            const retailPriceMax = item.retailPriceMax ? Number(item.retailPriceMax) : undefined;

            return {
              id: String(item.id || item._id),
              _id: String(item._id || item.id),
              title: item.title,
              slug: (item.title || "").toLowerCase().replace(/\s+/g, "-"),
              category: item.category || "agriculture-livestock",
              division: item.division || "Dhaka",
              district: districtName,
              area: item.upazilaOrArea || item.area || districtName,
              exactLocation: exactLoc,
              wholesalePrice,
              wholesalePriceMax,
              wholesalePriceText: item.wholesalePriceText,
              retailPrice,
              retailPriceMax,
              retailPriceText: item.retailPriceText,
              retailSellPrice: retailPrice,
              profitPotential: item.profitPotential || (retailPrice - wholesalePrice > 100 ? "high" : "medium"),
              description: item.description || "",
              image: item.image || "/images/ideas/default.jpg",
              tags: item.tags || [`#${districtName}`, `#${item.category}`],
              author: {
                name: typeof item.author === "string" ? item.author : item.author?.name || item.postedBy?.name || "ব্যবসা বন্ধু",
                avatar: "/images/avatars/default.jpg",
              },
              likesCount: item.likesCount ?? item.likes ?? 0,
              dislikesCount: item.dislikesCount ?? item.dislikes ?? 0,
              viewsCount: item.viewsCount ?? 15,
              commentsCount: item.comments?.length || 0,
              createdAt: item.createdAt || new Date().toISOString(),
              status: "approved",
              isVerified: item.isVerified ?? true,
            };
          });
      }
    }
  } catch (err) {
    console.error("Failed to fetch posts from admin backend:", err);
  }

  // Merge admin posts with MOCK_POSTS
  const existingIds = new Set(adminItems.map((i) => String(i.id)));
  const fallbackItems = MOCK_POSTS.filter((post) => !existingIds.has(String(post.id))).map((post) => {
    const districtName = getDistrictLabel(post.district) || post.district;
    const exactLoc = post.exactLocation || (post.area ? `${post.area}, ${districtName}` : `${districtName}, Bangladesh`);
    const wholesalePrice = Number(post.wholesalePrice || 0);
    const retailPrice = Number(post.retailSellPrice ?? post.retailPrice ?? 0);

    return {
      id: String(post.id),
      _id: String(post.id),
      title: post.title,
      slug: (post.title || "").toLowerCase().replace(/\s+/g, "-"),
      category: post.category,
      division: post.division,
      district: districtName,
      area: post.area,
      exactLocation: exactLoc,
      wholesalePrice,
      wholesalePriceMax: post.wholesalePriceMax,
      wholesalePriceText: post.wholesalePriceText,
      retailPrice,
      retailPriceMax: post.retailPriceMax,
      retailPriceText: post.retailPriceText,
      retailSellPrice: retailPrice,
      profitPotential: post.profitPotential,
      description: post.description,
      image: post.image || "/images/ideas/default.jpg",
      tags: post.tags,
      author: {
        name: typeof post.author === "string" ? post.author : post.author?.name || "সোর্সিং প্রতিনিধি",
        avatar: "/images/avatars/default.jpg",
      },
      likesCount: post.likesCount,
      dislikesCount: post.dislikesCount,
      viewsCount: post.viewsCount,
      commentsCount: post.commentsCount,
      createdAt: post.createdAt,
      status: "approved",
      isVerified: true,
    };
  });

  // Merge with locally stored user posts if approved
  const userStored = getUserPosts()
    .filter((p) => p.status === "approved")
    .map((p) => ({
      id: String(p.id),
      _id: String(p.id),
      title: p.title,
      slug: (p.title || "").toLowerCase().replace(/\s+/g, "-"),
      category: p.category || "general",
      division: p.division || "Dhaka",
      district: (p.district ? getDistrictLabel(p.district) : undefined) || p.district || "ঢাকা",
      area: p.area || "",
      exactLocation: p.exactLocation || `${p.district || "ঢাকা"}, Bangladesh`,
      wholesalePrice: Number(p.wholesalePrice || 0),
      wholesalePriceMax: p.wholesalePriceMax ? Number(p.wholesalePriceMax) : undefined,
      wholesalePriceText: p.wholesalePriceText,
      retailPrice: Number(p.retailPrice || 0),
      retailPriceMax: p.retailPriceMax ? Number(p.retailPriceMax) : undefined,
      retailPriceText: p.retailPriceText,
      retailSellPrice: Number(p.retailSellPrice || p.retailPrice || 0),
      profitPotential: p.profitPotential || "medium",
      description: p.description || "",
      image: p.image || "/images/ideas/default.jpg",
      tags: p.tags || [],
      author: {
        name: p.author?.name || "ব্যবহারকারী",
        avatar: p.author?.avatar || "/images/avatars/default.jpg",
      },
      likesCount: p.likesCount || 0,
      dislikesCount: p.dislikesCount || 0,
      viewsCount: p.viewsCount || 1,
      commentsCount: p.commentsCount || 0,
      createdAt: p.createdAt,
      status: p.status,
      isVerified: p.isVerified ?? false,
    }));

  let items = [...userStored, ...adminItems, ...fallbackItems];

  // Search & Category Filtering
  if (params.q) {
    const q = params.q.toLowerCase();
    items = items.filter(
      (i: any) =>
        i.title.toLowerCase().includes(q) ||
        i.district.toLowerCase().includes(q) ||
        i.category.toLowerCase().includes(q)
    );
  }
  if (params.category && params.category !== "all") {
    items = items.filter((i: any) => i.category === params.category);
  }
  if (params.district) {
    items = items.filter((i: any) => i.district.toLowerCase() === params.district.toLowerCase());
  }

  const page = Number(params.page || 1);
  const limit = Number(params.limit || 12);
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

export async function handlePostsPost(request: Request) {
  try {
    const body = await request.json();
    const backendUrl = process.env.NEXT_PUBLIC_API_URL || "https://uddok-admin.vercel.app";

    const wMin = Number(body.wholesalePrice || 0);
    const wMax = body.wholesalePriceMax !== undefined && body.wholesalePriceMax !== null && String(body.wholesalePriceMax).trim() !== ""
      ? Number(body.wholesalePriceMax)
      : undefined;
    const rMin = Number(body.retailPrice || body.retailSellPrice || 0);
    const rMax = body.retailPriceMax !== undefined && body.retailPriceMax !== null && String(body.retailPriceMax).trim() !== ""
      ? Number(body.retailPriceMax)
      : undefined;

    const wholesalePriceText = (wMax && wMax > wMin) ? `${wMin}-${wMax}` : String(wMin);
    const retailPriceText = (rMax && rMax > rMin) ? `${rMin}-${rMax}` : String(rMin);

    const postRecord: UserStoredPost = {
      id: `post-${Date.now()}`,
      title: body.title || "শিরোনামহীন খসড়া",
      category: body.category || "general",
      division: body.division || "Dhaka",
      district: body.district || "ঢাকা",
      area: body.area || "",
      exactLocation: body.exactLocation || `${body.district || "ঢাকা"}, Bangladesh`,
      wholesalePrice: wMin,
      wholesalePriceMax: wMax,
      wholesalePriceText,
      retailPrice: rMin,
      retailPriceMax: rMax,
      retailPriceText,
      retailSellPrice: rMin,
      profitPotential: body.profitPotential || "medium",
      description: body.description || "",
      image: body.image || "/images/ideas/default.jpg",
      tags: body.tags || [],
      status: body.status === "draft" ? "draft" : "pending",
      userId: body.userId || undefined,
      authorEmail: body.authorEmail || undefined,
      author: {
        id: body.userId || undefined,
        name: body.authorName || "ব্যবহারকারী",
        avatar: "/images/avatars/default.jpg",
      },
      likesCount: 0,
      dislikesCount: 0,
      viewsCount: 1,
      commentsCount: 0,
      createdAt: new Date().toISOString(),
      isVerified: false,
    };

    // Forward to uddok-admin backend /api/ideas if it's a published/pending post
    if (postRecord.status === "pending") {
      try {
        const backendRes = await fetch(`${backendUrl.replace(/\/$/, "")}/api/ideas`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            title: postRecord.title,
            category: postRecord.category,
            district: postRecord.district,
            exactLocation: postRecord.exactLocation,
            wholesalePrice: wMin,
            wholesalePriceMax: wMax,
            wholesalePriceText,
            retailPrice: rMin,
            retailPriceMax: rMax,
            retailPriceText,
            description: postRecord.description,
            status: "pending",
            userId: body.userId || "",
            authorEmail: body.authorEmail || "",
            isVerified: false,
            postedBy: {
              name: body.authorName || "ব্যবহারকারী",
              role: "ব্যবহারকারী",
              email: body.authorEmail || "",
              isVerifiedUser: false,
            },
          }),
        });
        if (backendRes.ok) {
          const backendData = await backendRes.json();
          if (backendData.data?._id || backendData.data?.id) {
            postRecord.id = String(backendData.data._id || backendData.data.id);
            postRecord._id = String(backendData.data._id || backendData.data.id);
          }
        }
      } catch (err) {
        console.warn("Could not forward to backend API, saved locally:", err);
      }
    }

    // Always persist in local user posts store (drafts + pending posts)
    saveUserPost(postRecord);

    return NextResponse.json({ success: true, post: postRecord, id: postRecord.id }, { status: 201 });
  } catch (error: any) {
    console.error("Failed to create post:", error);
    return NextResponse.json({ success: false, message: error?.message || "পোস্ট তৈরি করতে সমস্যা হয়েছে" }, { status: 500 });
  }
}

export async function handlePostDetailGet(id: string) {
  const decodedId = decodeURIComponent(id);
  const backendUrl = process.env.NEXT_PUBLIC_API_URL || "https://uddok-admin.vercel.app";

  // 1. Check uddok-admin backend first for live post data (real likes, dislikes, comments)
  try {
    const res = await fetch(`${backendUrl.replace(/\/$/, "")}/api/ideas?id=${encodeURIComponent(decodedId)}`, {
      cache: "no-store",
    });
    if (res.ok) {
      const result = await res.json();
      const list = Array.isArray(result.data) ? result.data : [result.data];
      const item = list.find((i: any) => String(i.id || i._id) === decodedId);

      if (item) {
        const districtName = getDistrictLabel(item.district) || item.district || "ঢাকা";
        const exactLoc =
          item.exactLocation ||
          (item.upazilaOrArea ? `${item.upazilaOrArea}, ${districtName}` : `${districtName}, Bangladesh`);
        const wholesalePrice = Number(item.wholesalePrice || 0);
        const wholesalePriceMax = item.wholesalePriceMax ? Number(item.wholesalePriceMax) : undefined;
        const wholesalePriceText = item.wholesalePriceText || (wholesalePriceMax ? `${wholesalePrice}-${wholesalePriceMax}` : undefined);
        const retailPrice = Number(item.retailPrice || item.retailSellPrice || 0);
        const retailPriceMax = item.retailPriceMax ? Number(item.retailPriceMax) : undefined;
        const retailPriceText = item.retailPriceText || (retailPriceMax ? `${retailPrice}-${retailPriceMax}` : undefined);

        const post: PostDetail = {
          id: String(item.id || item._id),
          title: item.title,
          category: item.category || "agriculture-livestock",
          division: item.division || "Dhaka",
          district: districtName,
          area: item.upazilaOrArea || item.area || districtName,
          exactLocation: exactLoc,
          wholesalePrice,
          wholesalePriceMax,
          wholesalePriceText,
          retailPrice,
          retailPriceMax,
          retailPriceText,
          retailSellPrice: retailPrice,
          profitPotential: item.profitPotential || (retailPrice - wholesalePrice > 100 ? "high" : "medium"),
          description: item.description || "উৎপাদন ও সোর্সিং সংক্রান্ত বিস্তারিত তথ্য।",
          image: item.image || "/images/ideas/default.jpg",
          tags: item.tags || [`#${districtName}`, `#${item.category}`],
          author: {
            id: item.userId || "u-admin",
            name: typeof item.author === "string" ? item.author : item.author?.name || item.postedBy?.name || "উদ্যোক্তা অ্যাডমিন",
            avatar: "/images/avatars/default.jpg",
          },
          likesCount: typeof item.likes === "number" ? item.likes : item.likesCount || 0,
          dislikesCount: typeof item.dislikes === "number" ? item.dislikes : item.dislikesCount || 0,
          viewsCount: item.viewsCount || 15,
          commentsCount: Array.isArray(item.comments) ? item.comments.length : 0,
          createdAt: item.createdAt || new Date().toISOString(),
        };

        return NextResponse.json(post);
      }
    }
  } catch (err) {
    console.error("Failed to fetch post detail from backend:", err);
  }

  // 2. Check local user store
  const localPost = findUserPost(decodedId);
  if (localPost) {
    return NextResponse.json(localPost);
  }

  // 3. Check MOCK_POSTS
  const mockFound = MOCK_POSTS.find((p) => String(p.id) === decodedId);
  if (mockFound) {
    const districtName = getDistrictLabel(mockFound.district) || mockFound.district;
    const exactLoc = mockFound.exactLocation || (mockFound.area ? `${mockFound.area}, ${districtName}` : `${districtName}, Bangladesh`);

    return NextResponse.json({
      ...mockFound,
      district: districtName,
      exactLocation: exactLoc,
    });
  }

  return NextResponse.json({ message: "Post not found" }, { status: 404 });
}

export async function handlePostDetailPut(id: string, request: Request) {
  const decodedId = decodeURIComponent(id);
  const body = await request.json();
  const backendUrl = process.env.NEXT_PUBLIC_API_URL || "https://uddok-admin.vercel.app";

  const requesterEmail = (
    request.headers.get("x-user-email") ||
    getCookieValue(request, "bhbd_user_email") ||
    ""
  ).toLowerCase().trim();
  const requesterId = request.headers.get("x-user-id");

  const existing = findUserPost(decodedId);
  if (existing) {
    const isOwner =
      (requesterId && existing.userId === requesterId) ||
      (requesterEmail && existing.authorEmail?.toLowerCase() === requesterEmail);
    if (!isOwner && requesterEmail !== "admin@businessbondhu.com") {
      return NextResponse.json({ message: "অনুমতি নেই: আপনি এই পোস্টটি সম্পাদনা করতে পারবেন না।" }, { status: 403 });
    }
    const updated = saveUserPost({ ...existing, ...body });
    return NextResponse.json(updated);
  }

  try {
    await fetch(`${backendUrl.replace(/\/$/, "")}/api/ideas?id=${encodeURIComponent(decodedId)}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
  } catch (err) {
    console.warn("Backend update error:", err);
  }

  return NextResponse.json({ success: true, message: "Post updated" });
}

export async function handlePostDetailDelete(id: string, request?: Request) {
  const decodedId = decodeURIComponent(id);
  const backendUrl = process.env.NEXT_PUBLIC_API_URL || "https://uddok-admin.vercel.app";

  if (request) {
    const requesterEmail = (
      request.headers.get("x-user-email") ||
      getCookieValue(request, "bhbd_user_email") ||
      ""
    ).toLowerCase().trim();
    const requesterId = request.headers.get("x-user-id");

    const existing = findUserPost(decodedId);
    if (existing) {
      const isOwner =
        (requesterId && existing.userId === requesterId) ||
        (requesterEmail && existing.authorEmail?.toLowerCase() === requesterEmail);
      if (!isOwner && requesterEmail !== "admin@businessbondhu.com") {
        return NextResponse.json({ message: "অনুমতি নেই: আপনি এই পোস্টটি ডিলিট করতে পারবেন না।" }, { status: 403 });
      }
    }
  }

  try {
    await fetch(`${backendUrl.replace(/\/$/, "")}/api/ideas?id=${encodeURIComponent(decodedId)}`, {
      method: "DELETE",
    });
  } catch (err) {
    console.warn("Backend delete error:", err);
  }

  deleteUserPost(decodedId);
  return NextResponse.json({ success: true, message: "Post deleted" });
}

export async function handlePostLike(id: string, request: Request) {
  const decodedId = decodeURIComponent(id);
  const backendUrl = process.env.NEXT_PUBLIC_API_URL || "https://uddok-admin.vercel.app";
  const body = await request.json().catch(() => ({}));
  const userId =
    body.userId ||
    request.headers.get("x-user-id") ||
    request.headers.get("x-user-email") ||
    request.headers.get("x-forwarded-for") ||
    "guest";

  try {
    let res = await fetch(`${backendUrl.replace(/\/$/, "")}/api/ideas/${encodeURIComponent(decodedId)}/reaction`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "like", userId }),
    });

    if (!res.ok) {
      res = await fetch(`${backendUrl.replace(/\/$/, "")}/api/ideas?action=reaction&id=${encodeURIComponent(decodedId)}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "like", userId }),
      });
    }

    if (res.ok) {
      const data = await res.json();
      return NextResponse.json(data);
    }
  } catch (err) {
    console.error("Failed to forward like reaction:", err);
  }

  return NextResponse.json({ success: true, message: "Reaction updated" });
}

export async function handlePostDislike(id: string, request: Request) {
  const decodedId = decodeURIComponent(id);
  const backendUrl = process.env.NEXT_PUBLIC_API_URL || "https://uddok-admin.vercel.app";
  const body = await request.json().catch(() => ({}));
  const userId =
    body.userId ||
    request.headers.get("x-user-id") ||
    request.headers.get("x-user-email") ||
    request.headers.get("x-forwarded-for") ||
    "guest";

  try {
    let res = await fetch(`${backendUrl.replace(/\/$/, "")}/api/ideas/${encodeURIComponent(decodedId)}/reaction`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "dislike", userId }),
    });

    if (!res.ok) {
      res = await fetch(`${backendUrl.replace(/\/$/, "")}/api/ideas?action=reaction&id=${encodeURIComponent(decodedId)}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "dislike", userId }),
      });
    }

    if (res.ok) {
      const data = await res.json();
      return NextResponse.json(data);
    }
  } catch (err) {
    console.error("Failed to forward dislike reaction:", err);
  }

  return NextResponse.json({ success: true, message: "Reaction updated" });
}

export async function handlePostCommentsGet(id: string) {
  const decodedId = decodeURIComponent(id);
  const backendUrl = process.env.NEXT_PUBLIC_API_URL || "https://uddok-admin.vercel.app";

  try {
    let res = await fetch(`${backendUrl.replace(/\/$/, "")}/api/ideas/${encodeURIComponent(decodedId)}/comments`, {
      cache: "no-store",
    });

    if (!res.ok) {
      res = await fetch(`${backendUrl.replace(/\/$/, "")}/api/ideas?action=comments&id=${encodeURIComponent(decodedId)}`, {
        cache: "no-store",
      });
    }

    if (res.ok) {
      const data = await res.json();
      const commentsList = Array.isArray(data.data) ? data.data : Array.isArray(data) ? data : [];
      if (commentsList.length > 0) {
        return NextResponse.json(
          commentsList.map((c: any) => ({
            id: String(c.id || c._id),
            postId: decodedId,
            author: {
              id: "u-commenter",
              name: c.authorName && c.authorName !== "উদ্যোক্তা" ? c.authorName : "ব্যবহারকারী",
            },
            content: c.comment || c.content,
            createdAt: c.createdAt || new Date().toISOString(),
            likesCount: c.likes || 0,
            replies: (c.replies || []).map((r: any) => ({
              id: String(r.id || r._id),
              postId: decodedId,
              parentId: String(c.id || c._id),
              author: {
                id: "u-reply",
                name: r.authorName && r.authorName !== "উদ্যোক্তা" ? r.authorName : "টিম",
              },
              content: r.comment || r.content,
              createdAt: r.createdAt || new Date().toISOString(),
              likesCount: r.likes || 0,
            })),
          }))
        );
      }
    }

    const ideaRes = await fetch(`${backendUrl.replace(/\/$/, "")}/api/ideas?id=${encodeURIComponent(decodedId)}`, {
      cache: "no-store",
    });
    if (ideaRes.ok) {
      const ideaData = await ideaRes.json();
      const list = Array.isArray(ideaData.data) ? ideaData.data : [ideaData.data];
      const found = list.find((i: any) => String(i.id || i._id) === decodedId);
      if (found && Array.isArray(found.comments) && found.comments.length > 0) {
        return NextResponse.json(
          found.comments.map((c: any) => ({
            id: String(c.id || c._id),
            postId: decodedId,
            author: {
              id: "u-commenter",
              name: c.authorName && c.authorName !== "উদ্যোক্তা" ? c.authorName : "ব্যবহারকারী",
            },
            content: c.comment || c.content,
            createdAt: c.createdAt || new Date().toISOString(),
            likesCount: c.likes || 0,
            replies: [],
          }))
        );
      }
    }
  } catch (err) {
    console.error("Could not fetch backend comments:", err);
  }

  const comments = getMockComments(decodedId);
  return NextResponse.json(comments);
}

export async function handlePostCommentsPost(id: string, request: Request) {
  try {
    const decodedId = decodeURIComponent(id);
    const body = await request.json();
    const backendUrl = process.env.NEXT_PUBLIC_API_URL || "https://uddok-admin.vercel.app";

    const headerName = request.headers.get("x-user-name")
      ? decodeURIComponent(request.headers.get("x-user-name")!)
      : "";
    const email = request.headers.get("x-user-email");
    const profileName = email ? getUserProfile(email)?.name : "";

    const rawName = body.authorName || body.author?.name || headerName || profileName || "";
    const authorName = rawName && rawName !== "উদ্যোক্তা" ? rawName.trim() : "ব্যবহারকারী";
    const commentContent = body.content || body.comment || "";
    const nowIso = new Date().toISOString();

    if (!commentContent.trim()) {
      return NextResponse.json({ message: "Content cannot be empty" }, { status: 400 });
    }

    let res = await fetch(`${backendUrl.replace(/\/$/, "")}/api/ideas/${encodeURIComponent(decodedId)}/comments`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        authorName,
        comment: commentContent,
        createdAt: nowIso,
      }),
    });

    if (!res.ok) {
      res = await fetch(`${backendUrl.replace(/\/$/, "")}/api/ideas?action=comments&id=${encodeURIComponent(decodedId)}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          authorName,
          comment: commentContent,
          createdAt: nowIso,
        }),
      });
    }

    if (res.ok) {
      const saved = await res.json();
      return NextResponse.json({
        id: String(saved.data?.id || saved.data?._id || `c-${Date.now()}`),
        postId: decodedId,
        author: { id: "me", name: authorName },
        content: commentContent,
        createdAt: nowIso,
        likesCount: 0,
      });
    }
  } catch (err) {
    console.error("Error creating comment:", err);
  }

  return NextResponse.json({
    id: `c-${Date.now()}`,
    postId: id,
    author: { id: "me", name: "ব্যবহারকারী" },
    content: "মন্তব্য যোগ করা হয়েছে",
    createdAt: new Date().toISOString(),
    likesCount: 0,
  });
}

export async function handlePostMe(id: string, request: Request) {
  const decodedId = decodeURIComponent(id);
  const backendUrl = process.env.NEXT_PUBLIC_API_URL || "https://uddok-admin.vercel.app";
  const userId =
    request.headers.get("x-user-id") ||
    request.headers.get("x-user-email") ||
    request.headers.get("x-forwarded-for") ||
    "guest";

  try {
    const reactRes = await fetch(
      `${backendUrl.replace(/\/$/, "")}/api/ideas/${encodeURIComponent(decodedId)}/reaction?userId=${encodeURIComponent(userId)}`,
      {
        cache: "no-store",
        headers: {
          "x-user-id": request.headers.get("x-user-id") || "",
          "x-user-email": request.headers.get("x-user-email") || "",
        },
      }
    );
    if (reactRes.ok) {
      const reactData = await reactRes.json();
      return NextResponse.json({
        reaction: reactData.userReaction ?? null,
        saved: false,
      });
    }

    const res = await fetch(`${backendUrl.replace(/\/$/, "")}/api/ideas?id=${encodeURIComponent(decodedId)}`, {
      cache: "no-store",
    });
    if (res.ok) {
      const data = await res.json();
      const list = Array.isArray(data.data) ? data.data : [data.data];
      const found = list.find((i: any) => String(i.id || i._id) === decodedId);
      if (found) {
        const likedBy = Array.isArray(found.likedBy) ? found.likedBy : [];
        const dislikedBy = Array.isArray(found.dislikedBy) ? found.dislikedBy : [];

        const hasLiked =
          likedBy.includes(userId) ||
          (request.headers.get("x-user-id") && likedBy.includes(request.headers.get("x-user-id")!)) ||
          (request.headers.get("x-user-email") && likedBy.includes(request.headers.get("x-user-email")!));
        const hasDisliked =
          dislikedBy.includes(userId) ||
          (request.headers.get("x-user-id") && dislikedBy.includes(request.headers.get("x-user-id")!)) ||
          (request.headers.get("x-user-email") && dislikedBy.includes(request.headers.get("x-user-email")!));

        return NextResponse.json({
          reaction: hasLiked ? "like" : hasDisliked ? "dislike" : null,
          saved: false,
        });
      }
    }
  } catch (err) {
    console.error("Failed to check user reaction:", err);
  }

  return NextResponse.json({ reaction: null, saved: false });
}

export async function handlePostRelated(id: string) {
  const decodedId = decodeURIComponent(id);
  const related = MOCK_POSTS.filter((p) => p.id !== decodedId).slice(0, 4);
  return NextResponse.json(related);
}
