"use client";

import { ArrowRight, Check } from "lucide-react";
import Link from "next/link";
import { FadeIn, Stagger, StaggerItem } from "@/components/shared/motion";
import { UserAvatar } from "@/components/ui/avatar";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { FAQS, PAIN_POINTS, STEPS, TEAM, VALUES } from "@/lib/about-content";
import { toFormattedNumber } from "@/lib/utils";
import { useLangStore } from "@/store/lang-store";
import { ContactForm } from "./contact-form";

function Heading({ id, title, text }: { id: string; title: string; text?: string }) {
  return (
    <div className="mb-8 max-w-2xl md:mb-12">
      <h2 id={id} className="text-2xl font-semibold leading-snug md:text-4xl">{title}</h2>
      {text && <p className="mt-2 text-ink-secondary">{text}</p>}
    </div>
  );
}

export function AboutHero() {
  const lang = useLangStore((s) => s.lang);
  return (
    <section className="relative overflow-hidden border-b border-border">
      <div aria-hidden className="pointer-events-none absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-b from-primary/5 via-transparent to-transparent" />
        <div className="absolute -left-24 -top-24 h-96 w-96 rounded-full bg-primary/15 blur-3xl" />
        <div className="absolute -right-16 top-24 h-72 w-72 rounded-full bg-secondary/20 blur-3xl" />
      </div>
      <div className="container-page relative py-16 md:py-24">
        <FadeIn className="max-w-3xl">
          <Badge variant="secondary" className="mb-5 px-3 py-1">
            {lang === "en" ? "About Us" : "আমাদের সম্পর্কে"}
          </Badge>
          <h1 className="text-3xl font-bold leading-[1.3] tracking-tight md:text-5xl md:leading-[1.25]">
            {lang === "en"
              ? "Business Idea Zone: Complete Business Sourcing & Market Intelligence"
              : "বিজনেস আইডিয়া জোন: এলাকাভিত্তিক ব্যবসার সঠিক সমাধান"}
          </h1>
          <p className="mt-5 max-w-2xl text-lg text-ink-secondary whitespace-pre-line">
            {lang === "en"
              ? "Want to start a new business, but not sure where to begin? Or searching for high-demand products and market opportunities? Business Idea Zone is here to answer all your questions."
              : "নতুন ব্যবসা শুরু করতে চান, কিন্তু কী নিয়ে শুরু করবেন বুঝতে পারছেন না? কিংবা কোন পণ্যের চাহিদা বেশি, কোথায় সুযোগ রয়েছে, তা খুঁজছেন? আপনাদের এই প্রশ্নগুলোর উত্তর খুঁজে দিতেই আমাদের বিজনেস আইডিয়া জোন।"}
          </p>
        </FadeIn>
      </div>
    </section>
  );
}

export function WhoWeAre() {
  const lang = useLangStore((s) => s.lang);
  return (
    <section className="section" aria-labelledby="who-title">
      <div className="container-page grid gap-10 lg:grid-cols-2 lg:gap-16">
        <FadeIn>
          <Heading id="who-title" title={lang === "en" ? "Who We Are" : "আমরা কারা"} />
          <div className="space-y-4 text-ink-secondary">
            <p>
              {lang === "en"
                ? "We believe that starting a successful business requires more than just capital, it takes the right idea, market insights, and timely decisions. Keeping these entrepreneurial challenges in mind, Regard's Tech presents Business Idea Zone. This platform helps entrepreneurs discover new business ideas, explore various products, and unlock new potential for their ventures."
                : "আমরা বিশ্বাস করি, ভালো একটি ব্যবসা শুরু করার জন্য শুধু পুঁজি থাকলেই হয় না, দরকার সঠিক ধারণা, বাজার সম্পর্কে জানা এবং সময়মতো সঠিক সিদ্ধান্ত নেওয়া। উদ্যোক্তাদের এই চ্যালেঞ্জগুলোর কথা মাথায় রেখেই Regards Tech নিয়ে এসেছে বিজনেস আইডিয়া জোন। এটি এমন একটি প্ল্যাটফর্ম, যেখানে উদ্যোক্তারা নতুন ব্যবসার আইডিয়া খুঁজে পাবেন, বিভিন্ন পণ্য সম্পর্কে জানতে পারবেন এবং নিজের উদ্যোগের জন্য নতুন সম্ভাবনা খুঁজে নিতে পারবেন।"}
            </p>
            <p>
              {lang === "en"
                ? "Our single mission is to make your business journey easier, so that your great idea can turn into a real venture. From business ideas to market research, everything in one place."
                : "আমাদের লক্ষ্য একটাই, আপনার ব্যবসা শুরু করার পথটা আরও সহজ করে দেওয়া, যেন আপনার ভালো একটি ভাবনা একদিন বাস্তব উদ্যোগে রূপ নিতে পারে। ব্যবসার আইডিয়া থেকে বাজারের খোঁজ, সব এক জায়গায়।"}
            </p>
            <p className="font-medium text-ink">
              {lang === "en"
                ? "Whatever business questions you have, Business Idea Zone is right by your side."
                : "কী নিয়ে ব্যবসা শুরু করবেন, কোন পণ্যের চাহিদা কেমন, এমন নানা প্রশ্নের উত্তর খুঁজতে আপনার পাশে আছে বিজনেস আইডিয়া জোন।"}
            </p>
          </div>
        </FadeIn>
        <Stagger className="grid gap-4 sm:grid-cols-2">
          {VALUES.map(({ icon: Icon, title, text }) => (
            <StaggerItem key={title.bn} className="h-full">
              <Card className="h-full space-y-3 p-5">
                <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary-soft text-primary-soft-foreground">
                  <Icon className="h-5 w-5" aria-hidden />
                </span>
                <h3 className="font-semibold">{title[lang]}</h3>
                <p className="text-sm text-ink-secondary">{text[lang]}</p>
              </Card>
            </StaggerItem>
          ))}
        </Stagger>
      </div>
    </section>
  );
}

