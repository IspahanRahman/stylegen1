import { useCallback } from "react";
import { useRouter } from "next/navigation";
import { useCartStore, type CartItem } from "@/lib/store/cartStore";
import { useAuthStore } from "@/lib/store/authStore";
import toast from "react-hot-toast";

export function useCart() {
  const cart = useCartStore();
  const router = useRouter();
  const { isAuthenticated } = useAuthStore();

  const addToCart = useCallback(
    (product: any, quantity: number = 1, selectedSize?: string) => {
      const cartItem: CartItem = {
        productId: product.id,
        name: product.name,
        price:
          product.discount > 0
            ? product.price - (product.price * product.discount) / 100
            : product.price,
        originalPrice: product.price,
        discount: product.discount || 0,
        quantity,
        size: selectedSize,
        image: product.images?.[0] || "/images/placeholder.png",
        stock: product.stock,
        category: product.category,
      };

      // Check if item already exists
      const existing = cart.getItemById(product.id, selectedSize);
      if (existing && existing.quantity + quantity > product.stock) {
        toast.error(`Only ${product.stock} items available in stock`);
        return;
      }

      if (quantity > product.stock) {
        toast.error(`Only ${product.stock} items available in stock`);
        return;
      }

      cart.addItem(cartItem);
      cart.openCart();
      toast.success(`${product.name} added to cart!`);
    },
    [cart],
  );

  const removeFromCart = useCallback(
    (productId: string, size?: string) => {
      cart.removeItem(productId, size);
      toast.success("Item removed from cart");
    },
    [cart],
  );

  const updateQuantity = useCallback(
    (productId: string, quantity: number, stock: number, size?: string) => {
      if (quantity > stock) {
        toast.error(`Only ${stock} items available`);
        return;
      }
      cart.updateQuantity(productId, quantity, size);
    },
    [cart],
  );

  const proceedToCheckout = useCallback(() => {
    if (cart.items.length === 0) {
      toast.error("Your cart is empty");
      return;
    }

    if (!isAuthenticated) {
      toast.error("Please login to checkout");
      router.push("/login?redirect=/checkout");
      return;
    }

    router.push("/checkout");
    cart.closeCart();
  }, [cart, isAuthenticated, router]);

  const viewCart = useCallback(() => {
    if (cart.items.length === 0) {
      toast.error("Your cart is empty");
      return;
    }
    router.push("/cart");
    cart.closeCart();
  }, [cart, router]);

  return {
    // State
    items: cart.items,
    isOpen: cart.isOpen,
    itemCount: cart.getItemCount(),
    subtotal: cart.getSubtotal(),
    discount: cart.getDiscount(),
    total: cart.getTotal(),

    // Actions
    addToCart,
    removeFromCart,
    updateQuantity,
    toggleCart: cart.toggleCart,
    openCart: cart.openCart,
    closeCart: cart.closeCart,
    clearCart: cart.clearCart,
    proceedToCheckout,
    viewCart,
  };
}
