type EventName =
  | "view_post"
  | "like"
  | "unlike"
  | "follow"
  | "unfollow"
  | "save"
  | "unsave"
  | "comment_submit";

const key = "analytics-events";
const max = 100;

export function track(
  event: EventName,
  props: Record<string, string | number> = {},
) {
  if (typeof window === "undefined") return;
  const entry = { event, ...props, at: new Date().toISOString() };

  if (process.env.NODE_ENV !== "production") {
    console.debug("[analytics]", entry);
  }
  try {
    const list = JSON.parse(localStorage.getItem(key) ?? "[]");
    list.push(entry);
    localStorage.setItem(key, JSON.stringify(list.slice(-max)));
  } catch {
  }
}