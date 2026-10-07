"use client";

import { useEffect, type ReactNode } from "react";
import { useLangStore } from "@/store/lang-store";

/** Restores the saved language after mount and keeps <html lang> in sync. */
export function LangProvider({ children }: { children: ReactNode }) {
  const lang = useLangStore((s) => s.lang);

  useEffect(() => {
    void useLangStore.persist.rehydrate();
  }, []);

  useEffect(() => {
    document.documentElement.lang = lang;
  }, [lang]);

  return <>{children}</>;
}
