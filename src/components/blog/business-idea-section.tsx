"use client";

import React, { useState, useEffect } from "react";
import { ArrowLeft, ExternalLink, MapPin, Store, Warehouse } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { formatBDT } from "@/lib/utils";
import { useLangStore } from "@/store/lang-store";

export interface BusinessIdea {
  _id?: string;
  id: string;
  title: string;
  category: string;
  district: string;
  exactLocation: string;
  wholesalePrice: number;
  retailPrice: number;
  description?: string;
}

export function BusinessIdeaSection() {
  const lang = useLangStore((s) => s.lang);
  const [ideas, setIdeas] = useState<BusinessIdea[]>([]);
  const [selectedIdea, setSelectedIdea] = useState<BusinessIdea | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    fetch("/api/ideas")
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setIdeas(data.data);
        }
      })
      .catch((err) => console.error("API Error:", err))
      .finally(() => setLoading(false));
  }, []);

  // যদি কোনো কার্ডে ক্লিক করা হয়, ডিটেইল পেজ ও ম্যাপ দেখাবে
  if (selectedIdea) {
    const profit = selectedIdea.retailPrice - selectedIdea.wholesalePrice;
    const mapUrl = `https://maps.google.com/maps?q=${encodeURIComponent(selectedIdea.exactLocation)}&hl=${lang}&z=14&output=embed`;
    const openGoogleMapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(selectedIdea.exactLocation)}`;

    return (
      <div className="idea-detail-page space-y-6 rounded-xl border-2 border-line bg-surface p-6 shadow-md">
        <button
          onClick={() => setSelectedIdea(null)}
          className="inline-flex items-center gap-2 font-mono text-xs font-bold text-green hover:underline"
        >
          <ArrowLeft className="h-4 w-4" />
          {lang === "en" ? "← Go Back" : "← পেছনে যান"}
        </button>

        {/* ব্রেডক্রাম্ব ও শিরোনাম */}
        <p className="text-xs font-mono text-muted">
          {lang === "en" ? "Home" : "হোম"} &gt; {selectedIdea.district} &gt; {selectedIdea.title}
        </p>
        <h2 className="font-display text-2xl font-bold text-ink md:text-3xl">{selectedIdea.title}</h2>
        <div className="flex flex-wrap items-center gap-3 text-sm text-ink-secondary">
          <span><strong>{lang === "en" ? "Category:" : "ক্যাটাগরি:"}</strong> {selectedIdea.category}</span>
          <span>|</span>
          <span><strong>{lang === "en" ? "District:" : "জেলা:"}</strong> {selectedIdea.district}</span>
        </div>

        {/* দাম ও লাভ ৩টি বক্স */}
        <div className="grid gap-4 sm:grid-cols-3">
          <Card className="flex flex-col gap-2 p-4 border border-line bg-background">
            <span className="flex items-center gap-1.5 text-xs font-semibold text-muted">
              <Warehouse className="h-4 w-4 text-ink-secondary" />
              {lang === "en" ? "Wholesale Price" : "পাইকারি দাম"}
            </span>
            <span className="font-mono text-xl font-bold text-ink">{formatBDT(selectedIdea.wholesalePrice, lang)}</span>
          </Card>

          <Card className="flex flex-col gap-2 p-4 border border-line bg-background">
            <span className="flex items-center gap-1.5 text-xs font-semibold text-muted">
              <Store className="h-4 w-4 text-ink-secondary" />
              {lang === "en" ? "Retail Price" : "খুচরা দাম"}
            </span>
            <span className="font-mono text-xl font-bold text-ink">{formatBDT(selectedIdea.retailPrice, lang)}</span>
          </Card>

          <Card className="flex flex-col gap-2 p-4 border border-green/30 bg-green/10">
            <span className="text-xs font-semibold text-green">
              {lang === "en" ? "Profit Margin" : "প্রফিট / লাভ"}
            </span>
            <span className="font-mono text-xl font-bold text-green">{formatBDT(profit, lang)}</span>
          </Card>
        </div>

        {/* নির্দিষ্ট ঠিকানা ও গুগল ম্যাপ */}
        <div className="location-box flex flex-wrap items-center justify-between gap-3 rounded-xl border border-line bg-primary-soft/40 p-4">
          <p className="text-sm font-medium text-ink">
            <strong>{lang === "en" ? "Exact Sourcing Address:" : "নির্দিষ্ট সোর্সিং ঠিকানা:"}</strong>{" "}
            <span className="text-green font-semibold">{selectedIdea.exactLocation}</span>
          </p>
          <Button asChild size="sm" className="bg-green text-white hover:bg-green/90">
            <a href={openGoogleMapsUrl} target="_blank" rel="noreferrer">
              <MapPin className="mr-1.5 h-4 w-4" />
              {lang === "en" ? "View on Google Maps" : "গুগল ম্যাপে দেখুন"}
              <ExternalLink className="ml-1.5 h-3.5 w-3.5 opacity-80" />
            </a>
          </Button>
        </div>

        {/* গুগল ম্যাপ আইফ্রেম */}
        <div className="overflow-hidden rounded-xl border border-line">
          <iframe
            title="Google Map"
            src={mapUrl}
            width="100%"
            height="350"
            style={{ border: 0, borderRadius: "12px" }}
            loading="lazy"
          />
        </div>

        {/* বিবরণ */}
        {selectedIdea.description && (
          <div className="description space-y-2 border-t border-line pt-4">
            <h3 className="font-display text-lg font-bold text-ink">{lang === "en" ? "Description" : "বিবরণ"}</h3>
            <p className="text-sm text-ink-secondary whitespace-pre-line leading-relaxed">{selectedIdea.description}</p>
          </div>
        )}
      </div>
    );
  }

  // কার্ড লিস্ট
  return (
    <section className="space-y-4">
      <div className="flex items-center justify-between border-b-2 border-line pb-3">
        <div>
          <h2 className="font-display text-xl font-bold text-ink md:text-2xl">
            {lang === "en" ? "Sourcing Business Ideas" : "বিজনেস আইডিয়া সোর্সিং"}
          </h2>
          <p className="text-xs text-muted">
            {lang === "en"
              ? "Live verified wholesale products and exact location coordinates"
              : "বাংলাদেশের আসল পাইকারি পণ্যের সোর্সিং ঠিকানা ও লাভ হিসাব"}
          </p>
        </div>
        <Badge variant="secondary" className="px-3 py-1 font-mono text-xs">
          {ideas.length} {lang === "en" ? "Items" : "টি আইডিয়া"}
        </Badge>
      </div>

      {loading ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-44 animate-pulse rounded-xl border border-line bg-surface/50" />
          ))}
        </div>
      ) : (
        <div className="idea-cards-grid grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {ideas.map((item) => {
            const profit = item.retailPrice - item.wholesalePrice;
            return (
              <div
                key={item._id || item.id}
                onClick={() => setSelectedIdea(item)}
                className="group flex cursor-pointer flex-col justify-between rounded-xl border border-line bg-surface p-4 shadow-sm transition-all hover:border-green hover:shadow-md"
              >
                <div>
                  <span className="rounded bg-pen/10 px-2 py-0.5 font-mono text-[10px] uppercase font-semibold text-pen">
                    {item.category}
                  </span>
                  <h3 className="mt-2 font-display text-base font-bold text-ink group-hover:text-green">
                    {item.title}
                  </h3>
                  <p className="mt-1 text-xs text-muted">
                    <strong>{lang === "en" ? "District: " : "জেলা: "}</strong> {item.district}
                  </p>
                  <p className="mt-0.5 text-xs text-ink-secondary truncate">
                    <strong>{lang === "en" ? "Address: " : "ঠিকানা: "}</strong> {item.exactLocation}
                  </p>
                </div>

                <div className="mt-4 border-t border-line/60 pt-3">
                  <div className="flex items-center justify-between text-xs font-mono">
                    <span className="text-muted">
                      {lang === "en" ? "Wholesale: " : "পাইকারি: "}
                      <strong className="text-ink">{formatBDT(item.wholesalePrice, lang)}</strong>
                    </span>
                    <span className="text-muted">
                      {lang === "en" ? "Retail: " : "খুচরা: "}
                      <strong className="text-ink">{formatBDT(item.retailPrice, lang)}</strong>
                    </span>
                  </div>
                  <div className="mt-1.5 flex items-center justify-between">
                    <span className="font-mono text-xs font-bold text-green">
                      {lang === "en" ? "Profit: " : "লাভ: "}
                      {formatBDT(profit, lang)}
                    </span>
                    <p className="text-xs font-semibold text-green group-hover:underline">
                      {lang === "en" ? "View Map & Details →" : "ম্যাপ ও বিস্তারিত দেখুন →"}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
}
