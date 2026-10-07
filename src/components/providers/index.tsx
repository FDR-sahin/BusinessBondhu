"use client";

import type { ReactNode } from "react";
import { AuthProvider } from "./auth-provider";
import { LangProvider } from "./lang-provider";
import { MotionProvider } from "./motion-provider";
import { QueryProvider } from "./query-provider";
import { ThemeProvider } from "./theme-provider";
import { Toaster } from "./toaster";

/** Order matters: theme -> query -> auth (uses api) -> language -> motion. */
export function Providers({ children }: { children: ReactNode }) {
  return (
    <ThemeProvider>
      <QueryProvider>
        <AuthProvider>
          <LangProvider>
            <MotionProvider>
              {children}
              <Toaster />
            </MotionProvider>
          </LangProvider>
        </AuthProvider>
      </QueryProvider>
    </ThemeProvider>
  );
}
