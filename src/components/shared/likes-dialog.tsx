"use client";
import Link from "next/link";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  followUser,
  getPostLikes,
  unfollowUser,
  type LikeUser,
} from "@/lib/api/posts";
import Image from "next/image";

function Row({ user, onDone }: { user: LikeUser; onDone: () => void }) {
  const toggle = useMutation({
    mutationFn: () =>
      user.isFollowedByMe ? unfollowUser(user.username) : followUser(user.username),
    onSettled: onDone,
  });

  return (
    <li className="flex items-center justify-between gap-3">
      <Link
        href={`/profile/${encodeURIComponent(user.username)}`}
        className="flex min-w-0 items-center gap-3"
      >
        <Avatar>
          <AvatarImage src={user.avatarUrl ?? undefined} alt="" />
          <AvatarFallback>{user.name[0]?.toUpperCase()}</AvatarFallback>
        </Avatar>
        <div className="min-w-0">
          <p className="truncate text-sm font-semibold">{user.name}</p>
          <p className="truncate text-xs text-muted-foreground">{user.username}</p>
        </div>
      </Link>

      {!user.isMe && (
        <Button
          size="sm"
          variant={user.isFollowedByMe ? "outline" : "default"}
          className="rounded-full"
          disabled={toggle.isPending}
          onClick={() => toggle.mutate()}
        >
          {user.isFollowedByMe ? (
            <>
              <Image src="/IconCheckCircle.svg" alt="" width={20} height={20} /> Following
            </>
          ) : (
            "Follow"
          )}
        </Button>
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
  const qc = useQueryClient();
  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ["post-likes", postId],
    queryFn: () => getPostLikes(postId),
    enabled: open,
  });
  const users = data?.data.users ?? [];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Likes</DialogTitle>
        </DialogHeader>

        {isLoading && <p className="text-sm text-muted-foreground">Loading...</p>}
        {isError && (
          <div className="space-y-2 text-sm">
            <p>Failed to load likes.</p>
            <Button size="sm" onClick={() => refetch()}>Retry</Button>
          </div>
        )}
        {!isLoading && !isError && users.length === 0 && (
          <p className="text-sm text-muted-foreground">No likes yet.</p>
        )}

        <ul className="space-y-4">
          {users.map((u) => (
            <Row
              key={u.id}
              user={u}
              onDone={() => qc.invalidateQueries({ queryKey: ["post-likes", postId] })}
            />
          ))}
        </ul>
      </DialogContent>
    </Dialog>
  );
}