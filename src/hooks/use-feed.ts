import { useInfiniteQuery } from "@tanstack/react-query";
import { FEED_LIMIT, getFeed } from "@/lib/api/posts";

export function useFeed() {
  return useInfiniteQuery({
    queryKey: ["feed"],
    queryFn: ({ pageParam }) => getFeed(pageParam),
    initialPageParam: 1,
    getNextPageParam: (last, all) =>
      last.data.items.length < FEED_LIMIT ? undefined : all.length + 1,
  });
}