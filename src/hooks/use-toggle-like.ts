import { InfiniteData, useMutation, useQueryClient } from "@tanstack/react-query";
import { likePost, unlikePost, type FeedPage } from "@/lib/api/posts";

type Cache = InfiniteData<FeedPage>;

export function useToggleLike() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: ({ id, liked }: { id: number; liked: boolean }) =>
      liked ? unlikePost(id) : likePost(id),

    onMutate: async ({ id, liked }) => {
      await qc.cancelQueries({ queryKey: ["feed"] });
      const prev = qc.getQueryData<Cache>(["feed"]);

      qc.setQueryData<Cache>(["feed"], (old) =>
        old && {
          ...old,
          pages: old.pages.map((p) => ({
            ...p,
            data: {
              ...p.data,
              items: p.data.items.map((it) =>
                it.id === id
                  ? { ...it, likedByMe: !liked, likeCount: it.likeCount + (liked ? -1 : 1) }
                  : it,
              ),
            },
          })),
        },
      );
      return { prev };
    },

    onError: (_e, _v, ctx) => {
      if (ctx?.prev) qc.setQueryData(["feed"], ctx.prev);
    },
    onSettled: () => qc.invalidateQueries({ queryKey: ["feed"] }),
  });
}