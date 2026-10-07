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
import { resetSchema, type ResetValues } from "@/lib/validation";
import { AuthCard } from "./auth-card";
import { FormAlert } from "./form-alert";
import { PasswordInput, PasswordStrength } from "./password-input";

/** The page the email link opens: /reset-password?token=… */
export function ResetPasswordForm() {
  const router = useRouter();
  const token = useSearchParams().get("token");

  const { register, handleSubmit, watch, formState: { errors } } = useForm<ResetValues>({ resolver: zodResolver(resetSchema), defaultValues: { password: "", confirmPassword: "" } });
  const password = watch("password");

  const { mutate, isPending, error } = useMutation({
    mutationFn: (v: ResetValues) => api.post("/auth/reset-password", { token, password: v.password }),
    onSuccess: () => {
      toast.success("পাসওয়ার্ড বদলানো হয়েছে। এখন লগইন করুন।");
      router.replace("/login");
    },
  });

  if (!token) {
    return (
      <AuthCard title="লিংকটি সঠিক নয়" footer={<Link href="/forgot-password" className="font-medium text-link hover:underline">নতুন লিংক নিন</Link>}>
        <FormAlert message="রিসেটের লিংকটি অসম্পূর্ণ বা মেয়াদোত্তীর্ণ। অনুগ্রহ করে নতুন করে রিসেট লিংক চান।" />
      </AuthCard>
    );
  }

  return (
    <AuthCard title="নতুন পাসওয়ার্ড দিন" description="আপনার অ্যাকাউন্টের জন্য একটি নতুন পাসওয়ার্ড বেছে নিন।">
      <form onSubmit={handleSubmit((v) => mutate(v))} noValidate className="space-y-4">
        <FormAlert message={error ? authErrorMessage(error, "reset") : null} />
        <div className="space-y-2">
          <FormField label="নতুন পাসওয়ার্ড" htmlFor="rp-password" required error={errors.password?.message} hint="কমপক্ষে ৮ অক্ষর, অন্তত একটি ইংরেজি অক্ষর ও একটি সংখ্যা">
            <PasswordInput id="rp-password" autoComplete="new-password" invalid={!!errors.password} {...register("password")} />
          </FormField>
          <PasswordStrength value={password} />
        </div>
        <FormField label="পাসওয়ার্ড নিশ্চিত করুন" htmlFor="rp-confirm" required error={errors.confirmPassword?.message}>
          <PasswordInput id="rp-confirm" autoComplete="new-password" invalid={!!errors.confirmPassword} {...register("confirmPassword")} />
        </FormField>
        <Button type="submit" size="lg" className="w-full" loading={isPending}>পাসওয়ার্ড বদলান</Button>
      </form>
    </AuthCard>
  );
}
