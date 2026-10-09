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
import { useLangStore } from "@/store/lang-store";
import type { AdvisorRequest } from "@/types";

const ALL = "all"; // Radix Select can't use "" as a value

interface AdvisorFormProps {
  loading: boolean;
  defaultBudget?: number;
  onSubmit: (request: AdvisorRequest) => void;
}

export function AdvisorForm({ loading, defaultBudget, onSubmit }: AdvisorFormProps) {
  const lang = useLangStore((s) => s.lang);

  const schema = z.object({
    budget: z
      .string()
      .min(1, lang === "en" ? "Enter your budget amount" : "বাজেটের পরিমাণ লিখুন")
      .refine(
        (v) => parseAmount(v) >= MIN_BUDGET,
        lang === "en" ? "Minimum budget is ৳ 1,000" : "কমপক্ষে ১,০০০ টাকা লিখুন"
      )
      .refine(
        (v) => !(parseAmount(v) > MAX_BUDGET),
        lang === "en" ? "Maximum budget is ৳ 1 Crore" : "সর্বোচ্চ ১ কোটি টাকা লিখতে পারবেন"
      ),
    division: z.string(),
    district: z.string(),
    area: z.string().max(80, lang === "en" ? "Max 80 characters" : "সর্বোচ্চ ৮০ অক্ষর"),
    category: z.string(),
  });

  type FormValues = z.infer<typeof schema>;

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
      <h2 className="text-xl font-semibold leading-snug md:text-2xl">
        {lang === "en" ? "Enter Your Budget & Get Ideas" : "আপনার বাজেট বলুন, ব্যবসার আইডিয়া নিন"}
      </h2>
      <p className="mt-2 text-sm text-ink-secondary">
        {lang === "en"
          ? "Specifying location makes advice more accurate."
          : "এলাকা জানালে পরামর্শ আরও নির্ভুল হয়।"}
      </p>

      <form onSubmit={submit} noValidate className="mt-6 space-y-5">
        <div className="space-y-3">
          <FormField
            label={lang === "en" ? "Budget" : "বাজেট"}
            htmlFor="advisor-budget"
            required
            error={errors.budget?.message}
            hint={
              Number.isFinite(budgetValue) && budgetValue >= MIN_BUDGET
                ? lang === "en"
                  ? `You entered: ${formatBDT(budgetValue, "en")}`
                  : `আপনি লিখেছেন: ${formatBDT(budgetValue, "bn")}`
                : undefined
            }
          >
            <div className="relative">
              <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 font-medium text-ink-secondary" aria-hidden>৳</span>
              <Input
                id="advisor-budget"
                inputMode="numeric"
                autoComplete="off"
                placeholder={lang === "en" ? "e.g. 10000" : "যেমন: ১০০০০"}
                className="pl-8"
                invalid={!!errors.budget}
                {...register("budget")}
              />
            </div>
          </FormField>

          <div className="flex flex-wrap gap-2" role="group" aria-label={lang === "en" ? "Quick Budgets" : "দ্রুত বাজেট"}>
            {QUICK_BUDGETS.map((b) => {
              const active = budgetValue === b.value;
              const label = lang === "en" ? b.labelEn : b.labelBn;
              return (
                <button
                  key={b.value}
                  type="button"
                  aria-pressed={active}
                  onClick={() => setValue("budget", String(b.value), { shouldValidate: true })}
                  className={cn(
                    "rounded-lg border px-3 py-1.5 text-sm font-medium transition-colors",
                    active ? "border-primary bg-primary-soft text-primary-soft-foreground" : "border-border bg-surface hover:bg-muted"
                  )}
                >
                  {label}
                </button>
              );
            })}
          </div>
        </div>

        <FormField label={lang === "en" ? "Division" : "বিভাগ"} htmlFor="advisor-division">
          <Controller
            control={control}
            name="division"
            render={({ field }) => (
              <Select value={field.value} onValueChange={(v) => { field.onChange(v); setValue("district", ALL); }}>
                <SelectTrigger id="advisor-division"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value={ALL}>{lang === "en" ? "All Divisions" : "সব বিভাগ"}</SelectItem>
                  {DIVISIONS.map((d) => (
                    <SelectItem key={d.value} value={d.value}>
                      {lang === "en" ? d.value : d.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          />
        </FormField>

        <FormField label={lang === "en" ? "District" : "জেলা"} htmlFor="advisor-district">
          <Controller
            control={control}
            name="district"
            render={({ field }) => (
              <Select value={field.value} onValueChange={field.onChange} disabled={division === ALL}>
                <SelectTrigger id="advisor-district"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value={ALL}>{lang === "en" ? "All Districts" : "সব জেলা"}</SelectItem>
                  {districts.map((d) => (
                    <SelectItem key={d.value} value={d.value}>
                      {lang === "en" ? d.value : d.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          />
        </FormField>

        <FormField label={lang === "en" ? "Area / Upazila" : "এলাকা"} htmlFor="advisor-area" error={errors.area?.message}>
          <Input
            id="advisor-area"
            placeholder={lang === "en" ? "e.g. Mirpur, Uttara" : "যেমন: মিরপুর, উত্তরা"}
            maxLength={80}
            autoComplete="off"
            list={suggestAreas ? "dhaka-areas" : undefined}
            invalid={!!errors.area}
            {...register("area")}
          />
          {suggestAreas && <datalist id="dhaka-areas">{DHAKA_AREAS.map((a) => <option key={a} value={a} />)}</datalist>}
        </FormField>

        <FormField label={lang === "en" ? "Category (Optional)" : "আগ্রহের ক্যাটাগরি (ঐচ্ছিক)"} htmlFor="advisor-category">
          <Controller
            control={control}
            name="category"
            render={({ field }) => (
              <Select value={field.value} onValueChange={field.onChange}>
                <SelectTrigger id="advisor-category"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value={ALL}>{lang === "en" ? "Any Category" : "যেকোনো ক্যাটাগরি"}</SelectItem>
                  {CATEGORIES.map((c) => (
                    <SelectItem key={c.slug} value={c.slug}>
                      {lang === "en" ? c.nameEn : c.nameBn}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          />
        </FormField>

        <Button type="submit" size="lg" className="w-full" loading={loading}>
          {!loading && <Sparkles aria-hidden />}
          {loading
            ? lang === "en" ? "Searching..." : "খোঁজা হচ্ছে…"
            : lang === "en" ? "Get Advice" : "পরামর্শ নিন"}
        </Button>
      </form>
    </Card>
  );
}
