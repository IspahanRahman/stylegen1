import { useEffect, useCallback } from "react";
import { useAdminDashboardStore } from "@/lib/store/adminDashboardStore";
import { formatCurrency } from "@/lib/utils/formatCurrency";
import toast from "react-hot-toast";

export function useAdminDashboard() {
  const store = useAdminDashboardStore();

  // Fetch dashboard data on mount
  useEffect(() => {
    store.fetchDashboardData();

    // Optional: Set up auto-refresh every 5 minutes
    const interval = setInterval(
      () => {
        store.refreshData();
      },
      5 * 60 * 1000,
    );

    return () => clearInterval(interval);
  }, []);

  // Handle time range change
  const handleTimeRangeChange = useCallback(
    (range: string) => {
      store.setTimeRange(range);
    },
    [store],
  );

  // Handle export
  const handleExport = useCallback(async () => {
    try {
      const downloadUrl = await store.exportReport();
      window.open(downloadUrl, "_blank");
      toast.success("Report exported successfully!");
    } catch (error: any) {
      toast.error(error.message || "Failed to export report");
    }
  }, [store]);

  // Handle refresh
  const handleRefresh = useCallback(async () => {
    await store.refreshData();
    toast.success("Dashboard refreshed");
  }, [store]);

  // Get status color for orders
  const getStatusColor = useCallback((status: string) => {
    const colors: Record<string, string> = {
      pending: "bg-yellow-100 text-yellow-700",
      processing: "bg-blue-100 text-blue-700",
      shipped: "bg-purple-100 text-purple-700",
      delivered: "bg-green-100 text-green-700",
      cancelled: "bg-red-100 text-red-700",
    };
    return colors[status] || "bg-gray-100 text-gray-700";
  }, []);

  // Format time range label
  const getTimeRangeLabel = useCallback((range: string) => {
    const labels: Record<string, string> = {
      "7days": "Last 7 Days",
      "30days": "Last 30 Days",
      "90days": "Last 90 Days",
      year: "This Year",
    };
    return labels[range] || range;
  }, []);

  return {
    // State
    data: store.data,
    stats: store.data?.stats || null,
    recentOrders: store.data?.recentOrders || [],
    lowStockProducts: store.data?.lowStockProducts || [],
    recentActivities: store.data?.recentActivities || [],
    isLoading: store.isLoading,
    isExporting: store.isExporting,
    error: store.error,
    timeRange: store.timeRange,
    lastUpdated: store.lastUpdated,
    statsCards: store.getStatsCards(),

    // Actions
    handleTimeRangeChange,
    handleExport,
    handleRefresh,
    getStatusColor,
    getTimeRangeLabel,
    clearError: store.clearError,
  };
}
