"use client";

import { useT } from "@/lib/i18n";
import { cn } from "@/lib/utils";
import { useLangStore, type Lang } from "@/store/lang-store";

const OPTIONS: { value: Lang; label: string; aria: string }[] = [
  { value: "bn", label: "বাং", aria: "বাংলা" },
  { value: "en", label: "EN", aria: "English" },
];

/** Segmented Bangla / English switch. */
export function LanguageToggle({ className }: { className?: string }) {
  const lang = useLangStore((s) => s.lang);
  const setLang = useLangStore((s) => s.setLang);
  const t = useT();

  return (
    <div role="group" aria-label={t("language")} className={cn("inline-flex rounded-lg border border-border bg-surface p-0.5", className)}>
      {OPTIONS.map((o) => (
        <button
          key={o.value}
          type="button"
          aria-pressed={lang === o.value}
          aria-label={o.aria}
          onClick={() => setLang(o.value)}
          className={cn(
            "h-8 rounded-md px-2.5 text-sm font-medium transition-colors",
            lang === o.value ? "bg-primary text-primary-foreground" : "text-ink-secondary hover:text-foreground",
          )}
        >
          {o.label}
        </button>
      ))}
    </div>
  );
}
