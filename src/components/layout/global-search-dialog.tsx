"use client";

import { AnimatePresence, motion } from "framer-motion";
import { ArrowRight, BookOpen, FileText, MapPin, Search, Tag, X, ChevronRight } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { DIVISIONS } from "@/lib/bd-data";
import { MOCK_BLOG_POSTS, MOCK_POSTS } from "@/lib/mock-data";
import { CATEGORIES } from "@/lib/constants";
import { formatBDT } from "@/lib/utils";
import { useLangStore } from "@/store/lang-store";

interface GlobalSearchDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const ALL_DISTRICTS = DIVISIONS.flatMap((div) =>
  div.districts.map((dis) => ({ ...dis, division: div.value, divisionBn: div.label }))
);

export function GlobalSearchDialog({ open, onOpenChange }: GlobalSearchDialogProps) {
  const [query, setQuery] = useState("");
  const lang = useLangStore((s) => s.lang);
  const router = useRouter();

  // Reset query on open/close
  useEffect(() => {
    if (!open) setQuery("");
  }, [open]);

  // Global search matcher across Posts, Districts, Categories, Blogs & Pages
  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return null;

    // 1. Matching Venture Posts
    const matchedPosts = MOCK_POSTS.filter(
      (p) =>
        p.title.toLowerCase().includes(q) ||
        p.district.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q)
    ).slice(0, 5);

    // 2. Matching Districts & Divisions
    const matchedDistricts = ALL_DISTRICTS.filter(
      (d) => d.label.toLowerCase().includes(q) || d.value.toLowerCase().includes(q)
    ).slice(0, 4);

    // 3. Matching Categories
    const matchedCategories = CATEGORIES.filter(
      (c) =>
        c.nameBn.toLowerCase().includes(q) ||
        c.nameEn.toLowerCase().includes(q) ||
        c.slug.toLowerCase().includes(q)
    ).slice(0, 3);

    // 4. Matching Blogs
    const matchedBlogs = MOCK_BLOG_POSTS.filter(
      (b) =>
        b.title.toLowerCase().includes(q) ||
        b.excerpt.toLowerCase().includes(q) ||
        b.category.toLowerCase().includes(q)
    ).slice(0, 3);

    return {
      posts: matchedPosts,
      districts: matchedDistricts,
      categories: matchedCategories,
      blogs: matchedBlogs,
      hasResults:
        matchedPosts.length > 0 ||
        matchedDistricts.length > 0 ||
        matchedCategories.length > 0 ||
        matchedBlogs.length > 0,
    };
  }, [query]);

  function handleSelect(url: string) {
    onOpenChange(false);
    router.push(url);
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl overflow-hidden p-0 border-2 border-line bg-surface shadow-2xl">
        {/* Search Input Bar */}
        <div className="flex items-center gap-3 border-b border-line px-4 py-3.5 bg-background/50">
          <Search className="h-5 w-5 shrink-0 text-green" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={
              lang === "en"
                ? "Search posts, products, districts, categories, or blogs..."
                : "পোস্ট, মালামাল, জেলা, ক্যাটাগরি বা ব্লগ খুঁজুন..."
            }
            className="flex-1 bg-transparent text-base font-medium text-ink placeholder:text-muted outline-none"
            autoFocus
          />
          {query && (
            <button
              onClick={() => setQuery("")}
              className="rounded-full p-1 text-muted hover:bg-line/40 hover:text-ink"
            >
              <X className="h-4 w-4" />
            </button>
          )}
          <span className="hidden sm:inline-block rounded border border-line bg-surface px-2 py-0.5 font-mono text-[11px] font-semibold text-muted">
            ESC
          </span>
        </div>

        {/* Search Results Area */}
        <div className="max-h-[60vh] overflow-y-auto p-4 space-y-5">
          {!query.trim() ? (
            <div className="py-8 text-center">
              <Search className="mx-auto h-8 w-8 text-muted/40 mb-2" />
              <p className="text-sm text-ink-secondary">
                {lang === "en"
                  ? "Type any keyword like 'Dhaka', 'Paper Cup', 'Wholesale', or 'Blog'"
                  : "যেকোনো কিওয়ার্ড যেমন 'গাজীপুর', 'কাপ', 'পাইকারি', বা 'ট্রেড লাইসেন্স' লিখে সার্চ করুন"}
              </p>
              <div className="mt-4 flex flex-wrap justify-center gap-2 text-xs">
                {["গাজীপুর", "কাপ", "চকবাজার", "Dhaka", "Cloth", "Analysis"].map((tag) => (
                  <button
                    key={tag}
                    onClick={() => setQuery(tag)}
                    className="rounded-full border border-line bg-background px-3 py-1 text-muted hover:border-green hover:text-green transition-colors"
                  >
                    #{tag}
                  </button>
                ))}
              </div>
            </div>
          ) : results && !results.hasResults ? (
            <div className="py-10 text-center">
              <p className="text-base font-semibold text-ink">
                {lang === "en" ? `No results found for "${query}"` : `"${query}" এর জন্য কোনো ফলাফল পাওয়া যায়নি`}
              </p>
              <p className="mt-1 text-xs text-muted">
                {lang === "en"
                  ? "Try checking spelling or search with a different district or category keyword."
                  : "বানান পরীক্ষা করুন বা অন্য জেলা বা ক্যাটাগরি নাম দিয়ে চেষ্টা করুন।"}
              </p>
            </div>
          ) : (
            results && (
              <div className="space-y-4">
                {/* 1. Venture Posts & Products */}
                {results.posts.length > 0 && (
                  <div>
                    <h4 className="mb-2 font-mono text-xs font-bold uppercase tracking-wider text-muted flex items-center gap-1.5">
                      <FileText className="h-3.5 w-3.5 text-green" />
                      <span>{lang === "en" ? "Venture Ideas & Products" : "ব্যবসার আইডিয়া ও মালামাল"}</span>
                    </h4>
                    <div className="space-y-1">
                      {results.posts.map((p) => (
                        <button
                          key={p.id}
                          onClick={() => handleSelect(`/post/${p.id}`)}
                          className="w-full flex items-center justify-between gap-3 rounded-xl border border-transparent p-2.5 text-left transition-all hover:border-green/40 hover:bg-green/10 group"
                        >
                          <div className="min-w-0 flex-1">
                            <p className="font-semibold text-sm text-ink group-hover:text-green truncate">
                              {p.title}
                            </p>
                            <p className="text-xs text-muted flex items-center gap-2 mt-0.5">
                              <span>📍 {p.district}</span>
                              <span>•</span>
                              <span className="font-mono text-green font-semibold">
                                {formatBDT(p.wholesalePrice, lang)}
                              </span>
                            </p>
                          </div>
                          <ChevronRight className="h-4 w-4 text-muted group-hover:text-green shrink-0" />
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* 2. Districts */}
                {results.districts.length > 0 && (
                  <div>
                    <h4 className="mb-2 font-mono text-xs font-bold uppercase tracking-wider text-muted flex items-center gap-1.5">
                      <MapPin className="h-3.5 w-3.5 text-green" />
                      <span>{lang === "en" ? "Districts & Regions" : "জেলা ও এলাকা"}</span>
                    </h4>
                    <div className="grid grid-cols-2 gap-2">
                      {results.districts.map((d) => (
                        <button
                          key={d.value}
                          onClick={() => handleSelect(`/explore?district=${d.value}`)}
                          className="flex items-center justify-between rounded-lg border border-line bg-background p-2.5 text-left hover:border-green hover:bg-green/10 group"
                        >
                          <span className="font-medium text-sm text-ink group-hover:text-green">
                            {lang === "bn" ? d.label : d.value}
                          </span>
                          <span className="font-mono text-xs text-muted">
                            {lang === "bn" ? d.divisionBn : d.division}
                          </span>
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* 3. Categories */}
                {results.categories.length > 0 && (
                  <div>
                    <h4 className="mb-2 font-mono text-xs font-bold uppercase tracking-wider text-muted flex items-center gap-1.5">
                      <Tag className="h-3.5 w-3.5 text-green" />
                      <span>{lang === "en" ? "Categories" : "ক্যাটাগরি"}</span>
                    </h4>
                    <div className="grid grid-cols-2 gap-2">
                      {results.categories.map((c) => (
                        <button
                          key={c.slug}
                          onClick={() => handleSelect(`/explore?category=${c.slug}`)}
                          className="flex items-center gap-2 rounded-lg border border-line bg-background p-2.5 text-left hover:border-green hover:bg-green/10 group"
                        >
                          <c.icon className="h-4 w-4 text-green" />
                          <span className="font-medium text-sm text-ink group-hover:text-green">
                            {lang === "bn" ? c.nameBn : c.nameEn}
                          </span>
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* 4. Blog Articles */}
                {results.blogs.length > 0 && (
                  <div>
                    <h4 className="mb-2 font-mono text-xs font-bold uppercase tracking-wider text-muted flex items-center gap-1.5">
                      <BookOpen className="h-3.5 w-3.5 text-green" />
                      <span>{lang === "en" ? "Blog Articles & Guides" : "ব্লগ ও গাইডলাইন"}</span>
                    </h4>
                    <div className="space-y-1">
                      {results.blogs.map((b) => (
                        <button
                          key={b.slug}
                          onClick={() => handleSelect(`/blog/${b.slug}`)}
                          className="w-full flex items-center justify-between gap-3 rounded-xl border border-transparent p-2.5 text-left transition-all hover:border-green/40 hover:bg-green/10 group"
                        >
                          <div className="min-w-0 flex-1">
                            <p className="font-semibold text-sm text-ink group-hover:text-green truncate">
                              {b.title}
                            </p>
                            <p className="text-xs text-muted truncate">{b.excerpt}</p>
                          </div>
                          <ChevronRight className="h-4 w-4 text-muted group-hover:text-green shrink-0" />
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )
          )}
        </div>

        {/* Footer Shortcut Bar */}
        <div className="flex items-center justify-between border-t border-line bg-background/50 px-4 py-2.5 text-xs text-muted">
          <span>{lang === "en" ? "Click any item to view details" : "যেকোনো আইটেমে ক্লিক করে বিস্তারিত দেখুন"}</span>
          <button
            onClick={() => handleSelect(`/explore?q=${encodeURIComponent(query)}`)}
            className="font-medium text-green hover:underline flex items-center gap-1"
          >
            <span>{lang === "en" ? "View all in Explore" : "এক্সপ্লোরে সব ফলাফল দেখুন"}</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
