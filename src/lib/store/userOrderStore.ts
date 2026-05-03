import { create } from "zustand";
import {
  userOrderAPI,
  type UserOrder,
  type TrackingEvent,
} from "@/lib/mock/userOrderApi";

interface UserOrderState {
  // Data
  orders: UserOrder[];
  selectedOrder: UserOrder | null;
  trackingHistory: TrackingEvent[];
  currentTrackingStep: number;

  // UI State
  isLoading: boolean;
  error: string | null;

  // Filters
  searchTerm: string;
  statusFilter: string;

  // Actions
  fetchOrders: () => Promise<void>;
  fetchOrderDetails: (orderId: string) => Promise<void>;
  fetchTrackingInfo: (orderId: string) => Promise<void>;
  createOrder: (orderData: any) => Promise<string>;
  downloadInvoice: (orderId: string) => Promise<string>;

  // UI Actions
  setSearchTerm: (term: string) => void;
  setStatusFilter: (status: string) => void;
  clearError: () => void;

  // Utils
  getFilteredOrders: () => UserOrder[];
}

export const useUserOrderStore = create<UserOrderState>((set, get) => ({
  // Initial State
  orders: [],
  selectedOrder: null,
  trackingHistory: [],
  currentTrackingStep: 1,
  isLoading: false,
  error: null,
  searchTerm: "",
  statusFilter: "all",

  // Actions
  fetchOrders: async () => {
    set({ isLoading: true, error: null });

    try {
      // Get current user from auth store
      const authStore = (await import("@/lib/store/authStore")).useAuthStore;
      const user = authStore.getState().user;

      if (!user) {
        set({ orders: [], isLoading: false });
        return;
      }

      const response = await userOrderAPI.getOrders(user.id);
      set({ orders: response.orders, isLoading: false });
    } catch (error: any) {
      set({ error: error.message, isLoading: false });
    }
  },

  fetchOrderDetails: async (orderId: string) => {
    set({ isLoading: true, error: null });

    try {
      const response = await userOrderAPI.getOrderById(orderId);
      set({ selectedOrder: response.order, isLoading: false });
    } catch (error: any) {
      set({ error: error.message, isLoading: false });
    }
  },

  fetchTrackingInfo: async (orderId: string) => {
    set({ isLoading: true, error: null });

    try {
      const response = await userOrderAPI.getTrackingInfo(orderId);
      set({
        trackingHistory: response.tracking,
        currentTrackingStep: response.currentStep,
        isLoading: false,
      });
    } catch (error: any) {
      set({ error: error.message, isLoading: false });
    }
  },

  createOrder: async (orderData: any) => {
    set({ isLoading: true, error: null });

    try {
      const response = await userOrderAPI.createOrder(orderData);
      const newOrder = response.order;

      set((state) => ({
        orders: [newOrder, ...state.orders],
        isLoading: false,
      }));

      return newOrder.id;
    } catch (error: any) {
      set({ error: error.message, isLoading: false });
      throw error;
    }
  },

  downloadInvoice: async (orderId: string) => {
    try {
      const response = await userOrderAPI.downloadInvoice(orderId);
      return response.downloadUrl;
    } catch (error: any) {
      throw new Error(error.message);
    }
  },

  // UI Actions
  setSearchTerm: (term) => set({ searchTerm: term }),

  setStatusFilter: (status) => set({ statusFilter: status }),

  clearError: () => set({ error: null }),

  // Utils
  getFilteredOrders: () => {
    const { orders, searchTerm, statusFilter } = get();

    return orders.filter((order) => {
      const matchesSearch =
        !searchTerm ||
        order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.items.some((item) =>
          item.name.toLowerCase().includes(searchTerm.toLowerCase()),
        );

      const matchesStatus =
        statusFilter === "all" || order.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  },
}));
