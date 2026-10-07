"use client";

import { useInView } from "framer-motion";
import { useRef, type ReactNode } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

interface ChartCardProps {
  title: string;
  description?: string;
  /** Plain-text summary for screen readers (charts are SVG). */
  summary: string;
  height?: number;
  /** On narrow screens the chart scrolls sideways instead of squashing its labels. */
  minWidth?: number;
  empty?: boolean;
  footer?: ReactNode;
  className?: string;
  children: ReactNode;
}

/**
 * The chart is only mounted once the card scrolls into view, so Recharts'
 * entrance animation plays when people actually see it.
 */
export function ChartCard({ title, description, summary, height = 300, minWidth, empty, footer, className, children }: ChartCardProps) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });

  return (
    <Card className={cn("flex flex-col", className)}>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        {description && <CardDescription>{description}</CardDescription>}
      </CardHeader>
      <CardContent className="flex-1">
        <div ref={ref} className="overflow-x-auto">
          <div role="img" aria-label={`${title}: ${summary}`} style={{ height, minWidth }}>
            {empty ? (
              <p className="flex h-full items-center justify-center text-ink-secondary">এখনো পর্যাপ্ত তথ্য নেই</p>
            ) : inView ? (
              children
            ) : (
              <Skeleton className="h-full w-full" />
            )}
          </div>
        </div>
        {footer}
      </CardContent>
    </Card>
  );
}
