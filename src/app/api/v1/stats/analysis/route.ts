import { NextResponse } from "next/server";
import { MOCK_ANALYSIS_DATA } from "@/lib/mock-data";

export async function GET() {
  return NextResponse.json(MOCK_ANALYSIS_DATA);
}
