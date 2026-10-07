import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";
import type { AnalysisData } from "@/types";

/** GET /stats/analysis -> AnalysisData (one request for the whole page). */
export function useAnalysis() {
  return useQuery({
    queryKey: ["stats", "analysis"],
    queryFn: async () => (await api.get<AnalysisData>("/stats/analysis")).data,
    staleTime: 5 * 60 * 1000,
  });
}
