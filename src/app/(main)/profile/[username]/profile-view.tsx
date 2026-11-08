"use client";
import { useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { FollowButton } from "@/components/shared/follow-button";
import { ProfileHeader } from "@/components/shared/profile-header";
import { ProfileTabs } from "@/components/shared/profile-tabs";
import { EmptyNote, PostsGrid } from "@/components/shared/posts-grid";
import { usePaged } from "@/hooks/use-paged";
import { ApiError } from "@/lib/api/client";
import { getUser, getUserLikes, getUserPosts, type GridPost } from "@/lib/api/profile";
import { safeDecode } from "@/lib/url";
import { useAuth } from "@/hooks/use-auth";

type Tab = "posts" | "likes";
const tabs = [
  {
    key: "posts",
    label: "Gallery",
    icon: "/IconGallery.svg",
    activeIcon: "/IconGalleryFilled.svg",
  },
  {
    key: "likes",
    label: "Liked",
    icon: "/IconLike.svg",
    activeIcon: "/IconLikeFilledWhite.svg",
  },
] satisfies { key: Tab; label: string; icon: string; activeIcon?: string }[];

function PostsTab({ username }: { username: string }) {
  const q = usePaged<GridPost>(["user-posts", username], (p) => getUserPosts(username, p));
  return <PostsGrid q={q} empty={<EmptyNote title="No posts yet" text="This user hasn't posted anything." />} />;
}

function LikesTab({ username }: { username: string }) {
  const q = usePaged<GridPost>(["user-likes", username], (p) => getUserLikes(username, p));
  return <PostsGrid q={q} empty={<EmptyNote title="No liked posts yet" text="Posts this user likes will appear here." />} />;
}

export function ProfileView() {
  const params = useParams<{ username: string }>();
  const username = safeDecode(params.username);
  const { token, hydrated } = useAuth();
  const [tab, setTab] = useState<Tab>("posts");

  const q = useQuery({
    queryKey: ["user", username, !!token],
    queryFn: () => getUser(username),
    enabled: hydrated,
    retry: false,
  });

  if (!hydrated || q.isLoading) {
    return <div className="h-64 animate-pulse rounded-md bg-gray-900" />;
  }

  if (q.isError || !q.data) {
    const notFound = q.error instanceof ApiError && q.error.status === 404;
    return (
      <div className="space-y-3 py-20 text-center text-sm">
        <p>{notFound ? "User not found." : "Failed to load profile."}</p>
        {!notFound && <Button onClick={() => q.refetch()}>Retry</Button>}
      </div>
    );
  }

  const u = q.data.data;
  const base = `/profile/${encodeURIComponent(u.username)}`;

  return (
    <div className="space-y-6">
      <ProfileHeader
        name={u.name}
        username={u.username}
        avatarUrl={u.avatarUrl}
        bio={u.bio}
        stats={[
          { label: "Post", value: u.counts.post },
          { label: "Followers", value: u.counts.followers, href: `${base}/followers` },
          { label: "Following", value: u.counts.following, href: `${base}/following` },
          { label: "Likes", value: u.counts.likes },
        ]}
        action={
          u.isMe ? (
            <Link
              href="/me/edit"
              className="inline-flex h-12 w-[130px] shrink-0 items-center justify-center rounded-full border border-border px-4 text-sm font-semibold"
            >
              Edit Profile
            </Link>
          ) : (
            <FollowButton username={u.username} following={u.isFollowing} className="h-12 w-full px-10 text-base font-semibold md:w-auto" />
          )
        }
      />

      <ProfileTabs tabs={tabs} value={tab} onChange={setTab} />

      {tab === "posts" && <PostsTab username={u.username} />}
      {tab === "likes" && <LikesTab username={u.username} />}
    </div>
  );
}