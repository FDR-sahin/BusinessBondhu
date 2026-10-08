import { NextResponse } from "next/server";
import { DETAILED_BLOG_POSTS } from "@/lib/blog-data";

export async function GET() {
  return NextResponse.json(DETAILED_BLOG_POSTS[0] || null);
}
