"use client";

import * as SliderPrimitive from "@radix-ui/react-slider";
import * as React from "react";
import { cn } from "@/lib/utils";

/** Supports single value or a [min, max] range: renders one thumb per value. */
export const Slider = React.forwardRef<
  React.ElementRef<typeof SliderPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof SliderPrimitive.Root>
>(({ className, ...props }, ref) => {
  const values = props.value ?? props.defaultValue ?? [0];
  return (
    <SliderPrimitive.Root ref={ref} className={cn("relative flex h-6 w-full touch-none select-none items-center", className)} {...props}>
      <SliderPrimitive.Track className="relative h-1.5 w-full grow overflow-hidden rounded-full bg-border">
        <SliderPrimitive.Range className="absolute h-full bg-primary" />
      </SliderPrimitive.Track>
      {values.map((_, i) => (
        <SliderPrimitive.Thumb
          key={i}
          aria-label={values.length > 1 ? (i === 0 ? "সর্বনিম্ন" : "সর্বোচ্চ") : undefined}
          className="block h-5 w-5 rounded-full border-2 border-primary bg-surface shadow-sm transition-transform hover:scale-110 disabled:pointer-events-none disabled:opacity-50"
        />
      ))}
    </SliderPrimitive.Root>
  );
});
Slider.displayName = "Slider";
