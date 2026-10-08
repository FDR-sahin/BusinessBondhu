"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowRight, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Skeleton } from "@/components/ui/skeleton";
import { getDistrictLabel } from "@/lib/bd-data";
import { usePosts, useTopDistricts } from "@/hooks/use-posts";
import { useT } from "@/lib/i18n";
import { formatBDT, toFormattedNumber } from "@/lib/utils";
import { useLangStore } from "@/store/lang-store";
import { LiveProofStrip } from "./live-proof-strip";

const BUDGET_STEPS = [5000, 10000, 25000, 50000, 100000, 250000, 500000, 1000000];

export function Hero() {
  const t = useT();
  const lang = useLangStore((s) => s.lang);

  // Default slider step index = 3 (50,000 BDT)
  const [stepIndex, setStepIndex] = useState(3);
  const selectedBudget = BUDGET_STEPS[stepIndex] ?? 50000;

  // Debounced budget state for fetching 3 results (400ms)
  const [debouncedBudget, setDebouncedBudget] = useState(selectedBudget);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedBudget(selectedBudget);
    }, 400);
    return () => clearTimeout(handler);
  }, [selectedBudget]);

  // Query 3 matching live results for that budget
  const { data: postsData, isLoading } = usePosts({
    limit: 3,
    wholesaleMax: debouncedBudget,
  });

  const { data: monthData } = usePosts({ limit: 1 });
  const { data: topDistricts } = useTopDistricts(64);

  const ideasCount = monthData?.total ?? 0;
  const districtsCount = topDistricts?.length ?? 64;

  const matchingPosts = postsData?.items ?? [];

  return (
    <section className="relative overflow-hidden pt-6 pb-8 md:pt-10 md:pb-8">
      <div className="container-page max-w-[1200px]">
        {/* Two-column grid on desktop (>= 1024px) */}
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-12 lg:gap-12 lg:items-start">
          {/* Left Column */}
          <div className="lg:col-span-7">
            {/* Rule D: Live Micro-label with pulse green dot */}
            <div className="flex items-center text-xs font-mono uppercase tracking-[0.08em] text-muted">
              <span className="mr-2 inline-block h-2 w-2 rounded-full bg-green motion-safe:animate-pulse" />
              {ideasCount >= 10 ? (
                lang === "bn" ? (
                  <span>
                    লাইভ খাতা · {toFormattedNumber(ideasCount, "bn")}টি আইডিয়া · {toFormattedNumber(districtsCount, "bn")}টি জেলা · ৮ বিভাগ
                  </span>
                ) : (
                  <span>
                    LIVE LEDGER · {toFormattedNumber(ideasCount, "en")} IDEAS · {toFormattedNumber(districtsCount, "en")} DISTRICTS · 8 DIVISIONS
                  </span>
                )
              ) : lang === "bn" ? (
                <span>লাইভ খাতা · ৮ বিভাগ · ৬৪ জেলা</span>
              ) : (
                <span>LIVE LEDGER · 8 DIVISIONS · 64 DISTRICTS</span>
              )}
            </div>

            {/* Headline */}
            <h1 className="mt-3 font-display text-[clamp(34px,4.6vw,60px)] font-bold leading-[1.18] :lang(bn):leading-[1.3] text-ink tracking-tight">
              {lang === "bn" ? (
                <>
                  <div>হাতে সামান্য পুঁজি।</div>
                  <div>মাথায় বড় আইডিয়া।</div>
                  <div>খুঁজে নিন নিজের ব্যবসা।</div>
                </>
              ) : (
                <>
                  <div>Small capital.</div>
                  <div>Big idea.</div>
                  <div>Find your business.</div>
                </>
              )}
            </h1>

            {/* Rule B: ONE-line subline in 18px text-muted */}
            <p className="mt-4 text-base md:text-[18px] text-muted max-w-[540px] truncate">
              {lang === "bn"
                ? "বাংলাদেশের উদ্যোক্তাদের দোকানি-খাতা।"
                : "A shopkeeper's ledger for Bangladeshi entrepreneurs."}
            </p>

            {/* Rule B: Buttons 44px tall */}
            <div className="mt-6 flex flex-wrap items-center gap-3">
              <Button asChild size="lg" className="h-11 bg-green text-white hover:bg-green/90 px-5">
                <Link href="/dashboard/create-post">
                  <Plus className="mr-1.5 h-4 w-4" />
                  {t("shareIdea")}
                </Link>
              </Button>

              <Button asChild variant="outline" size="lg" className="h-11 border-line text-ink hover:bg-surface px-5">
                <Link href="/explore">
                  {lang === "bn" ? "আইডিয়া দেখুন" : "Explore Ideas"}
                </Link>
              </Button>
            </div>
          </div>

          {/* Right Column: Compact Budget Slider Card (< 380px tall) */}
          <div className="lg:col-span-5">
            <div className="rounded-xl border border-line bg-surface p-5 shadow-sm">
              <div className="flex items-center justify-between gap-2">
                <span className="micro-label text-muted">
                  {lang === "bn" ? "আপনার বাজেট কত?" : "What is your budget?"}
                </span>
                <div className="font-display text-3xl font-bold tabular-nums text-green">
                  {formatBDT(selectedBudget, lang)}
                </div>
              </div>

              <div className="mt-4">
                <Slider
                  value={[stepIndex]}
                  min={0}
                  max={BUDGET_STEPS.length - 1}
                  step={1}
                  onValueChange={(val) => {
                    if (val[0] !== undefined) setStepIndex(val[0]);
                  }}
                  aria-label={lang === "bn" ? "বাজেট ফিল্টার" : "Budget filter"}
                />
              </div>

              <div className="mt-2 flex items-center justify-between text-[11px] font-mono text-muted">
                <span>{formatBDT(5000, lang)}</span>
                <span>{formatBDT(1000000, lang)}</span>
              </div>

              {/* 3 MINI Result Rows */}
              <div className="mt-4 space-y-1.5 border-t border-line/60 pt-3">
                <div className="micro-label mb-2 text-[10px] text-muted uppercase tracking-wider font-mono">
                  {lang === "bn" ? "বাজেট উপযোগী নমুনা খাতা" : "Matching sample entries"}
                </div>
                {isLoading ? (
                  <div className="space-y-2">
                    <Skeleton className="h-10 w-full rounded-lg" />
                    <Skeleton className="h-10 w-full rounded-lg" />
                    <Skeleton className="h-10 w-full rounded-lg" />
                  </div>
                ) : matchingPosts.length > 0 ? (
                  matchingPosts.slice(0, 3).map((post) => {
                    const marginPct = Math.round(
                      (((post.retailSellPrice ?? post.retailPrice) - post.wholesalePrice) / (post.wholesalePrice || 1)) * 100
                    );
                    return (
                      <Link
                        key={post.id}
                        href={`/post/${post.id}`}
                        className="group flex items-center justify-between gap-3 rounded-lg border border-line/60 bg-background/50 px-3 py-2 transition-all hover:border-green/50 hover:bg-green/10 shadow-2xs"
                      >
                        <div className="min-w-0 flex-1">
                          <span className="font-semibold text-xs sm:text-sm text-ink group-hover:text-green truncate block leading-snug">
                            {post.title}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 shrink-0">
                          <span className="rounded bg-surface px-1.5 py-0.5 text-[10px] font-mono text-muted border border-line/50">
                            {getDistrictLabel(post.district) || post.district}
                          </span>
                          <span className="font-mono text-xs font-bold text-green">
                            +{marginPct}%
                          </span>
                        </div>
                      </Link>
                    );
                  })
                ) : (
                  <div className="py-3 text-center text-xs text-muted border border-dashed border-line rounded-lg">
                    {lang === "bn" ? "এই বাজেটে নমুনা খাতা পাওয়া যায়নি" : "No sample entries found for this budget"}
                  </div>
                )}
              </div>

              {/* Link at bottom */}
              <div className="mt-3 border-t border-line/40 pt-2.5 text-right">
                <Link
                  href={`/ai-advisor?budget=${selectedBudget}`}
                  className="inline-flex items-center gap-1 text-xs font-semibold text-green hover:underline"
                >
                  <span>{lang === "bn" ? "AI পরামর্শ নিন" : "Get AI Advice"}</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Full width Live Proof Strip below hero (24px top margin) */}
        <div className="mt-6">
          <LiveProofStrip />
        </div>

        {/* Scroll Notification Indicator to notify users of Explore Section below */}
        <div className="mt-8 flex flex-col items-center justify-center text-center">
          <Link
            href="/explore"
            className="group inline-flex items-center gap-2 rounded-full border border-green/30 bg-surface px-4 py-2 text-xs font-medium text-ink shadow-sm hover:border-green hover:text-green hover:shadow-md transition-all"
          >
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green opacity-75" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-green" />
            </span>
            <span>
              {lang === "bn"
                ? "নিচে শত শত জেলাভিত্তিক ব্যবসার আইডিয়া এক্সপ্লোর করুন"
                : "Explore Hundreds of District Venture Ideas Below"}
            </span>
            <ArrowRight className="h-3.5 w-3.5 text-green transition-transform duration-200 group-hover:translate-x-1" />
          </Link>
        </div>
      </div>
    </section>
  );
}
