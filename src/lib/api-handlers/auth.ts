import { NextResponse } from "next/server";
import { getUserProfile, saveUserProfile } from "@/lib/user-profile-store";

export async function handleAuthSignup(request: Request) {
  try {
    const body = await request.json();
    const rawName = (body.name || "").trim();
    const email = (body.email || "").trim().toLowerCase();
    const name = rawName || (email ? email.split("@")[0] : "ব্যবহারকারী");

    const savedUser = saveUserProfile({
      name,
      email,
      division: body.division || "",
      district: body.district || "",
      area: body.area || "",
      role: "user",
    });

    return NextResponse.json({
      user: savedUser,
      accessToken: `token-${Date.now()}`,
      refreshToken: `rtoken-${Date.now()}`,
    });
  } catch (err: any) {
    return NextResponse.json(
      { message: err.message || "অ্যাকাউন্ট তৈরি করতে সমস্যা হয়েছে।" },
      { status: 400 }
    );
  }
}

export async function handleAuthLogin(request: Request) {
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

export async function handleAuthMeGet(request: Request) {
  const email = request.headers.get("x-user-email") || undefined;
  const id = request.headers.get("x-user-id") || undefined;

  const existing = getUserProfile(email) || getUserProfile(id) || getUserProfile();

  if (existing) {
    return NextResponse.json({ user: existing });
  }

  // Fallback if not found yet
  const user = {
    id: id || `u-${Date.now()}`,
    name: email ? email.split("@")[0] : "ব্যবহারকারী",
    email: email || "user@example.com",
    role: "user" as const,
    createdAt: new Date().toISOString(),
  };

  return NextResponse.json({ user });
}

export async function handleAuthMePut(request: Request) {
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

export async function handleAuthForgotPassword() {
  return NextResponse.json({
    success: true,
    message: "পাসওয়ার্ড রিসেট লিংক আপনার ইমেইলে পাঠানো হয়েছে।",
  });
}

export async function handleAuthResetPassword() {
  return NextResponse.json({
    success: true,
    message: "পাসওয়ার্ড সফলভাবে পরিবর্তন করা হয়েছে।",
  });
}
