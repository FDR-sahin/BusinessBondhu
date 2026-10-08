"use client";

import { AnimatePresence, motion } from "framer-motion";
import { Bot, MessageSquare, Send, Sparkles, X, Minimize2 } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useLangStore } from "@/store/lang-store";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
}

function generateClientFallbackReply(userQuery: string, lang: string): string {
  const q = userQuery.toLowerCase();

  if (
    q.includes("50,000") ||
    q.includes("50k") ||
    q.includes("৫০ হাজার") ||
    q.includes("50000") ||
    q.includes("budget") ||
    q.includes("বাজেট")
  ) {
    return lang === "en"
      ? `### 💡 Top Business Ideas for BDT 50,000 in Bangladesh:

1. **Mobile Accessories & Repair**:
   - **Initial Stock**: BDT 25,000 (Sourced from Stadium Market / Sundarban Square)
   - **Display & Counter**: BDT 15,000
   - **Expected Net Profit**: 35% – 50% margin per item

2. **Eco-Friendly Paper Cup & Packaging**:
   - **Wholesale Inventory**: BDT 30,000 (Chawkbazar Wholesale Market)
   - **Delivery & Marketing**: BDT 10,000
   - **Estimated Net Profit**: BDT 18,000 – 25,000 / month

3. **Organic Spice & Food Packaging**:
   - **Raw Sourcing**: BDT 20,000 (Directly from Chattogram/Sylhet suppliers)
   - **Pouch Packaging**: BDT 10,000
   - **Estimated Net Profit**: BDT 15,000 – 22,000 / month`
      : `### 💡 ৳৫০,০০০ বাজেটে বাংলাদেশে লাভজনক ব্যবসা:

১. **মোবাইল এক্সেসরিজ ও পার্টস বিক্রি**:
   - **পাইকারি মালামাল**: ৳২৫,০০০ (সাপ্তাহিক স্টক: স্টেডিয়াম মার্কেট / সুন্দরবন স্কয়ার)
   - **কাউন্টার ও শোরুম পজিশন**: ৳১৫,০০০
   - **আনুমানিক মাসিক নিট লাভ**: ৳১৫,০০০ - ৳২৫,০০০

২. **পরিবেশবান্ধব পেপার কাপ ও প্যাকেজিং**:
   - **চকবাজার পাইকারি ক্রয়**: ৳৩০,০০০
   - **ডেলিভারি ও মার্কেটিং**: ৳১০,০০০
   - **আনুমানিক মাসিক নিট লাভ**: ৳১৮,০০০ - ৳২২,০০০

৩. **অর্গানিক মশলা ও ফুড প্যাকেটজাতকরণ**:
   - **চট্টগ্রাম/সিলেট পাইকারি সোর্সিং**: ৳২০,০০০
   - **প্যাকেজিং পাউচ**: ৳১০,০০০
   - **প্রত্যাশিত লাভ**: ৩৫% - ৪৫% মার্জিন`;
  }

  if (
    q.includes("dhaka") ||
    q.includes("ঢাকা") ||
    q.includes("wholesale") ||
    q.includes("পাইকারি") ||
    q.includes("market") ||
    q.includes("বাজার")
  ) {
    return lang === "en"
      ? `### 🏬 Major Wholesale Hubs in Dhaka:

- **Chawkbazar**: Toys, cosmetics, plastic items, party supplies, and packaging materials.
- **Islampur**: Fabrics, garments, bedsheets, and clothing raw materials.
- **Bangshal**: Bicycles, spare parts, hardware, and electrical equipment.
- **Stadium Market & Elephant Road**: Mobile accessories, computers, and electronics.
- **Begum Bazar**: Bulk spices, pulses, grains, and grocery inventory.`
      : `### 🏬 ঢাকার প্রধান পাইকারি বাজারসমূহ:

- **চকবাজার**: কসমেটিকস, খেলনা, প্লাস্টিক পণ্য, ও সব ধরনের প্যাকেজিং সামগ্রী।
- **ইসলামপুর**: থান কাপড়, পোশাকের কাঁচামাল, থ্রি-পিস ও বেডশিট।
- **বংশাল**: বাইসাইকেল, স্পেয়ার পার্টস, হার্ডওয়্যার ও ইলেকট্রিক সামগ্রী।
- **স্টেডিয়াম মার্কেট ও এলিফ্যান্ট রোড**: মোবাইল এক্সেসরিজ, কম্পিউটার ও ইলেকট্রনিক্স।
- **বেগম বাজার**: ডাল, চাল, মশলা ও গ্রোসারি সামগ্রী।`;
  }

  if (
    q.includes("margin") ||
    q.includes("profit") ||
    q.includes("লাভ") ||
    q.includes("মার্জিন") ||
    q.includes("retail") ||
    q.includes("খুচরা")
  ) {
    return lang === "en"
      ? `### 📊 How to Calculate Wholesale vs Retail Margins:

- **Gross Profit Formula**: \`((Retail Selling Price - Wholesale Cost) / Retail Selling Price) * 100\`
- **Example Calculation**:
  - Wholesale Cost: BDT 100
  - Retail Selling Price: BDT 150
  - **Gross Profit**: BDT 50 (**33.3% Gross Margin**)
- **Advice**: Ensure your net profit margin stays above 20% after accounting for shop rent, transport, and packaging.`
      : `### 📊 পাইকারি ও খুচরা বিক্রির লাভ হিসাব পদ্ধতি:

- **লাভ হিসাবের সূত্র**: \`((খুচরা বিক্রয় মূল্য - পাইকারি মূল্য) / খুচরা বিক্রয় মূল্য) * ১০০\`
- **বাস্তব উদাহরণ**:
  - পাইকারি কেনা দাম: ৳১০০
  - গ্রাহকের কাছে বিক্রি দাম: ৳১৫০
  - **মোট লাভ**: ৳৫০ (**৩৩.৩% মোট মার্জিন**)
- **পরামর্শ**: দোকান ভাড়া, পরিবহন ও প্যাকেজিং খরচ বাদ দিয়ে নিট লাভ সর্বদা ১৫%-২৫% এর ওপরে রাখুন।`;
  }

  const queryText = userQuery || (lang === "en" ? "your inquiry" : "আপনার প্রশ্ন");
  return lang === "en"
    ? `### 🤝 Business Bondhu Assistant Advice

Regarding "${queryText}":

- **Market Demand**: Always verify current district market demand before placing bulk wholesale orders.
- **Supplier Sourcing**: Compare rates across at least 2 division hubs for better pricing.
- **Working Capital**: Reserve at least 15% of your total budget for operational expenses.

Feel free to ask about specific budgets (e.g. 10k, 50k, 1 lac) or district wholesale markets!`
    : `### 🤝 বিজনেস বন্ধু সহকারী পরামর্শ

"${queryText}" সম্পর্কিত পরামর্শ:

- **স্থানীয় চাহিদা**: পাইকারি ক্রয়ের আগে আপনার জেলার বর্তমান চাহিদা যাচাই করুন।
- **সোর্সিং কৌশল**: অন্তত ২টি পৃথক বিভাগীয় পাইকারি বাজারের দর তুলনা করে মালামাল কিনুন।
- **জরুরি তহবিল**: মোট মূলধনের ১৫% টাকা সর্বদা রানিং ক্যাশ হিসেবে আলাদা রাখুন।

নির্দিষ্ট বাজেট (যেমন: ১০ হাজার, ৫০ হাজার, ১ লাখ) বা জেলাভিত্তিক পাইকারি বাজার নিয়ে যেকোনো প্রশ্ন করতে পারেন!`;
}

