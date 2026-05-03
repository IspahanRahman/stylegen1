import { useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useAdminCustomerStore } from "@/lib/store/adminCustomerStore";
import toast from "react-hot-toast";

export function useAdminCustomers() {
  const store = useAdminCustomerStore();
  const router = useRouter();

  // Fetch customers on mount
  useEffect(() => {
    store.fetchCustomers();
  }, []);

  const handleStatusChange = useCallback(
    async (customerId: string, newStatus: string) => {
      try {
        await store.updateStatus(customerId, newStatus);
        toast.success(`Customer status updated to ${newStatus}`);
      } catch (error: any) {
        toast.error(error.message || "Failed to update status");
      }
    },
    [store],
  );

  const handleViewDetails = useCallback(
    (customerId: string) => {
      router.push(`/admin/customers/${customerId}`);
    },
    [router],
  );

  const handleAddNote = useCallback(async () => {
    const note = store.newNote;
    if (!note.trim()) {
      toast.error("Please enter a note");
      return;
    }

    try {
      await store.addNote(note);
      toast.success("Note added successfully");
    } catch (error: any) {
      toast.error(error.message || "Failed to add note");
    }
  }, [store]);

  const handleEmailCustomer = useCallback((email: string) => {
    window.location.href = `mailto:${email}`;
  }, []);

  // Fetch a single customer by ID and handle errors/toast
  const fetchCustomerDetails = useCallback(
    async (id: string) => {
      try {
        await store.fetchCustomerDetails(id);
      } catch (error: any) {
        toast.error(error.message || "Failed to fetch customer details");
      }
    },
    [store],
  );

  return {
    // State
    customers: store.customers,
    filteredCustomers: store.getFilteredCustomers(),
    selectedCustomer: store.selectedCustomer,
    isLoading: store.isLoading,
    isSubmitting: store.isSubmitting,
    error: store.error,
    searchTerm: store.searchTerm,
    statusFilter: store.statusFilter,
    newNote: store.newNote,
    showStatusModal: store.showStatusModal,
    showDetailsModal: store.showDetailsModal,
    stats: store.getCustomerStats(),

    // Actions
    setSearchTerm: store.setSearchTerm,
    setStatusFilter: store.setStatusFilter,
    setNewNote: store.setNewNote,
    handleStatusChange,
    handleViewDetails,
    handleAddNote,
    handleEmailCustomer,
    openStatusModal: store.openStatusModal,
    closeStatusModal: store.closeStatusModal,
    openDetailsModal: store.openDetailsModal,
    closeDetailsModal: store.closeDetailsModal,
    clearError: store.clearError,
    fetchCustomerDetails,
  };
}
