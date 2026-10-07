import { ChevronRight } from "lucide-react";
import Link from "next/link";
import { Fragment } from "react";

export interface Crumb {
  label: string;
  href?: string;
}

/** Last item is the current page (no link, aria-current="page"). */
export function Breadcrumb({ items }: { items: Crumb[] }) {
  return (
    <nav aria-label="breadcrumb">
      <ol className="flex flex-wrap items-center gap-1.5 text-sm text-ink-secondary">
        {items.map((item, i) => {
          const last = i === items.length - 1;
          return (
            <Fragment key={`${item.label}-${i}`}>
              <li className="min-w-0">
                {last || !item.href ? (
                  <span aria-current={last ? "page" : undefined} className="line-clamp-1 font-medium text-foreground">
                    {item.label}
                  </span>
                ) : (
                  <Link href={item.href} className="rounded transition-colors hover:text-foreground">
                    {item.label}
                  </Link>
                )}
              </li>
              {!last && <ChevronRight className="h-4 w-4 shrink-0" aria-hidden />}
            </Fragment>
          );
        })}
      </ol>
    </nav>
  );
}
