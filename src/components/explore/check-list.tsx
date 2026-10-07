"use client";

import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";

interface CheckListProps {
  idPrefix: string;
  options: { value: string; label: string }[];
  selected: string[];
  onToggle: (value: string, checked: boolean) => void;
}

/** Vertical list of labelled checkboxes (multi-select filter). */
export function CheckList({ idPrefix, options, selected, onToggle }: CheckListProps) {
  return (
    <ul className="space-y-0.5">
      {options.map((o, i) => {
        const id = `${idPrefix}-${i}`;
        return (
          <li key={o.value} className="flex items-center gap-2.5 rounded-lg px-1 py-1.5 transition-colors hover:bg-muted">
            <Checkbox id={id} checked={selected.includes(o.value)} onCheckedChange={(c) => onToggle(o.value, c === true)} />
            <Label htmlFor={id} className="flex-1 cursor-pointer font-normal">{o.label}</Label>
          </li>
        );
      })}
    </ul>
  );
}
