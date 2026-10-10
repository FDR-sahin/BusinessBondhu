"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { MapPin, Save } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";
import { UserAvatar } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { FormField } from "@/components/ui/form-field";
import { Input, Textarea } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { api } from "@/lib/api";
import { authErrorMessage, getFieldErrors } from "@/lib/auth";
import { DIVISIONS, formatLocation, getDistricts } from "@/lib/bd-data";
import { profileSchema, type ProfileValues } from "@/lib/validation";
import { useAuthStore } from "@/store/auth-store";
import { useLangStore } from "@/store/lang-store";
import type { User } from "@/types";
import { FormAlert } from "@/components/auth/form-alert";
import { AvatarUploader } from "./avatar-uploader";

const defaultUser: User = {
  id: "u-1",
  name: "ব্যবহারকারী",
  email: "user@example.com",
  role: "user",
  createdAt: new Date().toISOString(),
};

const toValues = (u?: User | null, customFallbackName?: string): ProfileValues => {
  const emailPrefix = u?.email ? u.email.split("@")[0] : "";
  let name = u?.name && u.name !== "উদ্যোক্তা" ? u.name : "";
  if ((!name || name === emailPrefix) && customFallbackName && customFallbackName !== emailPrefix && customFallbackName !== "উদ্যোক্তা") {
    name = customFallbackName;
  }
  if (!name && emailPrefix) name = emailPrefix;
  if (!name) name = "ব্যবহারকারী";

  return {
    name,
    bio: u?.bio ?? "",
    division: u?.division ?? "",
    district: u?.district ?? "",
    area: u?.area ?? "",
    avatar: u?.avatar ?? "",
  };
};

function getClientCookie(name: string): string {
  if (typeof document === "undefined") return "";
  const match = document.cookie.match(new RegExp(`(?:^|;\\s*)${name}=([^;]*)`));
  return match ? decodeURIComponent(match[1]).trim() : "";
}

