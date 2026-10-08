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
    <span className="relative inline-block whitespace-nowrap overflow-visible">
      <span className="relative z-10">{children}</span>
      <svg
        aria-hidden="true"
        viewBox={circle ? "0 0 300 76" : "0 0 300 16"}
        preserveAspectRatio="none"
        style={
          circle
            ? {
                position: "absolute",
                left: "-0.22em",
                right: "-0.22em",
                top: "-0.18em",
                bottom: "-0.12em",
                width: "calc(100% + 0.44em)",
                height: "calc(100% + 0.30em)",
                zIndex: 0,
                pointerEvents: "none",
                overflow: "visible",
              }
            : {
                position: "absolute",
                left: 0,
                bottom: "-0.28em",
                width: "100%",
                height: "0.35em",
                zIndex: 0,
                pointerEvents: "none",
                overflow: "visible",
              }
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
          animate={{ pathLength: 1 }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1], delay: 0.2 }}
        />
      </svg>
    </span>
  );
}
