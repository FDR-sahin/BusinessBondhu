// "use client";

// import { ChevronLeft, ChevronRight, Quote } from "lucide-react";
// import { useRef } from "react";
// import { SectionHeader } from "@/components/shared/section-header";
// import { UserAvatar } from "@/components/ui/avatar";
// import { Button } from "@/components/ui/button";
// import { Card } from "@/components/ui/card";
// import { useT } from "@/lib/i18n";
// import { useLangStore } from "@/store/lang-store";

// const STORIES = [
//   {
//     nameBn: "রাশেদুল ইসলাম",
//     nameEn: "Rashedul Islam",
//     locationBn: "মিরপুর, ঢাকা",
//     locationEn: "Mirpur, Dhaka",
//     quoteBn: "ফ্রোজেন ফুডের পাইকারি দাম আগে থেকে জানা ছিল বলে সঠিক সরবরাহকারী খুঁজে পেয়েছি। ছোট পুঁজিতেই দোকান শুরু করতে পেরেছি।",
//     quoteEn: "Knowing frozen food wholesale pricing upfront helped me secure the right supplier and launch with modest capital.",
//   },
//   {
//     nameBn: "নুসরাত জাহান",
//     nameEn: "Nusrat Jahan",
//     locationBn: "রাজশাহী",
//     locationEn: "Rajshahi",
//     quoteBn: "এলাকার চাহিদা বুঝে মৌসুমি ফলের ব্যবসা শুরু করি। অন্য উদ্যোক্তাদের মন্তব্য থেকে অনেক ভুল এড়াতে পেরেছি।",
//     quoteEn: "Understanding local demand allowed me to start a seasonal fruit business while avoiding common pitfalls.",
//   },
//   {
//     nameBn: "সাব্বির হোসেন",
//     nameEn: "Sabbir Hossain",
//     locationBn: "কুমিল্লা",
//     locationEn: "Cumilla",
//     quoteBn: "মোবাইল এক্সেসরিজের বাজারদর তুলনা করে সস্তায় মাল কিনেছি। এখন নিয়মিত ক্রেতা আছে।",
//     quoteEn: "Comparing mobile accessories wholesale rates enabled me to source affordably and build a loyal customer base.",
//   },
//   {
//     nameBn: "তাহমিনা আক্তার",
//     nameEn: "Tahmina Akter",
//     locationBn: "সিলেট",
//     locationEn: "Sylhet",
//     quoteBn: "ঘরে বসে সেলাইয়ের কাজ দিয়ে শুরু করেছিলাম। এআই পরামর্শ থেকে বাজেট ভাগ করে নেওয়ার ধারণা পেয়েছি।",
//     quoteEn: "I started home tailoring and used AI advice to structure my initial budget effectively.",
//   },
//   {
//     nameBn: "মিজানুর রহমান",
//     nameEn: "Mizanur Rahman",
//     locationBn: "বগুড়া",
//     locationEn: "Bogura",
//     quoteBn: "দুগ্ধজাত পণ্যের ছোট ব্যবসায় কোন সময় চাহিদা বাড়ে, সেই তথ্য কমিউনিটি থেকেই পেয়েছি।",
//     quoteEn: "Insights on peak seasonal demand for dairy products came directly from the community ledger.",
//   },
//   {
//     nameBn: "ফারহানা ইয়াসমিন",
//     nameEn: "Farhana Yasmin",
//     locationBn: "খুলনা",
//     locationEn: "Khulna",
//     quoteBn: "কসমেটিকসের পাইকারি বাজারের ঠিকানা আর দামের তুলনা পেয়ে কেনাকাটার খরচ কমাতে পেরেছি।",
//     quoteEn: "Finding wholesale market contacts and price comparisons reduced my cosmetics inventory procurement cost.",
//   },
// ];

// export function SuccessStories() {
//   const t = useT();
//   const lang = useLangStore((s) => s.lang);
//   const scroller = useRef<HTMLDivElement>(null);
//   const scrollBy = (dir: 1 | -1) => scroller.current?.scrollBy({ left: dir * 360, behavior: "smooth" });

//   return (
//     <section className="section border-y border-border bg-surface" aria-labelledby="stories-title">
//       <div className="container-page">
//         <div className="mb-8 flex items-end justify-between gap-4 md:mb-12">
//           <div className="max-w-2xl">
//             <h2 id="stories-title" className="font-display text-2xl font-bold leading-snug text-ink md:text-4xl">
//               {t("successStoriesTitle")}
//             </h2>
//             <p className="mt-2 text-muted">{t("successStoriesDesc")}</p>
//           </div>
//           <div className="hidden gap-2 md:flex">
//             <Button variant="outline" size="icon" aria-label="Previous story" onClick={() => scrollBy(-1)}>
//               <ChevronLeft />
//             </Button>
//             <Button variant="outline" size="icon" aria-label="Next story" onClick={() => scrollBy(1)}>
//               <ChevronRight />
//             </Button>
//           </div>
//         </div>

