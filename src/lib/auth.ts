import axios from "axios";
import { getErrorMessage } from "@/lib/api";

/** Only same-site relative paths are allowed (blocks open-redirect attacks). */
export function safeRedirect(value: string | null | undefined, fallback = "/dashboard"): string {
  return value && value.startsWith("/") && !value.startsWith("//") ? value : fallback;
}

export const POST_LOGIN_KEY = "bhbd-post-login";

type Context = "login" | "signup" | "forgot" | "reset";

/** User-friendly messages for common auth failures supporting bn and en. */
export function authErrorMessage(error: unknown, context: Context, lang: "bn" | "en" = "bn"): string {
  if (axios.isAxiosError(error) && error.response) {
    const status = error.response.status;
    if (status === 401 && context === "login") {
      return lang === "bn" ? "ইমেইল বা পাসওয়ার্ড সঠিক নয়।" : "Incorrect email or password.";
    }
    if (status === 409) {
      return lang === "bn"
        ? "এই ইমেইল দিয়ে আগেই অ্যাকাউন্ট খোলা হয়েছে। লগইন করুন।"
        : "An account with this email already exists. Please sign in.";
    }
    if (status === 429) {
      return lang === "bn"
        ? "অনেকবার চেষ্টা করা হয়েছে। কিছুক্ষণ পরে আবার চেষ্টা করুন।"
        : "Too many attempts. Please try again later.";
    }
    if ((status === 400 || status === 410) && context === "reset") {
      return lang === "bn"
        ? "লিংকটির মেয়াদ শেষ হয়ে গেছে। নতুন করে রিসেট লিংক নিন।"
        : "The reset link has expired. Please request a new one.";
    }
  }
  return getErrorMessage(error);
}

/** { errors: { email: ["…"] } } from the API -> { email: "…" } */
export function getFieldErrors(error: unknown): Record<string, string> {
  if (!axios.isAxiosError<{ errors?: Record<string, string[]> }>(error)) return {};
  const raw = error.response?.data?.errors ?? {};
  return Object.fromEntries(Object.entries(raw).flatMap(([k, v]) => (v?.[0] ? [[k, v[0]]] : [])));
}

/** 0–4 plus a localized label, for the signup strength meter. */
export function passwordStrength(pw: string, lang: "bn" | "en" = "bn"): { score: 0 | 1 | 2 | 3 | 4; label: string } {
  let score = 0;
  if (pw.length >= 8) score++;
  if (/[a-z]/.test(pw) && /[A-Z]/.test(pw)) score++;
  if (/\d/.test(pw)) score++;
  if (/[^A-Za-z0-9]/.test(pw) || pw.length >= 12) score++;
  const labelsBn = ["খুব দুর্বল", "দুর্বল", "মোটামুটি", "ভালো", "শক্তিশালী"];
  const labelsEn = ["Very Weak", "Weak", "Fair", "Good", "Strong"];
  const labels = lang === "bn" ? labelsBn : labelsEn;
  return { score: score as 0 | 1 | 2 | 3 | 4, label: labels[score] ?? "" };
}
