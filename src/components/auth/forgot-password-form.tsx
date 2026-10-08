"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { ArrowLeft, MailCheck } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { FormField } from "@/components/ui/form-field";
import { Input } from "@/components/ui/input";
import { api } from "@/lib/api";
import { authErrorMessage } from "@/lib/auth";
import { useT } from "@/lib/i18n";
import { toFormattedNumber } from "@/lib/utils";
import { forgotSchema, type ForgotValues } from "@/lib/validation";
import { useLangStore } from "@/store/lang-store";
import { AuthCard } from "./auth-card";
import { FormAlert } from "./form-alert";

const COOLDOWN = 30; // seconds before "send again" is allowed

export function ForgotPasswordForm() {
  const t = useT();
  const lang = useLangStore((s) => s.lang);
  const [sentTo, setSentTo] = useState<string | null>(null);
  const [wait, setWait] = useState(0);

  const { register, handleSubmit, formState: { errors } } = useForm<ForgotValues>({ resolver: zodResolver(forgotSchema), defaultValues: { email: "" } });

  const { mutate, isPending, error } = useMutation({
    mutationFn: (v: ForgotValues) => api.post("/auth/forgot-password", v),
    onSuccess: (_r, v) => {
      setSentTo(v.email);
      setWait(COOLDOWN);
    },
  });

  useEffect(() => {
    if (wait <= 0) return;
    const timer = setTimeout(() => setWait((w) => w - 1), 1000);
    return () => clearTimeout(timer);
  }, [wait]);

  const back = (
    <Link href="/login" className="inline-flex items-center gap-1.5 font-medium text-link hover:underline">
      <ArrowLeft className="h-4 w-4" aria-hidden />{t("backToLogin")}
    </Link>
  );

  if (sentTo) {
    return (
      <AuthCard title={t("checkEmailTitle")} footer={back}>
        <div className="space-y-5 text-center">
          <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-green/10 text-green">
            <MailCheck className="h-7 w-7" aria-hidden />
          </span>
          <p className="text-ink/80 text-sm leading-relaxed">
            <span className="font-semibold text-ink">{sentTo}</span> — {t("checkEmailText")}
          </p>
          <FormAlert message={error ? authErrorMessage(error, "forgot", lang) : null} className="text-left" />
          <Button variant="outline" className="w-full" disabled={wait > 0} loading={isPending} onClick={() => mutate({ email: sentTo })}>
            {wait > 0 ? t("resendWait").replace("{sec}", toFormattedNumber(wait, lang)) : t("resendLink")}
          </Button>
        </div>
      </AuthCard>
    );
  }

  return (
    <AuthCard title={t("forgotTitle")} description={t("forgotDesc")} footer={back}>
      <form onSubmit={handleSubmit((v) => mutate(v))} noValidate className="space-y-4">
        <FormAlert message={error ? authErrorMessage(error, "forgot", lang) : null} />
        <FormField label={t("email")} htmlFor="fp-email" required error={errors.email?.message}>
          <Input id="fp-email" type="email" autoComplete="email" inputMode="email" invalid={!!errors.email} {...register("email")} />
        </FormField>
        <Button type="submit" size="lg" className="w-full bg-green text-white hover:bg-green/90" loading={isPending}>{t("sendResetLink")}</Button>
      </form>
    </AuthCard>
  );
}
