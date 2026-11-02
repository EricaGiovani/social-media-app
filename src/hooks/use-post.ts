import { useQuery } from "@tanstack/react-query";
import { getPost } from "@/lib/api/posts";

export function usePost(id: number) {
  return useQuery({
    queryKey: ["post", id],
    queryFn: () => getPost(id),
    enabled: Number.isFinite(id),
    retry: false,
  });
}