export function ProfileView() {
  const storeUser = useAuthStore((s) => s.user);
  const setUser = useAuthStore((s) => s.setUser);
  const [localProfile, setLocalProfile] = useState<User | null>(null);
  const lang = useLangStore((s) => s.lang);
  const isEn = lang === "en";
  const [uploading, setUploading] = useState(false);

  // Initialize and merge user data from storeUser, localStorage or cookies
  const user = useMemo(() => {
    let storageUser: Partial<User> | null = null;
    if (typeof window !== "undefined") {
      try {
        const raw = localStorage.getItem("bhbd_user_profile");
        if (raw) storageUser = JSON.parse(raw);
        if (!storageUser) {
          const authRaw = localStorage.getItem("bhbd-auth");
          if (authRaw) {
            const parsed = JSON.parse(authRaw);
            if (parsed?.state?.user) storageUser = parsed.state.user;
          }
        }
      } catch {}
    }

    const cookieDivision = typeof window !== "undefined" ? getClientCookie("bhbd_user_division") : "";
    const cookieDistrict = typeof window !== "undefined" ? getClientCookie("bhbd_user_district") : "";
    const cookieArea = typeof window !== "undefined" ? getClientCookie("bhbd_user_area") : "";
    const cookieBio = typeof window !== "undefined" ? getClientCookie("bhbd_user_bio") : "";
    const cookieName = typeof window !== "undefined" ? getClientCookie("bhbd_user_name") : "";
    const cookieEmail = typeof window !== "undefined" ? getClientCookie("bhbd_user_email") : "";

    const activeUser = storeUser || localProfile || storageUser;

    return {
      id: activeUser?.id || "u-1",
      name: (activeUser?.name && activeUser.name !== "উদ্যোক্তা" ? activeUser.name : "") ||
        cookieName ||
        "ব্যবহারকারী",
      email: activeUser?.email || cookieEmail || "user@example.com",
      bio: activeUser?.bio || storageUser?.bio || cookieBio || "",
      division: activeUser?.division || storageUser?.division || cookieDivision || "",
      district: activeUser?.district || storageUser?.district || cookieDistrict || "",
      area: activeUser?.area || storageUser?.area || cookieArea || "",
      avatar: activeUser?.avatar || storageUser?.avatar || "",
      role: activeUser?.role || "user",
      createdAt: activeUser?.createdAt || new Date().toISOString(),
    } as User;
  }, [storeUser, localProfile]);

  const customFallback = user.name && user.name !== "উদ্যোক্তা" ? user.name : undefined;
  const values = useMemo(() => toValues(user, customFallback), [user, customFallback]);

  const { register, control, handleSubmit, setValue, setError, watch, reset, formState: { errors, isDirty } } = useForm<ProfileValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: values,
    values, // fills the form when /auth/me or storeUser finishes loading
    resetOptions: { keepDirtyValues: true }, // …without wiping what the user already typed
  });

  // Read local profile fallback on client mount
  useEffect(() => {
    if (typeof window !== "undefined") {
      try {
        const raw = localStorage.getItem("bhbd_user_profile");
        if (raw) {
          const parsed = JSON.parse(raw);
          if (parsed?.name && parsed.name !== "উদ্যোক্তা") {
            setLocalProfile(parsed);
            reset(toValues(parsed));
          }
        }
      } catch (e) {
        console.error(e);
      }
    }
  }, [reset]);

  const v = watch();
  const districts = getDistricts(v.division ?? "");

  const { mutate, isPending, error } = useMutation({
    mutationFn: async (body: ProfileValues) => {
      const res = await api.put<{ user?: User; message?: string }>("/me/profile", body);
      const emailPrefix = user.email ? user.email.split("@")[0] : "ব্যবহারকারী";
      const resolvedName = (body.name?.trim() && body.name.trim() !== "উদ্যোক্তা" ? body.name.trim() : "") ||
        (user.name && user.name !== "উদ্যোক্তা" ? user.name : "") ||
        emailPrefix;

      const returned = res.data?.user;
      const updatedUser: User = {
        id: returned?.id || user.id || "u-1",
        name: resolvedName,
        email: returned?.email || user.email || "user@example.com",
        bio: body.bio || returned?.bio || user.bio || "",
        division: body.division || returned?.division || user.division || "",
        district: body.district || returned?.district || user.district || "",
        area: body.area || returned?.area || user.area || "",
        avatar: body.avatar || returned?.avatar || user.avatar || "",
        role: returned?.role || user.role || "user",
        createdAt: returned?.createdAt || user.createdAt || new Date().toISOString(),
      };
      return updatedUser;
    },
    onSuccess: (updated) => {
      if (updated) {
        setUser(updated);
        setLocalProfile(updated);
        if (typeof window !== "undefined") {
          try {
            localStorage.setItem("bhbd_user_profile", JSON.stringify(updated));
            const secure = window.location.protocol === "https:" ? "; Secure" : "";
            const maxAge = 60 * 60 * 24 * 30; // 30 days
            document.cookie = `bhbd_user_name=${encodeURIComponent(updated.name)}; Path=/; Max-Age=${maxAge}; SameSite=Lax${secure}`;
            document.cookie = `bhbd_user_email=${encodeURIComponent(updated.email)}; Path=/; Max-Age=${maxAge}; SameSite=Lax${secure}`;
            document.cookie = `bhbd_user_division=${encodeURIComponent(updated.division || "")}; Path=/; Max-Age=${maxAge}; SameSite=Lax${secure}`;
            document.cookie = `bhbd_user_district=${encodeURIComponent(updated.district || "")}; Path=/; Max-Age=${maxAge}; SameSite=Lax${secure}`;
            document.cookie = `bhbd_user_area=${encodeURIComponent(updated.area || "")}; Path=/; Max-Age=${maxAge}; SameSite=Lax${secure}`;
            document.cookie = `bhbd_user_bio=${encodeURIComponent(updated.bio || "")}; Path=/; Max-Age=${maxAge}; SameSite=Lax${secure}`;
          } catch (e) {
            console.error(e);
          }
        }
        reset(toValues(updated));
        toast.success(isEn ? "Profile updated successfully" : "প্রোফাইল আপডেট হয়েছে");
      }
    },
    onError: (e) => {
      const fields = getFieldErrors(e);
      Object.keys(fields).forEach((k) => k in profileSchema.shape && setError(k as keyof ProfileValues, { message: fields[k] }));
    },
  });

  return (
    <form onSubmit={handleSubmit((body) => mutate(body))} noValidate className="grid items-start gap-8 lg:grid-cols-[minmax(0,1fr)_20rem]">
      <div className="space-y-6">
        <Card className="space-y-5 p-6">
          <h2 className="text-lg font-semibold">{isEn ? "Profile Picture" : "প্রোফাইল ছবি"}</h2>
          <Controller control={control} name="avatar" render={({ field }) => (
            <AvatarUploader name={v.name} value={field.value} onChange={(url) => field.onChange(url)} onBusyChange={setUploading} />
          )} />
        </Card>

        <Card className="space-y-5 p-6">
          <h2 className="text-lg font-semibold">{isEn ? "Personal Information" : "ব্যক্তিগত তথ্য"}</h2>
          <FormAlert message={error && Object.keys(getFieldErrors(error)).length === 0 ? authErrorMessage(error, "signup") : null} />

          <FormField label={isEn ? "Full Name" : "নাম"} htmlFor="pf-name" required error={errors.name?.message}>
            <Input id="pf-name" autoComplete="name" invalid={!!errors.name} {...register("name")} />
          </FormField>

          <FormField label={isEn ? "Email" : "ইমেইল"} htmlFor="pf-email" hint={isEn ? "Use the settings page to change your email address." : "ইমেইল বদলাতে সেটিংস পেজ ব্যবহার করুন।"}>
            <Input id="pf-email" value={user.email} readOnly aria-readonly className="bg-muted" />
          </FormField>

          <FormField label={isEn ? "Bio" : "সংক্ষিপ্ত পরিচিতি"} htmlFor="pf-bio" error={errors.bio?.message}>
            <Textarea id="pf-bio" maxLength={300} className="min-h-[110px]" placeholder={isEn ? "Write a line or two about your business or interests." : "আপনার ব্যবসা বা আগ্রহ সম্পর্কে দুই-এক লাইন লিখুন।"} invalid={!!errors.bio} {...register("bio")} />
            <p className="text-right text-sm text-ink-secondary">{(v.bio ?? "").length} / 300</p>
          </FormField>
        </Card>

        <Card className="space-y-5 p-6">
          <h2 className="text-lg font-semibold">{isEn ? "Location" : "এলাকা"}</h2>
          <div className="grid gap-5 sm:grid-cols-2">
            <FormField label={isEn ? "Division" : "বিভাগ"} htmlFor="pf-division">
              <Controller control={control} name="division" render={({ field }) => (
                <Select value={field.value || undefined} onValueChange={(val) => { field.onChange(val); setValue("district", "", { shouldDirty: true }); }}>
                  <SelectTrigger id="pf-division"><SelectValue placeholder={isEn ? "Select Division" : "বিভাগ বেছে নিন"} /></SelectTrigger>
                  <SelectContent>{DIVISIONS.map((d) => <SelectItem key={d.value} value={d.value}>{isEn ? d.value : d.label}</SelectItem>)}</SelectContent>
                </Select>
              )} />
            </FormField>
            <FormField label={isEn ? "District" : "জেলা"} htmlFor="pf-district">
              <Controller control={control} name="district" render={({ field }) => (
                <Select value={field.value || undefined} onValueChange={field.onChange} disabled={!v.division}>
                  <SelectTrigger id="pf-district"><SelectValue placeholder={isEn ? "Select District" : "জেলা বেছে নিন"} /></SelectTrigger>
                  <SelectContent>{districts.map((d) => <SelectItem key={d.value} value={d.value}>{isEn ? d.value : d.label}</SelectItem>)}</SelectContent>
                </Select>
              )} />
            </FormField>
          </div>
          <FormField label={isEn ? "Area / Neighborhood" : "এলাকা"} htmlFor="pf-area" error={errors.area?.message}>
            <Input id="pf-area" maxLength={80} autoComplete="off" placeholder={isEn ? "e.g. Mirpur 10" : "যেমন: মিরপুর ১০"} invalid={!!errors.area} {...register("area")} />
          </FormField>
        </Card>

        <div className="flex justify-end">
          <Button type="submit" size="lg" loading={isPending} disabled={!isDirty || uploading}>{!isPending && <Save aria-hidden />}{isEn ? "Save Changes" : "পরিবর্তন সেভ করুন"}</Button>
        </div>
      </div>

      {/* How other members will see you */}
      <aside className="lg:sticky lg:top-24" aria-label={isEn ? "Profile Preview" : "প্রোফাইল প্রিভিউ"}>
        <p className="mb-3 text-sm font-semibold">{isEn ? "Public Preview" : "অন্যরা যেভাবে দেখবে"}</p>
        <Card className="space-y-3 p-6">
          <UserAvatar name={v.name || user.name} src={v.avatar} className="h-16 w-16 text-xl" />
          <div>
            <p className="text-lg font-semibold">{v.name || user.name}</p>
            {(v.division || v.district || v.area) && (
              <p className="mt-1 flex items-start gap-1.5 text-sm text-ink-secondary"><MapPin className="mt-1 h-4 w-4 shrink-0" aria-hidden />{formatLocation({ division: v.division ?? "", district: v.district ?? "", area: v.area })}</p>
            )}
          </div>
          {v.bio?.trim() ? <p className="whitespace-pre-line break-words text-ink-secondary">{v.bio}</p> : <p className="text-sm text-ink-secondary">{isEn ? "No bio provided." : "কোনো পরিচিতি লেখা হয়নি।"}</p>}
        </Card>
        <Label className="sr-only">Preview end</Label>
      </aside>
    </form>
  );
}
