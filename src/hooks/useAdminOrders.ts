import { useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useAdminOrderStore } from "@/lib/store/adminOrderStore";
import toast from "react-hot-toast";

export function useAdminOrders() {
  const store = useAdminOrderStore();
  const router = useRouter();

  // Fetch orders on mount
  useEffect(() => {
    store.fetchOrders();
  }, []);

  const handleStatusChange = useCallback(
    async (orderId: string, newStatus: string) => {
      try {
        await store.updateStatus(orderId, newStatus);
        toast.success(`Order ${orderId} updated to ${newStatus}`);
      } catch (error: any) {
        toast.error(error.message || "Failed to update status");
      }
    },
    [store],
  );

  const handleViewDetails = useCallback(
    (orderId: string) => {
      router.push(`/admin/orders/${orderId}`);
    },
    [router],
  );

  const handleExport = useCallback(async () => {
    try {
      const downloadUrl = await store.exportOrders();
      window.open(downloadUrl, "_blank");
      toast.success("Orders exported successfully");
    } catch (error: any) {
      toast.error(error.message || "Export failed");
    }
  }, [store]);

  const handlePrintInvoice = useCallback(
    async (orderId: string) => {
      try {
        await store.printInvoice(orderId);
        toast.success("Invoice sent to printer");
      } catch (error: any) {
        toast.error(error.message || "Print failed");
      }
    },
    [store],
  );

  return {
    // State
    orders: store.orders,
    filteredOrders: store.getFilteredOrders(),
    selectedOrder: store.selectedOrder,
    isLoading: store.isLoading,
    isSubmitting: store.isSubmitting,
    error: store.error,
    searchTerm: store.searchTerm,
    statusFilter: store.statusFilter,
    showStatusModal: store.showStatusModal,
    newStatus: store.newStatus,
    stats: store.getStats(),

    // Actions
    setSearchTerm: store.setSearchTerm,
    setStatusFilter: store.setStatusFilter,
    handleStatusChange,
    handleViewDetails,
    handleExport,
    handlePrintInvoice,
    openStatusModal: store.openStatusModal,
    closeStatusModal: store.closeStatusModal,
    setNewStatus: store.setNewStatus,
    clearError: store.clearError,
  };
}

export function useAdminOrderDetails(orderId: string) {
  const store = useAdminOrderStore();
  const router = useRouter();

  useEffect(() => {
    if (orderId) {
      store.fetchOrderDetails(orderId);
    }
  }, [orderId]);

  const handleUpdateStatus = useCallback(async () => {
    try {
      await store.updateStatus(orderId, store.newStatus);
      toast.success("Order status updated successfully");
    } catch (error: any) {
      toast.error(error.message || "Failed to update status");
    }
  }, [orderId, store]);

  const handleEmailCustomer = useCallback(() => {
    if (store.selectedOrder?.customer.email) {
      window.location.href = `mailto:${store.selectedOrder.customer.email}`;
    }
  }, [store.selectedOrder]);

  return {
    order: store.selectedOrder,
    isLoading: store.isLoading,
    isSubmitting: store.isSubmitting,
    error: store.error,
    showStatusModal: store.showStatusModal,
    newStatus: store.newStatus,
    handleUpdateStatus,
    handleEmailCustomer,
    openStatusModal: store.openStatusModal,
    closeStatusModal: store.closeStatusModal,
    setNewStatus: store.setNewStatus,
    clearError: store.clearError,
  };
}
