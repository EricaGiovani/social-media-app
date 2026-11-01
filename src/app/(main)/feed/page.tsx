"use client";
import { useEffect, useMemo, useRef } from "react";
import { PostCard } from "@/components/shared/post-card";
import { Button } from "@/components/ui/button";
import { useFeed } from "@/hooks/use-feed";
import type { Post } from "@/lib/api/posts";

export default function FeedPage() {
  const { data, isLoading, isError, refetch, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useFeed();
  const sentinel = useRef<HTMLDivElement>(null);

  const posts = useMemo(() => {
  const map = new Map<number, Post>();
  data?.pages.flat().forEach((it) => map.set(it.id, it));
  return [...map.values()];
}, [data]);

  useEffect(() => {
    const el = sentinel.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting && hasNextPage && !isFetchingNextPage) fetchNextPage();
      },
      { rootMargin: "300px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  if (isLoading) {
    return <div className="h-96 animate-pulse rounded-md bg-gray-900" />;
  }

  if (isError) {
    return (
      <div className="space-y-3 py-10 text-center text-sm">
        <p>Failed to load feed.</p>
        <Button onClick={() => refetch()}>Retry</Button>
      </div>
    );
  }

  if (posts.length === 0) {
    return (
      <div className="py-65 text-center">
        <p className="font-semibold">Your feed is empty</p>
        <p className="text-sm text-muted-foreground">
          Follow people to see their posts here.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {posts.map((post) => (
        <PostCard key={post.id} post={post} />
      ))}
      <div ref={sentinel} className="py-4 text-center text-sm text-muted-foreground">
        {isFetchingNextPage ? "Loading..." : !hasNextPage ? "You're all caught up" : null}
      </div>
    </div>
  );
}