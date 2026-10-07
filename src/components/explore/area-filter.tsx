"use client";

import { Search } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { Input } from "@/components/ui/input";

/** Free-text area search, debounced 400ms so we don't hit the API on every keystroke. */
export function AreaFilter({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  const [local, setLocal] = useState(value);
  const committed = useRef(value);

  // External change (e.g. "reset all") -> reflect it in the input.
  useEffect(() => {
    if (value !== committed.current) {
      committed.current = value;
      setLocal(value);
    }
  }, [value]);

  // Typing -> commit to the URL after a pause.
  useEffect(() => {
    if (local === committed.current) return;
    const t = setTimeout(() => {
      committed.current = local;
      onChange(local);
    }, 400);
    return () => clearTimeout(t);
  }, [local, onChange]);

  return (
    <div className="relative">
      <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-muted" aria-hidden />
      <Input
        type="search"
        value={local}
        onChange={(e) => setLocal(e.target.value)}
        placeholder="যেমন: মিরপুর, উত্তরা"
        aria-label="এলাকা"
        maxLength={80}
        className="pl-9"
      />
    </div>
  );
}
