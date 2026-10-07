import { useCallback } from "react";
import { useLangStore } from "@/store/lang-store";

/**
 * Minimal dictionary for site chrome (header, footer, menus, auth labels).
 * Bangla is the source of truth; English must define the same keys (enforced by types).
 * Page-level content stays Bangla-first and is wired up page by page.
 */
const bn = {
  navHome: "হোম",
  navExplore: "এক্সপ্লোর",
  navBlog: "ব্লগ",
  navAnalysis: "বিশ্লেষণ",
  navAiAdvisor: "এআই পরামর্শ",
  navAbout: "আমাদের সম্পর্কে",
  navSaved: "সংরক্ষিত",
  login: "লগইন",
  signup: "সাইন আপ",
  dashboard: "ড্যাশবোর্ড",
  profile: "প্রোফাইল",
  settings: "সেটিংস",
  logout: "লগআউট",
  loggedOut: "আপনি সফলভাবে লগআউট করেছেন",
  notifications: "নোটিফিকেশন",
  openMenu: "মেনু খুলুন",
  closeMenu: "মেনু বন্ধ করুন",
  mainMenu: "প্রধান মেনু",
  skipToContent: "মূল কন্টেন্টে যান",
  toggleTheme: "থিম পরিবর্তন করুন",
  language: "ভাষা",
  accountMenu: "অ্যাকাউন্ট মেনু",
  footerAbout: "আমাদের সম্পর্কে",
  footerAboutText:
    "বাংলাদেশের ছোট ও মাঝারি উদ্যোক্তাদের জন্য একটি খাতা। এলাকাভিত্তিক ব্যবসার আইডিয়া, পাইকারি-খুচরা দাম এবং মার্জিন হিসাব এক জায়গায়।",
  footerQuickLinks: "দ্রুত লিংক",
  footerCategories: "ক্যাটাগরি",
  footerContact: "যোগাযোগ",
  rights: "সর্বস্বত্ব সংরক্ষিত।",
  newsletterTitle: "নতুন ব্যবসার আইডিয়া সরাসরি ইনবক্সে",
  newsletterText: "প্রতি সপ্তাহে এলাকাভিত্তিক সেরা আইডিয়া ও বাজারদরের খবর পান।",
  emailPlaceholder: "আপনার ইমেইল",
  subscribe: "সাবস্ক্রাইব",
  subscribed: "ধন্যবাদ! আপনি সফলভাবে সাবস্ক্রাইব করেছেন।",

  // New keys for Step 2 redesign
  trustStripFree: "বিনামূল্যে ব্যবহার করুন",
  trustStripModerated: "মডারেটেড পোস্ট",
  trustStripDistricts: "সকল ৬৪ জেলা",
  shareIdea: "আইডিয়া শেয়ার করুন",
  createPost: "আইডিয়া যোগ",
  closingNote: "একটি আইডিয়া একটি শুরু। অনেক আইডিয়া একটি বাজার।",
} as const;

const en: Record<keyof typeof bn, string> = {
  navHome: "Home",
  navExplore: "Explore",
  navBlog: "Blog",
  navAnalysis: "Analysis",
  navAiAdvisor: "AI Advisor",
  navAbout: "About",
  navSaved: "Saved",
  login: "Login",
  signup: "Sign Up",
  dashboard: "Dashboard",
  profile: "Profile",
  settings: "Settings",
  logout: "Logout",
  loggedOut: "You have been logged out",
  notifications: "Notifications",
  openMenu: "Open menu",
  closeMenu: "Close menu",
  mainMenu: "Main menu",
  skipToContent: "Skip to main content",
  toggleTheme: "Toggle theme",
  language: "Language",
  accountMenu: "Account menu",
  footerAbout: "About",
  footerAboutText:
    "A shopkeeper's ledger for small & medium entrepreneurs in Bangladesh. Local business ideas, wholesale & retail prices, and margin calculations in one place.",
  footerQuickLinks: "Quick Links",
  footerCategories: "Categories",
  footerContact: "Contact",
  rights: "All rights reserved.",
  newsletterTitle: "Fresh business ideas, straight to your inbox",
  newsletterText: "Get the best local ideas and market price updates every week.",
  emailPlaceholder: "Your email",
  subscribe: "Subscribe",
  subscribed: "Thank you! You are now subscribed.",

  // New keys for Step 2 redesign
  trustStripFree: "Free to use",
  trustStripModerated: "Moderated posts",
  trustStripDistricts: "All 64 districts",
  shareIdea: "Share Idea",
  createPost: "Add Idea",
  closingNote: "One idea is a start. Many ideas make a market.",
};

const dictionaries = { bn, en } as const;
export type TKey = keyof typeof bn;

/** const t = useT(); t("login") -> "লগইন" | "Login" */
export function useT() {
  const lang = useLangStore((s) => s.lang);
  return useCallback((key: TKey) => dictionaries[lang][key], [lang]);
}
