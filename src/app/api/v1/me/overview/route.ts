import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({
    totals: { posts: 0, likes: 0, views: 0, comments: 0 },
    weeklyLikes: [],
    postsByCategory: [],
    activity: [],
  });
}
