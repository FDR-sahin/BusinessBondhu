import type { Metadata, Viewport } from "next";
import { Noto_Serif_Bengali, Hind_Siliguri, Fraunces, Inter } from "next/font/google";
import { Providers } from "@/components/providers";
import { BgMapWatermark } from "@/components/layout/bg-map-watermark";
import { AiChatbotWidget } from "@/components/chat/ai-chatbot-widget";
import { cn } from "@/lib/utils";
import "./globals.css";

// Bangla display serif headline font
const notoSerifBn = Noto_Serif_Bengali({
  subsets: ["bengali"],
  weight: ["600", "700"],
  variable: "--font-noto-serif-bn",
  display: "swap",
});

// Bangla UI / body font
const hindSiliguri = Hind_Siliguri({
  subsets: ["bengali", "latin"],
  weight: ["400", "600"],
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
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000"),
  title: {
    default: "বিজনেস বন্ধু — এলাকাভিত্তিক ব্যবসার খাতা",
    template: "%s | বিজনেস বন্ধু",
  },
  description:
    "বাংলাদেশের ব্যবসায়িক খাতা। এলাকাভিত্তিক ব্যবসার আইডিয়া, পাইকারি ও খুচরা দাম এবং লাভ হিসাব এক জায়গায়।",
  openGraph: { type: "website", locale: "bn_BD", siteName: "বিজনেস বন্ধু" },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#F6F2E9" },
    { media: "(prefers-color-scheme: dark)", color: "#0F110E" },
  ],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="bn" suppressHydrationWarning>
      <body
        className={cn(
          notoSerifBn.variable,
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
