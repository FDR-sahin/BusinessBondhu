"use client";

import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Drawer, DrawerClose } from "@/components/ui/drawer";
import { toBanglaNumber } from "@/lib/utils";
import { FilterSidebar } from "./filter-sidebar";

type SidebarProps = React.ComponentProps<typeof FilterSidebar>;

interface FilterDrawerProps extends Omit<SidebarProps, "showTitle"> {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  resultCount?: number;
}

/** Mobile filters. Changes apply live (URL-synced); the footer button just closes. */
export function FilterDrawer({ open, onOpenChange, resultCount, ...sidebar }: FilterDrawerProps) {
  return (
    <Drawer open={open} onOpenChange={onOpenChange} title="ফিল্টার">
      <div className="flex h-16 shrink-0 items-center justify-between border-b border-border px-4">
        <h2 className="text-lg font-semibold">ফিল্টার</h2>
        <DrawerClose asChild>
          <Button variant="ghost" size="icon" aria-label="বন্ধ করুন"><X className="h-5 w-5" /></Button>
        </DrawerClose>
      </div>
      <div className="flex-1 overflow-y-auto px-4 py-3">
        <FilterSidebar {...sidebar} showTitle={false} />
      </div>
      <div className="border-t border-border p-4">
        <Button size="lg" className="w-full" onClick={() => onOpenChange(false)}>
          ফলাফল দেখুন{resultCount !== undefined ? ` (${toBanglaNumber(resultCount)})` : ""}
        </Button>
      </div>
    </Drawer>
  );
}
