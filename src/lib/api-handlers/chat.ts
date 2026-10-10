import { NextResponse } from "next/server";

function generateSmartFallbackReply(userQuery: string, lang: string): string {
  const q = userQuery.toLowerCase();

  if (q.includes("50,000") || q.includes("50k") || q.includes("৫০ হাজার") || q.includes("50000") || q.includes("budget") || q.includes("বাজেট")) {
    return lang === "en"
      ? `### 💡 Top Business Ideas for BDT 50,000 in Bangladesh:

1. **Mobile Accessories & Repair**:
   - **Initial Stock**: BDT 25,000 (Sourced from Sundarban Square / Stadium Market, Dhaka)
   - **Display & Counter**: BDT 15,000
   - **Expected Profit**: 35% – 50% margin per item

2. **Eco-Friendly Paper Cup & Packaging**:
   - **Wholesale Inventory**: BDT 30,000 (Sourced from Chawkbazar)
   - **Marketing & Delivery**: BDT 10,000
   - **Expected Net Profit**: BDT 15,000 – 22,000 / month

3. **Organic Spice & Dry Fish Packaging**:
   - **Raw Sourcing**: BDT 20,000 (Directly from Chattogram/Sylhet suppliers)
   - **Sealing Machine & Pouch Packaging**: BDT 10,000
   - **Estimated Monthly Net Profit**: BDT 18,000`
      : `### 💡 ৳৫০,০০০ বাজেটে বাংলাদেশে লাভজনক ব্যবসা:

১. **মোবাইল এক্সেসরিজ ও পার্টস বিক্রি**:
   - **পাইকারি মালামাল**: ৳২৫,০০০ (সাপ্তাহিক স্টক: স্টেডিয়াম মার্কেট / সুন্দরবন স্কয়ার)
   - **কাউন্টার ও শোরুম পজিশন**: ৳১৫,০০০
   - **আনুমানিক মাসিক নিট লাভ**: ৳১৫,০০০ - ৳২৫,০০০

২. **পরিবেশবান্ধব পেপার কাপ ও প্যাকেজিং**:
   - **চকবাজার পাইকারি ক্রয়**: ৳৩০,০০০
   - **ডেলিভারি ও মার্কেটিং**: ৳১০,০০০
   - **আনুমানিক মাসিক নিট লাভ**: ৳১৮,০০০ - ৳২২,০০০

৩. **অর্গানিক মশলা ও শুঁটকি প্যাকেটজাতকরণ**:
   - **চট্টগ্রাম/সিলেট পাইকারি সোর্সিং**: ৳২০,০০০
   - **প্যাকেজিং মেশিন ও পাউচ**: ৳১০,০০০
   - **প্রত্যাশিত লাভ**: ৩৫% - ৪৫% মার্জিন`;
  }

  if (q.includes("dhaka") || q.includes("ঢাকা") || q.includes("wholesale") || q.includes("পাইকারি") || q.includes("market") || q.includes("বাজার")) {
    return lang === "en"
      ? `### 🏬 Major Wholesale Markets in Dhaka:

- **Chawkbazar**: Toys, cosmetics, plastic items, party goods, and packaging supplies.
- **Islampur**: Fabrics, garments, bedsheets, and clothing raw materials.
- **Bangshal**: Bicycles, auto parts, and hardware items.
- **Elephant Road & Stadium Market**: Electronics, computers, and mobile accessories.
- **Begum Bazar**: Dry food, spices, and grocery bulk inventory.`
      : `### 🏬 ঢাকার প্রধান পাইকারি বাজারসমূহ:

- **চকবাজার**: কসমেটিকস, খেলনা, প্লাস্টিক পণ্য, ও সব ধরনের প্যাকেজিং সামগ্রী।
- **ইসলামপুর**: থান কাপড়, পোশাকের কাঁচামাল, থ্রি-পিস ও বেডশিট।
- **বংশাল**: বাইসাইকেল, স্পেয়ার পার্টস, হার্ডওয়্যার ও ইলেকট্রিক সামগ্রী।
- **স্টেডিয়াম মার্কেট ও এলিফ্যান্ট রোড**: মোবাইল এক্সেসরিজ, কম্পিউটার ও ইলেকট্রনিক্স।
- **বেগম বাজার**: ডাল, চাল, মশলা ও গ্রোসারি সামগ্রী।`;
  }

  if (q.includes("margin") || q.includes("profit") || q.includes("লাভ") || q.includes("মার্জিন") || q.includes(" retail") || q.includes("খুচরা")) {
    return lang === "en"
      ? `### 📊 How to Calculate Wholesale vs Retail Margins:

- **Gross Margin Formula**: \`((Retail Selling Price - Wholesale Cost) / Retail Selling Price) * 100\`
- **Example**:
  - Wholesale Cost: BDT 100
  - Retail Selling Price: BDT 150
  - **Gross Profit**: BDT 50 (**33.3% Gross Margin**)
- **Recommended Minimum Net Margin**: Keep net profit above 20% after accounting for shop rent, transport, and packaging.`
      : `### 📊 পাইকারি ও খুচরা বিক্রির লাভ হিসাব পদ্ধতি:

- **লাভ হিসাবের সূত্র**: \`((খুচরা বিক্রয় মূল্য - পাইকারি মূল্য) / খুচরা বিক্রয় মূল্য) * ১০০\`
- **বাস্তব উদাহরণ**:
  - পাইকারি কেনা দাম: ৳১০০
  - গ্রাহকের কাছে বিক্রি দাম: ৳১৫০
  - **মোট লাভ**: ৳৫০ (**৩৩.৩% মোট মার্জিন**)
- **পরামর্শ**: দোকান ভাড়া, পরিবহন ও প্যাকেজিং খরচ বাদ দিয়ে নিট লাভ সর্বদা ১৫%-২৫% এর ওপরে রাখুন।`;
  }

  const lastMsg = userQuery || (lang === "en" ? "your query" : "আপনার প্রশ্ন");
  return lang === "en"
    ? `### 🤝 Business Idea Zone Assistant Advice

Regarding "${lastMsg}":

- **Local Demand**: Always verify current district market demand before making bulk wholesale purchases.
- **Supplier Sourcing**: Compare wholesale rates from at least 2 different division hubs.
- **Capital Reserve**: Keep 15% of your total budget as emergency working capital.

Feel free to ask about specific budgets (e.g. 10k, 50k, 1 lac) or district wholesale markets!`
    : `### 🤝 বিজনেস আইডিয়া জোন সহকারী পরামর্শ

"${lastMsg}" সম্পর্কিত পরামর্শ:

- **স্থানীয় চাহিদা**: পাইকারি ক্রয়ের আগে আপনার জেলার বর্তমান চাহিদা যাচাই করুন।
- **সোর্সিং কৌশল**: অন্তত ২টি পৃথক বিভাগীয় পাইকারি বাজারের দর তুলনা করে মালামাল কিনুন।
- **জরুরি তহবিল**: মোট মূলধনের ১৫% টাকা সর্বদা রানিং ক্যাশ হিসেবে আলাদা রাখুন।

নির্দিষ্ট বাজেট (যেমন: ১০ হাজার, ৫০ হাজার, ১ লাখ) বা জেলাভিত্তিক পাইকারি বাজার নিয়ে যেকোনো প্রশ্ন করতে পারেন!`;
}

