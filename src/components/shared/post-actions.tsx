"use client";
import { useState } from "react";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { LikesDialog } from "./likes-dialog";
import { useToggleLike } from "@/hooks/use-toggle-like";
import { useSavedIds, useToggleSave } from "@/hooks/use-saved";
import { useAppSelector } from "@/store/hooks";
import type { Post } from "@/lib/api/posts";

const icons = {
  heart: "/IconLike.svg",
  heartFilled: "/IconLikeFilled.svg",
  comment: "/IconComment.svg",
  send: "/IconShare.svg",
  bookmark: "/IconSave.svg",
  bookmarkFilled: "/IconSaveFilled.svg",
};

export function PostActions({
  post,
  onComment,
}: {
  post: Post;
  onComment?: () => void;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const token = useAppSelector((s) => s.auth.token);
  const [likesOpen, setLikesOpen] = useState(false);

  const like = useToggleLike();
  const save = useToggleSave();
  const { data: savedIds } = useSavedIds();
  const saved = savedIds?.includes(post.id) ?? false;

  const requireAuth = (action: () => void) => {
    if (!token) {
      router.push(`/login?returnTo=${encodeURIComponent(pathname)}`);
      return;
    }
    action();
  };

  const commentContent = (
    <>
      <Image src={icons.comment} alt="" width={20} height={20} />
      {post.commentCount}
    </>
  );

  return (
    <>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4 text-sm">
          <span className="flex items-center gap-1.5">
            <button
              type="button"
              aria-label={post.likedByMe ? "Unlike" : "Like"}
              disabled={like.isPending}
              onClick={() =>
                requireAuth(() =>
                  like.mutate({ id: post.id, liked: post.likedByMe }),
                )
              }
            >
              <Image
                src={post.likedByMe ? icons.heartFilled : icons.heart}
                alt=""
                width={24}
                height={24}
              />
            </button>
            <button type="button" onClick={() => setLikesOpen(true)}>
              {post.likeCount}
            </button>
          </span>

          {onComment ? (
            <button
              type="button"
              aria-label="Comments"
              onClick={onComment}
              className="flex items-center gap-1.5"
            >
              {commentContent}
            </button>
          ) : (
            <span className="flex items-center gap-1.5">{commentContent}</span>
          )}

          <Image src={icons.send} alt="" width={24} height={24} />
        </div>

        <button
          type="button"
          aria-label={saved ? "Unsave" : "Save"}
          disabled={save.isPending}
          onClick={() => requireAuth(() => save.mutate({ id: post.id, saved }))}
        >
          <Image
            src={saved ? icons.bookmarkFilled : icons.bookmark}
            alt=""
            width={24}
            height={24}
          />
        </button>
      </div>

      <LikesDialog postId={post.id} open={likesOpen} onOpenChange={setLikesOpen} />
    </>
  );
}