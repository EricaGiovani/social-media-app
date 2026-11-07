import { Suspense } from "react";
import { FollowingView } from "./following-view";

export default function Page() {
  return (
    <Suspense fallback={<div className="h-40 animate-pulse rounded-md bg-gray-900" />}>
      <FollowingView />
    </Suspense>
  );
}