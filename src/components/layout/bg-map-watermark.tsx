"use client";

import { motion } from "framer-motion";

/**
 * Animated 3D Bangladesh Map Watermark Component
 * Renders an elegant 3D isometric perspective outline of Bangladesh
 * with division node indicators and subtle floating animation in the background.
 */
export function BgMapWatermark() {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-0 overflow-hidden select-none"
    >
      <div className="absolute inset-0 flex items-center justify-center opacity-10 dark:opacity-[0.07] transition-opacity duration-500">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{
            opacity: 1,
            scale: 1,
            y: [0, -12, 0],
            rotateX: [12, 16, 12],
            rotateY: [-8, -4, -8],
          }}
          transition={{
            opacity: { duration: 1 },
            scale: { duration: 1 },
            y: { repeat: Infinity, duration: 8, ease: "easeInOut" },
            rotateX: { repeat: Infinity, duration: 10, ease: "easeInOut" },
            rotateY: { repeat: Infinity, duration: 12, ease: "easeInOut" },
          }}
          className="relative h-[650px] w-[600px] transform-gpu preserve-3d"
          style={{
            perspective: "1200px",
            transformStyle: "preserve-3d",
          }}
        >
          {/* 3D Depth Shadow / Floor Mesh */}
          <div className="absolute inset-0 -bottom-10 rounded-full bg-gradient-radial from-green/20 via-primary-soft/10 to-transparent blur-3xl" />

          {/* SVG Map Silhouette of Bangladesh with Division Grid */}
          <svg
            viewBox="0 0 600 700"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="h-full w-full drop-shadow-[0_20px_35px_rgba(11,107,69,0.15)]"
          >
            {/* Outer Boundary Path of Bangladesh */}
            <motion.path
              d="M310 40 
                 C330 45, 360 60, 375 80
                 C390 100, 420 110, 440 135
                 C460 160, 430 190, 425 215
                 C420 240, 455 265, 470 295
                 C485 325, 470 355, 445 385
                 C420 415, 410 450, 400 480
                 C390 510, 365 545, 345 580
                 C325 615, 310 650, 295 670
                 C280 650, 275 610, 260 570
                 C245 530, 220 500, 195 475
                 C170 450, 140 435, 120 405
                 C100 375, 90 340, 95 305
                 C100 270, 125 245, 140 215
                 C155 185, 180 165, 205 140
                 C230 115, 265 80, 285 55
                 Z"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeDasharray="6 4"
              className="text-green/80"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 3, ease: "easeInOut" }}
            />

            {/* Division Internal Network Lines */}
            <path
              d="M285 55 L310 220 L425 215 M310 220 L300 350 L445 385 M300 350 L260 570 M300 350 L195 475 M310 220 L140 215 M300 350 L345 580"
              stroke="currentColor"
              strokeWidth="1.2"
              strokeDasharray="3 3"
              className="text-green/40"
            />

            {/* Division Hub Nodes with Pulsing Rings */}
            {[
              { label: "Dhaka", cx: 300, cy: 330 },
              { label: "Chittagong", cx: 430, cy: 450 },
              { label: "Sylhet", cx: 410, cy: 190 },
              { label: "Rajshahi", cx: 180, cy: 230 },
              { label: "Khulna", cx: 220, cy: 460 },
              { label: "Barisal", cx: 290, cy: 490 },
              { label: "Rangpur", cx: 220, cy: 120 },
              { label: "Mymensingh", cx: 310, cy: 210 },
            ].map((node, idx) => (
              <g key={node.label}>
                {/* Glowing Outer Ring */}
                <circle
                  cx={node.cx}
                  cy={node.cy}
                  r="12"
                  className="fill-green/10 stroke-green/30 animate-ping origin-center"
                  style={{ animationDuration: `${3 + idx * 0.5}s` }}
                />
                {/* Hub Point */}
                <circle
                  cx={node.cx}
                  cy={node.cy}
                  r="4"
                  className="fill-green stroke-surface"
                  strokeWidth="1.5"
                />
                {/* Node Label watermark */}
                <text
                  x={node.cx + 8}
                  y={node.cy + 4}
                  className="fill-ink-secondary text-[10px] font-mono tracking-widest uppercase opacity-60 font-semibold"
                >
                  {node.label}
                </text>
              </g>
            ))}
          </svg>
        </motion.div>
      </div>
    </div>
  );
}
