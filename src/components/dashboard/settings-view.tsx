"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AlertTriangle, Monitor, Moon, Sun, type LucideIcon } from "lucide-react";
import { useTheme } from "next-themes";
import { useRouter } from "next/navigation";
import { useState, type ReactNode } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { FormAlert } from "@/components/auth/form-alert";
import { PasswordInput, PasswordStrength } from "@/components/auth/password-input";
import { QueryError } from "@/components/shared/query-error";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { FormField } from "@/components/ui/form-field";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Skeleton } from "@/components/ui/skeleton";
import { Switch } from "@/components/ui/switch";
import { useSettings, useUpdatePrefs } from "@/hooks/use-settings";
import { api, getErrorMessage } from "@/lib/api";
import { getFieldErrors } from "@/lib/auth";
import { changeEmailSchema, changePasswordSchema, type ChangeEmailValues, type ChangePasswordValues } from "@/lib/validation";
import { useAuthStore } from "@/store/auth-store";
import { useLangStore, type Lang } from "@/store/lang-store";
import type { NotificationPrefs } from "@/types";

function Section({ title, description, children, danger }: { title: string; description?: string; children: ReactNode; danger?: boolean }) {
  return (
    <Card className={danger ? "space-y-5 border-danger/40 p-6" : "space-y-5 p-6"}>
      <div>
        <h2 className={`text-lg font-semibold ${danger ? "text-danger" : ""}`}>{title}</h2>
        {description && <p className="mt-0.5 text-sm text-ink-secondary">{description}</p>}
      </div>
      {children}
    </Card>
  );
}

/** Radio "cards": used for theme and language. */
function ChoiceCards<T extends string>({ label, value, onChange, options }: { label: string; value: T; onChange: (v: T) => void; options: { value: T; label: string; icon?: LucideIcon }[] }) {
  return (
    <RadioGroup value={value} onValueChange={(v) => onChange(v as T)} aria-label={label} className="grid gap-3 sm:grid-cols-3">
      {options.map(({ value: ov, label: ol, icon: Icon }) => (
        <Label key={ov} htmlFor={`${label}-${ov}`} className="flex cursor-pointer items-center gap-2.5 rounded-lg border border-border bg-surface p-3 font-normal transition-colors has-[[data-state=checked]]:border-primary has-[[data-state=checked]]:bg-primary-soft">
          <RadioGroupItem id={`${label}-${ov}`} value={ov} />
          {Icon && <Icon className="h-4 w-4" aria-hidden />}
          {ol}
        </Label>
      ))}
    </RadioGroup>
  );
}

/* ---------------- notification preferences ---------------- */
function getPrefs(isEn: boolean): { key: keyof NotificationPrefs; label: string; text: string }[] {
  return [
    { key: "likes", label: isEn ? "Likes" : "লাইক", text: isEn ? "Notify when someone likes your post" : "কেউ আপনার পোস্টে লাইক দিলে জানান" },
    { key: "comments", label: isEn ? "Comments" : "মন্তব্য", text: isEn ? "Notify when new comments arrive on your post" : "আপনার পোস্টে নতুন মন্তব্য এলে জানান" },
    { key: "replies", label: isEn ? "Replies" : "উত্তর", text: isEn ? "Notify when someone replies to your comment" : "আপনার মন্তব্যে কেউ উত্তর দিলে জানান" },
    { key: "system", label: isEn ? "Admin & System Messages" : "অ্যাডমিন ও সিস্টেম বার্তা", text: isEn ? "Post approval, rejection, and announcements" : "পোস্ট অনুমোদন, বাতিল ও গুরুত্বপূর্ণ ঘোষণা" },
    { key: "email", label: isEn ? "Email Notifications" : "ইমেইলেও জানান", text: isEn ? "Send a copy of notifications to your email" : "নোটিফিকেশনের কপি ইমেইলে পাঠানো হবে" },
  ];
}

