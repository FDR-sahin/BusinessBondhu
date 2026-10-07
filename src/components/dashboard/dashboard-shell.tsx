"use client";

import { LogOut, MoreHorizontal, Plus, Search, X } from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState, type FormEvent, type ReactNode } from "react";
import { NotificationBell } from "@/components/layout/notification-bell";
import { UserMenu } from "@/components/layout/user-menu";
import { Logo } from "@/components/shared/logo";
import { ThemeToggle } from "@/components/shared/theme-toggle";
import { Button } from "@/components/ui/button";
import { Drawer, DrawerClose } from "@/components/ui/drawer";
import { Input } from "@/components/ui/input";
import { useLogout } from "@/hooks/use-logout";
import { useUnreadCount } from "@/hooks/use-notifications";
import { DASHBOARD_NAV, dashboardTitle, isNavActive } from "@/lib/dashboard";
import { cn, toBanglaNumber } from "@/lib/utils";

function UnreadDot({ href }: { href: string }) {
  const { data: count = 0 } = useUnreadCount();
  if (href !== "/dashboard/notifications" || count <= 0) return null;
  return (
    <span className="ml-auto flex h-5 min-w-5 items-center justify-center rounded-full bg-danger px-1 text-xs font-semibold leading-none text-danger-foreground">
      {count > 9 ? `${toBanglaNumber(9)}+` : toBanglaNumber(count)}
    </span>
  );
}

function NavList({ onNavigate }: { onNavigate?: () => void }) {
  const pathname = usePathname();
  return (
    <ul className="space-y-1">
      {DASHBOARD_NAV.map((item) => {
        const active = isNavActive(item, pathname);
        const Icon = item.icon;
        return (
          <li key={item.href}>
            <Link
              href={item.href}
              onClick={onNavigate}
              aria-current={active ? "page" : undefined}
              className={cn(
                "flex h-11 items-center gap-3 rounded-lg px-3 text-sm font-medium transition-colors",
                active ? "bg-primary-soft text-primary-soft-foreground" : "text-ink-secondary hover:bg-muted hover:text-foreground",
              )}
            >
              <Icon className="h-4 w-4 shrink-0" aria-hidden />
              {item.label}
              <UnreadDot href={item.href} />
            </Link>
          </li>
        );
      })}
    </ul>
  );
}

