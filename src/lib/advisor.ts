const BN_DIGITS = "০১২৩৪৫৬৭৮৯";

/** Accepts "10000", "১০,০০০", "৳ 10 000" -> 10000. Returns NaN for anything else. */
export function parseAmount(input: string): number {
  const ascii = input
    .replace(/[০-৯]/g, (d) => String(BN_DIGITS.indexOf(d)))
    .replace(/[,\s৳]/g, "");
  return /^\d+(\.\d+)?$/.test(ascii) ? Number(ascii) : NaN;
}

export const QUICK_BUDGETS = [
  { labelBn: "৫ হাজার", labelEn: "5k", value: 5_000 },
  { labelBn: "১০ হাজার", labelEn: "10k", value: 10_000 },
  { labelBn: "২০ হাজার", labelEn: "20k", value: 20_000 },
  { labelBn: "৫০ হাজার", labelEn: "50k", value: 50_000 },
];

export const MIN_BUDGET = 1_000;
export const MAX_BUDGET = 10_000_000;

/** Spec: <30% green, 30–60% yellow, >60% red. */
export function riskLevel(percent: number, lang: "bn" | "en" = "bn") {
  if (percent < 30) return { label: lang === "en" ? "Low Risk" : "কম ঝুঁকি", bar: "bg-success", text: "text-success-soft-foreground" };
  if (percent <= 60) return { label: lang === "en" ? "Medium Risk" : "মাঝারি ঝুঁকি", bar: "bg-secondary", text: "text-secondary-soft-foreground" };
  return { label: lang === "en" ? "High Risk" : "বেশি ঝুঁকি", bar: "bg-danger", text: "text-danger-soft-foreground" };
}
