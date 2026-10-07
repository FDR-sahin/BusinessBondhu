"use client";

import { Eye, FileText, Heart, MessageSquare, Plus, Sparkles } from "lucide-react";
import Link from "next/link";
import { useMemo } from "react";
import { ChartCard } from "@/components/analysis/chart-card";
import { QueryError } from "@/components/shared/query-error";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Skeleton, StatCardSkeleton } from "@/components/ui/skeleton";
import { StatCard } from "@/components/ui/stat-card";
import { useOverview } from "@/hooks/use-dashboard";
import { getCategory } from "@/lib/constants";
import { toBanglaNumber } from "@/lib/utils";
import { useAuthStore } from "@/store/auth-store";
import { ActivityFeed } from "./activity-feed";
import { MyCategoryChart, WeeklyLikesChart } from "./dashboard-charts";

const weekday = (iso: string) => new Intl.DateTimeFormat("bn-BD", { weekday: "short" }).format(new Date(`${iso}T00:00:00`));

export function OverviewView() {
  const name = useAuthStore((s) => s.user?.name);
  const { data, isPending, isError, refetch } = useOverview();

  const view = useMemo(
    () =>
      data && {
        likes: data.weeklyLikes.map((d) => ({ name: weekday(d.date), likes: d.likes })),
        cats: data.postsByCategory.map((c) => ({ name: getCategory(c.category)?.nameBn ?? c.category, count: c.count })),
      },
    [data],
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-semibold leading-snug md:text-3xl">স্বাগতম, {name}</h2>
          <p className="mt-1 text-ink-secondary">আপনার পোস্টের সার্বিক অবস্থা এক নজরে।</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button asChild><Link href="/dashboard/create-post"><Plus aria-hidden /> নতুন পোস্ট</Link></Button>
          <Button asChild variant="outline"><Link href="/ai-advisor"><Sparkles aria-hidden /> AI পরামর্শ</Link></Button>
        </div>
      </div>

      {isError ? (
        <QueryError onRetry={() => void refetch()} />
      ) : isPending || !data || !view ? (
        <div role="status" aria-label="লোড হচ্ছে" className="space-y-6">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">{[0, 1, 2, 3].map((i) => <StatCardSkeleton key={i} />)}</div>
          <div className="grid gap-6 lg:grid-cols-2">{[0, 1].map((i) => <Card key={i} className="p-6"><Skeleton className="mb-4 h-6 w-1/2" /><Skeleton className="h-56 w-full" /></Card>)}</div>
        </div>
      ) : (
        <>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <StatCard label="আমার পোস্ট" value={data.totals.posts} icon={FileText} />
            <StatCard label="মোট লাইক" value={data.totals.likes} icon={Heart} />
            <StatCard label="মোট ভিউ" value={data.totals.views} icon={Eye} />
            <StatCard label="মোট মন্তব্য" value={data.totals.comments} icon={MessageSquare} />
          </div>

          <div className="grid gap-6 lg:grid-cols-2">
            <ChartCard title="সাপ্তাহিক লাইক" description="গত ৭ দিনে পাওয়া লাইক" height={260}
              summary={view.likes.map((d) => `${d.name} ${toBanglaNumber(d.likes)}`).join(", ")} empty={view.likes.length === 0}>
              <WeeklyLikesChart data={view.likes} />
            </ChartCard>
            <ChartCard title="ক্যাটাগরি অনুযায়ী আমার পোস্ট" description="কোন খাতে কয়টি পোস্ট করেছেন" height={260} minWidth={460}
              summary={view.cats.map((d) => `${d.name} ${toBanglaNumber(d.count)}`).join(", ")} empty={view.cats.length === 0}>
              <MyCategoryChart data={view.cats} />
            </ChartCard>
          </div>

          <ActivityFeed events={data.activity} />
        </>
      )}
    </div>
  );
}
