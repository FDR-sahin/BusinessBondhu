import { cva, type VariantProps } from "class-variance-authority";
import * as React from "react";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center gap-1 rounded-lg px-2.5 py-0.5 text-xs font-medium leading-5 transition-colors",
  {
    variants: {
      variant: {
        default: "bg-primary-soft text-primary-soft-foreground",
        secondary: "bg-secondary-soft text-secondary-soft-foreground",
        success: "bg-success-soft text-success-soft-foreground",
        warning: "bg-warning-soft text-warning-soft-foreground",
        danger: "bg-danger-soft text-danger-soft-foreground",
        muted: "bg-border/60 text-ink-secondary",
        outline: "border border-border text-ink-secondary",
        // Solid + blur: for overlays on images (category badge on post card)
        overlay: "bg-surface/90 text-foreground shadow-sm backdrop-blur",
      },
    },
    defaultVariants: { variant: "default" },
  },
);

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement>, VariantProps<typeof badgeVariants> {}

export function Badge({ className, variant, ...props }: BadgeProps) {
  return <span className={cn(badgeVariants({ variant }), className)} {...props} />;
}
