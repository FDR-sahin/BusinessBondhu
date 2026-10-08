"use client";

import { motion } from "framer-motion";
import Image from "next/image";

/**
 * Senior UI/UX 3D Bangladesh Map Watermark Component
 * Zoomed-in, soft-focused full-page watermark with gentle division radar indicators.
 */
export function BgMapWatermark() {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-0 overflow-hidden select-none flex items-center justify-center"
    >
      <motion.div
        initial={{ opacity: 0, scale: 1.2 }}
        animate={{
          opacity: 1,
          scale: [1.25, 1.3, 1.25],
          y: [0, -18, 0],
          rotateX: [12, 16, 12],
          rotateY: [-5, -1, -5],
        }}
        transition={{
          opacity: { duration: 1.2 },
          scale: { repeat: Infinity, duration: 14, ease: "easeInOut" },
          y: { repeat: Infinity, duration: 10, ease: "easeInOut" },
          rotateX: { repeat: Infinity, duration: 12, ease: "easeInOut" },
          rotateY: { repeat: Infinity, duration: 15, ease: "easeInOut" },
        }}
        className="relative h-[105vh] w-full max-w-[1600px] transform-gpu preserve-3d px-2"
        style={{
          perspective: "1400px",
          transformStyle: "preserve-3d",
        }}
      >
        {/* Ambient Soft Emerald Glow */}
        <div className="absolute inset-0 -bottom-24 rounded-full bg-gradient-radial from-green/10 via-primary-soft/5 to-transparent blur-3xl opacity-50" />

        {/* Zoomed-In Official Bangladesh Map Image (Soft Blurry Watermark) */}
        <div
          className="relative h-full w-full opacity-[0.11] dark:opacity-[0.07] filter blur-[4px] transition-all duration-500"
          style={{ transform: "translateZ(0px)" }}
        >
          <Image
            src="/images/bd-map.png"
            alt="Official Bangladesh Map Watermark"
            fill
            className="object-contain scale-110"
            priority
          />
        </div>

        {/* Soft, Blurry 3D Division Radar Nodes Overlay */}
        <div
          className="absolute inset-0 h-full w-full filter blur-[1.5px] opacity-45 dark:opacity-35"
          style={{ transform: "translateZ(15px)" }}
        >
          <svg
            viewBox="0 0 1000 800"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="h-full w-full"
          >
            {/* 8 Division Radar Hub Centers */}
            {[
              { label: "Dhaka", cx: 500, cy: 390 },
              { label: "Chittagong", cx: 760, cy: 530 },
              { label: "Sylhet", cx: 700, cy: 220 },
              { label: "Rajshahi", cx: 280, cy: 270 },
              { label: "Khulna", cx: 350, cy: 540 },
              { label: "Barisal", cx: 490, cy: 580 },
              { label: "Rangpur", cx: 340, cy: 130 },
              { label: "Mymensingh", cx: 520, cy: 250 },
            ].map((node, idx) => (
              <g key={node.label}>
                {/* Outer Soft Ping Ring */}
                <circle
                  cx={node.cx}
                  cy={node.cy}
                  r="18"
                  className="fill-green/5 stroke-green/20 animate-ping origin-center"
                  style={{ animationDuration: `${3.5 + idx * 0.4}s` }}
                />

                {/* Inner Soft Ring */}
                <circle
                  cx={node.cx}
                  cy={node.cy}
                  r="7"
                  className="fill-green/15 stroke-green/40"
                  strokeWidth="1"
                />

                {/* Center Core Dot */}
                <circle
                  cx={node.cx}
                  cy={node.cy}
                  r="3"
                  className="fill-green/60"
                />

                {/* Soft Division Label */}
                <text
                  x={node.cx + 10}
                  y={node.cy + 4}
                  className="fill-ink-secondary text-[11px] font-mono font-medium tracking-widest uppercase opacity-50"
                >
                  {node.label}
                </text>
              </g>
            ))}
          </svg>
        </div>
      </motion.div>
    </div>
  );
}
