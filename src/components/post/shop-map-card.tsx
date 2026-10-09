"use client";

import { Compass, ExternalLink, MapPin, Navigation } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { formatLocation, getDistrictLabel } from "@/lib/bd-data";
import { useLangStore } from "@/store/lang-store";
import type { PostDetail } from "@/types";

export function ShopMapCard({ post }: { post: PostDetail }) {
  const lang = useLangStore((s) => s.lang);
  const districtName = getDistrictLabel(post.district) || post.district;
  const locationText = formatLocation(post);

  // Exact location provided by user / Google Sheets or fallbacks
  const exactLocation = post.exactLocation || (post.area ? `${post.area}, ${districtName}, Bangladesh` : `${districtName}, Bangladesh`);

  // Map embed and search URLs matching user's exact specification
  const mapEmbedUrl = `https://maps.google.com/maps?q=${encodeURIComponent(exactLocation)}&hl=${lang}&z=14&output=embed`;
  const openGoogleMapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(exactLocation)}`;

  return (
    <Card className="overflow-hidden border border-line bg-surface p-6 shadow-sm">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-line pb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-green/10 text-green">
              <MapPin className="h-4 w-4" />
            </span>
            <h3 className="text-lg font-bold text-ink">
              {lang === "en" ? "Exact Sourcing Location & Map" : "নির্দিষ্ট সোর্সিং ঠিকানা ও গুগল ম্যাপ"}
            </h3>
          </div>
          <p className="mt-1 text-xs text-muted">
            {lang === "en"
              ? "Verified business address & supplier market location"
              : "যাচাইকৃত ব্যবসা প্রতিষ্ঠানের ঠিকানা ও পাইকারি বাজার এলাকা"}
          </p>
        </div>

        <span className="rounded-full border border-green/30 bg-green/10 px-3 py-1 font-mono text-xs font-semibold text-green">
          📍 {locationText}
        </span>
      </div>

      {/* Sourcing Location Box */}
      <div className="my-5 rounded-xl border border-line bg-primary-soft/40 p-4">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="space-y-1">
            <p className="text-sm font-semibold text-ink">
              <strong>{lang === "en" ? "Exact Sourcing Address: " : "নির্দিষ্ট সোর্সিং ঠিকানা: "}</strong>
              <span className="text-green font-bold">{exactLocation}</span>
            </p>
            <p className="text-xs text-ink-secondary">
              {lang === "en"
                ? "Click the button to open direct turn-by-turn navigation in Google Maps"
                : "সরাসরি পাইকারি হাব বা বাজারে নেভিগেট করতে গুগল ম্যাপস বাটন চাপুন"}
            </p>
          </div>

          <Button asChild size="md" className="bg-green text-white hover:bg-green/90 shadow-sm shrink-0">
            <a href={openGoogleMapsUrl} target="_blank" rel="noopener noreferrer">
              <Navigation className="mr-2 h-4 w-4" />
              {lang === "en" ? "View in Google Maps" : "গুগল ম্যাপে দেখুন"}
              <ExternalLink className="ml-1.5 h-3.5 w-3.5 opacity-80" />
            </a>
          </Button>
        </div>
      </div>

      {/* Embedded Google Map iframe */}
      <div className="relative w-full overflow-hidden rounded-xl border border-line bg-background shadow-inner">
        <iframe
          title={lang === "en" ? "Google Map Location" : "গুগল ম্যাপ লোকেশন"}
          src={mapEmbedUrl}
          width="100%"
          height="350"
          style={{ border: 0, borderRadius: "12px" }}
          loading="lazy"
          allowFullScreen
        />
        <div className="absolute bottom-3 right-3 rounded-lg border border-line bg-surface/90 px-3 py-1.5 shadow-sm backdrop-blur-sm pointer-events-none">
          <p className="flex items-center gap-1.5 font-mono text-xs font-semibold text-ink">
            <Compass className="h-3.5 w-3.5 text-green" />
            <span>Google Maps ↗</span>
          </p>
        </div>
      </div>
    </Card>
  );
}
