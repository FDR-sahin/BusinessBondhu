"use client";

import { motion } from "framer-motion";
import { Menu } from "lucide-react";
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

export function Header() {
  const pathname = usePathname();
  const t = useT();
  const mounted = useMounted();
  const authed = useIsAuthenticated();
  const [scrolled, setScrolled] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);

  // Shadow + more opaque background once the page scrolls.
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Close the drawer after navigating.
  useEffect(() => setDrawerOpen(false), [pathname]);

  const isActive = (href: string) => (href === "/" ? pathname === "/" : pathname.startsWith(href));

  return (
    <>
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded-lg focus:bg-primary focus:px-4 focus:py-2 focus:text-primary-foreground"
      >
        {t("skipToContent")}
      </a>

      <header
        className={cn(
          "sticky top-0 z-40 w-full border-b border-border backdrop-blur-md transition-[background-color,box-shadow] duration-200",
          scrolled ? "bg-background/90 shadow-sm" : "bg-background/70",
        )}
      >
        <div className="container-page flex h-16 items-center gap-4">
          <Logo />

          {/* Center nav (desktop). Active underline glides between links via layoutId. */}
          <nav aria-label={t("mainMenu")} className="hidden flex-1 items-center justify-center lg:flex">
            {NAV_LINKS.map((l) => {
              const active = isActive(l.href);
              return (
                <Link
                  key={l.href}
                  href={l.href}
                  aria-current={active ? "page" : undefined}
                  className={cn("relative flex h-16 items-center px-3.5 text-sm font-medium transition-colors", active ? "text-foreground" : "text-ink-secondary hover:text-foreground")}
                >
                  {t(l.key)}
                  {active && (
                    <motion.span
                      layoutId="nav-underline"
                      className="absolute inset-x-3.5 bottom-0 h-0.5 rounded-full bg-secondary"
                      transition={{ type: "spring", stiffness: 300, damping: 30 }}
                    />
                  )}
                </Link>
              );
            })}
          </nav>

          <div className="ml-auto flex items-center gap-1.5 sm:gap-2 lg:ml-0">
            <div className="hidden sm:block"><LanguageToggle /></div>
            <ThemeToggle />

            {/* Auth area waits for mount: session lives in localStorage, so SSR can't know it. */}
            {!mounted ? (
              <Skeleton className="hidden h-10 w-32 lg:block" />
            ) : authed ? (
              <>
                <NotificationBell />
                <UserMenu />
              </>
            ) : (
              <div className="hidden items-center gap-2 lg:flex">
                <Button asChild variant="ghost"><Link href="/login">{t("login")}</Link></Button>
                <Button asChild><Link href="/signup">{t("signup")}</Link></Button>
              </div>
            )}

            <Button variant="ghost" size="icon" className="lg:hidden" aria-label={t("openMenu")} aria-expanded={drawerOpen} onClick={() => setDrawerOpen(true)}>
              <Menu className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </header>

      <MobileNav open={drawerOpen} onOpenChange={setDrawerOpen} />
    </>
  );
}
