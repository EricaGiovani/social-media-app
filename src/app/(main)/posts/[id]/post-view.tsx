"use client";
import { useParams, useRouter } from "next/navigation";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import Image from "next/image";
import { PostCard } from "@/components/shared/post-card";
import { CommentsSection } from "@/components/shared/comments-section";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { usePost } from "@/hooks/use-post";
import { deletePost } from "@/lib/api/posts";
import { ApiError } from "@/lib/api/client";
import { useAppSelector } from "@/store/hooks";

export function PostView() {
  const { id } = useParams<{ id: string }>();
  const postId = Number(id);
  const router = useRouter();
  const qc = useQueryClient();
  const user = useAppSelector((s) => s.auth.user);
  const { data, isLoading, isError, error, refetch } = usePost(postId);

  const remove = useMutation({
    mutationFn: () => deletePost(postId),
    onSuccess: () => {
      qc.removeQueries({ queryKey: ["post", postId] });
      qc.invalidateQueries({ queryKey: ["feed"] });
      qc.invalidateQueries({ queryKey: ["saved-ids"] });
      router.replace("/feed");
      qc.invalidateQueries({ queryKey: ["my-posts"] });
      qc.invalidateQueries({ queryKey: ["me"] });
    },
  });

  if (isLoading) return <div className="h-96 animate-pulse rounded-md bg-gray-900" />;

  if (isError || !data) {
    const notFound = error instanceof ApiError && error.status === 404;
    return (
      <div className="space-y-3 py-60 text-center text-md font-semibold">
        <p>{notFound ? "Post not found." : "Failed to load post."}</p>
        {!notFound && <Button onClick={() => refetch()} className="rounded-full h-12 w-30">Retry</Button>}
      </div>
    );
  }

  const post = data.data;
  const isOwner = user?.id === post.author.id;

  const menu = isOwner && (
    <DropdownMenu>
      <DropdownMenuTrigger aria-label="More options" className="outline-none">
        <Image src="/IconMore.svg" alt="" width={24} height={24} />
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
    <div className="space-y-6">
      <button
        type="button"
        onClick={() => router.back()}
        aria-label="Close"
        className="ml-auto block"
      >
        <Image src="/IconClose.svg" alt="" width={24} height={24} />
      </button>

      <PostCard post={post} detail headerRight={menu} />

      {remove.isError && (
        <p className="text-sm text-destructive">{remove.error.message}</p>
      )}

      <CommentsSection postId={postId} />
    </div>
  );
}