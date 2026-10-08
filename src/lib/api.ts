import axios, { AxiosError, type InternalAxiosRequestConfig } from "axios";
import { handleMockFallback } from "@/lib/mock-router";
import { useAuthStore } from "@/store/auth-store";
import type { ApiErrorBody, AuthTokens } from "@/types";

const getClientBaseUrl = () => {
  if (typeof window !== "undefined") {
    const envUrl = process.env.NEXT_PUBLIC_API_URL;
    if (!envUrl || envUrl.startsWith("/")) {
      return envUrl || "/api/v1";
    }
    try {
      const urlHost = new URL(envUrl).host;
      if (urlHost !== window.location.host) {
        // Same-origin relative fallback for Vercel preview domains to prevent CORS withCredentials block
        return "/api/v1";
      }
    } catch {
      return "/api/v1";
    }
    return envUrl;
  }
  return process.env.NEXT_PUBLIC_API_URL || "/api/v1";
};

const BASE_URL = getClientBaseUrl();

/** Single axios instance used by every TanStack Query hook. */
export const api = axios.create({
  baseURL: BASE_URL,
  timeout: 15_000,
  withCredentials: true, // lets an httpOnly refresh cookie work if the API uses one
  headers: { "Content-Type": "application/json" },
});

/* ------------------------------------------------------------------ */
/* Request: attach JWT                                                 */
/* ------------------------------------------------------------------ */
api.interceptors.request.use((config) => {
  const token = useAuthStore.getState().accessToken;
  if (token) config.headers.set("Authorization", `Bearer ${token}`);
  return config;
});

/* ------------------------------------------------------------------ */
/* Response: refresh token on 401, retry once, else mock fallback     */
/* ------------------------------------------------------------------ */
type RetriableConfig = InternalAxiosRequestConfig & { _retry?: boolean };

/** Auth endpoints that must never trigger a refresh attempt. */
const NO_REFRESH = /\/auth\/(login|signup|register|refresh|forgot-password|reset-password)|\/me\/(password|email)$|\/me$/;

let refreshPromise: Promise<string> | null = null;

async function refreshAccessToken(): Promise<string> {
  const { refreshToken, setTokens } = useAuthStore.getState();
  const { data } = await axios.post<AuthTokens>(
    `${BASE_URL}/auth/refresh`,
    { refreshToken },
    { withCredentials: true },
  );
  setTokens(data.accessToken, data.refreshToken);
  return data.accessToken;
}

api.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const original = error.config as RetriableConfig | undefined;

    // Handle 401 token refresh logic if applicable
    if (error.response?.status === 401 && original && !original._retry && !NO_REFRESH.test(original.url ?? "")) {
      original._retry = true;
      try {
        refreshPromise ??= refreshAccessToken().finally(() => {
          refreshPromise = null;
        });
        const token = await refreshPromise;
        original.headers.set("Authorization", `Bearer ${token}`);
        return api(original);
      } catch {
        useAuthStore.getState().logout();
      }
    }

    // Network / Server / 404 connection error: Fallback to mock router
    const mockRes = handleMockFallback(error.config);
    if (mockRes) {
      return mockRes;
    }

    return Promise.reject(error);
  },
);

/* ------------------------------------------------------------------ */
/* Helpers                                                             */
/* ------------------------------------------------------------------ */

/** Turn any thrown value into a Bangla, user-facing message. */
export function getErrorMessage(
  error: unknown,
  fallback = "কিছু একটা সমস্যা হয়েছে। অনুগ্রহ করে আবার চেষ্টা করুন।",
): string {
  if (axios.isAxiosError<ApiErrorBody>(error)) {
    if (!error.response) return "ইন্টারনেট সংযোগ পরীক্ষা করে আবার চেষ্টা করুন।";
    return error.response.data?.message ?? fallback;
  }
  if (error instanceof Error && error.message) return error.message;
  return fallback;
}
