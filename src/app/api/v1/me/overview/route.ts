import { NextResponse } from "next/server";
import { MOCK_DASHBOARD_OVERVIEW } from "@/lib/mock-data";

export async function GET() {
  return NextResponse.json(MOCK_DASHBOARD_OVERVIEW);
}
