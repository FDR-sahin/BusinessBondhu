"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { api, getErrorMessage } from "@/lib/api";
import { useAuthStore } from "@/store/auth-store";
import type { Comment } from "@/types";

/** Comments exist on marketplace posts and on blog articles. */
export type CommentScope = "posts" | "blog";

const commentsKey = (scope: CommentScope, id: string) => ["comments", scope, id] as const;
/** Query key of the parent entity, so its comment count refreshes too. */
const parentKey = (scope: CommentScope, id: string) => (scope === "posts" ? ["post", id] : ["blog", id]);

/** GET /{posts|blog}/:id/comments -> top-level comments with `replies` nested (1 level). */
export function useComments(id: string, scope: CommentScope = "posts") {
  // userId in the key: when someone logs in/out, refetch so `likedByMe` is right.
  const userId = useAuthStore((s) => s.user?.id ?? "guest");
  return useQuery({
    queryKey: [...commentsKey(scope, id), userId],
    queryFn: async () => {
      try {
        const res = await api.get(`/${scope}/${id}/comments`);
        const val = res.data;
        if (Array.isArray(val)) return val as Comment[];
        if (val && typeof val === "object" && "items" in val && Array.isArray((val as any).items)) {
          return (val as any).items as Comment[];
        }
        return [] as Comment[];
      } catch {
        return [] as Comment[];
      }
    },
  });
}

/** POST /{posts|blog}/:id/comments { content, parentId?, authorName? } */
export function useAddComment(id: string, scope: CommentScope = "posts") {
  const qc = useQueryClient();
  const user = useAuthStore((s) => s.user);
  return useMutation({
    mutationFn: (input: { content: string; parentId?: string; authorName?: string }) => {
      const authorName = input.authorName || (user?.name && user.name !== "উদ্যোক্তা" ? user.name : "ব্যবহারকারী");
      return api.post<Comment>(`/${scope}/${id}/comments`, { ...input, authorName }).then((r) => r.data);
    },
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: commentsKey(scope, id) });
      void qc.invalidateQueries({ queryKey: parentKey(scope, id), exact: true });
    },
    onError: (e) => toast.error(getErrorMessage(e)),
  });
}

/** DELETE /comments/:id */
export function useDeleteComment(id: string, scope: CommentScope = "posts") {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (commentId: string) => api.delete(`/comments/${commentId}`),
    onSuccess: () => {
      toast.success("মন্তব্য মুছে ফেলা হয়েছে");
      void qc.invalidateQueries({ queryKey: commentsKey(scope, id) });
      void qc.invalidateQueries({ queryKey: parentKey(scope, id), exact: true });
    },
    onError: (e) => toast.error(getErrorMessage(e)),
  });
}

function mapTree(list: Comment[], id: string, fn: (c: Comment) => Comment): Comment[] {
  return list.map((c) =>
    c.id === id ? fn(c) : c.replies?.length ? { ...c, replies: mapTree(c.replies, id, fn) } : c,
  );
}

/** Optimistic like toggle. POST /comments/:id/like */
export function useToggleCommentLike(id: string, scope: CommentScope = "posts") {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (commentId: string) => api.post(`/comments/${commentId}/like`),

    onMutate: async (commentId) => {
      await qc.cancelQueries({ queryKey: commentsKey(scope, id) });
      const snapshots = qc.getQueriesData<Comment[]>({ queryKey: commentsKey(scope, id) });
      qc.setQueriesData<Comment[]>({ queryKey: commentsKey(scope, id) }, (old) =>
        old
          ? mapTree(old, commentId, (c) => ({
              ...c,
              likedByMe: !c.likedByMe,
              likesCount: c.likesCount + (c.likedByMe ? -1 : 1),
            }))
          : old,
      );
      return { snapshots };
    },

    onError: (e, _id, ctx) => {
      ctx?.snapshots.forEach(([key, data]) => qc.setQueryData(key, data));
      toast.error(getErrorMessage(e));
    },
  });
}
