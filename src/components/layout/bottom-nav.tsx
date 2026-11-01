"use client";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Plus } from "lucide-react";
import { cn } from "@/lib/utils";

export function BottomNav() {
  const pathname = usePathname();

  const item = (href: string, label: string, icon: string) => {
    const active = pathname.startsWith(href);
    return (
      <Link
        href={href}
        className={cn(
          "flex flex-col items-center gap-1 text-xs",
          active ? "text-primary" : "text-foreground",
        )}
      >
        <Image src={icon} alt="" width={22} height={22} />
        {label}
      </Link>
    );
  };

  return (
    <nav className="fixed inset-x-4 bottom-4 z-30 mx-auto flex max-w-sm items-center justify-between rounded-full border border-gray-900 border-border bg-gray-950 px-10 py-2">
      {item("/feed", "Home", "/IconHome.svg")}
      <Link
        href="/posts/new"
        aria-label="Create post"
        className="flex size-11 items-center justify-center rounded-full bg-primary text-primary-foreground"
      >
        <Plus />
      </Link>
      {item("/me", "Profile", "/IconProfile.svg")}
    </nav>
  );
}