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
        const isSelected = selected.includes(o.value);
        return (
          <li
            key={o.value}
            className={`flex items-center gap-2.5 rounded-lg px-2 py-1.5 transition-colors cursor-pointer ${
              isSelected
                ? "bg-green/10 text-green font-medium dark:bg-green/20"
                : "hover:bg-green/10 hover:text-green dark:hover:bg-green/20"
            }`}
          >
            <Checkbox id={id} checked={isSelected} onCheckedChange={(c) => onToggle(o.value, c === true)} />
            <Label htmlFor={id} className="flex-1 cursor-pointer font-normal text-inherit">
              {o.label}
            </Label>
          </li>
        );
      })}
    </ul>
  );
}
