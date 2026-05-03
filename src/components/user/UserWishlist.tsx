"use client";

import React from "react";
import Link from "next/link";
import { useWishlistStore } from "@/lib/store/wishlistStore";
import { useCart } from "@/hooks/useCart";
import { formatCurrency } from "@/lib/utils/formatCurrency";
import { Heart, ShoppingCart } from "lucide-react";
import { useAuthStore } from "@/lib/store/authStore";
import Skeleton from "@/components/ui/Skeleton";

export default function UserWishList() {
  const { user } = useAuthStore();
  const items = useWishlistStore((s) => s.items);
  const remove = useWishlistStore((s) => s.remove);
  const { addToCart } = useCart();

  if (!user) {
    return (
      <div className="p-6 bg-white rounded-xl shadow-sm border border-gray-100">
        <p className="text-gray-700">Sign in to view your wishlist.</p>
        <Link href="/login" className="mt-3 inline-block text-orange-500">
          Sign in
        </Link>
      </div>
    );
  }

  if (!items) {
    return (
      <div>
        <Skeleton variant="product" count={4} />
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="p-6 bg-white rounded-xl shadow-sm border border-gray-100 text-center">
        <Heart className="mx-auto h-12 w-12 text-gray-400 mb-3" />
        <p className="text-gray-600">Your wishlist is empty.</p>
        <Link href="/products" className="text-orange-500 mt-2 inline-block">
          Browse products
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {items.map((p) => (
          <div
            key={p.productId}
            className="bg-white rounded-xl p-4 shadow-sm border border-gray-100"
          >
            <div className="aspect-square bg-gray-100 rounded-lg mb-4 overflow-hidden flex items-center justify-center">
              {p.image ? (
                <img
                  src={p.image}
                  alt={p.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <span className="text-gray-500">No image</span>
              )}
            </div>
            <p className="font-medium text-gray-900">{p.name}</p>
            <p className="text-sm text-gray-500">{formatCurrency(p.price)}</p>
            <div className="mt-4 flex items-center gap-2">
              <button
                onClick={() =>
                  addToCart({
                    productId: p.productId,
                    name: p.name,
                    price: p.price,
                    image: p.image || "",
                    stock: 10,
                  })
                }
                className="px-3 py-2 bg-orange-500 text-white rounded-lg inline-flex items-center gap-2"
              >
                <ShoppingCart className="h-4 w-4" /> Add to cart
              </button>
              <button
                onClick={() => remove(p.productId)}
                className="px-3 py-2 border border-gray-300 rounded-lg text-sm text-gray-700"
              >
                Remove
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
