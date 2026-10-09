import { NextResponse } from "next/server";
import { getMockPostDetail } from "@/lib/mock-data";

export async function GET(request: Request, { params }: { params: { id: string } }) {
  const id = decodeURIComponent(params.id);
  const post = getMockPostDetail(id);
  if (!post) {
    return NextResponse.json({ message: "Post not found" }, { status: 404 });
  }
  return NextResponse.json(post);
}
