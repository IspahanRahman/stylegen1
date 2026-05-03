import { useEffect, useCallback } from "react";
import { useAdminAnalyticsStore } from "@/lib/store/adminAnalyticsStore";
import { formatCurrency } from "@/lib/utils/formatCurrency";

export function useAdminAnalytics() {
  const store = useAdminAnalyticsStore();

  useEffect(() => {
    store.fetchAnalytics();
  }, []); // Fetch on mount

  const handleExport = useCallback(async () => {
    try {
      const downloadUrl = await store.exportReport();
      window.open(downloadUrl, "_blank");
      return true;
    } catch (error: any) {
      console.error("Export failed:", error);
      return false;
    }
  }, [store]);

  const handleTimeRangeChange = useCallback(
    (range: "weekly" | "monthly" | "yearly") => {
      store.setTimeRange(range);
    },
    [store],
  );

  const getChartData = useCallback(() => {
    if (!store.data) return null;

    // Use the store's timeRange to generate appropriate labels
    const seriesData = store.data.revenue.monthly;
    const maxRevenue = Math.max(...seriesData);

    const monthlyLabels = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];
    const weeklyLabels = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

    let labels = monthlyLabels;
    if (store.timeRange === "weekly") {
      labels = weeklyLabels;
    } else if (store.timeRange === "monthly" || store.timeRange === "yearly") {
      labels = monthlyLabels;
    }

    // Ensure labels length matches data length
    if (labels.length !== seriesData.length) {
      labels = labels.slice(0, seriesData.length);
      // If data is longer than labels, pad numeric month indices
      if (labels.length < seriesData.length) {
        labels = Array.from(
          { length: seriesData.length },
          (_, i) => labels[i] ?? `#${i + 1}`,
        );
      }
    }

    return {
      labels,
      datasets: [
        {
          data: seriesData,
          maxValue: maxRevenue,
          getBarHeight: (value: number) => {
            if (maxRevenue === 0) return "0%";
            return `${(value / maxRevenue) * 100}%`;
          },
        },
      ],
    };
  }, [store.data, store.timeRange]);

  return {
    // State
    data: store.data,
    timeRange: store.timeRange,
    isLoading: store.isLoading,
    error: store.error,
    lastUpdated: store.lastUpdated,
    statsCards: store.getStatsCards(),

    // Actions
    fetchAnalytics: store.fetchAnalytics,
    handleExport,
    handleTimeRangeChange,
    clearError: store.clearError,
    getChartData,

    // Computed
    topProducts: store.data?.topProducts || [],
    topCategories: store.data?.topCategories || [],
    revenueData: store.data?.revenue || null,
    ordersData: store.data?.orders || null,
    customersData: store.data?.customers || null,
  };
}
