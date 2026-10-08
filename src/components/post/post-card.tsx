"use client";

import { motion } from "framer-motion";
import { Heart, MessageCircle } from "lucide-react";
import Link from "next/link";
import { UserAvatar } from "@/components/ui/avatar";
import { getDistrictLabel } from "@/lib/bd-data";
import { getCategory } from "@/lib/constants";
import { formatBDT, timeAgo, toFormattedNumber } from "@/lib/utils";
import { useLangStore } from "@/store/lang-store";
import type { Post } from "@/types";

export function PostCard({ post }: { post: Post }) {
  const lang = useLangStore((s) => s.lang);
  const category = getCategory(post.category);
  const CategoryIcon = category?.icon;
  const districtName = getDistrictLabel(post.district) || post.district;

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
        className="flex h-full flex-col overflow-hidden rounded-xl border border-line bg-surface p-5 transition-colors duration-200 group-hover:border-ink shadow-sm"
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

        {/* Price Slip Ledger Numbers */}
        <div className="mt-4 grid grid-cols-2 gap-2 rounded-md border border-line bg-background/50 p-3 text-xs">
          <div>
            <span className="block micro-label text-muted">{lang === "bn" ? "পাইকারি" : "Wholesale"}</span>
            <span className="font-mono text-sm font-semibold tabular-nums text-ink">
              {formatBDT(post.wholesalePrice, lang)}
            </span>
          </div>
          <div>
            <span className="block micro-label text-muted">{lang === "bn" ? "খুচরা বিক্রি" : "Retail Sell"}</span>
            <span className="font-mono text-sm font-semibold tabular-nums text-green">
              {formatBDT(post.retailSellPrice ?? post.retailPrice, lang)}
            </span>
          </div>
        </div>

        {/* Dotted Tear-off Divider */}
        <div className="my-4 border-t border-dashed border-line" />

        {/* Footer: Author, Profit Badge & Stats */}
        <div className="mt-auto flex items-center justify-between gap-2 text-xs">
          <div className="flex items-center gap-2 min-w-0">
            <UserAvatar name={post.author.name} className="h-6 w-6 text-[10px]" />
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
