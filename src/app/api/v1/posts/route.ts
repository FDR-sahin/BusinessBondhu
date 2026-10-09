import { NextResponse } from "next/server";
import { getMockPaginatedPosts } from "@/lib/mock-data";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const params = Object.fromEntries(searchParams.entries());
  const data = getMockPaginatedPosts(params);
  return NextResponse.json(data);
}
