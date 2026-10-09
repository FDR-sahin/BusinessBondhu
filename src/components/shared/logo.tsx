"use client";

import Link from "next/link";
import { BookOpen } from "lucide-react";
import { SITE_NAME } from "@/lib/constants";
import { useLangStore } from "@/store/lang-store";
import { cn } from "@/lib/utils";

export function Logo({ className, showText = true }: { className?: string; showText?: boolean }) {
  const lang = useLangStore((s) => s.lang);

  return (
    <Link
      href="/"
      aria-label={SITE_NAME}
      className={cn(
        "inline-flex items-center gap-2 font-display text-xl font-bold tracking-tight text-ink hover:opacity-90 transition-opacity",
        className
      )}
    >
      <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-green text-white shadow-sm">
        <BookOpen className="h-4.5 w-4.5" />
      </span>
      {showText && (
        <span className="flex items-center gap-1.5">
          <span>{lang === "bn" ? "বিজনেস আইডিয়া জোন" : "BUSINESS IDEA ZONE"}</span>
          <span className="rounded bg-pen/10 px-1.5 py-0.5 font-mono text-[10px] uppercase tracking-widest text-pen">
            BD
          </span>
        </span>
      )}
    </Link>
  );
}
