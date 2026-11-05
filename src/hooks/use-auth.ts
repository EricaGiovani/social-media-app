import { useSyncExternalStore } from "react";
import { useAppSelector } from "@/store/hooks";

const subscribe = () => () => {};

export function useAuth() {
  const mounted = useSyncExternalStore(subscribe, () => true, () => false);
  const { token, user, hydrated } = useAppSelector((s) => s.auth);

  return {
    token: mounted ? token : null,
    user: mounted ? user : null,
    hydrated: mounted && hydrated,
  };
}