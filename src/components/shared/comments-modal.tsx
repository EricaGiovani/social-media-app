"use client";
import { useEffect } from "react";
import Image from "next/image";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { CommentsSection } from "./comments-section";
import { PostActions } from "./post-actions";
import type { Post } from "@/lib/api/posts";
import dayjs from "@/lib/dayjs";
import { fixUrl } from "@/lib/url";

const closeIcon = "/IconClose.svg"; 

export function CommentsModal({
  post,
  onClose,
}: {
  post: Post;
  onClose: () => void;
}) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [onClose]);

  const closeBtn = (
    <button type="button" aria-label="Close" onClick={onClose}>
      <Image src={closeIcon} alt="" width={24} height={24} />
    </button>
  );

  return (
    <div
    className="fixed inset-0 z-50 flex items-end justify-center bg-black/70 md:items-center md:p-6"
    onClick={onClose}
  >
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Comments"
      onClick={(e) => e.stopPropagation()}
      className="flex h-[65vh] w-full flex-col overflow-hidden rounded-t-2xl bg-gray-950 md:h-[720px] md:w-[1120px] md:max-w-[calc(100vw-48px)] md:flex-row md:rounded-none md:border-0"
    >
      {/* Laptop: post image */}
      <div className="relative hidden h-[720px] w-[720px] shrink-0 bg-gray-950 md:block">
        <Image
          src={post.imageUrl}
          alt=""
          fill
          sizes="720px"
          className="object-cover"
        />
      </div>

      {/* Comments panel */}
      <div className="flex min-h-0 min-w-0 flex-1 flex-col bg-gray-950">
        {/* Mobile header */}
        <div className="flex items-center justify-between p-4 md:hidden">
          <h2 className="font-bold text-md">Comments</h2>
          {closeBtn}
        </div>

        {/* Laptop header */}
        <div className="hidden space-y-3 p-4 md:block">
          <div className="flex items-center gap-3">
            <Avatar>
              <AvatarImage src={fixUrl(post.author.avatarUrl)} alt="" />
              <AvatarFallback>
                {post.author.username[0]?.toUpperCase()}
              </AvatarFallback>
            </Avatar>

            <div className="min-w-0">
              <p className="truncate text-sm font-bold">
                {post.author.username}
              </p>
              <p className="text-xs font-regular text-muted-foreground">
                {dayjs(post.createdAt).fromNow()}
              </p>
            </div>

            <div className="ml-auto">{closeBtn}</div>
          </div>

          {post.caption && (
            <p className="max-h-28 overflow-y-auto whitespace-pre-line break-words text-sm text-gray-25">
              {post.caption}
            </p>
          )}
        </div>

        <CommentsSection
          postId={post.id}
          footer={
            <div className="hidden shrink-0 md:block">
              <PostActions post={post} saveOnly />
            </div>
          }
        />
      </div>
    </div>
  </div>
  );
}