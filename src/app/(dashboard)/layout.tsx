import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Dashboard - StyleGen",
  description: "Your StyleGen dashboard",
};

export default function DashboardRootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <div>{children}</div>;
}
