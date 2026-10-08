"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { FormField } from "@/components/ui/form-field";
import { api } from "@/lib/api";
import { authErrorMessage } from "@/lib/auth";
import { useT } from "@/lib/i18n";
import { resetSchema, type ResetValues } from "@/lib/validation";
import { useLangStore } from "@/store/lang-store";
import { AuthCard } from "./auth-card";
import { FormAlert } from "./form-alert";
import { PasswordInput, PasswordStrength } from "./password-input";

export function ResetPasswordForm() {
  const router = useRouter();
  const token = useSearchParams().get("token");
  const t = useT();
  const lang = useLangStore((s) => s.lang);

  const { register, handleSubmit, watch, formState: { errors } } = useForm<ResetValues>({
    resolver: zodResolver(resetSchema),
    defaultValues: { password: "", confirmPassword: "" },
  });
  const password = watch("password");

  const { mutate, isPending, error } = useMutation({
    mutationFn: (v: ResetValues) => api.post("/auth/reset-password", { token, password: v.password }),
    onSuccess: () => {
      toast.success(lang === "bn" ? "পাসওয়ার্ড বদলানো হয়েছে। এখন লগইন করুন।" : "Password changed successfully. Please sign in.");
      router.replace("/login");
    },
  });

  if (!token) {
    return (
      <AuthCard title={t("invalidLinkTitle")} footer={<Link href="/forgot-password" className="font-medium text-link hover:underline">{t("requestNewLink")}</Link>}>
        <FormAlert message={t("invalidLinkMsg")} />
      </AuthCard>
    );
  }

  return (
    <AuthCard title={t("resetTitle")} description={t("resetDesc")}>
      <form onSubmit={handleSubmit((v) => mutate(v))} noValidate className="space-y-4">
        <FormAlert message={error ? authErrorMessage(error, "reset", lang) : null} />
        <div className="space-y-2">
          <FormField label={t("password")} htmlFor="rp-password" required error={errors.password?.message} hint={t("passwordHint")}>
            <PasswordInput id="rp-password" autoComplete="new-password" invalid={!!errors.password} {...register("password")} />
          </FormField>
          <PasswordStrength value={password} />
        </div>
        <FormField label={t("confirmPassword")} htmlFor="rp-confirm" required error={errors.confirmPassword?.message}>
          <PasswordInput id="rp-confirm" autoComplete="new-password" invalid={!!errors.confirmPassword} {...register("confirmPassword")} />
        </FormField>
        <Button type="submit" size="lg" className="w-full bg-green text-white hover:bg-green/90" loading={isPending}>{t("resetSubmit")}</Button>
      </form>
    </AuthCard>
  );
}
