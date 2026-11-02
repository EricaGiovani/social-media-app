import { useInfiniteQuery } from "@tanstack/react-query";
import { getFeed, getPosts } from "@/lib/api/posts";
import { useAppSelector } from "@/store/hooks";

export function useFeed() {
  const { token, hydrated } = useAppSelector((s) => s.auth);

  return useInfiniteQuery({
    queryKey: ["feed", token ? "private" : "public"],
    enabled: hydrated,
    initialPageParam: 1,
    queryFn: ({ pageParam }) => (token ? getFeed(pageParam) : getPosts(pageParam)),
    getNextPageParam: ({ pagination }) =>
      pagination.page < pagination.totalPages ? pagination.page + 1 : undefined,
  });
}