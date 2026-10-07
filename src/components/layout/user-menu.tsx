"use client";

import { LayoutDashboard, LogOut, Settings, User as UserIcon } from "lucide-react";
import Link from "next/link";
import { UserAvatar } from "@/components/ui/avatar";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { useLogout } from "@/hooks/use-logout";
import { useT } from "@/lib/i18n";
import { useAuthStore } from "@/store/auth-store";

/** Avatar dropdown: Dashboard, Profile, Settings, Logout (spec). */
export function UserMenu() {
  const user = useAuthStore((s) => s.user);
  const logout = useLogout();
  const t = useT();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger aria-label={t("accountMenu")} className="rounded-full transition-opacity hover:opacity-90">
        <UserAvatar name={user?.name} src={user?.avatar} className="h-9 w-9" />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuLabel>
          <p className="line-clamp-1">{user?.name ?? "—"}</p>
          {user?.email && <p className="line-clamp-1 text-sm font-normal text-ink-secondary">{user.email}</p>}
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild><Link href="/dashboard"><LayoutDashboard />{t("dashboard")}</Link></DropdownMenuItem>
        <DropdownMenuItem asChild><Link href="/dashboard/profile"><UserIcon />{t("profile")}</Link></DropdownMenuItem>
        <DropdownMenuItem asChild><Link href="/dashboard/settings"><Settings />{t("settings")}</Link></DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem destructive onSelect={() => void logout()}><LogOut />{t("logout")}</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
