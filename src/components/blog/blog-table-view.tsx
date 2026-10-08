"use client";

import Link from "next/link";
import { Clock } from "lucide-react";
import { getBlogCategory } from "@/lib/blog";
import { useT } from "@/lib/i18n";
import { toFormattedNumber } from "@/lib/utils";
import { useLangStore } from "@/store/lang-store";
import type { BlogPost } from "@/types";

export function BlogTableView({ items }: { items: BlogPost[] }) {
  const t = useT();
  const lang = useLangStore((s) => s.lang);

  return (
    <div className="overflow-x-auto rounded-xl border-2 border-line bg-surface shadow-[3px_3px_0px_0px_rgba(23,19,15,0.75)] dark:shadow-[3px_3px_0px_0px_rgba(243,239,230,0.15)]">
      <table className="w-full text-left font-mono text-xs">
        <thead className="border-b-2 border-line bg-background text-ink">
          <tr>
            <th className="p-3 font-bold uppercase tracking-wider">#</th>
            <th className="p-3 font-bold uppercase tracking-wider">{t("category")}</th>
            <th className="p-3 font-bold uppercase tracking-wider">{lang === "bn" ? "শিরোনাম" : "Title"}</th>
            <th className="p-3 font-bold uppercase tracking-wider">{lang === "bn" ? "লেখক" : "Author"}</th>
            <th className="p-3 font-bold uppercase tracking-wider text-right">{lang === "bn" ? "পাঠ সময়" : "Read Time"}</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-line/60 text-ink">
          {items.map((post, idx) => {
            const category = getBlogCategory(post.category);
            const categoryName = category ? (lang === "bn" ? category.label : category.labelEn) : post.category;
            const numBadge = `#${String(idx + 1).padStart(2, "0")}`;

            return (
              <tr key={post.id} className="transition-colors hover:bg-background/80">
                <td className="p-3 font-bold text-muted">{numBadge}</td>
                <td className="p-3">
                  <span className="border border-line bg-surface px-2 py-0.5 uppercase tracking-wider font-semibold text-ink">
                    {categoryName}
                  </span>
                </td>
                <td className="p-3">
                  <Link href={`/blog/${post.slug}`} className="font-sans font-semibold text-ink hover:text-green hover:underline">
                    {post.title}
                  </Link>
                </td>
                <td className="p-3 text-muted">{post.author.name}</td>
                <td className="p-3 text-right font-bold text-green tabular-nums">
                  {toFormattedNumber(post.readingTime ?? 3, lang)}m
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
