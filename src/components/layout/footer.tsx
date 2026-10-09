// "use client";

// import { Mail, MapPin, Phone } from "lucide-react";
// import Link from "next/link";
// import { LanguageToggle } from "@/components/shared/language-toggle";
// import { Logo } from "@/components/shared/logo";
// import { CATEGORIES, CONTACT, NAV_LINKS, SITE_NAME } from "@/lib/constants";
// import { useT } from "@/lib/i18n";
// import { toFormattedNumber } from "@/lib/utils";
// import { useLangStore } from "@/store/lang-store";

// const linkClass = "text-surface/70 transition-colors hover:text-surface text-sm";

// export function Footer() {
//   const t = useT();
//   const lang = useLangStore((s) => s.lang);
//   const year = new Date().getFullYear();

//   return (
//     <footer className="border-t-2 border-green bg-ink text-surface">
//       <div className="container-page py-12 md:py-16">
//         {/* 3 Text Columns */}
//         <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-3">
//           {/* Column 1: Wordmark & Statement */}
//           <div className="space-y-4">
//             <Logo className="text-surface" />
//             <p className="max-w-sm text-sm leading-relaxed text-surface/70">
//               {t("footerAboutText")}
//             </p>
//             <p className="font-display text-sm italic text-pen/90">
//               &quot;{t("closingNote")}&quot;
//             </p>
//           </div>

//           {/* Column 2: Quick Links */}
//           <div>
//             <h3 className="mb-4 micro-label text-surface/50">{t("footerQuickLinks")}</h3>
//             <ul className="space-y-2.5">
//               {NAV_LINKS.map((l) => (
//                 <li key={l.href}>
//                   <Link href={l.href} className={linkClass}>
//                     {t(l.key)}
//                   </Link>
//                 </li>
//               ))}
//             </ul>
//           </div>

//           {/* Column 3: Categories & Contact */}
//           <div className="space-y-6">
//             <div>
//               <h3 className="mb-3 micro-label text-surface/50">{t("footerCategories")}</h3>
//               <ul className="flex flex-wrap gap-2 text-xs">
//                 {CATEGORIES.slice(0, 6).map((c) => (
//                   <li key={c.slug}>
//                     <Link
//                       href={`/explore?category=${c.slug}`}
//                       className="rounded border border-surface/20 px-2 py-1 text-surface/80 transition-colors hover:bg-surface/10 hover:text-surface"
//                     >
//                       {lang === "bn" ? c.nameBn : c.nameEn}
//                     </Link>
//                   </li>
//                 ))}
//               </ul>
//             </div>

//             <div>
//               <h3 className="mb-3 micro-label text-surface/50">{t("footerContact")}</h3>
//               <ul className="space-y-2 text-xs text-surface/70">
//                 <li className="flex items-center gap-2">
//                   <Mail className="h-3.5 w-3.5 shrink-0 text-green" />
//                   <a href={`mailto:${CONTACT.email}`} className="hover:underline">
//                     {CONTACT.email}
//                   </a>
//                 </li>
//                 <li className="flex items-center gap-2">
//                   <Phone className="h-3.5 w-3.5 shrink-0 text-green" />
//                   <span>{CONTACT.phone}</span>
//                 </li>
//                 <li className="flex items-center gap-2">
//                   <MapPin className="h-3.5 w-3.5 shrink-0 text-green" />
//                   <span>{CONTACT.address}</span>
//                 </li>
//               </ul>
//             </div>
//           </div>
//         </div>

//         {/* Closing line */}
//         <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-surface/15 pt-6 sm:flex-row">
//           <p className="text-xs text-surface/60">
//             © {toFormattedNumber(year, lang)} {SITE_NAME}. {t("rights")}
//           </p>
//           <LanguageToggle />
//         </div>
//       </div>
//     </footer>
//   );
// }

// "use client";

// import { Mail, MapPin, Phone } from "lucide-react";
// import Link from "next/link";
// import { LanguageToggle } from "@/components/shared/language-toggle";
// import { Logo } from "@/components/shared/logo";
// import { CATEGORIES, CONTACT, NAV_LINKS, SITE_NAME } from "@/lib/constants";
// import { useT } from "@/lib/i18n";
// import { toFormattedNumber } from "@/lib/utils";
// import { useLangStore } from "@/store/lang-store";

// const linkClass = "text-surface/70 transition-colors hover:text-surface text-sm";

// export function Footer() {
//   const t = useT();
//   const lang = useLangStore((s) => s.lang);
//   const year = new Date().getFullYear();

