"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { SectionHeader } from "@/components/shared/section-header";
import { Stagger, StaggerItem } from "@/components/shared/motion";
import { CATEGORIES } from "@/lib/constants";

export function CategoriesGrid() {
  return (
    <section className="section border-y border-border bg-surface" aria-label="ক্যাটাগরি">
      <div className="container-page">
        <SectionHeader title="ক্যাটাগরি অনুযায়ী খুঁজুন" description="আপনার আগ্রহের খাত বেছে নিন" href="/explore" linkLabel="সব ক্যাটাগরি" />
        <Stagger className="grid grid-cols-2 gap-4 md:grid-cols-4">
          {CATEGORIES.map(({ slug, nameBn, icon: Icon }) => (
            <StaggerItem key={slug}>
              <motion.div whileHover={{ y: -4 }} transition={{ duration: 0.2 }}>
                <Link
                  href={`/explore?category=${slug}`}
                  className="group flex flex-col gap-4 rounded-2xl border border-border bg-card p-5 shadow-sm transition-shadow hover:shadow-md"
                >
                  <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary-soft text-primary-soft-foreground transition-colors group-hover:bg-secondary-soft group-hover:text-secondary-soft-foreground">
                    <Icon className="h-6 w-6" aria-hidden />
                  </span>
                  <span className="text-base font-semibold leading-snug md:text-lg">{nameBn}</span>
                </Link>
              </motion.div>
            </StaggerItem>
          ))}
        </Stagger>
      </div>
    </section>
  );
}
