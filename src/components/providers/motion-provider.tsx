"use client";

import { MotionConfig } from "framer-motion";
import type { ReactNode } from "react";

/**
 * Global motion defaults (spec: 0.2–0.4s, easeOut, never bouncy) and
 * reducedMotion="user" so prefers-reduced-motion disables transform animations.
 */
export function MotionProvider({ children }: { children: ReactNode }) {
  return (
    <MotionConfig reducedMotion="user" transition={{ duration: 0.25, ease: "easeOut" }}>
      {children}
    </MotionConfig>
  );
}