//   return (
//     <footer className="border-t-2 border-green bg-ink text-surface">
//       <div className="container-page py-12 md:py-16">
//         {/* 4 Columns on large screens to reduce empty space */}
//         <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
//           {/* Column 1: Wordmark & Statement */}
//           <div className="space-y-4">
//             <Logo className="text-surface" />
//             <p className="max-w-sm text-sm leading-relaxed text-surface/70">
//               {t("footerAboutText")}
//             </p>
//             <p className="font-display text-sm italic text-pen/90">
//               &quot;{t("closingNote")}&quot;
//             </p>
//           </div>

//           {/* Column 2: Quick Links */}
//           <div>
//             <h3 className="mb-4 micro-label text-surface/50">{t("footerQuickLinks")}</h3>
//             <ul className="space-y-2.5">
//               {NAV_LINKS.map((l) => (
//                 <li key={l.href}>
//                   <Link href={l.href} className={linkClass}>
//                     {t(l.key)}
//                   </Link>
//                 </li>
//               ))}
//             </ul>
//           </div>

//           {/* Column 3: Categories */}
//           <div>
//             <h3 className="mb-4 micro-label text-surface/50">{t("footerCategories")}</h3>
//             <ul className="flex flex-wrap gap-2 text-xs">
//               {CATEGORIES.slice(0, 6).map((c) => (
//                 <li key={c.slug}>
//                   <Link
//                     href={`/explore?category=${c.slug}`}
//                     className="rounded border border-surface/20 px-2 py-1 text-surface/80 transition-colors hover:bg-surface/10 hover:text-surface"
//                   >
//                     {lang === "bn" ? c.nameBn : c.nameEn}
//                   </Link>
//                 </li>
//               ))}
//             </ul>
//           </div>

//           {/* Column 4: Contact */}
//           <div>
//             <h3 className="mb-4 micro-label text-surface/50">{t("footerContact")}</h3>
//             <ul className="space-y-2 text-xs text-surface/70">
//               <li className="flex items-center gap-2">
//                 <Mail className="h-3.5 w-3.5 shrink-0 text-green" />
//                 <a href={`mailto:${CONTACT.email}`} className="hover:underline">
//                   {CONTACT.email}
//                 </a>
//               </li>
//               <li className="flex items-center gap-2">
//                 <Phone className="h-3.5 w-3.5 shrink-0 text-green" />
//                 <span>{CONTACT.phone}</span>
//               </li>
//               <li className="flex items-center gap-2">
//                 <MapPin className="h-3.5 w-3.5 shrink-0 text-green" />
//                 <span>{CONTACT.address}</span>
//               </li>
//             </ul>
//           </div>
//         </div>

//         {/* Closing line */}
//         <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-surface/15 pt-6 sm:flex-row">
//           <p className="text-xs text-surface/60">
//             © {toFormattedNumber(year, lang)} {SITE_NAME}. {t("rights")}
//           </p>
//           <LanguageToggle />
//         </div>
//       </div>
//     </footer>
//   );
// }

// "use client";

// import { Mail, MapPin, Phone } from "lucide-react";
// import Link from "next/link";
// import { LanguageToggle } from "@/components/shared/language-toggle";
// import { Logo } from "@/components/shared/logo";
// import { CATEGORIES, CONTACT, NAV_LINKS, SITE_NAME } from "@/lib/constants";
// import { useT } from "@/lib/i18n";
// import { toFormattedNumber } from "@/lib/utils";
// import { useLangStore } from "@/store/lang-store";

// const linkClass = "text-surface/70 transition-colors hover:text-surface text-sm block truncate";

// export function Footer() {
//   const t = useT();
//   const lang = useLangStore((s) => s.lang);
//   const year = new Date().getFullYear();

//   return (
//     <footer className="border-t-2 border-green bg-ink text-surface">
//       <div className="container-page py-10 md:py-16">
//         {/* Main Grid */}
//         <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
//           {/* Column 1: Wordmark & Statement */}
//           <div className="space-y-3">
//             <Logo className="text-surface" />
//             <p className="max-w-sm text-sm leading-relaxed text-surface/70">
//               {t("footerAboutText")}
//             </p>
//             <p className="font-display text-sm italic text-pen/90">
//               &quot;{t("closingNote")}&quot;
//             </p>
//           </div>

//           {/* Column 2: Quick Links - Mobile-e 3 Column Grid */}
//           <div>
//             <h3 className="mb-3 micro-label text-surface/50">{t("footerQuickLinks")}</h3>
//             <ul className="grid grid-cols-3 gap-y-2 gap-x-2 sm:grid-cols-1 sm:space-y-2.5 sm:gap-0">
//               {NAV_LINKS.map((l) => (
//                 <li key={l.href}>
//                   <Link href={l.href} className={linkClass}>
//                     {t(l.key)}
//                   </Link>
//                 </li>
//               ))}
//             </ul>
//           </div>

