"use client";

import Link from "next/link";
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
        "inline-flex items-center gap-1.5 font-display text-xl font-bold tracking-tight text-ink hover:opacity-90 transition-opacity",
        className
      )}
    >
      {showText && <span>{lang === "bn" ? "বিজনেস হাব" : "BUSINESS HUB"}</span>}
      <span className="rounded bg-pen/10 px-1.5 py-0.5 font-mono text-[10px] uppercase tracking-widest text-pen">
        BD
      </span>
    </Link>
  );
}
