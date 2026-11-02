"use client";
import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { LikesDialog } from "./likes-dialog";
import { useToggleLike } from "@/hooks/use-toggle-like";
import { useSavedIds, useToggleSave } from "@/hooks/use-saved";
import { useAppSelector } from "@/store/hooks";
import type { Post } from "@/lib/api/posts";
import dayjs from "@/lib/dayjs";

const icons = {
  like: "/IconLike.svg",
  likeFilled: "/IconLikeFilled.svg",
  comment: "/IconComment.svg",
  share: "/IconShare.svg",
  save: "/IconSave.svg",
  saveFilled: "/IconSaveFilled.svg",
};

const CAPTION_LIMIT = 100;

export function PostCard({post, detail = false, headerRight,
  }: {
      post: Post;
      detail?: boolean;
      headerRight?: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const token = useAppSelector((s) => s.auth.token);

  const [expanded, setExpanded] = useState(false);
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

  const text = post.caption ?? "";
  const long = !detail && text.length > CAPTION_LIMIT;
  const caption =
  long && !expanded ? `${text.slice(0, CAPTION_LIMIT)}...` : text;
  const profileHref = `/profile/${encodeURIComponent(post.author.username)}`;

  return (
    <article className="space-y-3">
      <header className="flex items-center gap-3">
        <Link href={profileHref}>
          <Avatar>
            <AvatarImage src={post.author.avatarUrl ?? undefined} alt="" />
            <AvatarFallback>
              {post.author.username[0]?.toUpperCase()}
            </AvatarFallback>
          </Avatar>
        </Link>
        <div>
          <Link href={profileHref} className="text-sm xl:text-md md:text-[15px] text-gray-25 font-bold">
            {post.author.username}
          </Link>
          <p className="text-xs md:text-[13px] xl:text-sm font-regular text-gray-400 text-muted-foreground">
            {dayjs(post.createdAt).fromNow()}
          </p>
        </div>
        <div className="ml-auto">{headerRight}</div>
      </header>

      <Link
        href={`/posts/${post.id}`}
        className="relative block aspect-square overflow-hidden rounded-md bg-gray-900"
      >
        <Image
          src={post.imageUrl}
          alt={text.slice(0, 80) || `Post by ${post.author.username}`}
          fill
          sizes="(max-width: 768px) 100vw, 576px"
          className="object-cover"
        />
      </Link>

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4 text-sm">
          <span className="flex items-center gap-1.5">
            <button
              type="button"
              aria-label={post.likedByMe ? "Unlike" : "Like"}
              onClick={() =>
                requireAuth(() =>
                  like.mutate({ id: post.id, liked: post.likedByMe }),
                )
              }
            >
              <Image
                src={post.likedByMe ? icons.likeFilled : icons.like}
                alt=""
                width={24}
                height={24}
              />
            </button>
            <button type="button" onClick={() => setLikesOpen(true)}>
              {post.likeCount}
            </button>
          </span>

          <Link href={`/posts/${post.id}`} className="flex items-center gap-1.5">
            <Image src={icons.comment} alt="" width={24} height={24} />
            {post.commentCount}
          </Link>

          <Image src={icons.share} alt="" width={24} height={24} />
        </div>

        <button
          type="button"
          aria-label={saved ? "Unsave" : "Save"}
          onClick={() => requireAuth(() => save.mutate({ id: post.id, saved }))}
        >
          <Image
            src={saved ? icons.saveFilled : icons.save}
            alt=""
            width={24}
            height={24}
          />
        </button>
      </div>

    {text && (
      <div className="text-sm xl:text-md md:text-[15px] text-gray-25">
        <p className="font-bold">{post.author.username}</p>
        <p className="whitespace-pre-line break-words font-regular">{caption}</p>
        {long && (
          <button
            type="button"
            onClick={() => setExpanded((e) => !e)}
            className="text-sm xl:text-md md:text-[15px] font-bold text-primary-200"
          >
            {expanded ? "Show Less" : "Show More"}
          </button>
        )}
      </div>
    )}
      <div className="border-b-1 border-gray-900"></div>
      <LikesDialog postId={post.id} open={likesOpen} onOpenChange={setLikesOpen} />
    </article>
  );
}