//           {/* Column 3: Categories - Mobile-e 3 Column Grid */}
//           <div>
//             <h3 className="mb-3 micro-label text-surface/50">{t("footerCategories")}</h3>
//             <ul className="grid grid-cols-3 gap-2 text-xs">
//               {CATEGORIES.slice(0, 6).map((c) => (
//                 <li key={c.slug}>
//                   <Link
//                     href={`/explore?category=${c.slug}`}
//                     className="block text-center rounded border border-surface/20 px-1.5 py-1.5 text-surface/80 transition-colors hover:bg-surface/10 hover:text-surface truncate"
//                   >
//                     {lang === "bn" ? c.nameBn : c.nameEn}
//                   </Link>
//                 </li>
//               ))}
//             </ul>
//           </div>

//           {/* Column 4: Contact */}
//           <div>
//             <h3 className="mb-3 micro-label text-surface/50">{t("footerContact")}</h3>
//             <ul className="space-y-2 text-xs text-surface/70">
//               <li className="flex items-center gap-2">
//                 <Mail className="h-3.5 w-3.5 shrink-0 text-green" />
//                 <a href={`mailto:${CONTACT.email}`} className="hover:underline truncate">
//                   {CONTACT.email}
//                 </a>
//               </li>
//               <li className="flex items-center gap-2">
//                 <Phone className="h-3.5 w-3.5 shrink-0 text-green" />
//                 <span>{CONTACT.phone}</span>
//               </li>
//               <li className="flex items-center gap-2">
//                 <MapPin className="h-3.5 w-3.5 shrink-0 text-green" />
//                 <span>{CONTACT.address}</span>
//               </li>
//             </ul>
//           </div>
//         </div>

//         {/* Closing line */}
//         <div className="mt-10 flex flex-col items-center justify-between gap-4 border-t border-surface/15 pt-6 sm:flex-row">
//           <p className="text-xs text-surface/60">
//             © {toFormattedNumber(year, lang)} {SITE_NAME}. {t("rights")}
//           </p>
//           <LanguageToggle />
//         </div>
//       </div>
//     </footer>
//   );
// }

// "use client";

// import { Mail, MapPin, Phone } from "lucide-react";
// import Link from "next/link";
// import { LanguageToggle } from "@/components/shared/language-toggle";
// import { Logo } from "@/components/shared/logo";
// import {
//   CATEGORIES,
//   CONTACT,
//   NAV_LINKS,
//   SITE_NAME,
// } from "@/lib/constants";
// import { useT } from "@/lib/i18n";
// import { useLangStore } from "@/store/lang-store";

// const linkClass =
//   "text-surface/70 transition-colors hover:text-surface text-sm block truncate";

// export function Footer() {
//   const t = useT();
//   const lang = useLangStore((s) => s.lang);
//   const year = new Date().getFullYear();

//   // Location changes according to selected language
//   const address =
//     lang === "en" ? "Dhaka, Bangladesh" : "ঢাকা, বাংলাদেশ";

//   return (
//     <footer className="border-t-2 border-green bg-ink text-surface">
//       <div className="container-page py-10 md:py-16">
//         {/* Main Grid */}
//         <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
//           {/* Column 1: Wordmark & Statement */}
//           <div className="space-y-3">
//             <Logo className="text-surface" />

//             <p className="max-w-sm text-sm leading-relaxed text-surface/70">
//               {t("footerAboutText")}
//             </p>

//             <p className="font-display text-sm italic text-pen/90">
//               &quot;{t("closingNote")}&quot;
//             </p>
//           </div>

//           {/* Column 2: Quick Links */}
//           <div>
//             <h3 className="mb-3 micro-label text-surface/50">
//               {t("footerQuickLinks")}
//             </h3>

//             <ul className="grid grid-cols-3 gap-y-2 gap-x-2 sm:grid-cols-1 sm:space-y-2.5 sm:gap-0">
//               {NAV_LINKS.map((item) => (
//                 <li key={item.href}>
//                   <Link href={item.href} className={linkClass}>
//                     {t(item.key)}
//                   </Link>
//                 </li>
//               ))}
//             </ul>
//           </div>

//           {/* Column 3: Categories */}
//           <div>
//             <h3 className="mb-3 micro-label text-surface/50">
//               {t("footerCategories")}
//             </h3>

