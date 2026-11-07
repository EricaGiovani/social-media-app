"use client";
import { useParams } from "next/navigation";
import { FollowList } from "@/components/shared/follow-list";
import { getUserFollowers } from "@/lib/api/profile";
import { safeDecode } from "@/lib/url";

export function FollowersView() {
  const username = safeDecode(useParams<{ username: string }>().username);
  return (
    <FollowList
      title="Followers"
      queryKey={["user", username, "followers"]}
      fetcher={(p) => getUserFollowers(username, p)}
    />
  );
}