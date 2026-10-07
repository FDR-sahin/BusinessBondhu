"use client";

import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";
import { useMounted } from "@/hooks/use-mounted";
import { useT } from "@/lib/i18n";

/** Light <-> dark. (The 3-way Light/Dark/System picker lives in Settings, Step 11.) */
export function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme();
  const mounted = useMounted();
  const t = useT();
  const isDark = mounted && resolvedTheme === "dark";

  return (
    <Button variant="ghost" size="icon" aria-label={t("toggleTheme")} onClick={() => setTheme(isDark ? "light" : "dark")}>
      {/* Render a stable icon until mounted so SSR and client markup match */}
      {isDark ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
    </Button>
  );
}
