"use client";

import { BLOG_CATEGORIES } from "@/lib/blog";
import { useT } from "@/lib/i18n";
import { toFormattedNumber } from "@/lib/utils";
import { useLangStore } from "@/store/lang-store";

export function BlogSidebarLedger({ totalPosts = 12 }: { totalPosts?: number }) {
  const t = useT();
  const lang = useLangStore((s) => s.lang);

  return (
    <aside className="space-y-6">
      {/* Category Ledger Card */}
      <div className="rounded-xl border-2 border-line bg-surface p-5 shadow-[3px_3px_0px_0px_rgba(23,19,15,0.75)] dark:shadow-[3px_3px_0px_0px_rgba(243,239,230,0.15)]">
        <h3 className="border-b border-line pb-3 font-mono text-xs font-bold uppercase tracking-wider text-ink">
          {t("categoryLedger")}
        </h3>
        <ul className="mt-3 divide-y divide-line/60">
          {BLOG_CATEGORIES.map((c, idx) => {
            const num = String(idx + 1).padStart(2, "0");
            const label = lang === "bn" ? c.label : c.labelEn;
            // Realistic item counts for ledger demo
            const counts = [14, 9, 7, 5, 4];
            const count = counts[idx] ?? 3;

            return (
              <li key={c.slug} className="flex items-center justify-between py-2.5 font-mono text-xs">
                <span className="text-muted">
                  <strong className="mr-2 font-mono font-semibold text-ink">{num}</strong>
                  {label}
                </span>
                <span className="font-mono font-bold text-ink tabular-nums">
                  {toFormattedNumber(count, lang)}
                </span>
              </li>
            );
          })}
        </ul>
      </div>

      {/* Average Demand / Profit Ledger Box */}
      <div className="rounded-xl border-2 border-line bg-surface p-5 shadow-[3px_3px_0px_0px_rgba(23,19,15,0.75)] dark:shadow-[3px_3px_0px_0px_rgba(243,239,230,0.15)]">
        <div className="font-mono text-xs font-bold uppercase tracking-wider text-muted">
          {t("totalArticles")}
        </div>
        <div className="mt-3 flex items-baseline justify-between">
          <span className="font-display text-3xl font-extrabold text-green tabular-nums">
            {toFormattedNumber(totalPosts, lang)}
          </span>
          <span className="font-mono text-xs text-muted max-w-[140px] text-right">
            {lang === "bn" ? "সাপ্তাহিক নতুন গাইড যুক্ত করা হয়।" : "Updated weekly by community editors."}
          </span>
        </div>
      </div>
    </aside>
  );
}
