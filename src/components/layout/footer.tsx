"use client";

import { Facebook, Instagram, Linkedin, Mail, MapPin, Phone, Youtube } from "lucide-react";
import Link from "next/link";
import { LanguageToggle } from "@/components/shared/language-toggle";
import { Logo } from "@/components/shared/logo";
import { NewsletterForm } from "@/components/shared/newsletter-form";
import { CATEGORIES, CONTACT, NAV_LINKS, SITE_NAME } from "@/lib/constants";
import { useT } from "@/lib/i18n";
import { toBanglaNumber } from "@/lib/utils";
import { useLangStore } from "@/store/lang-store";

const SOCIALS = [
  { label: "Facebook", href: "https://facebook.com", icon: Facebook },
  { label: "YouTube", href: "https://youtube.com", icon: Youtube },
  { label: "LinkedIn", href: "https://linkedin.com", icon: Linkedin },
  { label: "Instagram", href: "https://instagram.com", icon: Instagram },
]; // placeholders — point to your real pages

const linkClass = "text-ink-secondary transition-colors hover:text-foreground";

export function Footer() {
  const t = useT();
  const lang = useLangStore((s) => s.lang);
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-border bg-surface">
      <div className="container-page py-16">
        {/* Newsletter strip */}
        <div className="mb-12 flex flex-col gap-6 border-b border-border pb-12 md:flex-row md:items-center md:justify-between">
          <div className="max-w-md">
            <h2 className="text-lg font-semibold md:text-xl">{t("newsletterTitle")}</h2>
            <p className="mt-1 text-ink-secondary">{t("newsletterText")}</p>
          </div>
          <NewsletterForm />
        </div>

        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
          <div className="space-y-4">
            <Logo />
            <p className="max-w-xs text-ink-secondary">{t("footerAboutText")}</p>
            <ul className="flex gap-2">
              {SOCIALS.map(({ label, href, icon: Icon }) => (
                <li key={label}>
                  <a href={href} target="_blank" rel="noopener noreferrer" aria-label={label} className="flex h-10 w-10 items-center justify-center rounded-lg border border-border text-ink-secondary transition-colors hover:bg-muted hover:text-foreground">
                    <Icon className="h-4 w-4" />
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="mb-4 font-semibold">{t("footerQuickLinks")}</h3>
            <ul className="space-y-2.5">
              {NAV_LINKS.map((l) => (
                <li key={l.href}><Link href={l.href} className={linkClass}>{t(l.key)}</Link></li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="mb-4 font-semibold">{t("footerCategories")}</h3>
            <ul className="space-y-2.5">
              {CATEGORIES.map((c) => (
                <li key={c.slug}>
                  <Link href={`/explore?category=${c.slug}`} className={linkClass}>{lang === "bn" ? c.nameBn : c.nameEn}</Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="mb-4 font-semibold">{t("footerContact")}</h3>
            <ul className="space-y-3 text-ink-secondary">
              <li className="flex items-start gap-2.5"><Mail className="mt-1 h-4 w-4 shrink-0" /><a href={`mailto:${CONTACT.email}`} className={linkClass}>{CONTACT.email}</a></li>
              <li className="flex items-start gap-2.5"><Phone className="mt-1 h-4 w-4 shrink-0" /><span>{CONTACT.phone}</span></li>
              <li className="flex items-start gap-2.5"><MapPin className="mt-1 h-4 w-4 shrink-0" /><span>{CONTACT.address}</span></li>
            </ul>
          </div>
        </div>

        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-border pt-8 sm:flex-row">
          <p className="text-sm text-ink-secondary">
            © {lang === "bn" ? toBanglaNumber(year).replace(/,/g, "") : year} {SITE_NAME}. {t("rights")}
          </p>
          <LanguageToggle />
        </div>
      </div>
    </footer>
  );
}
