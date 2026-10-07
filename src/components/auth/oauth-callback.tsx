"use client";

import { Loader2 } from "lucide-react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { api } from "@/lib/api";
import { POST_LOGIN_KEY, authErrorMessage, safeRedirect } from "@/lib/auth";
import { useAuthStore } from "@/store/auth-store";
import type { AuthResponse } from "@/types";
import { AuthCard } from "./auth-card";
import { FormAlert } from "./form-alert";

/**
 * Landing page after Google/Facebook sign-in: /auth/callback?code=ONE_TIME_CODE.
 * We swap the short-lived code for real tokens with POST /auth/exchange, so tokens
 * never travel in a URL (URLs end up in history, logs and referrers).
 */
export function OAuthCallback() {
  const router = useRouter();
  const params = useSearchParams();
  const login = useAuthStore((s) => s.login);
  const started = useRef(false); // one-time code: React Strict Mode must not spend it twice
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (started.current) return;
    started.current = true;

    const code = params.get("code");
    if (params.get("error") || !code) {
      setError("সাইন ইন সম্পন্ন করা যায়নি। অনুগ্রহ করে আবার চেষ্টা করুন।");
      return;
    }

    api
      .post<AuthResponse>("/auth/exchange", { code })
      .then(({ data }) => {
        let target = "/dashboard";
        try {
          target = safeRedirect(sessionStorage.getItem(POST_LOGIN_KEY));
          sessionStorage.removeItem(POST_LOGIN_KEY);
        } catch {
          /* ignore */
        }
        login({ ...data, remember: true });
        toast.success(`স্বাগতম, ${data.user.name}`);
        router.replace(target);
        router.refresh();
      })
      .catch((e) => setError(authErrorMessage(e, "login")));
  }, [params, login, router]);

  return (
    <AuthCard title={error ? "সাইন ইন হয়নি" : "সাইন ইন হচ্ছে…"}>
      {error ? (
        <div className="space-y-4">
          <FormAlert message={error} />
          <Button asChild size="lg" className="w-full"><Link href="/login">লগইন পেজে ফিরে যান</Link></Button>
        </div>
      ) : (
        <div role="status" className="flex items-center justify-center gap-3 py-4 text-ink-secondary">
          <Loader2 className="h-5 w-5 animate-spin" aria-hidden />একটু অপেক্ষা করুন…
        </div>
      )}
    </AuthCard>
  );
}
