import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { FEED_LIMIT, getSaved, savePost, unsavePost } from "@/lib/api/posts";

export function useSavedIds() {
  return useQuery({
    queryKey: ["saved-ids"],
    queryFn: async () => {
      const ids: number[] = [];
      for (let page = 1; page <= 50; page++) {
        const res = await getSaved(page);
        ids.push(...res.data.posts.map((p) => p.id));
        if (res.data.posts.length < FEED_LIMIT) break;
      }
      return ids;
    },
  });
}

export function useToggleSave() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, saved }: { id: number; saved: boolean }) =>
      saved ? unsavePost(id) : savePost(id),
    onMutate: async ({ id, saved }) => {
      await qc.cancelQueries({ queryKey: ["saved-ids"] });
      const prev = qc.getQueryData<number[]>(["saved-ids"]);
      qc.setQueryData<number[]>(["saved-ids"], (old = []) =>
        saved ? old.filter((x) => x !== id) : [...old, id],
      );
      return { prev };
    },
    onError: (_e, _v, ctx) => {
      if (ctx?.prev) qc.setQueryData(["saved-ids"], ctx.prev);
    },
    onSettled: () => {
      qc.invalidateQueries({ queryKey: ["saved-ids"] });
      qc.invalidateQueries({ queryKey: ["saved"] });
    },
  });
}