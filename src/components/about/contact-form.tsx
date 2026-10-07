"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { Mail, MapPin, Phone, Send } from "lucide-react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { FormField } from "@/components/ui/form-field";
import { Input, Textarea } from "@/components/ui/input";
import { api, getErrorMessage } from "@/lib/api";
import { CONTACT } from "@/lib/constants";

const schema = z.object({
  name: z.string().trim().min(2, "আপনার নাম লিখুন").max(80, "নাম অনেক বড় হয়ে গেছে"),
  email: z.string().min(1, "ইমেইল ঠিকানা দিন").email("সঠিক ইমেইল ঠিকানা দিন"),
  subject: z.string().trim().min(3, "বিষয় লিখুন").max(100, "বিষয় সর্বোচ্চ ১০০ অক্ষরের হতে পারবে"),
  message: z.string().trim().min(10, "কমপক্ষে ১০ অক্ষরের বার্তা লিখুন").max(2000, "বার্তা সর্বোচ্চ ২০০০ অক্ষরের হতে পারবে"),
  website: z.string().optional(), // honeypot: real people never see or fill this
});
type FormValues = z.infer<typeof schema>;

export function ContactForm() {
  const { register, handleSubmit, reset, formState: { errors } } = useForm<FormValues>({ resolver: zodResolver(schema) });

  const { mutate, isPending } = useMutation({
    mutationFn: (v: FormValues) => api.post("/contact", v),
    onSuccess: () => {
      toast.success("আপনার বার্তা পাঠানো হয়েছে। ধন্যবাদ!");
      reset();
    },
    onError: (e) => toast.error(getErrorMessage(e)),
  });

  const onSubmit = handleSubmit((values) => {
    if (values.website) {
      // A bot filled the hidden field: pretend it worked, send nothing.
      toast.success("আপনার বার্তা পাঠানো হয়েছে। ধন্যবাদ!");
      reset();
      return;
    }
    mutate(values);
  });

  return (
    <div className="grid gap-8 lg:grid-cols-[1fr_20rem]">
      <Card className="p-6 md:p-8">
        <form onSubmit={onSubmit} noValidate className="space-y-5">
          <div className="grid gap-5 sm:grid-cols-2">
            <FormField label="নাম" htmlFor="c-name" required error={errors.name?.message}>
              <Input id="c-name" autoComplete="name" invalid={!!errors.name} {...register("name")} />
            </FormField>
            <FormField label="ইমেইল" htmlFor="c-email" required error={errors.email?.message}>
              <Input id="c-email" type="email" autoComplete="email" invalid={!!errors.email} {...register("email")} />
            </FormField>
          </div>
          <FormField label="বিষয়" htmlFor="c-subject" required error={errors.subject?.message}>
            <Input id="c-subject" invalid={!!errors.subject} {...register("subject")} />
          </FormField>
          <FormField label="বার্তা" htmlFor="c-message" required error={errors.message?.message}>
            <Textarea id="c-message" className="min-h-[150px]" invalid={!!errors.message} {...register("message")} />
          </FormField>

          <div aria-hidden className="absolute -left-[9999px] h-0 w-0 overflow-hidden">
            <label>Website<input type="text" tabIndex={-1} autoComplete="off" {...register("website")} /></label>
          </div>

          <Button type="submit" size="lg" loading={isPending}>{!isPending && <Send aria-hidden />}বার্তা পাঠান</Button>
        </form>
      </Card>

      <Card className="h-fit space-y-5 p-6">
        <h3 className="text-lg font-semibold">সরাসরি যোগাযোগ</h3>
        <ul className="space-y-4 text-ink-secondary">
          <li className="flex gap-3"><Mail className="mt-1 h-4 w-4 shrink-0" aria-hidden /><a href={`mailto:${CONTACT.email}`} className="break-all hover:text-foreground">{CONTACT.email}</a></li>
          <li className="flex gap-3"><Phone className="mt-1 h-4 w-4 shrink-0" aria-hidden /><span>{CONTACT.phone}</span></li>
          <li className="flex gap-3"><MapPin className="mt-1 h-4 w-4 shrink-0" aria-hidden /><span>{CONTACT.address}</span></li>
        </ul>
      </Card>
    </div>
  );
}
