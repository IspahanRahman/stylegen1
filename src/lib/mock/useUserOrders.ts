import { useEffect, useCallback } from "react";
import { useUserOrderStore } from "@/lib/store/userOrderStore";
import { useAuthStore } from "@/lib/store/authStore";
import toast from "react-hot-toast";

export function useUserOrders() {
  const store = useUserOrderStore();
  const { isAuthenticated } = useAuthStore();

  // Fetch orders on mount if authenticated
  useEffect(() => {
    if (isAuthenticated) {
      store.fetchOrders();
    }
  }, [isAuthenticated]);

  const handleViewDetails = useCallback(
    async (orderId: string) => {
      await store.fetchOrderDetails(orderId);
      return store.selectedOrder;
    },
    [store],
  );

  const handleDownloadInvoice = useCallback(
    async (orderId: string) => {
      try {
        const downloadUrl = await store.downloadInvoice(orderId);
        window.open(downloadUrl, "_blank");
        toast.success("Invoice downloaded");
      } catch (error: any) {
        toast.error(error.message || "Failed to download invoice");
      }
    },
    [store],
  );

  const handleSearch = useCallback(
    (term: string) => {
      store.setSearchTerm(term);
    },
    [store],
  );

  const handleStatusFilter = useCallback(
    (status: string) => {
      store.setStatusFilter(status);
    },
    [store],
  );

  return {
    // State
    orders: store.orders,
    filteredOrders: store.getFilteredOrders(),
    selectedOrder: store.selectedOrder,
    isLoading: store.isLoading,
    error: store.error,
    searchTerm: store.searchTerm,
    statusFilter: store.statusFilter,

    // Actions
    handleViewDetails,
    handleDownloadInvoice,
    handleSearch,
    handleStatusFilter,
    clearError: store.clearError,
  };
}

export function useUserTrackOrder(orderId?: string) {
  const store = useUserOrderStore();

  useEffect(() => {
    if (orderId) {
      store.fetchTrackingInfo(orderId);
      store.fetchOrderDetails(orderId);
    }
  }, [orderId]);

  return {
    order: store.selectedOrder,
    trackingHistory: store.trackingHistory,
    currentStep: store.currentTrackingStep,
    isLoading: store.isLoading,
    error: store.error,
    clearError: store.clearError,
  };
}
