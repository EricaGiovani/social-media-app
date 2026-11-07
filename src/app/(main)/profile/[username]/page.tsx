import { Suspense } from "react";
import { ProfileView } from "./profile-view";

export default function Page() {
  return (
    <Suspense fallback={<div className="h-64 animate-pulse rounded-md bg-gray-900" />}>
      <ProfileView />
    </Suspense>
  );
}