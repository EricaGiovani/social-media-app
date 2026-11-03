import { useMemo } from "react";
import { useInfiniteQuery } from "@tanstack/react-query";
import type { Paged } from "@/lib/api/profile";

export function usePaged<T>(
  key: unknown[],
  fetcher: (page: number) => Promise<Paged<T>>,
  enabled = true,
) {
  const q = useInfiniteQuery({
    queryKey: key,
    enabled,
    initialPageParam: 1,
    queryFn: ({ pageParam }) => fetcher(pageParam),
    getNextPageParam: ({ pagination }) =>
      pagination.page < pagination.totalPages ? pagination.page + 1 : undefined,
  });
  const items = useMemo(() => q.data?.pages.flatMap((p) => p.items) ?? [], [q.data]);
  return { ...q, items };
}