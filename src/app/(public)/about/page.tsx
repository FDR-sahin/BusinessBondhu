import type { Metadata } from "next";
import { AboutCta, AboutHero, ContactSection, FaqSection, HowItWorksSteps, TeamSection, WhoWeAre, WhyWeBuilt } from "@/components/about/about-sections";

export const metadata: Metadata = {
  title: "আমাদের সম্পর্কে",
  description: "বিজনেস আইডিয়া জোন (Business Idea Zone) কেন বানানো হয়েছে, কীভাবে কাজ করে এবং আমাদের টিম সম্পর্কে জানুন।",
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
