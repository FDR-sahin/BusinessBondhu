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
    <section className="relative overflow-hidden pt-6 pb-8 md:pt-10 md:pb-10">
      <div className="container-page max-w-[1200px]">
        {/* Two-column grid on desktop (>= 1024px) */}
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-12 lg:gap-12 lg:items-center">
          {/* Left Column: Headline, Subline & Buttons */}
          <div className="lg:col-span-7">
            {/* Live Micro-label with pulse green dot */}
            <div className="flex items-center text-xs sm:text-sm font-mono uppercase tracking-[0.08em] text-muted">
              <span className="mr-2 inline-block h-2.5 w-2.5 rounded-full bg-green motion-safe:animate-pulse" />
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

            {/* Headline with commas for line stoppage in Bangla */}
            <h1 className="mt-4 font-display text-[clamp(36px,4.8vw,64px)] font-bold leading-[1.18] :lang(bn):leading-[1.28] text-ink tracking-tight">
              {lang === "bn" ? (
                <>
                  <div>হাতে সামান্য পুঁজি,</div>
                  <div>মাথায় বড় আইডিয়া,</div>
                  <div>খুঁজে নিন নিজের ব্যবসা।</div>
                </>
              ) : (
                <>
                  <div>Small capital,</div>
                  <div>Big ideas,</div>
                  <div>Find your business.</div>
                </>
              )}
            </h1>

            {/* Subline - Larger font size */}
            <p className="mt-4 text-lg md:text-[20px] text-muted max-w-[560px] leading-relaxed">
              {lang === "bn"
                ? "বাংলাদেশের উদ্যোক্তাদের দোকানি-খাতা।"
                : "A shopkeeper's ledger for Bangladeshi entrepreneurs."}
            </p>

            {/* Buttons Row */}
            <div className="mt-8 flex flex-wrap items-center gap-4">
              <Button asChild size="lg" className="h-12 bg-green text-white hover:bg-green/90 px-6 text-base font-semibold shadow-sm">
                <Link href="/dashboard/create-post">
                  <Plus className="mr-2 h-5 w-5" />
                  {t("shareIdea")}
                </Link>
              </Button>

              <Button asChild variant="outline" size="lg" className="h-12 border-line text-ink hover:bg-surface px-6 text-base font-medium shadow-2xs">
                <Link href="/explore">
                  {lang === "bn" ? "আইডিয়া দেখুন" : "Explore Ideas"}
                </Link>
              </Button>
            </div>
          </div>

          {/* Right Column: Complete Unified Card (Filter + Matching Entries) */}
          <div className="lg:col-span-5">
            <div className="rounded-2xl border border-line bg-surface p-6 shadow-md transition-shadow">
              {/* Top Section: Budget Console Filter */}
              <div className="flex items-center justify-between gap-3">
                <span className="text-xs sm:text-sm font-mono uppercase tracking-wider font-semibold text-muted">
                  {lang === "bn" ? "আপনার বাজেট কত?" : "What is your budget?"}
                </span>
                <div className="font-display text-3xl sm:text-[42px] font-bold tabular-nums text-green leading-none">
                  {formatBDT(selectedBudget, lang)}
                </div>
              </div>

              <div className="mt-5">
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

              <div className="mt-2.5 flex items-center justify-between text-xs font-mono font-medium text-muted">
                <span>{formatBDT(5000, lang)}</span>
                <span>{formatBDT(1000000, lang)}</span>
              </div>

              {/* Divider */}
              <div className="my-5 border-t border-line/60" />

              {/* Middle Section: 3 Matching Entries */}
              <div className="flex items-center justify-between gap-2 pb-3">
                <div className="text-xs sm:text-sm font-mono uppercase tracking-wider font-semibold text-ink">
                  {lang === "bn" ? "বাজেট উপযোগী নমুনা খাতা" : "Matching sample entries"}
                </div>
                <span className="rounded-full bg-green/10 border border-green/20 px-3 py-0.5 text-xs font-mono font-bold text-green">
                  {lang === "bn" ? `${matchingPosts.length}টি` : `${matchingPosts.length}`}
                </span>
              </div>

              <div className="space-y-2.5">
                {isLoading ? (
                  <div className="space-y-2.5">
                    <Skeleton className="h-14 w-full rounded-xl" />
                    <Skeleton className="h-14 w-full rounded-xl" />
                    <Skeleton className="h-14 w-full rounded-xl" />
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
                        className="group flex items-center justify-between gap-3 rounded-xl border border-line/60 bg-background/60 p-3 sm:p-3.5 transition-all hover:border-green/50 hover:bg-green/10 shadow-2xs"
                      >
                        <div className="min-w-0 flex-1">
                          <span className="font-semibold text-sm sm:text-[15px] text-ink group-hover:text-green truncate block leading-snug">
                            {post.title}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 shrink-0">
                          <span className="rounded bg-surface px-2 py-1 text-xs font-mono font-medium text-muted border border-line/60">
                            {getDistrictLabel(post.district) || post.district}
                          </span>
                          <span className="font-mono text-xs sm:text-sm font-bold text-green">
                            +{marginPct}%
                          </span>
                        </div>
                      </Link>
                    );
                  })
                ) : (
                  <div className="py-5 text-center text-xs sm:text-sm text-muted border border-dashed border-line rounded-xl">
                    {lang === "bn" ? "এই বাজেটে নমুনা খাতা পাওয়া যায়নি" : "No sample entries found for this budget"}
                  </div>
                )}
              </div>

              {/* Bottom Section: AI Link */}
              <div className="mt-5 border-t border-line/60 pt-3.5 text-right">
                <Link
                  href={`/ai-advisor?budget=${selectedBudget}`}
                  className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-green hover:underline"
                >
                  <span>{lang === "bn" ? "AI পরামর্শ নিন" : "Get AI Advice"}</span>
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Full width Live Proof Strip below hero */}
        <div className="mt-10">
          <LiveProofStrip />
        </div>

        {/* Explore Notification Indicator */}
        <div className="mt-8 flex flex-col items-center justify-center text-center">
          <Link
            href="/explore"
            className="group inline-flex items-center gap-2.5 rounded-full border border-green/30 bg-surface px-5 py-2.5 text-xs sm:text-sm font-medium text-ink shadow-sm hover:border-green hover:text-green hover:shadow-md transition-all"
          >
            <span className="relative flex h-2.5 w-2.5">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green opacity-75" />
              <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-green" />
            </span>
            <span>
              {lang === "bn"
                ? "নিচে শত শত জেলাভিত্তিক ব্যবসার আইডিয়া এক্সপ্লোর করুন"
                : "Explore Hundreds of District Venture Ideas Below"}
            </span>
            <ArrowRight className="h-4 w-4 text-green transition-transform duration-200 group-hover:translate-x-1" />
          </Link>
        </div>
      </div>
    </section>
  );
}
