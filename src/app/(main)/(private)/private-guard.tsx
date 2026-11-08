"use client";
import { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "@/hooks/use-auth";

export function PrivateGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const { token, hydrated } = useAuth();
  const ready = hydrated && !!token;

  useEffect(() => {
    if (hydrated && !token) {
      router.replace(`/login?returnTo=${encodeURIComponent(pathname)}`);
    }
  }, [hydrated, token, pathname, router]);

  return (
    <>
      {!ready && (
        <p className="py-20 text-center text-sm text-muted-foreground">
          Loading...
        </p>
      )}
      <div hidden={!ready}>{children}</div>
    </>
  );
}