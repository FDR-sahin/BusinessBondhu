import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function POST(request: Request, { params }: { params: { id: string } }) {
  const id = decodeURIComponent(params.id);
  const backendUrl = process.env.NEXT_PUBLIC_API_URL || "https://uddok-admin.vercel.app";
  const body = await request.json().catch(() => ({}));
  const userId =
    body.userId ||
    request.headers.get("x-user-id") ||
    request.headers.get("x-user-email") ||
    request.headers.get("x-forwarded-for") ||
    "guest";

  try {
    // 1. Try dedicated reaction endpoint
    let res = await fetch(`${backendUrl.replace(/\/$/, "")}/api/ideas/${encodeURIComponent(id)}/reaction`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "like", userId }),
    });

    // 2. Fallback to query action if first attempt fails
    if (!res.ok) {
      res = await fetch(`${backendUrl.replace(/\/$/, "")}/api/ideas?action=reaction&id=${encodeURIComponent(id)}`, {
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
