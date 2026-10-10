import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({
    items: [],
    total: 0,
    page: 1,
    limit: 15,
    totalPages: 1,
  });
}
