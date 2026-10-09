"use client";

import { AlertCircle, Info, SearchX, Sparkles } from "lucide-react";
import { Stagger, StaggerItem } from "@/components/shared/motion";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";
import { Skeleton } from "@/components/ui/skeleton";
import { getErrorMessage } from "@/lib/api";
import { formatLocation } from "@/lib/bd-data";
import { formatBDT, toFormattedNumber } from "@/lib/utils";
import { useLangStore } from "@/store/lang-store";
import type { AdvisorRequest, AdvisorResponse } from "@/types";
import { ResultCard } from "./result-card";

interface ResultsPanelProps {
  status: "idle" | "pending" | "error" | "success";
  request?: AdvisorRequest;
  data?: AdvisorResponse;
  error?: unknown;
  onRetry: () => void;
}

function ResultSkeleton() {
  return (
    <Card className="space-y-5 p-6">
      <Skeleton className="h-6 w-2/3" />
      <div className="space-y-2">{[0, 1, 2, 3].map((i) => <Skeleton key={i} className="h-4 w-full" />)}</div>
      <div className="grid gap-3 sm:grid-cols-2"><Skeleton className="h-20" /><Skeleton className="h-20" /></div>
      <Skeleton className="h-3 w-full" />
      <Skeleton className="h-16 w-full" />
    </Card>
  );
}

export function ResultsPanel({ status, request, data, error, onRetry }: ResultsPanelProps) {
  const lang = useLangStore((s) => s.lang);

  return (
    <div aria-live="polite" className="space-y-6">
      {status === "idle" && (
        <EmptyState
          icon={Sparkles}
          title={lang === "en" ? "Your Advice Will Appear Here" : "আপনার পরামর্শ এখানে দেখা যাবে"}
          description={
            lang === "en"
              ? "Enter your budget and location in the form on the left, then click 'Get Advice'. You'll receive business ideas in seconds."
              : "বাঁ দিকের ফর্মে বাজেট ও এলাকা দিয়ে “পরামর্শ নিন” চাপুন। কয়েক সেকেন্ডের মধ্যে ব্যবসার আইডিয়া পাবেন।"
          }
          className="py-20"
        />
      )}

      {status === "pending" && (
        <div role="status" aria-busy="true" className="space-y-6">
          <p className="flex items-center gap-2 text-ink-secondary">
            <Sparkles className="h-4 w-4 animate-pulse text-secondary" aria-hidden />
            {lang === "en" ? "AI is generating business ideas for you..." : "এআই আপনার জন্য আইডিয়া খুঁজছে…"}
          </p>
          {[0, 1].map((i) => <ResultSkeleton key={i} />)}
        </div>
      )}

      {status === "error" && (
        <EmptyState
          icon={AlertCircle}
          title={lang === "en" ? "Could Not Fetch Advice" : "পরামর্শ আনা যায়নি"}
          description={getErrorMessage(error)}
          action={
            <Button variant="outline" onClick={onRetry}>
              {lang === "en" ? "Try Again" : "আবার চেষ্টা করুন"}
            </Button>
          }
        />
      )}

      {status === "success" && data && request && (
        data.suggestions.length === 0 ? (
          <EmptyState
            icon={SearchX}
            title={lang === "en" ? "No Ideas Found for This Budget" : "এই বাজেটে কোনো আইডিয়া পাওয়া যায়নি"}
            description={
              lang === "en"
                ? "Try increasing your budget or selecting a different location/category."
                : "বাজেট একটু বাড়িয়ে, অন্য এলাকা বা ক্যাটাগরি বেছে আবার চেষ্টা করুন।"
            }
          />
        ) : (
          <>
            <div>
              <h2 className="text-xl font-semibold md:text-2xl">
                {lang === "en"
                  ? `${toFormattedNumber(data.suggestions.length, "en")} Idea${data.suggestions.length > 1 ? "s" : ""} for ${formatBDT(request.budget, "en")} Budget`
                  : `${formatBDT(request.budget, "bn")} বাজেটে ${toFormattedNumber(data.suggestions.length, "bn")}টি আইডিয়া`}
              </h2>
              {(request.division || request.district) && (
                <p className="mt-1 text-sm text-ink-secondary">
                  {lang === "en" ? "Location: " : "এলাকা: "}
                  {formatLocation({ division: request.division ?? "", district: request.district ?? "", area: request.area }).replace(/^ → /, "")}
                </p>
              )}
            </div>

            <Stagger className="space-y-6">
              {data.suggestions.map((s, i) => (
                <StaggerItem key={s.id ?? `${s.name}-${i}`}>
                  <ResultCard suggestion={s} request={request} />
                </StaggerItem>
              ))}
            </Stagger>

            <p className="flex gap-2 rounded-xl border border-border bg-surface p-4 text-sm text-ink-secondary">
              <Info className="mt-0.5 h-4 w-4 shrink-0" aria-hidden />
              {lang === "en"
                ? "These are AI-generated estimates. Actual costs and profits depend on market conditions, seasonality, and your execution. Please verify locally before investing."
                : "এগুলো এআই-এর আনুমানিক হিসাব। বাস্তব খরচ ও লাভ বাজার, মৌসুম ও আপনার দক্ষতার ওপর নির্ভর করে। ব্যবসা শুরুর আগে নিজে যাচাই করে নিন।"}
            </p>
          </>
        )
      )}
    </div>
  );
}
