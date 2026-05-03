"use client";

import { useAdminAnalytics } from "@/hooks/useAdminAnalytics";
import { formatCurrency } from "@/lib/utils/formatCurrency";
import { cn } from "@/lib/utils/cn";
import {
  TrendingUp,
  TrendingDown,
  DollarSign,
  ShoppingBag,
  Users,
  Package,
  Download,
  Calendar,
  RefreshCcw,
  BarChart3,
} from "lucide-react";
import Skeleton from "@/components/ui/Skeleton";

const iconMap: Record<string, any> = {
  DollarSign,
  ShoppingBag,
  Users,
  Package,
};

export default function AdminAnalytics() {
  const {
    data,
    timeRange,
    isLoading,
    error,
    lastUpdated,
    statsCards,
    handleExport,
    handleTimeRangeChange,
    clearError,
    getChartData,
    topProducts,
    topCategories,
  } = useAdminAnalytics();
  console.log('AdminAnalytics Rendered with data:', data);
  console.log(statsCards, "statcards,")

  const chartData = getChartData();

  // Loading State
  if (isLoading && !data) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between">
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-10 w-64" />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <Skeleton key={i} className="h-32 rounded-xl" />
          ))}
        </div>
        <Skeleton className="h-80 rounded-xl" />
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Skeleton className="h-64 rounded-xl" />
          <Skeleton className="h-64 rounded-xl" />
        </div>
      </div>
    );
  }

  // Error State
  if (error && !data) {
    return (
      <div className="text-center py-12">
        <BarChart3 className="h-16 w-16 text-red-400 mx-auto mb-4" />
        <h2 className="text-xl font-bold text-gray-900 mb-2">
          Failed to Load Analytics
        </h2>
        <p className="text-red-600 mb-4">{error}</p>
        <button
          onClick={clearError}
          className="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600"
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Analytics</h1>
          <p className="text-sm text-gray-500 mt-1">
            Track your store performance
            {lastUpdated && (
              <span className="ml-2 text-xs text-gray-400">
                • Updated {new Date(lastUpdated).toLocaleTimeString()}
              </span>
            )}
          </p>
        </div>
        <div className="flex gap-2">
          <select
            value={timeRange}
            onChange={(e) => handleTimeRangeChange(e.target.value as any)}
            className="px-8 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-orange-500"
          >
            <option value="weekly">Weekly</option>
            <option value="monthly">Monthly</option>
            <option value="yearly">Yearly</option>
          </select>
          <button
            onClick={handleExport}
            className="px-4 py-2 bg-orange-500 text-white rounded-lg text-sm font-medium hover:bg-orange-600 transition-colors"
          >
            <Download className="h-4 w-4 inline mr-2" />
            Export Report
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {statsCards.map((stat) => {
          const IconComponent = iconMap[stat.icon];
          return (
            <div
              key={stat.label}
              className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 hover:shadow-md transition-shadow"
            >
              <div className="flex items-center justify-between mb-4">
                <div
                  className={cn(
                    "p-2 rounded-lg",
                    stat.color === "blue" && "bg-blue-50",
                    stat.color === "green" && "bg-green-50",
                    stat.color === "purple" && "bg-purple-50",
                    stat.color === "orange" && "bg-orange-50",
                  )}
                >
                  {IconComponent && (
                    <IconComponent
                      className={cn(
                        "h-5 w-5",
                        stat.color === "blue" && "text-blue-600",
                        stat.color === "green" && "text-green-600",
                        stat.color === "purple" && "text-purple-600",
                        stat.color === "orange" && "text-orange-600",
                      )}
                    />
                  )}
                </div>
                <div
                  className={cn(
                    "flex items-center gap-1 text-sm font-medium",
                    stat.growth > 0 ? "text-green-600" : "text-red-600",
                  )}
                >
                  {stat.growth > 0 ? (
                    <TrendingUp className="h-4 w-4" />
                  ) : (
                    <TrendingDown className="h-4 w-4" />
                  )}
                  <span>{stat.growth}%</span>
                </div>
              </div>
              <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
              <p className="text-sm text-gray-500 mt-1">{stat.label}</p>
            </div>
          );
        })}
      </div>

      {/* Revenue Chart - FIXED SECTION */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-lg font-semibold text-gray-900">
              Revenue Overview
            </h2>
            <p className="text-sm text-gray-500 mt-1">
              {timeRange === "monthly" && "Monthly revenue breakdown"}
              {timeRange === "weekly" && "Weekly revenue breakdown"}
              {timeRange === "yearly" && "Yearly revenue breakdown"}
            </p>
          </div>
          <div className="flex items-center gap-2 text-xs text-gray-500 bg-gray-50 px-3 py-1.5 rounded-lg">
            <Calendar className="h-4 w-4" />
            {timeRange === "monthly" && "Monthly"}
            {timeRange === "weekly" && "Weekly"}
            {timeRange === "yearly" && "Yearly"}
          </div>
        </div>

        {chartData && data && data.revenue.monthly.length > 0 ? (
          <div className="space-y-4">
            {/* Bar Chart */}
            <div className="h-64 flex items-end gap-2 px-2">
              {data.revenue.monthly.map((value, index) => {
                const heightPercent = chartData.datasets[0].getBarHeight(value);
                return (
                  <div
                    key={index}
                    className="flex-1 flex flex-col items-center gap-2 group h-full"
                  >
                    <div className="relative w-full flex-1 flex items-end">
                      <div
                        className="w-full bg-gradient-to-t from-orange-500 to-orange-400 rounded-t-lg hover:from-orange-600 hover:to-orange-500 transition-all cursor-pointer group-hover:opacity-90 min-h-[4px]"
                        style={{ height: heightPercent }}
                      >
                        {/* Tooltip */}
                        <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-gray-900 text-white px-3 py-1.5 rounded-lg text-xs font-medium opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap shadow-lg z-10">
                          {formatCurrency(value)}
                          <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-gray-900 rotate-45" />
                        </div>
                      </div>
                    </div>
                    <span className="text-xs text-gray-500 font-medium">
                      {chartData.labels[index]}
                    </span>
                  </div>
                );
              })}
            </div>

            {/* Chart Legend */}
            <div className="flex items-center justify-between pt-4 border-t border-gray-100">
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded bg-orange-500" />
                  <span className="text-xs text-gray-600">Revenue</span>
                </div>
                <div className="text-xs text-gray-400">
                  Highest: {formatCurrency(Math.max(...data.revenue.monthly))}
                </div>
              </div>
              <div className="text-xs text-gray-400">
                Total:{" "}
                {formatCurrency(
                  data.revenue.monthly.reduce((a, b) => a + b, 0),
                )}
              </div>
            </div>
          </div>
        ) : (
          <div className="h-64 flex flex-col items-center justify-center text-gray-400">
            <BarChart3 className="h-12 w-12 mb-3" />
            <p className="text-sm font-medium">No revenue data available</p>
            <p className="text-xs mt-1">Try selecting a different time range</p>
          </div>
        )}
      </div>

      {/* Top Products & Categories */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Products */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            Top Products
          </h2>
          {topProducts.length > 0 ? (
            <div className="space-y-4">
              {topProducts.map((product, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <span
                      className={cn(
                        "text-sm font-bold w-8 h-8 rounded-full flex items-center justify-center",
                        index === 0 && "bg-yellow-100 text-yellow-700",
                        index === 1 && "bg-gray-100 text-gray-700",
                        index === 2 && "bg-orange-100 text-orange-700",
                        index > 2 && "text-gray-400",
                      )}
                    >
                      #{index + 1}
                    </span>
                    <div>
                      <p className="text-sm font-medium text-gray-900">
                        {product.name}
                      </p>
                      <p className="text-xs text-gray-500">
                        {product.sales} sales
                      </p>
                    </div>
                  </div>
                  <p className="text-sm font-medium text-gray-900">
                    {formatCurrency(product.revenue)}
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <Package className="h-12 w-12 text-gray-300 mx-auto mb-3" />
              <p className="text-gray-400">No product data available</p>
            </div>
          )}
        </div>

        {/* Top Categories */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            Top Categories
          </h2>
          {topCategories.length > 0 ? (
            <div className="space-y-4">
              {topCategories.map((category, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <span
                      className={cn(
                        "text-sm font-bold w-8 h-8 rounded-full flex items-center justify-center",
                        index === 0 && "bg-yellow-100 text-yellow-700",
                        index === 1 && "bg-gray-100 text-gray-700",
                        index === 2 && "bg-orange-100 text-orange-700",
                        index > 2 && "text-gray-400",
                      )}
                    >
                      #{index + 1}
                    </span>
                    <div>
                      <p className="text-sm font-medium text-gray-900">
                        {category.name}
                      </p>
                      <p className="text-xs text-gray-500">
                        {category.sales} items
                      </p>
                    </div>
                  </div>
                  <p className="text-sm font-medium text-gray-900">
                    {formatCurrency(category.revenue)}
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <Package className="h-12 w-12 text-gray-300 mx-auto mb-3" />
              <p className="text-gray-400">No category data available</p>
            </div>
          )}
        </div>
      </div>

      {/* Error Toast */}
      {error && (
        <div className="fixed bottom-4 right-4 z-50">
          <button
            onClick={clearError}
            className="px-4 py-2 bg-red-500 text-white rounded-lg shadow-lg hover:bg-red-600 flex items-center gap-2 transition-all"
          >
            <RefreshCcw className="h-4 w-4" />
            Retry
          </button>
        </div>
      )}
    </div>
  );
}
