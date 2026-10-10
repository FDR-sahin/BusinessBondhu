import { NextResponse } from "next/server";
import { getMockComments } from "@/lib/mock-data";

export const dynamic = "force-dynamic";

export async function GET(request: Request, { params }: { params: { id: string } }) {
  const id = decodeURIComponent(params.id);
  const backendUrl = process.env.NEXT_PUBLIC_API_URL || "https://uddok-admin.vercel.app";

  try {
    // 1. Try dedicated comments endpoint
    let res = await fetch(`${backendUrl.replace(/\/$/, "")}/api/ideas/${encodeURIComponent(id)}/comments`, {
      cache: "no-store",
    });

    // 2. Fallback to query action comments
    if (!res.ok) {
      res = await fetch(`${backendUrl.replace(/\/$/, "")}/api/ideas?action=comments&id=${encodeURIComponent(id)}`, {
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
            postId: id,
            author: {
              id: "u-commenter",
              name: c.authorName || "উদ্যোক্তা",
            },
            content: c.comment || c.content,
            createdAt: c.createdAt || new Date().toISOString(),
            likesCount: c.likes || 0,
            replies: (c.replies || []).map((r: any) => ({
              id: String(r.id || r._id),
              postId: id,
              parentId: String(c.id || c._id),
              author: { id: "u-reply", name: r.authorName || "টিম" },
              content: r.comment || r.content,
              createdAt: r.createdAt || new Date().toISOString(),
              likesCount: r.likes || 0,
            })),
          }))
        );
      }
    }

    // 3. Fallback: query single idea by id and check its comments array
    const ideaRes = await fetch(`${backendUrl.replace(/\/$/, "")}/api/ideas?id=${encodeURIComponent(id)}`, {
      cache: "no-store",
    });
    if (ideaRes.ok) {
      const ideaData = await ideaRes.json();
      const list = Array.isArray(ideaData.data) ? ideaData.data : [ideaData.data];
      const found = list.find((i: any) => String(i.id || i._id) === id);
      if (found && Array.isArray(found.comments) && found.comments.length > 0) {
        return NextResponse.json(
          found.comments.map((c: any) => ({
            id: String(c.id || c._id),
            postId: id,
            author: {
              id: "u-commenter",
              name: c.authorName || "উদ্যোক্তা",
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

  const comments = getMockComments(id);
  return NextResponse.json(comments);
}

export async function POST(request: Request, { params }: { params: { id: string } }) {
  try {
    const id = decodeURIComponent(params.id);
    const body = await request.json();
    const backendUrl = process.env.NEXT_PUBLIC_API_URL || "https://uddok-admin.vercel.app";

    const authorName =
      body.authorName ||
      body.author?.name ||
      request.headers.get("x-user-name") ||
      "উদ্যোক্তা";
    const commentContent = body.content || body.comment || "";

    if (!commentContent.trim()) {
      return NextResponse.json({ message: "Content cannot be empty" }, { status: 400 });
    }

    // 1. Try dedicated comments endpoint
    let res = await fetch(`${backendUrl.replace(/\/$/, "")}/api/ideas/${encodeURIComponent(id)}/comments`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        authorName,
        comment: commentContent,
      }),
    });

    // 2. Fallback to query action comments
    if (!res.ok) {
      res = await fetch(`${backendUrl.replace(/\/$/, "")}/api/ideas?action=comments&id=${encodeURIComponent(id)}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          authorName,
          comment: commentContent,
        }),
      });
    }

    if (res.ok) {
      const saved = await res.json();
      return NextResponse.json({
        id: String(saved.data?.id || saved.data?._id || `c-${Date.now()}`),
        postId: id,
        author: { id: "me", name: authorName },
        content: commentContent,
        createdAt: new Date().toISOString(),
        likesCount: 0,
      });
    }
  } catch (err) {
    console.error("Error creating comment:", err);
  }

  return NextResponse.json({
    id: `c-${Date.now()}`,
    postId: params.id,
    author: { id: "me", name: "উদ্যোক্তা" },
    content: "মন্তব্য যোগ করা হয়েছে",
    createdAt: new Date().toISOString(),
    likesCount: 0,
  });
}
