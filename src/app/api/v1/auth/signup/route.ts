import { NextResponse } from "next/server";
import { saveUserProfile } from "@/lib/user-profile-store";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
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
