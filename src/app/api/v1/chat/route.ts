import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { messages, lang = "bn" } = await req.json();

    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
      // Fallback intelligent simulated assistant response if GEMINI_API_KEY is not set yet
      const lastUserMsg = messages[messages.length - 1]?.content ?? "";
      return NextResponse.json({
        reply:
          lang === "en"
            ? `I am your Business Bondhu AI Assistant. To get real-time Gemini AI insights for "${lastUserMsg}", please set GEMINI_API_KEY in your Vercel environment variables!`
            : `আমি আপনার বিজনেস বন্ধু এআই সহকারী। "${lastUserMsg}" সম্পর্কিত গুগল জেমিনাই এআই পরামর্শ সক্রিয় করতে Vercel Environment Variables-এ GEMINI_API_KEY যোগ করুন!`,
      });
    }

    const systemPrompt =
      lang === "en"
        ? "You are Business Bondhu AI Assistant, a friendly expert advisor for Bangladeshi entrepreneurs. Provide concise, realistic, and practical business advice regarding wholesale/retail prices, capital budgets, shop setup, and district-level market opportunities in Bangladesh. Use clear markdown formatting."
        : "আপনি বিজনেস বন্ধু এআই সহকারী, বাংলাদেশের উদ্যোক্তাদের জন্য একজন বিশ্বস্ত উপদেষ্টা। বাংলাদেশের জেলাভিত্তিক ব্যবসার সুযোগ, পাইকারি-খুচরা দাম, পুঁজি ও লাভ-ক্ষতির বাস্তবসম্মত তথ্য সহজ ও সাবলীল বাংলায় দিন।";

    // Format chat history for Gemini REST API
    const contents = [
      { role: "user", parts: [{ text: systemPrompt }] },
      ...messages.map((m: { role: string; content: string }) => ({
        role: m.role === "user" ? "user" : "model",
        parts: [{ text: m.content }],
      })),
    ];

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ contents }),
      }
    );

    if (!response.ok) {
      const errText = await response.text();
      console.error("Gemini API Error:", errText);
      return NextResponse.json(
        {
          reply:
            lang === "en"
              ? "Sorry, Gemini AI service is currently unavailable. Please try again shortly."
              : "দুঃখিত, জেমিনাই এআই সেবা এই মুহূর্তে সাড়া দিচ্ছে না। কিছুক্ষণ পর আবার চেষ্টা করুন।",
        },
        { status: 500 }
      );
    }

    const data = await response.json();
    const candidateText =
      data.candidates?.[0]?.content?.parts?.[0]?.text ??
      (lang === "en"
        ? "Could not parse AI response."
        : "এআই উত্তর প্রসেস করা সম্ভব হয়নি।");

    return NextResponse.json({ reply: candidateText });
  } catch (error) {
    console.error("Chat API route error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
