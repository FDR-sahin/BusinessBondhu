import { create } from "zustand";
import { persist } from "zustand/middleware";

export type Lang = "bn" | "en";

interface LangState {
  lang: Lang;
  setLang: (lang: Lang) => void;
}

export const useLangStore = create<LangState>()(
  persist(
    (set) => ({ lang: "bn", setLang: (lang) => set({ lang }) }),
    {
      name: "bhbd-lang",
      // Rehydrate manually after mount (see LangProvider) so the server HTML
      // (always Bangla) and the first client render match -> no hydration error.
      skipHydration: true,
    },
  ),
);
