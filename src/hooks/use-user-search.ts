import { useDebounce } from "./use-debounce";
import { usePaged } from "./use-paged";
import { ApiError } from "@/lib/api/client";
import { searchUsers, type FollowUser } from "@/lib/api/profile";

export function useUserSearch(text: string) {
  const keyword = useDebounce(text.trim());
  const hasText = text.trim().length > 0;
  const typing = text.trim() !== keyword;

  const q = usePaged<FollowUser>(
    ["user-search", keyword],
    async (page) => {
      try {
        return await searchUsers(keyword, page);
      } catch (e) {
        if (e instanceof ApiError && e.status === 404) {
          return {
            items: [],
            pagination: { page: 1, limit: 20, total: 0, totalPages: 0 },
          };
        }
        throw e;
      }
    },
    keyword.length > 0,
  );

  return { ...q, hasText, typing };
}