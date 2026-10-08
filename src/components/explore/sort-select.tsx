"use client";

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { SORT_OPTIONS, type SortKey } from "@/lib/explore";
import { useT } from "@/lib/i18n";
import { useLangStore } from "@/store/lang-store";

export function SortSelect({ value, onChange }: { value: SortKey; onChange: (v: SortKey) => void }) {
  const t = useT();
  const lang = useLangStore((s) => s.lang);

  return (
    <Select value={value} onValueChange={(v) => onChange(v as SortKey)}>
      <SelectTrigger aria-label={t("sortBy")} className="h-10 w-[11.5rem] sm:w-[13rem]">
        <SelectValue />
      </SelectTrigger>
      <SelectContent align="end">
        {SORT_OPTIONS.map((o) => (
          <SelectItem key={o.value} value={o.value}>
            {lang === "bn" ? o.labelBn : o.labelEn}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
