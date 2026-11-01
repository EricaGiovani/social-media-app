"use client";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Search } from "lucide-react";
import { useQueryClient } from "@tanstack/react-query";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { logout } from "@/store/authSlice";

export function Navbar() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const qc = useQueryClient();
  const user = useAppSelector((s) => s.auth.user);

  const handleLogout = () => {
    dispatch(logout());
    qc.clear();
    router.replace("/login");
  };

  return (
    <header className="fixed inset-x-0 top-0 z-30 border-b border-gray-900 border-border bg-black backdrop-blur">
      <div className="mx-auto flex h-16 max-w-5xl items-center justify-between gap-4 px-4">
        <Link href="/feed" className="flex items-center gap-2">
          <Image src="/Icon Sociality.svg" alt="" width={30} height={30} priority />
          <span className="text-display-xs text-gray-25 font-bold">Sociality</span>
        </Link>

        <Link
          href="/users/search"
          className="hidden h-12 w-full max-w-sm items-center gap-1 rounded-full border border-border px-4 py-2 text-sm text-gray-600 font-regular text-muted-foreground md:flex"
        >
          <Search size={20} /> Search
        </Link>

        <div className="flex items-center gap-3">
          <Link href="/users/search" aria-label="Search" className="md:hidden">
            <Search size={20} />
          </Link>

          <DropdownMenu>
            <DropdownMenuTrigger className="flex items-center gap-2 rounded-full outline-none focus-visible:ring-2 focus-visible:ring-ring">
              <Avatar className="size-10">
                <AvatarImage src={user?.avatarUrl ?? undefined} alt="" />
                <AvatarFallback>
                  {user?.name?.[0]?.toUpperCase() ?? "U"}
                </AvatarFallback>
              </Avatar>
              <span className="hidden text-md font-bold md:block text-gray-25">
                {user?.name}
              </span>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => router.push("/me")}>
                Profile
              </DropdownMenuItem>
              <DropdownMenuItem onClick={handleLogout}>Logout</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}