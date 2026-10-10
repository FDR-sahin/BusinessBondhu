import { NextResponse } from "next/server";

export async function POST() {
  return NextResponse.json({
    success: true,
    message: "পাসওয়ার্ড সফলভাবে পরিবর্তন করা হয়েছে।",
  });
}
