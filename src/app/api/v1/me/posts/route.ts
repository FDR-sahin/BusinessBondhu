import { NextResponse } from "next/server";
import { MOCK_POSTS } from "@/lib/mock-data";

export async function GET() {
  const items = MOCK_POSTS.map((p, index) => ({
    ...p,
    status: index === 0 ? "approved" : index === 1 ? "pending" : index === 2 ? "draft" : "approved",
  }));
  return NextResponse.json({
    items,
    total: items.length,
    page: 1,
    limit: 10,
    totalPages: 1,
  });
}
