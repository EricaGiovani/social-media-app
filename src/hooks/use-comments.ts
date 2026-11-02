import {
  InfiniteData,
  useInfiniteQuery,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import {
  addComment,
  deleteComment,
  getComments,
  type Comment,
  type CommentsRes,
} from "@/lib/api/posts";
import { useAppSelector } from "@/store/hooks";

type Cache = InfiniteData<CommentsRes>;

const mapPages = (
  old: Cache | undefined,
  fn: (list: Comment[], first: boolean) => Comment[],
) =>
  old && {
    ...old,
    pages: old.pages.map((p, i) => ({
      ...p,
      data: { ...p.data, comments: fn(p.data.comments, i === 0) },
    })),
  };

export function useComments(postId: number) {
  return useInfiniteQuery({
    queryKey: ["comments", postId],
    queryFn: ({ pageParam }) => getComments(postId, pageParam),
    initialPageParam: 1,
    getNextPageParam: (last) => {
      const { page, totalPages } = last.data.pagination;
      return page < totalPages ? page + 1 : undefined;
    },
  });
}

function useRefresh(postId: number) {
  const qc = useQueryClient();
  return () => {
    qc.invalidateQueries({ queryKey: ["comments", postId] });
    qc.invalidateQueries({ queryKey: ["post", postId] });
    qc.invalidateQueries({ queryKey: ["feed"] });
  };
}

export function useAddComment(postId: number) {
  const qc = useQueryClient();
  const user = useAppSelector((s) => s.auth.user);
  const refresh = useRefresh(postId);
  const key = ["comments", postId];

  return useMutation({
    mutationFn: (text: string) => addComment(postId, text),
    onMutate: async (text) => {
      await qc.cancelQueries({ queryKey: key });
      const prev = qc.getQueryData<Cache>(key);
      if (user) {
        const temp: Comment = {
          id: -Date.now(),
          text,
          createdAt: new Date().toISOString(),
          author: {
            id: user.id,
            username: user.username,
            name: user.name,
            avatarUrl: user.avatarUrl,
          },
          isMine: true,
        };
        qc.setQueryData<Cache>(key, (old) =>
          mapPages(old, (list, first) => (first ? [temp, ...list] : list)),
        );
      }
      return { prev };
    },
    onError: (_e, _v, ctx) => {
      if (ctx?.prev) qc.setQueryData(key, ctx.prev);
    },
    onSettled: refresh,
  });
}

export function useDeleteComment(postId: number) {
  const qc = useQueryClient();
  const refresh = useRefresh(postId);
  const key = ["comments", postId];

  return useMutation({
    mutationFn: (id: number) => deleteComment(id),
    onMutate: async (id) => {
      await qc.cancelQueries({ queryKey: key });
      const prev = qc.getQueryData<Cache>(key);
      qc.setQueryData<Cache>(key, (old) =>
        mapPages(old, (list) => list.filter((c) => c.id !== id)),
      );
      return { prev };
    },
    onError: (_e, _v, ctx) => {
      if (ctx?.prev) qc.setQueryData(key, ctx.prev);
    },
    onSettled: refresh,
  });
}