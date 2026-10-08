"use client";

import Link from "next/link";
import { LedgerRow } from "@/components/ui/ledger-row";
import { Skeleton } from "@/components/ui/skeleton";
import { getDistrictLabel } from "@/lib/bd-data";
import { usePosts, useTopDistricts } from "@/hooks/use-posts";
import { timeAgo, toFormattedNumber } from "@/lib/utils";
import { useLangStore } from "@/store/lang-store";

export function LiveProofStrip() {
  const lang = useLangStore((s) => s.lang);
  const { data: postsData, isLoading: postsLoading } = usePosts({ limit: 1, sort: "newest" });
  const { data: monthData, isLoading: monthLoading } = usePosts({ limit: 1 });
  const { data: topDistricts, isLoading: districtsLoading } = useTopDistricts(3);

  const latestPost = postsData?.items?.[0];
  const monthTotal = monthData?.total ?? 0;

  // Threshold checks per requirement: hide cell if value below threshold (e.g. < 10 ideas for stats, or no latest post)
  const showLatest = Boolean(latestPost);
  const showMonthCount = monthTotal >= 10;
  const showDistricts = Array.isArray(topDistricts) && topDistricts.length > 0;

  if (postsLoading || monthLoading || districtsLoading) {
    return (
      <div className="mt-8 rounded-xl border border-line bg-surface p-4">
        <Skeleton className="h-20 w-full rounded-lg" />
      </div>
    );
  }

  if (!showLatest && !showMonthCount && !showDistricts) {
    return null;
  }

  const maxDistrictCount = topDistricts?.[0]?.count || 1;

  return (
    <div className="mt-10 overflow-hidden rounded-xl border border-line bg-surface shadow-sm">
      <div className="grid grid-cols-1 divide-y divide-line md:grid-cols-3 md:divide-y-0 md:divide-x">
        {/* Cell 1: Latest Idea */}
        {showLatest && latestPost && (
          <div className="flex flex-col justify-between p-5">
            <div>
              <span className="micro-label block text-muted">
                {lang === "bn" ? "সর্বশেষ নতুন আইডিয়া" : "Latest Idea Shared"}
              </span>
              <Link
                href={`/post/${latestPost.id}`}
                className="mt-2 line-clamp-2 font-display text-base font-bold text-ink hover:text-green transition-colors"
              >
                {latestPost.title}
              </Link>
            </div>
            <div className="mt-4 flex items-center justify-between text-xs text-muted">
              <span className="font-medium text-ink/80">
                {getDistrictLabel(latestPost.district) || latestPost.district}
              </span>
              <span className="font-mono">{timeAgo(latestPost.createdAt, lang)}</span>
            </div>
          </div>
        )}

        {/* Cell 2: Ideas Shared This Month */}
        {showMonthCount && (
          <div className="flex flex-col justify-between p-5">
            <span className="micro-label block text-muted">
              {lang === "bn" ? "চলতি মাসে যৌথ আইডিয়া" : "Ideas Shared This Month"}
            </span>
            <div className="my-2 flex items-baseline gap-2">
              <span className="font-display text-4xl font-bold tabular-nums text-green">
                {toFormattedNumber(monthTotal, lang)}
              </span>
              <span className="text-xs font-medium text-muted">
                {lang === "bn" ? "টি যাচাইকৃত খাতা" : "verified entries"}
              </span>
            </div>
            <p className="text-xs text-muted">
              {lang === "bn" ? "প্রতিটি পোস্ট এলাকার উদ্যোক্তাদের দ্বারা সত্যতা যাচাইকৃত" : "Community moderated and verified"}
            </p>
          </div>
        )}

        {/* Cell 3: Top Districts */}
        {showDistricts && (
          <div className="p-4">
            <span className="micro-label block px-3 pt-1 pb-2 text-muted">
              {lang === "bn" ? "শীর্ষ সক্রিয় জেলা" : "Top Active Districts"}
            </span>
            <div className="divide-y divide-line/40">
              {topDistricts?.slice(0, 3).map((d, idx) => (
                <LedgerRow
                  key={d.district}
                  rank={idx + 1}
                  name={getDistrictLabel(d.district) || d.district}
                  count={d.count}
                  maxCount={maxDistrictCount}
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