function NotificationSection() {
  const { data, isPending, isError, refetch } = useSettings();
  const update = useUpdatePrefs();
  const lang = useLangStore((s) => s.lang);
  const isEn = lang === "en";
  const prefs = getPrefs(isEn);

  return (
    <Section
      title={isEn ? "Notifications" : "নোটিফিকেশন"}
      description={isEn ? "Choose what updates you want to receive. Changes are saved automatically." : "কোন বিষয়ে খবর পেতে চান বেছে নিন। পরিবর্তন সঙ্গে সঙ্গে সেভ হয়।"}
    >
      {isError ? <QueryError onRetry={() => void refetch()} /> : isPending ? <Skeleton className="h-48 w-full" /> : (
        <ul className="divide-y divide-border">
          {prefs.map((p) => (
            <li key={p.key} className="flex items-center justify-between gap-4 py-3.5">
              <div>
                <Label htmlFor={`pref-${p.key}`} className="cursor-pointer">{p.label}</Label>
                <p className="text-sm text-ink-secondary">{p.text}</p>
              </div>
              <Switch id={`pref-${p.key}`} checked={data.notifications[p.key]} onCheckedChange={(checked) => update.mutate({ [p.key]: checked })} />
            </li>
          ))}
        </ul>
      )}
    </Section>
  );
}

/* ---------------- appearance ---------------- */
function AppearanceSection() {
  const { theme, setTheme } = useTheme();
  const lang = useLangStore((s) => s.lang);
  const setLang = useLangStore((s) => s.setLang);
  const isEn = lang === "en";

  return (
    <Section
      title={isEn ? "Language & Theme" : "ভাষা ও থিম"}
      description={isEn ? "These preferences are saved only on this device." : "এই পছন্দ শুধু এই ডিভাইসে সংরক্ষিত থাকে।"}
    >
      <div className="space-y-2">
        <p className="text-sm font-medium">{isEn ? "Language" : "ভাষা"}</p>
        <ChoiceCards<Lang> label={isEn ? "Language" : "ভাষা"} value={lang} onChange={setLang} options={[{ value: "bn", label: "বাংলা" }, { value: "en", label: "English" }]} />
      </div>
      <div className="space-y-2">
        <p className="text-sm font-medium">{isEn ? "Theme" : "থিম"}</p>
        <ChoiceCards
          label={isEn ? "Theme" : "থিম"}
          value={theme ?? "system"}
          onChange={setTheme}
          options={[
            { value: "light", label: isEn ? "Light" : "লাইট", icon: Sun },
            { value: "dark", label: isEn ? "Dark" : "ডার্ক", icon: Moon },
            { value: "system", label: isEn ? "System" : "সিস্টেম", icon: Monitor },
          ]}
        />
      </div>
    </Section>
  );
}

