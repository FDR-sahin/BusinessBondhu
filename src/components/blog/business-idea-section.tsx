"use client";

import { useEffect, useState } from "react";

export type BusinessIdea = {
  _id?: string;
  id?: string;
  title: string;
  category: string;
  division?: string;
  district: string;
  area?: string;
  exactLocation: string;
  wholesalePrice: number;
  retailPrice: number;
  retailSellPrice?: number;
  profit?: number;
  profitPotential?: string;
  description?: string;
  tags?: string[];
  author?: string;
  likesCount?: number;
  viewsCount?: number;
  createdAt?: string;
};

type Props = {
  lang?: "bn" | "en";
};

type ApiResponse = {
  success: boolean;
  data: BusinessIdea[];
  count?: number;
};

export function BusinessIdeaSection({ lang = "bn" }: Props) {
  const [ideas, setIdeas] = useState<BusinessIdea[]>([]);
  const [selectedIdea, setSelectedIdea] = useState<BusinessIdea | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const bn = lang === "bn";

  useEffect(() => {
    const controller = new AbortController();

    async function loadIdeas() {
      try {
        setLoading(true);
        setError("");

        const apiUrl = process.env.NEXT_PUBLIC_API_URL || "";

        const fetchUrl = apiUrl
          ? `${apiUrl.replace(/\/$/, "")}/api/ideas`
          : "/api/ideas";

        const response = await fetch(fetchUrl, {
          signal: controller.signal,
          cache: "no-store",
        });

        if (!response.ok) {
          throw new Error(`API error: ${response.status}`);
        }

        const result: ApiResponse = await response.json();

        if (!result.success || !Array.isArray(result.data)) {
          throw new Error("Invalid API response");
        }

        setIdeas(result.data);
      } catch (err) {
        if (err instanceof Error && err.name === "AbortError") {
          return;
        }

        setError(
          bn
            ? "বিজনেস আইডিয়া লোড করা যায়নি। Backend চালু আছে কি না পরীক্ষা করে আবার চেষ্টা করুন।"
            : "Could not load business ideas. Check whether the backend is running and try again."
        );
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    }

    loadIdeas();

    return () => controller.abort();
  }, [bn]);

  const getProfit = (idea: BusinessIdea) => {
    if (typeof idea.profit === "number") {
      return idea.profit;
    }

    return Math.max(
      0,
      (idea.retailSellPrice ?? idea.retailPrice ?? 0) -
        (idea.wholesalePrice ?? 0)
    );
  };

  const money = (value?: number) => {
    const amount = Number(value ?? 0);

    return `৳${amount.toLocaleString(bn ? "bn-BD" : "en-BD")}`;
  };

  const formatDate = (date?: string) => {
    if (!date) return "";

    const parsed = new Date(date);

    if (Number.isNaN(parsed.getTime())) {
      return "";
    }

    return parsed.toLocaleDateString(bn ? "bn-BD" : "en-BD", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  const googleMapsUrl = (location: string) =>
    `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
      location
    )}`;

  const embeddedMapUrl = (location: string) =>
    `https://maps.google.com/maps?q=${encodeURIComponent(
      location
    )}&hl=${bn ? "bn" : "en"}&z=14&output=embed`;

  // Loading state
  if (loading) {
    return (
      <section className="w-full px-4 py-16 text-center text-foreground">
        <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-emerald-500/20 border-t-emerald-600" />

        <p className="mt-4 text-sm text-muted-foreground">
          {bn ? "বিজনেস আইডিয়া লোড হচ্ছে..." : "Loading business ideas..."}
        </p>
      </section>
    );
  }

  // Error state
  if (error) {
    return (
      <section className="px-4 py-12 text-center text-foreground">
        <p className="mx-auto mb-4 max-w-xl text-sm text-red-500">{error}</p>

        <button
          type="button"
          onClick={() => window.location.reload()}
          className="rounded-xl bg-emerald-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-emerald-700"
        >
          {bn ? "আবার চেষ্টা করুন" : "Try again"}
        </button>
      </section>
    );
  }

  // Business idea details
  if (selectedIdea) {
    const idea = selectedIdea;

    return (
      <section className="w-full text-foreground">
        <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
          <button
            type="button"
            onClick={() => setSelectedIdea(null)}
            className="mb-6 inline-flex items-center gap-2 rounded-xl border border-border px-4 py-2.5 text-sm font-medium transition hover:bg-muted"
          >
            ← {bn ? "পেছনে যান" : "Go back"}
          </button>

          <div className="overflow-hidden rounded-3xl border border-border bg-card shadow-sm">
            <div className="border-b border-border p-5 sm:p-8">
              <p className="mb-4 text-sm text-muted-foreground">
                {bn ? "হোম" : "Home"} / {idea.district} / {idea.title}
              </p>

              <div className="mb-4 flex flex-wrap gap-2">
                <span className="rounded-full bg-emerald-500/10 px-3 py-1.5 text-xs font-semibold text-emerald-600">
                  {idea.category}
                </span>

                <span className="rounded-full bg-muted px-3 py-1.5 text-xs text-muted-foreground">
                  {idea.district}
                </span>
              </div>

              <h1 className="text-2xl font-bold tracking-tight sm:text-4xl">
                {idea.title}
              </h1>

              {idea.createdAt && (
                <p className="mt-3 text-sm text-muted-foreground">
                  {formatDate(idea.createdAt)}
                </p>
              )}
            </div>

            {/* Price and profit */}
            <div className="grid grid-cols-1 gap-4 p-5 sm:grid-cols-3 sm:p-8">
              <div className="rounded-2xl border border-border bg-muted/40 p-5">
                <p className="text-sm text-muted-foreground">
                  {bn ? "পাইকারি দাম" : "Wholesale Price"}
                </p>

                <p className="mt-2 text-2xl font-bold">
                  {money(idea.wholesalePrice)}
                </p>
              </div>

              <div className="rounded-2xl border border-border bg-muted/40 p-5">
                <p className="text-sm text-muted-foreground">
                  {bn ? "খুচরা দাম" : "Retail Price"}
                </p>

                <p className="mt-2 text-2xl font-bold">
                  {money(idea.retailSellPrice ?? idea.retailPrice)}
                </p>
              </div>

              <div className="rounded-2xl border border-emerald-500/20 bg-emerald-500/5 p-5">
                <p className="text-sm text-muted-foreground">
                  {bn ? "সম্ভাব্য লাভ" : "Potential Profit"}
                </p>

                <p className="mt-2 text-2xl font-bold text-emerald-600">
                  {money(getProfit(idea))}
                </p>

                <p className="mt-1 text-xs text-muted-foreground">
                  {bn
                    ? "প্রতি ইউনিটে আনুমানিক পার্থক্য"
                    : "Estimated difference per unit"}
                </p>
              </div>
            </div>

            {/* Location and map */}
            <div className="px-5 pb-6 sm:px-8">
              <div className="rounded-2xl border border-border p-5">
                <h2 className="mb-3 text-lg font-semibold">
                  {bn ? "পণ্যের অবস্থান" : "Product Location"}
                </h2>

                <p className="mb-4 text-sm leading-6 text-muted-foreground">
                  <span className="font-medium text-foreground">
                    {bn ? "ঠিকানা:" : "Address:"}
                  </span>{" "}
                  {idea.exactLocation}
                </p>

                <a
                  href={googleMapsUrl(idea.exactLocation)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex rounded-xl bg-emerald-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-emerald-700"
                >
                  {bn ? "Google Maps-এ দেখুন ↗" : "Open Google Maps ↗"}
                </a>

                {idea.exactLocation && (
                  <iframe
                    title="Business location map"
                    src={embeddedMapUrl(idea.exactLocation)}
                    width="100%"
                    height="350"
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    className="mt-5 rounded-2xl border-0"
                  />
                )}
              </div>

              {/* Description */}
              {idea.description && (
                <div className="mt-5 rounded-2xl border border-border p-5">
                  <h2 className="mb-3 text-lg font-semibold">
                    {bn ? "বিস্তারিত বিবরণ" : "Description"}
                  </h2>

                  <p className="whitespace-pre-wrap leading-7 text-muted-foreground">
                    {idea.description}
                  </p>
                </div>
              )}

              {/* Tags */}
              {idea.tags && idea.tags.length > 0 && (
                <div className="mt-5 flex flex-wrap gap-2">
                  {idea.tags.map((tag) => (
                    <span
                      key={tag}
                      className="rounded-full bg-muted px-3 py-1.5 text-xs text-muted-foreground"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              )}

              {/* Author and engagement */}
              {(idea.author ||
                idea.likesCount !== undefined ||
                idea.viewsCount !== undefined) && (
                <div className="mt-5 flex flex-wrap gap-4 border-t border-border pt-5 text-sm text-muted-foreground">
                  {idea.author && (
                    <span>
                      {bn ? "প্রকাশক:" : "Author:"} {idea.author}
                    </span>
                  )}

                  {idea.likesCount !== undefined && (
                    <span>
                      ♡ {idea.likesCount} {bn ? "লাইক" : "likes"}
                    </span>
                  )}

                  {idea.viewsCount !== undefined && (
                    <span>
                      ◉ {idea.viewsCount} {bn ? "ভিউ" : "views"}
                    </span>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
    );
  }

  // Empty state
  if (ideas.length === 0) {
    return (
      <section className="px-4 py-16 text-center text-foreground">
        <h2 className="text-xl font-bold">
          {bn ? "এখনো কোনো বিজনেস আইডিয়া নেই" : "No business ideas yet"}
        </h2>

        <p className="mt-2 text-sm text-muted-foreground">
          {bn
            ? "নতুন আইডিয়া যোগ হলে এখানে দেখা যাবে।"
            : "New business ideas will appear here."}
        </p>
      </section>
    );
  }

  // Business idea cards
  return (
    <section className="w-full text-foreground">
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        {/* Heading */}
        <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="mb-2 text-sm font-semibold text-emerald-600">
              {bn ? "ব্যবসার নতুন সম্ভাবনা" : "NEW OPPORTUNITIES"}
            </p>

            <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">
              {bn ? "বিজনেস আইডিয়া" : "Business Ideas"}
            </h2>

            <p className="mt-2 max-w-xl text-sm leading-6 text-muted-foreground">
              {bn
                ? "বিভিন্ন জেলার পণ্যের দাম, অবস্থান ও সম্ভাব্য লাভ সম্পর্কে জানুন।"
                : "Explore product prices, locations and potential profit across districts."}
            </p>
          </div>

          <span className="rounded-full border border-border bg-card px-4 py-2 text-sm text-muted-foreground">
            {bn ? "মোট" : "Total"}:{" "}
            {ideas.length.toLocaleString(bn ? "bn-BD" : "en-BD")}{" "}
            {bn ? "টি আইডিয়া" : "ideas"}
          </span>
        </div>

        {/* Cards grid */}
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3">
          {ideas.map((item) => (
            <button
              type="button"
              key={item._id || item.id || item.title}
              onClick={() => setSelectedIdea(item)}
              className="group flex h-full flex-col rounded-2xl border border-border bg-card p-5 text-left shadow-sm transition duration-300 hover:-translate-y-1 hover:border-emerald-500/50 hover:shadow-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500"
            >
              {/* Category and date */}
              <div className="mb-4 flex w-full items-start justify-between gap-3">
                <span className="rounded-full bg-emerald-500/10 px-3 py-1.5 text-xs font-semibold text-emerald-600">
                  {item.category}
                </span>

                <span className="text-xs text-muted-foreground">
                  {formatDate(item.createdAt)}
                </span>
              </div>

              {/* Title */}
              <h3 className="w-full text-xl font-bold transition group-hover:text-emerald-600">
                {item.title}
              </h3>

              {/* Location */}
              <div className="mt-3 w-full space-y-2 text-sm text-muted-foreground">
                <p>
                  <span className="mr-2">📍</span>
                  {item.district}
                  {item.area ? `, ${item.area}` : ""}
                </p>

                <p className="line-clamp-2">
                  <span className="mr-2">🗺️</span>
                  {item.exactLocation}
                </p>
              </div>

              {/* Prices */}
              <div className="my-5 grid w-full grid-cols-2 gap-3">
                <div className="rounded-xl bg-muted/60 p-3">
                  <p className="text-xs text-muted-foreground">
                    {bn ? "পাইকারি দাম" : "Wholesale"}
                  </p>

                  <p className="mt-1 font-bold">
                    {money(item.wholesalePrice)}
                  </p>
                </div>

                <div className="rounded-xl bg-muted/60 p-3">
                  <p className="text-xs text-muted-foreground">
                    {bn ? "খুচরা দাম" : "Retail"}
                  </p>

                  <p className="mt-1 font-bold">
                    {money(item.retailSellPrice ?? item.retailPrice)}
                  </p>
                </div>
              </div>

              {/* Profit and details */}
              <div className="mt-auto flex w-full items-center justify-between gap-3 rounded-xl border border-emerald-500/20 bg-emerald-500/5 p-3">
                <div>
                  <p className="text-xs text-muted-foreground">
                    {bn ? "সম্ভাব্য লাভ" : "Potential Profit"}
                  </p>

                  <p className="mt-1 text-lg font-bold text-emerald-600">
                    {money(getProfit(item))}
                  </p>
                </div>

                <span className="text-sm font-semibold text-emerald-600 transition group-hover:translate-x-1">
                  {bn ? "বিস্তারিত →" : "Details →"}
                </span>
              </div>

              {/* Engagement */}
              {(item.likesCount !== undefined ||
                item.viewsCount !== undefined) && (
                <div className="mt-4 flex w-full gap-4 text-xs text-muted-foreground">
                  {item.likesCount !== undefined && (
                    <span>♡ {item.likesCount}</span>
                  )}

                  {item.viewsCount !== undefined && (
                    <span>◉ {item.viewsCount}</span>
                  )}
                </div>
              )}
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}

export default BusinessIdeaSection;
