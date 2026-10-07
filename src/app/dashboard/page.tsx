import type { Metadata } from "next";
import { OverviewView } from "@/components/dashboard/overview-view";

export const metadata: Metadata = { title: "ওভারভিউ" };

export default function DashboardPage() {
  return <OverviewView />;
}
