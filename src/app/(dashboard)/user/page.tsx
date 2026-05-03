"use client";

import { useEffect, useMemo } from "react";
import Link from "next/link";
import {
  ShoppingBag,
  Package,
  TrendingUp,
  Clock,
  ChevronRight,
  Star,
  AlertCircle,
  User,
  Loader2,
} from "lucide-react";
import { useUserOrderStore } from "@/lib/store/userOrderStore";
import { useAuthStore } from "@/lib/store/authStore";
import { formatCurrency, formatDate } from "@/lib/utils/formatCurrency";
import { cn } from "@/lib/utils/cn";

export default function UserDashboard() {
  const { isAuthenticated, user } = useAuthStore();
  const {
    orders,
    isLoading,
    error,
    fetchOrders,
    clearError,
  } = useUserOrderStore();
  console.log("orders", orders);

  // Fetch orders on mount if authenticated
  useEffect(() => {
    if (isAuthenticated) {
      fetchOrders();
    }
  }, [isAuthenticated, fetchOrders]);

  // Calculate dashboard stats from orders
  const stats = useMemo(() => {
    const activeStatuses = ["pending", "processing", "shipped"];

    return {
      totalOrders: orders.length,
      activeOrders: orders.filter((o) => activeStatuses.includes(o.status)).length,
      wishlistItems: 5, // This would come from a wishlist store in production
      totalSpent: orders.reduce((sum, o) => sum + o.totalPrice, 0),
    };
  }, [orders]);

  // Get recent orders (latest 3)
  const recentOrders = useMemo(() => {
    return [...orders]
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .slice(0, 3);
  }, [orders]);

  const getStatusColor = (status: string) => {
    const colors = {
      delivered: "bg-green-100 text-green-700",
      pending: "bg-yellow-100 text-yellow-700",
      processing: "bg-blue-100 text-blue-700",
      shipped: "bg-purple-100 text-purple-700",
      cancelled: "bg-red-100 text-red-700",
    };
    return colors[status as keyof typeof colors] || "bg-gray-100 text-gray-700";
  };

  // Loading State
  if (isLoading) {
    return (
      <div className="space-y-6 animate-pulse">
        {/* Welcome Banner Skeleton */}
        <div className="bg-gradient-to-r from-gray-200 to-gray-300 rounded-xl p-6 sm:p-8 h-32" />

        {/* Stats Cards Skeleton */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="bg-white rounded-xl p-6 h-32">
              <div className="flex justify-between mb-4">
                <div className="h-10 w-10 bg-gray-200 rounded-lg" />
                <div className="h-4 w-12 bg-gray-200 rounded" />
              </div>
              <div className="h-8 w-16 bg-gray-200 rounded mb-1" />
              <div className="h-4 w-24 bg-gray-200 rounded" />
            </div>
          ))}
        </div>

        {/* Content Skeleton */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 bg-white rounded-xl p-6 h-96" />
          <div className="bg-white rounded-xl p-6 h-96" />
        </div>
      </div>
    );
  }

  // Error State
  if (error && orders.length === 0) {
    return (
      <div className="text-center py-12">
        <AlertCircle className="h-16 w-16 text-red-400 mx-auto mb-4" />
        <h2 className="text-xl font-bold text-gray-900 mb-2">Failed to Load Dashboard</h2>
        <p className="text-gray-600 mb-6">{error}</p>
        <div className="flex gap-3 justify-center">
          <button
            onClick={() => fetchOrders()}
            className="px-6 py-2.5 bg-orange-500 text-white rounded-lg font-medium hover:bg-orange-600 transition-colors inline-flex items-center gap-2"
          >
            <Loader2 className="h-4 w-4" />
            Try Again
          </button>
          <button
            onClick={clearError}
            className="px-6 py-2.5 bg-white border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors"
          >
            Dismiss
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-orange-500 to-orange-600 rounded-xl p-6 sm:p-8 text-white relative overflow-hidden">
        {/* Decorative Elements */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2" />
        <div className="absolute bottom-0 left-0 w-32 h-32 bg-white/5 rounded-full translate-y-1/2 -translate-x-1/2" />

        <div className="relative flex items-center justify-between">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold mb-2">
              Welcome back{user?.name ? `, ${user.name.split(' ')[0]}` : ''}! 👋
            </h1>
            <p className="text-orange-100">
              {orders.length > 0
                ? `You have ${stats.activeOrders} active order${stats.activeOrders !== 1 ? 's' : ''} and have spent ${formatCurrency(stats.totalSpent)} so far.`
                : "Start exploring our collection of premium leather goods."}
            </p>
          </div>
          <Link
            href="/products"
            className="hidden sm:inline-flex items-center gap-2 px-5 py-2.5 bg-white text-orange-600 rounded-lg font-semibold hover:bg-orange-50 transition-colors shadow-lg"
          >
            Shop Now
            <ChevronRight className="h-4 w-4" />
          </Link>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-4">
            <div className="p-2.5 bg-blue-50 rounded-lg">
              <ShoppingBag className="h-5 w-5 text-blue-600" />
            </div>
            <div className="flex items-center gap-1 text-green-600 text-sm font-medium">
              <TrendingUp className="h-4 w-4" />
              <span>Total</span>
            </div>
          </div>
          <p className="text-2xl font-bold text-gray-900">{stats.totalOrders}</p>
          <p className="text-sm text-gray-500 mt-1">Total Orders</p>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-4">
            <div className="p-2.5 bg-purple-50 rounded-lg">
              <Package className="h-5 w-5 text-purple-600" />
            </div>
            <div className="flex items-center gap-1 text-yellow-600 text-sm font-medium">
              <Clock className="h-4 w-4" />
              <span>Active</span>
            </div>
          </div>
          <p className="text-2xl font-bold text-gray-900">{stats.activeOrders}</p>
          <p className="text-sm text-gray-500 mt-1">Active Orders</p>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-4">
            <div className="p-2.5 bg-pink-50 rounded-lg">
              <Star className="h-5 w-5 text-pink-600" />
            </div>
          </div>
          <p className="text-2xl font-bold text-gray-900">{stats.wishlistItems}</p>
          <p className="text-sm text-gray-500 mt-1">Wishlist Items</p>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-4">
            <div className="p-2.5 bg-green-50 rounded-lg">
              <TrendingUp className="h-5 w-5 text-green-600" />
            </div>
          </div>
          <p className="text-2xl font-bold text-gray-900">
            {formatCurrency(stats.totalSpent)}
          </p>
          <p className="text-sm text-gray-500 mt-1">Total Spent</p>
        </div>
      </div>

      {/* Recent Orders & Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Orders */}
        <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="p-6 border-b border-gray-100">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-900">Recent Orders</h2>
              <Link
                href="/dashboard/user/orders"
                className="text-sm text-orange-500 hover:text-orange-600 font-medium inline-flex items-center gap-1"
              >
                View all
                <ChevronRight className="h-4 w-4" />
              </Link>
            </div>
          </div>

          <div className="divide-y divide-gray-100">
            {recentOrders.length === 0 ? (
              <div className="p-12 text-center">
                <ShoppingBag className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">No orders yet</h3>
                <p className="text-gray-600 mb-4">
                  Start shopping to see your orders here
                </p>
                <Link
                  href="/products"
                  className="inline-flex items-center gap-2 px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors text-sm font-medium"
                >
                  Browse Products
                  <ChevronRight className="h-4 w-4" />
                </Link>
              </div>
            ) : (
              recentOrders.map((order) => (
                <Link
                  key={order.id}
                  href={`/dashboard/user/orders`}
                  className="block p-6 hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <p className="font-medium text-gray-900">
                        Order #{order.id}
                      </p>
                      <p className="text-sm text-gray-500">
                        {order.items.length} item{order.items.length !== 1 ? 's' : ''} •{" "}
                        {formatCurrency(order.totalPrice)} •{" "}
                        {formatDate(order.createdAt)}
                      </p>
                    </div>
                    <span
                      className={cn(
                        "px-3 py-1 rounded-full text-xs font-medium capitalize",
                        getStatusColor(order.status)
                      )}
                    >
                      {order.status}
                    </span>
                  </div>
                  <div className="flex items-center gap-4">
                    {order.items.slice(0, 3).map((item) => (
                      <div
                        key={item.productId}
                        className="flex items-center gap-3"
                      >
                        <div className="h-12 w-12 bg-gray-100 rounded-lg flex items-center justify-center overflow-hidden flex-shrink-0">
                          {item.image ? (
                            <img
                              src={item.image}
                              alt={item.name}
                              className="h-full w-full object-cover"
                            />
                          ) : (
                            <Package className="h-5 w-5 text-gray-400" />
                          )}
                        </div>
                        <div className="min-w-0">
                          <p className="text-sm font-medium text-gray-900 truncate">
                            {item.name}
                          </p>
                          <p className="text-xs text-gray-500">
                            Qty: {item.quantity}
                            {item.size && ` • Size: ${item.size}`}
                          </p>
                        </div>
                      </div>
                    ))}
                    {order.items.length > 3 && (
                      <span className="text-xs text-gray-500">
                        +{order.items.length - 3} more
                      </span>
                    )}
                  </div>
                </Link>
              ))
            )}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h2>
          <div className="space-y-2">
            <Link
              href="/products"
              className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors group"
            >
              <div className="p-2 bg-orange-50 rounded-lg group-hover:bg-orange-100 transition-colors">
                <ShoppingBag className="h-4 w-4 text-orange-600" />
              </div>
              <span className="text-sm font-medium text-gray-700 group-hover:text-gray-900">
                Browse Products
              </span>
            </Link>

            <Link
              href="/dashboard/user/orders"
              className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors group"
            >
              <div className="p-2 bg-blue-50 rounded-lg group-hover:bg-blue-100 transition-colors">
                <Package className="h-4 w-4 text-blue-600" />
              </div>
              <span className="text-sm font-medium text-gray-700 group-hover:text-gray-900">
                Track Orders
              </span>
            </Link>

            <Link
              href="/dashboard/user/profile"
              className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors group"
            >
              <div className="p-2 bg-purple-50 rounded-lg group-hover:bg-purple-100 transition-colors">
                <User className="h-4 w-4 text-purple-600" />
              </div>
              <span className="text-sm font-medium text-gray-700 group-hover:text-gray-900">
                Update Profile
              </span>
            </Link>

            <Link
              href="/dashboard/user/wishlist"
              className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors group"
            >
              <div className="p-2 bg-pink-50 rounded-lg group-hover:bg-pink-100 transition-colors">
                <Star className="h-4 w-4 text-pink-600" />
              </div>
              <span className="text-sm font-medium text-gray-700 group-hover:text-gray-900">
                View Wishlist
              </span>
            </Link>
          </div>

          {/* Order Summary */}
          {orders.length > 0 && (
            <div className="mt-6 p-4 bg-gray-50 rounded-lg">
              <h3 className="text-sm font-semibold text-gray-900 mb-3">Order Summary</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Total Orders</span>
                  <span className="font-medium text-gray-900">{stats.totalOrders}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Active</span>
                  <span className="font-medium text-yellow-600">{stats.activeOrders}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Total Spent</span>
                  <span className="font-medium text-gray-900">{formatCurrency(stats.totalSpent)}</span>
                </div>
              </div>
            </div>
          )}

          {/* Need Help */}
          <div className="mt-4 p-4 bg-blue-50 rounded-lg">
            <h3 className="text-sm font-semibold text-blue-900 mb-2">Need Help?</h3>
            <p className="text-xs text-blue-700 mb-3">
              Our support team is here to help you with any questions.
            </p>
            <Link
              href="/support"
              className="text-xs font-medium text-blue-600 hover:text-blue-800"
            >
              Contact Support →
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
