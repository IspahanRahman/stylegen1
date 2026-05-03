"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  Printer,
  Download,
  Mail,
  Package,
  Clock,
  CheckCircle2,
  Truck,
  XCircle,
  MapPin,
  CreditCard,
  User,
  Phone,
  AlertCircle,
} from "lucide-react";
import { formatCurrency, formatDate } from "@/lib/utils/formatCurrency";
import { cn } from "@/lib/utils/cn";
import toast from "react-hot-toast";

const mockOrderDetails = {
  id: "ORD-001",
  status: "processing",
  payment: "paid",
  paymentMethod: "Credit Card (Visa ****4242)",
  subtotal: 329.98,
  shipping: 0,
  tax: 24.99,
  discount: 54.98,
  total: 299.99,
  createdAt: "2024-03-25 14:30",
  updatedAt: "2024-03-25 16:45",
  customer: {
    name: "John Doe",
    email: "john.doe@example.com",
    phone: "+1 (555) 123-4567",
    totalOrders: 12,
  },
  shippingAddress: {
    street: "123 Main Street",
    apartment: "Apt 4B",
    city: "New York",
    state: "NY",
    zipCode: "10001",
    country: "United States",
  },
  items: [
    {
      id: "1",
      name: "Italian Leather Weekend Bag",
      price: 299.99,
      quantity: 1,
      size: "One Size",
      image: "/images/products/bag-1.jpg",
      discount: 15,
    },
    {
      id: "2",
      name: "Leather Care Kit",
      price: 29.99,
      quantity: 1,
      size: null,
      image: "/images/products/care-kit.jpg",
      discount: 0,
    },
  ],
  timeline: [
    {
      status: "Order Placed",
      date: "2024-03-25 14:30",
      icon: Clock,
      completed: true,
    },
    {
      status: "Payment Confirmed",
      date: "2024-03-25 14:31",
      icon: CreditCard,
      completed: true,
    },
    {
      status: "Processing",
      date: "2024-03-25 15:00",
      icon: Package,
      completed: true,
    },
    { status: "Ready to Ship", date: null, icon: Truck, completed: false },
    { status: "Shipped", date: null, icon: Truck, completed: false },
    { status: "Delivered", date: null, icon: CheckCircle2, completed: false },
  ],
};

const statusConfig = {
  pending: {
    color: "bg-yellow-100 text-yellow-700 border-yellow-200",
    icon: Clock,
  },
  processing: {
    color: "bg-blue-100 text-blue-700 border-blue-200",
    icon: Package,
  },
  shipped: {
    color: "bg-purple-100 text-purple-700 border-purple-200",
    icon: Truck,
  },
  delivered: {
    color: "bg-green-100 text-green-700 border-green-200",
    icon: CheckCircle2,
  },
  cancelled: { color: "bg-red-100 text-red-700 border-red-200", icon: XCircle },
};