export async function handleChat(req: Request) {
  try {
    const { messages, lang = "bn" } = await req.json();
    const lastUserMsg = messages[messages.length - 1]?.content ?? "";
    const apiKey = process.env.GEMINI_API_KEY;

    if (apiKey) {
      try {
        const systemPrompt =
          lang === "en"
            ? "You are Business Idea Zone AI Assistant, a friendly expert advisor for Bangladeshi entrepreneurs. Never state that you are Gemini or a Google AI model—always introduce yourself as Business Idea Zone AI Assistant. Provide concise, realistic, and practical business advice regarding wholesale/retail prices, capital budgets, shop setup, and district-level market opportunities in Bangladesh. Use clear markdown formatting."
            : "আপনি বিজনেস আইডিয়া জোন এআই সহকারী, বাংলাদেশের উদ্যোক্তাদের জন্য একজন বিশ্বস্ত উপদেষ্টা। নিজেকে সবসময় বিজনেস আইডিয়া জোন এআই সহকারী হিসেবে পরিচয় দিন। বাংলাদেশের জেলাভিত্তিক ব্যবসার সুযোগ, পাইকারি-খুচরা দাম, পুঁজি ও লাভ-ক্ষতির বাস্তবসম্মত তথ্য সহজ ও সাবলীল বাংলায় দিন।";

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

        if (response.ok) {
          const data = await response.json();
          const candidateText = data.candidates?.[0]?.content?.parts?.[0]?.text;
          if (candidateText) {
            return NextResponse.json({ reply: candidateText });
          }
        } else {
          const errText = await response.text();
          console.warn("Gemini API non-200 response, using smart fallback:", errText);
        }
      } catch (err) {
        console.warn("Gemini API fetch error, using smart fallback:", err);
      }
    }

    const fallbackReply = generateSmartFallbackReply(lastUserMsg, lang);
    return NextResponse.json({ reply: fallbackReply });
  } catch (error) {
    console.error("Chat API route error:", error);
    return NextResponse.json({
      reply:
        "আমি আপনার বিজনেস বন্ধু এআই সহকারী। ব্যবসা সংক্রান্ত যেকোনো প্রশ্ন নিচে টাইপ করুন!",
    });
  }
}
