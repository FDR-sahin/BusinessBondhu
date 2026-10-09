"use client";

import { Car, Compass, MapPin, Navigation, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { formatLocation } from "@/lib/bd-data";
import { useLangStore } from "@/store/lang-store";
import type { PostDetail } from "@/types";

export function ShopMapCard({ post }: { post: PostDetail }) {
  const lang = useLangStore((s) => s.lang);
  const locationText = formatLocation(post);

  // Exact location query for Google Maps directions
  const mapQuery = `${post.area ? post.area + ", " : ""}${post.district}, Bangladesh`;
  const googleMapsRouteUrl = `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(mapQuery)}`;
  const googleEmbedUrl = `https://maps.google.com/maps?q=${encodeURIComponent(mapQuery)}&t=&z=13&ie=UTF8&iwloc=&output=embed`;

  return (
    <Card className="overflow-hidden border border-line bg-surface p-6 shadow-sm">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-line pb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-green/10 text-green">
              <MapPin className="h-4 w-4" />
            </span>
            <h3 className="text-lg font-bold text-ink">
              {lang === "en" ? "Shop & Supply Location Map" : "দোকান ও সরবরাহের অবস্থান ম্যাপ"}
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

      {/* Car Route Info Card */}
      <div className="my-5 rounded-xl border border-line bg-primary-soft/40 p-4">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-green text-white shadow-sm">
              <Car className="h-6 w-6 animate-pulse" />
            </div>
            <div>
              <p className="text-xs font-mono font-semibold uppercase tracking-wider text-muted">
                {lang === "en" ? "Car Navigation & Route" : "গাড়ি / রুট নেভিগেশন"}
              </p>
              <h4 className="font-semibold text-ink text-sm sm:text-base">
                {lang === "en"
                  ? `Route to ${locationText}`
                  : `${locationText} পৌঁছানোর গাড়ি রুট`}
              </h4>
              <p className="text-xs text-ink-secondary">
                {lang === "en"
                  ? "Get turn-by-turn driving directions from your current location"
                  : "আপনার বর্তমান অবস্থান থেকে সরাসরি গুগল ম্যাপসে লাইভ রুট দেখুন"}
              </p>
            </div>
          </div>

          <Button asChild size="md" className="bg-green text-white hover:bg-green/90 shadow-sm">
            <a href={googleMapsRouteUrl} target="_blank" rel="noopener noreferrer">
              <Navigation className="mr-2 h-4 w-4" />
              {lang === "en" ? "Get Car Directions" : "গাড়ির রুট দেখুন"}
              <ExternalLink className="ml-1.5 h-3.5 w-3.5 opacity-80" />
            </a>
          </Button>
        </div>
      </div>

      {/* Embedded Google Map Preview Frame */}
      <a
        href={googleMapsRouteUrl}
        target="_blank"
        rel="noopener noreferrer"
        title={lang === "en" ? "Click to open in Google Maps" : "গুগল ম্যাপসে দেখতে ক্লিক করুন"}
        className="group relative block aspect-[16/9] w-full overflow-hidden rounded-xl border border-line bg-background shadow-inner transition-all hover:border-green"
      >
        <iframe
          title={locationText}
          width="100%"
          height="100%"
          frameBorder="0"
          scrolling="no"
          marginHeight={0}
          marginWidth={0}
          src={googleEmbedUrl}
          className="pointer-events-none h-full w-full grayscale-[15%] contrast-[105%] transition-all group-hover:grayscale-0 group-hover:scale-[1.01]"
          loading="lazy"
        />
        <div className="absolute inset-0 flex items-center justify-center bg-black/5 opacity-0 transition-opacity group-hover:opacity-100">
          <span className="flex items-center gap-2 rounded-lg border border-line bg-surface/95 px-4 py-2 font-mono text-xs font-bold text-ink shadow-lg backdrop-blur-md">
            <ExternalLink className="h-4 w-4 text-green" />
            {lang === "en" ? "Open Location in Google Maps" : "গুগল ম্যাপসে সরাসরি নেভিগেট করুন"}
          </span>
        </div>
        <div className="absolute bottom-3 right-3 rounded-lg border border-line bg-surface/90 px-3 py-1.5 shadow-sm backdrop-blur-sm">
          <p className="flex items-center gap-1.5 font-mono text-xs font-semibold text-ink">
            <Compass className="h-3.5 w-3.5 text-green" />
            <span>Google Maps ↗</span>
          </p>
        </div>
      </a>
    </Card>
  );
}