/* ---------------- change password ---------------- */
function PasswordSection() {
  const lang = useLangStore((s) => s.lang);
  const isEn = lang === "en";

  const { register, handleSubmit, reset, watch, setError, formState: { errors } } = useForm<ChangePasswordValues>({
    resolver: zodResolver(changePasswordSchema),
    defaultValues: { currentPassword: "", password: "", confirmPassword: "" },
  });
  const pw = watch("password");

  const { mutate, isPending, error } = useMutation({
    mutationFn: (v: ChangePasswordValues) => api.put("/me/password", { currentPassword: v.currentPassword, newPassword: v.password }),
    onSuccess: () => { toast.success(isEn ? "Password changed successfully" : "পাসওয়ার্ড বদলানো হয়েছে"); reset(); },
    onError: (e) => {
      const fields = getFieldErrors(e);
      if (fields.currentPassword) setError("currentPassword", { message: fields.currentPassword });
    },
  });

  // 400/403 from the API are treated as "wrong current password"
  const wrongCurrent = (error as { response?: { status?: number } } | null)?.response?.status;
  const message = error
    ? wrongCurrent === 400 || wrongCurrent === 403
      ? isEn
        ? "Current password is incorrect."
        : "বর্তমান পাসওয়ার্ড সঠিক নয়।"
      : getErrorMessage(error)
    : null;

  return (
    <Section title={isEn ? "Change Password" : "পাসওয়ার্ড পরিবর্তন"}>
      <form onSubmit={handleSubmit((v) => mutate(v))} noValidate className="max-w-md space-y-4">
        <FormAlert message={message} />
        <FormField label={isEn ? "Current Password" : "বর্তমান পাসওয়ার্ড"} htmlFor="cp-current" required error={errors.currentPassword?.message}>
          <PasswordInput id="cp-current" autoComplete="current-password" invalid={!!errors.currentPassword} {...register("currentPassword")} />
        </FormField>
        <div className="space-y-2">
          <FormField
            label={isEn ? "New Password" : "নতুন পাসওয়ার্ড"}
            htmlFor="cp-new"
            required
            error={errors.password?.message}
            hint={isEn ? "At least 8 characters, with letters and numbers" : "কমপক্ষে ৮ অক্ষর, অন্তত একটি ইংরেজি অক্ষর ও একটি সংখ্যা"}
          >
            <PasswordInput id="cp-new" autoComplete="new-password" invalid={!!errors.password} {...register("password")} />
          </FormField>
          <PasswordStrength value={pw} />
        </div>
        <FormField label={isEn ? "Confirm New Password" : "নতুন পাসওয়ার্ড নিশ্চিত করুন"} htmlFor="cp-confirm" required error={errors.confirmPassword?.message}>
          <PasswordInput id="cp-confirm" autoComplete="new-password" invalid={!!errors.confirmPassword} {...register("confirmPassword")} />
        </FormField>
        <Button type="submit" loading={isPending}>{isEn ? "Change Password" : "পাসওয়ার্ড বদলান"}</Button>
      </form>
    </Section>
  );
}

/* ---------------- change email (needs verification) ---------------- */
function EmailSection() {
  const user = useAuthStore((s) => s.user);
  const lang = useLangStore((s) => s.lang);
  const isEn = lang === "en";
  const [sentTo, setSentTo] = useState<string | null>(null);

  const { register, handleSubmit, reset, setError, formState: { errors } } = useForm<ChangeEmailValues>({
    resolver: zodResolver(changeEmailSchema),
    defaultValues: { email: "", password: "" },
  });

  const { mutate, isPending, error } = useMutation({
    mutationFn: (v: ChangeEmailValues) => api.post("/me/email", v),
    onSuccess: (_r, v) => { setSentTo(v.email); reset(); },
    onError: (e) => {
      const fields = getFieldErrors(e);
      if (fields.email) setError("email", { message: fields.email });
    },
  });

  const status = (error as { response?: { status?: number } } | null)?.response?.status;
  const message = error
    ? status === 409
      ? isEn
        ? "An account with this email already exists."
        : "এই ইমেইল দিয়ে আগেই অ্যাকাউন্ট খোলা হয়েছে।"
      : status === 400 || status === 403
      ? isEn
        ? "Password is incorrect."
        : "পাসওয়ার্ড সঠিক নয়।"
      : getErrorMessage(error)
    : null;

  return (
    <Section title={isEn ? "Change Email" : "ইমেইল পরিবর্তন"} description={isEn ? `Current Email: ${user?.email ?? ""}` : `বর্তমান ইমেইল: ${user?.email ?? ""}`}>
      {sentTo && (
        <FormAlert
          tone="success"
          message={
            isEn
              ? `A verification link has been sent to ${sentTo}. Click the link to complete the change.`
              : `${sentTo} ঠিকানায় একটি যাচাইয়ের লিংক পাঠানো হয়েছে। লিংকে চাপ দিলেই ইমেইল বদলে যাবে। তার আগে পুরনো ইমেইলই কার্যকর থাকবে।`
          }
        />
      )}
      <form onSubmit={handleSubmit((v) => mutate(v))} noValidate className="max-w-md space-y-4">
        <FormAlert message={message} />
        <FormField label={isEn ? "New Email" : "নতুন ইমেইল"} htmlFor="ce-email" required error={errors.email?.message}>
          <Input id="ce-email" type="email" autoComplete="email" inputMode="email" invalid={!!errors.email} {...register("email")} />
        </FormField>
        <FormField
          label={isEn ? "Your Password" : "আপনার পাসওয়ার্ড"}
          htmlFor="ce-password"
          required
          error={errors.password?.message}
          hint={isEn ? "Confirm password for security." : "নিরাপত্তার জন্য পাসওয়ার্ড নিশ্চিত করুন।"}
        >
          <PasswordInput id="ce-password" autoComplete="current-password" invalid={!!errors.password} {...register("password")} />
        </FormField>
        <Button type="submit" loading={isPending}>{isEn ? "Send Verification Link" : "যাচাইয়ের লিংক পাঠান"}</Button>
      </form>
    </Section>
  );
}

