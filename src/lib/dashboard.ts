import { Bell, Bookmark, FileText, Heart, LayoutDashboard, MessageSquare, Settings, ThumbsDown, User, type LucideIcon } from "lucide-react";
import type { BadgeProps } from "@/components/ui/badge";
import type { PostStatus } from "@/types";

export interface DashboardNavItem {
  href: string;
  label: string;
  icon: LucideIcon;
  exact?: boolean;
}

export const DASHBOARD_NAV: DashboardNavItem[] = [
  { href: "/dashboard", label: "ওভারভিউ", icon: LayoutDashboard, exact: true },
  { href: "/dashboard/my-posts", label: "আমার পোস্ট", icon: FileText },
  { href: "/dashboard/likes", label: "লাইক", icon: Heart },
  { href: "/dashboard/dislikes", label: "ডিসলাইক", icon: ThumbsDown },
  { href: "/dashboard/comments", label: "মন্তব্য", icon: MessageSquare },
  { href: "/dashboard/saved", label: "সেভ করা", icon: Bookmark },
  { href: "/dashboard/notifications", label: "নোটিফিকেশন", icon: Bell },
  { href: "/dashboard/profile", label: "প্রোফাইল", icon: User },
  { href: "/dashboard/settings", label: "সেটিংস", icon: Settings },
];

export const isNavActive = (item: DashboardNavItem, pathname: string) =>
  item.exact ? pathname === item.href : pathname === item.href || pathname.startsWith(`${item.href}/`);

/** Title shown in the topbar. */
export function dashboardTitle(pathname: string): string {
  if (pathname.endsWith("/create-post")) return "নতুন পোস্ট";
  if (/\/my-posts\/[^/]+\/edit$/.test(pathname)) return "পোস্ট সম্পাদনা";
  return DASHBOARD_NAV.find((n) => isNavActive(n, pathname))?.label ?? "ড্যাশবোর্ড";
}

export const POST_STATUS: Record<PostStatus, { label: string; variant: BadgeProps["variant"] }> = {
  draft: { label: "খসড়া", variant: "muted" },
  pending: { label: "অপেক্ষমান", variant: "warning" },
  approved: { label: "অনুমোদিত", variant: "success" },
  rejected: { label: "বাতিল", variant: "danger" },
};
