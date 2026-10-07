import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { ThemeToggle } from "@/components/shared/theme-toggle";

/** Minimal centered shell: no header/footer, just a way home and the theme switch. */
export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative flex min-h-screen flex-col overflow-hidden">
      <div aria-hidden className="pointer-events-none absolute inset-0">
        <div className="absolute -left-24 -top-24 h-96 w-96 rounded-full bg-primary/15 blur-3xl" />
        <div className="absolute -bottom-24 -right-16 h-80 w-80 rounded-full bg-secondary/15 blur-3xl" />
      </div>

      <div className="container-page relative flex h-16 items-center justify-between">
        <Link href="/" className="inline-flex items-center gap-1.5 rounded-lg text-sm text-ink-secondary transition-colors hover:text-foreground">
          <ArrowLeft className="h-4 w-4" aria-hidden />হোমে ফিরে যান
        </Link>
        <ThemeToggle />
      </div>

      <main id="main" className="relative flex flex-1 items-center justify-center px-4 py-8">{children}</main>
    </div>
  );
}
