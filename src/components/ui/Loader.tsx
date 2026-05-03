"use client";

import React from "react";

type Size = "sm" | "md" | "lg";

export default function Loader({
  size = "md",
  message,
}: {
  size?: Size;
  message?: string;
}) {
  const sizeClass =
    size === "sm"
      ? "w-4 h-4 border-2"
      : size === "lg"
        ? "w-10 h-10 border-4"
        : "w-6 h-6 border-3";

  return (
    <div className="flex flex-col items-center justify-center p-6">
      <div
        className={`rounded-full animate-spin border-orange-500 border-t-transparent ${sizeClass}`}
      />
      {message && <p className="mt-3 text-sm text-gray-600">{message}</p>}
    </div>
  );
}
