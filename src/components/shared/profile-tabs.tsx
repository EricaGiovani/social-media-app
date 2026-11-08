import Image from "next/image";
import { cn } from "@/lib/utils";

type Tab<T extends string> = {
  key: T;
  label: string;
  icon: string; 
  activeIcon?: string;
};

export function ProfileTabs<T extends string>({
  tabs,
  value,
  onChange,
}: {
  tabs: Tab<T>[];
  value: T;
  onChange: (key: T) => void;
}) {
  return (
    <div role="tablist" className="flex border-b border-gray-900">
      {tabs.map((t) => {
        const active = value === t.key;
        return (
          <button
            key={t.key}
            type="button"
            role="tab"
            aria-selected={active}
            onClick={() => onChange(t.key)}
            className={cn(
              "flex flex-1 items-center justify-center gap-2 border-b-2 py-3 text-sm font-semibold",
              active
                ? "border-foreground"
                : "border-transparent text-muted-foreground",
            )}
          >
            <Image
              src={active ? (t.activeIcon ?? t.icon) : t.icon}
              alt=""
              width={24}
              height={24}
            />
            {t.label}
          </button>
        );
      })}
    </div>
  );
}