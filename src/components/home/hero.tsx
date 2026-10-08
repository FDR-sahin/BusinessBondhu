"use client";

import Link from "next/link";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useT } from "@/lib/i18n";
import { useLangStore } from "@/store/lang-store";

export function Hero() {
  const t = useT();
  const lang = useLangStore((s) => s.lang);

  return (
    <section className="relative pt-10 pb-8 md:pt-16 md:pb-12 text-center">
      <div className="container-page max-w-[900px] mx-auto flex flex-col items-center justify-center">
        {/* Centered Headline */}
        <h1 className="font-display text-[clamp(36px,5.2vw,64px)] font-bold leading-[1.2] :lang(bn):leading-[1.28] text-ink tracking-tight text-center">
          {lang === "bn" ? (
            <>
              <div>হাতে সামান্য পুঁজি।</div>
              <div>মাথায় বড় আইডিয়া।</div>
              <div>খুঁজে নিন নিজের ব্যবসা।</div>
            </>
          ) : (
            <>
              <div>Small capital.</div>
              <div>Big ideas.</div>
              <div>Find your business.</div>
            </>
          )}
        </h1>

        {/* Centered CTA Buttons */}
        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          <Button asChild size="lg" className="h-12 bg-green text-white hover:bg-green/90 px-6 text-base font-semibold shadow-sm">
            <Link href="/dashboard/create-post">
              <Plus className="mr-1.5 h-5 w-5" />
              {t("shareIdea")}
            </Link>
          </Button>

          <Button asChild variant="outline" size="lg" className="h-12 border-line text-ink hover:bg-surface px-6 text-base font-medium shadow-2xs">
            <Link href="/explore">
              {lang === "bn" ? "আইডিয়া দেখুন" : "Explore Ideas"}
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
