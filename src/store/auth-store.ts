import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { User } from "@/types";

/** Must match the cookie name read by middleware.ts. */
export const AUTH_COOKIE = process.env.NEXT_PUBLIC_AUTH_COOKIE ?? "bhbd_token";
const REMEMBER_MAX_AGE = 60 * 60 * 24 * 30; // "remember me": 30 days

/**
 * Mirror the access token into a cookie. middleware.ts runs on the edge and
 * cannot read localStorage, so this cookie is only used for the cheap
 * "is there a session?" redirect check. Real authorization stays on the API.
 *
 * remember = true  -> persistent cookie (30 days)
 * remember = false -> SESSION cookie (no Max-Age): the browser drops it when it closes.
 */
function syncCookie(token: string | null, remember: boolean) {
  if (typeof document === "undefined") return;
  const secure = window.location.protocol === "https:" ? "; Secure" : "";
  document.cookie = token
    ? `${AUTH_COOKIE}=${token}; Path=/; ${remember ? `Max-Age=${REMEMBER_MAX_AGE}; ` : ""}SameSite=Lax${secure}`
    : `${AUTH_COOKIE}=; Path=/; Max-Age=0; SameSite=Lax${secure}`;
}

function syncUserCookies(user: User | null, remember: boolean) {
  if (typeof document === "undefined") return;
  const secure = window.location.protocol === "https:" ? "; Secure" : "";
  const maxAgeStr = remember ? `Max-Age=${REMEMBER_MAX_AGE}; ` : "";
  if (user?.name) {
    document.cookie = `bhbd_user_name=${encodeURIComponent(user.name)}; Path=/; ${maxAgeStr}SameSite=Lax${secure}`;
  } else {
    document.cookie = `bhbd_user_name=; Path=/; Max-Age=0; SameSite=Lax${secure}`;
  }
  if (user?.email) {
    document.cookie = `bhbd_user_email=${encodeURIComponent(user.email)}; Path=/; ${maxAgeStr}SameSite=Lax${secure}`;
  } else {
    document.cookie = `bhbd_user_email=; Path=/; Max-Age=0; SameSite=Lax${secure}`;
  }
}

const hasAuthCookie = () =>
  typeof document !== "undefined" && document.cookie.split("; ").some((c) => c.startsWith(`${AUTH_COOKIE}=`) && c.length > AUTH_COOKIE.length + 1);

interface AuthState {
  user: User | null;
  accessToken: string | null;
  refreshToken: string | null;
  /** "Remember me" choice from the login form */
  remember: boolean;
  /** true once persisted state has been read from localStorage (avoids hydration flicker) */
  hasHydrated: boolean;

  login: (payload: { user: User; accessToken: string; refreshToken: string; remember?: boolean }) => void;
  setTokens: (accessToken: string, refreshToken?: string) => void;
  setUser: (user: User) => void;
  logout: () => void;
  setHasHydrated: (value: boolean) => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      accessToken: null,
      refreshToken: null,
      remember: false,
      hasHydrated: false,

      login: ({ user, accessToken, refreshToken, remember = false }) => {
        syncCookie(accessToken, remember);
        syncUserCookies(user, remember);
        set({ user, accessToken, refreshToken, remember });
      },

      setTokens: (accessToken, refreshToken) => {
        syncCookie(accessToken, get().remember);
        set((s) => ({ accessToken, refreshToken: refreshToken ?? s.refreshToken }));
      },

      setUser: (user) => {
        syncUserCookies(user, get().remember);
        set({ user });
      },

      logout: () => {
        syncCookie(null, false);
        syncUserCookies(null, false);
        set({ user: null, accessToken: null, refreshToken: null, remember: false });
      },

      setHasHydrated: (value) => set({ hasHydrated: value }),
    }),
    {
      name: "bhbd-auth",
      // Persist only data, never functions or the hydration flag.
      partialize: (s) => ({ user: s.user, accessToken: s.accessToken, refreshToken: s.refreshToken, remember: s.remember }),
      onRehydrateStorage: () => (state) => {
        if (!state) return;
        // Session-only login whose browser was closed: the cookie is gone, so end the session.
        if (state.accessToken && !state.remember && !hasAuthCookie()) {
          state.logout();
        } else {
          syncCookie(state.accessToken, state.remember);
          if (state.user) syncUserCookies(state.user, state.remember);
        }
        state.setHasHydrated(true);
      },
    },
  ),
);

/** Convenience selector: derived, never stored. */
export const useIsAuthenticated = () => useAuthStore((s) => Boolean(s.accessToken));
