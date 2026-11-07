"use client";
import { useParams } from "next/navigation";
import { FollowList } from "@/components/shared/follow-list";
import { getUserFollowing } from "@/lib/api/profile";
import { safeDecode } from "@/lib/url";

export function FollowingView() {
  const username = safeDecode(useParams<{ username: string }>().username);
  return (
    <FollowList
      title="Following"
      queryKey={["user", username, "following"]}
      fetcher={(p) => getUserFollowing(username, p)}
    />
  );
}