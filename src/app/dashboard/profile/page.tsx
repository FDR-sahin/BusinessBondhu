import type { Metadata } from "next";
import { ProfileView } from "@/components/dashboard/profile-view";

export const metadata: Metadata = { title: "প্রোফাইল" };

export default function Page() {
  return <ProfileView />;
}
