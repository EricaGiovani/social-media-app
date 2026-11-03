export const fixUrl = (u?: string | null) =>
  u ? (u.startsWith("//") ? `https:${u}` : u) : undefined;

export const safeDecode = (s: string) => {
  try {
    return decodeURIComponent(s);
  } catch {
    return s;
  }
};