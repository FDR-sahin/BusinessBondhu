import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function POST(request: Request, { params }: { params: { id: string } }) {
  const id = decodeURIComponent(params.id);
  const backendUrl = process.env.NEXT_PUBLIC_API_URL || "https://uddok-admin.vercel.app";

  // Forward reaction to backend
  try {
    const res = await fetch(`${backendUrl.replace(/\/$/, "")}/api/ideas/${encodeURIComponent(id)}/reaction`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "like" }),
    });
    if (res.ok) {
      const data = await res.json();
      return NextResponse.json(data);
    }
  } catch (err) {
    console.error("Failed to forward like reaction:", err);
  }

  return NextResponse.json({ success: true, message: "Reaction updated" });
}
