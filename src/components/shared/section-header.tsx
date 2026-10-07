import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

interface SectionHeaderProps {
  title: string;
  description?: string;
  href?: string;
  linkLabel?: string;
  className?: string;
}

export function SectionHeader({ title, description, href, linkLabel = "সব দেখুন", className }: SectionHeaderProps) {
  return (
    <div className={cn("mb-8 flex items-end justify-between gap-4 md:mb-12", className)}>
      <div className="max-w-2xl">
        <h2 className="text-2xl font-semibold leading-snug md:text-4xl">{title}</h2>
        {description && <p className="mt-2 text-ink-secondary">{description}</p>}
      </div>
      {href && (
        <Link href={href} className="inline-flex shrink-0 items-center gap-1.5 whitespace-nowrap text-sm font-medium text-link transition-colors hover:underline">
          {linkLabel}
          <ArrowRight className="h-4 w-4" aria-hidden />
        </Link>
      )}
    </div>
  );
}
