import { keepPreviousData, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { api, getErrorMessage } from "@/lib/api";
import type { Paginated, Post } from "@/types";

export type CollectionKind = "likes" | "dislikes" | "saved";

/** GET /me/likes | /me/dislikes | /me/saved ?page=&limit= -> Paginated<Post> */
export function useCollection(kind: CollectionKind, page: number) {
  return useQuery({
    queryKey: ["collection", kind, page],
    queryFn: async () => (await api.get<Paginated<Post>>(`/me/${kind}`, { params: { page, limit: 12 } })).data,
    placeholderData: keepPreviousData,
  });
}

/** Remove from "saved" (the save endpoint is a toggle). */
export function useUnsave() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (postId: string) => api.post(`/posts/${postId}/save`),
    onSuccess: (_r, postId) => {
      toast.success("সেভ করা তালিকা থেকে সরানো হয়েছে");
      void qc.invalidateQueries({ queryKey: ["collection", "saved"] });
      void qc.invalidateQueries({ queryKey: ["post", postId, "viewer"] });
    },
    onError: (e) => toast.error(getErrorMessage(e)),
  });
}