/* ---------------- danger zone ---------------- */
function DangerSection() {
  const user = useAuthStore((s) => s.user);
  const lang = useLangStore((s) => s.lang);
  const isEn = lang === "en";
  const router = useRouter();
  const qc = useQueryClient();
  const [open, setOpen] = useState(false);
  const [typed, setTyped] = useState("");
  const matches = !!user && typed.trim().toLowerCase() === user.email.toLowerCase();

  const { mutate, isPending, error } = useMutation({
    mutationFn: () => api.delete("/me", { data: { confirmEmail: typed.trim() } }),
    onSuccess: () => {
      useAuthStore.getState().logout();
      qc.clear();
      toast.success(isEn ? "Your account has been deleted" : "আপনার অ্যাকাউন্ট মুছে ফেলা হয়েছে");
      router.replace("/");
      router.refresh();
    },
  });

  return (
    <Section
      danger
      title={isEn ? "Danger Zone" : "বিপজ্জনক এলাকা"}
      description={
        isEn
          ? "Deleting your account is permanent. All posts, comments, and saved data will be lost."
          : "অ্যাকাউন্ট মুছে ফেললে আপনার পোস্ট, মন্তব্য ও সেভ করা তথ্য আর ফিরে পাওয়া যাবে না।"
      }
    >
      <Button variant="danger" onClick={() => { setTyped(""); setOpen(true); }}><AlertTriangle aria-hidden /> {isEn ? "Delete Account" : "অ্যাকাউন্ট মুছে ফেলুন"}</Button>

      <Dialog open={open} onOpenChange={(o) => !isPending && setOpen(o)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{isEn ? "Are you sure you want to delete your account?" : "সত্যিই অ্যাকাউন্ট মুছে ফেলবেন?"}</DialogTitle>
            <DialogDescription>
              {isEn
                ? "This action cannot be undone. Please type your email address to confirm: "
                : "এই কাজটি আর ফেরানো যাবে না। নিশ্চিত করতে নিচে আপনার ইমেইল ঠিকানা লিখুন: "}{" "}
              <strong className="break-all text-foreground">{user?.email}</strong>
            </DialogDescription>
          </DialogHeader>
          <FormAlert message={error ? getErrorMessage(error) : null} />
          <div className="space-y-1.5">
            <Label htmlFor="del-confirm">{isEn ? "Confirm Email" : "ইমেইল নিশ্চিত করুন"}</Label>
            <Input id="del-confirm" type="email" autoComplete="off" value={typed} onChange={(e) => setTyped(e.target.value)} />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setOpen(false)} disabled={isPending}>{isEn ? "Cancel" : "বাতিল"}</Button>
            <Button variant="danger" disabled={!matches} loading={isPending} onClick={() => mutate()}>{isEn ? "Delete Permanently" : "চিরতরে মুছে ফেলুন"}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Section>
  );
}

export function SettingsView() {
  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <NotificationSection />
      <AppearanceSection />
      <PasswordSection />
      <EmailSection />
      <DangerSection />
    </div>
  );
}
