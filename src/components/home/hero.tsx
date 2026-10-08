"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowRight, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Skeleton } from "@/components/ui/skeleton";
import { EmptyState } from "@/components/ui/empty-state";
import { PenMark } from "@/components/ui/pen-mark";
import { PostCard } from "@/components/post/post-card";
import { usePosts } from "@/hooks/use-posts";
import { useT } from "@/lib/i18n";
import { formatBDT } from "@/lib/utils";
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

  const matchingPosts = postsData?.items ?? [];

  return (
    <section className="relative overflow-hidden py-10 md:py-16">
      <div className="container-page max-w-[1200px]">
        {/* 1. Micro-label */}
        <div className="micro-label text-muted">
          {lang === "bn" ? "০১ · আইডিয়া খুঁজুন" : "01 · FIND IDEAS"}
        </div>

        {/* 2. 3-line Headline with PenMarks */}
        <h1 className="mt-4 font-display text-[clamp(2.5rem,6.5vw,5.5rem)] font-bold leading-[1.15] text-ink tracking-tight">
          {lang === "bn" ? (
            <>
              <div>
                হাতে <PenMark variant="underline">সামান্য পুঁজি।</PenMark>
              </div>
              <div>
                মাথায় <PenMark variant="circle">বড় আইডিয়া।</PenMark>
              </div>
              <div>খুঁজে নিন নিজের ব্যবসা।</div>
            </>
          ) : (
            <>
              <div>
                Small <PenMark variant="underline">capital.</PenMark>
              </div>
              <div>
                Big <PenMark variant="circle">idea.</PenMark>
              </div>
              <div>Find your business.</div>
            </>
          )}
        </h1>

        {/* 3. Muted sentence (max 90 chars) + Two Buttons */}
        <p className="mt-5 max-w-[680px] text-base md:text-lg text-ink/75 leading-relaxed">
          {lang === "bn"
            ? "বাংলাদেশের উদ্যোক্তাদের এলাকাভিত্তিক খাতা। বাজেট অনুযায়ী সঠিক ব্যবসা বেছে নিন।"
            : "A shopkeeper's ledger for Bangladeshi entrepreneurs. Find the right business for your budget."}
        </p>

        <div className="mt-6 flex flex-wrap items-center gap-3">
          <Button asChild size="lg" className="bg-green text-white hover:bg-green/90">
            <Link href="/dashboard/create-post">
              <Plus className="mr-2 h-4 w-4" />
              {t("shareIdea")}
            </Link>
          </Button>

          <Button asChild variant="outline" size="lg" className="border-line text-ink hover:bg-surface">
            <Link href="/explore">
              {lang === "bn" ? "আইডিয়া দেখুন" : "Explore Ideas"}
            </Link>
          </Button>
        </div>

        {/* 4. Budget Slider Card */}
        <div className="mt-12 rounded-xl border border-line bg-surface p-6 md:p-8 shadow-sm">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-baseline sm:justify-between">
            <span className="micro-label text-muted">
              {lang === "bn" ? "আপনার বাজেট কত?" : "What is your budget?"}
            </span>
            <div className="font-display text-4xl md:text-5xl font-bold tabular-nums text-green">
              {formatBDT(selectedBudget, lang)}
            </div>
          </div>

          <div className="mt-6">
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

          <div className="mt-4 flex items-center justify-between text-xs text-muted">
            <span>{formatBDT(5000, lang)}</span>
            <span>{formatBDT(1000000, lang)}</span>
          </div>

          <div className="mt-6 border-t border-line/60 pt-4 flex justify-end">
            <Link
              href={`/ai-advisor?budget=${selectedBudget}`}
              className="inline-flex items-center gap-1.5 text-sm font-medium text-green hover:underline"
            >
              <span>{lang === "bn" ? "AI পরামর্শ নিন" : "Get AI Advice"}</span>
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>

        {/* 5. 3 Live PriceSlip results for that budget */}
        <div className="mt-8">
          <div className="mb-4 flex items-center justify-between">
            <span className="micro-label text-muted">
              {lang === "bn"
                ? `এই বাজেটের উপযোগী শীর্ষ ৩টি খাতা (${formatBDT(selectedBudget, lang)})`
                : `Top 3 matching ledger entries for ${formatBDT(selectedBudget, lang)}`}
            </span>
          </div>

          {isLoading ? (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              <Skeleton className="h-48 rounded-xl" />
              <Skeleton className="h-48 rounded-xl" />
              <Skeleton className="h-48 rounded-xl" />
            </div>
          ) : matchingPosts.length > 0 ? (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {matchingPosts.slice(0, 3).map((post) => (
                <PostCard key={post.id} post={post} />
              ))}
            </div>
          ) : (
            <EmptyState
              title={lang === "bn" ? "এই বাজেটে কোনো আইডিয়া পাওয়া যায়নি" : "No business ideas found for this budget"}
              description={lang === "bn" ? "বাজেট সামান্য বাড়িয়ে চেষ্টা করে দেখুন।" : "Try increasing the budget slightly."}
            />
          )}
        </div>

        {/* 6. Slim text link row */}
        <div className="mt-6 text-center sm:text-left">
          <Link
            href="/explore"
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-ink/80 hover:text-green transition-colors"
          >
            <span>{lang === "bn" ? "অথবা এলাকা অনুযায়ী খুঁজুন" : "Or browse by location"}</span>
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        {/* 7. Live Proof Strip */}
        <LiveProofStrip />
      </div>
    </section>
  );
}
