import React from "react";
import { ChevronRight, Shield, Truck, RefreshCw } from "lucide-react";
import { formatCurrency } from "@/lib/utils/formatCurrency";

type Props = {
  subtotal: number;
  discount: number;
  total: number;
  promoCode: string;
  setPromoCode: (s: string) => void;
  onApplyPromo: () => void;
  onCheckout: () => void;
  onClearCart: () => void;
};

export default function CartSummary({
  subtotal,
  discount,
  total,
  promoCode,
  setPromoCode,
  onApplyPromo,
  onCheckout,
  onClearCart,
}: Props) {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 sticky top-24">
      <h2 className="text-lg font-semibold text-gray-900 mb-4">
        Order Summary
      </h2>

      <div className="space-y-3 text-sm">
        <div className="flex justify-between">
          <span className="text-gray-600">Subtotal</span>
          <span className="font-medium">{formatCurrency(subtotal)}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-600">Discount</span>
          <span className="font-medium text-green-600">
            -{formatCurrency(discount)}
          </span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-600">Shipping</span>
          <span className="font-medium text-green-600">Free</span>
        </div>
        <hr />
        <div className="flex justify-between text-lg font-bold">
          <span>Total</span>
          <span>{formatCurrency(total)}</span>
        </div>
      </div>

      <div className="mt-4">
        <div className="flex gap-2">
          <input
            type="text"
            placeholder="Promo code"
            value={promoCode}
            onChange={(e) => setPromoCode(e.target.value)}
            className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-orange-500"
          />
          <button
            onClick={onApplyPromo}
            className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-200"
          >
            Apply
          </button>
        </div>
      </div>

      <button
        onClick={onCheckout}
        className="w-full mt-6 px-6 py-3 bg-orange-500 text-white rounded-lg font-medium hover:bg-orange-600 transition-colors flex items-center justify-center gap-2"
      >
        Proceed to Checkout
        <ChevronRight className="h-4 w-4" />
      </button>

      <div className="mt-6 space-y-3">
        <div className="flex items-center gap-3 text-sm text-gray-600">
          <Shield className="h-4 w-4 text-green-500" />
          Secure Checkout
        </div>
        <div className="flex items-center gap-3 text-sm text-gray-600">
          <Truck className="h-4 w-4 text-blue-500" />
          Free Shipping
        </div>
        <div className="flex items-center gap-3 text-sm text-gray-600">
          <RefreshCw className="h-4 w-4 text-purple-500" />
          30-Day Returns
        </div>
      </div>

      <button
        onClick={onClearCart}
        className="w-full mt-4 text-sm text-red-600 hover:text-red-700"
      >
        Clear Cart
      </button>
    </div>
  );
}
