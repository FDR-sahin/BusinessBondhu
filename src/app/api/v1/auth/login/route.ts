import { NextResponse } from "next/server";
import { getUserProfile, saveUserProfile } from "@/lib/user-profile-store";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const email = (body.email || "").trim().toLowerCase();

    // Look up existing profile by email first
    let user = getUserProfile(email);

    if (!user) {
      const fallbackName = email ? email.split("@")[0] : "ব্যবহারকারী";
      user = saveUserProfile({
        email,
        name: fallbackName,
        role: "user",
      });
    }

    return NextResponse.json({
      user,
      accessToken: `token-${Date.now()}`,
      refreshToken: `rtoken-${Date.now()}`,
    });
  } catch (err: any) {
    return NextResponse.json(
      { message: err.message || "লগইন করতে সমস্যা হয়েছে।" },
      { status: 400 }
    );
  }
}
