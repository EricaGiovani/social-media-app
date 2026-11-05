"use client";
import Link from "next/link";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { getPostLikes, type LikeUser } from "@/lib/api/posts";
import { FollowButton } from "@/components/shared/follow-button";
import { usePaged } from "@/hooks/use-paged";
import { fixUrl } from "@/lib/url";

function Row({ user }: { user: LikeUser }) {
  return (
    <li className="flex items-center justify-between gap-3">
      <Link
        href={`/profile/${encodeURIComponent(user.username)}`}
        className="flex min-w-0 items-center gap-3"
      >
        <Avatar>
          <AvatarImage src={fixUrl(user.avatarUrl)} alt="" />
          <AvatarFallback>{user.name[0]?.toUpperCase()}</AvatarFallback>
        </Avatar>
        <div className="min-w-0">
          <p className="truncate text-sm font-semibold">{user.name}</p>
          <p className="truncate text-xs text-muted-foreground">
            {user.username}
          </p>
        </div>
      </Link>

      {!user.isMe && (
        <FollowButton
          username={user.username}
          following={user.isFollowedByMe}
        />
      )}
    </li>
  );
}

export function LikesDialog({
  postId,
  open,
  onOpenChange,
}: {
  postId: number;
  open: boolean;
  onOpenChange: (v: boolean) => void;
}) {
  const q = usePaged<LikeUser>(
    ["post-likes", postId],
    (page) => getPostLikes(postId, page),
    open,
  );

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Likes</DialogTitle>
        </DialogHeader>

        {q.isLoading && (
          <p className="text-sm text-muted-foreground">Loading...</p>
        )}
        {q.isError && (
          <div className="space-y-2 text-sm">
            <p>Failed to load likes.</p>
            <Button size="sm" onClick={() => q.refetch()}>
              Retry
            </Button>
          </div>
        )}
        {!q.isLoading && !q.isError && q.items.length === 0 && (
          <p className="text-sm text-muted-foreground">No likes yet.</p>
        )}

        <ul className="space-y-4">
          {q.items.map((u) => (
            <Row key={u.id} user={u} />
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
      </DialogContent>
    </Dialog>
  );
}