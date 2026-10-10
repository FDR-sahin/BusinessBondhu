"use client";

import { Facebook } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { useT } from "@/lib/i18n";
import { useLangStore } from "@/store/lang-store";

function GoogleIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden className="h-5 w-5">
      <path fill="#4285F4" d="M23.52 12.27c0-.85-.08-1.67-.22-2.45H12v4.64h6.46a5.52 5.52 0 0 1-2.4 3.62v3h3.88c2.27-2.09 3.58-5.17 3.58-8.81z" />
      <path fill="#34A853" d="M12 24c3.24 0 5.96-1.07 7.94-2.91l-3.88-3a7.2 7.2 0 0 1-10.7-3.78H1.34v3.09A12 12 0 0 0 12 24z" />
      <path fill="#FBBC05" d="M5.36 14.31a7.2 7.2 0 0 1 0-4.62V6.6H1.34a12 12 0 0 0 0 10.8l4.02-3.09z" />
      <path fill="#EA4335" d="M12 4.77c1.76 0 3.34.61 4.59 1.8l3.44-3.44A11.97 11.97 0 0 0 12 0 12 12 0 0 0 1.34 6.6l4.02 3.1A7.2 7.2 0 0 1 12 4.77z" />
    </svg>
  );
}

export function SocialButtons({ redirectTo }: { redirectTo: string }) {
  const t = useT();
  const lang = useLangStore((s) => s.lang);

  function start(provider: "google" | "facebook") {
    const name = provider === "google" ? "Google" : "Facebook";
    toast.info(
      lang === "bn"
        ? `${name} সাইন-ইন সুবিধা খুব শীঘ্রই উন্মুক্ত হচ্ছে। দয়া করে ইমেইল ও পাসওয়ার্ড ব্যবহার করে লগইন করুন।`
        : `${name} sign-in is coming soon. Please log in using email and password.`
    );
  }

  return (
    <>
      <div className="grid gap-3 sm:grid-cols-2">
        <Button type="button" variant="outline" size="lg" className="h-11 text-sm" onClick={() => start("google")}>
          <GoogleIcon /> Google
        </Button>
        <Button type="button" variant="outline" size="lg" className="h-11 text-sm" onClick={() => start("facebook")}>
          <Facebook className="fill-[#1877F2] text-[#1877F2]" aria-hidden /> Facebook
        </Button>
      </div>
      <div className="my-6 flex items-center gap-3 text-sm text-ink-secondary" role="separator" aria-label={t("or")}>
        <span className="h-px flex-1 bg-border" />{t("or")}<span className="h-px flex-1 bg-border" />
      </div>
    </>
  );
}
