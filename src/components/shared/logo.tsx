import { Store } from "lucide-react";
import Link from "next/link";
import { SITE_NAME } from "@/lib/constants";
import { cn } from "@/lib/utils";

export function Logo({ className, showText = true }: { className?: string; showText?: boolean }) {
  return (
    <Link href="/" aria-label={SITE_NAME} className={cn("inline-flex items-center gap-2.5 rounded-lg", className)}>
      <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary text-primary-foreground shadow-sm">
        <Store className="h-5 w-5" aria-hidden />
      </span>
      {showText && <span className="text-lg font-semibold tracking-tight">{SITE_NAME}</span>}
    </Link>
  );
}
