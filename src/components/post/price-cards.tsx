"use client";

import { ShoppingBag, Store, Warehouse } from "lucide-react";
import { Stagger, StaggerItem } from "@/components/shared/motion";
import { Card } from "@/components/ui/card";
import { formatBDT, formatPriceRange } from "@/lib/utils";
import type { PostDetail } from "@/types";

/** The price cards displaying price ranges */
export function PriceCards({ post }: { post: Partial<PostDetail> }) {
  const wholesaleDisplay = formatPriceRange(post.wholesalePrice, post.wholesalePriceMax, post.wholesalePriceText);
  const retailDisplay = formatPriceRange(post.retailPrice, post.retailPriceMax, post.retailPriceText);
  
  const profitMargin = post.wholesalePrice && post.retailPrice ? Math.max(0, post.retailPrice - post.wholesalePrice) : 0;

  const items = [
    { label: "পাইকারি দামের রেঞ্জ", display: wholesaleDisplay, icon: Warehouse },
    { label: "খুচরা বিক্রয় মূল্যরেঞ্জ", display: retailDisplay, icon: Store },
    { label: "আনুমানিক প্রফিট মার্জিন", display: profitMargin > 0 ? formatBDT(profitMargin) : "মার্জিন লাভজনক", icon: ShoppingBag },
  ];

  return (
    <Stagger className="grid gap-4 sm:grid-cols-3">
      {items.map(({ label, display, icon: Icon }) => (
        <StaggerItem key={label}>
          <Card className="flex h-full flex-col gap-3 p-5 transition-shadow hover:shadow-md">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-ink-secondary">{label}</span>
              <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary-soft text-primary-soft-foreground">
                <Icon className="h-4 w-4" aria-hidden />
              </span>
            </div>
            <p className="text-xl font-bold font-bangla tracking-normal md:text-2xl text-ink leading-snug">{display}</p>
          </Card>
        </StaggerItem>
      ))}
    </Stagger>
  );
}
