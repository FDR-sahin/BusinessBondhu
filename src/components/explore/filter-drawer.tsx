"use client";

import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Drawer, DrawerClose } from "@/components/ui/drawer";
import { useT } from "@/lib/i18n";
import { toFormattedNumber } from "@/lib/utils";
import { useLangStore } from "@/store/lang-store";
import { FilterSidebar } from "./filter-sidebar";

type SidebarProps = React.ComponentProps<typeof FilterSidebar>;

interface FilterDrawerProps extends Omit<SidebarProps, "showTitle"> {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  resultCount?: number;
}

export function FilterDrawer({ open, onOpenChange, resultCount, ...sidebar }: FilterDrawerProps) {
  const t = useT();
  const lang = useLangStore((s) => s.lang);

  return (
    <Drawer open={open} onOpenChange={onOpenChange} title={t("filterTitle")}>
      <div className="flex h-16 shrink-0 items-center justify-between border-b border-line px-4">
        <h2 className="text-lg font-semibold text-ink">{t("filterTitle")}</h2>
        <DrawerClose asChild>
          <Button variant="ghost" size="icon" aria-label={lang === "bn" ? "বন্ধ করুন" : "Close"}><X className="h-5 w-5" /></Button>
        </DrawerClose>
      </div>
      <div className="flex-1 overflow-y-auto px-4 py-3">
        <FilterSidebar {...sidebar} showTitle={false} />
      </div>
      <div className="border-t border-line p-4">
        <Button size="lg" className="w-full bg-green text-white hover:bg-green/90" onClick={() => onOpenChange(false)}>
          {t("applyResults")}{resultCount !== undefined ? ` (${toFormattedNumber(resultCount, lang)})` : ""}
        </Button>
      </div>
    </Drawer>
  );
}
