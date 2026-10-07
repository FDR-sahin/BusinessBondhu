"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { MapPin, Save } from "lucide-react";
import { useMemo, useState } from "react";
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
import type { User } from "@/types";
import { FormAlert } from "@/components/auth/form-alert";
import { AvatarUploader } from "./avatar-uploader";

const toValues = (u: User): ProfileValues => ({
  name: u.name, bio: u.bio ?? "", division: u.division ?? "", district: u.district ?? "", area: u.area ?? "", avatar: u.avatar,
});

export function ProfileView() {
  const user = useAuthStore((s) => s.user);
  const setUser = useAuthStore((s) => s.setUser);
  const [uploading, setUploading] = useState(false);

  const values = useMemo(() => (user ? toValues(user) : undefined), [user]);
  const { register, control, handleSubmit, setValue, setError, watch, reset, formState: { errors, isDirty } } = useForm<ProfileValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: values,
    values, // fills the form when /auth/me finishes loading
    resetOptions: { keepDirtyValues: true }, // …without wiping what the user already typed
  });

  const v = watch();
  const districts = getDistricts(v.division ?? "");

  const { mutate, isPending, error } = useMutation({
    mutationFn: async (body: ProfileValues) => (await api.put<{ user: User }>("/me/profile", body)).data.user,
    onSuccess: (updated) => {
      setUser(updated);
      reset(toValues(updated));
      toast.success("প্রোফাইল আপডেট হয়েছে");
    },
    onError: (e) => {
      const fields = getFieldErrors(e);
      Object.keys(fields).forEach((k) => k in profileSchema.shape && setError(k as keyof ProfileValues, { message: fields[k] }));
    },
  });

  if (!user) return <div role="status" aria-label="লোড হচ্ছে" className="space-y-4"><Skeleton className="h-40 rounded-2xl" /><Skeleton className="h-72 rounded-2xl" /></div>;

  return (
    <form onSubmit={handleSubmit((body) => mutate(body))} noValidate className="grid items-start gap-8 lg:grid-cols-[minmax(0,1fr)_20rem]">
      <div className="space-y-6">
        <Card className="space-y-5 p-6">
          <h2 className="text-lg font-semibold">প্রোফাইল ছবি</h2>
          <Controller control={control} name="avatar" render={({ field }) => (
            <AvatarUploader name={v.name} value={field.value} onChange={(url) => field.onChange(url)} onBusyChange={setUploading} />
          )} />
        </Card>

        <Card className="space-y-5 p-6">
          <h2 className="text-lg font-semibold">ব্যক্তিগত তথ্য</h2>
          <FormAlert message={error && Object.keys(getFieldErrors(error)).length === 0 ? authErrorMessage(error, "signup") : null} />

          <FormField label="নাম" htmlFor="pf-name" required error={errors.name?.message}>
            <Input id="pf-name" autoComplete="name" invalid={!!errors.name} {...register("name")} />
          </FormField>

          <FormField label="ইমেইল" htmlFor="pf-email" hint="ইমেইল বদলাতে সেটিংস পেজ ব্যবহার করুন।">
            <Input id="pf-email" value={user.email} readOnly aria-readonly className="bg-muted" />
          </FormField>

          <FormField label="সংক্ষিপ্ত পরিচিতি" htmlFor="pf-bio" error={errors.bio?.message}>
            <Textarea id="pf-bio" maxLength={300} className="min-h-[110px]" placeholder="আপনার ব্যবসা বা আগ্রহ সম্পর্কে দুই-এক লাইন লিখুন।" invalid={!!errors.bio} {...register("bio")} />
            <p className="text-right text-sm text-ink-secondary">{(v.bio ?? "").length} / ৩০০</p>
          </FormField>
        </Card>

        <Card className="space-y-5 p-6">
          <h2 className="text-lg font-semibold">এলাকা</h2>
          <div className="grid gap-5 sm:grid-cols-2">
            <FormField label="বিভাগ" htmlFor="pf-division">
              <Controller control={control} name="division" render={({ field }) => (
                <Select value={field.value || undefined} onValueChange={(val) => { field.onChange(val); setValue("district", "", { shouldDirty: true }); }}>
                  <SelectTrigger id="pf-division"><SelectValue placeholder="বিভাগ বেছে নিন" /></SelectTrigger>
                  <SelectContent>{DIVISIONS.map((d) => <SelectItem key={d.value} value={d.value}>{d.label}</SelectItem>)}</SelectContent>
                </Select>
              )} />
            </FormField>
            <FormField label="জেলা" htmlFor="pf-district">
              <Controller control={control} name="district" render={({ field }) => (
                <Select value={field.value || undefined} onValueChange={field.onChange} disabled={!v.division}>
                  <SelectTrigger id="pf-district"><SelectValue placeholder="জেলা বেছে নিন" /></SelectTrigger>
                  <SelectContent>{districts.map((d) => <SelectItem key={d.value} value={d.value}>{d.label}</SelectItem>)}</SelectContent>
                </Select>
              )} />
            </FormField>
          </div>
          <FormField label="এলাকা" htmlFor="pf-area" error={errors.area?.message}>
            <Input id="pf-area" maxLength={80} autoComplete="off" placeholder="যেমন: মিরপুর ১০" invalid={!!errors.area} {...register("area")} />
          </FormField>
        </Card>

        <div className="flex justify-end">
          <Button type="submit" size="lg" loading={isPending} disabled={!isDirty || uploading}>{!isPending && <Save aria-hidden />}পরিবর্তন সেভ করুন</Button>
        </div>
      </div>

      {/* How other members will see you */}
      <aside className="lg:sticky lg:top-24" aria-label="প্রোফাইল প্রিভিউ">
        <p className="mb-3 text-sm font-semibold">অন্যরা যেভাবে দেখবে</p>
        <Card className="space-y-3 p-6">
          <UserAvatar name={v.name || user.name} src={v.avatar} className="h-16 w-16 text-xl" />
          <div>
            <p className="text-lg font-semibold">{v.name || user.name}</p>
            {(v.division || v.district || v.area) && (
              <p className="mt-1 flex items-start gap-1.5 text-sm text-ink-secondary"><MapPin className="mt-1 h-4 w-4 shrink-0" aria-hidden />{formatLocation({ division: v.division ?? "", district: v.district ?? "", area: v.area })}</p>
            )}
          </div>
          {v.bio?.trim() ? <p className="whitespace-pre-line break-words text-ink-secondary">{v.bio}</p> : <p className="text-sm text-ink-secondary">কোনো পরিচিতি লেখা হয়নি।</p>}
        </Card>
        <Label className="sr-only">প্রিভিউ শেষ</Label>
      </aside>
    </form>
  );
}
