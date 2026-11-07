"use client";
import { useParams, useRouter } from "next/navigation";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { MoreHorizontal, X } from "lucide-react";
import { PostCard } from "@/components/shared/post-card";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { usePost } from "@/hooks/use-post";
import { usePaged } from "@/hooks/use-paged";
import { useInfiniteScroll } from "@/hooks/use-infinite-scroll";
import { deletePost, type Post } from "@/lib/api/posts";
import { getUserPostsFull } from "@/lib/api/profile";
import { ApiError } from "@/lib/api/client";
import { useAppSelector } from "@/store/hooks";

export function PostView() {
  const { id } = useParams<{ id: string }>();
  const postId = Number(id);
  const router = useRouter();
  const qc = useQueryClient();
  const user = useAppSelector((s) => s.auth.user);

  const { data, isLoading, isError, error, refetch } = usePost(postId);
  const post = data?.data;
  const authorName = post?.author.username;

  const more = usePaged<Post>(
    ["author-posts", authorName],
    (p) => getUserPostsFull(authorName!, p),
    !!authorName,
  );
  const infiniteScroll = useInfiniteScroll(() => {
    if (more.hasNextPage && !more.isFetchingNextPage) more.fetchNextPage();
  }, !!more.hasNextPage);

  const remove = useMutation({
    mutationFn: () => deletePost(postId),
    onSuccess: () => {
      qc.removeQueries({ queryKey: ["post", postId] });
      for (const k of ["feed", "saved-ids", "my-posts", "me", "author-posts"]) {
        qc.invalidateQueries({ queryKey: [k] });
      }
      router.replace("/feed");
    },
  });

  if (isLoading) {
    return <div className="mx-auto h-96 max-w-[600px] animate-pulse rounded-md bg-gray-900" />;
  }

  if (isError || !post) {
    const notFound = error instanceof ApiError && error.status === 404;
    return (
      <div className="space-y-3 py-20 text-center text-md">
        <p>{notFound ? "Post not found." : "Failed to load post."}</p>
        {!notFound && <Button onClick={() => refetch()}>Retry</Button>}
      </div>
    );
  }

  const isOwner = user?.id === post.author.id;
  const others = more.items.filter((p) => p.id !== postId);

  const menu = isOwner && (
    <DropdownMenu>
      <DropdownMenuTrigger aria-label="More options" className="outline-none">
        <MoreHorizontal size={20} />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem
          onClick={() => {
            if (confirm("Delete this post?")) remove.mutate();
          }}
        >
          Delete
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );

  return (
    <div className="mx-auto max-w-[600px] space-y-8">
      <button
        type="button"
        onClick={() => router.back()}
        aria-label="Close"
        className="ml-auto block"
      >
        <X size={24} />
      </button>

      <PostCard post={post} detail headerRight={menu} />

      {remove.isError && (
        <p className="text-sm text-destructive">{remove.error.message}</p>
      )}

      {others.length > 0 && (
        <h2 className="border-t border-gray-900 pt-6 font-bold">
          More from {post.author.username}
        </h2>
      )}

      {others.map((p) => (
        <PostCard key={p.id} post={p} />
      ))}

      {more.isError && (
        <div className="space-y-3 text-center text-sm">
          <p>Failed to load more posts.</p>
          <Button onClick={() => more.refetch()}>Retry</Button>
        </div>
      )}

      <div ref={infiniteScroll} className="py-4 text-center text-sm text-muted-foreground">
        {more.isFetchingNextPage ? "Loading..." : null}
      </div>
    </div>
  );
}