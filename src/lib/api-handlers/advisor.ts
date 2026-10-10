import { NextResponse } from "next/server";

export async function handleAdvisorSuggest(req: Request) {
  try {
    const { division, district, category, budget } = await req.json();
    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
      return NextResponse.json({
        suggestions: [
          {
            title: `উন্নত ${category ?? "ব্যবসা"} শোরুম / দোকান`,
            titleEn: `Modern ${category ?? "Venture"} Store`,
            overview: `${district ?? "এলাকায়"} ৳${budget ?? 50000} বাজেটে শুরু করার উপযোগী সুযোগ।`,
            overviewEn: `Feasible venture for ${district ?? "area"} with initial budget of BDT ${budget ?? 50000}.`,
            initialCapital: Number(budget ?? 50000),
            breakdown: [
              { item: "দোকান পজিশন / অ্যাডভান্স", cost: Math.round(Number(budget ?? 50000) * 0.35) },
              { item: "মালামাল পাইকারি ক্রয়", cost: Math.round(Number(budget ?? 50000) * 0.45) },
              { item: "ডেকোরেশন ও ব্র্যান্ডিং", cost: Math.round(Number(budget ?? 50000) * 0.2) },
            ],
            monthlyRevenue: Math.round(Number(budget ?? 50000) * 0.5),
            monthlyExpense: Math.round(Number(budget ?? 50000) * 0.2),
            netProfit: Math.round(Number(budget ?? 50000) * 0.3),
            riskPercent: 25,
            riskAnalysis: "স্থানীয় চাহিদা ভালো থাকলে ঝুঁকি কম।",
            riskAnalysisEn: "Low risk with steady local demand.",
          },
        ],
      });
    }

    const prompt = `You are a professional business financial analyst for Bangladesh.
Analyze the following parameters:
- Division: ${division || "Dhaka"}
- District: ${district || "Dhaka"}
- Category: ${category || "Food & Beverage"}
- Initial Budget (BDT): ${budget || 50000}

Respond ONLY with a valid JSON array of 1 object with these exact keys:
{
  "title": "Bengali venture title",
  "titleEn": "English venture title",
  "overview": "Bengali overview text",
  "overviewEn": "English overview text",
  "initialCapital": ${budget || 50000},
  "breakdown": [
    {"item": "Item Name in Bengali", "cost": number},
    {"item": "Item Name 2", "cost": number}
  ],
  "monthlyRevenue": number,
  "monthlyExpense": number,
  "netProfit": number,
  "riskPercent": number,
  "riskAnalysis": "Bengali risk summary",
  "riskAnalysisEn": "English risk summary"
}`;

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          generationConfig: { responseMimeType: "application/json" },
        }),
      }
    );

    if (!response.ok) {
      throw new Error(`Gemini API error ${response.status}`);
    }

    const data = await response.json();
    const rawJson = data.candidates?.[0]?.content?.parts?.[0]?.text;
    const parsed = JSON.parse(rawJson);

    return NextResponse.json({
      suggestions: Array.isArray(parsed) ? parsed : [parsed],
    });
  } catch (error) {
    console.error("Advisor suggest API route error:", error);
    return NextResponse.json(
      { error: "Failed to generate AI suggestion" },
      { status: 500 }
    );
  }
}
