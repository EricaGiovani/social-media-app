"use client";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import type { GridPost } from "@/lib/api/profile";
import type { usePaged } from "@/hooks/use-paged";

type Query = ReturnType<typeof usePaged<GridPost>>;

export function PostsGrid({ q, empty }: { q: Query; empty: React.ReactNode }) {
  if (q.isLoading) {
    return <div className="h-40 animate-pulse rounded-md bg-gray-900" />;
  }

  if (q.isError) {
    return (
      <div className="space-y-3 py-6 text-center text-md">
        <p>Failed to load posts.</p>
        <Button onClick={() => q.refetch()}>Retry</Button>
      </div>
    );
  }

  if (q.items.length === 0) return <>{empty}</>;

  return (
    <div className="space-y-4">
      <ul className="grid grid-cols-3 gap-1">
        {q.items.map((p) => (
          <li key={p.id}>
            <Link
              href={`/posts/${p.id}`}
              className="relative block aspect-square overflow-hidden bg-gray-900"
            >
              <Image
                src={p.imageUrl}
                alt={p.caption ?? `Post ${p.id}`}
                fill
                sizes="(max-width: 768px) 33vw, 192px"
                className="object-cover"
              />
            </Link>
          </li>
        ))}
      </ul>

      {q.hasNextPage && (
        <Button
          variant="outline"
          className="w-full rounded-full"
          disabled={q.isFetchingNextPage}
          onClick={() => q.fetchNextPage()}
        >
          {q.isFetchingNextPage ? "Loading..." : "Load more"}
        </Button>
      )}
    </div>
  );
}

export function EmptyNote({ title, text }: { title: string; text: string }) {
  return (
    <div className="py-10 text-center">
      <p className="font-bold">{title}</p>
      <p className="text-sm text-muted-foreground">{text}</p>
    </div>
  );
}