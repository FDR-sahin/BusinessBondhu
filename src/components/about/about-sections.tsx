import { ArrowRight, Check } from "lucide-react";
import Link from "next/link";
import { FadeIn, Stagger, StaggerItem } from "@/components/shared/motion";
import { UserAvatar } from "@/components/ui/avatar";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { FAQS, PAIN_POINTS, STEPS, TEAM, VALUES } from "@/lib/about-content";
import { toBanglaNumber } from "@/lib/utils";
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
  return (
    <section className="relative overflow-hidden border-b border-border">
      <div aria-hidden className="pointer-events-none absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-b from-primary/5 via-transparent to-transparent" />
        <div className="absolute -left-24 -top-24 h-96 w-96 rounded-full bg-primary/15 blur-3xl" />
        <div className="absolute -right-16 top-24 h-72 w-72 rounded-full bg-secondary/20 blur-3xl" />
      </div>
      <div className="container-page relative py-16 md:py-24">
        <FadeIn className="max-w-3xl">
          <Badge variant="secondary" className="mb-5 px-3 py-1">আমাদের সম্পর্কে</Badge>
          <h1 className="text-4xl font-bold leading-[1.3] tracking-tight md:text-6xl md:leading-[1.25]">
            প্রতিটি উদ্যোক্তার হাতে সঠিক তথ্য পৌঁছে দেওয়াই আমাদের লক্ষ্য
          </h1>
          <p className="mt-5 max-w-2xl text-lg text-ink-secondary">
            Business Hub BD এমন একটি জায়গা, যেখানে বাংলাদেশের ছোট ও মাঝারি উদ্যোক্তারা এলাকাভিত্তিক ব্যবসার আইডিয়া, বাজারদর ও নিজেদের অভিজ্ঞতা ভাগাভাগি করেন।
          </p>
        </FadeIn>
      </div>
    </section>
  );
}

export function WhoWeAre() {
  return (
    <section className="section" aria-labelledby="who-title">
      <div className="container-page grid gap-10 lg:grid-cols-2 lg:gap-16">
        <FadeIn>
          <Heading id="who-title" title="আমরা কারা" />
          <div className="space-y-4 text-ink-secondary">
            <p>আমরা একদল প্রযুক্তিবিদ ও ব্যবসা-অনুরাগী মানুষ। দেশের উদ্যোক্তাদের জন্য তথ্যভিত্তিক সিদ্ধান্ত নেওয়া সহজ করতে আমরা Business Hub BD তৈরি করেছি।</p>
            <p>আমাদের বিশ্বাস, একজন উদ্যোক্তার সবচেয়ে বড় পুঁজি শুধু টাকা নয়, সঠিক সময়ে সঠিক তথ্য। তাই আমরা এমন একটি প্ল্যাটফর্ম বানাচ্ছি, যেখানে কমিউনিটির অভিজ্ঞতা আর আধুনিক প্রযুক্তি একসঙ্গে কাজ করে।</p>
          </div>
        </FadeIn>
        <Stagger className="grid gap-4 sm:grid-cols-2">
          {VALUES.map(({ icon: Icon, title, text }) => (
            <StaggerItem key={title} className="h-full">
              <Card className="h-full space-y-3 p-5">
                <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary-soft text-primary-soft-foreground"><Icon className="h-5 w-5" aria-hidden /></span>
                <h3 className="font-semibold">{title}</h3>
                <p className="text-sm text-ink-secondary">{text}</p>
              </Card>
            </StaggerItem>
          ))}
        </Stagger>
      </div>
    </section>
  );
}

