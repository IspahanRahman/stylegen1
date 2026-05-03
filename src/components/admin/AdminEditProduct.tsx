"use client";

import { useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useAdminProduct } from "@/hooks/useAdminProduct";
import type { ProductFormData } from "@/lib/mock/adminProductApi";
import {
  ArrowLeft,
  Save,
  Upload,
  X,
  Eye,
  Trash2,
  Plus,
  Loader2,
  AlertCircle,
  Package,
} from "lucide-react";
import { cn } from "@/lib/utils/cn";

const productSchema = z.object({
  name: z.string().min(2, "Product name must be at least 2 characters"),
  price: z
    .string()
    .min(1, "Price is required")
    .refine(
      (val) => !isNaN(parseFloat(val)) && parseFloat(val) > 0,
      "Price must be greater than 0",
    ),
  discount: z.string().optional(),
  category: z.string().min(1, "Please select a category"),
  stock: z
    .string()
    .min(1, "Stock is required")
    .refine(
      (val) => !isNaN(parseInt(val)) && parseInt(val) >= 0,
      "Stock must be 0 or more",
    ),
  description: z.string().min(10, "Description must be at least 10 characters"),
  sizes: z.string().optional(),
});

export default function AdminEditProduct() {
  const params = useParams();
  const router = useRouter();
  const productId = params?.id as string;

  // Use unified hook in edit mode
  const {
    mode,
    product,
    images,
    categories,
    isLoading,
    isSubmitting,
    isUploading,
    error,
    activeTab,
    productStatus,
    featured,
    seoTitle,
    metaDescription,
    tags,
    handleSubmit,
    handleImageUpload,
    handleRemoveImage,
    setActiveTab,
    setProductStatus,
    setFeatured,
    setSeoTitle,
    setMetaDescription,
    setTags,
    clearError,
  } = useAdminProduct({ mode: "edit", productId });

  const {
    register,
    handleSubmit: formHandleSubmit,
    formState: { errors },
    reset,
  } = useForm<ProductFormData>({
    resolver: zodResolver(productSchema),
  });

  // Reset form when product data loads
  useEffect(() => {
    if (product) {
      reset({
        name: product.name,
        price: product.price,
        discount: product.discount,
        category: product.category,
        stock: product.stock,
        description: product.description,
        sizes: product.sizes,
      });
    }
  }, [product, reset]);

  const onSubmit = async (data: ProductFormData) => {
    await handleSubmit(data);
  };

  // Loading State
  if (isLoading) {
    return (
      <div className="space-y-6 animate-pulse">
        <div className="flex justify-between">
          <div className="h-8 w-64 bg-gray-200 rounded" />
          <div className="flex gap-2">
            <div className="h-10 w-24 bg-gray-200 rounded" />
            <div className="h-10 w-32 bg-gray-200 rounded" />
          </div>
        </div>
        <div className="h-12 bg-gray-200 rounded-xl" />
        <div className="h-96 bg-gray-200 rounded-xl" />
      </div>
    );
  }

  // Product Not Found State
  if (!product && !isLoading) {
    return (
      <div className="text-center py-12">
        <Package className="h-16 w-16 text-gray-400 mx-auto mb-4" />
        <h2 className="text-xl font-bold text-gray-900 mb-2">
          Product Not Found
        </h2>
        <p className="text-gray-600 mb-6">
          The product you're trying to edit doesn't exist or has been removed.
        </p>
        <button
          onClick={() => router.push("/admin/products")}
          className="px-6 py-2.5 bg-orange-500 text-white rounded-lg font-medium hover:bg-orange-600 transition-colors"
        >
          Back to Products
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button
            onClick={() => router.back()}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            aria-label="Go back"
          >
            <ArrowLeft className="h-5 w-5 text-gray-600" />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Edit Product</h1>
            <p className="text-sm text-gray-500">
              Product ID: {productId} • Last updated: {product?.updatedAt}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => router.push(`/admin/products/${productId}`)}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            aria-label="Preview product"
          >
            <Eye className="h-4 w-4 inline mr-2" />
            Preview
          </button>
          <button
            onClick={formHandleSubmit(onSubmit)}
            disabled={isSubmitting || isUploading}
            className={cn(
              "inline-flex items-center gap-2 px-4 py-2.5 bg-orange-500 text-white rounded-lg text-sm font-medium",
              "hover:bg-orange-600 transition-colors",
              "disabled:opacity-50 disabled:cursor-not-allowed",
            )}
            aria-label="Save changes"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Save className="h-4 w-4" />
                Save Changes
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
            aria-label="Dismiss error"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      )}

      {/* Tabs */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="border-b border-gray-200">
          <nav className="flex -mb-px" aria-label="Tabs">
            {[
              { id: "basic", label: "Basic Information" },
              { id: "images", label: `Images & Media (${images.length})` },
              { id: "advanced", label: "Advanced Settings" },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() =>
                  setActiveTab?.(tab.id as "basic" | "images" | "advanced")
                }
                className={cn(
                  "px-6 py-3 text-sm font-medium border-b-2 transition-colors",
                  "focus:outline-none focus:ring-2 focus:ring-inset focus:ring-orange-500",
                  activeTab === tab.id
                    ? "border-orange-500 text-orange-600"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300",
                )}
                aria-current={activeTab === tab.id ? "page" : undefined}
              >
                {tab.label}
              </button>
            ))}
          </nav>
        </div>

        <div className="p-6">
          {/* Basic Information Tab */}
          {activeTab === "basic" && (
            <div className="space-y-4">
              <div>
                <label
                  htmlFor="name"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Product Name *
                </label>
                <input
                  id="name"
                  {...register("name")}
                  className={cn(
                    "w-full px-4 py-2.5 border rounded-lg transition-colors",
                    "focus:ring-2 focus:ring-orange-500 focus:border-orange-500",
                    errors.name
                      ? "border-red-300 bg-red-50"
                      : "border-gray-300",
                  )}
                  placeholder="Enter product name"
                />
                {errors.name && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.name.message}
                  </p>
                )}
              </div>

              <div>
                <label
                  htmlFor="description"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Description *
                </label>
                <textarea
                  id="description"
                  {...register("description")}
                  rows={6}
                  className={cn(
                    "w-full px-4 py-2.5 border rounded-lg transition-colors",
                    "focus:ring-2 focus:ring-orange-500 focus:border-orange-500",
                    errors.description
                      ? "border-red-300 bg-red-50"
                      : "border-gray-300",
                  )}
                  placeholder="Enter product description"
                />
                {errors.description && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.description.message}
                  </p>
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label
                    htmlFor="price"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    Price ($) *
                  </label>
                  <input
                    id="price"
                    {...register("price")}
                    type="number"
                    step="0.01"
                    min="0"
                    className={cn(
                      "w-full px-4 py-2.5 border rounded-lg transition-colors",
                      "focus:ring-2 focus:ring-orange-500 focus:border-orange-500",
                      errors.price
                        ? "border-red-300 bg-red-50"
                        : "border-gray-300",
                    )}
                  />
                  {errors.price && (
                    <p className="mt-1 text-sm text-red-600">
                      {errors.price.message}
                    </p>
                  )}
                </div>

                <div>
                  <label
                    htmlFor="discount"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    Discount (%)
                  </label>
                  <input
                    id="discount"
                    {...register("discount")}
                    type="number"
                    min="0"
                    max="100"
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 transition-colors"
                  />
                </div>

                <div>
                  <label
                    htmlFor="stock"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    Stock *
                  </label>
                  <input
                    id="stock"
                    {...register("stock")}
                    type="number"
                    min="0"
                    className={cn(
                      "w-full px-4 py-2.5 border rounded-lg transition-colors",
                      "focus:ring-2 focus:ring-orange-500 focus:border-orange-500",
                      errors.stock
                        ? "border-red-300 bg-red-50"
                        : "border-gray-300",
                    )}
                  />
                  {errors.stock && (
                    <p className="mt-1 text-sm text-red-600">
                      {errors.stock.message}
                    </p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label
                    htmlFor="category"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    Category *
                  </label>
                  <select
                    id="category"
                    {...register("category")}
                    className={cn(
                      "w-full px-4 py-2.5 border rounded-lg transition-colors",
                      "focus:ring-2 focus:ring-orange-500 focus:border-orange-500",
                      errors.category
                        ? "border-red-300 bg-red-50"
                        : "border-gray-300",
                    )}
                  >
                    <option value="">Select a category</option>
                    {categories.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                  {errors.category && (
                    <p className="mt-1 text-sm text-red-600">
                      {errors.category.message}
                    </p>
                  )}
                </div>

                <div>
                  <label
                    htmlFor="sizes"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    Sizes (comma separated)
                  </label>
                  <input
                    id="sizes"
                    {...register("sizes")}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 transition-colors"
                    placeholder="S, M, L, XL"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Images Tab */}
          {activeTab === "images" && (
            <div>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">
                  Product Images
                  <span className="text-sm text-gray-500 ml-2 font-normal">
                    ({images.length} images)
                  </span>
                </h3>
                <label
                  className={cn(
                    "px-4 py-2 bg-orange-500 text-white rounded-lg text-sm font-medium",
                    "hover:bg-orange-600 cursor-pointer transition-colors",
                    "inline-flex items-center gap-2",
                    isUploading && "opacity-50 cursor-not-allowed",
                  )}
                >
                  {isUploading ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Upload className="h-4 w-4" />
                  )}
                  {isUploading ? "Uploading..." : "Upload Images"}
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handleImageUpload}
                    disabled={isUploading}
                    className="hidden"
                  />
                </label>
              </div>

              {images.length === 0 && (
                <div className="mb-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                  <p className="text-sm text-yellow-700">
                    ⚠️ This product has no images. Please upload at least one.
                  </p>
                </div>
              )}

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {images.map((image, index) => (
                  <div
                    key={index}
                    className="relative aspect-square bg-gray-100 rounded-lg overflow-hidden group"
                  >
                    <img
                      src={image}
                      alt={`Product ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-all">
                      <button
                        onClick={() => handleRemoveImage(index)}
                        className="absolute top-2 right-2 p-1.5 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600"
                        aria-label={`Remove image ${index + 1}`}
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                      {index === 0 && (
                        <span className="absolute bottom-2 left-2 px-2 py-1 bg-orange-500 text-white text-xs rounded-full font-medium">
                          Main Image
                        </span>
                      )}
                    </div>
                  </div>
                ))}

                <label
                  className={cn(
                    "aspect-square border-2 border-dashed rounded-lg flex flex-col items-center justify-center cursor-pointer transition-colors",
                    "hover:border-orange-500 hover:bg-orange-50",
                    isUploading
                      ? "border-orange-300 bg-orange-50 pointer-events-none"
                      : "border-gray-300",
                  )}
                >
                  {isUploading ? (
                    <Loader2 className="h-8 w-8 text-orange-500 animate-spin" />
                  ) : (
                    <>
                      <Plus className="h-8 w-8 text-gray-400" />
                      <span className="text-xs text-gray-500 mt-2">
                        Add Image
                      </span>
                    </>
                  )}
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handleImageUpload}
                    disabled={isUploading}
                    className="hidden"
                  />
                </label>
              </div>

              <p className="text-xs text-gray-500 mt-4">
                Supported formats: JPG, PNG, GIF • Max size: 5MB per image •
                First image is the main product image
              </p>
            </div>
          )}

          {/* Advanced Settings Tab */}
          {activeTab === "advanced" && (
            <div className="space-y-4">
              <div>
                <label
                  htmlFor="product-status"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Product Status
                </label>
                <select
                  id="product-status"
                  value={productStatus}
                  onChange={(e) =>
                    setProductStatus?.(
                      e.target.value as "active" | "draft" | "inactive",
                    )
                  }
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
                >
                  <option value="active">Active - Visible to customers</option>
                  <option value="draft">Draft - Hidden from customers</option>
                  <option value="inactive">Inactive - Disabled</option>
                </select>
              </div>

              <div className="p-4 bg-gray-50 rounded-lg">
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={featured}
                    onChange={(e) => setFeatured?.(e.target.checked)}
                    className="rounded border-gray-300 text-orange-500 focus:ring-orange-500"
                  />
                  <div>
                    <span className="text-sm font-medium text-gray-900">
                      Featured Product
                    </span>
                    <p className="text-xs text-gray-500 mt-0.5">
                      Show this product in the featured section on the homepage
                    </p>
                  </div>
                </label>
              </div>

              <div>
                <label
                  htmlFor="seo-title"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  SEO Title
                </label>
                <input
                  id="seo-title"
                  type="text"
                  value={seoTitle}
                  onChange={(e) => setSeoTitle?.(e.target.value)}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
                  placeholder="SEO optimized title (optional)"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Leave empty to use product name
                </p>
              </div>

              <div>
                <label
                  htmlFor="meta-desc"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Meta Description
                </label>
                <textarea
                  id="meta-desc"
                  rows={3}
                  value={metaDescription}
                  onChange={(e) => setMetaDescription?.(e.target.value)}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
                  placeholder="Meta description for search engines (optional)"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Recommended length: 120-160 characters
                </p>
              </div>

              <div>
                <label
                  htmlFor="tags"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Tags
                </label>
                <input
                  id="tags"
                  type="text"
                  value={tags}
                  onChange={(e) => setTags?.(e.target.value)}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
                  placeholder="leather, handcrafted, premium (comma separated)"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Comma separated tags for better searchability
                </p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Bottom Action Bar */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-6 text-sm">
            <div>
              <span className="text-gray-500">Created:</span>{" "}
              <span className="font-medium text-gray-900">
                {product?.createdAt || "N/A"}
              </span>
            </div>
            <div>
              <span className="text-gray-500">Last Updated:</span>{" "}
              <span className="font-medium text-gray-900">
                {product?.updatedAt || "N/A"}
              </span>
            </div>
            <div>
              <span className="text-gray-500">Status:</span>{" "}
              <span
                className={cn(
                  "font-medium capitalize",
                  productStatus === "active"
                    ? "text-green-600"
                    : productStatus === "draft"
                      ? "text-yellow-600"
                      : "text-red-600",
                )}
              >
                {productStatus}
              </span>
            </div>
          </div>
          <div className="flex gap-3">
            <button
              onClick={() => router.back()}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={formHandleSubmit(onSubmit)}
              disabled={isSubmitting || isUploading}
              className={cn(
                "px-4 py-2 text-sm font-medium text-white bg-orange-500 rounded-lg",
                "hover:bg-orange-600 transition-colors",
                "disabled:opacity-50 disabled:cursor-not-allowed",
                "inline-flex items-center gap-2",
              )}
            >
              {isSubmitting && <Loader2 className="h-4 w-4 animate-spin" />}
              Save Changes
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
