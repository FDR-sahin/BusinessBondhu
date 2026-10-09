// "use client";

// import { LayoutDashboard, LogOut, Settings, User as UserIcon, X } from "lucide-react";
// import Link from "next/link";
// import { usePathname } from "next/navigation";
// import { Button } from "@/components/ui/button";
// import { Drawer, DrawerClose } from "@/components/ui/drawer";
// import { UserAvatar } from "@/components/ui/avatar";
// import { LanguageToggle } from "@/components/shared/language-toggle";
// import { Logo } from "@/components/shared/logo";
// import { ThemeToggle } from "@/components/shared/theme-toggle";
// import { useLogout } from "@/hooks/use-logout";
// import { useMounted } from "@/hooks/use-mounted";
// import { NAV_LINKS } from "@/lib/constants";
// import { useT } from "@/lib/i18n";
// import { cn } from "@/lib/utils";
// import { useAuthStore, useIsAuthenticated } from "@/store/auth-store";

// export function MobileNav({ open, onOpenChange }: { open: boolean; onOpenChange: (o: boolean) => void }) {
//   const pathname = usePathname();
//   const t = useT();
//   const mounted = useMounted();
//   const authed = useIsAuthenticated();
//   const user = useAuthStore((s) => s.user);
//   const logout = useLogout();
//   const isActive = (href: string) => (href === "/" ? pathname === "/" : pathname.startsWith(href));
//   const accountLinks = [
//     { href: "/dashboard", label: t("dashboard"), icon: LayoutDashboard },
//     { href: "/dashboard/profile", label: t("profile"), icon: UserIcon },
//     { href: "/dashboard/settings", label: t("settings"), icon: Settings },
//   ];

//   return (
//     <Drawer open={open} onOpenChange={onOpenChange} title={t("mainMenu")}>
//       <div className="flex h-16 items-center justify-between border-b border-border px-4">
//         <Logo />
//         <DrawerClose asChild>
//           <Button variant="ghost" size="icon" aria-label={t("closeMenu")}><X className="h-5 w-5" /></Button>
//         </DrawerClose>
//       </div>

//       <nav aria-label={t("mainMenu")} className="flex-1 space-y-1 overflow-y-auto p-4">
//         {NAV_LINKS.map((l) => (
//           <Link
//             key={l.href}
//             href={l.href}
//             aria-current={isActive(l.href) ? "page" : undefined}
//             className={cn("flex h-12 items-center rounded-lg px-3 text-base font-medium transition-colors", isActive(l.href) ? "bg-primary-soft text-primary-soft-foreground" : "text-ink-secondary hover:bg-primary-soft hover:text-primary-soft-foreground")}
//           >
//             {t(l.key)}
//           </Link>
//         ))}

//         {mounted && authed && (
//           <div className="mt-4 space-y-1 border-t border-border pt-4">
//             <div className="flex items-center gap-3 px-3 pb-2">
//               <UserAvatar name={user?.name} src={user?.avatar} className="h-10 w-10" />
//               <div className="min-w-0">
//                 <p className="line-clamp-1 font-medium">{user?.name}</p>
//                 <p className="line-clamp-1 text-sm text-ink-secondary">{user?.email}</p>
//               </div>
//             </div>
//             {accountLinks.map(({ href, label, icon: Icon }) => (
//               <Link key={href} href={href} className="flex h-11 items-center gap-3 rounded-lg px-3 text-base text-ink-secondary transition-colors hover:bg-primary-soft hover:text-primary-soft-foreground">
//                 <Icon className="h-4 w-4" />{label}
//               </Link>
//             ))}
//             <button onClick={() => void logout()} className="flex h-11 w-full items-center gap-3 rounded-lg px-3 text-base text-danger transition-colors hover:bg-danger/10">
//               <LogOut className="h-4 w-4" />{t("logout")}
//             </button>
//           </div>
//         )}
//       </nav>

