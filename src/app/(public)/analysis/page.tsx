import type { Metadata } from "next";
import { AnalysisView } from "@/components/analysis/analysis-view";

export const metadata: Metadata = {
  title: "বিশ্লেষণ",
  description: "বিভাগ, জেলা ও ক্যাটাগরি অনুযায়ী পোস্টের পরিসংখ্যান এবং পাইকারি-খুচরা দামের গতি।",
};

export default function AnalysisPage() {
  return <AnalysisView />;
}
