import { AiAdvisorCta } from "@/components/home/ai-advisor-cta";
import { CategoriesGrid } from "@/components/home/categories-grid";
import { Hero } from "@/components/home/hero";
import { NewsletterCta } from "@/components/home/newsletter-cta";
import { RecentPosts } from "@/components/home/recent-posts";
import { SuccessStories } from "@/components/home/success-stories";
import { TopDistricts } from "@/components/home/top-districts";
import { TrendingPosts } from "@/components/home/trending-posts";

/** Home: server component that composes the client sections in spec order. */
export default function HomePage() {
  return (
    <>
      <Hero />
      <TrendingPosts />
      <CategoriesGrid />
      <AiAdvisorCta />
      <TopDistricts />
      <RecentPosts />
      <SuccessStories />
      <NewsletterCta />
    </>
  );
}
