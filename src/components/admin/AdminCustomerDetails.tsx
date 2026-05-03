"use client";

import { useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { useAdminCustomers } from "@/hooks/useAdminCustomers";
import {
  ArrowLeft,
  Mail,
  Phone,
  MapPin,
  Calendar,
  ShoppingBag,
  DollarSign,
  Star,
  Ban,
  CheckCircle2,
  AlertCircle,
  Loader2,
  Package,
} from "lucide-react";
import { formatCurrency, formatDate } from "@/lib/utils/formatCurrency";
import { cn } from "@/lib/utils/cn";
import Link from "next/link";

const statusConfig = {
  active: { color: "bg-green-100 text-green-700", icon: CheckCircle2 },
  inactive: { color: "bg-gray-100 text-gray-700", icon: AlertCircle },
  banned: { color: "bg-red-100 text-red-700", icon: Ban },
};

export default function AdminCustomerDetails() {
  const params = useParams();
  const router = useRouter();

  const {
    selectedCustomer,
    isLoading,
    isSubmitting,
    error,
    newNote,
    showStatusModal,
    setNewNote,
    handleStatusChange,
    handleAddNote,
    handleEmailCustomer,
    openStatusModal,
    closeStatusModal,
    clearError,
    fetchCustomerDetails,
  } = useAdminCustomers();

  // Fetch customer details on mount
  useEffect(() => {
    if (params?.id) {
      fetchCustomerDetails(params.id as string);
    }
  }, [params?.id]);

  // Loading State
  if (isLoading || !selectedCustomer) {
    return (
      <div className="space-y-6 animate-pulse">
        <div className="h-8 w-48 bg-gray-200 rounded" />
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 h-64 bg-gray-200 rounded-xl" />
          <div className="h-64 bg-gray-200 rounded-xl" />
        </div>
      </div>
    );
  }

  const status =
    statusConfig[selectedCustomer.status as keyof typeof statusConfig];
  const StatusIcon = status.icon;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button
            onClick={() => router.back()}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ArrowLeft className="h-5 w-5 text-gray-600" />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              {selectedCustomer.name}
            </h1>
            <p className="text-sm text-gray-500">
              Customer ID: {selectedCustomer.id}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={openStatusModal}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Manage Status
          </button>
          <button
            onClick={() => handleEmailCustomer(selectedCustomer.email)}
            className="px-4 py-2.5 bg-orange-500 text-white rounded-lg text-sm font-medium hover:bg-orange-600 transition-colors"
          >
            <Mail className="h-4 w-4 inline mr-2" />
            Email Customer
          </button>
        </div>
      </div>

      {/* Error Banner */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-center justify-between">
          <div className="flex items-center gap-2 text-red-700">
            <AlertCircle className="h-5 w-5" />
            <p className="text-sm">{error}</p>
          </div>
          <button
            onClick={clearError}
            className="text-red-500 hover:text-red-700"
          >
            ×
          </button>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column */}
        <div className="lg:col-span-2 space-y-6">
          {/* Customer Overview */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-start justify-between mb-6">
              <div className="flex items-center gap-4">
                <div className="h-16 w-16 rounded-full bg-orange-100 flex items-center justify-center">
                  <span className="text-2xl font-bold text-orange-600">
                    {selectedCustomer.name.charAt(0)}
                  </span>
                </div>
                <div>
                  <h2 className="text-xl font-bold text-gray-900">
                    {selectedCustomer.name}
                  </h2>
                  <div className="flex items-center gap-3 mt-1">
                    <span
                      className={cn(
                        "inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium",
                        status.color,
                      )}
                    >
                      <StatusIcon className="h-3 w-3" />
                      {selectedCustomer.status}
                    </span>
                    <span className="text-sm text-gray-500">
                      Joined {formatDate(selectedCustomer.joined)}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="p-4 bg-blue-50 rounded-lg">
                <ShoppingBag className="h-5 w-5 text-blue-600 mb-2" />
                <p className="text-xl font-bold text-blue-900">
                  {selectedCustomer.stats.totalOrders}
                </p>
                <p className="text-xs text-blue-600">Total Orders</p>
              </div>
              <div className="p-4 bg-green-50 rounded-lg">
                <DollarSign className="h-5 w-5 text-green-600 mb-2" />
                <p className="text-xl font-bold text-green-900">
                  {formatCurrency(selectedCustomer.stats.totalSpent)}
                </p>
                <p className="text-xs text-green-600">Total Spent</p>
              </div>
              <div className="p-4 bg-purple-50 rounded-lg">
                <Package className="h-5 w-5 text-purple-600 mb-2" />
                <p className="text-xl font-bold text-purple-900">
                  {selectedCustomer.stats.productsPurchased}
                </p>
                <p className="text-xs text-purple-600">Products</p>
              </div>
              <div className="p-4 bg-yellow-50 rounded-lg">
                <Star className="h-5 w-5 text-yellow-600 mb-2" />
                <p className="text-xl font-bold text-yellow-900">
                  {selectedCustomer.stats.averageRating}
                </p>
                <p className="text-xs text-yellow-600">Avg Rating</p>
              </div>
            </div>
          </div>

          {/* Recent Orders */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              Recent Orders
            </h2>
            {selectedCustomer.recentOrders.length === 0 ? (
              <p className="text-gray-500 text-center py-4">No orders yet</p>
            ) : (
              <div className="space-y-3">
                {selectedCustomer.recentOrders.map((order) => (
                  <Link
                    key={order.id}
                    href={`/admin/orders/${order.id}`}
                    className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                  >
                    <div>
                      <p className="font-medium text-gray-900 hover:text-orange-500">
                        {order.id}
                      </p>
                      <p className="text-sm text-gray-500">
                        {formatDate(order.date)} • {order.items} item(s)
                      </p>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="font-medium">
                        {formatCurrency(order.total)}
                      </span>
                      <span
                        className={cn(
                          "px-2 py-1 rounded-full text-xs font-medium",
                          order.status === "delivered"
                            ? "bg-green-100 text-green-700"
                            : order.status === "processing"
                              ? "bg-blue-100 text-blue-700"
                              : "bg-yellow-100 text-yellow-700",
                        )}
                      >
                        {order.status}
                      </span>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>

          {/* Activity Log */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              Activity Log
            </h2>
            {selectedCustomer.activity.length === 0 ? (
              <p className="text-gray-500 text-center py-4">No activity yet</p>
            ) : (
              <div className="relative">
                <div className="absolute left-4 top-0 bottom-0 w-px bg-gray-200" />
                <div className="space-y-4">
                  {selectedCustomer.activity.map((activity, index) => (
                    <div key={index} className="relative flex gap-4 pl-10">
                      <div className="absolute left-2.5 w-3 h-3 rounded-full bg-orange-500 border-2 border-orange-500 -translate-x-1/2" />
                      <div className="flex-1">
                        <p className="text-sm font-medium text-gray-900">
                          {activity.action}
                        </p>
                        <p className="text-xs text-gray-500">
                          {activity.description}
                        </p>
                        <p className="text-xs text-gray-400 mt-1">
                          {activity.date}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right Column */}
        <div className="space-y-6">
          {/* Contact Info */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              Contact Info
            </h2>
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-sm">
                <Mail className="h-4 w-4 text-gray-400 flex-shrink-0" />
                <span className="text-gray-600">{selectedCustomer.email}</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Phone className="h-4 w-4 text-gray-400 flex-shrink-0" />
                <span className="text-gray-600">{selectedCustomer.phone}</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Calendar className="h-4 w-4 text-gray-400 flex-shrink-0" />
                <span className="text-gray-600">
                  Last active: {selectedCustomer.lastActive}
                </span>
              </div>
            </div>
          </div>

          {/* Addresses */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              Addresses
            </h2>
            {selectedCustomer.addresses.length === 0 ? (
              <p className="text-gray-500 text-center py-4">
                No addresses saved
              </p>
            ) : (
              <div className="space-y-3">
                {selectedCustomer.addresses.map((address) => (
                  <div key={address.id} className="p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <MapPin className="h-4 w-4 text-gray-400" />
                        <span className="font-medium text-gray-900">
                          {address.type}
                        </span>
                      </div>
                      {address.isDefault && (
                        <span className="px-2 py-0.5 bg-orange-100 text-orange-700 text-xs rounded-full">
                          Default
                        </span>
                      )}
                    </div>
                    <div className="text-sm text-gray-600 pl-6">
                      <p>{address.street}</p>
                      {address.apartment && <p>{address.apartment}</p>}
                      <p>
                        {address.city}, {address.state} {address.zipCode}
                      </p>
                      <p>{address.country}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Admin Notes */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              Admin Notes
            </h2>

            {/* Add Note */}
            <div className="mb-4">
              <textarea
                value={newNote}
                onChange={(e) => setNewNote(e.target.value)}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-orange-500"
                placeholder="Add a note about this customer..."
              />
              <button
                onClick={handleAddNote}
                disabled={!newNote.trim() || isSubmitting}
                className="mt-2 w-full px-4 py-2 bg-orange-500 text-white rounded-lg text-sm font-medium hover:bg-orange-600 disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {isSubmitting && <Loader2 className="h-4 w-4 animate-spin" />}
                Add Note
              </button>
            </div>

            {/* Notes List */}
            {selectedCustomer.notes.length === 0 ? (
              <p className="text-gray-500 text-center py-4">No notes yet</p>
            ) : (
              <div className="space-y-3 max-h-60 overflow-y-auto">
                {selectedCustomer.notes.map((note) => (
                  <div key={note.id} className="p-3 bg-yellow-50 rounded-lg">
                    <p className="text-sm text-gray-700">{note.content}</p>
                    <div className="flex items-center justify-between mt-2">
                      <span className="text-xs text-gray-500">
                        {note.author}
                      </span>
                      <span className="text-xs text-gray-400">{note.date}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Status Modal */}
      {showStatusModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-md w-full p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Manage Customer Status
            </h3>
            <div className="space-y-3">
              {[
                {
                  status: "active",
                  label: "Active",
                  description: "Customer can place orders",
                  color: "green",
                },
                {
                  status: "inactive",
                  label: "Inactive",
                  description: "Customer cannot place orders",
                  color: "gray",
                },
                {
                  status: "banned",
                  label: "Banned",
                  description: "Customer is permanently banned",
                  color: "red",
                },
              ].map((option) => (
                <button
                  key={option.status}
                  onClick={() =>
                    handleStatusChange(selectedCustomer.id, option.status)
                  }
                  disabled={isSubmitting}
                  className={cn(
                    "w-full p-4 rounded-lg border-2 text-left transition-all",
                    selectedCustomer.status === option.status
                      ? `border-${option.color}-500 bg-${option.color}-50`
                      : "border-gray-200 hover:border-gray-300",
                  )}
                >
                  <p className="font-medium">{option.label}</p>
                  <p className="text-sm text-gray-500 mt-1">
                    {option.description}
                  </p>
                </button>
              ))}
            </div>
            <button
              onClick={closeStatusModal}
              className="w-full mt-4 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