export function AiChatbotWidget() {
  const lang = useLangStore((s) => s.lang);
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome-1",
      role: "assistant",
      content:
        lang === "en"
          ? "Hello! I am your Business Bondhu AI Assistant. Ask me anything about Bangladesh wholesale prices, district venture ideas, or budget calculations!"
          : "হ্যালো! আমি আপনার বিজনেস বন্ধু এআই সহকারী। বাংলাদেশের যেকোনো জেলার ব্যবসার আইডিয়া, পাইকারি দাম বা বাজেট হিসাব নিয়ে আমাকে প্রশ্ন করুন!",
    },
  ]);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    if (open) scrollToBottom();
  }, [messages, open]);

  const quickQuestions =
    lang === "en"
      ? [
          "Best business for BDT 50,000?",
          "Wholesale sources in Dhaka?",
          "How to calculate retail margins?",
        ]
      : [
          "৫০ হাজার টাকায় কোন ব্যবসা ভালো?",
          "ঢাকার সেরা পাইকারি বাজার কোথায়?",
          "খুচরা বিক্রির লাভ কীভাবে হিসাব করব?",
        ];

  async function handleSend(textToSend?: string) {
    const text = (textToSend || input).trim();
    if (!text || loading) return;

    const userMsg: Message = { id: `u-${Date.now()}`, role: "user", content: text };
    setMessages((prev) => [...prev, userMsg]);
    if (!textToSend) setInput("");
    setLoading(true);

    try {
      const res = await fetch("/api/v1/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: [...messages, userMsg].map((m) => ({ role: m.role, content: m.content })),
          lang,
        }),
      });

      let replyText = "";
      if (res.ok) {
        const data = await res.json();
        replyText = data.reply ?? "";
      }

      // If response is empty or contains "unavailable", use client fallback
      if (!replyText || replyText.toLowerCase().includes("unavailable")) {
        replyText = generateClientFallbackReply(text, lang);
      }

      const botMsg: Message = {
        id: `b-${Date.now()}`,
        role: "assistant",
        content: replyText,
      };
      setMessages((prev) => [...prev, botMsg]);
    } catch {
      // Client network error fallback
      const fallbackMsg: Message = {
        id: `b-${Date.now()}`,
        role: "assistant",
        content: generateClientFallbackReply(text, lang),
      };
      setMessages((prev) => [...prev, fallbackMsg]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      {/* Floating Assistive Trigger Button */}
      <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2">
        <AnimatePresence>
          {!open && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="hidden sm:flex items-center gap-2 rounded-full border border-green/30 bg-surface/95 px-3 py-1.5 shadow-lg backdrop-blur-md"
            >
              <span className="relative flex h-2.5 w-2.5">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green opacity-75" />
                <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-green" />
              </span>
              <span className="font-mono text-xs font-semibold text-ink">
                {lang === "en" ? "AI Assistant Online" : "এআই সহকারী লাইভ"}
              </span>
            </motion.div>
          )}
        </AnimatePresence>

        <motion.button
          whileHover={{ scale: 1.08 }}
          whileTap={{ scale: 0.94 }}
          onClick={() => setOpen((prev) => !prev)}
          className="relative flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-green to-primary-deep text-white shadow-xl hover:shadow-2xl transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-green focus:ring-offset-2"
          aria-label={lang === "en" ? "Open AI Assistant Chat" : "এআই চ্যাট সহকারী খুলুন"}
        >
          {open ? (
            <X className="h-6 w-6" />
          ) : (
            <>
              <Bot className="h-7 w-7" />
              <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-secondary text-[10px] font-bold text-ink shadow">
                <Sparkles className="h-3 w-3 text-ink" />
              </span>
            </>
          )}
        </motion.button>
      </div>

      {/* Floating Chat Modal Window */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="fixed bottom-24 right-4 z-50 w-[calc(100vw-2rem)] max-w-[400px] sm:right-6"
          >
            <Card className="flex h-[520px] flex-col overflow-hidden rounded-2xl border-2 border-line bg-surface shadow-2xl">
              {/* Header */}
              <div className="flex items-center justify-between border-b border-line bg-primary-soft/50 px-4 py-3">
                <div className="flex items-center gap-2.5">
                  <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-green text-white shadow-sm">
                    <Bot className="h-5 w-5" />
                  </div>
                  <div>
                    <div className="flex items-center gap-1.5">
                      <h3 className="font-semibold text-ink text-sm">
                        {lang === "en" ? "Business Bondhu AI" : "বিজনেস বন্ধু এআই"}
                      </h3>
                      <span className="rounded bg-gold/20 px-1.5 py-0.2 font-mono text-[10px] font-bold text-gold">
                        PRO
                      </span>
                    </div>
                    <p className="flex items-center gap-1 text-[11px] text-muted">
                      <span className="h-1.5 w-1.5 rounded-full bg-green" />
                      {lang === "en" ? "Smart Assistant • Active" : "স্মার্ট সহকারী • অ্যাক্টিভ"}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-1">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-muted hover:text-ink"
                    onClick={() => setOpen(false)}
                  >
                    <Minimize2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              {/* Chat Messages */}
              <div className="flex-1 space-y-3.5 overflow-y-auto p-4 text-sm">
                {messages.map((m) => (
                  <div
                    key={m.id}
                    className={`flex gap-2.5 ${m.role === "user" ? "justify-end" : "justify-start"}`}
                  >
                    {m.role === "assistant" && (
                      <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-green/10 text-green">
                        <Bot className="h-4 w-4" />
                      </div>
                    )}

                    <div
                      className={`max-w-[82%] rounded-2xl px-3.5 py-2.5 leading-relaxed whitespace-pre-wrap ${
                        m.role === "user"
                          ? "bg-green text-white rounded-br-none"
                          : "bg-background border border-line text-ink rounded-bl-none shadow-sm"
                      }`}
                    >
                      {m.content}
                    </div>
                  </div>
                ))}

                {loading && (
                  <div className="flex gap-2.5 justify-start">
                    <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-green/10 text-green">
                      <Bot className="h-4 w-4 animate-bounce" />
                    </div>
                    <div className="flex items-center gap-1 rounded-2xl border border-line bg-background px-4 py-3 text-muted">
                      <span className="h-2 w-2 animate-bounce rounded-full bg-green" />
                      <span className="h-2 w-2 animate-bounce rounded-full bg-green [animation-delay:0.2s]" />
                      <span className="h-2 w-2 animate-bounce rounded-full bg-green [animation-delay:0.4s]" />
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Quick Prompt Chips */}
              <div className="flex gap-1.5 overflow-x-auto border-t border-line bg-background/50 p-2 text-xs">
                {quickQuestions.map((q) => (
                  <button
                    key={q}
                    onClick={() => void handleSend(q)}
                    className="shrink-0 rounded-full border border-line bg-surface px-2.5 py-1 text-ink-secondary hover:border-green hover:text-green transition-colors"
                  >
                    {q}
                  </button>
                ))}
              </div>

              {/* Input Form */}
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  void handleSend();
                }}
                className="flex items-center gap-2 border-t border-line bg-surface p-3"
              >
                <Input
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder={
                    lang === "en" ? "Ask Business Bondhu Assistant..." : "বিজনেস বন্ধু সহকারীকে প্রশ্ন করুন..."
                  }
                  className="h-10 text-sm"
                  disabled={loading}
                />
                <Button
                  type="submit"
                  size="icon"
                  disabled={!input.trim() || loading}
                  className="h-10 w-10 shrink-0 bg-green text-white hover:bg-green/90"
                >
                  <Send className="h-4 w-4" />
                </Button>
              </form>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
