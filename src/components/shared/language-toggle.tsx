"use client";

import { useT } from "@/lib/i18n";
import { cn } from "@/lib/utils";
import { useLangStore, type Lang } from "@/store/lang-store";

const OPTIONS: { value: Lang; label: string; aria: string }[] = [
  { value: "bn", label: "বাং", aria: "বাংলা" },
  { value: "en", label: "EN", aria: "English" },
];

/** Segmented pill-shaped Bangla / English switch. */
export function LanguageToggle({ className }: { className?: string }) {
  const lang = useLangStore((s) => s.lang);
  const setLang = useLangStore((s) => s.setLang);
  const t = useT();

  return (
    <div
      role="group"
      aria-label={t("language")}
      className={cn("inline-flex items-center rounded-full border border-line bg-surface p-0.5 shadow-xs", className)}
    >
      {OPTIONS.map((o) => (
        <button
          key={o.value}
          type="button"
          aria-pressed={lang === o.value}
          aria-label={o.aria}
          onClick={() => setLang(o.value)}
          className={cn(
            "h-7 rounded-full px-3 text-xs font-semibold transition-all duration-200",
            lang === o.value
              ? "bg-green text-white shadow-xs"
              : "text-ink hover:text-green"
          )}
        >
          {o.label}
        </button>
      ))}
    </div>
  );
}
