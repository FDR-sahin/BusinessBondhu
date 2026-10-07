"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { api, getErrorMessage } from "@/lib/api";
import { useT } from "@/lib/i18n";

const schema = z.object({
  email: z.string().min(1, "ইমেইল ঠিকানা দিন").email("সঠিক ইমেইল ঠিকানা দিন"),
});
type FormValues = z.infer<typeof schema>;

/** Reused in the footer and the Home page CTA (Step 3). POST /newsletter/subscribe { email } */
export function NewsletterForm({ tone = "light" }: { tone?: "light" | "dark" }) {
  const t = useT();
  const { register, handleSubmit, reset, formState: { errors } } = useForm<FormValues>({
    resolver: zodResolver(schema),
  });

  const { mutate, isPending } = useMutation({
    mutationFn: (values: FormValues) => api.post("/newsletter/subscribe", values),
    onSuccess: () => {
      toast.success(t("subscribed"));
      reset();
    },
    onError: (e) => toast.error(getErrorMessage(e)),
  });

  return (
    <form onSubmit={handleSubmit((v) => mutate(v))} noValidate className="w-full max-w-md">
      <div className="flex flex-col gap-2 sm:flex-row">
        <div className="flex-1">
          <Input
            type="email"
            autoComplete="email"
            placeholder={t("emailPlaceholder")}
            aria-label={t("emailPlaceholder")}
            invalid={!!errors.email}
            {...register("email")}
          />
        </div>
        <Button type="submit" variant={tone === "dark" ? "secondary" : "primary"} size="lg" className="h-11 sm:text-sm" loading={isPending}>
          {t("subscribe")}
        </Button>
      </div>
      {errors.email && <p role="alert" className={tone === "dark" ? "mt-1.5 text-sm text-amber-200" : "mt-1.5 text-sm text-danger"}>{errors.email.message}</p>}
    </form>
  );
}
