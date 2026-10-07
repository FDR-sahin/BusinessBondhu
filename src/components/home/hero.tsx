"use client";

import { motion } from "framer-motion";
import { Building2, FileText, MapPin, Sparkles } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { HeroSearch } from "./hero-search";

const TRUST = [
  { icon: FileText, label: "১০,০০০+ পোস্ট" },
  { icon: MapPin, label: "৬৪ জেলা" },
  { icon: Building2, label: "৮ বিভাগ" },
];

export function Hero() {
  return (
    <section className="relative overflow-hidden border-b border-border">
      {/* Soft gradient + blurred blobs (primary navy + secondary gold) */}
      <div aria-hidden className="pointer-events-none absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-b from-primary/5 via-transparent to-transparent" />
        <div className="absolute -left-24 -top-24 h-96 w-96 rounded-full bg-primary/15 blur-3xl" />
        <div className="absolute -right-16 top-24 h-80 w-80 rounded-full bg-secondary/20 blur-3xl" />
        <div className="absolute bottom-0 left-1/3 h-64 w-64 rounded-full bg-primary/10 blur-3xl" />
      </div>

      <div className="container-page relative py-16 md:py-24">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }} className="max-w-3xl">
          <Badge variant="secondary" className="mb-5 px-3 py-1">
            <Sparkles className="h-4 w-4" aria-hidden /> বাংলাদেশের ব্যবসায়িক কমিউনিটি
          </Badge>
          <h1 className="text-4xl font-bold leading-[1.3] tracking-tight md:text-6xl md:leading-[1.25]">
            আপনার এলাকার জন্য সঠিক ব্যবসা খুঁজুন
          </h1>
          <p className="mt-5 max-w-2xl text-lg text-ink-secondary">
            জেলা ও বাজেট অনুযায়ী বাস্তব ব্যবসার আইডিয়া, পাইকারি-খুচরা দামের তথ্য এবং অন্য উদ্যোক্তাদের অভিজ্ঞতা — সবকিছু এক জায়গায়।
          </p>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.1 }} className="mt-10">
          <HeroSearch />
        </motion.div>

        <motion.ul initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.2 }} className="mt-6 flex flex-wrap gap-3">
          {TRUST.map(({ icon: Icon, label }) => (
            <li key={label} className="inline-flex items-center gap-2 rounded-lg border border-border bg-surface/70 px-3 py-2 text-sm font-medium backdrop-blur">
              <Icon className="h-4 w-4 text-link" aria-hidden />
              {label}
            </li>
          ))}
        </motion.ul>
      </div>
    </section>
  );
}
