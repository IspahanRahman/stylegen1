import { create } from "zustand";
import { persist } from "zustand/middleware";
import { toast } from "react-hot-toast";

export interface CartItem {
  productId: string;
  name: string;
  price: number;
  originalPrice?: number;
  discount?: number;
  quantity: number;
  size?: string;
  image: string;
  stock: number;
  category: string;
}

interface CartState {
  items: CartItem[];
  isOpen: boolean;

  // Actions
  addItem: (item: CartItem) => void;
  removeItem: (productId: string, size?: string) => void;
  updateQuantity: (productId: string, quantity: number, size?: string) => void;
  toggleCart: () => void;
  openCart: () => void;
  closeCart: () => void;
  clearCart: () => void;

  // Computed
  getItemCount: () => number;
  getSubtotal: () => number;
  getDiscount: () => number;
  getTotal: () => number;
  getItemById: (productId: string, size?: string) => CartItem | undefined;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      isOpen: false,

      addItem: (item) => {
        set((state) => {
          const existingItem = state.items.find(
            (i) =>
              i.productId === item.productId &&
              (item.size ? i.size === item.size : !i.size),
          );

          if (existingItem) {
            const newQuantity = existingItem.quantity + item.quantity;
            // Check stock limit
            if (newQuantity > item.stock) {
              return state; // Don't add if exceeds stock
            }

            return {
              items: state.items.map((i) =>
                i.productId === item.productId &&
                (item.size ? i.size === item.size : !i.size)
                  ? { ...i, quantity: newQuantity }
                  : i,
              ),
            };
          }

          // Validate quantity against stock
          if (item.quantity > item.stock) {
            return state;
          }

          return {
            items: [...state.items, item],
          };
        });
      },

      removeItem: (productId, size) => {
        set((state) => ({
          items: state.items.filter(
            (i) => !(i.productId === productId && (!size || i.size === size)),
          ),
        }));
      },

      updateQuantity: (productId, quantity, size) => {
        if (quantity <= 0) {
          get().removeItem(productId, size);
          return;
        }

        set((state) => ({
          items: state.items.map((i) =>
            i.productId === productId && (!size || i.size === size)
              ? { ...i, quantity }
              : i,
          ),
        }));
      },

      toggleCart: () => set((state) => ({ isOpen: !state.isOpen })),
      openCart: () => set({ isOpen: true }),
      closeCart: () => set({ isOpen: false }),
      clearCart: () => set({ items: [] }),

      getItemCount: () => {
        return get().items.reduce((sum, item) => sum + item.quantity, 0);
      },

      getSubtotal: () => {
        return get().items.reduce((sum, item) => {
          const price = item.originalPrice || item.price;
          return sum + price * item.quantity;
        }, 0);
      },

      getDiscount: () => {
        return get().getSubtotal() - get().getTotal();
      },

      getTotal: () => {
        return get().items.reduce(
          (sum, item) => sum + item.price * item.quantity,
          0,
        );
      },

      getItemById: (productId, size) => {
        return get().items.find(
          (i) => i.productId === productId && (!size || i.size === size),
        );
      },
    }),
    {
      name: "stylegen-cart",
      // Only persist items, not the open state
      partialize: (state) => ({ items: state.items }),
    },
  ),
);
