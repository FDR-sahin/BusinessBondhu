import { ArrowRight, Sparkles } from "lucide-react";
import Link from "next/link";
import { FadeIn } from "@/components/shared/motion";
import { Button } from "@/components/ui/button";

const BUDGETS = [
  { label: "৫ হাজার", value: 5000 },
  { label: "১০ হাজার", value: 10000 },
  { label: "২০ হাজার", value: 20000 },
  { label: "৫০ হাজার", value: 50000 },
];

export function AiAdvisorCta() {
  return (
    <section className="section" aria-labelledby="ai-cta-title">
      <div className="container-page">
        <FadeIn>
          <div className="relative overflow-hidden rounded-2xl border-2 border-secondary/60 bg-card p-6 shadow-md md:p-12">
            <div aria-hidden className="pointer-events-none absolute -right-20 -top-20 h-72 w-72 rounded-full bg-secondary/15 blur-3xl" />
            <div className="relative grid items-center gap-10 md:grid-cols-[1fr_auto]">
              <div className="max-w-2xl">
                <p className="mb-3 text-sm font-semibold text-secondary-soft-foreground">এআই ব্যবসা পরামর্শক</p>
                <h2 id="ai-cta-title" className="text-2xl font-semibold leading-snug md:text-4xl">১০ হাজার টাকায় কী ব্যবসা করবেন?</h2>
                <p className="mt-4 text-ink-secondary">
                  আপনার বাজেট আর এলাকা জানান। আমাদের এআই পরামর্শক বলে দেবে কোন ব্যবসায় কত খরচ, সম্ভাব্য লাভ কত এবং ঝুঁকি কতটা।
                </p>
                <div className="mt-5 flex flex-wrap gap-2" role="list" aria-label="দ্রুত বাজেট">
                  {BUDGETS.map((b) => (
                    <Link
                      key={b.value}
                      role="listitem"
                      href={`/ai-advisor?budget=${b.value}`}
                      className="rounded-lg border border-border bg-surface px-3 py-1.5 text-sm font-medium transition-colors hover:border-secondary hover:bg-secondary/10"
                    >
                      {b.label}
                    </Link>
                  ))}
                </div>
                <Button asChild size="lg" className="mt-8">
                  <Link href="/ai-advisor">পরামর্শ নিন <ArrowRight aria-hidden /></Link>
                </Button>
              </div>

              <div aria-hidden className="hidden h-40 w-40 items-center justify-center rounded-2xl bg-secondary-soft text-secondary md:flex">
                <Sparkles className="h-20 w-20" strokeWidth={1.5} />
              </div>
            </div>
          </div>
        </FadeIn>
      </div>
    </section>
  );
}
