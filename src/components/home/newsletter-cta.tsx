"use client";

import { FadeIn } from "@/components/shared/motion";
import { NewsletterForm } from "@/components/shared/newsletter-form";
import { useT } from "@/lib/i18n";

export function NewsletterCta() {
  const t = useT();
  

  return (
    <section className="section" aria-labelledby="newsletter-title">
      <div className="container-page">
        <FadeIn>
          <div className="relative overflow-hidden rounded-2xl border border-line bg-surface p-6 shadow-sm md:p-12">
            <div className="relative grid items-center gap-8 md:grid-cols-2">
              <div>
                <h2 id="newsletter-title" className="font-display text-2xl font-bold leading-snug text-ink md:text-4xl">
                  {t("newsletterTitle")}
                </h2>
                {/* <p className="mt-3 text-muted text-base leading-relaxed">
                  {t("newsletterText")}
                </p> */}
              </div>
              <NewsletterForm tone="dark" />
            </div>
          </div>
        </FadeIn>
      </div>
    </section>
  );
}
