"use client";
import { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useAppSelector } from "@/store/hooks";
import { Navbar } from "@/components/layout/navbar";
import { BottomNav } from "@/components/layout/bottom-nav";

export default function MainLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const { token, hydrated } = useAppSelector((s) => s.auth);

  useEffect(() => {
    if (hydrated && !token) {
      router.replace(`/login?returnTo=${encodeURIComponent(pathname)}`);
    }
  }, [hydrated, token, pathname, router]);

  if (!hydrated || !token) {
    return (
      <div className="flex min-h-screen items-center justify-center text-sm text-muted-foreground">
        Loading...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black">
      <Navbar />
      <main className="mx-auto w-full max-w-xl px-4 pb-28 pt-20 md:pb-8">
        {children}
      </main>
      <BottomNav />
    </div>
  );
}