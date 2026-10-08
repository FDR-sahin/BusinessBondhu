"use client";

import React from "react";
import { motion, useReducedMotion } from "framer-motion";

type Props = { children: React.ReactNode; variant?: "underline" | "circle" };

export function PenMark({ children, variant = "underline" }: Props) {
  const reduce = useReducedMotion();
  const circle = variant === "circle";
  const d = circle
    ? "M14 38 C6 16 70 4 150 6 C235 8 292 22 286 42 C280 62 190 72 120 68 C50 64 10 56 16 34"
    : "M4 10 C60 3 140 14 210 7 S288 9 296 5";
  return (
    <span className="relative inline-block whitespace-nowrap">
      <span className="relative z-10">{children}</span>
      <svg
        aria-hidden="true"
        viewBox={circle ? "0 0 300 76" : "0 0 300 16"}
        preserveAspectRatio="none"
        className={
          circle
            ? "pointer-events-none absolute left-[-0.5rem] top-[-0.35rem] h-[calc(100%+0.7rem)] w-[calc(100%+1rem)]"
            : "pointer-events-none absolute bottom-[-0.2rem] left-0 h-[0.5em] w-full"
        }
      >
        <motion.path
          d={d}
          fill="none"
          stroke="var(--pen)"
          strokeWidth={3}
          strokeLinecap="round"
          vectorEffect="non-scaling-stroke"
          initial={{ pathLength: reduce ? 1 : 0 }}
          whileInView={{ pathLength: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1], delay: 0.3 }}
        />
      </svg>
    </span>
  );
}
