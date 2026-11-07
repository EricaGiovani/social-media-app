import { Suspense } from "react";
import { FollowersView } from "./followers-view";

export default function Page() {
  return (
    <Suspense fallback={<div className="h-40 animate-pulse rounded-md bg-gray-900" />}>
      <FollowersView />
    </Suspense>
  );
}