import { NextResponse } from "next/server";
import mongoose from "mongoose";
import { connectToDatabase } from "@/lib/db";
import { BusinessIdeaModel, BlogModel } from "@/lib/models";

export async function handleCommentDelete(commentId: string, request?: Request) {
  try {
    const cleanId = decodeURIComponent(commentId || "").trim();
    if (!cleanId || cleanId === "undefined") {
      return NextResponse.json({ success: false, message: "Comment ID is required" }, { status: 400 });
    }

    await connectToDatabase();

    const isObjectId = mongoose.Types.ObjectId.isValid(cleanId) && /^[0-9a-fA-F]{24}$/.test(cleanId);
    const queryConditions: any[] = [
      { "comments.id": cleanId },
      { "comments.replies.id": cleanId },
    ];
    if (isObjectId) {
      const objId = new mongoose.Types.ObjectId(cleanId);
      queryConditions.push({ "comments._id": objId });
      queryConditions.push({ "comments.replies._id": objId });
    }

    let deleted = false;

    // 1. Search in BusinessIdeaModel
    const ideas = await BusinessIdeaModel.find({ $or: queryConditions });

    for (const idea of ideas) {
      if (Array.isArray(idea.comments)) {
        const initialCount = idea.comments.length;
        idea.comments = idea.comments.filter(
          (c: any) => String(c.id) !== cleanId && String(c._id) !== cleanId
        );

        if (idea.comments.length !== initialCount) {
          deleted = true;
        } else {
          for (const c of idea.comments) {
            if (Array.isArray(c.replies)) {
              const rCount = c.replies.length;
              c.replies = c.replies.filter(
                (r: any) => String(r.id) !== cleanId && String(r._id) !== cleanId
              );
              if (c.replies.length !== rCount) {
                deleted = true;
              }
            }
          }
        }

        if (deleted) {
          await idea.save();
          return NextResponse.json({
            success: true,
            message: "মন্তব্য সফলভাবে মুছে ফেলা হয়েছে",
          });
        }
      }
    }

    // 2. Search in BlogModel
    const blogs = await BlogModel.find({ $or: queryConditions });

    for (const blog of blogs) {
      if (Array.isArray(blog.comments)) {
        const initialCount = blog.comments.length;
        blog.comments = blog.comments.filter(
          (c: any) => String(c.id) !== cleanId && String(c._id) !== cleanId
        );

        if (blog.comments.length !== initialCount) {
          deleted = true;
        } else {
          for (const c of blog.comments) {
            if (Array.isArray(c.replies)) {
              const rCount = c.replies.length;
              c.replies = c.replies.filter(
                (r: any) => String(r.id) !== cleanId && String(r._id) !== cleanId
              );
              if (c.replies.length !== rCount) {
                deleted = true;
              }
            }
          }
        }

        if (deleted) {
          await blog.save();
          return NextResponse.json({
            success: true,
            message: "মন্তব্য সফলভাবে মুছে ফেলা হয়েছে",
          });
        }
      }
    }

    // 3. Fallback scan: check all docs that have comments
    const allIdeas = await BusinessIdeaModel.find({ "comments.0": { $exists: true } });
    for (const idea of allIdeas) {
      const initialCount = idea.comments.length;
      idea.comments = idea.comments.filter(
        (c: any) => String(c.id) !== cleanId && String(c._id) !== cleanId
      );
      if (idea.comments.length !== initialCount) {
        await idea.save();
        return NextResponse.json({ success: true, message: "মন্তব্য সফলভাবে মুছে ফেলা হয়েছে" });
      }
      for (const c of idea.comments) {
        if (Array.isArray(c.replies)) {
          const rCount = c.replies.length;
          c.replies = c.replies.filter(
            (r: any) => String(r.id) !== cleanId && String(r._id) !== cleanId
          );
          if (c.replies.length !== rCount) {
            await idea.save();
            return NextResponse.json({ success: true, message: "মন্তব্য সফলভাবে মুছে ফেলা হয়েছে" });
          }
        }
      }
    }

    const allBlogs = await BlogModel.find({ "comments.0": { $exists: true } });
    for (const blog of allBlogs) {
      const initialCount = blog.comments.length;
      blog.comments = blog.comments.filter(
        (c: any) => String(c.id) !== cleanId && String(c._id) !== cleanId
      );
      if (blog.comments.length !== initialCount) {
        await blog.save();
        return NextResponse.json({ success: true, message: "মন্তব্য সফলভাবে মুছে ফেলা হয়েছে" });
      }
      for (const c of blog.comments) {
        if (Array.isArray(c.replies)) {
          const rCount = c.replies.length;
          c.replies = c.replies.filter(
            (r: any) => String(r.id) !== cleanId && String(r._id) !== cleanId
          );
          if (c.replies.length !== rCount) {
            await blog.save();
            return NextResponse.json({ success: true, message: "মন্তব্য সফলভাবে মুছে ফেলা হয়েছে" });
          }
        }
      }
    }

    return NextResponse.json({
      success: true,
      message: "মন্তব্য সফলভাবে মুছে ফেলা হয়েছে",
    });
  } catch (error: any) {
    console.error("Error deleting comment:", error);
    return NextResponse.json(
      { success: false, message: error?.message || "মন্তব্য মুছতে সমস্যা হয়েছে" },
      { status: 500 }
    );
  }
}

