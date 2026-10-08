"use client";

import { motion } from "framer-motion";
import Image from "next/image";

/**
 * Senior UI/UX 3D Bangladesh Map Watermark Component
 * Soft, full-page coverage watermark with subtle blur, emerald theme integration,
 * no dark shadows, and 3D floating division radar nodes.
 */
export function BgMapWatermark() {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-0 overflow-hidden select-none flex items-center justify-center"
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{
          opacity: 1,
          scale: 1,
          y: [0, -16, 0],
          rotateX: [14, 18, 14],
          rotateY: [-6, -2, -6],
        }}
        transition={{
          opacity: { duration: 1.2 },
          scale: { duration: 1.2 },
          y: { repeat: Infinity, duration: 10, ease: "easeInOut" },
          rotateX: { repeat: Infinity, duration: 12, ease: "easeInOut" },
          rotateY: { repeat: Infinity, duration: 14, ease: "easeInOut" },
        }}
        className="relative h-[85vh] w-full max-w-[1250px] transform-gpu preserve-3d px-4"
        style={{
          perspective: "1400px",
          transformStyle: "preserve-3d",
        }}
      >
        {/* Soft Emerald Glow Aura (No dark shadow) */}
        <div className="absolute inset-0 -bottom-20 rounded-full bg-gradient-radial from-green/15 via-primary-soft/10 to-transparent blur-3xl opacity-60" />

        {/* Full Page Official Bangladesh Map Image (Soft Blurry Watermark) */}
        <div
          className="relative h-full w-full opacity-[0.12] dark:opacity-[0.08] filter blur-[3px] transition-all duration-500"
          style={{ transform: "translateZ(0px)" }}
        >
          <Image
            src="/images/bd-map.png"
            alt="Official Bangladesh Map Watermark"
            fill
            className="object-contain"
            priority
          />
        </div>

        {/* Floating 3D Division Radar Nodes Overlay */}
        <div
          className="absolute inset-0 h-full w-full"
          style={{ transform: "translateZ(20px)" }}
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
              { label: "Chittagong", cx: 770, cy: 530 },
              { label: "Sylhet", cx: 710, cy: 220 },
              { label: "Rajshahi", cx: 280, cy: 270 },
              { label: "Khulna", cx: 350, cy: 540 },
              { label: "Barisal", cx: 490, cy: 580 },
              { label: "Rangpur", cx: 340, cy: 130 },
              { label: "Mymensingh", cx: 520, cy: 250 },
            ].map((node, idx) => (
              <g key={node.label}>
                {/* Outer Pulsing Ping Ring */}
                <circle
                  cx={node.cx}
                  cy={node.cy}
                  r="16"
                  className="fill-green/10 stroke-green/30 animate-ping origin-center"
                  style={{ animationDuration: `${3.2 + idx * 0.4}s` }}
                />

                {/* Inner Solid Hub Ring */}
                <circle
                  cx={node.cx}
                  cy={node.cy}
                  r="7"
                  className="fill-green/20 stroke-green/70"
                  strokeWidth="1.5"
                />

                {/* Center Core Dot */}
                <circle
                  cx={node.cx}
                  cy={node.cy}
                  r="3"
                  className="fill-green"
                />

                {/* Division Tag Label */}
                <text
                  x={node.cx + 10}
                  y={node.cy + 4}
                  className="fill-ink-secondary text-[11px] font-mono font-bold tracking-widest uppercase opacity-65"
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
