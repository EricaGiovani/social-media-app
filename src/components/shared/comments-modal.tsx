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
      className="fixed inset-0 z-50 flex items-end justify-center bg-gray-950 md:items-center md:p-6"
      onClick={onClose}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Comments"
        onClick={(e) => e.stopPropagation()}
        className="flex h-[65vh] w-full flex-col overflow-hidden rounded-t-2xl border border-border bg-black md:h-[80vh] md:max-w-5xl md:flex-row md:rounded-2xl"
      >
        {/* Laptop: left */}
        <div className="relative hidden bg-gray-950 md:block md:w-1/2">
          <Image
            src={post.imageUrl}
            alt=""
            fill
            sizes="50vw"
            className="object-contain"
          />
        </div>

        <div className="flex min-h-0 flex-1 flex-col">
          {/* Mobile: */}
          <div className="flex items-center justify-between p-4 md:hidden">
            <h2 className="font-bold text-md">Comments</h2>
            {closeBtn}
          </div>

          {/* Laptop: right*/}
          <div className="hidden space-y-3 border-b border-gray-900 p-4 md:block">
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
              <div className="hidden md:block">
                <PostActions post={post} />
              </div>
            }
          />
        </div>
      </div>
    </div>
  );
}