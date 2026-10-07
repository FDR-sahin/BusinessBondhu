import { Trophy } from "lucide-react";
import { UserAvatar } from "@/components/ui/avatar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";
import { getCategory } from "@/lib/constants";
import { toBanglaNumber } from "@/lib/utils";
import type { AnalysisData } from "@/types";

export function TopContributors({ items }: { items: AnalysisData["topContributors"] }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>সেরা অবদানকারী</CardTitle>
        <CardDescription>যারা সবচেয়ে বেশি পোস্ট শেয়ার করেছেন</CardDescription>
      </CardHeader>
      <CardContent>
        {items.length === 0 ? (
          <EmptyState icon={Trophy} title="এখনো কেউ নেই" className="py-10" />
        ) : (
          <ol className="divide-y divide-border">
            {items.slice(0, 5).map((u, i) => (
              <li key={u.id} className="flex items-center gap-3 py-3">
                <span className="w-6 text-center text-sm font-semibold text-ink-secondary">{toBanglaNumber(i + 1)}</span>
                <UserAvatar name={u.name} src={u.avatar} className="h-10 w-10" />
                <span className="line-clamp-1 flex-1 font-medium">{u.name}</span>
                <span className="text-sm text-ink-secondary">{toBanglaNumber(u.postCount)}টি পোস্ট</span>
              </li>
            ))}
          </ol>
        )}
      </CardContent>
    </Card>
  );
}

export function ActiveCategories({ items }: { items: { category: string; count: number }[] }) {
  const top = items.slice(0, 5);
  const max = Math.max(1, ...top.map((c) => c.count));

  return (
    <Card>
      <CardHeader>
        <CardTitle>সবচেয়ে সক্রিয় ক্যাটাগরি</CardTitle>
        <CardDescription>যেসব খাতে সবচেয়ে বেশি পোস্ট হয়েছে</CardDescription>
      </CardHeader>
      <CardContent>
        <ul className="space-y-4">
          {top.map((c) => {
            const cat = getCategory(c.category);
            const Icon = cat?.icon;
            return (
              <li key={c.category} className="flex items-center gap-3">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary-soft text-primary-soft-foreground">
                  {Icon && <Icon className="h-5 w-5" aria-hidden />}
                </span>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between gap-2">
                    <span className="line-clamp-1 font-medium">{cat?.nameBn ?? c.category}</span>
                    <span className="shrink-0 text-sm text-ink-secondary">{toBanglaNumber(c.count)}টি</span>
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
