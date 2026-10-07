"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { Flag } from "lucide-react";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useRequireAuth } from "@/hooks/use-require-auth";
import { api, getErrorMessage } from "@/lib/api";

const REASONS = [
  { value: "spam", label: "স্প্যাম বা বিজ্ঞাপন" },
  { value: "misleading", label: "ভুল বা বিভ্রান্তিকর তথ্য" },
  { value: "inappropriate", label: "অনুপযুক্ত কনটেন্ট" },
  { value: "other", label: "অন্যান্য" },
] as const;

const schema = z.object({
  reason: z.enum(["spam", "misleading", "inappropriate", "other"], { errorMap: () => ({ message: "একটি কারণ নির্বাচন করুন" }) }),
  details: z.string().max(500, "সর্বোচ্চ ৫০০ অক্ষর লিখতে পারবেন").optional(),
});
type FormValues = z.infer<typeof schema>;

/** Small, subtle link-style button + modal. POST /posts/:id/report { reason, details } */
export function ReportDialog({ postId }: { postId: string }) {
  const [open, setOpen] = useState(false);
  const requireAuth = useRequireAuth();
  const { control, register, handleSubmit, reset, formState: { errors } } = useForm<FormValues>({ resolver: zodResolver(schema) });

  const { mutate, isPending } = useMutation({
    mutationFn: (v: FormValues) => api.post(`/posts/${postId}/report`, v),
    onSuccess: () => {
      toast.success("রিপোর্ট জমা হয়েছে। ধন্যবাদ, আমরা বিষয়টি দেখব।");
      setOpen(false);
      reset();
    },
    onError: (e) => toast.error(getErrorMessage(e)),
  });

  return (
    <>
      <button
        onClick={() => requireAuth("রিপোর্ট করতে লগইন করুন") && setOpen(true)}
        className="inline-flex items-center gap-1.5 rounded text-sm text-ink-secondary transition-colors hover:text-danger"
      >
        <Flag className="h-4 w-4" aria-hidden /> রিপোর্ট করুন
      </button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>পোস্টটি রিপোর্ট করুন</DialogTitle>
            <DialogDescription>কেন এই পোস্টটি সমস্যাজনক মনে হচ্ছে তা জানান।</DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSubmit((v) => mutate(v))} noValidate className="space-y-4">
            <Controller
              control={control}
              name="reason"
              render={({ field }) => (
                <RadioGroup value={field.value ?? ""} onValueChange={field.onChange} aria-label="রিপোর্টের কারণ">
                  {REASONS.map((r) => (
                    <div key={r.value} className="flex items-center gap-2.5">
                      <RadioGroupItem id={`reason-${r.value}`} value={r.value} />
                      <Label htmlFor={`reason-${r.value}`} className="cursor-pointer font-normal">{r.label}</Label>
                    </div>
                  ))}
                </RadioGroup>
              )}
            />
            {errors.reason && <p role="alert" className="text-sm text-danger">{errors.reason.message}</p>}

            <div className="space-y-1.5">
              <Label htmlFor="report-details">বিস্তারিত (ঐচ্ছিক)</Label>
              <Textarea id="report-details" invalid={!!errors.details} maxLength={500} {...register("details")} />
              {errors.details && <p role="alert" className="text-sm text-danger">{errors.details.message}</p>}
            </div>

            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setOpen(false)}>বাতিল</Button>
              <Button type="submit" variant="danger" loading={isPending}>রিপোর্ট জমা দিন</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
}
