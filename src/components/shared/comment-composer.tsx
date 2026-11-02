"use client";
import { useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { EmojiPicker } from "./emoji-picker";
import { useAddComment } from "@/hooks/use-comments";
import { useAppSelector } from "@/store/hooks";
import Image from "next/image";

export function CommentComposer({ postId }: { postId: number }) {
  const router = useRouter();
  const pathname = usePathname();
  const token = useAppSelector((s) => s.auth.token);
  const [text, setText] = useState("");
  const [emojiOpen, setEmojiOpen] = useState(false);
  const add = useAddComment(postId);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const value = text.trim();
    if (!value) return;
    if (!token) {
      router.push(`/login?returnTo=${encodeURIComponent(pathname)}`);
      return;
    }
    setText("");
    setEmojiOpen(false);
    add.mutate(value, { onError: () => setText(value) });
  };

  return (
    <div className="relative">
      {emojiOpen && (
        <EmojiPicker onPick={(emoji) => setText((t) => t + emoji)} />
      )}
      <form
        onSubmit={submit}
        className="flex items-center gap-2 rounded-full border border-border px-3 py-2"
      >
        <button
          type="button"
          aria-label="Emoji"
          onClick={() => setEmojiOpen((o) => !o)}
        >
          <Image src="/IconEmoji.svg" alt="" width={24} height={24}/>
        </button>
        <input
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Add Comment"
          className="min-w-0 flex-1 bg-transparent text-md outline-none placeholder:text-muted-foreground font-medium"
        />
        <button
          type="submit"
          disabled={!text.trim() || add.isPending}
          className="text-sm font-semibold text-primary-200 disabled:text-muted-foreground xl:text-md md:text-[15px] text-sm"
        >
          Post
        </button>
      </form>
      {add.isError && (
        <p className="mt-2 text-xs text-destructive">
          Failed to post comment. Please try again.
        </p>
      )}
    </div>
  );
}