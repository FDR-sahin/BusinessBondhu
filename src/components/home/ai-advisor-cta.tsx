"use client";

import { ArrowRight, Sparkles } from "lucide-react";
import Link from "next/link";
import { FadeIn } from "@/components/shared/motion";
import { Button } from "@/components/ui/button";
import { useT } from "@/lib/i18n";
import { formatBDT } from "@/lib/utils";
import { useLangStore } from "@/store/lang-store";

const BUDGET_VALUES = [5000, 10000, 20000, 50000];

export function AiAdvisorCta() {
  const t = useT();
  const lang = useLangStore((s) => s.lang);

  return (
    <section className="section" aria-labelledby="ai-cta-title">
      <div className="container-page">
        <FadeIn>
          <div className="relative overflow-hidden rounded-2xl border-2 border-secondary/60 bg-card p-6 shadow-md md:p-12">
            <div className="relative grid items-center gap-10 md:grid-cols-[1fr_auto]">
              <div className="max-w-2xl">
                <p className="mb-3 text-sm font-semibold text-muted uppercase tracking-wider">
                  {t("aiAdvisorBadge")}
                </p>
                <h2 id="ai-cta-title" className="font-display text-2xl font-bold leading-snug text-ink md:text-4xl">
                  {t("aiAdvisorCtaTitle")}
                </h2>
                <p className="mt-4 text-muted text-base leading-relaxed">
                  {t("aiAdvisorCtaDesc")}
                </p>
                <div className="mt-5 flex flex-wrap gap-2" role="list" aria-label={t("aiAdvisorBadge")}>
                  {BUDGET_VALUES.map((val) => (
                    <Link
                      key={val}
                      role="listitem"
                      href={`/ai-advisor?budget=${val}`}
                      className="rounded-lg border border-line bg-surface px-3 py-1.5 text-sm font-medium tabular-nums text-ink transition-colors hover:border-green hover:bg-green/10"
                    >
                      {formatBDT(val, lang)}
                    </Link>
                  ))}
                </div>
                <Button asChild size="lg" className="mt-8 bg-green text-white hover:bg-green/90">
                  <Link href="/ai-advisor">
                    {t("getAdvice")} <ArrowRight aria-hidden className="ml-1.5 h-4 w-4" />
                  </Link>
                </Button>
              </div>

              <div aria-hidden className="hidden h-36 w-36 items-center justify-center rounded-2xl border border-line bg-surface text-green md:flex">
                <Sparkles className="h-16 w-16" strokeWidth={1.5} />
              </div>
            </div>
          </div>
        </FadeIn>
      </div>
    </section>
  );
}
