"use client";
import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Menu, Search, X } from "lucide-react";
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
  const { user, token, hydrated } = useAppSelector((s) => s.auth);
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = () => {
    dispatch(logout());
    qc.clear();
    router.replace("/feed");
  };

  const loginLink = "rounded-full px-4 py-2 text-sm font-semibold";
  const registerLink =
    "rounded-full bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground";

  return (
    <header className="fixed inset-x-0 top-0 z-30 border-b bg-black border-gray-900 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-5xl items-center justify-between gap-4 px-4">
        <Link href="/feed" className="flex items-center gap-3">
          <Image src="/Icon Sociality.svg" alt="" width={30} height={30} priority />
          <span className="text-lg font-bold">Sociality</span>
        </Link>

        <Link
          href="/users/search"
          className="hidden h-12 w-full max-w-sm items-center gap-1 rounded-full border border-border px-4 py-2 text-sm text-gray-600 font-regular text-muted-foreground md:flex"
        >
          <Search size={20} /> Search
        </Link>

        {hydrated && token && (
          <div className="flex items-center gap-4">
            <Link href="/users/search" aria-label="Search" className="md:hidden">
              <Search size={20} />
            </Link>
            <DropdownMenu>
              <DropdownMenuTrigger className="flex items-center gap-2 rounded-full outline-none focus-visible:ring-2 focus-visible:ring-ring">
                <Avatar className="size-10">
                  <AvatarImage src={user?.avatarUrl ?? undefined} alt="" />
                  <AvatarFallback>{user?.name?.[0]?.toUpperCase() ?? "U"}</AvatarFallback>
                </Avatar>
                <span className="hidden text-md text-gray-25 font-bold md:block">{user?.name}</span>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => router.push("/me")}>Profile</DropdownMenuItem>
                <DropdownMenuItem onClick={handleLogout}>Logout</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        )}

        {hydrated && !token && (
          <>
            <div className="hidden items-center gap-3 md:flex">
              <Link href="/login" className={`${loginLink} text-md bg-gray-900 text-gray-25 font-bold h-11 w-[130px] text-center`}>Login</Link>
              <Link href="/register" className={`${registerLink} text-md bg-primary-300 text-gray-25 font-bold h-11 w-[130px] text-center`}>Register</Link>
            </div>
            <div className="flex items-center gap-4 md:hidden">
              <Link href="/users/search" aria-label="Search">
                <Search size={20} />
              </Link>
              <button
                type="button"
                aria-label={menuOpen ? "Close menu" : "Open menu"}
                onClick={() => setMenuOpen((o) => !o)}
              >
                {menuOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>
          </>
        )}
      </div>

      {hydrated && !token && menuOpen && (
        <div className="flex items-center justify-center gap-3 border-border px-4 pb-4 md:hidden">
          <Link href="/login" className={`${loginLink} flex-1 text-center bg-gray-900 text-sm text-gray-25 font-bold`}>Login</Link>
          <Link href="/register" className={`${registerLink} flex-1 text-center bg-primary-300 text-sm text-gray-25 font-bold`}>Register</Link>
        </div>
      )}
    </header>
  );
}