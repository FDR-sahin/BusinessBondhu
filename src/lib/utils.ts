import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

/** Merge conditional class names and resolve Tailwind conflicts. */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const BANG_DIGITS = ["০", "১", "২", "৩", "৪", "৫", "৬", "৭", "৮", "৯"];

/** Convert English digit string or number to Bangla digits string */
export function toBanglaDigits(value: number | string): string {
  return String(value).replace(/\d/g, (d) => BANG_DIGITS[Number(d)] ?? d);
}

/** Format numbers according to active language (bn/en) with tabular-nums support */
export function toFormattedNumber(value: number | string, lang: "bn" | "en" = "bn"): string {
  const n = typeof value === "string" ? Number(value) : value;
  if (Number.isNaN(n)) return String(value);
  if (lang === "bn") {
    return new Intl.NumberFormat("bn-BD").format(n);
  }
  return new Intl.NumberFormat("en-US").format(n);
}

/** Deprecated backward compatibility helper, formats as Bangla number */
export function toBanglaNumber(value: number | string): string {
  return toFormattedNumber(value, "bn");
}

/** Format currency value in BDT for specified language */
export function formatBDT(value: number, lang: "bn" | "en" = "bn"): string {
  return `৳ ${toFormattedNumber(value, lang)}`;
}

/** Format price or price range in BDT (e.g. ৳ 500 - 650) */
export function formatPriceRange(
  minPrice?: number | string,
  maxPrice?: number | string,
  customText?: string,
  lang: "bn" | "en" = "bn"
): string {
  let min = typeof minPrice === "string" ? parseFloat(minPrice.replace(/[^\d.]/g, "")) : minPrice;
  let max = typeof maxPrice === "string" ? parseFloat(maxPrice.replace(/[^\d.]/g, "")) : maxPrice;

  // If minPrice string contains a hyphenated range (e.g. "105-160")
  if (typeof minPrice === "string" && (minPrice.includes("-") || minPrice.includes("–"))) {
    const parts = minPrice.split(/[-–]/).map((p) => p.replace(/[^\d.]/g, "").trim());
    if (parts.length >= 2) {
      const parsedMin = parseFloat(parts[0]);
      const parsedMax = parseFloat(parts[1]);
      if (!Number.isNaN(parsedMin)) min = parsedMin;
      if (!Number.isNaN(parsedMax)) max = parsedMax;
    }
  }

  // If customText contains a range (e.g. "105-160" or "105 - 160")
  if (customText && (customText.includes("-") || customText.includes("–"))) {
    const parts = customText.split(/[-–]/).map((p) => p.replace(/[^\d.]/g, "").trim());
    if (parts.length >= 2) {
      const parsedMin = parseFloat(parts[0]);
      const parsedMax = parseFloat(parts[1]);
      if (!Number.isNaN(parsedMin)) min = parsedMin;
      if (!Number.isNaN(parsedMax)) max = parsedMax;
    }
  }

  // If both min and max are valid and max > min, ALWAYS format the full range:
  if (min !== undefined && max !== undefined && !Number.isNaN(min) && !Number.isNaN(max) && min > 0 && max > 0 && max > min) {
    return `৳ ${toFormattedNumber(min, lang)} - ${toFormattedNumber(max, lang)}`;
  }

  // If customText is a custom string (not just a single number), return it
  if (customText && customText.trim() && isNaN(Number(customText))) {
    return customText;
  }

  if (min !== undefined && !Number.isNaN(min) && min > 0) {
    return `৳ ${toFormattedNumber(min, lang)}`;
  }
  if (max !== undefined && !Number.isNaN(max) && max > 0) {
    return `৳ ${toFormattedNumber(max, lang)}`;
  }
  return lang === "bn" ? "দাম উল্লেখ নেই" : "N/A";
}

/** Absolute URL helper for metadata / share links. */
export function absoluteUrl(path = "/") {
  const base = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
  return `${base.replace(/\/$/, "")}${path}`;
}

/** "Jane Doe" -> "JD". Returns empty string for Bangla names to display clean icon instead of weird letter pairs */
export function getInitials(name?: string): string {
  if (!name) return "";
  const trimmed = name.trim();
  if (/[\u0980-\u09FF]/.test(trimmed)) {
    return "";
  }
  const parts = trimmed.split(/\s+/).filter(Boolean);
  return parts
    .slice(0, 2)
    .map((p) => Array.from(p)[0] ?? "")
    .join("")
    .toUpperCase();
}

/** Relative time display supporting bn and en */
export function timeAgo(iso: string, lang: "bn" | "en" = "bn"): string {
  const minutes = Math.floor(Math.max(0, Date.now() - new Date(iso).getTime()) / 60000);
  if (lang === "bn") {
    if (minutes < 1) return "এইমাত্র";
    if (minutes < 60) return `${toBanglaDigits(minutes)} মিনিট আগে`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${toBanglaDigits(hours)} ঘণ্টা আগে`;
    const days = Math.floor(hours / 24);
    if (days < 30) return `${toBanglaDigits(days)} দিন আগে`;
    const months = Math.floor(days / 30);
    if (months < 12) return `${toBanglaDigits(months)} মাস আগে`;
    return `${toBanglaDigits(Math.floor(months / 12))} বছর আগে`;
  }
  if (minutes < 1) return "just now";
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days < 30) return `${days}d ago`;
  const months = Math.floor(days / 30);
  if (months < 12) return `${months}mo ago`;
  return `${Math.floor(months / 12)}y ago`;
}

/** Backward compatibility helper for Bangla relative time */
export function timeAgoBn(iso: string): string {
  return timeAgo(iso, "bn");
}

/** Date formatter supporting bn and en */
export function formatDate(iso: string, lang: "bn" | "en" = "bn"): string {
  const loc = lang === "bn" ? "bn-BD" : "en-US";
  return new Intl.DateTimeFormat(loc, { day: "numeric", month: "long", year: "numeric" }).format(new Date(iso));
}

/** Backward compatibility helper for Bangla date format */
export function formatDateBn(iso: string): string {
  return formatDate(iso, "bn");
}

/** "2026-05" -> "মে" / "May" */
export function monthLabel(yearMonth: string, lang: "bn" | "en" = "bn"): string {
  const [y, m] = yearMonth.split("-").map(Number);
  const loc = lang === "bn" ? "bn-BD" : "en-US";
  return new Intl.DateTimeFormat(loc, { month: "short" }).format(new Date(y ?? 2000, (m ?? 1) - 1, 1));
}
