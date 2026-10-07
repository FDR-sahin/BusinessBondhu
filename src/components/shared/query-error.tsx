"use client";

import { AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";

/** Compact error block with a retry button (pass query.refetch). */
export function QueryError({ onRetry, className }: { onRetry: () => void; className?: string }) {
  return (
    <EmptyState
      className={className}
      icon={AlertCircle}
      title="তথ্য লোড করা যায়নি"
      description="ইন্টারনেট সংযোগ পরীক্ষা করে আবার চেষ্টা করুন।"
      action={<Button variant="outline" onClick={onRetry}>আবার চেষ্টা করুন</Button>}
    />
  );
}
