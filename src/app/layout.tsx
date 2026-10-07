import type { Metadata, Viewport } from "next";
import { Hind_Siliguri, Inter } from "next/font/google";
import { Providers } from "@/components/providers";
import { cn } from "@/lib/utils";
import "./globals.css";

// English / numerals
const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

// Bangla. The "bengali" subset is required or Bangla glyphs won't be downloaded.
const hindSiliguri = Hind_Siliguri({
  subsets: ["bengali", "latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-hind",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000"),
  title: {
    default: "Business Hub BD — আপনার এলাকার জন্য সঠিক ব্যবসা খুঁজুন",
    template: "%s | Business Hub BD",
  },
  description:
    "বাংলাদেশের ব্যবসায়িক কমিউনিটি। এলাকাভিত্তিক ব্যবসার আইডিয়া, পাইকারি ও খুচরা দাম এবং বাজেট অনুযায়ী এআই পরামর্শ এক জায়গায়।",
  openGraph: { type: "website", locale: "bn_BD", siteName: "Business Hub BD" },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#F9FAFB" },
    { media: "(prefers-color-scheme: dark)", color: "#0F172A" },
  ],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    // suppressHydrationWarning: next-themes sets the "dark" class before hydration.
    <html lang="bn" suppressHydrationWarning>
      <body className={cn(inter.variable, hindSiliguri.variable, "min-h-screen")}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
