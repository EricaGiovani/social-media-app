"use client";
import { useState } from "react";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { followUser, unfollowUser } from "@/lib/api/posts";
import { useAppSelector } from "@/store/hooks";
import { cn } from "@/lib/utils";
import { track } from "@/lib/analytics";

export function FollowButton({
  username,
  following,
  className,
}: {
  username: string;
  following: boolean;
  className?: string;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const qc = useQueryClient();
  const token = useAppSelector((s) => s.auth.token);
  const [value, setValue] = useState(following);
  const [prevFollowing, setPrevFollowing] = useState(following);

  if (following !== prevFollowing) {
  setPrevFollowing(following);
  setValue(following);
  }
  const m = useMutation({
    mutationFn: (next: boolean) =>
      next ? followUser(username) : unfollowUser(username),
    onError: (_e, next) => setValue(!next),
    onSettled: () => {
      for (const key of ["user", "follow-list", "me", "post-likes", "feed"]) {
        qc.invalidateQueries({ queryKey: [key] });
      }
    },
    onSuccess: (_d, next) => track(next ? "follow" : "unfollow", { username }),
  });

  const click = () => {
    if (!token) {
      router.push(`/login?returnTo=${encodeURIComponent(pathname)}`);
      return;
    }
    const next = !value;
    setValue(next);
    m.mutate(next);
  };

  return (
    <Button
      size="sm"
      variant={value ? "outline" : "default"}
      className={cn("rounded-full", className)}
      disabled={m.isPending}
      onClick={click}
    >
      {value ? (
        <>
          <Image src="/IconCheckCircle.svg" alt="" width={18} height={18} />
          Following
        </>
      ) : (
        "Follow"
      )}
    </Button>
  );
}