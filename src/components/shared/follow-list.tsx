"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { FollowButton } from "./follow-button";
import { usePaged } from "@/hooks/use-paged";
import type { FollowUser, Paged } from "@/lib/api/profile";
import { useAppSelector } from "@/store/hooks";
import { fixUrl } from "@/lib/url";

export function FollowList({
  title,
  queryKey,
  fetcher,
}: {
  title: string;
  queryKey: unknown[];
  fetcher: (page: number) => Promise<Paged<FollowUser>>;
}) {
  const router = useRouter();
  const { token, user } = useAppSelector((s) => s.auth);
  const q = usePaged<FollowUser>(["follow-list", ...queryKey, !!token], fetcher);

  return (
    <div className="space-y-6">
      <button
        type="button"
        onClick={() => router.back()}
        className="flex items-center gap-2 font-bold"
      >
        <Image src="/ArrowLeft.svg" alt="" width={24} height={24}/> {title}
      </button>

      {q.isLoading && <div className="h-40 animate-pulse rounded-md bg-gray-900" />}

      {q.isError && (
        <div className="space-y-3 text-center text-md">
          <p>Failed to load {title.toLowerCase()}.</p>
          <Button onClick={() => q.refetch()}>Retry</Button>
        </div>
      )}

      {!q.isLoading && !q.isError && q.items.length === 0 && (
        <p className="py-10 text-center text-md text-muted-foreground">
          No {title.toLowerCase()} yet.
        </p>
      )}

      <ul className="space-y-4">
        {q.items.map((u) => (
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
                <p className="truncate text-sm font-bold">{u.name}</p>
                <p className="truncate text-sm font-regular text-muted-foreground">
                  {u.username}
                </p>
              </div>
            </Link>
            {u.id !== user?.id && (
              <FollowButton username={u.username} following={u.isFollowedByMe} />
            )}
          </li>
        ))}
      </ul>

      {q.hasNextPage && (
        <Button
          variant="outline"
          className="w-full rounded-full"
          disabled={q.isFetchingNextPage}
          onClick={() => q.fetchNextPage()}
        >
          {q.isFetchingNextPage ? "Loading..." : "Load more"}
        </Button>
      )}
    </div>
  );
}