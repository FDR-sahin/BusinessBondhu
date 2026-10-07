"use client";

import { ChevronLeft, ChevronRight, Quote } from "lucide-react";
import { useRef } from "react";
import { SectionHeader } from "@/components/shared/section-header";
import { UserAvatar } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

/**
 * SAMPLE CONTENT — written as realistic placeholders. Replace with real,
 * consented member stories (or load them from your API) before launch.
 */
const STORIES = [
  { name: "রাশেদুল ইসলাম", location: "মিরপুর, ঢাকা", quote: "ফ্রোজেন ফুডের পাইকারি দাম আগে থেকে জানা ছিল বলে সঠিক সরবরাহকারী খুঁজে পেয়েছি। ছোট পুঁজিতেই দোকান শুরু করতে পেরেছি।" },
  { name: "নুসরাত জাহান", location: "রাজশাহী", quote: "এলাকার চাহিদা বুঝে মৌসুমি ফলের ব্যবসা শুরু করি। অন্য উদ্যোক্তাদের মন্তব্য থেকে অনেক ভুল এড়াতে পেরেছি।" },
  { name: "সাব্বির হোসেন", location: "কুমিল্লা", quote: "মোবাইল এক্সেসরিজের বাজারদর তুলনা করে সস্তায় মাল কিনেছি। এখন নিয়মিত ক্রেতা আছে।" },
  { name: "তাহমিনা আক্তার", location: "সিলেট", quote: "ঘরে বসে সেলাইয়ের কাজ দিয়ে শুরু করেছিলাম। এআই পরামর্শ থেকে বাজেট ভাগ করে নেওয়ার ধারণা পেয়েছি।" },
  { name: "মিজানুর রহমান", location: "বগুড়া", quote: "দুগ্ধজাত পণ্যের ছোট ব্যবসায় কোন সময় চাহিদা বাড়ে, সেই তথ্য কমিউনিটি থেকেই পেয়েছি।" },
  { name: "ফারহানা ইয়াসমিন", location: "খুলনা", quote: "কসমেটিকসের পাইকারি বাজারের ঠিকানা আর দামের তুলনা পেয়ে কেনাকাটার খরচ কমাতে পেরেছি।" },
];

export function SuccessStories() {
  const scroller = useRef<HTMLDivElement>(null);
  const scrollBy = (dir: 1 | -1) => scroller.current?.scrollBy({ left: dir * 360, behavior: "smooth" });

  return (
    <section className="section border-y border-border bg-surface" aria-labelledby="stories-title">
      <div className="container-page">
        <div className="mb-8 flex items-end justify-between gap-4 md:mb-12">
          <div className="max-w-2xl">
            <h2 id="stories-title" className="text-2xl font-semibold leading-snug md:text-4xl">সদস্যদের সাফল্যের গল্প</h2>
            <p className="mt-2 text-ink-secondary">যারা কমিউনিটির তথ্য কাজে লাগিয়ে এগিয়ে যাচ্ছেন</p>
          </div>
          <div className="hidden gap-2 md:flex">
            <Button variant="outline" size="icon" aria-label="আগের গল্প" onClick={() => scrollBy(-1)}><ChevronLeft /></Button>
            <Button variant="outline" size="icon" aria-label="পরের গল্প" onClick={() => scrollBy(1)}><ChevronRight /></Button>
          </div>
        </div>

        <div
          ref={scroller}
          role="region"
          aria-label="সাফল্যের গল্প"
          tabIndex={0}
          className="-mx-4 flex snap-x snap-mandatory gap-4 overflow-x-auto px-4 pb-4 scrollbar-hide md:mx-0 md:px-0"
        >
          {STORIES.map((s) => (
            <Card key={s.name} className="flex w-[85%] shrink-0 snap-start flex-col gap-5 p-6 sm:w-[22rem]">
              <Quote className="h-6 w-6 text-secondary" aria-hidden />
              <blockquote className="flex-1 text-base leading-7">{s.quote}</blockquote>
              <figcaption className="flex items-center gap-3 border-t border-border pt-4">
                <UserAvatar name={s.name} className="h-10 w-10" />
                <div className="leading-tight">
                  <p className="font-medium">{s.name}</p>
                  <p className="text-sm text-ink-secondary">{s.location}</p>
                </div>
              </figcaption>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
