"use client";

import { motion } from "framer-motion";
import { Bookmark, BookmarkCheck, Check, Lightbulb, TrendingUp } from "lucide-react";
import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useSaveSuggestion } from "@/hooks/use-advisor";
import { useRequireAuth } from "@/hooks/use-require-auth";
import { riskLevel } from "@/lib/advisor";
import { getCategory } from "@/lib/constants";
import { formatBDT, toFormattedNumber } from "@/lib/utils";
import { useLangStore } from "@/store/lang-store";
import type { AdvisorRequest, AdvisorSuggestion } from "@/types";

export function ResultCard({ suggestion, request }: { suggestion: AdvisorSuggestion; request: AdvisorRequest }) {
  const lang = useLangStore((s) => s.lang);
  const requireAuth = useRequireAuth();
  const save = useSaveSuggestion();
  const [saved, setSaved] = useState(false);

  const category = suggestion.category ? getCategory(suggestion.category) : undefined;
  const total = suggestion.totalCost ?? suggestion.costBreakdown.reduce((sum, r) => sum + r.amount, 0);
  const withinBudget = total <= request.budget;
  const percent = Math.min(100, Math.max(0, Math.round(suggestion.riskPercent)));
  const risk = riskLevel(percent, lang);

  function onSave() {
    if (!requireAuth(lang === "en" ? "Please login to save suggestions" : "পরামর্শ সেভ করতে লগইন করুন")) return;
    save.mutate({ suggestion, inputs: request }, { onSuccess: () => setSaved(true) });
  }

  return (
    <Card className="space-y-6 p-6">
      <header className="flex flex-wrap items-start justify-between gap-3">
        <div className="space-y-2">
          <h3 className="text-lg font-semibold leading-snug md:text-xl">{suggestion.name}</h3>
          <div className="flex flex-wrap gap-2">
            {category && <Badge variant="default">{lang === "en" ? category.nameEn : category.nameBn}</Badge>}
            <Badge variant={withinBudget ? "success" : "warning"}>
              {withinBudget
                ? lang === "en" ? "Within Budget" : "বাজেটের মধ্যে"
                : lang === "en" ? "Exceeds Budget" : "বাজেটের চেয়ে বেশি"}
            </Badge>
          </div>
        </div>
      </header>

      {/* Startup cost */}
      <div>
        <h4 className="mb-2 text-sm font-semibold">
          {lang === "en" ? "Initial Cost Breakdown" : "শুরুর খরচের হিসাব"}
        </h4>
        <table className="w-full text-sm">
          <caption className="sr-only">
            {suggestion.name} {lang === "en" ? "cost breakdown" : "-এর শুরুর খরচ"}
          </caption>
          <tbody>
            {suggestion.costBreakdown.map((row) => (
              <tr key={row.item} className="border-b border-border">
                <th scope="row" className="py-2 text-left font-normal text-ink-secondary">{row.item}</th>
                <td className="py-2 text-right font-medium tabular-nums">{formatBDT(row.amount, lang)}</td>
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr>
              <th scope="row" className="pt-3 text-left font-semibold">
                {lang === "en" ? "Total Cost" : "মোট খরচ"}
              </th>
              <td className="pt-3 text-right font-semibold tabular-nums">{formatBDT(total, lang)}</td>
            </tr>
          </tfoot>
        </table>
      </div>

      {/* Profit (green accent) */}
      <div className="grid gap-3 sm:grid-cols-2">
        {[
          {
            label: lang === "en" ? "Estimated Daily Profit" : "দৈনিক আনুমানিক লাভ",
            value: suggestion.profitDaily,
          },
          {
            label: lang === "en" ? "Estimated Monthly Profit" : "মাসিক আনুমানিক লাভ",
            value: suggestion.profitMonthly,
          },
        ].map((p) => (
          <div key={p.label} className="rounded-xl bg-success-soft p-4 text-success-soft-foreground">
            <p className="flex items-center gap-1.5 text-sm font-medium">
              <TrendingUp className="h-4 w-4" aria-hidden />
              {p.label}
            </p>
            <p className="mt-1 text-2xl font-bold tabular-nums">{formatBDT(p.value, lang)}</p>
          </div>
        ))}
      </div>

      {/* Risk: <30 green · 30–60 yellow · >60 red */}
      <div>
        <div className="mb-2 flex items-center justify-between text-sm">
          <span className="font-semibold">{lang === "en" ? "Risk Analysis" : "ঝুঁকি"}</span>
          <span className={`font-medium ${risk.text}`}>
            {risk.label} · {toFormattedNumber(percent, lang)}%
          </span>
        </div>
        <div
          role="progressbar"
          aria-label={lang === "en" ? "Risk Level" : "ঝুঁকির মাত্রা"}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={percent}
          className="h-2.5 overflow-hidden rounded-full bg-border"
        >
          <motion.div
            className={`h-full rounded-full ${risk.bar}`}
            initial={{ width: 0 }}
            animate={{ width: `${percent}%` }}
            transition={{ duration: 0.4, ease: "easeOut" }}
          />
        </div>
      </div>

      <div>
        <h4 className="mb-1.5 text-sm font-semibold">
          {lang === "en" ? "Why It Works for This Area" : "কেন এই এলাকায় ভালো হবে"}
        </h4>
        <p className="text-ink-secondary">{suggestion.reason}</p>
      </div>

      {suggestion.tips.length > 0 && (
        <div>
          <h4 className="mb-2 flex items-center gap-1.5 text-sm font-semibold">
            <Lightbulb className="h-4 w-4 text-secondary" aria-hidden />
            {lang === "en" ? "Key Recommendations" : "টিপস"}
          </h4>
          <ul className="space-y-1.5">
            {suggestion.tips.map((t) => (
              <li key={t} className="flex gap-2 text-sm text-ink-secondary">
                <Check className="mt-1 h-4 w-4 shrink-0 text-success" aria-hidden />
                {t}
              </li>
            ))}
          </ul>
        </div>
      )}

      <div className="border-t border-border pt-4">
        <Button variant={saved ? "outline" : "primary"} onClick={onSave} loading={save.isPending} disabled={saved}>
          {saved ? <BookmarkCheck aria-hidden /> : <Bookmark aria-hidden />}
          {saved
            ? lang === "en" ? "Saved" : "সেভ করা হয়েছে"
            : lang === "en" ? "Save Suggestion" : "সেভ করুন"}
        </Button>
      </div>
    </Card>
  );
}
