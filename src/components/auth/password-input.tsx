"use client";

import { Eye, EyeOff } from "lucide-react";
import { forwardRef, useState } from "react";
import { Input, type InputProps } from "@/components/ui/input";
import { passwordStrength } from "@/lib/auth";
import { useT } from "@/lib/i18n";
import { cn } from "@/lib/utils";
import { useLangStore } from "@/store/lang-store";

/** Password field with a show/hide toggle. */
export const PasswordInput = forwardRef<HTMLInputElement, InputProps>(({ className, ...props }, ref) => {
  const [show, setShow] = useState(false);
  const t = useT();

  return (
    <div className="relative">
      <Input ref={ref} type={show ? "text" : "password"} className={cn("pr-11", className)} {...props} />
      <button
        type="button"
        onClick={() => setShow((s) => !s)}
        aria-label={show ? t("hidePassword") : t("showPassword")}
        aria-pressed={show}
        className="absolute right-1.5 top-1/2 -translate-y-1/2 rounded-lg p-2 text-ink-secondary transition-colors hover:text-foreground"
      >
        {show ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
      </button>
    </div>
  );
});
PasswordInput.displayName = "PasswordInput";

const BARS = ["bg-danger", "bg-danger", "bg-warning", "bg-secondary", "bg-success"];

/** 4-segment strength meter shown under the new-password field. */
export function PasswordStrength({ value }: { value: string }) {
  const lang = useLangStore((s) => s.lang);
  const t = useT();

  if (!value) return null;
  const { score, label } = passwordStrength(value, lang);
  return (
    <div className="space-y-1" aria-live="polite">
      <div className="grid grid-cols-4 gap-1.5" aria-hidden>
        {[1, 2, 3, 4].map((i) => (
          <span key={i} className={cn("h-1.5 rounded-full transition-colors", i <= score ? BARS[score] : "bg-border")} />
        ))}
      </div>
      <p className="text-sm text-ink-secondary">{t("passwordStrengthLabel")}: <span className="font-medium text-foreground">{label}</span></p>
    </div>
  );
}
