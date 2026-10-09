"use client";

import { useSearchParams } from "next/navigation";
import { useRef } from "react";
import { useAdvisorSuggest } from "@/hooks/use-advisor";
import { MIN_BUDGET, parseAmount } from "@/lib/advisor";
import { useLangStore } from "@/store/lang-store";
import type { AdvisorRequest } from "@/types";
import { AdvisorForm } from "./advisor-form";
import { HowItWorks } from "./how-it-works";
import { ResultsPanel } from "./results-panel";

export function AdvisorView() {
  const lang = useLangStore((s) => s.lang);
  const params = useSearchParams();
  const fromUrl = parseAmount(params.get("budget") ?? ""); // e.g. from Home: /ai-advisor?budget=10000
  const defaultBudget = Number.isFinite(fromUrl) && fromUrl >= MIN_BUDGET ? fromUrl : undefined;

  const mutation = useAdvisorSuggest();
  const resultsRef = useRef<HTMLDivElement>(null);

  function run(request: AdvisorRequest) {
    mutation.mutate(request);
    // Single-column phones: jump to the results area (CSS scroll-behavior honors reduced motion).
    if (window.matchMedia("(max-width: 1023px)").matches) resultsRef.current?.scrollIntoView({ block: "start" });
  }

  return (
    <>
      <div className="container-page py-8 md:py-12">
        <header className="max-w-2xl">
          <h1 className="text-2xl font-semibold leading-snug md:text-4xl">
            {lang === "en" ? "AI Business Advisor" : "এআই ব্যবসা পরামর্শক"}
          </h1>
          <p className="mt-2 text-ink-secondary">
            {lang === "en"
              ? "Get customized business ideas with detailed cost breakdowns, estimated profits, and risk analysis based on your budget and location."
              : "আপনার বাজেট ও এলাকা অনুযায়ী খরচ, সম্ভাব্য লাভ ও ঝুঁকিসহ ব্যবসার আইডিয়া পান।"}
          </p>
        </header>

        <div className="mt-8 grid items-start gap-8 lg:grid-cols-[24rem_minmax(0,1fr)]">
          <AdvisorForm loading={mutation.isPending} defaultBudget={defaultBudget} onSubmit={run} />
          <div ref={resultsRef} className="scroll-mt-24">
            <ResultsPanel
              status={mutation.status}
              request={mutation.variables}
              data={mutation.data}
              error={mutation.error}
              onRetry={() => mutation.variables && mutation.mutate(mutation.variables)}
            />
          </div>
        </div>
      </div>
      <HowItWorks />
    </>
  );
}
