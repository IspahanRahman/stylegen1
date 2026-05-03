import { create } from "zustand";
import {
  adminOrderAPI,
  type Order,
  type OrderDetails,
} from "@/lib/mock/adminOrderApi";

interface OrderState {
  // Data
  orders: Order[];
  selectedOrder: OrderDetails | null;

  // UI State
  isLoading: boolean;
  isSubmitting: boolean;
  error: string | null;

  // Search & Filter
  searchTerm: string;
  statusFilter: string;

  // Modal State
  showStatusModal: boolean;
  newStatus: string;
  showOrderModal: boolean;
  showExportConfirm: boolean;

  // Actions
  fetchOrders: () => Promise<void>;
  fetchOrderDetails: (id: string) => Promise<void>;
  updateStatus: (orderId: string, newStatus: string) => Promise<void>;
  exportOrders: () => Promise<string>;
  printInvoice: (orderId: string) => Promise<void>;

  // UI Actions
  setSearchTerm: (term: string) => void;
  setStatusFilter: (status: string) => void;
  openStatusModal: () => void;
  closeStatusModal: () => void;
  setNewStatus: (status: string) => void;
  openOrderModal: (order: Order) => void;
  closeOrderModal: () => void;

  // Utils
  clearError: () => void;
  getFilteredOrders: () => Order[];
  getStats: () => {
    total: number;
    pending: number;
    processing: number;
    shipped: number;
    delivered: number;
    cancelled: number;
  };
}

export const useAdminOrderStore = create<OrderState>((set, get) => ({
  // Initial State
  orders: [],
  selectedOrder: null,
  isLoading: false,
  isSubmitting: false,
  error: null,
  searchTerm: "",
  statusFilter: "all",
  showStatusModal: false,
  newStatus: "",
  showOrderModal: false,
  showExportConfirm: false,

  // Data Actions
  fetchOrders: async () => {
    set({ isLoading: true, error: null });

    try {
      const response = await adminOrderAPI.getAll();
      set({ orders: response.orders, isLoading: false });
    } catch (error: any) {
      set({ error: error.message, isLoading: false });
    }
  },

  fetchOrderDetails: async (id: string) => {
    set({ isLoading: true, error: null });

    try {
      const response = await adminOrderAPI.getById(id);
      set({ selectedOrder: response.order, isLoading: false });
    } catch (error: any) {
      set({ error: error.message, isLoading: false });
    }
  },

  updateStatus: async (orderId: string, newStatus: string) => {
    set({ isSubmitting: true, error: null });

    try {
      await adminOrderAPI.updateStatus(orderId, newStatus);

      set((state) => ({
        orders: state.orders.map((o) =>
          o.id === orderId ? { ...o, status: newStatus as Order["status"] } : o,
        ),
        selectedOrder: state.selectedOrder
          ? { ...state.selectedOrder, status: newStatus as Order["status"] }
          : null,
        isSubmitting: false,
        showStatusModal: false,
      }));
    } catch (error: any) {
      set({ error: error.message, isSubmitting: false });
      throw error;
    }
  },

  exportOrders: async () => {
    try {
      const response = await adminOrderAPI.exportOrders();
      return response.downloadUrl;
    } catch (error: any) {
      throw new Error(error.message);
    }
  },

  printInvoice: async (orderId: string) => {
    try {
      await adminOrderAPI.printInvoice(orderId);
    } catch (error: any) {
      throw new Error(error.message);
    }
  },

  // UI Actions
  setSearchTerm: (term) => set({ searchTerm: term }),

  setStatusFilter: (status) => set({ statusFilter: status }),

  openStatusModal: () => {
    const { selectedOrder } = get();
    set({
      showStatusModal: true,
      newStatus: selectedOrder?.status || "pending",
    });
  },

  closeStatusModal: () => set({ showStatusModal: false }),

  setNewStatus: (status) => set({ newStatus: status }),

  openOrderModal: async (order) => {
    set({ showOrderModal: true });
    await get().fetchOrderDetails(order.id);
  },

  closeOrderModal: () => set({ showOrderModal: false, selectedOrder: null }),

  // Utils
  clearError: () => set({ error: null }),

  getFilteredOrders: () => {
    const { orders, searchTerm, statusFilter } = get();

    return orders.filter((order) => {
      const matchesSearch =
        !searchTerm ||
        order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.customer.name.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesStatus =
        statusFilter === "all" || order.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  },

  getStats: () => {
    const { orders } = get();

    return {
      total: orders.length,
      pending: orders.filter((o) => o.status === "pending").length,
      processing: orders.filter((o) => o.status === "processing").length,
      shipped: orders.filter((o) => o.status === "shipped").length,
      delivered: orders.filter((o) => o.status === "delivered").length,
      cancelled: orders.filter((o) => o.status === "cancelled").length,
    };
  },
}));
