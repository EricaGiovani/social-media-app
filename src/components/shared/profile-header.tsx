import Link from "next/link";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { fixUrl } from "@/lib/url";

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
      <header className="flex items-center gap-4">
        <Avatar className="size-16">
          <AvatarImage src={fixUrl(avatarUrl)} alt="" />
          <AvatarFallback>{name[0]?.toUpperCase()}</AvatarFallback>
        </Avatar>
        <div className="min-w-0">
          <h1 className="truncate font-bold text-sm md:text-[15px] xl:text-md text-gray-25">{name}</h1>
          <p className="truncate font-regular text-sm md:text-[15px] xl:text-md text-muted-foreground">{username}</p>
        </div>
      </header>

      {action}

      {bio && <p className="whitespace-pre-line md:text-[15px] xl:text-md break-words text-sm">{bio}</p>}

      <div className="grid grid-cols-4 text-center">
        {stats.map((s) => {
          const inner = (
            <>
              <p className="text-lg xl:text-xl md:text-md  font-bold text-gray-25">{s.value}</p>
              <p className="text-xs xl:text-md md:text-sm font-regular text-muted-foreground">{s.label}</p>
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