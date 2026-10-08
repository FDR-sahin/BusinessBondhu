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

      const data = await res.json();
      const botMsg: Message = {
        id: `b-${Date.now()}`,
        role: "assistant",
        content: data.reply || (lang === "en" ? "No response received." : "উত্তর পাওয়া যায়নি।"),
      };
      setMessages((prev) => [...prev, botMsg]);
    } catch (err) {
      console.error(err);
      setMessages((prev) => [
        ...prev,
        {
          id: `e-${Date.now()}`,
          role: "assistant",
          content:
            lang === "en"
              ? "Connection error. Please try again."
              : "সংযোগ সমস্যা। অনুগ্রহ করে আবার চেষ্টা করুন।",
        },
      ]);
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
