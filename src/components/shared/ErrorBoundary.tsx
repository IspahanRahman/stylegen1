import React from "react";
export default function ErrorBoundary({
  children,
}: {
  children: React.ReactNode;
}) {
  return <div>{children}</div>;
}