//         <div
//           ref={scroller}
//           role="region"
//           aria-label={t("successStoriesTitle")}
//           tabIndex={0}
//           className="-mx-4 flex snap-x snap-mandatory gap-4 overflow-x-auto px-4 pb-4 scrollbar-hide md:mx-0 md:px-0"
//         >
//           {STORIES.map((s) => {
//             const name = lang === "bn" ? s.nameBn : s.nameEn;
//             const location = lang === "bn" ? s.locationBn : s.locationEn;
//             const quote = lang === "bn" ? s.quoteBn : s.quoteEn;

//             return (
//               <Card key={s.nameEn} className="flex w-[85%] shrink-0 snap-start flex-col gap-5 p-6 sm:w-[22rem]">
//                 <Quote className="h-6 w-6 text-green" aria-hidden />
//                 <blockquote className="flex-1 text-base leading-7 text-ink">{quote}</blockquote>
//                 <figcaption className="flex items-center gap-3 border-t border-line pt-4">
//                   <UserAvatar name={name} className="h-10 w-10" />
//                   <div className="leading-tight">
//                     <p className="font-medium text-ink">{name}</p>
//                     <p className="text-sm text-muted">{location}</p>
//                   </div>
//                 </figcaption>
//               </Card>
//             );
//           })}
//         </div>
//       </div>
//     </section>
//   );
// }



"use client";

import { ChevronLeft, ChevronRight, Quote, Star } from "lucide-react";
import { useRef } from "react";
import { Autoplay, Navigation } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import type { Swiper as SwiperType } from "swiper";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useT } from "@/lib/i18n";
import { useLangStore } from "@/store/lang-store";

// Swiper styles
import "swiper/css";
import "swiper/css/navigation";

const STORIES = [
  {
    nameBn: "রাশেদুল ইসলাম",
    nameEn: "Rashedul Islam",
    locationBn: "মিরপুর, ঢাকা",
    locationEn: "Mirpur, Dhaka",
    quoteBn: "ফ্রোজেন ফুডের পাইকারি দাম আগে থেকে জানা ছিল বলে সঠিক সরবরাহকারী খুঁজে পেয়েছি। ছোট পুঁজিতেই দোকান শুরু করতে পেরেছি।",
    quoteEn: "Knowing frozen food wholesale pricing upfront helped me secure the right supplier and launch with modest capital.",
  },
  {
    nameBn: "নুসরাত জাহান",
    nameEn: "Nusrat Jahan",
    locationBn: "রাজশাহী",
    locationEn: "Rajshahi",
    quoteBn: "এলাকার চাহিদা বুঝে মৌসুমি ফলের ব্যবসা শুরু করি। অন্য উদ্যোক্তাদের মন্তব্য থেকে অনেক ভুল এড়াতে পেরেছি।",
    quoteEn: "Understanding local demand allowed me to start a seasonal fruit business while avoiding common pitfalls.",
  },
  {
    nameBn: "সাব্বির হোসেন",
    nameEn: "Sabbir Hossain",
    locationBn: "কুমিল্লা",
    locationEn: "Cumilla",
    quoteBn: "মোবাইল এক্সেসরিজের বাজারদর তুলনা করে সস্তায় মাল কিনেছি। এখন নিয়মিত ক্রেতা আছে।",
    quoteEn: "Comparing mobile accessories wholesale rates enabled me to source affordably and build a loyal customer base.",
  },
  {
    nameBn: "তাহমিনা আক্তার",
    nameEn: "Tahmina Akter",
    locationBn: "সিলেট",
    locationEn: "Sylhet",
    quoteBn: "ঘরে বসে সেলাইয়ের কাজ দিয়ে শুরু করেছিলাম। এআই পরামর্শ থেকে বাজেট ভাগ করে নেওয়ার ধারণা পেয়েছি।",
    quoteEn: "I started home tailoring and used AI advice to structure my initial budget effectively.",
  },
  {
    nameBn: "মিজানুর রহমান",
    nameEn: "Mizanur Rahman",
    locationBn: "বগুড়া",
    locationEn: "Bogura",
    quoteBn: "দুগ্ধজাত পণ্যের ছোট ব্যবসায় কোন সময় চাহিদা বাড়ে, সেই তথ্য কমিউনিটি থেকেই পেয়েছি।",
    quoteEn: "Insights on peak seasonal demand for dairy products came directly from the community ledger.",
  },
  {
    nameBn: "ফারহানা ইয়াসমিন",
    nameEn: "Farhana Yasmin",
    locationBn: "খুলনা",
    locationEn: "Khulna",
    quoteBn: "কসমেটিকসের পাইকারি বাজারের ঠিকানা আর দামের তুলনা পেয়ে কেনাকাটার খরচ কমাতে পেরেছি।",
    quoteEn: "Finding wholesale market contacts and price comparisons reduced my cosmetics inventory procurement cost.",
  },
];

