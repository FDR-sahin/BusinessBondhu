import {
  LayoutGrid,
  Pill,
  Shirt,
  Smartphone,
  Sparkles,
  Sprout,
  UtensilsCrossed,
  Wrench,
  type LucideIcon,
} from "lucide-react";
import type { TKey } from "@/lib/i18n";

export const SITE_NAME = "Business Idea Zone";

export const NAV_LINKS: { href: string; key: TKey }[] = [
  { href: "/", key: "navHome" },
  { href: "/explore", key: "navExplore" },
  { href: "/blog", key: "navBlog" },
  { href: "/analysis", key: "navAnalysis" },
  { href: "/ai-advisor", key: "navAiAdvisor" },
  { href: "/about", key: "navAbout" },
];

/** Spec categories. `slug` is what we put in ?category= (match your API values). */
export const CATEGORIES: { slug: string; nameBn: string; nameEn: string; icon: LucideIcon }[] = [
  { slug: "food-beverage", nameBn: "খাদ্য ও পানীয়", nameEn: "Food & Beverage", icon: UtensilsCrossed },
  { slug: "clothing", nameBn: "পোশাক", nameEn: "Clothing", icon: Shirt },
  { slug: "services", nameBn: "সেবা", nameEn: "Services", icon: Wrench },
  { slug: "pharmacy-health", nameBn: "ফার্মেসি ও স্বাস্থ্য", nameEn: "Pharmacy & Health", icon: Pill },
  { slug: "electronics", nameBn: "ইলেকট্রনিকস", nameEn: "Electronics", icon: Smartphone },
  { slug: "cosmetics", nameBn: "কসমেটিকস", nameEn: "Cosmetics", icon: Sparkles },
  { slug: "agriculture-livestock", nameBn: "কৃষি ও পশু", nameEn: "Agriculture & Livestock", icon: Sprout },
  { slug: "others", nameBn: "অন্যান্য", nameEn: "Others", icon: LayoutGrid },
];

export const CONTACT = {
  email: "regardstech.team@gmail.com",
  phone: "+880 1943-907743",
  phoneBn: "+৮৮০ ১৯৪৩-৯০৭৭৪৩",
  address: "Dhaka, Bangladesh",
  addressBn: "ঢাকা, বাংলাদেশ",
};

export function getCategory(slug: string) {
  return CATEGORIES.find((c) => c.slug === slug);
}
