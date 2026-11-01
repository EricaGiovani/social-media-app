import { useInfiniteQuery } from "@tanstack/react-query";
import { FEED_LIMIT, getFeed, getPosts, type Post } from "@/lib/api/posts";
import { useAppSelector } from "@/store/hooks";

export function useFeed() {
  const { token, hydrated } = useAppSelector((s) => s.auth);

  return useInfiniteQuery<Post[], Error, { pages: Post[][] }, (string)[], number>({
    queryKey: ["feed", token ? "private" : "public"],
    enabled: hydrated,
    initialPageParam: 1,
    queryFn: async ({ pageParam }) =>
      token
        ? (await getFeed(pageParam)).data.items
        : (await getPosts(pageParam)).data.posts,
    getNextPageParam: (last, all) =>
      last.length < FEED_LIMIT ? undefined : all.length + 1,
  });
}