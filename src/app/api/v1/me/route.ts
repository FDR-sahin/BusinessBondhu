import { NextResponse } from "next/server";

export async function DELETE() {
  return NextResponse.json({
    success: true,
    message: "অ্যাকাউন্ট সফলভাবে মুছে ফেলা হয়েছে।",
  });
}
