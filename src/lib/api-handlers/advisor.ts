import { NextResponse } from "next/server";
import { generateSmartAdvisorSuggestions } from "../advisor-engine";
import type { AdvisorRequest, AdvisorResponse } from "@/types";

export async function handleAdvisorSuggest(req: Request) {
  try {
    const body: AdvisorRequest = await req.json();
    const budget = Math.max(1_000, Number(body.budget) || 50_000);
    const division = body.division || "Dhaka";
    const district = body.district || "Dhaka";
    const category = body.category || "all";
    const apiKey = process.env.GEMINI_API_KEY;

    // Baseline fallback suggestions from our localized smart engine
    const baseline = generateSmartAdvisorSuggestions({
      budget,
      division,
      district,
      area: body.area,
      category,
    });

    if (!apiKey) {
      return NextResponse.json(baseline);
    }

    // If Gemini API Key exists, try real-time AI with a strict timeout
    try {
      const prompt = `You are a top business and financial advisor for Bangladesh.
Analyze the following parameters:
- Division: ${division}
- District: ${district}
- Category: ${category}
- Initial Capital/Budget: ${budget} BDT

Generate 2 to 3 distinct, highly realistic business ideas tailored specifically to this budget (${budget} BDT) and location (${district}, Bangladesh).
IMPORTANT: The breakdown of costs for each idea MUST add up to ${budget} BDT.

Respond ONLY with a valid JSON array of 2 or 3 objects with these EXACT keys:
[
  {
    "id": "adv-1",
    "name": "Bengali venture name",
    "category": "${category !== "all" ? category : "food-beverage"}",
    "costBreakdown": [
      {"item": "Expense or Product Item in Bengali", "amount": number},
      {"item": "Expense or Product Item 2 in Bengali", "amount": number}
    ],
    "totalCost": ${budget},
    "profitDaily": number,
    "profitMonthly": number,
    "riskPercent": number,
    "reason": "Detailed Bengali explanation of why this business works in ${district}",
    "tips": [
      "Bengali practical sourcing and execution tip 1",
      "Bengali practical tip 2",
      "Bengali practical tip 3"
    ]
  }
]`;

      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 7000);

      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            contents: [{ parts: [{ text: prompt }] }],
            generationConfig: { responseMimeType: "application/json" },
          }),
          signal: controller.signal,
        }
      );
      clearTimeout(timeoutId);

      if (response.ok) {
        const data = await response.json();
        const rawJson = data.candidates?.[0]?.content?.parts?.[0]?.text;
        if (rawJson) {
          const parsed = JSON.parse(rawJson);
          const rawSuggestions = Array.isArray(parsed) ? parsed : [parsed];
          const formatted = rawSuggestions.map((s: any, idx: number) => ({
            id: s.id || `adv-ai-${idx + 1}-${Date.now()}`,
            name: s.name || s.title || baseline.suggestions[idx]?.name || "ব্যবসায়িক উদ্যোগ",
            category: s.category || category || "food-beverage",
            costBreakdown: Array.isArray(s.costBreakdown)
              ? s.costBreakdown.map((c: any) => ({ item: c.item, amount: Number(c.amount || c.cost || 0) }))
              : baseline.suggestions[idx]?.costBreakdown || [],
            totalCost: Number(s.totalCost || budget),
            profitDaily: Number(s.profitDaily || s.dailyProfit || Math.round(budget * 0.04)),
            profitMonthly: Number(s.profitMonthly || s.netProfit || Math.round(budget * 0.35)),
            riskPercent: Number(s.riskPercent || 20),
            reason: s.reason || s.overview || baseline.suggestions[idx]?.reason || "",
            tips: Array.isArray(s.tips) && s.tips.length > 0 ? s.tips : baseline.suggestions[idx]?.tips || [],
          }));

          if (formatted.length > 0) {
            return NextResponse.json({ suggestions: formatted });
          }
        }
      }
    } catch (aiErr) {
      console.warn("Gemini AI fetch failed or timed out, using smart localized engine:", aiErr);
    }

    return NextResponse.json(baseline);
  } catch (error: any) {
    console.error("Advisor suggest API route error:", error);
    return NextResponse.json(
      { error: "Failed to generate business suggestion" },
      { status: 500 }
    );
  }
}
