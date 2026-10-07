"use client";

import { animate, useInView, useReducedMotion } from "framer-motion";
import type { LucideIcon } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { toBanglaNumber } from "@/lib/utils";
import { Card } from "./card";

/** Counts up from 0 the first time it scrolls into view. Reduced motion: shows the final number. */
export function AnimatedCounter({ value, duration = 0.8 }: { value: number; duration?: number }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-40px" });
  const reduce = useReducedMotion();
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    if (!inView) return;
    if (reduce) {
      setDisplay(value);
      return;
    }
    const controls = animate(0, value, { duration, ease: "easeOut", onUpdate: (v) => setDisplay(Math.round(v)) });
    return () => controls.stop();
  }, [inView, value, reduce, duration]);

  return (
    <span ref={ref} className="tabular-nums" aria-label={toBanglaNumber(value)}>
      {toBanglaNumber(display)}
    </span>
  );
}

interface StatCardProps {
  label: string;
  value: number;
  icon: LucideIcon;
  suffix?: string;
}

/** Reused on Analysis and the dashboard Overview. */
export function StatCard({ label, value, icon: Icon, suffix }: StatCardProps) {
  return (
    <Card className="flex items-start justify-between gap-4 p-6 transition-shadow hover:shadow-md">
      <div>
        <p className="text-sm font-medium text-ink-secondary">{label}</p>
        <p className="mt-2 text-3xl font-bold tracking-tight md:text-4xl">
          <AnimatedCounter value={value} />
          {suffix}
        </p>
      </div>
      <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary-soft text-primary-soft-foreground">
        <Icon className="h-5 w-5" aria-hidden />
      </span>
    </Card>
  );
}
