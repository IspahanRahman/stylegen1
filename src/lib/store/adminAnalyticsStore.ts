import { create } from "zustand";
import { adminAnalyticsAPI, type AnalyticsData } from "@/lib/mock/adminApi";

interface AnalyticsState {
  data: AnalyticsData | null;
  timeRange: "weekly" | "monthly" | "yearly";
  isLoading: boolean;
  error: string | null;
  lastUpdated: string | null;

  // Actions
  fetchAnalytics: () => Promise<void>;
  setTimeRange: (range: "weekly" | "monthly" | "yearly") => void;
  exportReport: () => Promise<string>;
  clearError: () => void;
  getStatsCards: () => Array<{
    label: string;
    value: string;
    growth: number;
    icon: string;
    color: string;
  }>;
}

export const useAdminAnalyticsStore = create<AnalyticsState>((set, get) => ({
  data: null,
  timeRange: "monthly",
  isLoading: false,
  error: null,
  lastUpdated: null,

  fetchAnalytics: async () => {
    set({ isLoading: true, error: null });

    try {
      const response = await adminAnalyticsAPI.getAnalytics(get().timeRange);
      set({
        data: response.data,
        isLoading: false,
        lastUpdated: response.timestamp,
      });
    } catch (error: any) {
      set({
        error: error.message || "Failed to fetch analytics",
        isLoading: false,
      });
    }
  },

  setTimeRange: (range) => {
    set({ timeRange: range });
    // Auto-fetch when time range changes
    get().fetchAnalytics();
  },

  exportReport: async () => {
    try {
      const response = await adminAnalyticsAPI.exportReport(get().timeRange);
      return response.downloadUrl;
    } catch (error: any) {
      throw new Error(error.message || "Failed to export report");
    }
  },

  clearError: () => set({ error: null }),

  getStatsCards: () => {
    const { data } = get();
    if (!data) return [];

    return [
      {
        label: "Total Revenue",
        value: `$${data.revenue.total.toLocaleString()}`,
        growth: data.revenue.growth,
        icon: "DollarSign",
        color: "blue",
      },
      {
        label: "Total Orders",
        value: data.orders.total.toString(),
        growth: data.orders.growth,
        icon: "ShoppingBag",
        color: "green",
      },
      {
        label: "Total Customers",
        value: data.customers.total.toString(),
        growth: data.customers.growth,
        icon: "Users",
        color: "purple",
      },
      {
        label: "Products Sold",
        value: data.orders.total.toString(),
        growth: data.orders.growth,
        icon: "Package",
        color: "orange",
      },
    ];
  },
}));
