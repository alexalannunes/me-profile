import { ReactNode } from "react";

export function DashboardLayout({ children }: { children: ReactNode }) {
  return <div className="flex min-h-screen">{children}</div>;
}
