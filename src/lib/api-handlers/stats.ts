import { NextResponse } from "next/server";
import { MOCK_ANALYSIS_DATA, MOCK_TOP_DISTRICTS } from "@/lib/mock-data";

export async function handleStatsAnalysis() {
  return NextResponse.json(MOCK_ANALYSIS_DATA);
}

export async function handleStatsTopDistricts() {
  return NextResponse.json(MOCK_TOP_DISTRICTS);
}
