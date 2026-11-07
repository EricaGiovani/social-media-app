"use client";
import { useMemo } from "react";
import Link from "next/link";
import { Trash2 } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { CommentComposer } from "./comment-composer";
import { useComments, useDeleteComment } from "@/hooks/use-comments";
import { useAppSelector } from "@/store/hooks";
import type { Comment } from "@/lib/api/posts";
import dayjs from "@/lib/dayjs";
import { fixUrl } from "@/lib/url";

export function CommentsSection({
  postId,
  footer,
}: {
  postId: number;
  footer?: React.ReactNode;
}) {
  const user = useAppSelector((s) => s.auth.user);
  const {
    data,
    isLoading,
    isError,
    refetch,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useComments(postId);
  const del = useDeleteComment(postId);

  const comments = useMemo(() => {
    const map = new Map<number, Comment>();
    data?.pages.forEach((p) => p.data.comments.forEach((c) => map.set(c.id, c)));
    return [...map.values()];
  }, [data]);

  return (
    <section className="flex min-h-0 flex-1 flex-col">
      <div className="min-h-0 flex-1 space-y-4 overflow-y-auto px-4 py-3">
        <h2 className="hidden font-bold  text-md text-gray-25 md:block">Comments</h2>

        {isLoading && <div className="h-20 animate-pulse rounded-md bg-gray-900" />}

        {isError && (
          <div className="space-y-2 text-sm">
            <p>Failed to load comments.</p>
            <Button size="sm" onClick={() => refetch()}>
              Retry
            </Button>
          </div>
        )}

        {!isLoading && !isError && comments.length === 0 && (
          <div className="py-6 text-center">
            <p className="font-bold text-md text-gray-25">No Comments yet</p>
            <p className="text-sm font-regular text-muted-foreground">Start the conversation</p>
          </div>
        )}

        <ul className="space-y-4">
          {comments.map((c) => {
            const mine = c.isMine || c.author.id === user?.id;
            return (
              <li key={c.id} className="flex gap-3 border-b border-gray-900 pb-4">
                <Link href={`/profile/${encodeURIComponent(c.author.username)}`}>
                  <Avatar>
                    <AvatarImage src={fixUrl(c.author.avatarUrl)} alt="" />
                    <AvatarFallback>
                      {c.author.username[0]?.toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                </Link>
                <div className="min-w-0 flex-1 text-sm xl:text-sm md:text-[13px]">
                  <p className="font-semibold xl:font-bold text-gray-25">{c.author.username}</p>
                  <p className="text-xs text-muted-foreground">
                    {dayjs(c.createdAt).fromNow()}
                  </p>
                  <p className="mt-1 whitespace-pre-line break-words">{c.text}</p>
                </div>
                {mine && c.id > 0 && (
                  <button
                    type="button"
                    aria-label="Delete comment"
                    disabled={del.isPending}
                    onClick={() => del.mutate(c.id)}
                    className="self-start text-muted-foreground"
                  >
                    <Trash2 size={16} />
                  </button>
                )}
              </li>
            );
          })}
        </ul>

        {hasNextPage && (
          <Button
            variant="outline"
            className="w-full rounded-full"
            disabled={isFetchingNextPage}
            onClick={() => fetchNextPage()}
          >
            {isFetchingNextPage ? "Loading..." : "Load more"}
          </Button>
        )}
      </div>

      <div className="shrink-0 space-y-3 border-t border-gray-900 p-4">
        {footer}
        <CommentComposer postId={postId} />
      </div>
    </section>
  );
}