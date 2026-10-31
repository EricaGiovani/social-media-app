import Image from "next/image";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-black p-4">
      <div
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-[80%] h-[120vh] w-[200vw] -translate-x-1/2 rounded-[50%] bg-gradient-to-b from-[#5613A3] to-[#522BC8] blur-[150px]"
      />

      <div className="relative z-10 w-full max-w-sm space-y-6 rounded-2xl bg-card p-6">
        <div className="flex items-center justify-center gap-2">
          <Image src="/Icon Sociality.svg" alt="" width={30} height={30} priority />
          <span className="text-xl font-bold">Sociality</span>
        </div>
        {children}
      </div>
    </main>
  );
}