import { Navbar } from "@/components/layout/navbar";
import { BottomNav } from "@/components/layout/bottom-nav";

export default function MainLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-black">
      <Navbar />
      <main className="mx-auto w-full max-w-[812px] px-4 pb-28 pt-20">{children}</main>
      <BottomNav />
    </div>
  );
}