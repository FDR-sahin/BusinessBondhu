"use client";

import { LayoutDashboard, LogOut, Settings, User as UserIcon, X } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Drawer, DrawerClose } from "@/components/ui/drawer";
import { UserAvatar } from "@/components/ui/avatar";
import { LanguageToggle } from "@/components/shared/language-toggle";
import { Logo } from "@/components/shared/logo";
import { ThemeToggle } from "@/components/shared/theme-toggle";
import { useLogout } from "@/hooks/use-logout";
import { useMounted } from "@/hooks/use-mounted";
import { NAV_LINKS } from "@/lib/constants";
import { useT } from "@/lib/i18n";
import { cn } from "@/lib/utils";
import { useAuthStore, useIsAuthenticated } from "@/store/auth-store";

export function MobileNav({ open, onOpenChange }: { open: boolean; onOpenChange: (o: boolean) => void }) {
  const pathname = usePathname();
  const t = useT();
  const mounted = useMounted();
  const authed = useIsAuthenticated();
  const user = useAuthStore((s) => s.user);
  const logout = useLogout();
  const isActive = (href: string) => (href === "/" ? pathname === "/" : pathname.startsWith(href));
  const accountLinks = [
    { href: "/dashboard", label: t("dashboard"), icon: LayoutDashboard },
    { href: "/dashboard/profile", label: t("profile"), icon: UserIcon },
    { href: "/dashboard/settings", label: t("settings"), icon: Settings },
  ];

  return (
    <Drawer open={open} onOpenChange={onOpenChange} title={t("mainMenu")}>
      <div className="flex h-16 items-center justify-between border-b border-border px-4">
        <Logo />
        <DrawerClose asChild>
          <Button variant="ghost" size="icon" aria-label={t("closeMenu")}><X className="h-5 w-5" /></Button>
        </DrawerClose>
      </div>

      <nav aria-label={t("mainMenu")} className="flex-1 space-y-1 overflow-y-auto p-4">
        {NAV_LINKS.map((l) => (
          <Link
            key={l.href}
            href={l.href}
            aria-current={isActive(l.href) ? "page" : undefined}
            className={cn("flex h-12 items-center rounded-lg px-3 text-base font-medium transition-colors", isActive(l.href) ? "bg-primary-soft text-primary-soft-foreground" : "text-ink-secondary hover:bg-muted hover:text-foreground")}
          >
            {t(l.key)}
          </Link>
        ))}

        {mounted && authed && (
          <div className="mt-4 space-y-1 border-t border-border pt-4">
            <div className="flex items-center gap-3 px-3 pb-2">
              <UserAvatar name={user?.name} src={user?.avatar} className="h-10 w-10" />
              <div className="min-w-0">
                <p className="line-clamp-1 font-medium">{user?.name}</p>
                <p className="line-clamp-1 text-sm text-ink-secondary">{user?.email}</p>
              </div>
            </div>
            {accountLinks.map(({ href, label, icon: Icon }) => (
              <Link key={href} href={href} className="flex h-11 items-center gap-3 rounded-lg px-3 text-base text-ink-secondary transition-colors hover:bg-muted hover:text-foreground">
                <Icon className="h-4 w-4" />{label}
              </Link>
            ))}
            <button onClick={() => void logout()} className="flex h-11 w-full items-center gap-3 rounded-lg px-3 text-base text-danger transition-colors hover:bg-danger/10">
              <LogOut className="h-4 w-4" />{t("logout")}
            </button>
          </div>
        )}
      </nav>

      <div className="space-y-4 border-t border-border p-4">
        {mounted && !authed && (
          <div className="grid grid-cols-2 gap-2">
            <Button asChild variant="outline" size="lg"><Link href="/login">{t("login")}</Link></Button>
            <Button asChild size="lg"><Link href="/signup">{t("signup")}</Link></Button>
          </div>
        )}
        <div className="flex items-center justify-between">
          <LanguageToggle />
          <ThemeToggle />
        </div>
      </div>
    </Drawer>
  );
}
