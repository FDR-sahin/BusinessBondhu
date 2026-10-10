import { Bell, Bookmark, BookOpen, FileText, Heart, LayoutDashboard, MessageSquare, Settings, ThumbsDown, User, type LucideIcon } from "lucide-react";
import type { BadgeProps } from "@/components/ui/badge";
import type { PostStatus } from "@/types";

import type { Lang } from "@/store/lang-store";

export interface DashboardNavItem {
  href: string;
  label: string;
  icon: LucideIcon;
  exact?: boolean;
}

export function getDashboardNav(lang: Lang = "bn"): DashboardNavItem[] {
  const isEn = lang === "en";
  return [
    { href: "/dashboard", label: isEn ? "Overview" : "ওভারভিউ", icon: LayoutDashboard, exact: true },
    { href: "/dashboard/my-posts", label: isEn ? "My Posts" : "আমার পোস্ট", icon: FileText },
    { href: "/dashboard/my-blogs", label: isEn ? "My Blogs" : "আমার ব্লগ", icon: BookOpen },
    { href: "/dashboard/likes", label: isEn ? "Likes" : "লাইক", icon: Heart },
    { href: "/dashboard/dislikes", label: isEn ? "Dislikes" : "ডিসলাইক", icon: ThumbsDown },
    { href: "/dashboard/comments", label: isEn ? "Comments" : "মন্তব্য", icon: MessageSquare },
    { href: "/dashboard/saved", label: isEn ? "Saved" : "সেভ করা", icon: Bookmark },
    { href: "/dashboard/notifications", label: isEn ? "Notifications" : "নোটিফিকেশন", icon: Bell },
    { href: "/dashboard/profile", label: isEn ? "Profile" : "প্রোফাইল", icon: User },
    { href: "/dashboard/settings", label: isEn ? "Settings" : "সেটিংস", icon: Settings },
  ];
}

export const DASHBOARD_NAV = getDashboardNav("bn");

export const isNavActive = (item: DashboardNavItem, pathname: string) =>
  item.exact ? pathname === item.href : pathname === item.href || pathname.startsWith(`${item.href}/`);

/** Title shown in the topbar. */
export function dashboardTitle(pathname: string, lang: Lang = "bn"): string {
  const isEn = lang === "en";
  if (pathname.endsWith("/create-post")) return isEn ? "New Post" : "নতুন পোস্ট";
  if (pathname.endsWith("/create-blog")) return isEn ? "Write Blog" : "ব্লগ লিখুন";
  if (pathname.endsWith("/my-blogs")) return isEn ? "My Blogs" : "আমার ব্লগ";
  if (/\/my-posts\/[^/]+\/edit$/.test(pathname)) return isEn ? "Edit Post" : "পোস্ট সম্পাদনা";
  const nav = getDashboardNav(lang);
  return nav.find((n) => isNavActive(n, pathname))?.label ?? (isEn ? "Dashboard" : "ড্যাশবোর্ড");
}

export const POST_STATUS: Record<PostStatus, { label: string; variant: BadgeProps["variant"] }> = {
  draft: { label: "খসড়া", variant: "muted" },
  pending: { label: "অপেক্ষমান", variant: "warning" },
  approved: { label: "অনুমোদিত", variant: "success" },
  rejected: { label: "বাতিল", variant: "danger" },
};
