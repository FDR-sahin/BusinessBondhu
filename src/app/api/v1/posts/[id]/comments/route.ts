import { NextResponse } from "next/server";
import { getMockComments } from "@/lib/mock-data";

export const dynamic = "force-dynamic";

export async function GET(request: Request, { params }: { params: { id: string } }) {
  const id = decodeURIComponent(params.id);
  const backendUrl = process.env.NEXT_PUBLIC_API_URL || "https://uddok-admin.vercel.app";

  try {
    const res = await fetch(`${backendUrl.replace(/\/$/, "")}/api/ideas?id=${encodeURIComponent(id)}`, {
      cache: "no-store",
    });
    if (res.ok) {
      const data = await res.json();
      const list = Array.isArray(data.data) ? data.data : [data.data];
      const found = list.find((i: any) => String(i.id || i._id) === id);
      if (found && Array.isArray(found.comments)) {
        return NextResponse.json(
          found.comments.map((c: any) => ({
            id: String(c.id || c._id),
            postId: id,
            author: {
              id: "u-commenter",
              name: c.authorName || "উদ্যোক্তা",
            },
            content: c.comment,
            createdAt: c.createdAt || new Date().toISOString(),
            likesCount: c.likes || 0,
            replies: (c.replies || []).map((r: any) => ({
              id: String(r.id || r._id),
              postId: id,
              parentId: String(c.id || c._id),
              author: { id: "u-reply", name: r.authorName || "টিম" },
              content: r.comment,
              createdAt: r.createdAt || new Date().toISOString(),
              likesCount: r.likes || 0,
            })),
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

    const res = await fetch(`${backendUrl.replace(/\/$/, "")}/api/ideas/${encodeURIComponent(id)}/comments`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        authorName: body.authorName || "উদ্যোক্তা",
        comment: body.content,
      }),
    });

    if (res.ok) {
      const saved = await res.json();
      return NextResponse.json({
        id: String(saved.data?.id || saved.data?._id || `c-${Date.now()}`),
        postId: id,
        author: { id: "me", name: body.authorName || "উদ্যোক্তা" },
        content: body.content,
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