//       <div className="space-y-4 border-t border-border p-4">
//         {mounted && !authed && (
//           <div className="grid grid-cols-2 gap-2">
//             <Button asChild variant="outline" size="lg"><Link href="/login">{t("login")}</Link></Button>
//             <Button asChild size="lg"><Link href="/signup">{t("signup")}</Link></Button>
//           </div>
//         )}
//         <div className="flex items-center justify-between">
//           <LanguageToggle />
//           <ThemeToggle />
//         </div>
//       </div>
//     </Drawer>
//   );
// }


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

  {/* আপনার /public/images/ ফোল্ডারে বাংলাদেশের একটি হালকা মানচিত্রের ছবি (bd-map-faint.png) রাখুন। SVG হলে আরও ভালো। */}
  const mapBackgroundStyle: React.CSSProperties = {
    backgroundImage: "url('/images/bd-map-faint.png')", /* ছবির পাথ */
    backgroundSize: "cover", /* পুরো ড্রয়ার কভার করবে */
    backgroundPosition: "center", /* মাঝখানে থাকবে */
    backgroundRepeat: "no-repeat",
    opacity: 0.08, /* মানচিত্রটি কত হালকা হবে (০.০ থেকে ১.০) */
    position: "absolute",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    zIndex: -1, /* সব কন্টেন্টের পেছনে থাকবে */
  };

  return (
    <Drawer open={open} onOpenChange={onOpenChange} title={t("mainMenu")}>
      <div className="relative flex h-full flex-col">
        {/* Background Map Layer */}
        <div style={mapBackgroundStyle} aria-hidden="true" />

        {/* Header (Map faint z-index rule keeps it below this) */}
        <div className="flex h-16 items-center justify-between border-b border-border px-4 bg-background/90 backdrop-blur-sm relative z-10">
          <Logo />
          <DrawerClose asChild>
            <Button variant="ghost" size="icon" aria-label={t("closeMenu")}>
              <X className="h-5 w-5" />
            </Button>
          </DrawerClose>
        </div>

        {/* Navigation Content (Relative with z-index to stay above map) */}
        <nav aria-label={t("mainMenu")} className="flex-1 space-y-1 overflow-y-auto p-4 relative z-10">
          {NAV_LINKS.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              aria-current={isActive(l.href) ? "page" : undefined}
              className={cn(
                "flex h-12 items-center rounded-lg px-3 text-base font-medium transition-colors",
                isActive(l.href)
                  ? "bg-primary-soft text-primary-soft-foreground"
                  : "text-ink-secondary hover:bg-primary-soft hover:text-primary-soft-foreground"
              )}
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
                <Link
                  key={href}
                  href={href}
                  className="flex h-11 items-center gap-3 rounded-lg px-3 text-base text-ink-secondary transition-colors hover:bg-primary-soft hover:text-primary-soft-foreground"
                >
                  <Icon className="h-4 w-4" />
                  {label}
                </Link>
              ))}
              <button
                onClick={() => void logout()}
                className="flex h-11 w-full items-center gap-3 rounded-lg px-3 text-base text-danger transition-colors hover:bg-danger/10"
              >
                <LogOut className="h-4 w-4" />
                {t("logout")}
              </button>
            </div>
          )}
        </nav>

        {/* Footer (Relative with z-index to stay above map) */}
        <div className="space-y-4 border-t border-border p-4 bg-background/90 backdrop-blur-sm relative z-10">
          {mounted && !authed && (
            <div className="grid grid-cols-2 gap-2">
              <Button asChild variant="outline" size="lg">
                <Link href="/login">{t("login")}</Link>
              </Button>
              <Button asChild size="lg">
                <Link href="/signup">{t("signup")}</Link>
              </Button>
            </div>
          )}
          <div className="flex items-center justify-between">
            <LanguageToggle />
            <ThemeToggle />
          </div>
        </div>
      </div>
    </Drawer>
  );
}

