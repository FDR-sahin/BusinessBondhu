"use client";

import { useEffect, useState } from "react";
import { Slider } from "@/components/ui/slider";
import { PRICE_MAX, PRICE_STEP, type PriceRange } from "@/lib/explore";
import { formatBDT } from "@/lib/utils";

interface PriceRangeFilterProps {
  label: string;
  value: PriceRange;
  onCommit: (range: PriceRange) => void;
}

/**
 * Dragging updates the label instantly; the URL/API only change when the
 * user releases the handle (onValueCommit) — no request storm while sliding.
 */
export function PriceRangeFilter({ label, value, onCommit }: PriceRangeFilterProps) {
  const [local, setLocal] = useState<PriceRange>(value);

  useEffect(() => setLocal(value), [value[0], value[1]]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div className="space-y-4 px-1 pt-1">
      <Slider
        min={0}
        max={PRICE_MAX}
        step={PRICE_STEP}
        value={local}
        onValueChange={(v) => setLocal([v[0] ?? 0, v[1] ?? PRICE_MAX])}
        onValueCommit={(v) => onCommit([v[0] ?? 0, v[1] ?? PRICE_MAX])}
        aria-label={label}
      />
      <p className="text-sm text-ink-secondary" aria-live="polite">
        {formatBDT(local[0])} – {formatBDT(local[1])}
        {local[1] >= PRICE_MAX ? "+" : ""}
      </p>
    </div>
  );
}
