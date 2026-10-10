import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET(request: Request, { params }: { params: { id: string } }) {
  const id = decodeURIComponent(params.id);
  const backendUrl = process.env.NEXT_PUBLIC_API_URL || "https://uddok-admin.vercel.app";
  const userId =
    request.headers.get("x-user-id") ||
    request.headers.get("x-user-email") ||
    request.headers.get("x-forwarded-for") ||
    "guest";

  try {
    // 1. Try dedicated reaction endpoint
    const reactRes = await fetch(
      `${backendUrl.replace(/\/$/, "")}/api/ideas/${encodeURIComponent(id)}/reaction?userId=${encodeURIComponent(userId)}`,
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

    // 2. Fallback: inspect idea document
    const res = await fetch(`${backendUrl.replace(/\/$/, "")}/api/ideas?id=${encodeURIComponent(id)}`, {
      cache: "no-store",
    });
    if (res.ok) {
      const data = await res.json();
      const list = Array.isArray(data.data) ? data.data : [data.data];
      const found = list.find((i: any) => String(i.id || i._id) === id);
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
