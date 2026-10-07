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
import { toBanglaNumber } from "@/lib/utils";
import { forgotSchema, type ForgotValues } from "@/lib/validation";
import { AuthCard } from "./auth-card";
import { FormAlert } from "./form-alert";

const COOLDOWN = 30; // seconds before "send again" is allowed

export function ForgotPasswordForm() {
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
    const t = setTimeout(() => setWait((w) => w - 1), 1000);
    return () => clearTimeout(t);
  }, [wait]);

  const back = (
    <Link href="/login" className="inline-flex items-center gap-1.5 font-medium text-link hover:underline"><ArrowLeft className="h-4 w-4" aria-hidden />লগইনে ফিরে যান</Link>
  );

  if (sentTo) {
    return (
      <AuthCard title="ইমেইল চেক করুন" footer={back}>
        <div className="space-y-5 text-center">
          <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-success-soft text-success-soft-foreground"><MailCheck className="h-7 w-7" aria-hidden /></span>
          {/* Same message whether or not the account exists, so nobody can probe which emails are registered */}
          <p className="text-ink-secondary">
            <span className="font-medium text-foreground">{sentTo}</span> ঠিকানায় অ্যাকাউন্ট থাকলে পাসওয়ার্ড রিসেটের লিংক পাঠানো হয়েছে। ইনবক্স ও স্প্যাম ফোল্ডার দেখুন।
          </p>
          <FormAlert message={error ? authErrorMessage(error, "forgot") : null} className="text-left" />
          <Button variant="outline" className="w-full" disabled={wait > 0} loading={isPending} onClick={() => mutate({ email: sentTo })}>
            {wait > 0 ? `আবার পাঠান (${toBanglaNumber(wait)} সেকেন্ড)` : "আবার পাঠান"}
          </Button>
        </div>
      </AuthCard>
    );
  }

  return (
    <AuthCard title="পাসওয়ার্ড ভুলে গেছেন?" description="আপনার ইমেইল দিন, আমরা রিসেটের লিংক পাঠিয়ে দেব।" footer={back}>
      <form onSubmit={handleSubmit((v) => mutate(v))} noValidate className="space-y-4">
        <FormAlert message={error ? authErrorMessage(error, "forgot") : null} />
        <FormField label="ইমেইল" htmlFor="fp-email" required error={errors.email?.message}>
          <Input id="fp-email" type="email" autoComplete="email" inputMode="email" invalid={!!errors.email} {...register("email")} />
        </FormField>
        <Button type="submit" size="lg" className="w-full" loading={isPending}>রিসেট লিংক পাঠান</Button>
      </form>
    </AuthCard>
  );
}
