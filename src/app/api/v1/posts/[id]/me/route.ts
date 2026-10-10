import { NextResponse } from "next/server";

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
      if (found) {
        // Look up reaction based on IP or anonymous session
        const ip = request.headers.get("x-forwarded-for") || "anonymous";
        const hasLiked = Array.isArray(found.likedBy) && found.likedBy.includes(ip);
        const hasDisliked = Array.isArray(found.dislikedBy) && found.dislikedBy.includes(ip);

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
