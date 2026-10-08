import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { Loader2 } from "lucide-react";
import * as React from "react";
import { cn } from "@/lib/utils";

/**
 * Hover scale 1.02 / tap 0.98 (spec) done in CSS with `motion-safe:` so it
 * is automatically disabled for prefers-reduced-motion.
 */
export const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-lg text-sm font-medium transition-all duration-200 ease-out disabled:pointer-events-none disabled:opacity-50 motion-safe:hover:scale-[1.02] motion-safe:active:scale-[0.98] [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        primary: "bg-primary text-primary-foreground shadow-[inset_0_1px_0_0_rgb(255_255_255/0.14),0_1px_2px_0_rgb(15_23_42/0.25)] hover:bg-primary-hover",
        secondary: "bg-secondary text-secondary-foreground shadow-sm hover:bg-secondary/90",
        outline: "border border-border bg-surface text-foreground hover:bg-green/10 hover:text-green hover:border-green/40 dark:hover:bg-green/20 dark:hover:text-green-300",
        ghost: "text-foreground hover:bg-green/10 hover:text-green dark:hover:bg-green/20 dark:hover:text-green-300",
        danger: "bg-danger text-danger-foreground shadow-sm hover:bg-danger/90",
        link: "text-link underline-offset-4 hover:underline",
      },
      size: {
        sm: "h-9 px-3",
        md: "h-10 px-4",
        lg: "h-12 px-6 text-base",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: { variant: "primary", size: "md" },
  },
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  /** Render as the child element (e.g. <Link>) instead of <button>. */
  asChild?: boolean;
  /** Shows a spinner and disables the button. */
  loading?: boolean;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, loading = false, disabled, children, ...props }, ref) => {
    const classes = cn(buttonVariants({ variant, size }), className);

    // Slot needs exactly one child, so no spinner when asChild.
    if (asChild) {
      return (
        <Slot className={classes} ref={ref} {...props}>
          {children}
        </Slot>
      );
    }

    return (
      <button
        ref={ref}
        className={classes}
        disabled={disabled || loading}
        aria-busy={loading || undefined}
        {...props}
      >
        {loading && <Loader2 className="animate-spin" aria-hidden />}
        {children}
      </button>
    );
  },
);
Button.displayName = "Button";
