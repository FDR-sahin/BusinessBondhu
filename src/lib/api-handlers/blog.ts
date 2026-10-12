import { NextResponse } from "next/server";
import mongoose from "mongoose";
import { connectToDatabase } from "@/lib/db";
import { BlogModel } from "@/lib/models";
import { createNotification } from "@/lib/notifications";
import { isUserBlocked } from "@/lib/user-block-check";
import { DETAILED_BLOG_POSTS } from "@/lib/blog-data";
import {
  getUserBlogs,
  saveUserBlog,
  deleteUserBlog,
  findUserBlog,
  type UserStoredBlog,
} from "@/lib/user-blogs-store";
import { getUserProfile, getCookieValue } from "@/lib/user-profile-store";

export async function handleBlogList(request: Request) {
  const { searchParams } = new URL(request.url);
  const category = searchParams.get("category");
  const page = parseInt(searchParams.get("page") || "1", 10);
  const limit = parseInt(searchParams.get("limit") || "9", 10);

  let dbBlogs: any[] = [];

  try {
    await connectToDatabase();
    const query: any = { status: "approved" };
    if (category && category !== "all") {
      query.category = category;
    }
    const list = await BlogModel.find(query).sort({ _id: -1 }).lean();
    if (Array.isArray(list) && list.length > 0) {
      dbBlogs = list.map((item: any) => ({
        id: String(item._id || item.id || item.customId),
        _id: String(item._id || item.id || item.customId),
        slug: item.slug || (item.title || "").toLowerCase().replace(/\s+/g, "-"),
        title: item.title,
        category: item.category,
        excerpt: item.excerpt,
        content: item.content,
        coverImage: item.coverImage || item.image || "/images/blog/default.jpg",
        publishedAt: item.createdAt || new Date().toISOString(),
        readingTime: item.readingTime || 5,
        readTime: item.readTime || `${item.readingTime || 5} মিনিট`,
        author: {
          name: typeof item.author === "string" ? item.author : item.author?.name || "Business Hub BD Team",
          role: item.authorTitle || "Founder & CEO, Regards Tech",
          avatar: "/images/avatars/default.jpg",
        },
        likesCount: item.likes || 0,
        commentsCount: Array.isArray(item.comments) ? item.comments.length : 0,
        status: "approved",
      }));
    }
  } catch (err) {
    console.error("Error loading blogs from MongoDB:", err);
  }

  const existingIds = new Set(dbBlogs.map((b) => String(b.id)));
  const existingTitles = new Set(dbBlogs.map((b) => (b.title || "").trim().toLowerCase()));

  const fallback = DETAILED_BLOG_POSTS.filter(
    (b) => !existingIds.has(String(b.id)) && !existingTitles.has((b.title || "").trim().toLowerCase())
  ).map((p) => ({
    ...p,
    status: "approved",
  }));

  let combined = dbBlogs.length > 0 ? dbBlogs : fallback;
  if (category && category !== "all") {
    combined = combined.filter((b) => b.category === category);
  }

  const total = combined.length;
  const totalPages = Math.ceil(total / limit);
  const start = (page - 1) * limit;
  const items = combined.slice(start, start + limit);

  return NextResponse.json({
    items,
    total,
    page,
    limit,
    totalPages,
  });
}

