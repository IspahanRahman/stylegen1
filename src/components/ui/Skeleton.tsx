"use client";

import React from "react";

type Variant = "card" | "text" | "avatar" | "product";

export default function Skeleton({
  variant = "card",
  count = 1,
  className = "",
}: {
  variant?: Variant;
  count?: number;
  className?: string;
}) {
  const items = Array.from({ length: count });

  const renderItem = (i: number) => {
    switch (variant) {
      case "text":
        return (
          <div key={i} className={`space-y-2 ${className}`}>
            <div className="h-4 bg-gray-200 rounded w-3/4 animate-pulse" />
            <div className="h-3 bg-gray-200 rounded w-1/2 animate-pulse" />
          </div>
        );
      case "avatar":
        return (
          <div key={i} className={`flex items-center gap-3 ${className}`}>
            <div className="h-12 w-12 rounded-full bg-gray-200 animate-pulse" />
            <div className="flex-1">
              <div className="h-4 bg-gray-200 rounded w-1/2 animate-pulse" />
            </div>
          </div>
        );
      case "product":
        return (
          <div key={i} className={`bg-white rounded-xl p-4 ${className}`}>
            <div className="aspect-square bg-gray-200 rounded-lg mb-4 animate-pulse" />
            <div className="h-4 bg-gray-200 rounded w-3/4 mb-2 animate-pulse" />
            <div className="h-4 bg-gray-200 rounded w-1/2 animate-pulse" />
          </div>
        );
      default:
        return (
          <div key={i} className={`bg-white rounded p-4 ${className}`}>
            <div className="h-6 bg-gray-200 rounded mb-2 animate-pulse" />
            <div className="h-4 bg-gray-200 rounded w-5/6 animate-pulse" />
          </div>
        );
    }
  };

  return <>{items.map((_, i) => renderItem(i))}</>;
}
