"use client";

import Link from "next/link";
import Image from "next/image";
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
        "group inline-flex items-center gap-2.5 transition-opacity hover:opacity-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green rounded-lg p-0.5",
        className
      )}
    >
      <div className="relative flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-surface p-1 shadow-sm border border-line/60 dark:border-line group-hover:border-green/40 transition-colors">
        <Image
          src="/images/biz-logo.png"
          alt="Business Idea Zone Logo"
          width={36}
          height={36}
          className="h-full w-full object-contain transition-transform duration-200 group-hover:scale-105"
          priority
        />
      </div>

      {showText && (
        <div className="flex flex-col leading-none select-none">
          <div className="flex items-center gap-1.5">
            <span className="font-display text-base font-black tracking-tight text-ink dark:text-surface">
              {lang === "bn" ? "বিজনেস" : "BUSINESS"}
            </span>
            <span className="rounded-full bg-red-600/10 border border-red-600/20 px-1.5 py-0.5 font-mono text-[9px] font-extrabold tracking-widest text-red-600 dark:bg-red-500/20 dark:text-red-400 dark:border-red-500/30 shadow-2xs">
              BD
            </span>
          </div>
          <span className="text-[10px] font-mono font-bold tracking-[0.22em] text-green uppercase pt-0.5">
            {lang === "bn" ? "আইডিয়া জোন" : "IDEA ZONE"}
          </span>
        </div>
      )}
    </Link>
  );
}

