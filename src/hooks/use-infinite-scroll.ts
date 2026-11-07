import { useEffect, useRef } from "react";

export function useInfiniteScroll(onVisible: () => void, enabled: boolean) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el || !enabled) return;
    const io = new IntersectionObserver(
      ([e]) => e.isIntersecting && onVisible(),
      { rootMargin: "300px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [onVisible, enabled]);

  return ref;
}