export function WhyWeBuilt() {
  const lang = useLangStore((s) => s.lang);
  return (
    <section className="section border-y border-border bg-surface" aria-labelledby="why-title">
      <div className="container-page grid gap-10 lg:grid-cols-2 lg:gap-16">
        <FadeIn>
          <Heading
            id="why-title"
            title={lang === "en" ? "Why We Built It" : "কেন বানানো হলো"}
            text={
              lang === "en"
                ? "Born from a common struggle: starting a business is hard when transparent market pricing is difficult to obtain."
                : "একটি সাধারণ সমস্যা থেকেই শুরু। নতুন ব্যবসা শুরু করতে গেলে সঠিক তথ্যই সবচেয়ে কঠিন জোগাড়।"
            }
          />
          <p className="text-ink-secondary">
            {lang === "en"
              ? "We saw too many storekeepers risking capital based on guesswork. We set out to make market data transparent and accessible to everyone."
              : "আমরা দেখেছি, অনেকেই অনুমানের ওপর ভর করে পুঁজি খাটান। তাই আমরা চেয়েছি তথ্য সবার জন্য খোলা ও সহজলভ্য করতে।"}
          </p>
        </FadeIn>
        <Stagger className="space-y-4">
          {PAIN_POINTS[lang].map((p, idx) => (
            <StaggerItem key={idx}>
              <div className="flex gap-4 rounded-2xl border border-border bg-card p-5 shadow-sm">
                <span className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-success-soft text-success-soft-foreground">
                  <Check className="h-4 w-4" aria-hidden />
                </span>
                <p>{p}</p>
              </div>
            </StaggerItem>
          ))}
        </Stagger>
      </div>
    </section>
  );
}

export function HowItWorksSteps() {
  const lang = useLangStore((s) => s.lang);
  return (
    <section className="section" aria-labelledby="steps-title">
      <div className="container-page">
        <Heading
          id="steps-title"
          title={lang === "en" ? "How It Works" : "কীভাবে কাজ করে"}
          text={
            lang === "en"
              ? "Three simple steps to make confident business decisions."
              : "তিনটি সহজ ধাপে আপনার ব্যবসার সিদ্ধান্ত।"
          }
        />
        <Stagger className="grid gap-6 md:grid-cols-3">
          {STEPS.map(({ icon: Icon, title, text }, i) => (
            <StaggerItem key={title.bn} className="h-full">
              <Card className="relative h-full space-y-4 overflow-hidden p-6">
                <span aria-hidden className="absolute right-4 top-2 text-6xl font-bold text-border">
                  {toFormattedNumber(i + 1, lang)}
                </span>
                <span className="relative flex h-12 w-12 items-center justify-center rounded-xl bg-primary text-primary-foreground">
                  <Icon className="h-6 w-6" aria-hidden />
                </span>
                <h3 className="relative text-lg font-semibold md:text-xl">{title[lang]}</h3>
                <p className="relative text-ink-secondary">{text[lang]}</p>
              </Card>
            </StaggerItem>
          ))}
        </Stagger>
      </div>
    </section>
  );
}

