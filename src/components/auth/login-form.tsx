"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import Link from "next/link";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { FormField } from "@/components/ui/form-field";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuthRedirect } from "@/hooks/use-auth-redirect";
import { api } from "@/lib/api";
import { authErrorMessage } from "@/lib/auth";
import { loginSchema, type LoginValues } from "@/lib/validation";
import { useAuthStore } from "@/store/auth-store";
import type { AuthResponse } from "@/types";
import { AuthCard } from "./auth-card";
import { FormAlert } from "./form-alert";
import { PasswordInput } from "./password-input";
import { SocialButtons } from "./social-buttons";

export function LoginForm() {
  const { target, go, withRedirect } = useAuthRedirect();
  const login = useAuthStore((s) => s.login);

  const { register, control, handleSubmit, formState: { errors } } = useForm<LoginValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "", remember: true },
  });

  const { mutate, isPending, error } = useMutation({
    mutationFn: async (v: LoginValues) => (await api.post<AuthResponse>("/auth/login", v)).data,
    onSuccess: (data, v) => {
      login({ ...data, remember: v.remember });
      toast.success(`স্বাগতম, ${data.user.name}`);
      go();
    },
  });

  return (
    <AuthCard
      title="আপনার অ্যাকাউন্টে লগইন করুন"
      description="আবার স্বাগতম! চালিয়ে যেতে লগইন করুন।"
      footer={<>অ্যাকাউন্ট নেই? <Link href={withRedirect("/signup")} className="font-medium text-link hover:underline">সাইন আপ করুন</Link></>}
    >
      <SocialButtons redirectTo={target} />

      <form onSubmit={handleSubmit((v) => mutate(v))} noValidate className="space-y-4">
        <FormAlert message={error ? authErrorMessage(error, "login") : null} />

        <FormField label="ইমেইল" htmlFor="login-email" required error={errors.email?.message}>
          <Input id="login-email" type="email" autoComplete="email" inputMode="email" invalid={!!errors.email} {...register("email")} />
        </FormField>

        <FormField label="পাসওয়ার্ড" htmlFor="login-password" required error={errors.password?.message}>
          <PasswordInput id="login-password" autoComplete="current-password" invalid={!!errors.password} {...register("password")} />
        </FormField>

        <div className="flex items-center justify-between gap-3">
          <Controller control={control} name="remember" render={({ field }) => (
            <div className="flex items-center gap-2">
              <Checkbox id="login-remember" checked={field.value} onCheckedChange={(c) => field.onChange(c === true)} />
              <Label htmlFor="login-remember" className="cursor-pointer font-normal">আমাকে মনে রাখুন</Label>
            </div>
          )} />
          <Link href="/forgot-password" className="text-sm font-medium text-link hover:underline">পাসওয়ার্ড ভুলে গেছেন?</Link>
        </div>

        <Button type="submit" size="lg" className="w-full" loading={isPending}>লগইন</Button>
      </form>
    </AuthCard>
  );
}
