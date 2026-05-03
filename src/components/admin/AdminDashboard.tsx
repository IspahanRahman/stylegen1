"use client";

import { useAdminDashboard } from "@/hooks/useAdminDashboard";
import Link from "next/link";
import {
  ShoppingBag,
  Package,
  Users,
  DollarSign,
  TrendingUp,
  TrendingDown,
  AlertCircle,
  Clock,
  RefreshCcw,
  Download,
  Loader2,
  ChevronRight,
  ArrowUpRight,
  CheckCircle2,
} from "lucide-react";
import { cn } from "@/lib/utils/cn";
import { formatCurrency } from "@/lib/utils/formatCurrency";

// Icon mapping
const iconMap: Record<string, any> = {
  DollarSign,
  ShoppingBag,
  Users,
  Package,
};

export default function AdminDashboard() {
  const {
    data,
    stats,
    recentOrders,
    lowStockProducts,
    recentActivities,
    isLoading,
    isExporting,
    error,
    timeRange,
    lastUpdated,
    statsCards,
    handleTimeRangeChange,
    handleExport,
    handleRefresh,
    getStatusColor,
    getTimeRangeLabel,
    clearError,
  } = useAdminDashboard();

  // Loading State
  if (isLoading && !data) {
    return (
      <div className="space-y-6 animate-pulse">
        {/* Header Skeleton */}
        <div className="flex justify-between">
          <div>
            <div className="h-8 w-48 bg-gray-200 rounded mb-2" />
            <div className="h-4 w-64 bg-gray-200 rounded" />
          </div>
          <div className="flex gap-2">
            <div className="h-10 w-40 bg-gray-200 rounded-lg" />
            <div className="h-10 w-40 bg-gray-200 rounded-lg" />
          </div>
        </div>

        {/* Stats Grid Skeleton */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="bg-white rounded-xl p-6 h-32" />
          ))}
        </div>

        {/* Content Skeleton */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 bg-white rounded-xl h-96" />
          <div className="space-y-6">
            <div className="bg-white rounded-xl h-64" />
            <div className="bg-white rounded-xl h-64" />
          </div>
        </div>
      </div>
    );
  }

  // Error State
  if (error && !data) {
    return (
      <div className="text-center py-12">
        <AlertCircle className="h-16 w-16 text-red-400 mx-auto mb-4" />
        <h2 className="text-xl font-bold text-gray-900 mb-2">
          Failed to Load Dashboard
        </h2>
        <p className="text-gray-600 mb-6">{error}</p>
        <div className="flex gap-3 justify-center">
          <button
            onClick={handleRefresh}
            className="px-4 py-2.5 bg-orange-500 text-white rounded-lg font-medium hover:bg-orange-600 transition-colors inline-flex items-center gap-2"
          >
            <RefreshCcw className="h-4 w-4" />
            Try Again
          </button>
          <button
            onClick={clearError}
            className="px-4 py-2.5 bg-white border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors"
          >
            Dismiss
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Dashboard Overview
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Welcome back! Here's what's happening with your store.
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
            onChange={(e) => handleTimeRangeChange(e.target.value)}
            className="px-8 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-orange-500 transition-colors"
          >
            <option value="7days">Last 7 days</option>
            <option value="30days">Last 30 days</option>
            <option value="90days">Last 90 days</option>
            <option value="year">This Year</option>
          </select>
          <button
            onClick={handleRefresh}
            className="px-3 py-2 border border-gray-300 rounded-lg text-sm text-gray-600 hover:bg-gray-50 transition-colors"
            title="Refresh dashboard"
          >
            <RefreshCcw className="h-4 w-4" />
          </button>
          <button
            onClick={handleExport}
            disabled={isExporting}
            className="px-4 py-2 bg-orange-500 text-white rounded-lg text-sm font-medium hover:bg-orange-600 transition-colors disabled:opacity-50 inline-flex items-center gap-2"
          >
            {isExporting ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Exporting...
              </>
            ) : (
              <>
                <Download className="h-4 w-4" />
                Export Report
              </>
            )}
          </button>
        </div>
      </div>

      {/* Error Banner */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-center justify-between animate-in">
          <div className="flex items-center gap-2 text-red-700">
            <AlertCircle className="h-5 w-5 flex-shrink-0" />
            <p className="text-sm">{error}</p>
          </div>
          <button
            onClick={clearError}
            className="text-red-500 hover:text-red-700 flex-shrink-0"
          >
            ×
          </button>
        </div>
      )}

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {statsCards.map((stat) => {
          const IconComponent = iconMap[stat.icon];
          const isNegative = stat.growth < 0;

          return (
            <div
              key={stat.label}
              className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 hover:shadow-md transition-shadow group"
            >
              <div className="flex items-center justify-between mb-4">
                <div
                  className={cn(
                    "p-2 rounded-lg transition-colors",
                    stat.color === "blue" &&
                      "bg-blue-50 group-hover:bg-blue-100",
                    stat.color === "green" &&
                      "bg-green-50 group-hover:bg-green-100",
                    stat.color === "purple" &&
                      "bg-purple-50 group-hover:bg-purple-100",
                    stat.color === "orange" &&
                      "bg-orange-50 group-hover:bg-orange-100",
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
                    isNegative ? "text-red-600" : "text-green-600",
                  )}
                >
                  {isNegative ? (
                    <TrendingDown className="h-4 w-4" />
                  ) : (
                    <TrendingUp className="h-4 w-4" />
                  )}
                  <span>{Math.abs(stat.growth)}%</span>
                </div>
              </div>
              <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
              <p className="text-sm text-gray-500 mt-1">{stat.label}</p>
            </div>
          );
        })}
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Orders */}
        <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="p-6 border-b border-gray-100">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-900">
                Recent Orders
              </h2>
              <Link
                href="/admin/orders"
                className="text-sm text-orange-500 hover:text-orange-600 font-medium inline-flex items-center gap-1 group"
              >
                View All
                <ArrowUpRight className="h-3 w-3 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
              </Link>
            </div>
          </div>

          {recentOrders.length === 0 ? (
            <div className="p-12 text-center">
              <ShoppingBag className="h-12 w-12 text-gray-400 mx-auto mb-3" />
              <p className="text-gray-500">No recent orders</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="text-left text-sm text-gray-500 bg-gray-50">
                    <th className="px-6 py-3 font-medium">Order ID</th>
                    <th className="px-6 py-3 font-medium">Customer</th>
                    <th className="px-6 py-3 font-medium">Amount</th>
                    <th className="px-6 py-3 font-medium">Status</th>
                    <th className="px-6 py-3 font-medium">Date</th>
                    <th className="px-6 py-3 font-medium">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {recentOrders.map((order) => (
                    <tr
                      key={order.id}
                      className="hover:bg-gray-50 transition-colors"
                    >
                      <td className="px-6 py-4 text-sm font-medium text-gray-900">
                        {order.id}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">
                        {order.customer}
                      </td>
                      <td className="px-6 py-4 text-sm font-medium text-gray-900">
                        {formatCurrency(order.amount)}
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={cn(
                            "inline-flex px-2.5 py-1 rounded-full text-xs font-medium capitalize",
                            getStatusColor(order.status),
                          )}
                        >
                          {order.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-500">
                        {order.date}
                      </td>
                      <td className="px-6 py-4">
                        <Link
                          href={`/admin/orders/${order.id}`}
                          className="text-orange-500 hover:text-orange-600 text-sm font-medium"
                        >
                          View
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Side Panel */}
        <div className="space-y-6">
          {/* Low Stock Alert */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">
                Low Stock Alert
              </h3>
              {lowStockProducts.length > 0 && (
                <span className="px-2.5 py-1 bg-red-100 text-red-700 text-xs font-semibold rounded-full">
                  {lowStockProducts.length} items
                </span>
              )}
            </div>

            {lowStockProducts.length === 0 ? (
              <div className="text-center py-6">
                <CheckCircle2 className="h-8 w-8 text-green-400 mx-auto mb-2" />
                <p className="text-sm text-gray-500">
                  All products are well stocked!
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {lowStockProducts.map((product) => (
                  <div
                    key={product.id}
                    className="flex items-center justify-between p-3 bg-red-50 rounded-lg hover:bg-red-100 transition-colors group"
                  >
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 truncate">
                        {product.name}
                      </p>
                      <p className="text-xs text-red-600 mt-0.5">
                        Stock:{" "}
                        <span className="font-medium">{product.stock}</span> /{" "}
                        {product.threshold}
                      </p>
                    </div>
                    <Link
                      href={`/admin/products/${product.id}/edit`}
                      className="ml-3 text-xs font-medium text-orange-500 hover:text-orange-600 whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      Restock →
                    </Link>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Recent Activities */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Recent Activities
            </h3>

            {recentActivities.length === 0 ? (
              <div className="text-center py-6">
                <Clock className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                <p className="text-sm text-gray-500">No recent activities</p>
              </div>
            ) : (
              <div className="space-y-4">
                {recentActivities.map((activity) => (
                  <div key={activity.id} className="flex gap-3 group">
                    <div className="mt-1 flex-shrink-0">
                      <div
                        className={cn(
                          "w-2 h-2 rounded-full",
                          activity.type === "order" && "bg-blue-500",
                          activity.type === "product" && "bg-green-500",
                          activity.type === "customer" && "bg-purple-500",
                          activity.type === "system" && "bg-orange-500",
                        )}
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900">
                        {activity.action}
                      </p>
                      <p className="text-xs text-gray-500 truncate">
                        {activity.description}
                      </p>
                      <p className="text-xs text-gray-400 mt-1">
                        {activity.time}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Quick Links */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          {
            label: "Manage Products",
            href: "/admin/products",
            icon: Package,
            color: "blue",
          },
          {
            label: "View Orders",
            href: "/admin/orders",
            icon: ShoppingBag,
            color: "green",
          },
          {
            label: "Customers",
            href: "/admin/customers",
            icon: Users,
            color: "purple",
          },
          {
            label: "Analytics",
            href: "/admin/analytics",
            icon: TrendingUp,
            color: "orange",
          },
        ].map((link) => {
          const IconComponent = link.icon;
          return (
            <Link
              key={link.label}
              href={link.href}
              className={cn(
                "bg-white rounded-xl p-4 shadow-sm border border-gray-200",
                "hover:shadow-md transition-all group",
                "flex items-center gap-3",
              )}
            >
              <div
                className={cn(
                  "p-2 rounded-lg",
                  link.color === "blue" && "bg-blue-50 group-hover:bg-blue-100",
                  link.color === "green" &&
                    "bg-green-50 group-hover:bg-green-100",
                  link.color === "purple" &&
                    "bg-purple-50 group-hover:bg-purple-100",
                  link.color === "orange" &&
                    "bg-orange-50 group-hover:bg-orange-100",
                )}
              >
                <IconComponent
                  className={cn(
                    "h-5 w-5",
                    link.color === "blue" && "text-blue-600",
                    link.color === "green" && "text-green-600",
                    link.color === "purple" && "text-purple-600",
                    link.color === "orange" && "text-orange-600",
                  )}
                />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-900">
                  {link.label}
                </p>
              </div>
              <ChevronRight className="h-4 w-4 text-gray-400 group-hover:translate-x-1 transition-transform" />
            </Link>
          );
        })}
      </div>
    </div>
  );
}
