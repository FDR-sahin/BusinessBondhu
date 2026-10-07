import type { Metadata } from "next";
import { SettingsView } from "@/components/dashboard/settings-view";

export const metadata: Metadata = { title: "সেটিংস" };

export default function Page() {
  return <SettingsView />;
}
