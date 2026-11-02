import { InfiniteData, useMutation, useQueryClient } from "@tanstack/react-query";
import { likePost, unlikePost, type Post, type PostsPage } from "@/lib/api/posts";
import type { ApiResponse } from "@/lib/api/auth";

type FeedCache = InfiniteData<PostsPage>;
type PostRes = ApiResponse<Post>;

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
      await qc.cancelQueries({ queryKey: ["feed"] });
      await qc.cancelQueries({ queryKey: ["post", id] });
      const prevFeed = qc.getQueriesData<FeedCache>({ queryKey: ["feed"] });
      const prevPost = qc.getQueryData<PostRes>(["post", id]);

      qc.setQueriesData<FeedCache>({ queryKey: ["feed"] }, (old) =>
        old && {
          ...old,
          pages: old.pages.map((page) => ({
            ...page,
            items: page.items.map((p) => (p.id === id ? patch(p, liked) : p)),
          })),
        },
      );
      
      qc.setQueryData<PostRes>(["post", id], (old) =>
        old && { ...old, data: patch(old.data, liked) },
      );
      return { prevFeed, prevPost };
    },

    onError: (_e, v, ctx) => {
      ctx?.prevFeed.forEach(([key, data]) => qc.setQueryData(key, data));
      if (ctx?.prevPost) qc.setQueryData(["post", v.id], ctx.prevPost);
    },
    onSettled: (_d, _e, v) => {
      qc.invalidateQueries({ queryKey: ["feed"] });
      qc.invalidateQueries({ queryKey: ["post", v.id] });
    },
  });
}