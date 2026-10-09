import { NextResponse } from "next/server";
import { MOCK_POSTS } from "@/lib/mock-data";

export async function GET(request: Request, { params }: { params: { id: string } }) {
  const id = decodeURIComponent(params.id);
  const related = MOCK_POSTS.filter((p) => p.id !== id).slice(0, 4);
  return NextResponse.json(related);
}
