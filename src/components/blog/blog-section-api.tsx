"use client";

import { useEffect, useMemo, useState } from "react";
import { ArrowLeft, ArrowUpRight, BookOpen, CalendarDays, RefreshCw } from "lucide-react";
import { useLangStore } from "@/store/lang-store";

type Blog = {
  _id?: string;
  id?: string;
  title: string;
  category: string;
  excerpt?: string;
  content?: string;
  createdAt?: string;
  author?: string;
};

type BlogApiResponse = {
  success: boolean;
  data: Blog[];
  count?: number;
};

export function BlogSection() {
  const lang = useLangStore((s) => s.lang);
  const bn = lang === "bn";

  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [activeBlog, setActiveBlog] = useState<Blog | null>(null);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    const controller = new AbortController();

    async function loadBlogs() {
      try {
        setLoading(true);
        setError(false);

        const baseUrl =
          process.env.NEXT_PUBLIC_API_URL ||
          "https://uddok-admin.vercel.app";

        const response = await fetch(
          `${baseUrl.replace(/\/$/, "")}/api/blogs`,
          {
            signal: controller.signal,
            cache: "no-store",
          }
        );

        if (!response.ok) {
          throw new Error("Unable to fetch blogs");
        }

        const result: BlogApiResponse = await response.json();

        if (!result.success || !Array.isArray(result.data)) {
          throw new Error("Invalid blog response");
        }

        setBlogs(result.data);
      } catch (err) {
        if (
          err instanceof Error &&
          err.name === "AbortError"
        ) {
          return;
        }

        setError(true);
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    }

    loadBlogs();

    return () => controller.abort();
  }, []);

  const filteredBlogs = useMemo(() => {
    const query = search.trim().toLowerCase();

    if (!query) return blogs;

    return blogs.filter((blog) =>
      [
        blog.title,
        blog.category,
        blog.excerpt ?? "",
        blog.content ?? "",
      ].some((value) => value.toLowerCase().includes(query))
    );
  }, [blogs, search]);

  const formatDate = (date?: string) => {
    if (!date) return "";

    const parsed = new Date(date);

    if (Number.isNaN(parsed.getTime())) return "";

    return parsed.toLocaleDateString(
      bn ? "bn-BD" : "en-BD",
      {
        day: "numeric",
        month: "short",
        year: "numeric",
      }
    );
  };

  // Blog details
  if (activeBlog) {
    return (
      <section className="w-full text-ink">
        <div className="mx-auto max-w-4xl">
          <button
            type="button"
            onClick={() => setActiveBlog(null)}
            className="mb-6 inline-flex items-center gap-2 border-2 border-line bg-surface px-4 py-2.5 text-sm font-bold transition hover:bg-gold/20"
          >
            <ArrowLeft className="h-4 w-4" />
            {bn ? "সব ব্লগে ফিরে যান" : "Back to all blogs"}
          </button>

          <article className="border-2 border-line bg-surface">
            <div className="border-b-2 border-line p-5 sm:p-8">
              <span className="inline-block border border-green/40 bg-green/10 px-3 py-1 font-mono text-xs font-bold text-green">
                {activeBlog.category}
              </span>

              <h1 className="mt-5 font-display text-3xl font-extrabold leading-tight tracking-tight sm:text-5xl">
                {activeBlog.title}
              </h1>

              <div className="mt-5 flex flex-wrap items-center gap-4 font-mono text-xs text-muted">
                {activeBlog.createdAt && (
                  <span className="flex items-center gap-2">
                    <CalendarDays className="h-4 w-4" />
                    {formatDate(activeBlog.createdAt)}
                  </span>
                )}

                {activeBlog.author && (
                  <span>
                    {bn ? "লেখক:" : "By:"} {activeBlog.author}
                  </span>
                )}
              </div>
            </div>

            {activeBlog.excerpt && (
              <div className="border-b border-line bg-background p-5 sm:p-8">
                <p className="text-base italic leading-8 text-muted sm:text-lg">
                  “{activeBlog.excerpt}”
                </p>
              </div>
            )}

            <div className="p-5 sm:p-8">
              <div className="whitespace-pre-wrap leading-8 text-ink sm:text-lg">
                {activeBlog.content || activeBlog.excerpt}
              </div>
            </div>
          </article>
        </div>
      </section>
    );
  }

  return (
    <section className="w-full text-ink">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8 border-b-2 border-line pb-6">
          <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
            <div>
              <span className="font-mono text-xs uppercase tracking-widest text-muted">
                {bn ? "বিজনেস গাইড ও পরামর্শ" : "Business Guides & Insights"}
              </span>
              <h2 className="mt-2 font-display text-3xl font-extrabold tracking-tight sm:text-4xl">
                {bn ? "সফল ব্যবসার ব্লগ সমূহ" : "Business Blog Collection"}
              </h2>
            </div>

            <div className="w-full md:w-72">
              <input
                type="text"
                placeholder={bn ? "ব্লগ খুঁজুন..." : "Search blogs..."}
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full border-2 border-line bg-surface px-4 py-2.5 text-sm outline-none transition focus:border-green"
              />
            </div>
          </div>
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <RefreshCw className="h-8 w-8 animate-spin text-green" />
            <p className="mt-4 font-mono text-sm text-muted">
              {bn ? "ব্লগ লোড হচ্ছে..." : "Loading blogs..."}
            </p>
          </div>
        ) : error ? (
          <div className="border-2 border-line bg-surface p-8 text-center">
            <p className="font-mono text-sm text-pen">
              {bn
                ? "ব্লগ ফেচ করতে ব্যর্থ হয়েছে। সার্ভার চালু আছে কিনা তা যাচাই করুন।"
                : "Failed to load blogs. Please check if the API server is running."}
            </p>
          </div>
        ) : filteredBlogs.length === 0 ? (
          <div className="border-2 border-line bg-surface p-8 text-center">
            <BookOpen className="mx-auto h-10 w-10 text-muted" />
            <p className="mt-4 font-mono text-sm text-muted">
              {bn ? "কোন ব্লগ পাওয়া যায়নি।" : "No blogs found matching your search."}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filteredBlogs.map((blog) => (
              <div
                key={blog._id || blog.id || blog.title}
                className="flex flex-col justify-between border-2 border-line bg-surface p-6 transition hover:border-green hover:shadow-md"
              >
                <div>
                  <span className="inline-block border border-line bg-background px-2.5 py-1 font-mono text-xs font-bold text-muted">
                    {blog.category}
                  </span>

                  <h3 className="mt-4 font-display text-xl font-bold leading-snug">
                    {blog.title}
                  </h3>

                  {blog.excerpt && (
                    <p className="mt-3 line-clamp-3 text-sm leading-6 text-muted">
                      {blog.excerpt}
                    </p>
                  )}
                </div>

                <div className="mt-6 border-t border-line pt-4">
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-xs text-muted">
                      {formatDate(blog.createdAt)}
                    </span>

                    <button
                      type="button"
                      onClick={() => setActiveBlog(blog)}
                      className="inline-flex items-center gap-1 font-mono text-xs font-bold text-green hover:underline"
                    >
                      {bn ? "বিস্তারিত পড়ুন" : "Read Article"}
                      <ArrowUpRight className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
