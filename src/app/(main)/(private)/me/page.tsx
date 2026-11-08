"use client";
import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ProfileHeader } from "@/components/shared/profile-header";
import { ProfileTabs } from "@/components/shared/profile-tabs";
import { EmptyNote, PostsGrid } from "@/components/shared/posts-grid";
import { usePaged } from "@/hooks/use-paged";
import { useMe, useMyPosts } from "@/hooks/use-profile";
import { getMyLikes, getMySaved, type GridPost } from "@/lib/api/profile";

type Tab = "posts" | "likes" | "saved";
const tabs: { key: Tab; label: string }[] = [
  { key: "posts", label: "Posts" },
  { key: "likes", label: "Likes" },
  { key: "saved", label: "Saved" },
];

function PostsTab() {
  const q = useMyPosts();
  return (
    <PostsGrid
      q={q}
      empty={
        <div className="mx-auto flex w-full max-w-[453px] flex-col items-center gap-6 pt-5 text-center">
          <p className="font-bold text-md md:text-[17px] xl:text-lg text-gray-25">Your story starts here</p>
          <p className="text-sm xl:text-md md:text-[15px] font-regular text-gray-400">
            Share your first post and let the world see your moments, passions,
            and memories. Make this space truly yours.
          </p>
          <Link
            href="/posts/new"
            className="mx-auto flex h-12 w-[259px] items-center justify-center gap-2 rounded-full border border-border bg-primary-300 p-2 text-sm font-bold text-gray-25 md:text-[15px] xl:text-md"
          >
            Upload My First Post
          </Link>
        </div>
      }
    />
  );
}

function LikesTab() {
  const q = usePaged<GridPost>(["my-likes"], getMyLikes);
  return (
    <PostsGrid
      q={q}
      empty={<EmptyNote title="No liked posts yet" text="Posts you like will appear here." />}
    />
  );
}

function SavedTab() {
  const q = usePaged<GridPost>(["saved"], getMySaved);
  return (
    <PostsGrid
      q={q}
      empty={<EmptyNote title="No saved posts yet" text="Posts you save will appear here." />}
    />
  );
}

export default function MePage() {
  const me = useMe();
  const [tab, setTab] = useState<Tab>("posts");

  if (me.isLoading) {
    return <div className="h-64 animate-pulse rounded-md bg-gray-900" />;
  }

  if (me.isError || !me.data) {
    return (
      <div className="space-y-3 py-20 text-center text-md">
        <p>Failed to load profile.</p>
        <Button onClick={() => me.refetch()}>Retry</Button>
      </div>
    );
  }

  const { profile, stats } = me.data.data;

  return (
    <div className="space-y-6">
      <ProfileHeader
        name={profile.name}
        username={profile.username}
        avatarUrl={profile.avatarUrl}
        bio={profile.bio}
        stats={[
          { label: "Post", value: stats.posts },
          { label: "Followers", value: stats.followers, href: "/me/followers" },
          { label: "Following", value: stats.following, href: "/me/following" },
          { label: "Likes", value: stats.likes },
        ]}
        action={
          <Link
            href="/me/edit"
            className="block rounded-full border border-border py-2 text-center text-sm font-semibold"
          >
            Edit Profile
          </Link>
        }
      />

      <ProfileTabs tabs={tabs} value={tab} onChange={setTab} />

      {tab === "posts" && <PostsTab />}
      {tab === "likes" && <LikesTab />}
      {tab === "saved" && <SavedTab />}
    </div>
  );
}