import { InfiniteData, useMutation, useQueryClient } from "@tanstack/react-query";
import { likePost, unlikePost, type Post } from "@/lib/api/posts";

type Cache = InfiniteData<Post[]>;

export function useToggleLike() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: ({ id, liked }: { id: number; liked: boolean }) =>
      liked ? unlikePost(id) : likePost(id),

    onMutate: async ({ id, liked }) => {
      await qc.cancelQueries({ queryKey: ["feed"] });
      const prev = qc.getQueriesData<Cache>({ queryKey: ["feed"] });

      qc.setQueriesData<Cache>({ queryKey: ["feed"] }, (old) =>
        old && {
          ...old,
          pages: old.pages.map((page) =>
            page.map((p) =>
              p.id === id
                ? { ...p, likedByMe: !liked, likeCount: p.likeCount + (liked ? -1 : 1) }
                : p,
            ),
          ),
        },
      );
      return { prev };
    },

    onError: (_e, _v, ctx) => {
      ctx?.prev.forEach(([key, data]) => qc.setQueryData(key, data));
    },
    onSettled: () => qc.invalidateQueries({ queryKey: ["feed"] }),
  });
}