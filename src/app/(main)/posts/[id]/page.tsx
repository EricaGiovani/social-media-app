import { Suspense } from "react";
import { PostView } from "./post-view";

export default function Page() {
  return (
    <Suspense fallback={<div className="h-96 animate-pulse rounded-md bg-gray-900" />}>
      <PostView />
    </Suspense>
  );
}