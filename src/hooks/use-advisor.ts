"use client";

import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { api, getErrorMessage } from "@/lib/api";
import type { AdvisorRequest, AdvisorResponse, AdvisorSuggestion } from "@/types";

/** POST /advisor/suggest -> { suggestions }. AI calls are slow, so allow 60s. */
export function useAdvisorSuggest() {
  return useMutation({
    mutationFn: async (req: AdvisorRequest) =>
      (await api.post<AdvisorResponse>("/advisor/suggest", req, { timeout: 60_000 })).data,
  });
}

/** POST /advisor/saved { suggestion, inputs } (login required) */
export function useSaveSuggestion() {
  return useMutation({
    mutationFn: (payload: { suggestion: AdvisorSuggestion; inputs: AdvisorRequest }) => api.post("/advisor/saved", payload),
    onSuccess: () => toast.success("পরামর্শটি সেভ করা হয়েছে"),
    onError: (e) => toast.error(getErrorMessage(e)),
  });
}
