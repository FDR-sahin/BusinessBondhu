"use client";

import { motion } from "framer-motion";
import Image from "next/image";

/**
 * Senior UI/UX 3D Bangladesh Map Watermark Component
 * Uses the exact official Bangladesh map with district outlines & red national circle,
 * rendered in 3D isometric perspective with floating depth layers, radial lighting,
 * and pulsing division radar nodes.
 */
export function BgMapWatermark() {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-0 overflow-hidden select-none"
    >
      <div className="absolute inset-0 flex items-center justify-center transition-opacity duration-700">
        <motion.div
          initial={{ opacity: 0, scale: 0.92 }}
          animate={{
            opacity: 1,
            scale: 1,
            y: [0, -14, 0],
            rotateX: [18, 22, 18],
            rotateY: [-10, -6, -10],
            rotateZ: [1, -1, 1],
          }}
          transition={{
            opacity: { duration: 1.2 },
            scale: { duration: 1.2 },
            y: { repeat: Infinity, duration: 9, ease: "easeInOut" },
            rotateX: { repeat: Infinity, duration: 11, ease: "easeInOut" },
            rotateY: { repeat: Infinity, duration: 13, ease: "easeInOut" },
            rotateZ: { repeat: Infinity, duration: 15, ease: "easeInOut" },
          }}
          className="relative h-[680px] w-[580px] transform-gpu preserve-3d"
          style={{
            perspective: "1400px",
            transformStyle: "preserve-3d",
          }}
        >
          {/* Layer 1: Ambient Emerald Radial Glow Base */}
          <div className="absolute inset-0 -bottom-16 -top-10 rounded-full bg-gradient-radial from-green/20 via-primary-soft/15 to-transparent blur-3xl opacity-70" />

          {/* Layer 2: 3D Depth Shadow / Extrusion Offset */}
          <div
            className="absolute inset-0 opacity-15 dark:opacity-10 filter blur-[2px] transition-transform duration-300"
            style={{ transform: "translateZ(-30px) translateY(24px) scale(0.98)" }}
          >
            <Image
              src="/images/bd-map.png"
              alt=""
              fill
              className="object-contain brightness-0 contrast-200"
              priority
            />
          </div>

          {/* Layer 3: Official Bangladesh Map Image (Primary 3D Layer) */}
          <div
            className="relative h-full w-full opacity-20 dark:opacity-15 mix-blend-multiply dark:mix-blend-screen transition-all duration-500 drop-shadow-[0_25px_40px_rgba(11,107,69,0.25)]"
            style={{ transform: "translateZ(10px)" }}
          >
            <Image
              src="/images/bd-map.png"
              alt="Official Bangladesh Map"
              fill
              className="object-contain"
              priority
            />
          </div>

          {/* Layer 4: Floating 3D Division Radar Nodes Overlay */}
          <div
            className="absolute inset-0 h-full w-full"
            style={{ transform: "translateZ(25px)" }}
          >
            <svg
              viewBox="0 0 580 680"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="h-full w-full"
            >
              {/* 8 Division Radar Hub Centers */}
              {[
                { label: "Dhaka", cx: 290, cy: 335 },
                { label: "Chittagong", cx: 445, cy: 450 },
                { label: "Sylhet", cx: 415, cy: 195 },
                { label: "Rajshahi", cx: 165, cy: 235 },
                { label: "Khulna", cx: 205, cy: 465 },
                { label: "Barisal", cx: 285, cy: 495 },
                { label: "Rangpur", cx: 200, cy: 115 },
                { label: "Mymensingh", cx: 305, cy: 215 },
              ].map((node, idx) => (
                <g key={node.label}>
                  {/* Outer Pulsing Ping Ring */}
                  <circle
                    cx={node.cx}
                    cy={node.cy}
                    r="14"
                    className="fill-green/15 stroke-green/40 animate-ping origin-center"
                    style={{ animationDuration: `${3.2 + idx * 0.4}s` }}
                  />

                  {/* Inner Solid Hub Ring */}
                  <circle
                    cx={node.cx}
                    cy={node.cy}
                    r="6"
                    className="fill-green/20 stroke-green/80"
                    strokeWidth="1.5"
                  />

                  {/* Center Core Dot */}
                  <circle
                    cx={node.cx}
                    cy={node.cy}
                    r="2.5"
                    className="fill-green"
                  />

                  {/* Division Tag Label */}
                  <text
                    x={node.cx + 9}
                    y={node.cy + 4}
                    className="fill-ink-secondary text-[10px] font-mono font-bold tracking-widest uppercase opacity-70"
                  >
                    {node.label}
                  </text>
                </g>
              ))}
            </svg>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
