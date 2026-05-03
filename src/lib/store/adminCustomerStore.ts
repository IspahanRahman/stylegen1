import { create } from "zustand";
import {
  adminCustomerAPI,
  type Customer,
  type CustomerDetails,
  type Note,
} from "@/lib/mock/adminCustomerApi";

interface CustomerState {
  // Data
  customers: Customer[];
  selectedCustomer: CustomerDetails | null;

  // UI State
  isLoading: boolean;
  isSubmitting: boolean;
  error: string | null;

  // Search & Filter
  searchTerm: string;
  statusFilter: string;

  // Customer Details
  newNote: string;
  showStatusModal: boolean;
  showDetailsModal: boolean;

  // Actions
  fetchCustomers: () => Promise<void>;
  fetchCustomerDetails: (id: string) => Promise<void>;
  updateStatus: (customerId: string, newStatus: string) => Promise<void>;
  addNote: (content: string) => Promise<void>;

  // UI Actions
  setSearchTerm: (term: string) => void;
  setStatusFilter: (status: string) => void;
  setNewNote: (note: string) => void;
  openStatusModal: () => void;
  closeStatusModal: () => void;
  openDetailsModal: (customer: Customer) => void;
  closeDetailsModal: () => void;

  // Utils
  clearError: () => void;
  getFilteredCustomers: () => Customer[];
  getCustomerStats: () => {
    total: number;
    active: number;
    inactive: number;
    banned: number;
  };
}

export const useAdminCustomerStore = create<CustomerState>((set, get) => ({
  // Initial State
  customers: [],
  selectedCustomer: null,
  isLoading: false,
  isSubmitting: false,
  error: null,
  searchTerm: "",
  statusFilter: "all",
  newNote: "",
  showStatusModal: false,
  showDetailsModal: false,

  // Data Actions
  fetchCustomers: async () => {
    set({ isLoading: true, error: null });

    try {
      const response = await adminCustomerAPI.getAll();
      set({ customers: response.customers, isLoading: false });
    } catch (error: any) {
      set({ error: error.message, isLoading: false });
    }
  },

  fetchCustomerDetails: async (id: string) => {
    set({ isLoading: true, error: null });

    try {
      const response = await adminCustomerAPI.getById(id);
      set({ selectedCustomer: response.customer, isLoading: false });
    } catch (error: any) {
      set({ error: error.message, isLoading: false });
    }
  },

  updateStatus: async (customerId: string, newStatus: string) => {
    set({ isSubmitting: true, error: null });

    try {
      await adminCustomerAPI.updateStatus(customerId, newStatus);

      set((state) => ({
        customers: state.customers.map((c) =>
          c.id === customerId
            ? { ...c, status: newStatus as Customer["status"] }
            : c,
        ),
        selectedCustomer: state.selectedCustomer
          ? {
              ...state.selectedCustomer,
              status: newStatus as Customer["status"],
            }
          : null,
        isSubmitting: false,
        showStatusModal: false,
      }));
    } catch (error: any) {
      set({ error: error.message, isSubmitting: false });
      throw error;
    }
  },

  addNote: async (content: string) => {
    const { selectedCustomer } = get();
    if (!selectedCustomer) return;

    set({ isSubmitting: true });

    try {
      const response = await adminCustomerAPI.addNote(
        selectedCustomer.id,
        content,
      );

      set((state) => ({
        selectedCustomer: state.selectedCustomer
          ? {
              ...state.selectedCustomer,
              notes: [response.note, ...state.selectedCustomer.notes],
            }
          : null,
        newNote: "",
        isSubmitting: false,
      }));
    } catch (error: any) {
      set({ error: error.message, isSubmitting: false });
      throw error;
    }
  },

  // UI Actions
  setSearchTerm: (term) => set({ searchTerm: term }),

  setStatusFilter: (status) => set({ statusFilter: status }),

  setNewNote: (note) => set({ newNote: note }),

  openStatusModal: () => set({ showStatusModal: true }),

  closeStatusModal: () => set({ showStatusModal: false }),

  openDetailsModal: async (customer) => {
    set({ showDetailsModal: true });
    await get().fetchCustomerDetails(customer.id);
  },

  closeDetailsModal: () => {
    set({ showDetailsModal: false, selectedCustomer: null });
  },

  // Utils
  clearError: () => set({ error: null }),

  getFilteredCustomers: () => {
    const { customers, searchTerm, statusFilter } = get();

    return customers.filter((customer) => {
      const matchesSearch =
        !searchTerm ||
        customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        customer.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        customer.id.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesStatus =
        statusFilter === "all" || customer.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  },

  getCustomerStats: () => {
    const { customers } = get();

    return {
      total: customers.length,
      active: customers.filter((c) => c.status === "active").length,
      inactive: customers.filter((c) => c.status === "inactive").length,
      banned: customers.filter((c) => c.status === "banned").length,
    };
  },
}));
