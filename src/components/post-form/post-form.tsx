"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Save, Send } from "lucide-react";
import { useRouter } from "next/navigation";
import { useMemo, useState, type ReactNode } from "react";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";
import { PostCard } from "@/components/post/post-card";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { FormField } from "@/components/ui/form-field";
import { Input, Textarea } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { parseAmount } from "@/lib/advisor";
import { api, getErrorMessage } from "@/lib/api";
import { getFieldErrors } from "@/lib/auth";
import { DHAKA_AREAS, DIVISIONS, getDistricts } from "@/lib/bd-data";
import { CATEGORIES } from "@/lib/constants";
import { PROFIT_OPTIONS } from "@/lib/explore";
import { EMPTY_POST, postSchema, toPostRequest, type PostFormValues } from "@/lib/post-schema";
import { toBanglaNumber } from "@/lib/utils";
import { useAuthStore } from "@/store/auth-store";
import type { Post } from "@/types";
import { ImageUploader } from "./image-uploader";
import { TagInput } from "./tag-input";

interface PostFormProps {
  mode: "create" | "edit";
  postId?: string;
  initial?: PostFormValues;
}

function Section({ title, description, children }: { title: string; description?: string; children: ReactNode }) {
  return (
    <Card className="space-y-5 p-6">
      <div>
        <h2 className="text-lg font-semibold">{title}</h2>
        {description && <p className="mt-0.5 text-sm text-ink-secondary">{description}</p>}
      </div>
      {children}
    </Card>
  );
}

function PriceField({ id, label, required, error, children }: { id: string; label: string; required?: boolean; error?: string; children: ReactNode }) {
  return (
    <FormField label={label} htmlFor={id} required={required} error={error}>
      <div className="relative">
        <span aria-hidden className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 font-medium text-ink-secondary">৳</span>
        {children}
      </div>
    </FormField>
  );
}

