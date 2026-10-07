import type { Config } from "tailwindcss";
import animate from "tailwindcss-animate";

/**
 * Colors are CSS variables holding "R G B" channels (see globals.css), so
 * Tailwind opacity modifiers (bg-primary/10) work AND dark mode only swaps
 * the variables. Hex values live in globals.css — exact spec palette.
 */
const token = (name: string) => `rgb(var(--${name}) / <alpha-value>)`;

const config: Config = {
  darkMode: "class",
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    container: {
      center: true,
      padding: { DEFAULT: "1rem", md: "1.5rem", lg: "2rem" },
      screens: { "2xl": "80rem" }, // max-w-7xl
    },
    extend: {
      colors: {
        // ---- shadcn/ui contract ----
        border: token("border"),
        input: token("border"),
        ring: token("ring"),
        background: token("background"),
        foreground: token("foreground"),
        card: { DEFAULT: token("surface"), foreground: token("foreground") },
        popover: { DEFAULT: token("surface"), foreground: token("foreground") },
        primary: {
          DEFAULT: token("primary"),
          hover: token("primary-hover"),
          deep: token("primary-deep"),
          foreground: token("primary-foreground"),
          soft: token("primary-soft"),
          "soft-foreground": token("primary-soft-fg"),
        },
        secondary: {
          DEFAULT: token("secondary"),
          foreground: token("secondary-foreground"),
          soft: token("secondary-soft"),
          "soft-foreground": token("secondary-soft-fg"),
        },
        muted: { DEFAULT: token("muted"), foreground: token("foreground-secondary") },
        accent: { DEFAULT: token("muted"), foreground: token("foreground") },
        destructive: { DEFAULT: token("danger"), foreground: token("primary-foreground") },
        // ---- project semantics ----
        surface: token("surface"),
        link: token("link"),
        success: { DEFAULT: token("success"), foreground: token("primary-foreground"), soft: token("success-soft"), "soft-foreground": token("success-soft-fg") },
        danger: { DEFAULT: token("danger"), foreground: token("primary-foreground"), soft: token("danger-soft"), "soft-foreground": token("danger-soft-fg") },
        warning: { DEFAULT: token("warning"), foreground: token("primary-foreground"), soft: token("warning-soft"), "soft-foreground": token("warning-soft-fg") },
        // Text scale: text-ink / text-ink-secondary / text-ink-muted
        ink: {
          DEFAULT: token("foreground"),
          secondary: token("foreground-secondary"),
          muted: token("foreground-muted"),
        },
        chart: { 1: token("chart-1"), 2: token("chart-2"), 3: token("chart-3"), 4: token("chart-4"), 5: token("chart-5"), 6: token("chart-6"), 7: token("chart-7"), 8: token("chart-8") },
      },
      fontFamily: {
        // Inter has no Bangla glyphs, so the browser falls through to Hind Siliguri.
        sans: ["var(--font-inter)", "var(--font-hind)", "system-ui", "sans-serif"],
        bangla: ["var(--font-hind)", "var(--font-inter)", "system-ui", "sans-serif"],
      },
      fontSize: {
        // Spec: no text smaller than 14px -> text-xs is clamped to 14px.
        xs: ["0.875rem", { lineHeight: "1.25rem" }],
      },
      // Spec: one consistent radius system. buttons/inputs = lg, cards = 2xl.
      borderRadius: {
        sm: "0.5rem",
        md: "0.5rem",
        lg: "0.5rem",
        xl: "0.75rem",
        "2xl": "1rem",
      },
      // Spec: soft shadows only. sm -> md on hover -> lg for modals.
      boxShadow: {
        sm: "0 1px 2px 0 rgb(15 23 42 / 0.05), 0 1px 3px 0 rgb(15 23 42 / 0.04)",
        DEFAULT: "0 1px 3px 0 rgb(15 23 42 / 0.06)",
        md: "0 8px 20px -6px rgb(15 23 42 / 0.10), 0 2px 6px -2px rgb(15 23 42 / 0.05)",
        lg: "0 20px 44px -14px rgb(15 23 42 / 0.20)",
      },
      spacing: {
        // Spec scale 4/8/12/16/24/32/48/64/96 maps to Tailwind 1/2/3/4/6/8/12/16/24.
        // Section padding helpers: py-16 md:py-24 (see .section in globals.css).
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },
    },
  },
  plugins: [animate],
};

export default config;
