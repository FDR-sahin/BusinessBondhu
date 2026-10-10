"use client";

import {
  Mail,
  MapPin,
  Phone,
  Facebook,
  Youtube,
  Instagram,
  Linkedin,
  ExternalLink,
} from "lucide-react";
import Link from "next/link";

import { LanguageToggle } from "@/components/shared/language-toggle";
import { Logo } from "@/components/shared/logo";
import { CATEGORIES, CONTACT, NAV_LINKS, SITE_NAME } from "@/lib/constants";
import { useT } from "@/lib/i18n";
import { useLangStore } from "@/store/lang-store";

const linkClass =
  "block truncate text-sm text-muted transition-colors duration-200 hover:text-green";

const socialClass =
  "group flex h-9 w-9 items-center justify-center rounded-full border border-line bg-surface text-muted transition-all duration-300 hover:-translate-y-1 hover:border-green hover:bg-green/10 hover:text-green hover:shadow-[0_0_16px_rgba(16,142,92,0.25)]";

export function Footer() {
  const t = useT();
  const lang = useLangStore((s) => s.lang);

  const year = new Date().getFullYear();

  const localizedYear = year
    .toString()
    .replace(/\d/g, (digit) =>
      lang === "bn" ? "০১২৩৪৫৬৭৮৯"[Number(digit)] : digit,
    );

  const brandName = lang === "bn" ? "বিজনেস বিডি" : SITE_NAME;
  const address = lang === "bn" ? CONTACT.addressBn : CONTACT.address;
  const phone = CONTACT.phone;

  const socialLinks = [
    {
      name: "Facebook",
      href: "https://www.facebook.com/",
      Icon: Facebook,
    },
    {
      name: "YouTube",
      href: "https://www.youtube.com/",
      Icon: Youtube,
    },
    {
      name: "Instagram",
      href: "https://www.instagram.com/",
      Icon: Instagram,
    },
    {
      name: "LinkedIn",
      href: "https://www.linkedin.com/",
      Icon: Linkedin,
    },
  ];

  return (
    <footer className="border-t border-line bg-surface text-ink transition-colors">
      <div className="container-page py-10 md:py-16">
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {/* Brand & Wordmark */}
          <div className="space-y-3">
            <Logo />

            <p className="max-w-sm text-sm leading-relaxed text-muted">
              {t("footerAboutText")}
            </p>

            <p className="font-display text-sm italic text-pen">
              &quot;{t("closingNote")}&quot;
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="micro-label mb-3 text-muted">
              {t("footerQuickLinks")}
            </h3>

            <ul className="grid grid-cols-3 gap-x-2 gap-y-2 sm:grid-cols-1 sm:gap-0 sm:space-y-2.5">
              {NAV_LINKS.map((item) => (
                <li key={item.href}>
                  <Link href={item.href} className={linkClass}>
                    {t(item.key)}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Categories */}
          <div>
            <h3 className="micro-label mb-3 text-muted">
              {t("footerCategories")}
            </h3>

            <ul className="grid grid-cols-3 gap-2 text-xs">
              {CATEGORIES.slice(0, 6).map((category) => (
                <li key={category.slug}>
                  <Link
                    href={`/explore?category=${category.slug}`}
                    className="block truncate rounded-lg border border-line bg-background/50 px-1.5 py-1.5 text-center text-muted transition-colors duration-200 hover:border-green hover:bg-green/10 hover:text-green"
                  >
                    {lang === "bn" ? category.nameBn : category.nameEn}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact & Social Media */}
          <div>
            <h3 className="micro-label mb-3 text-muted">
              {t("footerContact")}
            </h3>

            <ul className="space-y-3 text-xs text-muted">
              {/* Email */}
              <li className="flex min-w-0 items-center gap-2">
                <Mail className="h-3.5 w-3.5 shrink-0 text-green" />

                <a
                  href={`mailto:${CONTACT.email}`}
                  className="truncate transition-colors hover:text-green hover:underline"
                >
                  {CONTACT.email}
                </a>
              </li>

              {/* Phone */}
              <li className="flex items-center gap-2">
                <Phone className="h-3.5 w-3.5 shrink-0 text-green" />

                <a
                  href={`tel:${CONTACT.phone.replace(/[^\d+]/g, "")}`}
                  className="font-mono font-medium text-ink transition-colors hover:text-green"
                >
                  {phone}
                </a>
              </li>

              {/* Location */}
              <li className="flex items-center gap-2">
                <MapPin className="h-3.5 w-3.5 shrink-0 text-green" />

                <span>{address}</span>
              </li>
            </ul>

            {/* Social Media Icons */}
            <div className="mt-5">
              <p className="mb-3 text-xs font-medium text-muted">
                {lang === "bn" ? "আমাদের অনুসরণ করুন" : "Follow Us"}
              </p>

              <div className="flex flex-wrap items-center gap-2.5">
                {socialLinks.map(({ name, href, Icon }) => (
                  <a
                    key={name}
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={name}
                    title={name}
                    className={socialClass}
                  >
                    <Icon
                      size={17}
                      strokeWidth={1.8}
                      className="transition-transform duration-300 group-hover:scale-110"
                    />
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Copyright & Language */}
        <div className="mt-10 flex flex-col items-center justify-between gap-4 border-t border-line pt-6 sm:flex-row">
          <div className="flex flex-col items-center gap-1 sm:items-start text-xs text-muted">
            <p>
              © {localizedYear} {brandName}. {t("rights")}
            </p>
            <p className="flex items-center gap-1.5 font-mono text-[11px] text-muted">
              <span>{lang === "bn" ? "কারিগরি পরিচালনায়:" : "Developed & Powered by"}</span>
              <a
                href="https://regardstech.com/"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 font-bold text-green hover:underline"
              >
                <span>Regards Tech | Web & Software Development Company</span>
                <ExternalLink className="h-3 w-3 opacity-80" />
              </a>
            </p>
          </div>

          <LanguageToggle />
        </div>
      </div>
    </footer>
  );
}
