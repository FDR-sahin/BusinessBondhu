"use client";

import { Mail, MapPin, Phone } from "lucide-react";
import Link from "next/link";
import { LanguageToggle } from "@/components/shared/language-toggle";
import { Logo } from "@/components/shared/logo";
import { CATEGORIES, CONTACT, NAV_LINKS, SITE_NAME } from "@/lib/constants";
import { useT } from "@/lib/i18n";
import { toFormattedNumber } from "@/lib/utils";
import { useLangStore } from "@/store/lang-store";

const linkClass = "text-surface/70 transition-colors hover:text-surface text-sm";

export function Footer() {
  const t = useT();
  const lang = useLangStore((s) => s.lang);
  const year = new Date().getFullYear();

  return (
    <footer className="border-t-2 border-green bg-ink text-surface">
      <div className="container-page py-12 md:py-16">
        {/* 3 Text Columns */}
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-3">
          {/* Column 1: Wordmark & Statement */}
          <div className="space-y-4">
            <Logo className="text-surface" />
            <p className="max-w-sm text-sm leading-relaxed text-surface/70">
              {t("footerAboutText")}
            </p>
            <p className="font-display text-sm italic text-pen/90">
              &quot;{t("closingNote")}&quot;
            </p>
          </div>

          {/* Column 2: Quick Links */}
          <div>
            <h3 className="mb-4 micro-label text-surface/50">{t("footerQuickLinks")}</h3>
            <ul className="space-y-2.5">
              {NAV_LINKS.map((l) => (
                <li key={l.href}>
                  <Link href={l.href} className={linkClass}>
                    {t(l.key)}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3: Categories & Contact */}
          <div className="space-y-6">
            <div>
              <h3 className="mb-3 micro-label text-surface/50">{t("footerCategories")}</h3>
              <ul className="flex flex-wrap gap-2 text-xs">
                {CATEGORIES.slice(0, 6).map((c) => (
                  <li key={c.slug}>
                    <Link
                      href={`/explore?category=${c.slug}`}
                      className="rounded border border-surface/20 px-2 py-1 text-surface/80 transition-colors hover:bg-surface/10 hover:text-surface"
                    >
                      {lang === "bn" ? c.nameBn : c.nameEn}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h3 className="mb-3 micro-label text-surface/50">{t("footerContact")}</h3>
              <ul className="space-y-2 text-xs text-surface/70">
                <li className="flex items-center gap-2">
                  <Mail className="h-3.5 w-3.5 shrink-0 text-green" />
                  <a href={`mailto:${CONTACT.email}`} className="hover:underline">
                    {CONTACT.email}
                  </a>
                </li>
                <li className="flex items-center gap-2">
                  <Phone className="h-3.5 w-3.5 shrink-0 text-green" />
                  <span>{CONTACT.phone}</span>
                </li>
                <li className="flex items-center gap-2">
                  <MapPin className="h-3.5 w-3.5 shrink-0 text-green" />
                  <span>{CONTACT.address}</span>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Closing line */}
        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-surface/15 pt-6 sm:flex-row">
          <p className="text-xs text-surface/60">
            © {toFormattedNumber(year, lang)} {SITE_NAME}. {t("rights")}
          </p>
          <LanguageToggle />
        </div>
      </div>
    </footer>
  );
}
