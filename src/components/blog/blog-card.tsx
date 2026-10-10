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

  const formattedDate = (() => {
    if (!post.publishedAt) return "";
    const parsed = new Date(post.publishedAt);
    if (!isNaN(parsed.getTime())) {
      return parsed.toLocaleDateString(lang === "bn" ? "bn-BD" : "en-BD", {
        day: "numeric",
        month: "short",
        year: "numeric",
      });
    }
    return post.publishedAt;
  })();

  return (
    <motion.div whileHover={{ y: -3 }} transition={{ duration: 0.15 }} className="group h-full">
      <Link
        href={`/blog/${post.id || post.slug}`}
        className="flex h-full flex-col overflow-hidden rounded-xl border-2 border-line bg-surface p-5 shadow-[3px_3px_0px_0px_rgba(23,19,15,0.75)] transition-all hover:border-indigo-600 hover:shadow-[5px_5px_0px_0px_rgba(79,70,229,0.5)] dark:shadow-[3px_3px_0px_0px_rgba(243,239,230,0.15)] dark:hover:border-indigo-400"
      >
        {/* Top Header Bar */}
        <div className="flex items-center justify-between gap-2 border-b border-line pb-3">
          <div className="flex items-center gap-2">
            <span className="border border-indigo-700/40 bg-gradient-to-r from-indigo-600 to-violet-600 px-2 py-0.5 font-mono text-xs font-bold text-white shadow-xs">
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
          <span className="border border-indigo-200 bg-indigo-50 px-2.5 py-0.5 font-mono text-[11px] font-semibold text-indigo-700 dark:border-indigo-800/80 dark:bg-indigo-950/50 dark:text-indigo-300">
            {t("confirmReport")}
          </span>
          <span className="border border-line bg-surface px-2 py-0.5 font-mono text-[11px] text-muted uppercase">
            {categoryName}
          </span>
        </div>

        {/* Title */}
        <h3 className="mt-3 line-clamp-2 font-display text-lg font-bold leading-snug text-ink transition-colors group-hover:text-indigo-600 dark:group-hover:text-indigo-400 md:text-xl">
          {post.title}
        </h3>

        {/* Meta Line */}
        <div className="mt-1 font-mono text-xs text-muted">
          <span>{post.author.name}</span>
          <span className="mx-1.5">·</span>
          <span>{formattedDate}</span>
        </div>

        {/* Excerpt Box / Quote */}
        <div className="mt-3.5 flex-1 rounded border-l-2 border-indigo-500 bg-indigo-50/30 p-3 text-xs italic leading-relaxed text-ink/90 dark:bg-indigo-950/20">
          &ldquo;{post.excerpt}&rdquo;
        </div>

        {/* Bottom Action Bar */}
        <div className="mt-4 flex items-center justify-between border-t border-line/60 pt-3">
          <div className="flex items-center border border-indigo-700/50 bg-gradient-to-r from-indigo-600 to-violet-600 px-3 py-1 font-mono text-xs font-bold text-white transition-all shadow-[2px_2px_0px_0px_rgba(23,19,15,0.75)] hover:shadow-none group-hover:from-indigo-700 group-hover:to-violet-700">
            <ArrowUp className="mr-1 h-3.5 w-3.5" />
            <span>{t("readReport")}</span>
          </div>
          <span className="font-mono text-[11px] text-muted">{formattedDate}</span>
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

  const formattedDate = (() => {
    if (!post.publishedAt) return "";
    const parsed = new Date(post.publishedAt);
    if (!isNaN(parsed.getTime())) {
      return parsed.toLocaleDateString(lang === "bn" ? "bn-BD" : "en-BD", {
        day: "numeric",
        month: "short",
        year: "numeric",
      });
    }
    return post.publishedAt;
  })();

  return (
    <Link
      href={`/blog/${post.id || post.slug}`}
      className="group grid overflow-hidden rounded-xl border-2 border-line bg-surface p-6 shadow-[4px_4px_0px_0px_rgba(23,19,15,0.75)] transition-all hover:border-indigo-600 hover:shadow-[6px_6px_0px_0px_rgba(79,70,229,0.5)] dark:shadow-[4px_4px_0px_0px_rgba(243,239,230,0.15)] dark:hover:border-indigo-400 lg:grid-cols-12 lg:gap-8"
    >
      <div className="flex flex-col justify-center gap-4 lg:col-span-12">
        <div className="flex items-center justify-between gap-2 border-b border-line pb-3">
          <div className="flex items-center gap-2">
            <span className="border border-indigo-700/40 bg-gradient-to-r from-indigo-600 to-violet-600 px-2.5 py-0.5 font-mono text-xs font-bold text-white shadow-xs">
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

        <h2 className="font-display text-2xl font-bold leading-snug text-ink transition-colors group-hover:text-indigo-600 dark:group-hover:text-indigo-400 md:text-3xl">
          {post.title}
        </h2>

        <p className="line-clamp-2 text-base text-muted leading-relaxed">
          &ldquo;{post.excerpt}&rdquo;
        </p>

        <div className="flex items-center justify-between border-t border-line pt-3 font-mono text-xs text-muted">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-ink">{post.author.name}</span>
            <span>·</span>
            <span>{formattedDate}</span>
          </div>
          <span className="font-bold text-indigo-600 dark:text-indigo-400 hover:underline">{t("readReport")} →</span>
        </div>
      </div>
    </Link>
  );
}
