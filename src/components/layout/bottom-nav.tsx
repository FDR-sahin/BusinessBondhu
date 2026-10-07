"use client";

import { Home, Compass, Sparkles, Bookmark, User, Plus } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useT } from "@/lib/i18n";
import { cn } from "@/lib/utils";
import { useIsAuthenticated } from "@/store/auth-store";

export function BottomNav() {
  const pathname = usePathname();
  const t = useT();
  const authed = useIsAuthenticated();

  const tabs = [
    { href: "/", label: t("navHome"), icon: Home },
    { href: "/explore", label: t("navExplore"), icon: Compass },
    { href: "/ai-advisor", label: t("navAiAdvisor"), icon: Sparkles },
    { href: "/dashboard/saved", label: t("navSaved"), icon: Bookmark },
    { href: authed ? "/dashboard/profile" : "/login", label: t("profile"), icon: User },
  ];

  const isActive = (href: string) => (href === "/" ? pathname === "/" : pathname.startsWith(href));

  return (
    <>
      {/* Floating "+" Action Button */}
      <Link
        href={authed ? "/dashboard/create-post" : "/login"}
        aria-label={t("shareIdea")}
        className="fixed bottom-20 right-4 z-40 flex h-12 w-12 items-center justify-center rounded-full bg-green text-white shadow-lg transition-transform hover:scale-105 active:scale-95 lg:hidden"
      >
        <Plus className="h-6 w-6" />
      </Link>

      {/* Fixed Bottom Tab Bar */}
      <nav
        aria-label="Mobile Navigation"
        className="fixed bottom-0 left-0 right-0 z-40 flex h-16 items-center justify-around border-t border-line bg-surface/95 px-2 backdrop-blur-md lg:hidden"
      >
        {tabs.map(({ href, label, icon: Icon }) => {
          const active = isActive(href);
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                "flex flex-col items-center justify-center gap-1 py-1 text-[11px] font-medium transition-colors",
                active ? "font-semibold text-green" : "text-ink/60 hover:text-ink"
              )}
            >
              <Icon className={cn("h-5 w-5", active && "stroke-[2.5px]")} />
              <span>{label}</span>
            </Link>
          );
        })}
      </nav>
    </>
  );
}
