"use client";

import { motion } from "framer-motion";
import { ArrowUp, BookOpen, Clock, Tag } from "lucide-react";
import Link from "next/link";
import { getBlogCategory } from "@/lib/blog";
import { useT } from "@/lib/i18n";
import { toFormattedNumber } from "@/lib/utils";
import { useLangStore } from "@/store/lang-store";
import type { BlogPost } from "@/types";

export function BlogCard({ post, index = 1 }: { post: BlogPost; index?: number }) {
  const t = useT();
  const lang = useLangStore((s) => s.lang);
  const category = getBlogCategory(post.category);
  const categoryName = category ? (lang === "bn" ? category.label : category.labelEn) : post.category;
  const numBadge = `#${String(index).padStart(2, "0")}`;

  return (
    <motion.div whileHover={{ y: -3 }} transition={{ duration: 0.15 }} className="group h-full">
      <Link
        href={`/blog/${post.id || post.slug}`}
        className="flex h-full flex-col overflow-hidden rounded-xl border-2 border-line bg-surface p-5 shadow-[3px_3px_0px_0px_rgba(23,19,15,0.75)] transition-all hover:border-ink hover:shadow-[5px_5px_0px_0px_rgba(23,19,15,0.9)] dark:shadow-[3px_3px_0px_0px_rgba(243,239,230,0.15)]"
      >
        {/* Top Header Bar */}
        <div className="flex items-center justify-between gap-2 border-b border-line pb-3">
          <div className="flex items-center gap-2">
            <span className="border border-line bg-gold px-2 py-0.5 font-mono text-xs font-bold text-ink">
              {numBadge}
            </span>
            <span className="border border-line bg-surface px-2.5 py-0.5 font-mono text-xs font-semibold uppercase tracking-wider text-ink">
              {categoryName}
            </span>
          </div>
          <div className="flex items-center gap-1 border border-line bg-ink px-2.5 py-0.5 font-mono text-xs font-bold text-background">
            <Clock className="h-3 w-3" />
            <span>{toFormattedNumber(post.readingTime ?? 3, lang)}m</span>
          </div>
        </div>

        {/* Status / Pill Tags */}
        <div className="mt-3 flex items-center gap-2">
          <span className="border border-line bg-gold/30 px-2 py-0.5 font-mono text-[11px] font-semibold text-ink">
            {t("confirmReport")}
          </span>
          <span className="border border-line bg-surface px-2 py-0.5 font-mono text-[11px] text-muted uppercase">
            {categoryName}
          </span>
        </div>

        {/* Title */}
        <h3 className="mt-3 line-clamp-2 font-display text-lg font-bold leading-snug text-ink transition-colors group-hover:text-green md:text-xl">
          {post.title}
        </h3>

        {/* Meta Line */}
        <div className="mt-1 font-mono text-xs text-muted">
          <span>{post.author.name}</span>
          <span className="mx-1.5">·</span>
          <span>{post.publishedAt}</span>
        </div>

        {/* Excerpt Box / Quote */}
        <div className="mt-3.5 flex-1 rounded border-l-2 border-green bg-background/60 p-3 text-xs italic leading-relaxed text-ink/90">
          &ldquo;{post.excerpt}&rdquo;
        </div>

        {/* Bottom Action Bar */}
        <div className="mt-4 flex items-center justify-between border-t border-line/60 pt-3">
          <div className="flex items-center border-2 border-line bg-gold px-3 py-1 font-mono text-xs font-bold text-ink transition-colors group-hover:bg-gold/90">
            <ArrowUp className="mr-1 h-3.5 w-3.5" />
            <span>{t("readReport")}</span>
          </div>
          <span className="font-mono text-[11px] text-muted">{post.publishedAt}</span>
        </div>
      </Link>
    </motion.div>
  );
}

/** Featured Hero Blog Slip Card */
export function FeaturedBlogCard({ post }: { post: BlogPost }) {
  const t = useT();
  const lang = useLangStore((s) => s.lang);
  const category = getBlogCategory(post.category);
  const categoryName = category ? (lang === "bn" ? category.label : category.labelEn) : post.category;

  return (
    <Link
      href={`/blog/${post.id || post.slug}`}
      className="group grid overflow-hidden rounded-xl border-2 border-line bg-surface p-6 shadow-[4px_4px_0px_0px_rgba(23,19,15,0.75)] transition-all hover:border-ink hover:shadow-[6px_6px_0px_0px_rgba(23,19,15,0.9)] dark:shadow-[4px_4px_0px_0px_rgba(243,239,230,0.15)] lg:grid-cols-12 lg:gap-8"
    >
      <div className="flex flex-col justify-center gap-4 lg:col-span-12">
        <div className="flex items-center justify-between gap-2 border-b border-line pb-3">
          <div className="flex items-center gap-2">
            <span className="border border-line bg-gold px-2.5 py-0.5 font-mono text-xs font-bold text-ink">
              FEATURED #01
            </span>
            <span className="border border-line bg-surface px-3 py-0.5 font-mono text-xs font-semibold uppercase tracking-wider text-ink">
              {categoryName}
            </span>
          </div>
          <span className="border border-line bg-ink px-3 py-0.5 font-mono text-xs font-bold text-background">
            {toFormattedNumber(post.readingTime ?? 3, lang)} MIN READ
          </span>
        </div>

        <h2 className="font-display text-2xl font-bold leading-snug text-ink transition-colors group-hover:text-green md:text-3xl">
          {post.title}
        </h2>

        <p className="line-clamp-2 text-base text-muted leading-relaxed">
          &ldquo;{post.excerpt}&rdquo;
        </p>

        <div className="flex items-center justify-between border-t border-line pt-3 font-mono text-xs text-muted">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-ink">{post.author.name}</span>
            <span>·</span>
            <span>{post.publishedAt}</span>
          </div>
          <span className="font-bold text-green hover:underline">{t("readReport")} →</span>
        </div>
      </div>
    </Link>
  );
}