export function SuccessStories() {
  const t = useT();
  const lang = useLangStore((s) => s.lang);
  const swiperRef = useRef<SwiperType | null>(null);

  return (
    <section
      className="relative overflow-hidden py-12 md:py-20 border-y border-border/60 bg-gradient-to-b from-surface via-background to-surface"
      aria-labelledby="stories-title"
    >
      <div className="container-page">
        {/* Header Container */}
        <div className="mb-8 flex items-end justify-between gap-4 md:mb-12">
          <div className="max-w-2xl">
            <div className="mb-2 inline-flex items-center gap-1.5 rounded-full border border-green/20 bg-green/10 px-3 py-1 text-xs font-semibold text-green">
              <Star className="h-3.5 w-3.5 fill-current text-green" />
              <span>{lang === "bn" ? "সফলতার গল্প" : "Success Stories"}</span>
            </div>
            <h2 id="stories-title" className="font-display text-2xl font-bold leading-snug text-ink md:text-4xl">
              {t("successStoriesTitle")}
            </h2>
            <p className="mt-2 text-sm md:text-base text-muted">{t("successStoriesDesc")}</p>
          </div>

          {/* Custom Navigation Buttons */}
          <div className="hidden gap-2 sm:flex">
            <Button
              variant="outline"
              size="icon"
              aria-label="Previous story"
              onClick={() => swiperRef.current?.slidePrev()}
              className="h-10 w-10 rounded-full border-border hover:bg-green hover:text-white hover:border-green transition-all"
            >
              <ChevronLeft className="h-5 w-5" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              aria-label="Next story"
              onClick={() => swiperRef.current?.slideNext()}
              className="h-10 w-10 rounded-full border-border hover:bg-green hover:text-white hover:border-green transition-all"
            >
              <ChevronRight className="h-5 w-5" />
            </Button>
          </div>
        </div>

        {/* Swiper Slider Component */}
        <Swiper
          modules={[Autoplay, Navigation]}
          onBeforeInit={(swiper) => {
            swiperRef.current = swiper;
          }}
          loop={true}
          centeredSlides={true}
          slidesPerView={1.2}
          spaceBetween={16}
          speed={800}
          autoplay={{
            delay: 3000,
            disableOnInteraction: false,
            pauseOnMouseEnter: true, // Mouse আনলে Pause হয়ে যাবে
          }}
          breakpoints={{
            640: {
              slidesPerView: 2,
              spaceBetween: 20,
            },
            1024: {
              slidesPerView: 3,
              spaceBetween: 24,
            },
          }}
          className="w-full py-6 !overflow-visible"
        >
          {STORIES.map((s) => {
            const name = lang === "bn" ? s.nameBn : s.nameEn;
            const location = lang === "bn" ? s.locationBn : s.locationEn;
            const quote = lang === "bn" ? s.quoteBn : s.quoteEn;

            return (
              <SwiperSlide key={s.nameEn} className="h-auto transition-all duration-500">
                {({ isActive }) => (
                  <Card
                    className={`group relative flex h-full flex-col justify-between overflow-hidden rounded-2xl border p-6 transition-all duration-500 ${
                      isActive
                        ? "scale-105 border-green bg-surface shadow-2xl shadow-green/10 z-10"
                        : "scale-95 border-border/60 bg-surface/60 opacity-60 hover:opacity-100"
                    }`}
                  >
                    {/* Top Inside Card */}
                    <div className="flex items-center justify-between">
                      <Quote
                        className={`h-7 w-7 transition-colors duration-300 ${
                          isActive ? "text-green" : "text-muted"
                        }`}
                        aria-hidden
                      />
                      <div className="flex items-center gap-0.5 text-amber-500">
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} className="h-3.5 w-3.5 fill-current" />
                        ))}
                      </div>
                    </div>

                    {/* Quote Content */}
                    <blockquote className="my-4 flex-1 text-sm md:text-base leading-relaxed text-ink font-medium">
                      &ldquo;{quote}&rdquo;
                    </blockquote>

                    {/* Profile Footer */}
                    <figcaption className="border-t border-border/60 pt-4">
                      <div className="leading-tight">
                        <p className="font-semibold text-ink text-sm">{name}</p>
                        <p className="text-xs text-muted font-normal mt-0.5">{location}</p>
                      </div>
                    </figcaption>
                  </Card>
                )}
              </SwiperSlide>
            );
          })}
        </Swiper>
      </div>
    </section>
  );
}