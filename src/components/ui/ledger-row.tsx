"use client";

import React from "react";
import { toFormattedNumber, cn } from "@/lib/utils";
import { useLangStore } from "@/store/lang-store";

interface LedgerRowProps {
  rank?: number | string;
  name: string;
  count: number;
  maxCount?: number;
  amount?: number | string;
  className?: string;
  onClick?: () => void;
}

export function LedgerRow({
  rank,
  name,
  count,
  maxCount = 100,
  amount,
  className,
  onClick,
}: LedgerRowProps) {
  const lang = useLangStore((s) => s.lang);
  const percentage = Math.min(100, Math.max(0, (count / (maxCount || 1)) * 100));

  return (
    <div
      onClick={onClick}
      className={cn(
        "group relative flex items-center justify-between gap-3 border-b border-line py-2.5 px-3 transition-colors hover:bg-surface/80",
        onClick && "cursor-pointer",
        className
      )}
    >
      {/* Rank number */}
      {rank !== undefined && (
        <span className="w-5 shrink-0 font-mono text-xs font-semibold text-muted">
          {toFormattedNumber(rank, lang)}
        </span>
      )}

      {/* Name and Inline Progress Bar */}
      <div className="flex-1 min-w-0 space-y-1">
        <div className="flex items-center justify-between gap-2 text-xs font-medium text-ink">
          <span className="truncate">{name}</span>
          <span className="font-mono tabular-nums text-muted shrink-0">
            {toFormattedNumber(count, lang)} {lang === "bn" ? "টি" : "posts"}
          </span>
        </div>

        {/* Inline green bar */}
        <div className="h-1.5 w-full overflow-hidden rounded-full bg-line/40">
          <div
            className="h-full rounded-full bg-green transition-all duration-700 ease-[cubic-bezier(0.22,1,0.36,1)]"
            style={{ width: `${percentage}%` }}
          />
        </div>
      </div>

      {/* Optional amount */}
      {amount !== undefined && (
        <span className="ml-2 font-mono text-xs font-semibold tabular-nums text-green shrink-0">
          {typeof amount === "number" ? toFormattedNumber(amount, lang) : amount}
        </span>
      )}
    </div>
  );
}
