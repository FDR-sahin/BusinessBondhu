// import type { Metadata, Viewport } from "next";
// import { Anek_Bangla, Hind_Siliguri, Fraunces, Inter } from "next/font/google";
// import { Providers } from "@/components/providers";
// import { BgMapWatermark } from "@/components/layout/bg-map-watermark";
// import { AiChatbotWidget } from "@/components/chat/ai-chatbot-widget";
// import { cn } from "@/lib/utils";
// import "./globals.css";

// // Professional Bangla display font
// const anekBangla = Anek_Bangla({
//   subsets: ["bengali"],
//   weight: ["400", "500", "600", "700"],
//   variable: "--font-bn-display",
//   display: "swap",
// });

// // Bangla UI / body font
// const hindSiliguri = Hind_Siliguri({
//   subsets: ["bengali", "latin"],
//   weight: ["400", "500", "600", "700"],
//   variable: "--font-hind",
//   display: "swap",
// });

// // Latin display font
// const fraunces = Fraunces({
//   subsets: ["latin"],
//   weight: ["600", "700"],
//   variable: "--font-fraunces",
//   display: "swap",
// });

// // Latin body & micro-label font
// const inter = Inter({
//   subsets: ["latin"],
//   weight: ["400", "600"],
//   variable: "--font-inter",
//   display: "swap",
// });

// export const metadata: Metadata = {
//   metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000"),
//   title: {
//     default: "বিজনেস আইডিয়া জোন — Business Idea Zone",
//     template: "%s | বিজনেস আইডিয়া জোন",
//   },
//   description:
//     "বাংলাদেশের ব্যবসায়িক খাতা। এলাকাভিত্তিক ব্যবসার আইডিয়া, পাইকারি ও খুচরা দাম এবং লাভ হিসাব এক জায়গায়।",
//   icons: {
//     icon: [
//       { url: "/favicon.ico" },
//       { url: "/images/biz-logo.png", type: "image/png" },
//     ],
//     shortcut: "/favicon.ico",
//     apple: "/images/biz-logo.png",
//   },
//   openGraph: { type: "website", locale: "bn_BD", siteName: "বিজনেস আইডিয়া জোন" },
// };

// export const viewport: Viewport = {
//   width: "device-width",
//   initialScale: 1,
//   minimumScale: 1,
//   maximumScale: 5,
//   userScalable: true,
//   themeColor: [
//     { media: "(prefers-color-scheme: light)", color: "#F6F2E9" },
//     { media: "(prefers-color-scheme: dark)", color: "#0F110E" },
//   ],
// };

// export default function RootLayout({ children }: { children: React.ReactNode }) {
//   return (
//     <html lang="bn" suppressHydrationWarning>
//       <body
//         className={cn(
//           anekBangla.variable,
//           hindSiliguri.variable,
//           fraunces.variable,
//           inter.variable,
//           "min-h-screen ledger-paper font-sans antialiased text-ink bg-background"
//         )}
//       >
//         <Providers>
//           <BgMapWatermark />
//           {children}
//           <AiChatbotWidget />
//         </Providers>
//       </body>
//     </html>
//   );
// }




import type { Metadata, Viewport } from "next";
import { Anek_Bangla, Hind_Siliguri, Fraunces, Inter } from "next/font/google";
import { Providers } from "@/components/providers";
import { BgMapWatermark } from "@/components/layout/bg-map-watermark";
import { AiChatbotWidget } from "@/components/chat/ai-chatbot-widget";
import { cn } from "@/lib/utils";
import "./globals.css";

// Professional Bangla display font
const anekBangla = Anek_Bangla({
  subsets: ["bengali"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-bn-display",
  display: "swap",
});

// Bangla UI / body font
const hindSiliguri = Hind_Siliguri({
  subsets: ["bengali", "latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-hind",
  display: "swap",
});

// Latin display font
const fraunces = Fraunces({
  subsets: ["latin"],
  weight: ["600", "700"],
  variable: "--font-fraunces",
  display: "swap",
});

// Latin body & micro-label font
const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "600"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL ||
      "https://www.businessideazone.com"
  ),

  title: {
    default:
      "Business Ideas in Bangladesh | ব্যবসার আইডিয়া - Business Idea Zone",
    template: "%s | Business Idea Zone",
  },

  description:
    "বাংলাদেশে নতুন ব্যবসার আইডিয়া, কম পুঁজিতে লাভজনক ব্যবসা, পাইকারি ও খুচরা দামের তথ্য, ব্যবসার পরিকল্পনা এবং লাভের হিসাব জানুন Business Idea Zone-এ। Discover business ideas, startup opportunities and small business tips in Bangladesh.",

  applicationName: "Business Idea Zone",

  authors: [
    {
      name: "Business Idea Zone",
      url: "https://www.businessideazone.com",
    },
  ],

  creator: "Business Idea Zone",

  alternates: {
    languages: {
      "bn-BD": "/",
    },
  },

  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },

  icons: {
    icon: [
      { url: "/favicon.ico" },
      { url: "/images/biz-logo.png", type: "image/png" },
    ],
    shortcut: "/favicon.ico",
    apple: "/images/biz-logo.png",
  },

  openGraph: {
    type: "website",
    locale: "bn_BD",
    alternateLocale: ["en_US"],
    siteName: "Business Idea Zone",
    title:
      "Business Ideas in Bangladesh | ব্যবসার আইডিয়া",
    description:
      "ব্যবসার আইডিয়া, কম পুঁজিতে লাভজনক ব্যবসা, পাইকারি ও খুচরা দাম এবং ব্যবসার পরিকল্পনা খুঁজুন। Explore business ideas and startup opportunities in Bangladesh.",
  },

  twitter: {
    card: "summary_large_image",
    title:
      "Business Ideas in Bangladesh | ব্যবসার আইডিয়া",
    description:
      "বাংলাদেশে ব্যবসার আইডিয়া, কম পুঁজিতে ব্যবসা এবং startup opportunities খুঁজুন Business Idea Zone-এ।",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  minimumScale: 1,
  maximumScale: 5,
  userScalable: true,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#F6F2E9" },
    { media: "(prefers-color-scheme: dark)", color: "#0F110E" },
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="bn" suppressHydrationWarning>
      <body
        className={cn(
          anekBangla.variable,
          hindSiliguri.variable,
          fraunces.variable,
          inter.variable,
          "min-h-screen ledger-paper font-sans antialiased text-ink bg-background"
        )}
      >
        <Providers>
          <BgMapWatermark />
          {children}
          <AiChatbotWidget />
        </Providers>
      </body>
    </html>
  );
}
