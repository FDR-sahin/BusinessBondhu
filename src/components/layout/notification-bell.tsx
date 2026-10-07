"use client";

import { Bell } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useUnreadCount } from "@/hooks/use-notifications";
import { useT } from "@/lib/i18n";
import { toBanglaNumber } from "@/lib/utils";

export function NotificationBell() {
  const { data: count = 0 } = useUnreadCount();
  const t = useT();

  return (
    <Button asChild variant="ghost" size="icon" className="relative">
      <Link href="/dashboard/notifications" aria-label={count > 0 ? `${t("notifications")} (${toBanglaNumber(count)})` : t("notifications")}>
        <Bell className="h-5 w-5" />
        {count > 0 && (
          <span className="absolute -right-0.5 -top-0.5 flex h-5 min-w-5 items-center justify-center rounded-full bg-danger px-1 text-xs font-semibold leading-none text-danger-foreground">
            {count > 9 ? `${toBanglaNumber(9)}+` : toBanglaNumber(count)}
          </span>
        )}
      </Link>
    </Button>
  );
}
