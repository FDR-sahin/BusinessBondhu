"use client";

import * as DialogPrimitive from "@radix-ui/react-dialog";
import { AnimatePresence, motion } from "framer-motion";
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

export const DrawerClose = DialogPrimitive.Close;

interface DrawerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  /** Read by screen readers only (Radix requires a title). */
  title: string;
  side?: "left" | "right";
  className?: string;
  children: ReactNode;
}

/**
 * Slide-in panel (spec: x -100% -> 0, spring 300/30).
 * Radix Dialog gives us focus trap, Esc to close, scroll lock and aria for free;
 * Framer Motion + forceMount gives the enter AND exit animation.
 */
export function Drawer({ open, onOpenChange, title, side = "left", className, children }: DrawerProps) {
  const offscreen = side === "left" ? "-100%" : "100%";

  return (
    <DialogPrimitive.Root open={open} onOpenChange={onOpenChange}>
      <AnimatePresence>
        {open && (
          <DialogPrimitive.Portal forceMount>
            <DialogPrimitive.Overlay asChild forceMount>
              <motion.div
                className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
              />
            </DialogPrimitive.Overlay>
            <DialogPrimitive.Content asChild forceMount>
              <motion.div
                className={cn(
                  "fixed inset-y-0 z-50 flex w-[85%] max-w-sm flex-col bg-surface shadow-lg",
                  side === "left" ? "left-0 border-r border-border" : "right-0 border-l border-border",
                  className,
                )}
                initial={{ x: offscreen }}
                animate={{ x: 0 }}
                exit={{ x: offscreen }}
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
              >
                <DialogPrimitive.Title className="sr-only">{title}</DialogPrimitive.Title>
                <DialogPrimitive.Description className="sr-only">{title}</DialogPrimitive.Description>
                {children}
              </motion.div>
            </DialogPrimitive.Content>
          </DialogPrimitive.Portal>
        )}
      </AnimatePresence>
    </DialogPrimitive.Root>
  );
}
