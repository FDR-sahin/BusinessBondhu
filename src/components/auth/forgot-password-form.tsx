"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { ArrowLeft, KeyRound, Mail, ShieldCheck } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { FormField } from "@/components/ui/form-field";
import { Input } from "@/components/ui/input";
import { api, getErrorMessage } from "@/lib/api";
import { authErrorMessage } from "@/lib/auth";
import { useT } from "@/lib/i18n";
import { toFormattedNumber } from "@/lib/utils";
import {
  forgotSchema,
  otpResetSchema,
  type ForgotValues,
  type OtpResetValues,
} from "@/lib/validation";
import { useLangStore } from "@/store/lang-store";
import { AuthCard } from "./auth-card";
import { FormAlert } from "./form-alert";
import { PasswordInput, PasswordStrength } from "./password-input";

const COOLDOWN = 30; // seconds before "send again" is allowed

export function ForgotPasswordForm() {
  const router = useRouter();
  const t = useT();
  const lang = useLangStore((s) => s.lang);
  const isEn = lang === "en";

  const [sentEmail, setSentEmail] = useState<string | null>(null);
  const [receivedOtp, setReceivedOtp] = useState<string | null>(null);
  const [wait, setWait] = useState(0);

  // Step 1 Form: Request OTP
  const {
    register: registerEmail,
    handleSubmit: handleSubmitEmail,
    formState: { errors: emailErrors },
  } = useForm<ForgotValues>({
    resolver: zodResolver(forgotSchema),
    defaultValues: { email: "" },
  });

  // Step 2 Form: Verify OTP & Set New Password
  const {
    register: registerReset,
    handleSubmit: handleSubmitReset,
    watch: watchReset,
    formState: { errors: resetErrors },
    setValue: setResetValue,
  } = useForm<OtpResetValues>({
    resolver: zodResolver(otpResetSchema),
    defaultValues: { otp: "", password: "", confirmPassword: "" },
  });

  const newPassword = watchReset("password");

  // Mutation 1: Send OTP
  const {
    mutate: sendOtp,
    isPending: isSendingOtp,
    error: sendOtpError,
  } = useMutation({
    mutationFn: async (v: ForgotValues) => {
      const res = await api.post<{ success: boolean; message: string; otp?: string }>(
        "/auth/forgot-password",
        v
      );
      return { ...res.data, email: v.email };
    },
    onSuccess: (data) => {
      setSentEmail(data.email);
      setWait(COOLDOWN);
      if (data.otp) {
        setReceivedOtp(data.otp);
        setResetValue("otp", data.otp);
        toast.info(
          isEn
            ? `Your verification code (OTP): ${data.otp}`
            : `আপনার যাচাইকরণ কোড (OTP): ${data.otp}`,
          { duration: 10000 }
        );
      } else {
        toast.success(
          isEn
            ? "Verification code sent to your email!"
            : "আপনার ইমেইলে যাচাইকরণ কোড (OTP) পাঠানো হয়েছে!"
        );
      }
    },
    onError: (err) => {
      const msg = getErrorMessage(err);
      toast.error(msg);
    },
  });

  // Mutation 2: Reset Password with OTP
  const {
    mutate: resetPassword,
    isPending: isResetting,
    error: resetError,
  } = useMutation({
    mutationFn: async (v: OtpResetValues) => {
      const res = await api.post<{ success: boolean; message: string }>(
        "/auth/reset-password",
        {
          email: sentEmail,
          otp: v.otp,
          password: v.password,
          confirmPassword: v.confirmPassword,
        }
      );
      return res.data;
    },
    onSuccess: (data) => {
      toast.success(
        data.message ||
          (isEn
            ? "Password reset successfully! Please log in."
            : "পাসওয়ার্ড সফলভাবে পরিবর্তন করা হয়েছে! এখন লগইন করুন।")
      );
      router.replace("/login");
    },
    onError: (err) => {
      const msg = getErrorMessage(err);
      toast.error(msg);
    },
  });

  useEffect(() => {
    if (wait <= 0) return;
    const timer = setTimeout(() => setWait((w) => w - 1), 1000);
    return () => clearTimeout(timer);
  }, [wait]);

  const backToLogin = (
    <Link
      href="/login"
      className="inline-flex items-center gap-1.5 font-medium text-link hover:underline"
    >
      <ArrowLeft className="h-4 w-4" aria-hidden />
      {t("backToLogin")}
    </Link>
  );

  // ------------------ Step 2: OTP Verification & New Password ------------------
  if (sentEmail) {
    const resetErrorMsg = resetError ? getErrorMessage(resetError) : null;

    return (
      <AuthCard
        title={isEn ? "Reset Password with OTP" : "ওটিপি ও নতুন পাসওয়ার্ড দিন"}
        description={
          isEn
            ? `Enter the 6-digit verification code sent to ${sentEmail}`
            : `${sentEmail} এ পাঠানো ৬-ডিজিটের যাচাইকরণ কোড এবং নতুন পাসওয়ার্ড দিন`
        }
        footer={
          <div className="flex w-full items-center justify-between">
            {backToLogin}
            <button
              type="button"
              onClick={() => {
                setSentEmail(null);
                setReceivedOtp(null);
              }}
              className="text-sm font-medium text-ink-secondary hover:text-ink underline"
            >
              {isEn ? "Change email" : "ইমেইল পরিবর্তন করুন"}
            </button>
          </div>
        }
      >
        {/* OTP Highlight Banner */}
        {receivedOtp && (
          <div className="flex items-center justify-between rounded-xl border border-green/30 bg-green/10 p-3.5 text-sm text-green-dark">
            <div className="flex items-center gap-2 font-medium">
              <ShieldCheck className="h-5 w-5 text-green" />
              <span>{isEn ? "Your OTP Code:" : "আপনার যাচাইকরণ কোড:"}</span>
            </div>
            <span className="rounded-lg bg-green px-2.5 py-1 font-mono text-base font-bold text-white tracking-widest">
              {receivedOtp}
            </span>
          </div>
        )}

        <form
          onSubmit={handleSubmitReset((v) => resetPassword(v))}
          noValidate
          className="space-y-4"
        >
          <FormAlert message={resetErrorMsg} />

          {/* OTP Input */}
          <FormField
            label={isEn ? "6-Digit OTP Code" : "৬-ডিজিটের ওটিপি (OTP) কোড"}
            htmlFor="fp-otp"
            required
            error={resetErrors.otp?.message}
          >
            <Input
              id="fp-otp"
              type="text"
              inputMode="numeric"
              maxLength={6}
              placeholder="123456"
              className="text-center font-mono text-lg tracking-widest"
              invalid={!!resetErrors.otp}
              {...registerReset("otp")}
            />
          </FormField>

          {/* New Password */}
          <div className="space-y-2">
            <FormField
              label={isEn ? "New Password" : "নতুন পাসওয়ার্ড"}
              htmlFor="fp-new-password"
              required
              error={resetErrors.password?.message}
              hint={t("passwordHint")}
            >
              <PasswordInput
                id="fp-new-password"
                autoComplete="new-password"
                invalid={!!resetErrors.password}
                {...registerReset("password")}
              />
            </FormField>
            <PasswordStrength value={newPassword || ""} />
          </div>

          {/* Confirm Password */}
          <FormField
            label={isEn ? "Confirm Password" : "পাসওয়ার্ড নিশ্চিত করুন"}
            htmlFor="fp-confirm-password"
            required
            error={resetErrors.confirmPassword?.message}
          >
            <PasswordInput
              id="fp-confirm-password"
              autoComplete="new-password"
              invalid={!!resetErrors.confirmPassword}
              {...registerReset("confirmPassword")}
            />
          </FormField>

          <Button
            type="submit"
            size="lg"
            className="w-full bg-green text-white hover:bg-green/90"
            loading={isResetting}
          >
            <KeyRound className="mr-2 h-4 w-4" />
            {isEn ? "Change Password" : "পাসওয়ার্ড পরিবর্তন করুন"}
          </Button>

          <div className="pt-2 text-center">
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="w-full text-xs"
              disabled={wait > 0 || isSendingOtp}
              loading={isSendingOtp}
              onClick={() => sendOtp({ email: sentEmail })}
            >
              {wait > 0
                ? isEn
                  ? `Resend code in ${wait}s`
                  : `পুনরায় কোড পাঠান (${toFormattedNumber(wait, lang)} সে.)`
                : isEn
                ? "Resend Verification Code"
                : "কোড পুনরায় পাঠান"}
            </Button>
          </div>
        </form>
      </AuthCard>
    );
  }

  // ------------------ Step 1: Request OTP by Email ------------------
  const sendErrorMsg = sendOtpError
    ? authErrorMessage(sendOtpError, "forgot", lang)
    : null;

  return (
    <AuthCard
      title={isEn ? "Forgot Password" : "পাসওয়ার্ড ভুলে গেছেন?"}
      description={
        isEn
          ? "Enter your registered email address to receive a verification OTP code."
          : "আপনার নিবন্ধিত ইমেইল ঠিকানা দিন। আমরা পাসওয়ার্ড রিসেট করার জন্য একটি ওটিপি কোড পাঠাব।"
      }
      footer={backToLogin}
    >
      <form
        onSubmit={handleSubmitEmail((v) => sendOtp(v))}
        noValidate
        className="space-y-4"
      >
        <FormAlert message={sendErrorMsg} />

        <FormField
          label={t("email")}
          htmlFor="fp-email"
          required
          error={emailErrors.email?.message}
        >
          <Input
            id="fp-email"
            type="email"
            autoComplete="email"
            inputMode="email"
            placeholder="example@gmail.com"
            invalid={!!emailErrors.email}
            {...registerEmail("email")}
          />
        </FormField>

        <Button
          type="submit"
          size="lg"
          className="w-full bg-green text-white hover:bg-green/90"
          loading={isSendingOtp}
        >
          <Mail className="mr-2 h-4 w-4" />
          {isEn ? "Send Verification Code (OTP)" : "যাচাইকরণ কোড (OTP) পাঠান"}
        </Button>
      </form>
    </AuthCard>
  );
}