//             <ul className="grid grid-cols-3 gap-2 text-xs">
//               {CATEGORIES.slice(0, 6).map((category) => (
//                 <li key={category.slug}>
//                   <Link
//                     href={`/explore?category=${category.slug}`}
//                     className="block truncate rounded border border-surface/20 px-1.5 py-1.5 text-center text-surface/80 transition-colors hover:bg-surface/10 hover:text-surface"
//                   >
//                     {lang === "bn"
//                       ? category.nameBn
//                       : category.nameEn}
//                   </Link>
//                 </li>
//               ))}
//             </ul>
//           </div>

//           {/* Column 4: Contact */}
//           <div>
//             <h3 className="mb-3 micro-label text-surface/50">
//               {t("footerContact")}
//             </h3>

//             <ul className="space-y-2 text-xs text-surface/70">
//               {/* Email */}
//               <li className="flex items-center gap-2">
//                 <Mail className="h-3.5 w-3.5 shrink-0 text-green" />
//                 <a
//                   href={`mailto:${CONTACT.email}`}
//                   className="truncate hover:underline"
//                 >
//                   {CONTACT.email}
//                 </a>
//               </li>

//               {/* Phone */}
//               <li className="flex items-center gap-2">
//                 <Phone className="h-3.5 w-3.5 shrink-0 text-green" />
//                 <span>{CONTACT.phone}</span>
//               </li>

//               {/* Location */}
//               <li className="flex items-center gap-2">
//                 <MapPin className="h-3.5 w-3.5 shrink-0 text-green" />
//                 <span>{address}</span>
//               </li>
//             </ul>
//           </div>
//         </div>

//         {/* Copyright and Language Toggle */}
//         <div className="mt-10 flex flex-col items-center justify-between gap-4 border-t border-surface/15 pt-6 sm:flex-row">
//           <p className="text-xs text-surface/60">
//             © {year} {SITE_NAME}. {t("rights")}
//           </p>

//           <LanguageToggle />
//         </div>
//       </div>
//     </footer>
//   );
// }

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
import { toFormattedNumber } from "@/lib/utils";
import { useLangStore } from "@/store/lang-store";

const linkClass =
  "block truncate text-sm text-surface/70 transition-colors duration-200 hover:text-surface";

const socialClass =
  "group flex h-10 w-10 items-center justify-center rounded-full border border-surface/15 bg-surface/5 text-surface/70 transition-all duration-300 hover:-translate-y-1 hover:border-green hover:bg-green/10 hover:text-green hover:shadow-[0_0_18px_rgba(34,197,94,0.35)]";

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

  const address = lang === "bn" ? "ঢাকা, বাংলাদেশ" : "Dhaka, Bangladesh";

  const phone = lang === "bn" ? CONTACT.phoneBn : CONTACT.phone;

  // Replace these placeholder URLs with your actual social profiles.
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
    <footer className="border-t-2 border-green bg-ink text-surface">
      <div className="container-page py-10 md:py-16">
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {/* Brand */}
          <div className="space-y-3">
            <Logo className="text-surface" />

            <p className="max-w-sm text-sm leading-relaxed text-surface/70">
              {t("footerAboutText")}
            </p>

            <p className="font-display text-sm italic text-pen/90">
              &quot;{t("closingNote")}&quot;
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="micro-label mb-3 text-surface/50">
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
            <h3 className="micro-label mb-3 text-surface/50">
              {t("footerCategories")}
            </h3>

            <ul className="grid grid-cols-3 gap-2 text-xs">
              {CATEGORIES.slice(0, 6).map((category) => (
                <li key={category.slug}>
                  <Link
                    href={`/explore?category=${category.slug}`}
                    className="block truncate rounded border border-surface/20 px-1.5 py-1.5 text-center text-surface/80 transition-colors duration-200 hover:border-green hover:bg-surface/10 hover:text-surface"
                  >
                    {lang === "bn" ? category.nameBn : category.nameEn}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact & Social Media */}
          <div>
            <h3 className="micro-label mb-3 text-surface/50">
              {t("footerContact")}
            </h3>

            <ul className="space-y-3 text-xs text-surface/70">
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
                  className="transition-colors hover:text-green"
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
              <p className="mb-3 text-xs font-medium text-surface/50">
                {lang === "bn" ? "আমাদের অনুসরণ করুন" : "Follow Us"}
              </p>

              <div className="flex flex-wrap items-center gap-3">
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
                      size={18}
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
        <div className="mt-10 flex flex-col items-center justify-between gap-4 border-t border-surface/15 pt-6 sm:flex-row">
          <div className="flex flex-col items-center gap-1 sm:items-start text-xs text-surface/60">
            <p>
              © {localizedYear} {brandName}. {t("rights")}
            </p>
            <p className="flex items-center gap-1.5 font-mono text-[11px] text-surface/80">
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
