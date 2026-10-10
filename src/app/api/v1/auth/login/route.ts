import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const email = body.email || "";
    const name = email ? email.split("@")[0] : "উদ্যোক্তা";

    const user = {
      id: `u-${Date.now()}`,
      name,
      email,
      role: "user" as const,
      createdAt: new Date().toISOString(),
    };

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