export async function handleCommentLike(commentId: string, request: Request) {
  try {
    const cleanId = decodeURIComponent(commentId || "").trim();
    if (!cleanId || cleanId === "undefined") {
      return NextResponse.json({ success: false, message: "Comment ID required" }, { status: 400 });
    }

    await connectToDatabase();
    const userId = request.headers.get("x-user-id") || request.headers.get("x-user-email") || "guest";

    const isObjectId = mongoose.Types.ObjectId.isValid(cleanId) && /^[0-9a-fA-F]{24}$/.test(cleanId);
    const queryConditions: any[] = [
      { "comments.id": cleanId },
      { "comments.replies.id": cleanId },
    ];
    if (isObjectId) {
      const objId = new mongoose.Types.ObjectId(cleanId);
      queryConditions.push({ "comments._id": objId });
      queryConditions.push({ "comments.replies._id": objId });
    }

    // 1. Try ideas
    const idea = await BusinessIdeaModel.findOne({ $or: queryConditions });

    if (idea && Array.isArray(idea.comments)) {
      for (const c of idea.comments) {
        if (String(c.id) === cleanId || String(c._id) === cleanId) {
          if (!Array.isArray(c.likedBy)) c.likedBy = [];
          const hasLiked = c.likedBy.includes(userId);
          if (hasLiked) {
            c.likedBy = c.likedBy.filter((u: string) => u !== userId);
            c.likes = Math.max(0, (c.likes || 1) - 1);
          } else {
            c.likedBy.push(userId);
            c.likes = (c.likes || 0) + 1;
          }
          await idea.save();
          return NextResponse.json({ success: true, likesCount: c.likes, likedByMe: !hasLiked });
        }
        if (Array.isArray(c.replies)) {
          for (const r of c.replies) {
            if (String(r.id) === cleanId || String(r._id) === cleanId) {
              if (!Array.isArray(r.likedBy)) r.likedBy = [];
              const hasLiked = r.likedBy.includes(userId);
              if (hasLiked) {
                r.likedBy = r.likedBy.filter((u: string) => u !== userId);
                r.likes = Math.max(0, (r.likes || 1) - 1);
              } else {
                r.likedBy.push(userId);
                r.likes = (r.likes || 0) + 1;
              }
              await idea.save();
              return NextResponse.json({ success: true, likesCount: r.likes, likedByMe: !hasLiked });
            }
          }
        }
      }
    }

    // 2. Try blogs
    const blog = await BlogModel.findOne({ $or: queryConditions });

    if (blog && Array.isArray(blog.comments)) {
      for (const c of blog.comments) {
        if (String(c.id) === cleanId || String(c._id) === cleanId) {
          if (!Array.isArray(c.likedBy)) c.likedBy = [];
          const hasLiked = c.likedBy.includes(userId);
          if (hasLiked) {
            c.likedBy = c.likedBy.filter((u: string) => u !== userId);
            c.likes = Math.max(0, (c.likes || 1) - 1);
          } else {
            c.likedBy.push(userId);
            c.likes = (c.likes || 0) + 1;
          }
          await blog.save();
          return NextResponse.json({ success: true, likesCount: c.likes, likedByMe: !hasLiked });
        }
        if (Array.isArray(c.replies)) {
          for (const r of c.replies) {
            if (String(r.id) === cleanId || String(r._id) === cleanId) {
              if (!Array.isArray(r.likedBy)) r.likedBy = [];
              const hasLiked = r.likedBy.includes(userId);
              if (hasLiked) {
                r.likedBy = r.likedBy.filter((u: string) => u !== userId);
                r.likes = Math.max(0, (r.likes || 1) - 1);
              } else {
                r.likedBy.push(userId);
                r.likes = (r.likes || 0) + 1;
              }
              await blog.save();
              return NextResponse.json({ success: true, likesCount: r.likes, likedByMe: !hasLiked });
            }
          }
        }
      }
    }

    return NextResponse.json({ success: true, likesCount: 0, likedByMe: false });
  } catch (error: any) {
    console.error("Error toggling comment like:", error);
    return NextResponse.json({ success: false, error: error?.message }, { status: 500 });
  }
}
