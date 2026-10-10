import type { Config } from "tailwindcss";
import animate from "tailwindcss-animate";

const token = (name: string) => `rgb(var(--${name}) / <alpha-value>)`;

const config: Config = {
  darkMode: "class",
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    container: {
      center: true,
      padding: { DEFAULT: "1rem", md: "1.5rem", lg: "2rem" },
      screens: { "2xl": "1200px" },
    },
    extend: {
      colors: {
        border: token("line"),
        input: token("line"),
        ring: token("green"),
        background: token("bg"),
        foreground: token("ink"),
        surface: token("surface"),
        card: { DEFAULT: token("surface"), foreground: token("ink") },
        popover: { DEFAULT: token("surface"), foreground: token("ink") },
        primary: {
          DEFAULT: token("green"),
          hover: token("green"),
          foreground: "#FFFFFF",
          soft: token("surface"),
          "soft-foreground": token("green"),
        },
        secondary: {
          DEFAULT: token("gold"),
          foreground: token("ink"),
          soft: token("surface"),
          "soft-foreground": token("gold"),
        },
        muted: { DEFAULT: token("muted"), foreground: token("muted"), soft: token("muted-bg") },
        accent: { DEFAULT: token("surface"), foreground: token("ink") },
        destructive: { DEFAULT: token("pen-raw"), foreground: "#FFFFFF" },
        ink: {
          DEFAULT: token("ink"),
          secondary: token("muted"),
          muted: token("muted"),
        },
        pen: token("pen-raw"),
        green: token("green"),
        gold: token("gold"),
        line: token("line"),
      },
      fontFamily: {
        sans: ["var(--font-hind)", "var(--font-inter)", "system-ui", "sans-serif"],
        bangla: ["var(--font-hind)", "var(--font-bn-display)", "system-ui", "sans-serif"],
        display: ["var(--font-bn-display)", "var(--font-hind)", "var(--font-fraunces)", "sans-serif"],
        mono: ["var(--font-inter)", "monospace"],
      },
      borderRadius: {
        sm: "6px",   // inputs (6px)
        md: "6px",   // inputs (6px)
        lg: "12px",  // cards (12px)
        xl: "12px",  // cards (12px)
        "2xl": "12px",
        full: "999px", // pills (999px)
      },
      boxShadow: {
        sm: "0 1px 2px 0 rgb(0 0 0 / 0.05)",
        DEFAULT: "0 1px 3px 0 rgb(0 0 0 / 0.08)",
        md: "0 4px 12px -2px rgb(0 0 0 / 0.1)",
        lg: "0 12px 32px -8px rgb(0 0 0 / 0.15)", // soft shadow token for floating menus only
      },
    },
  },
  plugins: [animate],
};

export default config;
