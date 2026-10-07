import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

/** Merge conditional class names and resolve Tailwind conflicts. */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/** 12500 -> "১২,৫০০" */
export function toBanglaNumber(value: number | string): string {
  const n = typeof value === "string" ? Number(value) : value;
  if (Number.isNaN(n)) return String(value);
  return new Intl.NumberFormat("bn-BD").format(n);
}

/** 12500 -> "৳ ১২,৫০০" */
export function formatBDT(value: number): string {
  return `৳ ${toBanglaNumber(value)}`;
}

/** Absolute URL helper for metadata / share links. */
export function absoluteUrl(path = "/") {
  const base = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
  return `${base.replace(/\/$/, "")}${path}`;
}

/** "রহিম উদ্দিন" -> "রউ", "Jane Doe" -> "JD" */
export function getInitials(name?: string): string {
  if (!name) return "?";
  const parts = name.trim().split(/\s+/).filter(Boolean);
  return parts
    .slice(0, 2)
    .map((p) => Array.from(p)[0] ?? "")
    .join("")
    .toUpperCase();
}

/** "২ ঘণ্টা আগে" style relative time in Bangla. */
export function timeAgoBn(iso: string): string {
  const minutes = Math.floor(Math.max(0, Date.now() - new Date(iso).getTime()) / 60000);
  if (minutes < 1) return "এইমাত্র";
  if (minutes < 60) return `${toBanglaNumber(minutes)} মিনিট আগে`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${toBanglaNumber(hours)} ঘণ্টা আগে`;
  const days = Math.floor(hours / 24);
  if (days < 30) return `${toBanglaNumber(days)} দিন আগে`;
  const months = Math.floor(days / 30);
  if (months < 12) return `${toBanglaNumber(months)} মাস আগে`;
  return `${toBanglaNumber(Math.floor(months / 12))} বছর আগে`;
}

/** "১২ অক্টোবর ২০২৬" */
export function formatDateBn(iso: string): string {
  return new Intl.DateTimeFormat("bn-BD", { day: "numeric", month: "long", year: "numeric" }).format(new Date(iso));
}

/** "2026-05" -> "মে" */
export function monthLabel(yearMonth: string): string {
  const [y, m] = yearMonth.split("-").map(Number);
  return new Intl.DateTimeFormat("bn-BD", { month: "short" }).format(new Date(y ?? 2000, (m ?? 1) - 1, 1));
}
