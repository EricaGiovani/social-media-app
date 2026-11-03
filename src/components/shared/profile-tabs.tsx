import { cn } from "@/lib/utils";

export function ProfileTabs<T extends string>({
  tabs,
  value,
  onChange,
}: {
  tabs: { key: T; label: string }[];
  value: T;
  onChange: (key: T) => void;
}) {
  return (
    <div role="tablist" className="flex border-b border-gray-900">
      {tabs.map((t) => (
        <button
          key={t.key}
          type="button"
          role="tab"
          aria-selected={value === t.key}
          onClick={() => onChange(t.key)}
          className={cn(
            "flex-1 border-b-2 py-2 text-sm font-semibold",
            value === t.key
              ? "border-foreground"
              : "border-transparent text-muted-foreground",
          )}
        >
          {t.label}
        </button>
      ))}
    </div>
  );
}