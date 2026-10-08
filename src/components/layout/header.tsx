"use client";

import { motion } from "framer-motion";
import { Menu, Plus } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { LanguageToggle } from "@/components/shared/language-toggle";
import { Logo } from "@/components/shared/logo";
import { ThemeToggle } from "@/components/shared/theme-toggle";
import { useMounted } from "@/hooks/use-mounted";
import { NAV_LINKS } from "@/lib/constants";
import { useT } from "@/lib/i18n";
import { cn } from "@/lib/utils";
import { useIsAuthenticated } from "@/store/auth-store";
import { MobileNav } from "./mobile-nav";
import { NotificationBell } from "./notification-bell";
import { UserMenu } from "./user-menu";
import { TrustStrip } from "./trust-strip";

export function Header() {
  const pathname = usePathname();
  const t = useT();
  const mounted = useMounted();
  const authed = useIsAuthenticated();
  const [scrolled, setScrolled] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => setDrawerOpen(false), [pathname]);

  const isActive = (href: string) => (href === "/" ? pathname === "/" : pathname.startsWith(href));

  return (
    <>
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded-lg focus:bg-green focus:px-4 focus:py-2 focus:text-white"
      >
        {t("skipToContent")}
      </a>

      {/* Top 28px Trust Strip */}
      <TrustStrip />

      {/* Sticky 64px Header */}
      <header
        className={cn(
          "sticky top-0 z-40 w-full border-b border-line bg-surface/90 backdrop-blur-md transition-shadow duration-200",
          scrolled ? "shadow-sm" : ""
        )}
      >
        <div className="container-page flex h-16 items-center gap-4">
          <Logo />

          {/* Desktop Navigation */}
          <nav aria-label={t("mainMenu")} className="hidden flex-1 items-center justify-center lg:flex">
            {NAV_LINKS.map((l) => {
              const active = isActive(l.href);
              return (
                <Link
                  key={l.href}
                  href={l.href}
                  aria-current={active ? "page" : undefined}
                  className={cn(
                    "relative flex h-16 items-center px-3.5 text-sm font-medium transition-colors",
                    active ? "text-ink font-semibold" : "text-muted hover:text-ink"
                  )}
                >
                  {t(l.key)}
                  {active && (
                    <motion.span
                      layoutId="nav-underline"
                      className="absolute inset-x-3 bottom-0 h-[2px] rounded-full bg-green"
                      transition={{ type: "spring", stiffness: 300, damping: 30 }}
                    />
                  )}
                </Link>
              );
            })}
          </nav>

          <div className="ml-auto flex items-center gap-2 lg:ml-0">
            <div className="hidden sm:block">
              <LanguageToggle />
            </div>
            <ThemeToggle />

            {/* Primary Action Button */}
            <Button asChild className="hidden bg-green text-white hover:bg-green/90 sm:inline-flex" size="sm">
              <Link href={authed ? "/dashboard/create-post" : "/login"}>
                <Plus className="mr-1.5 h-4 w-4" />
                {t("shareIdea")}
              </Link>
            </Button>

            {/* User Auth Section */}
            {!mounted ? (
              <Skeleton className="hidden h-9 w-24 lg:block" />
            ) : authed ? (
              <>
                <NotificationBell />
                <UserMenu />
              </>
            ) : (
              <div className="hidden items-center gap-2 lg:flex">
                <Button asChild variant="ghost" size="sm">
                  <Link href="/login">{t("login")}</Link>
                </Button>
              </div>
            )}

            <Button
              variant="ghost"
              size="icon"
              className="lg:hidden"
              aria-label={t("openMenu")}
              aria-expanded={drawerOpen}
              onClick={() => setDrawerOpen(true)}
            >
              <Menu className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </header>

      <MobileNav open={drawerOpen} onOpenChange={setDrawerOpen} />
    </>
  );
}
