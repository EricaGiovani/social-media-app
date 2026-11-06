"use client";
import { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "@/hooks/use-auth";

export default function PrivateLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const { token, hydrated } = useAuth();

  useEffect(() => {
    if (hydrated && !token) {
      router.replace(`/login?returnTo=${encodeURIComponent(pathname)}`);
    }
  }, [hydrated, token, pathname, router]);

  if (!hydrated || !token) {
    return <p className="py-20 text-center text-sm text-muted-foreground">Loading...</p>;
  }
  return <>{children}</>;
}