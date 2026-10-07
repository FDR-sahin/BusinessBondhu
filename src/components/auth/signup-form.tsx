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
import { signupSchema, type SignupValues } from "@/lib/validation";
import { useAuthStore } from "@/store/auth-store";
import type { AuthResponse } from "@/types";
import { AuthCard } from "./auth-card";
import { FormAlert } from "./form-alert";
import { PasswordInput, PasswordStrength } from "./password-input";
import { SocialButtons } from "./social-buttons";

const FIELDS: (keyof SignupValues)[] = ["name", "email", "password", "division", "district"];

export function SignupForm() {
  const { target, go, withRedirect } = useAuthRedirect();
  const login = useAuthStore((s) => s.login);

  const { register, control, handleSubmit, setValue, setError, watch, formState: { errors } } = useForm<SignupValues>({
    resolver: zodResolver(signupSchema),
    defaultValues: { name: "", email: "", password: "", confirmPassword: "", division: "", district: "" },
  });
  const password = watch("password");
  const division = watch("division");

  const { mutate, isPending, error } = useMutation({
    mutationFn: async (v: SignupValues) => {
      const { confirmPassword: _omit, ...body } = v; // the API doesn't need the confirmation
      return (await api.post<AuthResponse>("/auth/signup", body)).data;
    },
    onSuccess: (data) => {
      login({ ...data, remember: true });
      toast.success(`অ্যাকাউন্ট তৈরি হয়েছে। স্বাগতম, ${data.user.name}!`);
      go();
    },
    onError: (e) => {
      // Field-level messages from the API (e.g. "email already used") land under the right input.
      const fieldErrors = getFieldErrors(e);
      FIELDS.forEach((f) => fieldErrors[f] && setError(f, { message: fieldErrors[f] }));
    },
  });

  return (
    <AuthCard
      title="নতুন অ্যাকাউন্ট খুলুন"
      description="কয়েক মিনিটেই শুরু করুন। আপনার এলাকার আইডিয়া অপেক্ষা করছে।"
      footer={<>আগে থেকেই অ্যাকাউন্ট আছে? <Link href={withRedirect("/login")} className="font-medium text-link hover:underline">লগইন করুন</Link></>}
    >
      <SocialButtons redirectTo={target} />

      <form onSubmit={handleSubmit((v) => mutate(v))} noValidate className="space-y-4">
        <FormAlert message={error && Object.keys(getFieldErrors(error)).length === 0 ? authErrorMessage(error, "signup") : null} />

        <FormField label="পুরো নাম" htmlFor="su-name" required error={errors.name?.message}>
          <Input id="su-name" autoComplete="name" invalid={!!errors.name} {...register("name")} />
        </FormField>

        <FormField label="ইমেইল" htmlFor="su-email" required error={errors.email?.message}>
          <Input id="su-email" type="email" autoComplete="email" inputMode="email" invalid={!!errors.email} {...register("email")} />
        </FormField>

        <div className="space-y-2">
          <FormField label="পাসওয়ার্ড" htmlFor="su-password" required error={errors.password?.message} hint="কমপক্ষে ৮ অক্ষর, অন্তত একটি ইংরেজি অক্ষর ও একটি সংখ্যা">
            <PasswordInput id="su-password" autoComplete="new-password" invalid={!!errors.password} {...register("password")} />
          </FormField>
          <PasswordStrength value={password} />
        </div>

        <FormField label="পাসওয়ার্ড নিশ্চিত করুন" htmlFor="su-confirm" required error={errors.confirmPassword?.message}>
          <PasswordInput id="su-confirm" autoComplete="new-password" invalid={!!errors.confirmPassword} {...register("confirmPassword")} />
        </FormField>

        <div className="grid gap-4 sm:grid-cols-2">
          <FormField label="বিভাগ" htmlFor="su-division" required error={errors.division?.message}>
            <Controller control={control} name="division" render={({ field }) => (
              <Select value={field.value} onValueChange={(v) => { field.onChange(v); setValue("district", ""); }}>
                <SelectTrigger id="su-division" invalid={!!errors.division}><SelectValue placeholder="বিভাগ বেছে নিন" /></SelectTrigger>
                <SelectContent>{DIVISIONS.map((d) => <SelectItem key={d.value} value={d.value}>{d.label}</SelectItem>)}</SelectContent>
              </Select>
            )} />
          </FormField>

          <FormField label="জেলা" htmlFor="su-district" required error={errors.district?.message}>
            <Controller control={control} name="district" render={({ field }) => (
              <Select value={field.value} onValueChange={field.onChange} disabled={!division}>
                <SelectTrigger id="su-district" invalid={!!errors.district}><SelectValue placeholder="জেলা বেছে নিন" /></SelectTrigger>
                <SelectContent>{getDistricts(division).map((d) => <SelectItem key={d.value} value={d.value}>{d.label}</SelectItem>)}</SelectContent>
              </Select>
            )} />
          </FormField>
        </div>

        <Button type="submit" size="lg" className="w-full" loading={isPending}>অ্যাকাউন্ট খুলুন</Button>
      </form>
    </AuthCard>
  );
}
