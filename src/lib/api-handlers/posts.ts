import { NextResponse } from "next/server";
import mongoose from "mongoose";
import { connectToDatabase } from "@/lib/db";
import { BusinessIdeaModel, SavedItemModel } from "@/lib/models";
import { createNotification } from "@/lib/notifications";
import { isUserBlocked } from "@/lib/user-block-check";
import { MOCK_POSTS, getMockComments } from "@/lib/mock-data";
import { getDistrictLabel } from "@/lib/bd-data";
import { getUserProfile, getCookieValue } from "@/lib/user-profile-store";
import type { PostDetail } from "@/types";

export function getQueryForId(id: string) {
  if (!id) return { _id: null };
  const cleanId = String(id).trim();
  if (mongoose.Types.ObjectId.isValid(cleanId)) {
    return { $or: [{ _id: cleanId }, { id: cleanId }, { customId: cleanId }] };
  }
  return { $or: [{ id: cleanId }, { customId: cleanId }] };
}

export async function handlePostsGet(request: Request) {
  const { searchParams } = new URL(request.url);
  const params = Object.fromEntries(searchParams.entries());

  let dbItems: any[] = [];

  try {
    await connectToDatabase();
    const query: any = {
      status: "approved",
    };

    const ideas = await BusinessIdeaModel.find(query).sort({ _id: -1 }).lean();

    if (Array.isArray(ideas) && ideas.length > 0) {
      dbItems = ideas
        .filter(
          (item: any) =>
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

          const ideaId = String(item._id || item.id || item.customId);

          return {
            id: ideaId,
            _id: ideaId,
            customId: item.customId || ideaId,
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
              id: item.userId || "u-admin",
              name: typeof item.author === "string" ? item.author : item.author?.name || item.postedBy?.name || "ব্যবসা বন্ধু",
              avatar: item.author?.avatar || "/images/avatars/default.jpg",
            },
            likesCount: item.likesCount ?? item.likes ?? 0,
            dislikesCount: item.dislikesCount ?? item.dislikes ?? 0,
            viewsCount: item.viewsCount ?? 15,
            commentsCount: Array.isArray(item.comments) ? item.comments.length : 0,
            createdAt: item.createdAt || new Date().toISOString(),
            status: item.status || "approved",
            isVerified: item.isVerified ?? true,
          };
        });
    }
  } catch (err) {
    console.error("Failed to fetch posts from MongoDB:", err);
  }

  // Merge with any non-overlapping MOCK_POSTS
  const existingIds = new Set(dbItems.map((i) => String(i.id)));
  const existingTitles = new Set(dbItems.map((i) => (i.title || "").trim().toLowerCase()));

  const fallbackItems = MOCK_POSTS.filter((post) => !existingIds.has(String(post.id)) && !existingTitles.has((post.title || "").trim().toLowerCase())).map((post) => {
    const districtName = getDistrictLabel(post.district) || post.district;
    const exactLoc = post.exactLocation || (post.area ? `${post.area}, ${districtName}` : `${districtName}, Bangladesh`);
    const wholesalePrice = Number(post.wholesalePrice || 0);
    const retailPrice = Number(post.retailSellPrice ?? post.retailPrice ?? 0);

    return {
      id: String(post.id),
      _id: String(post.id),
      customId: String(post.id),
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
      image: post.image,
      tags: post.tags,
      author: {
        id: "u-seed",
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

  let items = dbItems.length > 0 ? dbItems : fallbackItems;

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
    await connectToDatabase();

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

    const newId = `post-${Date.now()}`;
    const authorName = body.authorName || body.author?.name || "উদ্যোক্তা ব্যবহারকারী";
    const authorEmail = (
      body.authorEmail ||
      request.headers.get("x-user-email") ||
      getCookieValue(request, "bhbd_user_email") ||
      ""
    ).toLowerCase().trim();
    const userId = body.userId || request.headers.get("x-user-id") || "";
    const status = body.status === "draft" ? "draft" : "pending";

    if (await isUserBlocked(authorEmail, userId)) {
      return NextResponse.json(
        { message: "আপনার অ্যাকাউন্টটি অ্যাডমিন কর্তৃক সাময়িকভাবে ব্লক করা হয়েছে। আপনি নতুন পোস্ট করতে পারবেন না।" },
        { status: 403 }
      );
    }

    const created = await BusinessIdeaModel.create({
      customId: newId,
      id: newId,
      title: body.title || "নতুন বিজনেস সোর্সিং আইডিয়া",
      category: body.category || "agriculture-livestock",
      division: body.division || "Dhaka",
      district: body.district || "ঢাকা",
      area: body.area || "",
      upazilaOrArea: body.area || "",
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
      status,
      userId,
      authorEmail,
      author: {
        id: userId,
        name: authorName,
        avatar: "/images/avatars/default.jpg",
      },
      postedBy: {
        name: authorName,
        role: "ব্যবহারকারী",
        email: authorEmail,
        isVerifiedUser: false,
      },
      likes: 0,
      dislikes: 0,
      viewsCount: 1,
      comments: [],
      isVerified: false,
      verificationBadgeText: "পেন্ডিং রিকোয়েস্ট",
    });

    const resultId = String(created._id || created.id || created.customId);

    return NextResponse.json(
      {
        success: true,
        post: { ...created.toObject(), id: resultId, _id: resultId },
        id: resultId,
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("Failed to create post in MongoDB:", error);
    return NextResponse.json(
      { success: false, message: error?.message || "পোস্ট তৈরি করতে সমস্যা হয়েছে" },
      { status: 500 }
    );
  }
}

export async function handlePostDetailGet(id: string) {
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
      const wholesalePrice = Number(item.wholesalePrice || 0);
      const wholesalePriceMax = item.wholesalePriceMax ? Number(item.wholesalePriceMax) : undefined;
      const wholesalePriceText = item.wholesalePriceText || (wholesalePriceMax ? `${wholesalePrice}-${wholesalePriceMax}` : undefined);
      const retailPrice = Number(item.retailPrice || item.retailSellPrice || 0);
      const retailPriceMax = item.retailPriceMax ? Number(item.retailPriceMax) : undefined;
      const retailPriceText = item.retailPriceText || (retailPriceMax ? `${retailPrice}-${retailPriceMax}` : undefined);

      const post: PostDetail = {
        id: String(item._id || item.id || item.customId),
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
          avatar: item.author?.avatar || "/images/avatars/default.jpg",
        },
        likesCount: typeof item.likes === "number" ? item.likes : item.likesCount || 0,
        dislikesCount: typeof item.dislikes === "number" ? item.dislikes : item.dislikesCount || 0,
        viewsCount: item.viewsCount || 15,
        commentsCount: Array.isArray(item.comments) ? item.comments.length : 0,
        createdAt: item.createdAt || new Date().toISOString(),
      };

      return NextResponse.json(post);
    }
  } catch (err) {
    console.error("Failed to fetch post detail from MongoDB:", err);
  }

  // Fallback to MOCK_POSTS
  const mockFound = MOCK_POSTS.find((p) => String(p.id) === decodedId);
  if (mockFound) {
    return NextResponse.json(mockFound);
  }

  return NextResponse.json({ message: "Post not found" }, { status: 404 });
}

export async function handlePostDetailPut(id: string, request: Request) {
  const decodedId = decodeURIComponent(id);
  const body = await request.json();

  try {
    await connectToDatabase();
    const query = getQueryForId(decodedId);
    const updates = { ...body, updatedAt: new Date().toISOString() };
    delete updates._id;
    const updated = await BusinessIdeaModel.findOneAndUpdate(
      query,
      updates,
      { new: true }
    );
    if (updated) {
      return NextResponse.json({ success: true, message: "Post updated", post: updated });
    }
  } catch (err: any) {
    console.error("MongoDB post update error:", err);
    return NextResponse.json({ success: false, message: err.message }, { status: 500 });
  }

  return NextResponse.json({ message: "Post not found" }, { status: 404 });
}

export async function handlePostDetailDelete(id: string, request?: Request) {
  const decodedId = decodeURIComponent(id);

  try {
    await connectToDatabase();
    const query = getQueryForId(decodedId);
    await BusinessIdeaModel.findOneAndDelete(query);
    // Also clean up any saved items associated with this post
    await SavedItemModel.deleteMany({ postId: decodedId }).catch(() => {});
    return NextResponse.json({ success: true, message: "Post deleted" });
  } catch (err: any) {
    console.error("MongoDB post delete error:", err);
    return NextResponse.json({ success: false, message: err.message }, { status: 500 });
  }
}

export async function handlePostLike(id: string, request: Request) {
  const decodedId = decodeURIComponent(id);
  const body = await request.json().catch(() => ({}));
  const userId = String(
    body.userId ||
    request.headers.get("x-user-id") ||
    request.headers.get("x-user-email") ||
    getCookieValue(request, "bhbd_user_email") ||
    request.headers.get("x-forwarded-for") ||
    "guest"
  );

  try {
    await connectToDatabase();
    const query = getQueryForId(decodedId);
    const item = await BusinessIdeaModel.findOne(query);

    if (item) {
      if (!Array.isArray(item.likedBy)) item.likedBy = [];
      if (!Array.isArray(item.dislikedBy)) item.dislikedBy = [];

      const hasLiked = item.likedBy.includes(userId);
      const hasDisliked = item.dislikedBy.includes(userId);
      let userReaction: "like" | "dislike" | null = null;

      if (hasLiked) {
        item.likedBy = item.likedBy.filter((u: string) => u !== userId);
        item.likes = Math.max(0, (item.likes || 1) - 1);
        userReaction = null;
      } else {
        item.likedBy.push(userId);
        item.likes = (item.likes || 0) + 1;
        if (hasDisliked) {
          item.dislikedBy = item.dislikedBy.filter((u: string) => u !== userId);
          item.dislikes = Math.max(0, (item.dislikes || 1) - 1);
        }
        userReaction = "like";
      }

      await item.save();

      if (userReaction === "like") {
        const actorEmail = (
          request.headers.get("x-user-email") ||
          getCookieValue(request, "bhbd_user_email") ||
          ""
        ).toLowerCase().trim();
        const headerName = request.headers.get("x-user-name")
          ? decodeURIComponent(request.headers.get("x-user-name")!)
          : "";
        const actorName = headerName || (actorEmail ? actorEmail.split("@")[0] : "একজন উদ্যোক্তা");
        const recipientEmail = item.authorEmail || item.postedBy?.email;
        const recipientId = item.userId || item.author?.id;

        createNotification({
          recipientUserId: recipientId,
          recipientUserEmail: recipientEmail,
          actorUserId: userId !== "guest" ? userId : undefined,
          actorUserEmail: actorEmail,
          type: "like",
          title: "নতুন লাইক পেয়েছেন! ❤️",
          message: `${actorName} আপনার "${item.title}" আইডিয়াটি পছন্দ করেছেন।`,
          postId: String(item.customId || item._id || decodedId),
        }).catch(() => {});
      }

      return NextResponse.json({
        success: true,
        likesCount: item.likes,
        dislikesCount: item.dislikes,
        userReaction,
      });
    }
  } catch (err: any) {
    console.error("Failed to update like reaction in MongoDB:", err);
  }

  return NextResponse.json({ success: true, message: "Reaction updated" });
}

export async function handlePostDislike(id: string, request: Request) {
  const decodedId = decodeURIComponent(id);
  const body = await request.json().catch(() => ({}));
  const userId = String(
    body.userId ||
    request.headers.get("x-user-id") ||
    request.headers.get("x-user-email") ||
    getCookieValue(request, "bhbd_user_email") ||
    request.headers.get("x-forwarded-for") ||
    "guest"
  );

  try {
    await connectToDatabase();
    const query = getQueryForId(decodedId);
    const item = await BusinessIdeaModel.findOne(query);

    if (item) {
      if (!Array.isArray(item.likedBy)) item.likedBy = [];
      if (!Array.isArray(item.dislikedBy)) item.dislikedBy = [];

      const hasLiked = item.likedBy.includes(userId);
      const hasDisliked = item.dislikedBy.includes(userId);
      let userReaction: "like" | "dislike" | null = null;

      if (hasDisliked) {
        item.dislikedBy = item.dislikedBy.filter((u: string) => u !== userId);
        item.dislikes = Math.max(0, (item.dislikes || 1) - 1);
        userReaction = null;
      } else {
        item.dislikedBy.push(userId);
        item.dislikes = (item.dislikes || 0) + 1;
        if (hasLiked) {
          item.likedBy = item.likedBy.filter((u: string) => u !== userId);
          item.likes = Math.max(0, (item.likes || 1) - 1);
        }
        userReaction = "dislike";
      }

      await item.save();
      return NextResponse.json({
        success: true,
        likesCount: item.likes,
        dislikesCount: item.dislikes,
        userReaction,
      });
    }
  } catch (err: any) {
    console.error("Failed to update dislike reaction in MongoDB:", err);
  }

  return NextResponse.json({ success: true, message: "Reaction updated" });
}

export async function handlePostSave(id: string, request: Request) {
  const decodedId = decodeURIComponent(id);
  const userEmail = (
    request.headers.get("x-user-email") ||
    getCookieValue(request, "bhbd_user_email") ||
    ""
  ).toLowerCase().trim();
  const userId = request.headers.get("x-user-id") || "";

  if (!userEmail) {
    return NextResponse.json({ message: "লগইন করুন।" }, { status: 401 });
  }

  try {
    await connectToDatabase();
    const existing = await SavedItemModel.findOne({ userEmail, postId: decodedId });
    if (existing) {
      await SavedItemModel.deleteOne({ _id: existing._id });
      return NextResponse.json({ success: true, saved: false, message: "সেভ করা তালিকা থেকে সরানো হয়েছে" });
    } else {
      await SavedItemModel.create({
        userId,
        userEmail,
        postId: decodedId,
        createdAt: new Date().toISOString(),
      });
      return NextResponse.json({ success: true, saved: true, message: "পোস্টটি সেভ করা হয়েছে" });
    }
  } catch (err: any) {
    console.error("Error toggling save in MongoDB:", err);
    return NextResponse.json({ success: false, message: err.message }, { status: 500 });
  }
}

export async function handlePostCommentsGet(id: string) {
  const decodedId = decodeURIComponent(id);

  try {
    await connectToDatabase();
    const query = getQueryForId(decodedId);
    const item = await BusinessIdeaModel.findOne(query).lean();

    if (item && Array.isArray(item.comments) && item.comments.length > 0) {
      return NextResponse.json(
        item.comments.map((c: any) => ({
          id: String(c.id || c._id),
          postId: decodedId,
          author: {
            id: c.authorId || "u-commenter",
            name: c.authorName && c.authorName !== "উদ্যোক্তা" ? c.authorName : "ব্যবহারকারী",
            avatar: c.authorAvatar || "/images/avatars/default.jpg",
            email: c.authorEmail || "",
          },
          content: c.comment || c.content,
          createdAt: c.createdAt || new Date().toISOString(),
          likesCount: c.likes || 0,
          replies: (c.replies || []).map((r: any) => ({
            id: String(r.id || r._id),
            postId: decodedId,
            parentId: String(c.id || c._id),
            author: {
              id: r.authorId || "u-reply",
              name: r.authorName && r.authorName !== "উদ্যোক্তা" ? r.authorName : "টিম",
              avatar: r.authorAvatar || "/images/avatars/default.jpg",
              email: r.authorEmail || "",
            },
            content: r.comment || r.content,
            createdAt: r.createdAt || new Date().toISOString(),
            likesCount: r.likes || 0,
          })),
        }))
      );
    }
  } catch (err) {
    console.error("Could not fetch MongoDB comments:", err);
  }

  const mockComments = getMockComments(decodedId);
  return NextResponse.json(mockComments);
}

export async function handlePostCommentsPost(id: string, request: Request) {
  try {
    const decodedId = decodeURIComponent(id);
    const body = await request.json();
    await connectToDatabase();

    const headerName = request.headers.get("x-user-name")
      ? decodeURIComponent(request.headers.get("x-user-name")!)
      : "";
    const email = (request.headers.get("x-user-email") || getCookieValue(request, "bhbd_user_email") || "").toLowerCase().trim();
    const userId = request.headers.get("x-user-id") || "";
    const profile = email ? getUserProfile(email) : null;

    const rawName = body.authorName || body.author?.name || headerName || profile?.name || "";
    const authorName = rawName && rawName !== "উদ্যোক্তা" ? rawName.trim() : (email ? email.split("@")[0] : "ব্যবহারকারী");
    const commentContent = body.content || body.comment || "";
    const nowIso = new Date().toISOString();

    if (!commentContent.trim()) {
      return NextResponse.json({ message: "Content cannot be empty" }, { status: 400 });
    }

    if (await isUserBlocked(email, userId)) {
      return NextResponse.json(
        { message: "আপনার অ্যাকাউন্টটি অ্যাডমিন কর্তৃক সাময়িকভাবে ব্লক করা হয়েছে। আপনি মন্তব্য করতে পারবেন না।" },
        { status: 403 }
      );
    }

    const newComment = {
      id: `c-${Date.now()}`,
      authorId: userId,
      authorName,
      authorEmail: email,
      authorAvatar: profile?.avatar || "/images/avatars/default.jpg",
      authorRole: "ব্যবহারকারী",
      comment: commentContent,
      createdAt: nowIso,
      likes: 0,
      likedBy: [],
      replies: [],
    };

    const query = getQueryForId(decodedId);
    const item = await BusinessIdeaModel.findOne(query);

    if (item) {
      if (!Array.isArray(item.comments)) item.comments = [];
      item.comments.push(newComment);
      await item.save();

      const recipientEmail = item.authorEmail || item.postedBy?.email;
      const recipientId = item.userId || item.author?.id;

      createNotification({
        recipientUserId: recipientId,
        recipientUserEmail: recipientEmail,
        actorUserId: userId,
        actorUserEmail: email,
        type: "comment",
        title: "নতুন মন্তব্য পেয়েছেন 💬",
        message: `${authorName} আপনার "${item.title}" আইডিয়াটিতে মন্তব্য করেছেন: "${commentContent.slice(0, 45)}${commentContent.length > 45 ? '...' : ''}"`,
        postId: String(item.customId || item._id || decodedId),
      }).catch(() => {});

      return NextResponse.json({
        id: newComment.id,
        postId: decodedId,
        author: { id: userId || "me", name: authorName, avatar: newComment.authorAvatar },
        content: commentContent,
        createdAt: nowIso,
        likesCount: 0,
      });
    }
  } catch (err: any) {
    console.error("Error creating comment in MongoDB:", err);
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
  const email = (
    request.headers.get("x-user-email") ||
    getCookieValue(request, "bhbd_user_email") ||
    ""
  ).toLowerCase().trim();
  const userId = request.headers.get("x-user-id") || "";
  const identifier = email || userId;

  let reaction: "like" | "dislike" | null = null;
  let saved = false;

  try {
    await connectToDatabase();
    if (identifier) {
      const query = getQueryForId(decodedId);
      const item = await BusinessIdeaModel.findOne(query).lean();
      if (item) {
        const likedBy = Array.isArray(item.likedBy) ? item.likedBy : [];
        const dislikedBy = Array.isArray(item.dislikedBy) ? item.dislikedBy : [];
        if (likedBy.includes(identifier) || (email && likedBy.includes(email)) || (userId && likedBy.includes(userId))) {
          reaction = "like";
        } else if (dislikedBy.includes(identifier) || (email && dislikedBy.includes(email)) || (userId && dislikedBy.includes(userId))) {
          reaction = "dislike";
        }
      }

      if (email) {
        const isSaved = await SavedItemModel.findOne({ userEmail: email, postId: decodedId });
        saved = Boolean(isSaved);
      }
    }
  } catch (err) {
    console.error("Failed to check user reaction / saved state:", err);
  }

  return NextResponse.json({ reaction, saved });
}

export async function handlePostRelated(id: string) {
  const decodedId = decodeURIComponent(id);

  try {
    await connectToDatabase();
    const query = getQueryForId(decodedId);
    const current = await BusinessIdeaModel.findOne(query).lean();

    const filter: any = { status: "approved" };
    if (current?.category) {
      filter.category = current.category;
    }
    const related = await BusinessIdeaModel.find(filter).limit(5).lean();
    const filtered = related.filter((p: any) => String(p._id || p.id || p.customId) !== decodedId).slice(0, 4);
    if (filtered.length > 0) {
      return NextResponse.json(
        filtered.map((item: any) => {
          const districtName = getDistrictLabel(item.district) || item.district || "ঢাকা";
          const exactLoc =
            item.exactLocation ||
            (item.upazilaOrArea ? `${item.upazilaOrArea}, ${districtName}` : `${districtName}, Bangladesh`);
          const wholesalePrice = Number(item.wholesalePrice || 0);
          const retailPrice = Number(item.retailPrice || item.retailSellPrice || 0);

          return {
            id: String(item._id || item.id || item.customId),
            title: item.title,
            category: item.category,
            division: item.division || "Dhaka",
            district: districtName,
            area: item.upazilaOrArea || item.area || districtName,
            exactLocation: exactLoc,
            wholesalePrice,
            retailPrice,
            retailSellPrice: retailPrice,
            profitPotential: item.profitPotential || "medium",
            description: item.description,
            image: item.image || "/images/ideas/default.jpg",
            tags: item.tags,
            author: {
              name: item.postedBy?.name || "ব্যবসা বন্ধু",
              avatar: "/images/avatars/default.jpg",
            },
            likesCount: item.likes || 0,
            dislikesCount: item.dislikes || 0,
            viewsCount: item.viewsCount || 15,
            commentsCount: item.comments?.length || 0,
            createdAt: item.createdAt || new Date().toISOString(),
          };
        })
      );
    }
  } catch (e) {
    console.error("Related posts error:", e);
  }

  const related = MOCK_POSTS.filter((p) => p.id !== decodedId).slice(0, 4);
  return NextResponse.json(related);
}
