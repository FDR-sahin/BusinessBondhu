import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const name = body.name || (body.email ? body.email.split("@")[0] : "উদ্যোক্তা");
    const email = body.email || "";

    const user = {
      id: `u-${Date.now()}`,
      name,
      email,
      division: body.division || "",
      district: body.district || "",
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
      { message: err.message || "অ্যাকাউন্ট তৈরি করতে সমস্যা হয়েছে।" },
      { status: 400 }
    );
  }
}
