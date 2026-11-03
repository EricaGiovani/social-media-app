import { useQuery } from "@tanstack/react-query";
import { getMe, getMyPosts, type GridPost } from "@/lib/api/profile";
import { usePaged } from "./use-paged";
import { useAppSelector } from "@/store/hooks";

export function useMe() {
  const token = useAppSelector((s) => s.auth.token);
  return useQuery({ queryKey: ["me"], queryFn: getMe, enabled: !!token });
}

export function useMyPosts() {
  const token = useAppSelector((s) => s.auth.token);
  return usePaged<GridPost>(["my-posts"], getMyPosts, !!token);
}