export function WhyWeBuilt() {
  return (
    <section className="section border-y border-border bg-surface" aria-labelledby="why-title">
      <div className="container-page grid gap-10 lg:grid-cols-2 lg:gap-16">
        <FadeIn>
          <Heading id="why-title" title="কেন বানানো হলো" text="একটি সাধারণ সমস্যা থেকেই শুরু। নতুন ব্যবসা শুরু করতে গেলে সঠিক তথ্যই সবচেয়ে কঠিন জোগাড়।" />
          <p className="text-ink-secondary">আমরা দেখেছি, অনেকেই অনুমানের ওপর ভর করে পুঁজি খাটান। তাই আমরা চেয়েছি তথ্য সবার জন্য খোলা ও সহজলভ্য করতে।</p>
        </FadeIn>
        <Stagger className="space-y-4">
          {PAIN_POINTS.map((p) => (
            <StaggerItem key={p}>
              <div className="flex gap-4 rounded-2xl border border-border bg-card p-5 shadow-sm">
                <span className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-success-soft text-success-soft-foreground"><Check className="h-4 w-4" aria-hidden /></span>
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
  return (
    <section className="section" aria-labelledby="steps-title">
      <div className="container-page">
        <Heading id="steps-title" title="কীভাবে কাজ করে" text="তিনটি সহজ ধাপে আপনার ব্যবসার সিদ্ধান্ত।" />
        <Stagger className="grid gap-6 md:grid-cols-3">
          {STEPS.map(({ icon: Icon, title, text }, i) => (
            <StaggerItem key={title} className="h-full">
              <Card className="relative h-full space-y-4 overflow-hidden p-6">
                <span aria-hidden className="absolute right-4 top-2 text-6xl font-bold text-border">{toBanglaNumber(i + 1)}</span>
                <span className="relative flex h-12 w-12 items-center justify-center rounded-xl bg-primary text-primary-foreground"><Icon className="h-6 w-6" aria-hidden /></span>
                <h3 className="relative text-lg font-semibold md:text-xl">{title}</h3>
                <p className="relative text-ink-secondary">{text}</p>
              </Card>
            </StaggerItem>
          ))}
        </Stagger>
      </div>
    </section>
  );
}

export function TeamSection() {
  return (
    <section className="section border-y border-border bg-surface" aria-labelledby="team-title">
      <div className="container-page">
        <Heading id="team-title" title="আমাদের টিম" text="যাদের হাত ধরে প্ল্যাটফর্মটি এগিয়ে চলছে।" />
        <Stagger className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {TEAM.map((m) => (
            <StaggerItem key={m.name}>
              <Card className="flex items-center gap-4 p-5">
                <UserAvatar name={m.name} className="h-14 w-14 text-lg" />
                <div>
                  <p className="font-semibold">{m.name}</p>
                  <p className="text-sm text-ink-secondary">{m.role}</p>
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
  return (
    <section id="contact" className="section scroll-mt-20" aria-labelledby="contact-title">
      <div className="container-page">
        <Heading id="contact-title" title="যোগাযোগ করুন" text="প্রশ্ন, পরামর্শ বা সহযোগিতার প্রস্তাব থাকলে আমাদের জানান।" />
        <ContactForm />
      </div>
    </section>
  );
}

export function FaqSection() {
  return (
    <section id="faq" className="section scroll-mt-20 border-y border-border bg-surface" aria-labelledby="faq-title">
      <div className="container-page grid gap-10 lg:grid-cols-[1fr_2fr] lg:gap-16">
        <Heading id="faq-title" title="সচরাচর জিজ্ঞাসা" text="সবচেয়ে বেশি করা প্রশ্নগুলোর উত্তর এখানে পাবেন।" />
        <Accordion type="single" collapsible className="border-t border-border">
          {FAQS.map((f, i) => (
            <AccordionItem key={f.q} value={`faq-${i}`}>
              <AccordionTrigger>{f.q}</AccordionTrigger>
              <AccordionContent>{f.a}</AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  );
}

export function AboutCta() {
  return (
    <section className="section" aria-labelledby="cta-title">
      <div className="container-page">
        <FadeIn>
          <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-primary to-primary-deep px-6 py-12 text-primary-foreground shadow-md md:px-14 md:py-16">
            <div aria-hidden className="pointer-events-none absolute -right-16 -top-16 h-64 w-64 rounded-full bg-secondary/25 blur-3xl" />
            <div className="relative max-w-2xl">
              <h2 id="cta-title" className="text-2xl font-semibold leading-snug md:text-4xl">আজই আপনার ব্যবসার যাত্রা শুরু করুন</h2>
              <p className="mt-3 text-blue-100">বিনামূল্যে অ্যাকাউন্ট খুলে আপনার এলাকার আইডিয়া দেখুন, প্রশ্ন করুন এবং নিজের অভিজ্ঞতা শেয়ার করুন।</p>
              <div className="mt-8 flex flex-wrap gap-3">
                <Button asChild variant="secondary" size="lg"><Link href="/signup">শুরু করুন <ArrowRight aria-hidden /></Link></Button>
                <Button asChild size="lg" className="border border-white/30 bg-white/10 hover:bg-white/20"><Link href="/explore">আইডিয়া দেখুন</Link></Button>
              </div>
            </div>
          </div>
        </FadeIn>
      </div>
    </section>
  );
}
