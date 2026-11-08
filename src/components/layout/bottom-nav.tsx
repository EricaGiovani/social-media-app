"use client";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Plus } from "lucide-react";
import { cn } from "@/lib/utils";

const icons = {
  home: { idle: "/IconHome.svg", active: "/IconHomeFilled.svg" },
  profile: { idle: "/IconProfile.svg", active: "/IconProfileFilled.svg" },
};

export function BottomNav() {
  const pathname = usePathname();

  const isHome = pathname === "/feed";
  const isProfile = pathname === "/me" || pathname.startsWith("/me/");

  const item = (
    href: string,
    label: string,
    icons: { idle: string; active: string },
    active: boolean,
  ) => (
    <Link
      href={href}
      className={cn(
        "flex flex-col items-center gap-1 text-xs",
        active ? "text-primary" : "text-foreground",
      )}
    >
      <Image
        src={active ? icons.active : icons.idle}
        alt=""
        width={20}
        height={20}
      />
      {label}
    </Link>
  );

  return (
    <nav className="fixed inset-x-4 bottom-4 z-30 mx-auto flex max-w-sm items-center justify-between rounded-full border border-border bg-gray-950 px-10 py-2 backdrop-blur">
      {item("/feed", "Home", icons.home, isHome)}
      <Link
        href="/posts/new"
        aria-label="Create post"
        className="flex size-11 items-center justify-center rounded-full bg-primary text-primary-foreground"
      >
        <Plus />
      </Link>
      {item("/me", "Profile", icons.profile, isProfile)}
    </nav>
  );
}