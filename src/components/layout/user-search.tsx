"use client";
import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Search } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { useUserSearch } from "@/hooks/use-user-search";
import { fixUrl } from "@/lib/url";

const icons = {
  closeSearch: "/IconCloseSearch.svg", 
  close: "/IconClose.svg", 
};

type SearchState = ReturnType<typeof useUserSearch>;

function SearchResults({
  s,
  onSelect,
}: {
  s: SearchState;
  onSelect: () => void;
}) {
  if (!s.hasText) return null;

  if (s.typing || s.isLoading) {
    return <div className="h-16 animate-pulse rounded-xl bg-gray-900" />;
  }

  if (s.isError) {
    return (
      <div className="space-y-3 py-4 text-center text-sm">
        <p>Failed to search users.</p>
        <Button size="sm" onClick={() => s.refetch()}>
          Retry
        </Button>
      </div>
    );
  }

  if (s.items.length === 0) {
    return (
      <div className="py-6 text-center">
        <p className="font-bold text-md text-gray-25">No results found</p>
        <p className="text-sm font-regular text-muted-foreground">Change your keyword</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <ul className="space-y-1">
        {s.items.map((u) => (
          <li key={u.id}>
            <Link
              href={`/profile/${encodeURIComponent(u.username)}`}
              onClick={onSelect}
              className="flex items-center gap-3 rounded-xl p-2 hover:bg-gray-900"
            >
              <Avatar>
                <AvatarImage src={fixUrl(u.avatarUrl)} alt="" />
                <AvatarFallback>{u.name[0]?.toUpperCase()}</AvatarFallback>
              </Avatar>
              <div className="min-w-0">
                <p className="truncate text-sm font-bold">{u.name}</p>
                <p className="truncate text-sm font-regular text-muted-foreground">
                  {u.username}
                </p>
              </div>
            </Link>
          </li>
        ))}
      </ul>

      {s.hasNextPage && (
        <Button
          variant="outline"
          size="sm"
          className="w-full rounded-full"
          disabled={s.isFetchingNextPage}
          onClick={() => s.fetchNextPage()}
        >
          {s.isFetchingNextPage ? "Loading..." : "Load more"}
        </Button>
      )}
    </div>
  );
}

function ClearButton({ onClick }: { onClick: () => void }) {
  return (
    <button type="button" aria-label="Clear search" onClick={onClick}>
      <Image src={icons.closeSearch} alt="" width={16} height={16} />
    </button>
  );
}

// ---------- Desktop ----------
export function DesktopSearch() {
  const [text, setText] = useState("");
  const [open, setOpen] = useState(false);
  const boxRef = useRef<HTMLDivElement>(null);
  const s = useUserSearch(text);

  useEffect(() => {
    const onDown = (e: MouseEvent) => {
      if (!boxRef.current?.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", onDown);
    return () => document.removeEventListener("mousedown", onDown);
  }, []);

  return (
    <div ref={boxRef} className="relative hidden w-full max-w-sm md:block">
      <div className="flex h-12 items-center gap-2 rounded-full border border-border px-4">
        <Search size={20} className="shrink-0 text-muted-foreground" />
        <input
          value={text}
          onChange={(e) => {
            setText(e.target.value);
            setOpen(true);
          }}
          onFocus={() => setOpen(true)}
          onKeyDown={(e) => e.key === "Escape" && setOpen(false)}
          placeholder="Search"
          aria-label="Search users"
          className="min-w-0 flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground"
        />
        {text && <ClearButton onClick={() => setText("")} />}
      </div>

      {open && s.hasText && (
        <div className="absolute inset-x-0 top-full mt-2 max-h-80 overflow-y-auto rounded-2xl border border-border bg-black p-3 shadow-lg">
          <SearchResults
            s={s}
            onSelect={() => {
              setText("");
              setOpen(false);
            }}
          />
        </div>
      )}
    </div>
  );
}

// ---------- Mobile ----------
export function MobileSearch({ onClose }: { onClose: () => void }) {
  const [text, setText] = useState("");
  const s = useUserSearch(text);

  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, []);

  return (
    <div
      role="dialog"
      aria-label="Search users"
      className="fixed inset-0 z-50 overflow-y-auto bg-black px-4 pt-4 md:hidden"
    >
      <div className="flex items-center gap-3">
        <div className="flex h-12 flex-1 items-center gap-2 rounded-full border border-border px-4">
          <Search size={20} className="shrink-0 text-muted-foreground" />
          <input
            autoFocus
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Search"
            aria-label="Search users"
            className="min-w-0 flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground"
          />
          {text && <ClearButton onClick={() => setText("")} />}
        </div>
        <button type="button" aria-label="Close search" onClick={onClose}>
          <Image src={icons.close} alt="" width={24} height={24} />
        </button>
      </div>

      <div className="mt-6 pb-8">
        <SearchResults s={s} onSelect={onClose} />
      </div>
    </div>
  );
}