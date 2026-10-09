"use client";

import { MapPin, Sparkles, Wallet } from "lucide-react";
import { Stagger, StaggerItem } from "@/components/shared/motion";
import { Card } from "@/components/ui/card";
import { useLangStore } from "@/store/lang-store";

const STEPS = [
  {
    icon: Wallet,
    titleBn: "বাজেট দিন",
    titleEn: "Enter Budget",
    textBn: "আপনার হাতে যত টাকা আছে সেটি লিখুন। ৫ হাজার থেকে শুরু করা যায়।",
    textEn: "Specify your available capital. You can start with as little as ৳ 5,000.",
  },
  {
    icon: MapPin,
    titleBn: "এলাকা সিলেক্ট করুন",
    titleEn: "Select Location",
    textBn: "বিভাগ, জেলা ও এলাকা দিন, যাতে স্থানীয় চাহিদা বুঝে আইডিয়া আসে।",
    textEn: "Choose division, district, and area to get tailored local market suggestions.",
  },
  {
    icon: Sparkles,
    titleBn: "AI পরামর্শ পাবেন",
    titleEn: "Get AI Advice",
    textBn: "খরচ, সম্ভাব্য লাভ ও ঝুঁকিসহ ব্যবসার আইডিয়া পাবেন।",
    textEn: "Receive custom business ideas with cost breakdowns, expected profits, and risk scores.",
  },
];

export function HowItWorks() {
  const lang = useLangStore((s) => s.lang);

  return (
    <section className="section border-t border-border bg-surface" aria-labelledby="how-title">
      <div className="container-page">
        <h2 id="how-title" className="mb-10 text-2xl font-semibold leading-snug md:text-4xl">
          {lang === "en" ? "How It Works" : "কীভাবে কাজ করে"}
        </h2>
        <Stagger className="grid gap-6 md:grid-cols-3">
          {STEPS.map(({ icon: Icon, titleBn, titleEn, textBn, textEn }, i) => (
            <StaggerItem key={titleBn} className="h-full">
              <Card className="relative h-full space-y-3 p-6">
                <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary-soft text-primary-soft-foreground">
                  <Icon className="h-5 w-5" aria-hidden />
                </span>
                <p className="text-sm font-semibold text-link">
                  {lang === "en" ? `Step ${i + 1}` : `ধাপ ${["১", "২", "৩"][i]}`}
                </p>
                <h3 className="text-lg font-semibold md:text-xl">
                  {lang === "en" ? titleEn : titleBn}
                </h3>
                <p className="text-ink-secondary">
                  {lang === "en" ? textEn : textBn}
                </p>
              </Card>
            </StaggerItem>
          ))}
        </Stagger>
      </div>
    </section>
  );
}
