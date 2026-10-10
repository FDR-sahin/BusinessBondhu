import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({
    notifications: {
      likes: true,
      comments: true,
      replies: true,
      system: true,
      email: true,
    },
  });
}
