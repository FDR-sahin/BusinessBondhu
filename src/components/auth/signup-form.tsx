"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import Link from "next/link";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { FormField } from "@/components/ui/form-field";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useAuthRedirect } from "@/hooks/use-auth-redirect";
import { api } from "@/lib/api";
import { authErrorMessage, getFieldErrors } from "@/lib/auth";
import { DIVISIONS, getDistricts } from "@/lib/bd-data";
import { useT } from "@/lib/i18n";
import { signupSchema, type SignupValues } from "@/lib/validation";
import { useAuthStore } from "@/store/auth-store";
import { useLangStore } from "@/store/lang-store";
import type { AuthResponse } from "@/types";
import { AuthCard } from "./auth-card";
import { FormAlert } from "./form-alert";
import { PasswordInput, PasswordStrength } from "./password-input";
import { SocialButtons } from "./social-buttons";

const FIELDS: (keyof SignupValues)[] = ["name", "email", "password", "division", "district"];

export function SignupForm() {
  const { target, go, withRedirect } = useAuthRedirect();
  const login = useAuthStore((s) => s.login);
  const t = useT();
  const lang = useLangStore((s) => s.lang);

  const { register, control, handleSubmit, setValue, setError, watch, formState: { errors } } = useForm<SignupValues>({
    resolver: zodResolver(signupSchema),
    defaultValues: { name: "", email: "", password: "", confirmPassword: "", division: "", district: "" },
  });
  const password = watch("password");
  const division = watch("division");

  const { mutate, isPending, error } = useMutation({
    mutationFn: async (v: SignupValues) => {
      const { confirmPassword: _omit, ...body } = v;
      return (await api.post<AuthResponse>("/auth/signup", body)).data;
    },
    onSuccess: (data, v) => {
      const typedName = (v.name || "").trim();
      const resolvedName = (typedName && typedName !== "উদ্যোক্তা" ? typedName : "") || data.user.name;
      const user = { ...data.user, name: resolvedName };
      login({ ...data, user, remember: true });
      if (typeof window !== "undefined") {
        try {
          localStorage.setItem("bhbd_user_profile", JSON.stringify(user));
          document.cookie = `bhbd_user_name=${encodeURIComponent(user.name)}; Path=/; Max-Age=2592000; SameSite=Lax`;
          document.cookie = `bhbd_user_email=${encodeURIComponent(user.email)}; Path=/; Max-Age=2592000; SameSite=Lax`;
        } catch (e) {
          console.error(e);
        }
      }
      toast.success(lang === "bn" ? `অ্যাকাউন্ট তৈরি হয়েছে। স্বাগতম, ${user.name}!` : `Account created. Welcome, ${user.name}!`);
      go();
    },
    onError: (e) => {
      const fieldErrors = getFieldErrors(e);
      FIELDS.forEach((f) => fieldErrors[f] && setError(f, { message: fieldErrors[f] }));
    },
  });

  return (
    <AuthCard
      title={t("signupTitle")}
      description={t("signupDesc")}
      footer={<>{t("signupAlreadyHaveAcc")} <Link href={withRedirect("/login")} className="font-medium text-link hover:underline">{t("login")}</Link></>}
    >
      <SocialButtons redirectTo={target} />

      <form onSubmit={handleSubmit((v) => mutate(v))} noValidate className="space-y-4">
        <FormAlert message={error && Object.keys(getFieldErrors(error)).length === 0 ? authErrorMessage(error, "signup", lang) : null} />

        <FormField label={t("fullName")} htmlFor="su-name" required error={errors.name?.message}>
          <Input id="su-name" autoComplete="name" invalid={!!errors.name} {...register("name")} />
        </FormField>

        <FormField label={t("email")} htmlFor="su-email" required error={errors.email?.message}>
          <Input id="su-email" type="email" autoComplete="email" inputMode="email" invalid={!!errors.email} {...register("email")} />
        </FormField>

        <div className="space-y-2">
          <FormField label={t("password")} htmlFor="su-password" required error={errors.password?.message} hint={t("passwordHint")}>
            <PasswordInput id="su-password" autoComplete="new-password" invalid={!!errors.password} {...register("password")} />
          </FormField>
          <PasswordStrength value={password} />
        </div>

        <FormField label={t("confirmPassword")} htmlFor="su-confirm" required error={errors.confirmPassword?.message}>
          <PasswordInput id="su-confirm" autoComplete="new-password" invalid={!!errors.confirmPassword} {...register("confirmPassword")} />
        </FormField>

        <div className="grid gap-4 sm:grid-cols-2">
          <FormField label={t("division")} htmlFor="su-division" required error={errors.division?.message}>
            <Controller control={control} name="division" render={({ field }) => (
              <Select value={field.value} onValueChange={(v) => { field.onChange(v); setValue("district", ""); }}>
                <SelectTrigger id="su-division" invalid={!!errors.division}><SelectValue placeholder={t("selectDivision")} /></SelectTrigger>
                <SelectContent>{DIVISIONS.map((d) => <SelectItem key={d.value} value={d.value}>{lang === "bn" ? d.label : d.value}</SelectItem>)}</SelectContent>
              </Select>
            )} />
          </FormField>

          <FormField label={t("district")} htmlFor="su-district" required error={errors.district?.message}>
            <Controller control={control} name="district" render={({ field }) => (
              <Select value={field.value} onValueChange={field.onChange} disabled={!division}>
                <SelectTrigger id="su-district" invalid={!!errors.district}><SelectValue placeholder={t("selectDistrict")} /></SelectTrigger>
                <SelectContent>{getDistricts(division).map((d) => <SelectItem key={d.value} value={d.value}>{lang === "bn" ? d.label : d.value}</SelectItem>)}</SelectContent>
              </Select>
            )} />
          </FormField>
        </div>

        <Button type="submit" size="lg" className="w-full bg-green text-white hover:bg-green/90" loading={isPending}>{t("signupSubmit")}</Button>
      </form>
    </AuthCard>
  );
}