export function PostForm({ mode, postId, initial }: PostFormProps) {
  const router = useRouter();
  const qc = useQueryClient();
  const user = useAuthStore((s) => s.user);
  const [uploading, setUploading] = useState(false);

  const { register, control, handleSubmit, setValue, setError, getValues, trigger, watch, formState: { errors } } = useForm<PostFormValues>({
    resolver: zodResolver(postSchema),
    defaultValues: initial ?? EMPTY_POST,
  });

  const v = watch(); // powers the live preview + counters
  const districts = getDistricts(v.division);
  const dhakaCity = v.division === "Dhaka" && v.district === "Dhaka";

  const { mutate, isPending, variables } = useMutation({
    mutationFn: ({ values, status }: { values: PostFormValues; status: "draft" | "pending" }) => {
      const body = toPostRequest(values, status);
      return mode === "create" ? api.post("/posts", body) : api.put(`/posts/${postId}`, body);
    },
    onSuccess: (_r, { status }) => {
      toast.success(status === "draft" ? "খসড়া সেভ হয়েছে" : mode === "create" ? "পোস্ট জমা হয়েছে। পর্যালোচনার পর প্রকাশ করা হবে।" : "পোস্ট আপডেট হয়েছে");
      void qc.invalidateQueries({ queryKey: ["my-posts"] });
      void qc.invalidateQueries({ queryKey: ["me", "overview"] });
      router.push("/dashboard/my-posts");
    },
    onError: (e) => {
      // Field messages from the API land under the right inputs; anything else becomes a toast.
      const fields = getFieldErrors(e);
      const known = Object.keys(fields).filter((k) => k in EMPTY_POST);
      known.forEach((k) => setError(k as keyof PostFormValues, { message: fields[k] }));
      if (known.length === 0) toast.error(getErrorMessage(e));
    },
  });

  const submitting = (s: "draft" | "pending") => isPending && variables?.status === s;

  /** Draft = only a title is mandatory, so people can save half-finished work. */
  async function saveDraft() {
    if (!(await trigger("title"))) return;
    mutate({ values: getValues(), status: "draft" });
  }

  // Live preview: a throwaway Post built from what's typed so far.
  const preview = useMemo<Post>(() => ({
    id: "preview",
    title: v.title.trim() || "আপনার পোস্টের শিরোনাম",
    image: v.image,
    category: v.category,
    division: v.division,
    district: v.district,
    area: v.area.trim() || undefined,
    wholesalePrice: Number.isFinite(parseAmount(v.wholesalePrice)) ? parseAmount(v.wholesalePrice) : 0,
    retailPrice: Number.isFinite(parseAmount(v.retailPrice)) ? parseAmount(v.retailPrice) : 0,
    profitPotential: v.profitPotential,
    author: { id: user?.id ?? "me", name: user?.name ?? "আপনি", avatar: user?.avatar },
    likesCount: 0, dislikesCount: 0, commentsCount: 0, viewsCount: 0,
    createdAt: new Date().toISOString(),
  }), [v.title, v.image, v.category, v.division, v.district, v.area, v.wholesalePrice, v.retailPrice, v.profitPotential, user]);

  const descLen = Array.from(v.description.trim()).length;

  return (
    <form onSubmit={handleSubmit((values) => mutate({ values, status: "pending" }))} noValidate className="grid items-start gap-8 lg:grid-cols-[minmax(0,1fr)_21rem]">
      <div className="space-y-6">
        {mode === "edit" && <p className="rounded-lg border border-border bg-surface px-4 py-3 text-sm text-ink-secondary">সম্পাদনার পর পোস্টটি আবার পর্যালোচনার জন্য পাঠানো হতে পারে।</p>}

        <Section title="মূল তথ্য">
          <FormField label="শিরোনাম" htmlFor="p-title" required error={errors.title?.message}>
            <Input id="p-title" maxLength={120} placeholder="যেমন: মিরপুরে ফ্রোজেন ফুডের ছোট দোকান" invalid={!!errors.title} {...register("title")} />
          </FormField>
          <FormField label="ব্যবসার ক্যাটাগরি" htmlFor="p-category" required error={errors.category?.message}>
            <Controller control={control} name="category" render={({ field }) => (
              <Select value={field.value} onValueChange={field.onChange}>
                <SelectTrigger id="p-category" invalid={!!errors.category}><SelectValue placeholder="ক্যাটাগরি বেছে নিন" /></SelectTrigger>
                <SelectContent>{CATEGORIES.map((c) => <SelectItem key={c.slug} value={c.slug}>{c.nameBn}</SelectItem>)}</SelectContent>
              </Select>
            )} />
          </FormField>
        </Section>

        <Section title="এলাকা" description="যে এলাকার তথ্য শেয়ার করছেন">
          <div className="grid gap-5 sm:grid-cols-2">
            <FormField label="বিভাগ" htmlFor="p-division" required error={errors.division?.message}>
              <Controller control={control} name="division" render={({ field }) => (
                <Select value={field.value} onValueChange={(val) => { field.onChange(val); setValue("district", ""); }}>
                  <SelectTrigger id="p-division" invalid={!!errors.division}><SelectValue placeholder="বিভাগ বেছে নিন" /></SelectTrigger>
                  <SelectContent>{DIVISIONS.map((d) => <SelectItem key={d.value} value={d.value}>{d.label}</SelectItem>)}</SelectContent>
                </Select>
              )} />
            </FormField>
            <FormField label="জেলা" htmlFor="p-district" required error={errors.district?.message}>
              <Controller control={control} name="district" render={({ field }) => (
                <Select value={field.value} onValueChange={field.onChange} disabled={!v.division}>
                  <SelectTrigger id="p-district" invalid={!!errors.district}><SelectValue placeholder="জেলা বেছে নিন" /></SelectTrigger>
                  <SelectContent>{districts.map((d) => <SelectItem key={d.value} value={d.value}>{d.label}</SelectItem>)}</SelectContent>
                </Select>
              )} />
            </FormField>
          </div>
          <FormField label="এলাকা" htmlFor="p-area" error={errors.area?.message}>
            <Input id="p-area" maxLength={80} autoComplete="off" placeholder="যেমন: মিরপুর ১০" list={dhakaCity ? "p-dhaka-areas" : undefined} invalid={!!errors.area} {...register("area")} />
            {dhakaCity && <datalist id="p-dhaka-areas">{DHAKA_AREAS.map((a) => <option key={a} value={a} />)}</datalist>}
          </FormField>
        </Section>

        <Section title="দাম ও লাভ">
          <div className="grid gap-5 sm:grid-cols-3">
            <PriceField id="p-wholesale" label="পাইকারি দাম" required error={errors.wholesalePrice?.message}>
              <Input id="p-wholesale" inputMode="numeric" autoComplete="off" className="pl-8" invalid={!!errors.wholesalePrice} {...register("wholesalePrice")} />
            </PriceField>
            <PriceField id="p-retail" label="খুচরা দাম" required error={errors.retailPrice?.message}>
              <Input id="p-retail" inputMode="numeric" autoComplete="off" className="pl-8" invalid={!!errors.retailPrice} {...register("retailPrice")} />
            </PriceField>
            <PriceField id="p-sell" label="রিটেইল সেল দাম" error={errors.retailSellPrice?.message}>
              <Input id="p-sell" inputMode="numeric" autoComplete="off" className="pl-8" invalid={!!errors.retailSellPrice} {...register("retailSellPrice")} />
            </PriceField>
          </div>

          <fieldset>
            <legend className="mb-2 text-sm font-medium">লাভের সম্ভাবনা</legend>
            <Controller control={control} name="profitPotential" render={({ field }) => (
              <RadioGroup value={field.value} onValueChange={field.onChange} className="grid grid-cols-3 gap-3">
                {PROFIT_OPTIONS.map((o) => (
                  <Label key={o.value} htmlFor={`p-profit-${o.value}`} className="flex cursor-pointer items-center gap-2.5 rounded-lg border border-border bg-surface p-3 font-normal transition-colors has-[[data-state=checked]]:border-primary has-[[data-state=checked]]:bg-primary-soft">
                    <RadioGroupItem id={`p-profit-${o.value}`} value={o.value} />
                    {o.label}
                  </Label>
                ))}
              </RadioGroup>
            )} />
            {errors.profitPotential && <p role="alert" className="mt-1.5 text-sm text-danger">{errors.profitPotential.message}</p>}
          </fieldset>
        </Section>

        <Section title="বিবরণ ও ছবি">
          <FormField label="বিবরণ" htmlFor="p-desc" required error={errors.description?.message}>
            <Textarea id="p-desc" className="min-h-[180px]" maxLength={5000} placeholder="ব্যবসাটি কী, কোথা থেকে মাল কেনা যায়, কত পুঁজি লাগে, কী কী সতর্কতা দরকার — বিস্তারিত লিখুন।" invalid={!!errors.description} {...register("description")} />
            <p className={`text-right text-sm ${descLen < 50 ? "text-ink-secondary" : "text-success-soft-foreground"}`} aria-live="polite">
              {toBanglaNumber(descLen)} / ন্যূনতম {toBanglaNumber(50)} অক্ষর
            </p>
          </FormField>

          <FormField label="ট্যাগ" htmlFor="p-tags" hint="সর্বোচ্চ ৮টি। Enter বা কমা দিয়ে যোগ করুন।" error={errors.tags?.message}>
            <Controller control={control} name="tags" render={({ field }) => <TagInput id="p-tags" value={field.value} onChange={field.onChange} invalid={!!errors.tags} />} />
          </FormField>

          <div className="space-y-1.5">
            <Label>ছবি</Label>
            <Controller control={control} name="image" render={({ field }) => <ImageUploader value={field.value} onChange={field.onChange} onBusyChange={setUploading} />} />
          </div>
        </Section>

        {/* Action bar */}
        <div className="flex flex-wrap items-center justify-end gap-3">
          <Button type="button" variant="outline" size="lg" onClick={() => void saveDraft()} loading={submitting("draft")} disabled={isPending || uploading}>
            {!submitting("draft") && <Save aria-hidden />}খসড়া সেভ করুন
          </Button>
          <Button type="submit" size="lg" loading={submitting("pending")} disabled={isPending || uploading}>
            {!submitting("pending") && <Send aria-hidden />}{mode === "create" ? "পোস্ট জমা দিন" : "আপডেট করুন"}
          </Button>
        </div>
        {uploading && <p className="text-right text-sm text-ink-secondary" role="status">ছবি আপলোড শেষ হলে জমা দিতে পারবেন…</p>}
      </div>

      {/* Live preview (desktop) */}
      <aside className="hidden lg:block" aria-label="লাইভ প্রিভিউ">
        <div className="sticky top-24 space-y-3">
          <p className="text-sm font-semibold">লাইভ প্রিভিউ</p>
          <div className="pointer-events-none select-none" aria-hidden><PostCard post={preview} /></div>
          <p className="text-sm text-ink-secondary">পোস্টটি প্রকাশ হলে এভাবেই দেখাবে।</p>
        </div>
      </aside>
    </form>
  );
}
