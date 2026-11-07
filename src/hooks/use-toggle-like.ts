import { InfiniteData, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { likePost, unlikePost, type Post, type PostsPage } from "@/lib/api/posts";
import type { ApiResponse } from "@/lib/api/auth";

type ListCache = InfiniteData<PostsPage>;
type PostRes = ApiResponse<Post>;

const LIST_KEYS = ["feed", "author-posts"] as const;
const STALE_KEYS = [...LIST_KEYS, "post", "my-likes", "user-likes"];

const patch = (p: Post, liked: boolean): Post => ({
  ...p,
  likedByMe: !liked,
  likeCount: p.likeCount + (liked ? -1 : 1),
});

export function useToggleLike() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: ({ id, liked }: { id: number; liked: boolean }) =>
      liked ? unlikePost(id) : likePost(id),

    onMutate: async ({ id, liked }) => {
      await Promise.all([
        ...LIST_KEYS.map((k) => qc.cancelQueries({ queryKey: [k] })),
        qc.cancelQueries({ queryKey: ["post", id] }),
      ]);
      const prevLists = LIST_KEYS.flatMap((k) =>
        qc.getQueriesData<ListCache>({ queryKey: [k] }),
      );
      const prevPost = qc.getQueryData<PostRes>(["post", id]);

      for (const k of LIST_KEYS) {
        qc.setQueriesData<ListCache>({ queryKey: [k] }, (old) =>
          old && {
            ...old,
            pages: old.pages.map((page) => ({
              ...page,
              items: page.items.map((p) => (p.id === id ? patch(p, liked) : p)),
            })),
          },
        );
      }
      qc.setQueryData<PostRes>(["post", id], (old) =>
        old && { ...old, data: patch(old.data, liked) },
      );
      return { prevLists, prevPost };
    },

    onError: (_e, v, ctx) => {
      ctx?.prevLists.forEach(([key, data]) => qc.setQueryData(key, data));
      if (ctx?.prevPost) qc.setQueryData(["post", v.id], ctx.prevPost);
      toast.error("Failed to update like. Please try again.");
    },

    onSuccess: () => {
      for (const k of STALE_KEYS) {
        qc.invalidateQueries({ queryKey: [k], refetchType: "none" });
      }
    },
  });
}