// "use client";

// import Link from "next/link";
// import { Plus } from "lucide-react";
// import { Button } from "@/components/ui/button";
// import { useT } from "@/lib/i18n";
// import { useLangStore } from "@/store/lang-store";

// export function Hero() {
//   const t = useT();
//   const lang = useLangStore((s) => s.lang);

//   return (
//     <section className="relative pt-10 pb-8 md:pt-16 md:pb-12 text-center">
//       <div className="container-page max-w-[900px] mx-auto flex flex-col items-center justify-center">
//         {/* Centered Headline */}
//         <h1 className="font-display text-[clamp(36px,5.2vw,64px)] font-bold leading-[1.2] :lang(bn):leading-[1.28] text-ink tracking-tight text-center">
//           {lang === "bn" ? (
//             <>
//               <div>হাতে সামান্য পুঁজি,</div>
//               <div>মাথায় বড় আইডিয়া,</div>
//               <div>খুঁজে নিন নিজের ব্যবসা।</div>
//             </>
//           ) : (
//             <>
//               <div>Small capital,</div>
//               <div>Big ideas,</div>
//               <div>Find your business.</div>
//             </>
//           )}
//         </h1>

//         {/* Centered CTA Buttons */}
//         <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
//           <Button asChild size="lg" className="h-12 bg-green text-white hover:bg-green/90 px-6 text-base font-semibold shadow-sm">
//             <Link href="/dashboard/create-post">
//               <Plus className="mr-1.5 h-5 w-5" />
//               {t("shareIdea")}
//             </Link>
//           </Button>

//           <Button asChild variant="outline" size="lg" className="h-12 border-line text-ink hover:bg-surface px-6 text-base font-medium shadow-2xs">
//             <Link href="/explore">
//               {lang === "bn" ? "আইডিয়া দেখুন" : "Explore Ideas"}
//             </Link>
//           </Button>
//         </div>
//       </div>
//     </section>
//   );
// }

// "use client";

// import Link from "next/link";
// import { Plus } from "lucide-react";
// import { motion } from "framer-motion";
// import { Button } from "@/components/ui/button";
// import { useT } from "@/lib/i18n";
// import { useLangStore } from "@/store/lang-store";

// export function Hero() {
//   const t = useT();
//   const lang = useLangStore((s) => s.lang);

//   return (
//     <section className="relative overflow-hidden pt-8 pb-8 md:pt-14 md:pb-12 text-center">
//       <div className="container-page max-w-[800px] mx-auto flex flex-col items-center justify-center">
        
//         {/* Animated Headline */}
//         <motion.h1
//           initial={{ opacity: 0, y: 15 }}
//           animate={{ opacity: 1, y: 0 }}
//           transition={{ duration: 0.5, ease: "easeOut" }}
//           className="font-display text-[clamp(28px,4vw,48px)] font-extrabold leading-[1.25] text-ink tracking-tight text-center"
//         >
//           {lang === "bn" ? (
//             <>
//               <div>হাতে সামান্য পুঁজি,</div>
//               <div className="bg-gradient-to-r from-green via-emerald-600 to-teal-600 bg-clip-text text-transparent">
//                 মাথায় বড় আইডিয়া,
//               </div>
//               <div>খুঁজে নিন নিজের ব্যবসা।</div>
//             </>
//           ) : (
//             <>
//               <div>Small capital,</div>
//               <div className="bg-gradient-to-r from-green via-emerald-600 to-teal-600 bg-clip-text text-transparent">
//                 Big ideas,
//               </div>
//               <div>Find your business.</div>
//             </>
//           )}
//         </motion.h1>

//         {/* Animated CTA Buttons */}
//         <motion.div
//           initial={{ opacity: 0, y: 15 }}
//           animate={{ opacity: 1, y: 0 }}
//           transition={{ duration: 0.5, delay: 0.2, ease: "easeOut" }}
//           className="mt-6 flex flex-wrap items-center justify-center gap-3"
//         >
//           <Button
//             asChild
//             size="lg"
//             className="h-11 bg-green text-white hover:bg-green/90 px-6 text-sm font-semibold shadow-md transition-all hover:scale-[1.02]"
//           >
//             <Link href="/dashboard/create-post">
//               <Plus className="mr-1.5 h-4 w-4" />
//               {t("shareIdea")}
//             </Link>
//           </Button>

