import { FadeIn } from "@/components/shared/motion";
import { NewsletterForm } from "@/components/shared/newsletter-form";

export function NewsletterCta() {
  return (
    <section className="section" aria-labelledby="newsletter-title">
      <div className="container-page">
        <FadeIn>
          <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-primary to-primary-deep px-6 py-12 text-primary-foreground shadow-md md:px-14 md:py-16">
            <div aria-hidden className="pointer-events-none absolute -right-16 -top-16 h-64 w-64 rounded-full bg-secondary/25 blur-3xl" />
            <div className="relative grid items-center gap-8 md:grid-cols-2">
              <div>
                <h2 id="newsletter-title" className="text-2xl font-semibold leading-snug md:text-4xl">নতুন আইডিয়া মিস করবেন না</h2>
                <p className="mt-3 text-blue-100">প্রতি সপ্তাহে আপনার এলাকার সেরা ব্যবসার আইডিয়া ও বাজারদরের খবর পান ইমেইলে।</p>
              </div>
              <NewsletterForm tone="dark" />
            </div>
          </div>
        </FadeIn>
      </div>
    </section>
  );
}