export function TeamSection() {
  const lang = useLangStore((s) => s.lang);
  return (
    <section className="section border-y border-border bg-surface" aria-labelledby="team-title">
      <div className="container-page">
        <Heading
          id="team-title"
          title={lang === "en" ? "Our Team" : "আমাদের টিম"}
          text={
            lang === "en"
              ? "The passionate team driving the platform forward."
              : "যাদের হাত ধরে প্ল্যাটফর্মটি এগিয়ে চলছে।"
          }
        />
        <Stagger className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {TEAM.map((m) => (
            <StaggerItem key={m.name.bn}>
              <Card className="flex items-center gap-4 p-5">
                <UserAvatar name={m.name[lang]} className="h-14 w-14 text-lg" />
                <div>
                  <p className="font-semibold">{m.name[lang]}</p>
                  <p className="text-sm text-ink-secondary">{m.role[lang]}</p>
                </div>
              </Card>
            </StaggerItem>
          ))}
        </Stagger>
      </div>
    </section>
  );
}

export function ContactSection() {
  const lang = useLangStore((s) => s.lang);
  return (
    <section id="contact" className="section scroll-mt-20" aria-labelledby="contact-title">
      <div className="container-page">
        <Heading
          id="contact-title"
          title={lang === "en" ? "Contact Us" : "যোগাযোগ করুন"}
          text={
            lang === "en"
              ? "Have questions, suggestions, or partnership inquiries? Send us a message."
              : "প্রশ্ন, পরামর্শ বা সহযোগিতার প্রস্তাব থাকলে আমাদের জানান।"
          }
        />
        <ContactForm />
      </div>
    </section>
  );
}

export function FaqSection() {
  const lang = useLangStore((s) => s.lang);
  return (
    <section id="faq" className="section scroll-mt-20 border-y border-border bg-surface" aria-labelledby="faq-title">
      <div className="container-page grid gap-10 lg:grid-cols-[1fr_2fr] lg:gap-16">
        <Heading
          id="faq-title"
          title={lang === "en" ? "Frequently Asked Questions" : "সচরাচর জিজ্ঞাসা"}
          text={
            lang === "en"
              ? "Find answers to the most common questions about Business Hub BD."
              : "সবচেয়ে বেশি করা প্রশ্নগুলোর উত্তর এখানে পাবেন।"
          }
        />
        <Accordion type="single" collapsible className="border-t border-border">
          {FAQS.map((f, i) => (
            <AccordionItem key={i} value={`faq-${i}`}>
              <AccordionTrigger>{f.q[lang]}</AccordionTrigger>
              <AccordionContent>{f.a[lang]}</AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  );
}

export function AboutCta() {
  const lang = useLangStore((s) => s.lang);
  return (
    <section className="section" aria-labelledby="cta-title">
      <div className="container-page">
        <FadeIn>
          <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-primary to-primary-deep px-6 py-12 text-primary-foreground shadow-md md:px-14 md:py-16">
            <div aria-hidden className="pointer-events-none absolute -right-16 -top-16 h-64 w-64 rounded-full bg-secondary/25 blur-3xl" />
            <div className="relative max-w-2xl">
              <h2 id="cta-title" className="text-2xl font-semibold leading-snug md:text-4xl">
                {lang === "en" ? "Start Your Entrepreneurial Journey Today" : "আজই আপনার ব্যবসার যাত্রা শুরু করুন"}
              </h2>
              <p className="mt-3 text-blue-100">
                {lang === "en"
                  ? "Create a free account to explore district business ideas, ask questions, and share your shop experience."
                  : "বিনামূল্যে অ্যাকাউন্ট খুলে আপনার এলাকার আইডিয়া দেখুন, প্রশ্ন করুন এবং নিজের অভিজ্ঞতা শেয়ার করুন।"}
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                <Button asChild variant="secondary" size="lg">
                  <Link href="/signup">
                    {lang === "en" ? "Get Started" : "শুরু করুন"} <ArrowRight aria-hidden />
                  </Link>
                </Button>
                <Button asChild size="lg" className="border border-white/30 bg-white/10 hover:bg-white/20">
                  <Link href="/explore">
                    {lang === "en" ? "Explore Ideas" : "আইডিয়া দেখুন"}
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </FadeIn>
      </div>
    </section>
  );
}
