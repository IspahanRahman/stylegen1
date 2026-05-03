"use client";

import { useState } from "react";
import { useCart } from "@/hooks/useCart";
import { ShoppingCart, Check, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils/cn";

interface AddToCartButtonProps {
  product: any;
  quantity?: number;
  selectedSize?: string;
  className?: string;
  variant?: "primary" | "outline" | "icon";
  showQuantity?: boolean;
}

export default function AddToCartButton({
  product,
  quantity = 1,
  selectedSize,
  className,
  variant = "primary",
  showQuantity = false,
}: AddToCartButtonProps) {
  const { addToCart } = useCart();
  const [isAdded, setIsAdded] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleAddToCart = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (isAdded) return;

    setIsLoading(true);

    // Simulate small delay for better UX
    await new Promise((resolve) => setTimeout(resolve, 300));

    addToCart(product, quantity, selectedSize);

    setIsLoading(false);
    setIsAdded(true);

    // Reset after 2 seconds
    setTimeout(() => setIsAdded(false), 2000);
  };

  if (product.stock === 0) {
    return (
      <button
        disabled
        className={cn(
          "px-4 py-2 bg-gray-300 text-gray-500 rounded-lg text-sm font-medium cursor-not-allowed",
          className,
        )}
      >
        Out of Stock
      </button>
    );
  }

  const variants = {
    primary: cn(
      "px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600",
      "text-sm font-medium transition-all duration-200",
      isAdded && "bg-green-500 hover:bg-green-600",
    ),
    outline: cn(
      "px-4 py-2 border-2 border-orange-500 text-orange-500 rounded-lg hover:bg-orange-50",
      "text-sm font-medium transition-all duration-200",
      isAdded && "border-green-500 text-green-500 hover:bg-green-50",
    ),
    icon: cn(
      "p-2 rounded-full",
      "transition-all duration-200",
      isAdded
        ? "bg-green-500 text-white"
        : "bg-white text-gray-600 hover:bg-orange-500 hover:text-white",
    ),
  };

  return (
    <button
      onClick={handleAddToCart}
      disabled={isLoading || isAdded}
      className={cn(
        variants[variant],
        "disabled:opacity-50 disabled:cursor-not-allowed inline-flex items-center gap-2",
        className,
      )}
    >
      {isLoading ? (
        <Loader2 className="h-4 w-4 animate-spin" />
      ) : isAdded ? (
        <Check className="h-4 w-4" />
      ) : (
        <ShoppingCart className="h-4 w-4" />
      )}
      {variant !== "icon" && (
        <span>
          {isAdded
            ? "Added!"
            : showQuantity
              ? `Add (${quantity})`
              : "Add to Cart"}
        </span>
      )}
    </button>
  );
}
