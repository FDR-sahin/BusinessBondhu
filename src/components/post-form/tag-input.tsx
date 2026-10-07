"use client";

import { X } from "lucide-react";
import { useState, type KeyboardEvent } from "react";
import { cn } from "@/lib/utils";

interface TagInputProps {
  id?: string;
  value: string[];
  onChange: (tags: string[]) => void;
  max?: number;
  invalid?: boolean;
}

/** Type a tag, press Enter or comma. Backspace on an empty box removes the last one. */
export function TagInput({ id, value, onChange, max = 8, invalid }: TagInputProps) {
  const [draft, setDraft] = useState("");

  function add(raw: string) {
    const tag = raw.replace(/^#/, "").trim().slice(0, 20);
    if (!tag || value.includes(tag) || value.length >= max) return;
    onChange([...value, tag]);
  }

  function onKeyDown(e: KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault(); // Enter must not submit the whole form
      add(draft);
      setDraft("");
    } else if (e.key === "Backspace" && !draft && value.length) {
      onChange(value.slice(0, -1));
    }
  }

  return (
    <div
      aria-invalid={invalid || undefined}
      className={cn("flex min-h-11 flex-wrap items-center gap-2 rounded-lg border border-border bg-surface px-2.5 py-2 shadow-sm focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2 focus-within:ring-offset-background aria-[invalid=true]:border-danger")}
    >
      {value.map((t) => (
        <span key={t} className="inline-flex items-center gap-1 rounded-lg bg-primary-soft py-0.5 pl-2.5 pr-1 text-sm text-primary-soft-foreground">
          #{t}
          <button type="button" onClick={() => onChange(value.filter((x) => x !== t))} aria-label={`${t} ট্যাগ সরান`} className="rounded p-0.5 hover:bg-primary/10"><X className="h-3.5 w-3.5" /></button>
        </span>
      ))}
      <input
        id={id}
        value={draft}
        onChange={(e) => setDraft(e.target.value)}
        onKeyDown={onKeyDown}
        onBlur={() => { add(draft); setDraft(""); }}
        disabled={value.length >= max}
        placeholder={value.length >= max ? "সর্বোচ্চ ট্যাগ হয়ে গেছে" : value.length ? "" : "ট্যাগ লিখে Enter চাপুন"}
        className="min-w-[8rem] flex-1 bg-transparent text-base placeholder:text-ink-secondary/70 focus:outline-none focus-visible:ring-0 focus-visible:ring-offset-0"
      />
    </div>
  );
}
