import { NextResponse } from "next/server";
import { getMockComments } from "@/lib/mock-data";

export async function GET(request: Request, { params }: { params: { id: string } }) {
  const id = decodeURIComponent(params.id);
  const comments = getMockComments(id);
  return NextResponse.json(comments);
}
