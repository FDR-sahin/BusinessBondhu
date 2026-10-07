"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn, toBanglaNumber } from "@/lib/utils";
import { Button } from "./button";

/** [1, "…", 4, 5, 6, "…", 12] — always keeps first, last and neighbours of current. */
function getPages(current: number, total: number): (number | "…")[] {
  if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1);
  const pages: (number | "…")[] = [1];
  const start = Math.max(2, current - 1);
  const end = Math.min(total - 1, current + 1);
  if (start > 2) pages.push("…");
  for (let p = start; p <= end; p++) pages.push(p);
  if (end < total - 1) pages.push("…");
  pages.push(total);
  return pages;
}

interface PaginationProps {
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  className?: string;
}

export function Pagination({ page, totalPages, onPageChange, className }: PaginationProps) {
  if (totalPages <= 1) return null;

  return (
    <nav aria-label="পেজিনেশন" className={cn("flex items-center justify-center gap-1.5", className)}>
      <Button variant="outline" size="icon" disabled={page <= 1} onClick={() => onPageChange(page - 1)} aria-label="আগের পেজ">
        <ChevronLeft />
      </Button>
      {getPages(page, totalPages).map((p, i) =>
        p === "…" ? (
          <span key={`gap-${i}`} className="px-1.5 text-ink-secondary" aria-hidden>…</span>
        ) : (
          <Button
            key={p}
            variant={p === page ? "primary" : "ghost"}
            size="icon"
            aria-current={p === page ? "page" : undefined}
            aria-label={`পেজ ${toBanglaNumber(p)}`}
            onClick={() => onPageChange(p)}
          >
            {toBanglaNumber(p)}
          </Button>
        ),
      )}
      <Button variant="outline" size="icon" disabled={page >= totalPages} onClick={() => onPageChange(page + 1)} aria-label="পরের পেজ">
        <ChevronRight />
      </Button>
    </nav>
  );
}
