"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { SectionHeader } from "@/components/shared/section-header";
import { Stagger, StaggerItem } from "@/components/shared/motion";
import { CATEGORIES } from "@/lib/constants";
import { useT } from "@/lib/i18n";
import { useLangStore } from "@/store/lang-store";

export function CategoriesGrid() {
  const t = useT();
  const lang = useLangStore((s) => s.lang);

  return (
    <section className="section border-y border-border bg-surface" aria-label={t("categoriesTitle")}>
      <div className="container-page">
        <SectionHeader
          title={t("categoriesTitle")}
          description={t("categoriesDesc")}
          href="/explore"
          linkLabel={t("allCategories")}
        />
        <Stagger className="grid grid-cols-2 gap-4 md:grid-cols-4">
          {CATEGORIES.map(({ slug, nameBn, nameEn, icon: Icon }) => (
            <StaggerItem key={slug}>
              <motion.div whileHover={{ y: -4 }} transition={{ duration: 0.2 }}>
                <Link
                  href={`/explore?category=${slug}`}
                  className="group flex flex-col gap-4 rounded-2xl border border-border bg-card p-5 shadow-sm transition-shadow hover:shadow-md"
                >
                  <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary-soft text-primary-soft-foreground transition-colors group-hover:bg-secondary-soft group-hover:text-secondary-soft-foreground">
                    <Icon className="h-6 w-6" aria-hidden />
                  </span>
                  <span className="text-base font-semibold leading-snug md:text-lg">
                    {lang === "bn" ? nameBn : nameEn}
                  </span>
                </Link>
              </motion.div>
            </StaggerItem>
          ))}
        </Stagger>
      </div>
    </section>
  );
}
