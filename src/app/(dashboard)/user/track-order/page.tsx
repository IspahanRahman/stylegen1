"use client";

import dynamic from "next/dynamic";

const UserTrackOrderClient = dynamic(
  () => import("@/components/user/UserTrackOrder"),
  {
    ssr: false,
  },
);

export default function TrackOrderPage() {
  return <UserTrackOrderClient />;
}
