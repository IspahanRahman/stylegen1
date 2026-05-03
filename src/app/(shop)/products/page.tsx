"use client";

import dynamic from "next/dynamic";

const ProductsClient = dynamic(
  () => import("@/components/shop/ProductsClient"),
  { ssr: false },
);

export default function ProductsPage() {
  return <ProductsClient />;
}
