"use client";
import { FollowList } from "@/components/shared/follow-list";
import { getMyFollowers } from "@/lib/api/profile";

export default function MyFollowersPage() {
  return <FollowList title="Followers" queryKey={["me", "followers"]} fetcher={getMyFollowers} />;
}