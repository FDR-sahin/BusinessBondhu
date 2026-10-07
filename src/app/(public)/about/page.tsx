import type { Metadata } from "next";
import { AboutCta, AboutHero, ContactSection, FaqSection, HowItWorksSteps, TeamSection, WhoWeAre, WhyWeBuilt } from "@/components/about/about-sections";

export const metadata: Metadata = {
  title: "আমাদের সম্পর্কে",
  description: "Business Hub BD কেন বানানো হয়েছে, কীভাবে কাজ করে এবং আমাদের টিম সম্পর্কে জানুন। প্রশ্ন থাকলে যোগাযোগ করুন।",
};

export default function AboutPage() {
  return (
    <>
      <AboutHero />
      <WhoWeAre />
      <WhyWeBuilt />
      <HowItWorksSteps />
      <TeamSection />
      <ContactSection />
      <FaqSection />
      <AboutCta />
    </>
  );
}
