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
import { useLangStore } from "@/store/lang-store";

const schema = z.object({
  name: z.string().trim().min(2, "Name is required").max(80, "Name is too long"),
  email: z.string().min(1, "Email is required").email("Enter a valid email address"),
  subject: z.string().trim().min(3, "Subject is required").max(100, "Subject maximum 100 characters"),
  message: z.string().trim().min(10, "Message must be at least 10 characters").max(2000, "Message maximum 2000 characters"),
  website: z.string().optional(),
});
type FormValues = z.infer<typeof schema>;

export function ContactForm() {
  const lang = useLangStore((s) => s.lang);
  const { register, handleSubmit, reset, formState: { errors } } = useForm<FormValues>({ resolver: zodResolver(schema) });

  const { mutate, isPending } = useMutation({
    mutationFn: (v: FormValues) => api.post("/contact", v),
    onSuccess: () => {
      toast.success(lang === "en" ? "Your message has been sent. Thank you!" : "আপনার বার্তা পাঠানো হয়েছে। ধন্যবাদ!");
      reset();
    },
    onError: (e) => toast.error(getErrorMessage(e)),
  });

  const onSubmit = handleSubmit((values) => {
    if (values.website) {
      toast.success(lang === "en" ? "Your message has been sent. Thank you!" : "আপনার বার্তা পাঠানো হয়েছে। ধন্যবাদ!");
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
            <FormField label={lang === "en" ? "Full Name" : "নাম"} htmlFor="c-name" required error={errors.name?.message}>
              <Input id="c-name" autoComplete="name" invalid={!!errors.name} placeholder={lang === "en" ? "e.g. Rahim Uddin" : "যেমন: রহিম উদ্দিন"} {...register("name")} />
            </FormField>
            <FormField label={lang === "en" ? "Email Address" : "ইমেইল"} htmlFor="c-email" required error={errors.email?.message}>
              <Input id="c-email" type="email" autoComplete="email" invalid={!!errors.email} placeholder="name@example.com" {...register("email")} />
            </FormField>
          </div>
          <FormField label={lang === "en" ? "Subject" : "বিষয়"} htmlFor="c-subject" required error={errors.subject?.message}>
            <Input id="c-subject" invalid={!!errors.subject} placeholder={lang === "en" ? "How can we help?" : "কীভাবে সাহায্য করতে পারি?"} {...register("subject")} />
          </FormField>
          <FormField label={lang === "en" ? "Message" : "বার্তা"} htmlFor="c-message" required error={errors.message?.message}>
            <Textarea id="c-message" className="min-h-[150px]" invalid={!!errors.message} placeholder={lang === "en" ? "Write your inquiry or feedback here..." : "আপনার প্রশ্ন বা পরামর্শ এখানে লিখুন..."} {...register("message")} />
          </FormField>

          <div aria-hidden className="absolute -left-[9999px] h-0 w-0 overflow-hidden">
            <label>Website<input type="text" tabIndex={-1} autoComplete="off" {...register("website")} /></label>
          </div>

          <Button type="submit" size="lg" loading={isPending}>
            {!isPending && <Send className="mr-2 h-4 w-4" aria-hidden />}
            {lang === "en" ? "Send Message" : "বার্তা পাঠান"}
          </Button>
        </form>
      </Card>

      <Card className="h-fit space-y-5 p-6">
        <h3 className="text-lg font-semibold">{lang === "en" ? "Direct Contact" : "সরাসরি যোগাযোগ"}</h3>
        <ul className="space-y-4 text-ink-secondary">
          <li className="flex gap-3"><Mail className="mt-1 h-4 w-4 shrink-0" aria-hidden /><a href={`mailto:${CONTACT.email}`} className="break-all hover:text-foreground">{CONTACT.email}</a></li>
          <li className="flex gap-3"><Phone className="mt-1 h-4 w-4 shrink-0 text-green" aria-hidden /><a href={`tel:${CONTACT.phone.replace(/[^\d+]/g, "")}`} className="hover:text-green hover:underline font-mono">{lang === "bn" ? CONTACT.phoneBn : CONTACT.phone}</a></li>
          <li className="flex gap-3"><MapPin className="mt-1 h-4 w-4 shrink-0" aria-hidden /><span>{lang === "bn" ? CONTACT.addressBn : CONTACT.address}</span></li>
        </ul>
      </Card>
    </div>
  );
}
