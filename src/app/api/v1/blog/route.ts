import { NextResponse } from "next/server";
import { DETAILED_BLOG_POSTS } from "@/lib/blog-data";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const category = searchParams.get("category");
  const page = parseInt(searchParams.get("page") || "1", 10);
  const limit = parseInt(searchParams.get("limit") || "9", 10);

  let filtered = DETAILED_BLOG_POSTS;
  if (category && category !== "all") {
    filtered = filtered.filter((b) => b.category === category);
  }

  const start = (page - 1) * limit;
  const items = filtered.slice(start, start + limit);
  const total = filtered.length;
  const totalPages = Math.ceil(total / limit);

  return NextResponse.json({
    items,
    total,
    page,
    limit,
    totalPages,
  });
}
