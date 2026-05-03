"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCartStore } from "@/lib/store/cartStore";
import { useAuthStore } from "@/lib/store/authStore";
import { formatCurrency } from "@/lib/utils/formatCurrency";
import toast from "react-hot-toast";

import CartItem from "@/components/cart/CartItem";
import CartSummary from "@/components/cart/CartSummary";

export default function CartPage() {
  const router = useRouter();
  const {
    items,
    removeItem,
    updateQuantity,
    getSubtotal,
    getTotal,
    clearCart,
  } = useCartStore();
  const { isAuthenticated } = useAuthStore();
  const [promoCode, setPromoCode] = useState("");

  const handleCheckout = () => {
    if (!isAuthenticated) {
      toast.error("Please login to checkout");
      router.push("/login?redirect=/checkout");
      return;
    }
    router.push("/checkout");
  };

  const handleApplyPromo = () => {
    toast.success("Promo applied (demo)");
  };

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="h-16 w-16 text-gray-400 mx-auto mb-4 flex items-center justify-center rounded-full bg-gray-100">
            🛒
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Your cart is empty
          </h2>
          <p className="text-gray-600 mb-6">Add some items to get started</p>
          <Link
            href="/products"
            className="inline-flex items-center gap-2 px-6 py-3 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors"
          >
            Continue Shopping
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Shopping Cart</h1>
            <p className="text-gray-600 mt-1">
              {items.length} item(s) in your cart
            </p>
          </div>
          <button
            onClick={() => {
              clearCart();
              toast.success("Cart cleared");
            }}
            className="text-sm text-red-600 hover:text-red-700 font-medium"
          >
            Clear Cart
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-4">
            {items.map((item) => (
              <CartItem
                key={`${item.productId}-${item.size}`}
                item={item}
                onRemove={removeItem}
                onUpdateQuantity={updateQuantity}
              />
            ))}

            <Link
              href="/products"
              className="inline-flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900"
            >
              Continue Shopping
            </Link>
          </div>

          <div className="lg:col-span-1">
            <CartSummary
              subtotal={getSubtotal()}
              discount={getSubtotal() - getTotal()}
              total={getTotal()}
              promoCode={promoCode}
              setPromoCode={setPromoCode}
              onApplyPromo={handleApplyPromo}
              onCheckout={handleCheckout}
              onClearCart={clearCart}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
