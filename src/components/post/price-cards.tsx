"use client";

import { ShoppingBag, Store, Warehouse } from "lucide-react";
import { Stagger, StaggerItem } from "@/components/shared/motion";
import { Card } from "@/components/ui/card";
import { formatBDT } from "@/lib/utils";
import type { PostDetail } from "@/types";

/** The three price cards (spec: very important). */
export function PriceCards({ post }: { post: Pick<PostDetail, "wholesalePrice" | "retailPrice" | "retailSellPrice"> }) {
  const items = [
    { label: "পাইকারি দাম", value: post.wholesalePrice, icon: Warehouse },
    { label: "খুচরা দাম", value: post.retailPrice, icon: Store },
    { label: "রিটেইল সেল", value: post.retailSellPrice, icon: ShoppingBag },
  ];

  return (
    <Stagger className="grid gap-4 sm:grid-cols-3">
      {items.map(({ label, value, icon: Icon }) => (
        <StaggerItem key={label}>
          <Card className="flex h-full flex-col gap-3 p-5 transition-shadow hover:shadow-md">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-ink-secondary">{label}</span>
              <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary-soft text-primary-soft-foreground">
                <Icon className="h-4 w-4" aria-hidden />
              </span>
            </div>
            <p className="text-2xl font-bold tracking-tight md:text-3xl">{value != null ? formatBDT(value) : "—"}</p>
          </Card>
        </StaggerItem>
      ))}
    </Stagger>
  );
}
