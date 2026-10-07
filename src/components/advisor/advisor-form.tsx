"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Sparkles } from "lucide-react";
import { Controller, useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { FormField } from "@/components/ui/form-field";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { DHAKA_AREAS, DIVISIONS, getDistricts } from "@/lib/bd-data";
import { MAX_BUDGET, MIN_BUDGET, QUICK_BUDGETS, parseAmount } from "@/lib/advisor";
import { CATEGORIES } from "@/lib/constants";
import { cn, formatBDT } from "@/lib/utils";
import type { AdvisorRequest } from "@/types";

const ALL = "all"; // Radix Select can't use "" as a value

const schema = z.object({
  budget: z
    .string()
    .min(1, "বাজেটের পরিমাণ লিখুন")
    .refine((v) => parseAmount(v) >= MIN_BUDGET, "কমপক্ষে ১,০০০ টাকা লিখুন")
    .refine((v) => !(parseAmount(v) > MAX_BUDGET), "সর্বোচ্চ ১ কোটি টাকা লিখতে পারবেন"),
  division: z.string(),
  district: z.string(),
  area: z.string().max(80, "সর্বোচ্চ ৮০ অক্ষর"),
  category: z.string(),
});
type FormValues = z.infer<typeof schema>;

interface AdvisorFormProps {
  loading: boolean;
  defaultBudget?: number;
  onSubmit: (request: AdvisorRequest) => void;
}

export function AdvisorForm({ loading, defaultBudget, onSubmit }: AdvisorFormProps) {
  const { register, control, handleSubmit, setValue, watch, formState: { errors } } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { budget: defaultBudget ? String(defaultBudget) : "", division: ALL, district: ALL, area: "", category: ALL },
  });

  const budgetText = watch("budget");
  const division = watch("division");
  const district = watch("district");
  const budgetValue = parseAmount(budgetText ?? "");
  const districts = getDistricts(division);
  const suggestAreas = division === "Dhaka" && district === "Dhaka"; // area suggestions only exist for Dhaka city

  const submit = handleSubmit((v) =>
    onSubmit({
      budget: parseAmount(v.budget),
      division: v.division !== ALL ? v.division : undefined,
      district: v.district !== ALL ? v.district : undefined,
      area: v.area.trim() || undefined,
      category: v.category !== ALL ? v.category : undefined,
    }),
  );

  return (
    <Card className="p-6 lg:sticky lg:top-24">
      <h2 className="text-xl font-semibold leading-snug md:text-2xl">আপনার বাজেট বলুন, ব্যবসার আইডিয়া নিন</h2>
      <p className="mt-2 text-sm text-ink-secondary">এলাকা জানালে পরামর্শ আরও নির্ভুল হয়।</p>

      <form onSubmit={submit} noValidate className="mt-6 space-y-5">
        <div className="space-y-3">
          <FormField label="বাজেট" htmlFor="advisor-budget" required error={errors.budget?.message}
            hint={Number.isFinite(budgetValue) && budgetValue >= MIN_BUDGET ? `আপনি লিখেছেন: ${formatBDT(budgetValue)}` : undefined}>
            <div className="relative">
              <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 font-medium text-ink-secondary" aria-hidden>৳</span>
              <Input id="advisor-budget" inputMode="numeric" autoComplete="off" placeholder="যেমন: ১০০০০" className="pl-8"
                invalid={!!errors.budget} {...register("budget")} />
            </div>
          </FormField>

          <div className="flex flex-wrap gap-2" role="group" aria-label="দ্রুত বাজেট">
            {QUICK_BUDGETS.map((b) => {
              const active = budgetValue === b.value;
              return (
                <button key={b.value} type="button" aria-pressed={active}
                  onClick={() => setValue("budget", String(b.value), { shouldValidate: true })}
                  className={cn("rounded-lg border px-3 py-1.5 text-sm font-medium transition-colors",
                    active ? "border-primary bg-primary-soft text-primary-soft-foreground" : "border-border bg-surface hover:bg-muted")}>
                  {b.label}
                </button>
              );
            })}
          </div>
        </div>

        <FormField label="বিভাগ" htmlFor="advisor-division">
          <Controller control={control} name="division" render={({ field }) => (
            <Select value={field.value} onValueChange={(v) => { field.onChange(v); setValue("district", ALL); }}>
              <SelectTrigger id="advisor-division"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value={ALL}>সব বিভাগ</SelectItem>
                {DIVISIONS.map((d) => <SelectItem key={d.value} value={d.value}>{d.label}</SelectItem>)}
              </SelectContent>
            </Select>
          )} />
        </FormField>

        <FormField label="জেলা" htmlFor="advisor-district">
          <Controller control={control} name="district" render={({ field }) => (
            <Select value={field.value} onValueChange={field.onChange} disabled={division === ALL}>
              <SelectTrigger id="advisor-district"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value={ALL}>সব জেলা</SelectItem>
                {districts.map((d) => <SelectItem key={d.value} value={d.value}>{d.label}</SelectItem>)}
              </SelectContent>
            </Select>
          )} />
        </FormField>

        <FormField label="এলাকা" htmlFor="advisor-area" error={errors.area?.message}>
          <Input id="advisor-area" placeholder="যেমন: মিরপুর, উত্তরা" maxLength={80} autoComplete="off"
            list={suggestAreas ? "dhaka-areas" : undefined} invalid={!!errors.area} {...register("area")} />
          {suggestAreas && <datalist id="dhaka-areas">{DHAKA_AREAS.map((a) => <option key={a} value={a} />)}</datalist>}
        </FormField>

        <FormField label="আগ্রহের ক্যাটাগরি (ঐচ্ছিক)" htmlFor="advisor-category">
          <Controller control={control} name="category" render={({ field }) => (
            <Select value={field.value} onValueChange={field.onChange}>
              <SelectTrigger id="advisor-category"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value={ALL}>যেকোনো ক্যাটাগরি</SelectItem>
                {CATEGORIES.map((c) => <SelectItem key={c.slug} value={c.slug}>{c.nameBn}</SelectItem>)}
              </SelectContent>
            </Select>
          )} />
        </FormField>

        <Button type="submit" size="lg" className="w-full" loading={loading}>
          {!loading && <Sparkles aria-hidden />}
          {loading ? "খোঁজা হচ্ছে…" : "পরামর্শ নিন"}
        </Button>
      </form>
    </Card>
  );
}
