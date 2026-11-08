import { PrivateGuard } from "./private-guard";

export const instant = false;

export default function PrivateLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <PrivateGuard>{children}</PrivateGuard>;
}