export async function handleBlogCreate(request: Request) {
  try {
    const body = await request.json();
    await connectToDatabase();

    const title = (body.title || "").trim();
    const userId = body.userId || request.headers.get("x-user-id") || "";
    const userEmail = (
      body.authorEmail ||
      request.headers.get("x-user-email") ||
      getCookieValue(request, "bhbd_user_email") ||
      ""
    ).toLowerCase().trim();

    const authorName = (
      body.authorName ||
      body.author?.name ||
      request.headers.get("x-user-name") ||
      (userEmail ? userEmail.split("@")[0] : "উদ্যোক্তা ও লেখক")
    ).trim();

    if (!title) {
      return NextResponse.json({ success: false, message: "ব্লগের শিরোনাম আবশ্যক" }, { status: 400 });
    }

    if (await isUserBlocked(userEmail, userId)) {
      return NextResponse.json(
        { success: false, message: "আপনার অ্যাকাউন্টটি অ্যাডমিন কর্তৃক সাময়িকভাবে ব্লক করা হয়েছে। আপনি নতুন ব্লগ পোস্ট করতে পারবেন না।" },
        { status: 403 }
      );
    }

    const readingTime = Number(body.readingTime || Math.max(2, Math.ceil((body.content || "").length / 500)));
    const readTime = body.readTime || `${readingTime} মিনিট`;
    const cleanSlug =
      (body.slug || title)
        .toLowerCase()
        .replace(/[^a-zA-Z0-9\u0980-\u09FF]+/g, "-")
        .replace(/^-|-$/g, "") || `blog-${Date.now()}`;

    const newId = `blog-${Date.now()}`;
    const status = body.status === "draft" ? "pending" : "pending"; // user created blogs go to pending approval

    const created = await BlogModel.create({
      customId: newId,
      id: newId,
      slug: cleanSlug,
      title,
      category: body.category || "ব্যবসা শুরু",
      excerpt: body.excerpt || (body.content || "").slice(0, 160).trim(),
      content: body.content || "",
      coverImage: body.coverImage || body.image || "/images/blog/default.jpg",
      image: body.coverImage || body.image || "/images/blog/default.jpg",
      readingTime,
      readTime,
      author: authorName,
      authorTitle: body.authorTitle || "উদ্যোক্তা ও লেখক",
      userId,
      authorEmail: userEmail,
      status,
      likes: 0,
      comments: [],
    });

    const resultId = String(created._id || created.id || created.customId);

    return NextResponse.json(
      {
        success: true,
        message: "ব্লগটি সফলভাবে অ্যাডমিন অনুমোদনের জন্য জমা দেওয়া হয়েছে! অ্যাডমিন অ্যাপ্রুভ করার পর তা মূল সাইটে লাইভ হবে।",
        blog: { ...created.toObject(), id: resultId, _id: resultId },
        id: resultId,
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("Failed to create blog in MongoDB:", error);
    return NextResponse.json(
      { success: false, message: error?.message || "ব্লগ তৈরি করতে সমস্যা হয়েছে" },
      { status: 500 }
    );
  }
}

export async function handleBlogFeatured() {
  try {
    await connectToDatabase();
    const featured = await BlogModel.findOne({ status: "approved" }).sort({ likes: -1, _id: -1 }).lean();
    if (featured) {
      return NextResponse.json({
        id: String(featured._id || featured.id || featured.customId),
        title: featured.title,
        slug: featured.slug,
        category: featured.category,
        excerpt: featured.excerpt,
        content: featured.content,
        coverImage: featured.coverImage || featured.image || "/images/blog/default.jpg",
        publishedAt: featured.createdAt || new Date().toISOString(),
        readingTime: featured.readingTime || 5,
        readTime: featured.readTime || "৫ মিনিট",
        author: {
          name: typeof featured.author === "string" ? featured.author : "উদ্যোক্তা",
          role: featured.authorTitle || "উদ্যোক্তা ও লেখক",
          avatar: "/images/avatars/default.jpg",
        },
      });
    }
  } catch (e) {
    console.error("Featured blog error:", e);
  }
  return NextResponse.json(DETAILED_BLOG_POSTS[0] || null);
}

export async function handleBlogSlug(slug: string) {
  const decodedSlug = decodeURIComponent(slug);

  try {
    await connectToDatabase();
    const query: any = {
      $or: [
        { slug: slug },
        { slug: decodedSlug },
        { id: slug },
        { id: decodedSlug },
        { customId: slug },
        { customId: decodedSlug },
      ],
    };
    if (mongoose.Types.ObjectId.isValid(decodedSlug)) {
      query.$or.push({ _id: decodedSlug });
    }

    const blog = await BlogModel.findOne(query).lean();
    if (blog) {
      return NextResponse.json({
        id: String(blog._id || blog.id || blog.customId),
        title: blog.title,
        slug: blog.slug,
        category: blog.category,
        excerpt: blog.excerpt,
        content: blog.content,
        coverImage: blog.coverImage || blog.image || "/images/blog/default.jpg",
        publishedAt: blog.createdAt || new Date().toISOString(),
        readingTime: blog.readingTime || 5,
        readTime: blog.readTime || `${blog.readingTime || 5} মিনিট`,
        author: {
          name: typeof blog.author === "string" ? blog.author : blog.author?.name || "উদ্যোক্তা",
          role: blog.authorTitle || "উদ্যোক্তা ও লেখক",
          avatar: "/images/avatars/default.jpg",
        },
        commentsEnabled: true,
      });
    }
  } catch (err) {
    console.error("Error looking up blog slug in MongoDB:", err);
  }

  // Fallback to DETAILED_BLOG_POSTS
  const fallback = DETAILED_BLOG_POSTS.find(
    (b) => b.slug === slug || b.slug === decodedSlug || b.id === slug || b.id === decodedSlug
  );

  if (fallback) {
    return NextResponse.json({
      ...fallback,
      commentsEnabled: true,
    });
  }

  return NextResponse.json({ message: "Blog post not found" }, { status: 404 });
}

export async function handleBlogDelete(id: string, request?: Request) {
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
  } catch (err: any) {
    console.error("MongoDB blog delete error:", err);
    return NextResponse.json({ success: false, message: err.message }, { status: 500 });
  }
}

export async function handleBlogCommentsGet(slugOrId: string, request: Request) {
  const origin = request.headers.get("origin") || "*";
  const decoded = decodeURIComponent(slugOrId);

  try {
    await connectToDatabase();
    const query: any = {
      $or: [{ slug: decoded }, { id: decoded }, { customId: decoded }],
    };
    if (mongoose.Types.ObjectId.isValid(decoded)) {
      query.$or.push({ _id: decoded });
    }
    const blog = await BlogModel.findOne(query).lean();
    if (blog && Array.isArray(blog.comments)) {
      const formatted = blog.comments.map((c: any) => ({
        id: String(c.id || c._id),
        postId: slugOrId,
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
          postId: slugOrId,
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
      }));

      return NextResponse.json(formatted, {
        headers: {
          "Access-Control-Allow-Origin": origin,
          "Access-Control-Allow-Credentials": "true",
          "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
          "Access-Control-Allow-Headers": "Content-Type, Authorization",
        },
      });
    }
  } catch (e) {
    console.error("Error fetching blog comments from MongoDB:", e);
  }

  return NextResponse.json([], {
    headers: {
      "Access-Control-Allow-Origin": origin,
      "Access-Control-Allow-Credentials": "true",
      "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type, Authorization",
    },
  });
}

export async function handleBlogCommentsPost(slugOrId: string, request: Request) {
  const origin = request.headers.get("origin") || "*";
  try {
    const decoded = decodeURIComponent(slugOrId);
    const body = await request.json();
    await connectToDatabase();

    const headerName = request.headers.get("x-user-name")
      ? decodeURIComponent(request.headers.get("x-user-name")!)
      : "";
    const email = (
      request.headers.get("x-user-email") ||
      getCookieValue(request, "bhbd_user_email") ||
      ""
    ).toLowerCase().trim();
    const userId = request.headers.get("x-user-id") || "";
    const profile = email ? getUserProfile(email) : null;

    const rawName = body.authorName || body.author?.name || headerName || profile?.name || "";
    const authorName = rawName && rawName !== "উদ্যোক্তা" ? rawName.trim() : (email ? email.split("@")[0] : "ব্যবহারকারী");
    const commentContent = body.content || body.comment || "";
    const nowIso = new Date().toISOString();

    if (!commentContent.trim()) {
      return NextResponse.json({ message: "মন্তব্য খালি রাখা যাবে না" }, { status: 400 });
    }

    if (await isUserBlocked(email, userId)) {
      return NextResponse.json(
        { message: "আপনার অ্যাকাউন্টটি অ্যাডমিন কর্তৃক সাময়িকভাবে ব্লক করা হয়েছে। আপনি মন্তব্য করতে পারবেন না।" },
        { status: 403 }
      );
    }

    const query: any = {
      $or: [{ slug: decoded }, { id: decoded }, { customId: decoded }],
    };
    if (mongoose.Types.ObjectId.isValid(decoded)) {
      query.$or.push({ _id: decoded });
    }

    const blog = await BlogModel.findOne(query);
    if (!blog) {
      return NextResponse.json({ message: "ব্লগ পাওয়া যায়নি" }, { status: 404 });
    }

    if (!Array.isArray(blog.comments)) blog.comments = [];

    // Check if reply to parent comment
    if (body.parentId) {
      const parent = blog.comments.find((c: any) => String(c.id || c._id) === String(body.parentId));
      if (parent) {
        if (!Array.isArray(parent.replies)) parent.replies = [];
        const replyObj = {
          id: `r-${Date.now()}`,
          authorId: userId || "u-guest",
          authorName,
          authorEmail: email,
          authorAvatar: profile?.avatar || "/images/avatars/default.jpg",
          authorRole: "ব্যবহারকারী",
          comment: commentContent,
          createdAt: nowIso,
          likes: 0,
          likedBy: [],
        };
        parent.replies.push(replyObj);
        await blog.save();

        createNotification({
          recipientUserId: parent.authorId,
          recipientUserEmail: parent.authorEmail,
          actorUserId: userId,
          actorUserEmail: email,
          type: "reply",
          title: "আপনার মন্তব্যের উত্তর দেওয়া হয়েছে 💬",
          message: `${authorName} আপনার মন্তব্যে উত্তর দিয়েছেন: "${commentContent.slice(0, 45)}${commentContent.length > 45 ? '...' : ''}"`,
          postId: blog.slug || String(blog.customId || blog._id),
        }).catch(() => {});

        return NextResponse.json({
          id: replyObj.id,
          postId: slugOrId,
          parentId: body.parentId,
          author: { id: userId || "me", name: authorName, avatar: replyObj.authorAvatar },
          content: commentContent,
          createdAt: nowIso,
          likesCount: 0,
        }, {
          headers: {
            "Access-Control-Allow-Origin": origin,
            "Access-Control-Allow-Credentials": "true",
          },
        });
      }
    }

    const commentObj = {
      id: `c-${Date.now()}`,
      authorId: userId || "u-guest",
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

    blog.comments.push(commentObj);
    await blog.save();

    createNotification({
      recipientUserId: blog.userId,
      recipientUserEmail: blog.authorEmail,
      actorUserId: userId,
      actorUserEmail: email,
      type: "comment",
      title: "ব্লগে নতুন মন্তব্য পেয়েছেন 💬",
      message: `${authorName} আপনার "${blog.title}" ব্লগে মন্তব্য করেছেন: "${commentContent.slice(0, 45)}${commentContent.length > 45 ? '...' : ''}"`,
      postId: blog.slug || String(blog.customId || blog._id),
    }).catch(() => {});

    return NextResponse.json({
      id: commentObj.id,
      postId: slugOrId,
      author: { id: userId || "me", name: authorName, avatar: commentObj.authorAvatar },
      content: commentContent,
      createdAt: nowIso,
      likesCount: 0,
      replies: [],
    }, {
      headers: {
        "Access-Control-Allow-Origin": origin,
        "Access-Control-Allow-Credentials": "true",
      },
    });
  } catch (err: any) {
    console.error("Error creating blog comment in MongoDB:", err);
    return NextResponse.json({ success: false, message: err.message }, { status: 500 });
  }
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

  try {
    await connectToDatabase();
    const related = await BlogModel.find({
      status: "approved",
      slug: { $ne: decodedSlug },
    }).limit(3).lean();

    if (Array.isArray(related) && related.length > 0) {
      return NextResponse.json(
        related.map((b: any) => ({
          id: String(b._id || b.id || b.customId),
          title: b.title,
          slug: b.slug,
          category: b.category,
          excerpt: b.excerpt,
          coverImage: b.coverImage || b.image || "/images/blog/default.jpg",
          author: {
            name: typeof b.author === "string" ? b.author : "Business Hub BD Team",
            avatar: "/images/avatars/default.jpg",
          },
          publishedAt: b.createdAt || new Date().toISOString(),
          readingTime: b.readingTime || 5,
        }))
      );
    }
  } catch (e) {
    console.error("Related blogs error:", e);
  }

  const fallback = DETAILED_BLOG_POSTS.filter(
    (b) => b.slug !== slug && b.slug !== decodedSlug && b.id !== slug
  ).slice(0, 3);

  return NextResponse.json(fallback);
}
