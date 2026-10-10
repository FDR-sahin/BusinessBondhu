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
import { useT } from "@/lib/i18n";
import { loginSchema, type LoginValues } from "@/lib/validation";
import { useAuthStore } from "@/store/auth-store";
import { useLangStore } from "@/store/lang-store";
import type { AuthResponse } from "@/types";
import { AuthCard } from "./auth-card";
import { FormAlert } from "./form-alert";
import { PasswordInput } from "./password-input";
import { SocialButtons } from "./social-buttons";

export function LoginForm() {
  const { target, go, withRedirect } = useAuthRedirect();
  const login = useAuthStore((s) => s.login);
  const t = useT();
  const lang = useLangStore((s) => s.lang);

  const { register, control, handleSubmit, formState: { errors } } = useForm<LoginValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { name: "", email: "", password: "", remember: true },
  });

  const { mutate, isPending, error } = useMutation({
    mutationFn: async (v: LoginValues) => {
      let knownName = (v.name || "").trim();
      if (!knownName && typeof window !== "undefined") {
        try {
          const raw = localStorage.getItem("bhbd_user_profile");
          if (raw) {
            const parsed = JSON.parse(raw);
            if (parsed?.name && parsed.name !== "উদ্যোক্তা" && !parsed.name.includes("@")) {
              knownName = parsed.name;
            }
          }
        } catch {}
      }
      return (await api.post<AuthResponse>("/auth/login", { ...v, name: knownName || undefined })).data;
    },
    onSuccess: (data, v) => {
      const emailPrefix = (data.user.email || "").split("@")[0];
      const typedName = (v.name || "").trim();
      let resolvedName = data.user.name;

      if (typedName && typedName !== "উদ্যোক্তা" && typedName !== emailPrefix) {
        resolvedName = typedName;
      } else if (data.user.name && data.user.name !== "উদ্যোক্তা" && data.user.name !== emailPrefix) {
        resolvedName = data.user.name;
      } else if (typeof window !== "undefined") {
        try {
          const raw = localStorage.getItem("bhbd_user_profile");
          if (raw) {
            const parsed = JSON.parse(raw);
            if (parsed?.name && parsed.name !== "উদ্যোক্তা" && parsed.name !== emailPrefix) {
              resolvedName = parsed.name;
            }
          }
        } catch {}
      }

      const userWithResolvedName = { ...data.user, name: resolvedName || data.user.name || emailPrefix };

      login({ ...data, user: userWithResolvedName, remember: v.remember });
      if (typeof window !== "undefined") {
        try {
          localStorage.setItem("bhbd_user_profile", JSON.stringify(userWithResolvedName));
          const maxAge = v.remember ? 60 * 60 * 24 * 30 : "";
          document.cookie = `bhbd_user_name=${encodeURIComponent(userWithResolvedName.name)}; Path=/; ${maxAge ? `Max-Age=${maxAge}; ` : ""}SameSite=Lax`;
          document.cookie = `bhbd_user_email=${encodeURIComponent(userWithResolvedName.email)}; Path=/; ${maxAge ? `Max-Age=${maxAge}; ` : ""}SameSite=Lax`;
        } catch (e) {
          console.error(e);
        }
      }
      toast.success(lang === "bn" ? `স্বাগতম, ${userWithResolvedName.name}` : `Welcome back, ${userWithResolvedName.name}`);
      go();
    },
  });

  return (
    <AuthCard
      title={t("loginTitle")}
      description={t("loginDesc")}
      footer={<>{t("loginNoAccount")} <Link href={withRedirect("/signup")} className="font-medium text-link hover:underline">{t("signup")}</Link></>}
    >
      <SocialButtons redirectTo={target} />

      <form onSubmit={handleSubmit((v) => mutate(v))} noValidate className="space-y-4">
        <FormAlert message={error ? authErrorMessage(error, "login", lang) : null} />

        <FormField label={lang === "bn" ? "নাম (ঐচ্ছিক)" : "Name (Optional)"} htmlFor="login-name">
          <Input id="login-name" placeholder={lang === "bn" ? "আপনার নাম (যেমন: নাহিদ)" : "Your name (e.g. Nahid)"} autoComplete="name" {...register("name")} />
        </FormField>

        <FormField label={t("email")} htmlFor="login-email" required error={errors.email?.message}>
          <Input id="login-email" type="email" autoComplete="email" inputMode="email" invalid={!!errors.email} {...register("email")} />
        </FormField>

        <FormField label={t("password")} htmlFor="login-password" required error={errors.password?.message}>
          <PasswordInput id="login-password" autoComplete="current-password" invalid={!!errors.password} {...register("password")} />
        </FormField>

        <div className="flex items-center justify-between gap-3">
          <Controller control={control} name="remember" render={({ field }) => (
            <div className="flex items-center gap-2">
              <Checkbox id="login-remember" checked={field.value} onCheckedChange={(c) => field.onChange(c === true)} />
              <Label htmlFor="login-remember" className="cursor-pointer font-normal text-sm">{t("rememberMe")}</Label>
            </div>
          )} />
          <Link href="/forgot-password" className="text-sm font-medium text-link hover:underline">{t("forgotPassword")}</Link>
        </div>

        <Button type="submit" size="lg" className="w-full bg-green text-white hover:bg-green/90" loading={isPending}>{t("login")}</Button>
      </form>
    </AuthCard>
  );
}