export default function AdminOrderDetails() {
  const params = useParams();
  const router = useRouter();
  const [order, setOrder] = useState(mockOrderDetails);
  const [showStatusModal, setShowStatusModal] = useState(false);
  const [newStatus, setNewStatus] = useState(order.status);

  const updateOrderStatus = () => {
    setOrder({ ...order, status: newStatus });
    toast.success(`Order status updated to ${newStatus}`);
    setShowStatusModal(false);
  };

  const handlePrintInvoice = () => {
    toast.success("Invoice sent to printer");
  };

  const handleEmailCustomer = () => {
    toast.success("Email client opened");
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button
            onClick={() => router.back()}
            className="p-2 hover:bg-gray-100 rounded-lg"
          >
            <ArrowLeft className="h-5 w-5 text-gray-600" />
          </button>
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-bold text-gray-900">
                Order {order.id}
              </h1>
              <span
                className={cn(
                  "inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-sm font-medium border",
                  statusConfig[order.status as keyof typeof statusConfig].color,
                )}
              >
                {(() => {
                  const StatusIcon =
                    statusConfig[order.status as keyof typeof statusConfig]
                      .icon;
                  return <StatusIcon className="h-4 w-4" />;
                })()}
                {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
              </span>
            </div>
            <p className="text-sm text-gray-500 mt-1">
              Placed on {formatDate(order.createdAt.split(" ")[0])} at{" "}
              {order.createdAt.split(" ")[1]}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={handlePrintInvoice}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
          >
            <Printer className="h-4 w-4 inline mr-2" />
            Print
          </button>
          <button
            onClick={() => setShowStatusModal(true)}
            className="px-4 py-2.5 bg-orange-500 text-white rounded-lg text-sm font-medium hover:bg-orange-600"
          >
            Update Status
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Order Timeline */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-6">
              Order Timeline
            </h2>
            <div className="relative">
              <div className="absolute left-4 top-0 bottom-0 w-px bg-gray-200" />
              <div className="space-y-6">
                {order.timeline.map((event, index) => {
                  const EventIcon = event.icon;
                  return (
                    <div key={index} className="relative flex gap-4 pl-10">
                      <div
                        className={cn(
                          "absolute left-2.5 w-3 h-3 rounded-full border-2 -translate-x-1/2",
                          event.completed
                            ? "bg-orange-500 border-orange-500"
                            : "bg-white border-gray-300",
                        )}
                      />
                      <div className="flex-1">
                        <p
                          className={cn(
                            "font-medium",
                            event.completed ? "text-gray-900" : "text-gray-400",
                          )}
                        >
                          {event.status}
                        </p>
                        {event.date && (
                          <p className="text-sm text-gray-500">{event.date}</p>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Order Items */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              Order Items
            </h2>
            <div className="space-y-4">
              {order.items.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg"
                >
                  <div className="h-20 w-20 bg-gray-200 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Package className="h-8 w-8 text-gray-400" />
                  </div>
                  <div className="flex-1">
                    <Link
                      href={`/admin/products/${item.id}`}
                      className="font-medium text-gray-900 hover:text-orange-500"
                    >
                      {item.name}
                    </Link>
                    <div className="flex items-center gap-4 mt-1 text-sm text-gray-500">
                      <span>Qty: {item.quantity}</span>
                      {item.size && <span>Size: {item.size}</span>}
                      {item.discount > 0 && (
                        <span className="text-green-600">
                          {item.discount}% off
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-medium text-gray-900">
                      {formatCurrency(item.price * item.quantity)}
                    </p>
                    {item.discount > 0 && (
                      <p className="text-xs text-gray-400 line-through">
                        {formatCurrency(
                          (item.price / (1 - item.discount / 100)) *
                            item.quantity,
                        )}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column - Details */}
        <div className="space-y-6">
          {/* Order Summary */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              Order Summary
            </h2>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Subtotal</span>
                <span className="font-medium">
                  {formatCurrency(order.subtotal)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Discount</span>
                <span className="font-medium text-green-600">
                  -{formatCurrency(order.discount)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Shipping</span>
                <span className="font-medium">
                  {order.shipping === 0
                    ? "Free"
                    : formatCurrency(order.shipping)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Tax</span>
                <span className="font-medium">{formatCurrency(order.tax)}</span>
              </div>
              <hr />
              <div className="flex justify-between text-lg font-bold">
                <span>Total</span>
                <span>{formatCurrency(order.total)}</span>
              </div>
            </div>
            <div className="mt-4 pt-4 border-t border-gray-100">
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <CreditCard className="h-4 w-4" />
                {order.paymentMethod}
              </div>
            </div>
          </div>

          {/* Customer Information */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-900">Customer</h2>
              <Link
                href={`/admin/customers`}
                className="text-sm text-orange-500 hover:text-orange-600"
              >
                View Profile
              </Link>
            </div>
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-orange-100 flex items-center justify-center">
                  <User className="h-5 w-5 text-orange-600" />
                </div>
                <div>
                  <p className="font-medium text-gray-900">
                    {order.customer.name}
                  </p>
                  <p className="text-sm text-gray-500">
                    {order.customer.totalOrders} orders
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Mail className="h-4 w-4" />
                {order.customer.email}
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Phone className="h-4 w-4" />
                {order.customer.phone}
              </div>
              <button
                onClick={handleEmailCustomer}
                className="w-full mt-2 px-4 py-2 text-sm font-medium text-gray-700 bg-gray-50 rounded-lg hover:bg-gray-100"
              >
                <Mail className="h-4 w-4 inline mr-2" />
                Email Customer
              </button>
            </div>
          </div>

          {/* Shipping Address */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              Shipping Address
            </h2>
            <div className="flex items-start gap-3">
              <MapPin className="h-5 w-5 text-gray-400 mt-0.5" />
              <div className="text-sm text-gray-600">
                <p className="font-medium text-gray-900">
                  {order.customer.name}
                </p>
                <p>{order.shippingAddress.street}</p>
                {order.shippingAddress.apartment && (
                  <p>{order.shippingAddress.apartment}</p>
                )}
                <p>
                  {order.shippingAddress.city}, {order.shippingAddress.state}{" "}
                  {order.shippingAddress.zipCode}
                </p>
                <p>{order.shippingAddress.country}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Status Update Modal */}
      {showStatusModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-md w-full p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Update Order Status
            </h3>
            <div className="space-y-3">
              {[
                "pending",
                "processing",
                "shipped",
                "delivered",
                "cancelled",
              ].map((status) => {
                const config =
                  statusConfig[status as keyof typeof statusConfig];
                const StatusIcon = config.icon;
                return (
                  <label
                    key={status}
                    className={cn(
                      "flex items-center gap-3 p-3 rounded-lg border-2 cursor-pointer transition-all",
                      newStatus === status
                        ? "border-orange-500 bg-orange-50"
                        : "border-gray-200 hover:border-gray-300",
                    )}
                  >
                    <input
                      type="radio"
                      name="status"
                      value={status}
                      checked={newStatus === status}
                      onChange={(e) => setNewStatus(e.target.value)}
                      className="text-orange-500 focus:ring-orange-500"
                    />
                    <StatusIcon
                      className={cn(
                        "h-5 w-5",
                        newStatus === status
                          ? "text-orange-500"
                          : "text-gray-400",
                      )}
                    />
                    <span
                      className={cn(
                        "font-medium capitalize",
                        newStatus === status
                          ? "text-orange-700"
                          : "text-gray-700",
                      )}
                    >
                      {status}
                    </span>
                  </label>
                );
              })}
            </div>
            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setShowStatusModal(false)}
                className="flex-1 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={updateOrderStatus}
                className="flex-1 px-4 py-2 text-sm font-medium text-white bg-orange-500 rounded-lg hover:bg-orange-600"
              >
                Update Status
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