export function DashboardShell({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const logout = useLogout();
  const { data: unread = 0 } = useUnreadCount();
  const [moreOpen, setMoreOpen] = useState(false);
  const [query, setQuery] = useState("");

  // Topbar search looks through YOUR posts: /dashboard/my-posts?q=...
  function onSearch(e: FormEvent) {
    e.preventDefault();
    const q = query.trim();
    router.push(q ? `/dashboard/my-posts?q=${encodeURIComponent(q)}` : "/dashboard/my-posts");
  }

  // Mobile bottom bar: 4 shortcuts + "More" (the drawer holds all 9 links).
  const bottom = [
    { href: "/dashboard", label: "ওভারভিউ", icon: DASHBOARD_NAV[0]!.icon, exact: true },
    { href: "/dashboard/my-posts", label: "পোস্ট", icon: DASHBOARD_NAV[1]!.icon },
    { href: "/dashboard/create-post", label: "নতুন", icon: Plus, primary: true },
    { href: "/dashboard/notifications", label: "নোটিফিকেশন", icon: DASHBOARD_NAV[6]!.icon, badge: unread },
  ];

  return (
    <div className="min-h-screen lg:grid lg:grid-cols-[16rem_minmax(0,1fr)]">
      {/* ---------- Desktop sidebar ---------- */}
      <aside className="sticky top-0 hidden h-screen flex-col border-r border-border bg-surface lg:flex" aria-label="ড্যাশবোর্ড মেনু">
        <div className="flex h-16 shrink-0 items-center px-5"><Logo /></div>
        <div className="px-4 pb-4">
          <Button asChild className="w-full"><Link href="/dashboard/create-post"><Plus aria-hidden /> নতুন পোস্ট</Link></Button>
        </div>
        <nav className="flex-1 overflow-y-auto px-4 pb-4" aria-label="ড্যাশবোর্ড নেভিগেশন"><NavList /></nav>
        <div className="space-y-1 border-t border-border p-4">
          <Link href="/" className="flex h-10 items-center rounded-lg px-3 text-sm text-ink-secondary transition-colors hover:bg-muted hover:text-foreground">সাইটে ফিরে যান</Link>
          <button onClick={() => void logout()} className="flex h-10 w-full items-center gap-3 rounded-lg px-3 text-sm text-danger transition-colors hover:bg-danger-soft">
            <LogOut className="h-4 w-4" aria-hidden />লগআউট
          </button>
        </div>
      </aside>

      <div className="min-w-0">
        {/* ---------- Topbar ---------- */}
        <header className="sticky top-0 z-30 border-b border-border bg-background/80 backdrop-blur-md">
          <div className="flex h-16 items-center gap-3 px-4 md:px-6 lg:px-8">
            <div className="lg:hidden"><Logo showText={false} /></div>
            <h1 className="min-w-0 truncate text-lg font-semibold md:text-xl">{dashboardTitle(pathname)}</h1>

            <form onSubmit={onSearch} role="search" className="relative ml-auto hidden w-full max-w-xs md:block">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-secondary" aria-hidden />
              <Input type="search" value={query} onChange={(e) => setQuery(e.target.value)} placeholder="আমার পোস্ট খুঁজুন…" aria-label="আমার পোস্ট খুঁজুন" className="h-10 pl-9" />
            </form>

            <div className="ml-auto flex items-center gap-1.5 md:ml-0">
              <ThemeToggle />
              <NotificationBell />
              <UserMenu />
            </div>
          </div>
        </header>

        <main id="main" className="mx-auto w-full max-w-6xl px-4 py-6 pb-28 md:px-6 lg:px-8 lg:pb-10">{children}</main>
      </div>

      {/* ---------- Mobile bottom navigation ---------- */}
      <nav
        aria-label="দ্রুত মেনু"
        className="fixed inset-x-0 bottom-0 z-40 border-t border-border bg-surface/95 pb-[env(safe-area-inset-bottom)] backdrop-blur lg:hidden"
      >
        <ul className="grid grid-cols-5">
          {bottom.map(({ href, label, icon: Icon, exact, primary, badge }) => {
            const active = exact ? pathname === href : pathname.startsWith(href);
            return (
              <li key={href}>
                <Link href={href} aria-current={active ? "page" : undefined} className={cn("relative flex h-16 flex-col items-center justify-center gap-0.5 text-sm", active ? "text-link" : "text-ink-secondary")}>
                  {primary ? (
                    <span className="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-md"><Icon className="h-5 w-5" aria-hidden /></span>
                  ) : (
                    <Icon className="h-5 w-5" aria-hidden />
                  )}
                  {!primary && <span className="line-clamp-1 max-w-full px-1 text-xs">{label}</span>}
                  {badge ? <span className="absolute right-1/4 top-2 flex h-5 min-w-5 items-center justify-center rounded-full bg-danger px-1 text-xs font-semibold leading-none text-danger-foreground">{badge > 9 ? `${toBanglaNumber(9)}+` : toBanglaNumber(badge)}</span> : null}
                </Link>
              </li>
            );
          })}
          <li>
            <button onClick={() => setMoreOpen(true)} className="flex h-16 w-full flex-col items-center justify-center gap-0.5 text-ink-secondary" aria-haspopup="dialog">
              <MoreHorizontal className="h-5 w-5" aria-hidden /><span className="text-xs">আরও</span>
            </button>
          </li>
        </ul>
      </nav>

      <Drawer open={moreOpen} onOpenChange={setMoreOpen} title="ড্যাশবোর্ড মেনু">
        <div className="flex h-16 shrink-0 items-center justify-between border-b border-border px-4">
          <Logo />
          <DrawerClose asChild><Button variant="ghost" size="icon" aria-label="মেনু বন্ধ করুন"><X className="h-5 w-5" /></Button></DrawerClose>
        </div>
        <nav className="flex-1 overflow-y-auto p-4" aria-label="ড্যাশবোর্ড নেভিগেশন"><NavList onNavigate={() => setMoreOpen(false)} /></nav>
        <div className="space-y-1 border-t border-border p-4">
          <Link href="/" className="flex h-10 items-center rounded-lg px-3 text-sm text-ink-secondary hover:bg-muted">সাইটে ফিরে যান</Link>
          <button onClick={() => void logout()} className="flex h-10 w-full items-center gap-3 rounded-lg px-3 text-sm text-danger hover:bg-danger-soft"><LogOut className="h-4 w-4" aria-hidden />লগআউট</button>
        </div>
      </Drawer>
    </div>
  );
}
