"use client";

import { useParams } from "next/navigation";
import { useAdminProductDetails } from "@/hooks/useAdminProductDetails";
import {
  ArrowLeft,
  Edit,
  Trash2,
  Star,
  Package,
  DollarSign,
  TrendingUp,
  ShoppingCart,
  Eye,
  Clock,
  AlertCircle,
  ChevronLeft,
  ChevronRight,
  Loader2,
} from "lucide-react";
import Link from "next/link";
import { formatCurrency, formatDate } from "@/lib/utils/formatCurrency";
import { cn } from "@/lib/utils/cn";

export default function AdminProductDetails() {
  const params = useParams();
  const productId = params?.id as string;

  const {
    product,
    selectedImageIndex,
    isLoading,
    error,
    showDeleteModal,
    discountedPrice,
    setSelectedImage,
    handleDelete,
    handleImageNavigation,
    handleNavigateToEdit,
    openDeleteModal,
    closeDeleteModal,
    clearError,
    goBack,
  } = useAdminProductDetails(productId);

  // Loading State
  if (isLoading) {
    return (
      <div className="space-y-6 animate-pulse">
        <div className="flex justify-between">
          <div className="h-8 w-64 bg-gray-200 rounded" />
          <div className="flex gap-2">
            <div className="h-10 w-32 bg-gray-200 rounded" />
            <div className="h-10 w-24 bg-gray-200 rounded" />
          </div>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <div className="h-96 bg-gray-200 rounded-xl" />
            <div className="h-48 bg-gray-200 rounded-xl" />
          </div>
          <div className="space-y-6">
            <div className="h-64 bg-gray-200 rounded-xl" />
            <div className="h-48 bg-gray-200 rounded-xl" />
          </div>
        </div>
      </div>
    );
  }

  // Not Found State
  if (!product && !isLoading) {
    return (
      <div className="text-center py-12">
        <Package className="h-16 w-16 text-gray-400 mx-auto mb-4" />
        <h2 className="text-xl font-bold text-gray-900 mb-2">
          Product Not Found
        </h2>
        <p className="text-gray-600 mb-6">
          The product you're looking for doesn't exist or has been removed.
        </p>
        <button
          onClick={goBack}
          className="px-6 py-2.5 bg-orange-500 text-white rounded-lg font-medium hover:bg-orange-600 transition-colors"
        >
          Go Back
        </button>
      </div>
    );
  }

  if (!product) return null;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button
            onClick={goBack}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            aria-label="Go back"
          >
            <ArrowLeft className="h-5 w-5 text-gray-600" />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{product.name}</h1>
            <div className="flex items-center gap-3 mt-1">
              <span className="text-sm text-gray-500">
                Product ID: {product.id}
              </span>
              <span
                className={cn(
                  "px-2 py-0.5 rounded-full text-xs font-medium",
                  product.status === "active"
                    ? "bg-green-100 text-green-700"
                    : product.status === "draft"
                      ? "bg-gray-100 text-gray-700"
                      : "bg-yellow-100 text-yellow-700",
                )}
              >
                {product.status}
              </span>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={handleNavigateToEdit}
            className="inline-flex items-center gap-2 px-4 py-2.5 bg-orange-500 text-white rounded-lg text-sm font-medium hover:bg-orange-600 transition-colors"
          >
            <Edit className="h-4 w-4" />
            Edit Product
          </button>
          <button
            onClick={openDeleteModal}
            className="inline-flex items-center gap-2 px-4 py-2.5 bg-red-500 text-white rounded-lg text-sm font-medium hover:bg-red-600 transition-colors"
          >
            <Trash2 className="h-4 w-4" />
            Delete
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
            aria-label="Dismiss error"
          >
            ×
          </button>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Images & Info */}
        <div className="lg:col-span-2 space-y-6">
          {/* Image Gallery */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="relative aspect-square bg-gray-100 rounded-lg overflow-hidden mb-4 group">
              {product.images.length > 0 ? (
                <>
                  <img
                    src={product.images[selectedImageIndex]}
                    alt={`${product.name} - Image ${selectedImageIndex + 1}`}
                    className="w-full h-full object-cover"
                  />
                  {/* Image Navigation Arrows */}
                  {product.images.length > 1 && (
                    <>
                      <button
                        onClick={() => handleImageNavigation("prev")}
                        className="absolute left-2 top-1/2 -translate-y-1/2 p-2 bg-black/50 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-black/70"
                        aria-label="Previous image"
                      >
                        <ChevronLeft className="h-5 w-5" />
                      </button>
                      <button
                        onClick={() => handleImageNavigation("next")}
                        className="absolute right-2 top-1/2 -translate-y-1/2 p-2 bg-black/50 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-black/70"
                        aria-label="Next image"
                      >
                        <ChevronRight className="h-5 w-5" />
                      </button>
                    </>
                  )}
                  {/* Image Counter */}
                  <div className="absolute top-3 left-3">
                    <span className="px-3 py-1.5 bg-black/60 text-white text-xs font-medium rounded-full backdrop-blur-sm">
                      {selectedImageIndex + 1} / {product.images.length}
                    </span>
                  </div>
                </>
              ) : (
                <div className="flex items-center justify-center h-full">
                  <Package className="h-16 w-16 text-gray-400" />
                </div>
              )}
            </div>

            {/* Thumbnail Gallery */}
            {product.images.length > 0 && (
              <div className="flex gap-2 overflow-x-auto pb-2">
                {product.images.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImage(index)}
                    className={cn(
                      "h-20 w-20 rounded-lg overflow-hidden border-2 flex-shrink-0 transition-all",
                      "hover:border-orange-300",
                      selectedImageIndex === index
                        ? "border-orange-500 ring-2 ring-orange-200"
                        : "border-gray-200 opacity-70 hover:opacity-100",
                    )}
                    aria-label={`View image ${index + 1}`}
                  >
                    <img
                      src={image}
                      alt={`${product.name} thumbnail ${index + 1}`}
                      className="h-full w-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Description */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              Description
            </h2>
            <p className="text-gray-600 leading-relaxed">
              {product.description}
            </p>

            {/* Features */}
            {product.features && product.features.length > 0 && (
              <div className="mt-6">
                <h3 className="font-medium text-gray-900 mb-3">Key Features</h3>
                <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {product.features.map((feature, index) => (
                    <li
                      key={index}
                      className="flex items-center gap-2 text-gray-600 text-sm"
                    >
                      <div className="w-1.5 h-1.5 bg-orange-500 rounded-full flex-shrink-0" />
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          {/* Specifications */}
          {product.specifications &&
            Object.keys(product.specifications).length > 0 && (
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">
                  Specifications
                </h2>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {Object.entries(product.specifications).map(
                    ([key, value]) => (
                      <div key={key} className="p-3 bg-gray-50 rounded-lg">
                        <p className="text-xs text-gray-500 capitalize mb-1">
                          {key}
                        </p>
                        <p className="font-medium text-gray-900 text-sm">
                          {value}
                        </p>
                      </div>
                    ),
                  )}
                </div>
              </div>
            )}
        </div>

        {/* Right Column - Stats & Orders */}
        <div className="space-y-6">
          {/* Price & Stock Info */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              Product Info
            </h2>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-gray-600 text-sm">Price</span>
                <div className="text-right">
                  <span className="text-2xl font-bold text-gray-900">
                    {formatCurrency(discountedPrice)}
                  </span>
                  {parseFloat(product.discount || "0") > 0 && (
                    <div className="flex items-center gap-2 justify-end">
                      <span className="text-sm text-gray-400 line-through">
                        {formatCurrency(parseFloat(product.price))}
                      </span>
                      <span className="text-sm text-green-600 font-medium">
                        {product.discount}% off
                      </span>
                    </div>
                  )}
                </div>
              </div>

              <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                <span className="text-gray-600 text-sm">Stock</span>
                <div className="flex items-center gap-2">
                  {parseInt(product.stock) <= 5 ? (
                    <AlertCircle className="h-4 w-4 text-red-500" />
                  ) : (
                    <Package className="h-4 w-4 text-green-500" />
                  )}
                  <span
                    className={cn(
                      "font-medium",
                      parseInt(product.stock) === 0
                        ? "text-red-600"
                        : "text-gray-900",
                    )}
                  >
                    {product.stock} units
                  </span>
                </div>
              </div>

              <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                <span className="text-gray-600 text-sm">Category</span>
                <span className="px-2 py-1 bg-gray-100 rounded-full text-xs font-medium text-gray-700">
                  {product.category}
                </span>
              </div>

              {product.sizes && (
                <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                  <span className="text-gray-600 text-sm">Sizes</span>
                  <div className="flex flex-wrap gap-1 justify-end">
                    {product.sizes.split(",").map((size) => (
                      <span
                        key={size.trim()}
                        className="px-2 py-1 bg-gray-100 rounded text-xs font-medium text-gray-700"
                      >
                        {size.trim()}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                <span className="text-gray-600 text-sm">Rating</span>
                <div className="flex items-center gap-1">
                  <Star className="h-4 w-4 text-yellow-400 fill-current" />
                  <span className="font-medium">{product.rating || 0}</span>
                  {product.reviews ? (
                    <span className="text-sm text-gray-500">
                      ({product.reviews} reviews)
                    </span>
                  ) : (
                    <span className="text-sm text-gray-400">No reviews</span>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Performance Stats */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              Performance
            </h2>
            <div className="grid grid-cols-2 gap-3">
              <div className="p-3 bg-blue-50 rounded-lg">
                <div className="flex items-center gap-2 mb-1">
                  <TrendingUp className="h-4 w-4 text-blue-600" />
                  <span className="text-xs text-blue-600 font-medium">
                    Sales
                  </span>
                </div>
                <p className="text-xl font-bold text-blue-900">
                  {product.sales || 0}
                </p>
              </div>
              <div className="p-3 bg-purple-50 rounded-lg">
                <div className="flex items-center gap-2 mb-1">
                  <Eye className="h-4 w-4 text-purple-600" />
                  <span className="text-xs text-purple-600 font-medium">
                    Views
                  </span>
                </div>
                <p className="text-xl font-bold text-purple-900">
                  {(product as any).views?.toLocaleString() || "0"}
                </p>
              </div>
              <div className="p-3 bg-green-50 rounded-lg">
                <div className="flex items-center gap-2 mb-1">
                  <ShoppingCart className="h-4 w-4 text-green-600" />
                  <span className="text-xs text-green-600 font-medium">
                    Conversion
                  </span>
                </div>
                <p className="text-xl font-bold text-green-900">
                  {product.sales && (product as any).views
                    ? `${(((product.sales || 0) / ((product as any).views || 1)) * 100).toFixed(1)}%`
                    : "0%"}
                </p>
              </div>
              <div className="p-3 bg-orange-50 rounded-lg">
                <div className="flex items-center gap-2 mb-1">
                  <Clock className="h-4 w-4 text-orange-600" />
                  <span className="text-xs text-orange-600 font-medium">
                    Updated
                  </span>
                </div>
                <p className="text-sm font-bold text-orange-900">
                  {formatDate(product.updatedAt)}
                </p>
              </div>
            </div>
          </div>

          {/* Recent Orders */}
          {(product as any).recentOrders &&
            (product as any).recentOrders.length > 0 && (
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-semibold text-gray-900">
                    Recent Orders
                  </h2>
                  <Link
                    href="/admin/orders"
                    className="text-sm text-orange-500 hover:text-orange-600 font-medium"
                  >
                    View All
                  </Link>
                </div>
                <div className="space-y-3">
                  {(product as any).recentOrders.map((order: any) => (
                    <div
                      key={order.id}
                      className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                    >
                      <div>
                        <Link
                          href={`/admin/orders/${order.id}`}
                          className="text-sm font-medium text-gray-900 hover:text-orange-500"
                        >
                          {order.id}
                        </Link>
                        <p className="text-xs text-gray-500">
                          {order.customer}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-medium text-gray-900">
                          {formatCurrency(order.total)}
                        </p>
                        <p className="text-xs text-gray-500">
                          Qty: {order.quantity}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-md w-full p-6 animate-in">
            <div className="text-center">
              <div className="mx-auto w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4">
                <AlertCircle className="h-8 w-8 text-red-500" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Delete Product
              </h3>
              <p className="text-gray-600 mb-2">
                Are you sure you want to delete{" "}
                <span className="font-medium">"{product.name}"</span>?
              </p>
              <p className="text-sm text-red-600 mb-6">
                This action cannot be undone. All data associated with this
                product will be permanently removed.
              </p>
              <div className="flex gap-3 justify-center">
                <button
                  onClick={closeDeleteModal}
                  className="px-4 py-2.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDelete}
                  className="px-4 py-2.5 text-sm font-medium text-white bg-red-500 rounded-lg hover:bg-red-600 transition-colors"
                >
                  Delete Product
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
