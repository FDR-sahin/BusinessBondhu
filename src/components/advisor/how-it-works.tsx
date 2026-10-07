import { MapPin, Sparkles, Wallet } from "lucide-react";
import { Stagger, StaggerItem } from "@/components/shared/motion";
import { Card } from "@/components/ui/card";

const STEPS = [
  { icon: Wallet, title: "বাজেট দিন", text: "আপনার হাতে যত টাকা আছে সেটি লিখুন। ৫ হাজার থেকে শুরু করা যায়।" },
  { icon: MapPin, title: "এলাকা সিলেক্ট করুন", text: "বিভাগ, জেলা ও এলাকা দিন, যাতে স্থানীয় চাহিদা বুঝে আইডিয়া আসে।" },
  { icon: Sparkles, title: "AI পরামর্শ পাবেন", text: "খরচ, সম্ভাব্য লাভ ও ঝুঁকিসহ ব্যবসার আইডিয়া পাবেন।" },
];

export function HowItWorks() {
  return (
    <section className="section border-t border-border bg-surface" aria-labelledby="how-title">
      <div className="container-page">
        <h2 id="how-title" className="mb-10 text-2xl font-semibold leading-snug md:text-4xl">কীভাবে কাজ করে</h2>
        <Stagger className="grid gap-6 md:grid-cols-3">
          {STEPS.map(({ icon: Icon, title, text }, i) => (
            <StaggerItem key={title} className="h-full">
              <Card className="relative h-full space-y-3 p-6">
                <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary-soft text-primary-soft-foreground"><Icon className="h-5 w-5" aria-hidden /></span>
                <p className="text-sm font-semibold text-link">ধাপ {["১", "২", "৩"][i]}</p>
                <h3 className="text-lg font-semibold md:text-xl">{title}</h3>
                <p className="text-ink-secondary">{text}</p>
              </Card>
            </StaggerItem>
          ))}
        </Stagger>
      </div>
    </section>
  );
}
