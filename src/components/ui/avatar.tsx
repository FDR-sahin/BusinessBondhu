"use client";

import * as AvatarPrimitive from "@radix-ui/react-avatar";
import * as React from "react";
import { User } from "lucide-react";
import { cn, getInitials } from "@/lib/utils";

export const Avatar = React.forwardRef<
  React.ElementRef<typeof AvatarPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof AvatarPrimitive.Root>
>(({ className, ...props }, ref) => (
  <AvatarPrimitive.Root ref={ref} className={cn("relative flex h-10 w-10 shrink-0 overflow-hidden rounded-full", className)} {...props} />
));
Avatar.displayName = "Avatar";

export const AvatarImage = React.forwardRef<
  React.ElementRef<typeof AvatarPrimitive.Image>,
  React.ComponentPropsWithoutRef<typeof AvatarPrimitive.Image>
>(({ className, alt = "", ...props }, ref) => (
  <AvatarPrimitive.Image ref={ref} alt={alt} className={cn("aspect-square h-full w-full object-cover", className)} {...props} />
));
AvatarImage.displayName = "AvatarImage";

export const AvatarFallback = React.forwardRef<
  React.ElementRef<typeof AvatarPrimitive.Fallback>,
  React.ComponentPropsWithoutRef<typeof AvatarPrimitive.Fallback>
>(({ className, ...props }, ref) => (
  <AvatarPrimitive.Fallback ref={ref} className={cn("flex h-full w-full items-center justify-center bg-emerald-100 text-sm font-semibold text-emerald-800", className)} {...props} />
));
AvatarFallback.displayName = "AvatarFallback";

/** One-liner: <UserAvatar name="রহিম" src={url} className="h-8 w-8" /> */
export function UserAvatar({ name, src, className }: { name?: string; src?: string; className?: string }) {
  const initials = getInitials(name);
  return (
    <Avatar className={className}>
      {src && <AvatarImage src={src} alt={name ?? "ব্যবহারকারী"} />}
      <AvatarFallback>
        {initials ? initials : <User className="h-4 w-4 text-emerald-700" aria-hidden />}
      </AvatarFallback>
    </Avatar>
  );
}

/** Overlapping avatars with a "+N" overflow chip. */
export function AvatarGroup({ users, max = 4, className }: { users: { name?: string; src?: string }[]; max?: number; className?: string }) {
  const shown = users.slice(0, max);
  const extra = users.length - shown.length;
  return (
    <div className={cn("flex -space-x-2", className)}>
      {shown.map((u, i) => (
        <UserAvatar key={i} name={u.name} src={u.src} className="h-8 w-8 ring-2 ring-surface" />
      ))}
      {extra > 0 && (
        <span className="flex h-8 w-8 items-center justify-center rounded-full bg-border text-xs font-medium ring-2 ring-surface">+{extra}</span>
      )}
    </div>
  );
}
