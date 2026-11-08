import Link from "next/link";
import Image from "next/image";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { fixUrl } from "@/lib/url";

const shareIcon = "/IconShare.svg"; 

type Stat = { label: string; value: number; href?: string };

export function ProfileHeader({
  name,
  username,
  avatarUrl,
  bio,
  stats,
  action,
}: {
  name: string;
  username: string;
  avatarUrl: string | null;
  bio: string | null;
  stats: Stat[];
  action: React.ReactNode;
}) {
  return (
    <div className="space-y-5">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <header className="flex min-w-0 items-center gap-4">
          <Avatar className="size-16 md:size-20">
            <AvatarImage src={fixUrl(avatarUrl)} alt="" />
            <AvatarFallback>{name[0]?.toUpperCase()}</AvatarFallback>
          </Avatar>
          <div className="min-w-0">
            <h1 className="truncate font-bold text-sm md:text-[15px] xl:text-md text-gray-25">{name}</h1>
            <p className="truncate font-regular text-sm md:text-[15px] xl:text-md text-muted-foregroun text-muted-foreground">{username}</p>
          </div>
        </header>

        <div className="flex items-center gap-3">
          <div className="flex-1 md:flex-none">{action}</div>
          <button
            type="button"
            aria-label="Share profile"
            className="flex size-10 shrink-0 items-center justify-center"
          >
            <Image src={shareIcon} alt="" width={22} height={22} />
          </button>
        </div>
      </div>

      {bio && <p className="whitespace-pre-line break-words text-sm">{bio}</p>}

      <div className="grid grid-cols-4 text-center">
        {stats.map((s) => {
          const inner = (
            <>
              <p className="text-lg font-bold text-sm md:text-[15px] xl:text-md text-muted-foreground">{s.value}</p>
              <p className="text-xs text-muted-foreground">{s.label}</p>
            </>
          );
          return s.href ? (
            <Link key={s.label} href={s.href} className="block">
              {inner}
            </Link>
          ) : (
            <div key={s.label}>{inner}</div>
          );
        })}
      </div>
    </div>
  );
}