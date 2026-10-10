import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({
    user: {
      id: `u-${Date.now()}`,
      name: "উদ্যোক্তা",
      email: "user@example.com",
      role: "user",
      createdAt: new Date().toISOString(),
    },
  });
}

export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const user = {
      id: `u-${Date.now()}`,
      name: body.name || "উদ্যোক্তা",
      email: body.email || "user@example.com",
      bio: body.bio || "",
      division: body.division || "",
      district: body.district || "",
      area: body.area || "",
      avatar: body.avatar || "",
      role: "user" as const,
      createdAt: new Date().toISOString(),
    };

    return NextResponse.json({ user });
  } catch (err: any) {
    return NextResponse.json({ message: err.message || "প্রোফাইল আপডেট করতে সমস্যা হয়েছে।" }, { status: 400 });
  }
}
