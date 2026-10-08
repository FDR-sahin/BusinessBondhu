"use client";

import { Search } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { Input } from "@/components/ui/input";
import { useT } from "@/lib/i18n";

export function AreaFilter({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  const [local, setLocal] = useState(value);
  const committed = useRef(value);
  const t = useT();

  useEffect(() => {
    if (value !== committed.current) {
      committed.current = value;
      setLocal(value);
    }
  }, [value]);

  useEffect(() => {
    if (local === committed.current) return;
    const timer = setTimeout(() => {
      committed.current = local;
      onChange(local);
    }, 400);
    return () => clearTimeout(timer);
  }, [local, onChange]);

  return (
    <div className="relative">
      <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" aria-hidden />
      <Input
        type="search"
        value={local}
        onChange={(e) => setLocal(e.target.value)}
        placeholder={t("areaPlaceholder")}
        aria-label={t("area")}
        maxLength={80}
        className="pl-9"
      />
    </div>
  );
}
