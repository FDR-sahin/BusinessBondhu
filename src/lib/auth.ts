import axios from "axios";
import { getErrorMessage } from "@/lib/api";

/** Only same-site relative paths are allowed (blocks open-redirect attacks). */
export function safeRedirect(value: string | null | undefined, fallback = "/dashboard"): string {
  return value && value.startsWith("/") && !value.startsWith("//") ? value : fallback;
}

export const POST_LOGIN_KEY = "bhbd-post-login";

type Context = "login" | "signup" | "forgot" | "reset";

/** Bangla, user-friendly messages for the most common auth failures. */
export function authErrorMessage(error: unknown, context: Context): string {
  if (axios.isAxiosError(error) && error.response) {
    const status = error.response.status;
    // Deliberately vague for login: never reveal whether the email exists.
    if (status === 401 && context === "login") return "ইমেইল বা পাসওয়ার্ড সঠিক নয়।";
    if (status === 409) return "এই ইমেইল দিয়ে আগেই অ্যাকাউন্ট খোলা হয়েছে। লগইন করুন।";
    if (status === 429) return "অনেকবার চেষ্টা করা হয়েছে। কিছুক্ষণ পরে আবার চেষ্টা করুন।";
    if ((status === 400 || status === 410) && context === "reset") return "লিংকটির মেয়াদ শেষ হয়ে গেছে। নতুন করে রিসেট লিংক নিন।";
  }
  return getErrorMessage(error);
}

/** { errors: { email: ["…"] } } from the API -> { email: "…" } */
export function getFieldErrors(error: unknown): Record<string, string> {
  if (!axios.isAxiosError<{ errors?: Record<string, string[]> }>(error)) return {};
  const raw = error.response?.data?.errors ?? {};
  return Object.fromEntries(Object.entries(raw).flatMap(([k, v]) => (v?.[0] ? [[k, v[0]]] : [])));
}

/** 0–4 plus a Bangla label, for the signup strength meter. */
export function passwordStrength(pw: string): { score: 0 | 1 | 2 | 3 | 4; label: string } {
  let score = 0;
  if (pw.length >= 8) score++;
  if (/[a-z]/.test(pw) && /[A-Z]/.test(pw)) score++;
  if (/\d/.test(pw)) score++;
  if (/[^A-Za-z0-9]/.test(pw) || pw.length >= 12) score++;
  const labels = ["খুব দুর্বল", "দুর্বল", "মোটামুটি", "ভালো", "শক্তিশালী"];
  return { score: score as 0 | 1 | 2 | 3 | 4, label: labels[score] ?? "" };
}
