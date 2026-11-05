"use client";
import { useState } from "react";
import Link from "next/link";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { FollowButton } from "@/components/shared/follow-button";
import { useDebounce } from "@/hooks/use-debounce";
import { usePaged } from "@/hooks/use-paged";
import { ApiError } from "@/lib/api/client";
import { searchUsers, type FollowUser } from "@/lib/api/profile";
import { useAppSelector } from "@/store/hooks";
import { fixUrl } from "@/lib/url";
import Image from "next/image";

export default function SearchUsersPage() {
  const { token, user } = useAppSelector((s) => s.auth);
  const [text, setText] = useState("");
  const keyword = useDebounce(text.trim());
  const typing = text.trim() !== keyword;

  const res = usePaged<FollowUser>(
    ["user-search", keyword, !!token],
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

  const showEmpty =
    keyword.length > 0 &&
    !typing &&
    !res.isLoading &&
    !res.isError &&
    res.items.length === 0;

  return (
    <div className="space-y-6">
      <div className="flex h-12 items-center gap-2 rounded-full border border-border px-4">
        <Image src="/IconSearch.svg" alt="" width={20} height={20} className="text-muted-foreground" />
        <input
          autoFocus
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Search"
          aria-label="Search users"
          className="min-w-0 flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground"
        />
      </div>

      {keyword.length === 0 && (
        <p className="py-10 text-center text-sm text-muted-foreground">
          Search people by name or username.
        </p>
      )}

      {keyword.length > 0 && (typing || res.isLoading) && (
        <div className="h-24 animate-pulse rounded-md bg-gray-900" />
      )}

      {res.isError && !typing && (
        <div className="space-y-3 py-6 text-center text-md">
          <p>Failed to search users.</p>
          <Button onClick={() => res.refetch()}>Retry</Button>
        </div>
      )}

      {showEmpty && (
        <div className="py-10 text-center">
          <p className="font-bold text-md text-gray-25">No results found</p>
          <p className="text-sm font-regular text-muted-foreground">Change your keyword</p>
        </div>
      )}

      {!typing && (
        <ul className="space-y-4">
          {res.items.map((u) => (
            <li key={u.id} className="flex items-center justify-between gap-3">
              <Link
                href={`/profile/${encodeURIComponent(u.username)}`}
                className="flex min-w-0 items-center gap-3"
              >
                <Avatar>
                  <AvatarImage src={fixUrl(u.avatarUrl)} alt="" />
                  <AvatarFallback>{u.name[0]?.toUpperCase()}</AvatarFallback>
                </Avatar>
                <div className="min-w-0">
                  <p className="truncate text-sm font-bold text-gray-25">{u.name}</p>
                  <p className="truncate text-sm font-regular text-muted-foreground">
                    {u.username}
                  </p>
                </div>
              </Link>
              {u.id !== user?.id && (
                <FollowButton
                  username={u.username}
                  following={u.isFollowedByMe}
                />
              )}
            </li>
          ))}
        </ul>
      )}

      {!typing && res.hasNextPage && (
        <Button
          variant="outline"
          className="w-full rounded-full"
          disabled={res.isFetchingNextPage}
          onClick={() => res.fetchNextPage()}
        >
          {res.isFetchingNextPage ? "Loading..." : "Load more"}
        </Button>
      )}
    </div>
  );
}