//           <Button
//             asChild
//             variant="outline"
//             size="lg"
//             className="h-11 border-line text-ink hover:bg-surface px-6 text-sm font-medium shadow-2xs transition-all hover:scale-[1.02]"
//           >
//             <Link href="/explore">
//               {lang === "bn" ? "আইডিয়া দেখুন" : "Explore Ideas"}
//             </Link>
//           </Button>
//         </motion.div>

//       </div>
//     </section>
//   );
// }

"use client";

import Link from "next/link";
import { Plus } from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { useT } from "@/lib/i18n";
import { useLangStore } from "@/store/lang-store";

export function Hero() {
  const t = useT();
  const lang = useLangStore((s) => s.lang);

  return (
    <section className="relative overflow-hidden pt-8 pb-8 md:pt-12 md:pb-10 text-center">
      <div className="container-page max-w-[800px] mx-auto flex flex-col items-center justify-center">
        
        {/* Main Animated Gradient Headline */}
        <motion.h1
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="font-display text-[clamp(26px,3.8vw,44px)] font-extrabold leading-[1.28] tracking-tight text-center"
        >
          {lang === "bn" ? (
            <div className="space-y-1">
              {/* Line 1: Smooth Animated Gradient Text */}
              <div>
                <span className="inline-block animate-gradient bg-gradient-to-r from-emerald-600 via-teal-500 via-green to-emerald-700 bg-[length:200%_auto] bg-clip-text text-transparent drop-shadow-xs">
                  হাতে সামান্য পুঁজি, মাথায় বড় আইডিয়া,
                </span>
              </div>

              {/* Line 2: Keep exact wording/order
              <div className="text-ink">
                মাথায় বড় আইডিয়া,
              </div> */}

              {/* Line 3: Smooth Animated Gradient Text */}
              <div>
                <span className="inline-block animate-gradient bg-gradient-to-r from-green via-teal-500 via-emerald-600 to-green bg-[length:200%_auto] bg-clip-text text-transparent drop-shadow-xs">
                  খুঁজে নিন নিজের ব্যবসা।
                </span>
              </div>
            </div>
          ) : (
            <div className="space-y-1">
              <div>
                <span className="inline-block animate-gradient bg-gradient-to-r from-emerald-600 via-teal-500 via-green to-emerald-700 bg-[length:200%_auto] bg-clip-text text-transparent">
                  Small capital, Big ideas,
                </span>
              </div>
              {/* <div className="text-ink">
                Big ideas,
              </div>*/}
              <div> 
                <span className="inline-block animate-gradient bg-gradient-to-r from-green via-teal-500 via-emerald-600 to-green bg-[length:200%_auto] bg-clip-text text-transparent">
                  Find your business.
                </span>
              </div>
            </div>
          )}
        </motion.h1>

        {/* Action Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2, ease: "easeOut" }}
          className="mt-6 flex flex-wrap items-center justify-center gap-3"
        >
          <Button
            asChild
            size="lg"
            className="h-11 bg-green text-white hover:bg-green/90 px-6 text-sm font-semibold shadow-md transition-all hover:scale-[1.02]"
          >
            <Link href="/dashboard/create-post">
              <Plus className="mr-1.5 h-4 w-4" />
              {t("shareIdea")}
            </Link>
          </Button>

          <Button
            asChild
            variant="outline"
            size="lg"
            className="h-11 border-line text-ink hover:bg-surface px-6 text-sm font-medium shadow-2xs transition-all hover:scale-[1.02]"
          >
            <Link href="/explore">
              {lang === "bn" ? "আইডিয়া দেখুন" : "Explore Ideas"}
            </Link>
          </Button>
        </motion.div>

      </div>
    </section>
  );
}