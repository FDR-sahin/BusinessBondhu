"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Slider } from "@/components/ui/slider";
import { Skeleton } from "@/components/ui/skeleton";
import { getDistrictLabel } from "@/lib/bd-data";
import { usePosts } from "@/hooks/use-posts";
import { formatBDT } from "@/lib/utils";
import { useLangStore } from "@/store/lang-store";

const BUDGET_STEPS = [5000, 10000, 25000, 50000, 100000, 250000, 500000, 1000000];

export function BudgetCard() {
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
    <div className="rounded-2xl border border-line bg-surface p-5 shadow-sm sticky top-20">
      {/* Top Section: Budget Console Filter */}
      <div className="flex items-center justify-between gap-3">
        <span className="text-xs sm:text-sm font-mono uppercase tracking-wider font-semibold text-muted">
          {lang === "bn" ? "আপনার বাজেট কত?" : "What is your budget?"}
        </span>
        <div className="font-display text-2xl sm:text-3xl font-bold tabular-nums text-green leading-none">
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

      <div className="mt-2 flex items-center justify-between text-[11px] font-mono font-medium text-muted">
        <span>{formatBDT(5000, lang)}</span>
        <span>{formatBDT(1000000, lang)}</span>
      </div>

      {/* Divider */}
      <div className="my-4 border-t border-line/60" />

      {/* Middle Section: 3 Matching Entries */}
      <div className="flex items-center justify-between gap-2 pb-2.5">
        <div className="text-xs font-mono uppercase tracking-wider font-semibold text-ink">
          {lang === "bn" ? "বাজেট উপযোগী নমুনা খাতা" : "Matching sample entries"}
        </div>
        <span className="rounded-full bg-green/10 border border-green/20 px-2.5 py-0.5 text-xs font-mono font-bold text-green">
          {lang === "bn" ? `${matchingPosts.length}টি` : `${matchingPosts.length}`}
        </span>
      </div>

      <div className="space-y-2">
        {isLoading ? (
          <div className="space-y-2">
            <Skeleton className="h-12 w-full rounded-xl" />
            <Skeleton className="h-12 w-full rounded-xl" />
            <Skeleton className="h-12 w-full rounded-xl" />
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
                className="group flex items-center justify-between gap-2 rounded-xl border border-line/60 bg-background/60 p-2.5 sm:p-3 transition-all hover:border-green/50 hover:bg-green/10 shadow-2xs"
              >
                <div className="min-w-0 flex-1">
                  <span className="font-semibold text-xs sm:text-sm text-ink group-hover:text-green truncate block leading-snug">
                    {post.title}
                  </span>
                </div>
                <div className="flex items-center gap-1.5 shrink-0">
                  <span className="rounded bg-surface px-1.5 py-0.5 text-[10px] font-mono font-medium text-muted border border-line/60">
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
          <div className="py-4 text-center text-xs text-muted border border-dashed border-line rounded-xl">
            {lang === "bn" ? "এই বাজেটে নমুনা খাতা পাওয়া যায়নি" : "No sample entries found for this budget"}
          </div>
        )}
      </div>

      {/* Bottom Section: AI Link */}
      <div className="mt-4 border-t border-line/60 pt-3 text-right">
        <Link
          href={`/ai-advisor?budget=${selectedBudget}`}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-green hover:underline"
        >
          <span>{lang === "bn" ? "AI পরামর্শ নিন" : "Get AI Advice"}</span>
          <ArrowRight className="h-3.5 w-3.5" />
        </Link>
      </div>
    </div>
  );
}
