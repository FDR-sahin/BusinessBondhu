"use client";

import { Trophy } from "lucide-react";
import { UserAvatar } from "@/components/ui/avatar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";
import { getCategory } from "@/lib/constants";
import { useT } from "@/lib/i18n";
import { toFormattedNumber } from "@/lib/utils";
import { useLangStore } from "@/store/lang-store";
import type { AnalysisData } from "@/types";

export function TopContributors({ items }: { items: AnalysisData["topContributors"] }) {
  const t = useT();
  const lang = useLangStore((s) => s.lang);

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t("topContributorsTitle")}</CardTitle>
        <CardDescription>{t("topContributorsDesc")}</CardDescription>
      </CardHeader>
      <CardContent>
        {items.length === 0 ? (
          <EmptyState icon={Trophy} title={t("noContributorsYet")} className="py-10" />
        ) : (
          <ol className="divide-y divide-border">
            {items.slice(0, 5).map((u, i) => (
              <li key={u.id} className="flex items-center gap-3 py-3">
                <span className="w-6 text-center text-sm font-semibold text-muted font-mono">
                  {toFormattedNumber(i + 1, lang)}
                </span>
                <UserAvatar name={u.name} src={u.avatar} className="h-10 w-10" />
                <span className="line-clamp-1 flex-1 font-medium text-ink">{u.name}</span>
                <span className="text-sm text-muted font-mono">
                  {toFormattedNumber(u.postCount, lang)} {t("postsUnitText")}
                </span>
              </li>
            ))}
          </ol>
        )}
      </CardContent>
    </Card>
  );
}

export function ActiveCategories({ items }: { items: { category: string; count: number }[] }) {
  const t = useT();
  const lang = useLangStore((s) => s.lang);
  const top = items.slice(0, 5);
  const max = Math.max(1, ...top.map((c) => c.count));

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t("mostActiveCategoriesTitle")}</CardTitle>
        <CardDescription>{t("mostActiveCategoriesDesc")}</CardDescription>
      </CardHeader>
      <CardContent>
        <ul className="space-y-4">
          {top.map((c) => {
            const cat = getCategory(c.category);
            const Icon = cat?.icon;
            const categoryName = cat ? (lang === "bn" ? cat.nameBn : cat.nameEn) : c.category;

            return (
              <li key={c.category} className="flex items-center gap-3">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary-soft text-primary-soft-foreground">
                  {Icon && <Icon className="h-5 w-5" aria-hidden />}
                </span>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between gap-2">
                    <span className="line-clamp-1 font-medium text-ink">{categoryName}</span>
                    <span className="shrink-0 text-sm font-mono text-muted">
                      {toFormattedNumber(c.count, lang)} {t("postsUnitText")}
                    </span>
                  </div>
                  <div aria-hidden className="mt-1.5 h-2 overflow-hidden rounded-full bg-border">
                    <div className="h-full rounded-full bg-primary" style={{ width: `${(c.count / max) * 100}%` }} />
                  </div>
                </div>
              </li>
            );
          })}
        </ul>
      </CardContent>
    </Card>
  );
}
