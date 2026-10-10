import { NextResponse } from "next/server";
import { getUserProfile, saveUserProfile } from "@/lib/user-profile-store";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const email = request.headers.get("x-user-email") || undefined;
  const id = request.headers.get("x-user-id") || undefined;

  const existing = getUserProfile(email) || getUserProfile(id) || getUserProfile();

  if (existing) {
    return NextResponse.json({ user: existing });
  }

  // Fallback if not found yet
  const user = {
    id: id || `u-${Date.now()}`,
    name: email ? email.split("@")[0] : "উদ্যোক্তা",
    email: email || "user@example.com",
    role: "user" as const,
    createdAt: new Date().toISOString(),
  };

  return NextResponse.json({ user });
}

export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const emailHeader = request.headers.get("x-user-email");
    const idHeader = request.headers.get("x-user-id");

    const email = body.email || emailHeader || "user@example.com";
    const id = body.id || idHeader;

    const saved = saveUserProfile({
      ...body,
      id,
      email,
    });

    return NextResponse.json({ user: saved });
  } catch (err: any) {
    return NextResponse.json({ message: err.message || "ত্রুটি হয়েছে।" }, { status: 400 });
  }
}
