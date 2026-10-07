"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";
import { toast } from "sonner";
import { api, getErrorMessage } from "@/lib/api";
import { useIsAuthenticated } from "@/store/auth-store";
import type { Post, PostDetail, PostViewerState } from "@/types";

const postKey = (id: string) => ["post", id] as const;
const viewerKey = (id: string) => ["post", id, "viewer"] as const;

/** GET /posts/:id. `initialData` comes from the server-rendered page (SEO + instant paint). */
export function usePost(id: string, initialData?: PostDetail) {
  return useQuery({
    queryKey: postKey(id),
    queryFn: async () => (await api.get<PostDetail>(`/posts/${id}`)).data,
    initialData,
    staleTime: 60_000,
  });
}

/** GET /posts/:id/me -> { reaction, saved }. Only for logged-in users. */
export function usePostViewer(id: string) {
  const authed = useIsAuthenticated();
  return useQuery({
    queryKey: viewerKey(id),
    queryFn: async () => (await api.get<PostViewerState>(`/posts/${id}/me`)).data,
    enabled: authed,
  });
}

/** GET /posts/:id/related?limit=4 -> Post[] (server decides: same category or same area). */
export function useRelatedPosts(id: string) {
  return useQuery({
    queryKey: ["post", id, "related"],
    queryFn: async () => (await api.get<Post[]>(`/posts/${id}/related`, { params: { limit: 4 } })).data,
    staleTime: 5 * 60_000,
  });
}

/** Counts one view per browser session. POST /posts/:id/view */
export function useTrackView(id: string) {
  useEffect(() => {
    const key = `bhbd-viewed:${id}`;
    try {
      if (sessionStorage.getItem(key)) return;
      sessionStorage.setItem(key, "1");
    } catch {
      /* storage blocked: still count once per mount */
    }
    api.post(`/posts/${id}/view`).catch(() => undefined);
  }, [id]);
}

/**
 * Like / dislike with optimistic UI: the number and the filled icon change
 * instantly, and roll back if the request fails.
 * Assumes toggle endpoints: POST /posts/:id/like and /posts/:id/dislike.
 */
export function useReaction(id: string) {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: (target: "like" | "dislike") => api.post(`/posts/${id}/${target}`),

    onMutate: async (target) => {
      await qc.cancelQueries({ queryKey: postKey(id) });
      const prevPost = qc.getQueryData<PostDetail>(postKey(id));
      const prevViewer = qc.getQueryData<PostViewerState>(viewerKey(id)) ?? { reaction: null, saved: false };

      const before = prevViewer.reaction;
      const after = before === target ? null : target; // tapping the active one removes it

      if (prevPost) {
        qc.setQueryData<PostDetail>(postKey(id), {
          ...prevPost,
          likesCount: prevPost.likesCount - (before === "like" ? 1 : 0) + (after === "like" ? 1 : 0),
          dislikesCount: prevPost.dislikesCount - (before === "dislike" ? 1 : 0) + (after === "dislike" ? 1 : 0),
        });
      }
      qc.setQueryData<PostViewerState>(viewerKey(id), { ...prevViewer, reaction: after });
      return { prevPost, prevViewer };
    },

    onError: (error, _target, ctx) => {
      if (ctx?.prevPost) qc.setQueryData(postKey(id), ctx.prevPost);
      if (ctx?.prevViewer) qc.setQueryData(viewerKey(id), ctx.prevViewer);
      toast.error(getErrorMessage(error));
    },

    onSettled: () => void qc.invalidateQueries({ queryKey: postKey(id) }),
  });
}

/** Bookmark toggle (optimistic). POST /posts/:id/save */
export function useToggleSave(id: string) {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: () => api.post(`/posts/${id}/save`),

    onMutate: async () => {
      await qc.cancelQueries({ queryKey: viewerKey(id) });
      const prev = qc.getQueryData<PostViewerState>(viewerKey(id)) ?? { reaction: null, saved: false };
      qc.setQueryData<PostViewerState>(viewerKey(id), { ...prev, saved: !prev.saved });
      return { prev };
    },

    onSuccess: (_res, _v, ctx) => {
      toast.success(ctx?.prev.saved ? "সেভ করা তালিকা থেকে সরানো হয়েছে" : "পোস্টটি সেভ করা হয়েছে");
      void qc.invalidateQueries({ queryKey: ["collection", "saved"] });
    },

    onError: (error, _v, ctx) => {
      if (ctx?.prev) qc.setQueryData(viewerKey(id), ctx.prev);
      toast.error(getErrorMessage(error));
    },

    onSettled: () => void qc.invalidateQueries({ queryKey: viewerKey(id) }),
  });
}
