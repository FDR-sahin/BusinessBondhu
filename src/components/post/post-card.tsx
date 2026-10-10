"use client";

import { motion } from "framer-motion";
import { Heart, MapPin, ArrowRight } from "lucide-react";
import Link from "next/link";
import { getDistrictLabel } from "@/lib/bd-data";
import { getCategory } from "@/lib/constants";
import { formatBDT, formatPriceRange, toFormattedNumber } from "@/lib/utils";
import { useLangStore } from "@/store/lang-store";
import type { Post } from "@/types";

export function PostCard({ post }: { post: Post }) {
  const lang = useLangStore((s) => s.lang);
  const category = getCategory(post.category);
  const CategoryIcon = category?.icon;
  const districtName = getDistrictLabel(post.district) || post.district;
  const exactLoc = post.exactLocation || (post.area ? `${post.area}, ${districtName}` : districtName);
  const profit = Math.max(0, (post.retailSellPrice ?? post.retailPrice) - post.wholesalePrice);

  // Profit potential badge styling
  const profitBadgeStyle =
    post.profitPotential === "high"
      ? "bg-green/10 text-green border-green/30"
      : post.profitPotential === "medium"
      ? "bg-gold/15 text-gold border-gold/40"
      : "bg-surface text-muted border-line";

  const profitText =
    post.profitPotential === "high"
      ? (lang === "bn" ? "উচ্চ লাভ" : "High Margin")
      : post.profitPotential === "medium"
      ? (lang === "bn" ? "মাঝারি লাভ" : "Medium Margin")
      : (lang === "bn" ? "সাধারণ লাভ" : "Standard Margin");

  return (
    <motion.div
      whileHover={{ y: -2 }}
      transition={{ duration: 0.15, ease: [0.22, 1, 0.36, 1] }}
      className="group h-full"
    >
      <Link
        href={`/post/${post.id}`}
        className="flex h-full flex-col overflow-hidden rounded-xl border border-line/80 bg-surface p-5 shadow-sm transition-all duration-200 group-hover:border-green group-hover:shadow-md"
      >
        {/* Top Micro-label row: Category • District */}
        <div className="flex items-center justify-between gap-2 text-[11px] font-mono uppercase tracking-wider text-muted">
          <span className="flex items-center gap-1.5 font-semibold text-ink/80">
            {CategoryIcon && <CategoryIcon className="h-3.5 w-3.5 text-green" aria-hidden />}
            <span>{lang === "bn" ? category?.nameBn : category?.nameEn}</span>
          </span>
          <span className="truncate">{districtName}</span>
        </div>

        {/* Title */}
        <h3 className="mt-3 line-clamp-2 font-display text-lg font-bold leading-snug text-ink transition-colors group-hover:text-green">
          {post.title}
        </h3>

        {/* Exact Location Front View Badge */}
        <div className="mt-2 flex items-center gap-1.5 text-xs text-ink-secondary">
          <MapPin className="h-3.5 w-3.5 text-green shrink-0" aria-hidden />
          <span className="truncate font-medium">{exactLoc}</span>
        </div>

        {/* Price Slip Ledger Numbers (Wholesale Range, Retail Range, Profit) */}
        <div className="mt-4 grid grid-cols-3 gap-1.5 rounded-md border border-line bg-surface p-2.5 text-xs shadow-inner">
          <div className="min-w-0">
            <span className="block text-[10px] font-mono font-semibold uppercase tracking-wider text-muted truncate" title={lang === "bn" ? "পাইকারি রেঞ্জ" : "Wholesale Range"}>
              {lang === "bn" ? "পাইকারি রেঞ্জ" : "Wholesale"}
            </span>
            <span className="font-mono text-xs font-semibold tabular-nums text-ink block truncate" title={formatPriceRange(post.wholesalePrice, post.wholesalePriceMax, post.wholesalePriceText, lang)}>
              {formatPriceRange(post.wholesalePrice, post.wholesalePriceMax, post.wholesalePriceText, lang)}
            </span>
          </div>
          <div className="min-w-0">
            <span className="block text-[10px] font-mono font-semibold uppercase tracking-wider text-muted truncate" title={lang === "bn" ? "খুচরা রেঞ্জ" : "Retail Range"}>
              {lang === "bn" ? "খুচরা রেঞ্জ" : "Retail"}
            </span>
            <span className="font-mono text-xs font-semibold tabular-nums text-ink block truncate" title={formatPriceRange(post.retailPrice, post.retailPriceMax, post.retailPriceText, lang)}>
              {formatPriceRange(post.retailPrice, post.retailPriceMax, post.retailPriceText, lang)}
            </span>
          </div>
          <div className="min-w-0">
            <span className="block text-[10px] font-mono font-semibold uppercase tracking-wider text-green truncate" title={lang === "bn" ? "প্রফিট মার্জিন" : "Margin"}>
              {lang === "bn" ? "মার্জিন" : "Margin"}
            </span>
            <span className="font-mono text-xs font-bold tabular-nums text-green block truncate">
              {formatBDT(profit, lang)}
            </span>
          </div>
        </div>

        {/* Map & Detail Action Bar */}
        <div className="mt-3 flex items-center justify-between text-xs font-medium text-green transition-colors group-hover:underline">
          <span>{lang === "bn" ? "ম্যাপ ও বিস্তারিত দেখুন" : "View Map & Details"}</span>
          <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
        </div>

        {/* Dotted Tear-off Divider */}
        <div className="my-3 border-t border-dashed border-line" />

        {/* Footer: Author, Profit Badge & Stats */}
        <div className="mt-auto flex items-center justify-between gap-2 text-xs">
          <div className="flex items-center gap-2 min-w-0">
            <span className="truncate font-medium text-ink/80">{post.author.name}</span>
          </div>

          <div className="flex items-center gap-3 text-muted shrink-0">
            <span className={`rounded-full border px-2 py-0.5 text-[10px] font-mono font-medium ${profitBadgeStyle}`}>
              {profitText}
            </span>
            <span className="inline-flex items-center gap-1 font-mono text-[11px]">
              <Heart className="h-3.5 w-3.5" aria-hidden />
              {toFormattedNumber(post.likesCount, lang)}
            </span>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
