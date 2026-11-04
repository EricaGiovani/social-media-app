"use client";
import { FollowList } from "@/components/shared/follow-list";
import { getMyFollowing } from "@/lib/api/profile";

export default function MyFollowingPage() {
  return <FollowList title="Following" queryKey={["me", "following"]} fetcher={getMyFollowing} />;
}