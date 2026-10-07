"use client";

import { useTheme } from "next-themes";
import { Toaster as Sonner } from "sonner";

/** Toasts slide in from the top (spec) and follow the active theme. */
export function Toaster() {
  const { resolvedTheme } = useTheme();

  return (
    <Sonner
      position="top-center"
      richColors
      closeButton
      theme={(resolvedTheme as "light" | "dark" | undefined) ?? "system"}
      toastOptions={{ classNames: { toast: "rounded-xl shadow-lg font-sans" } }}
    />
  );
}
