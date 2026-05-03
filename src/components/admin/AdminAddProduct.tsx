"use client";

import { useEffect } from "react";
import { useAdminProduct } from "@/hooks/useAdminProduct";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  ArrowLeft,
  Save,
  Upload,
  X,
  Image as ImageIcon,
  Eye,
  Loader2,
  AlertCircle,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils/cn";
import type { ProductFormData } from "@/lib/mock/adminProductApi";

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

export default function AdminAddProduct() {
  const router = useRouter();

  // Use unified hook in create mode
  const {
    mode,
    images,
    categories,
    isSubmitting,
    isUploading,
    error,
    previewMode,
    handleTogglePreview,
    handleSubmit,
    handleImageUpload,
    handleRemoveImage,
    clearError,
  } = useAdminProduct({ mode: "create" });

  const {
    register,
    handleSubmit: formHandleSubmit,
    formState: { errors },
    watch,
    reset,
  } = useForm<ProductFormData>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      name: "",
      price: "",
      discount: "0",
      category: "",
      stock: "10",
      description: "",
      sizes: "",
    },
  });

  const productData = watch();

  const onSubmit = async (data: ProductFormData) => {
    await handleSubmit(data);
    // Reset form after successful submission
    reset();
  };

  // Loading state while categories load
  if (categories.length === 0 && !error) {
    return (
      <div className="space-y-6 animate-pulse">
        <div className="flex justify-between">
          <div className="h-8 w-48 bg-gray-200 rounded" />
          <div className="h-10 w-32 bg-gray-200 rounded" />
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 h-96 bg-gray-200 rounded-xl" />
          <div className="h-64 bg-gray-200 rounded-xl" />
        </div>
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
            <h1 className="text-2xl font-bold text-gray-900">
              Add New Product
            </h1>
            <p className="text-sm text-gray-500">
              Create a new product listing
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={handleTogglePreview}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            aria-label={previewMode ? "Switch to edit mode" : "Preview product"}
          >
            <Eye className="h-4 w-4 inline mr-2" />
            {previewMode ? "Edit" : "Preview"}
          </button>
          <button
            onClick={formHandleSubmit(onSubmit)}
            disabled={isSubmitting || isUploading}
            className={cn(
              "inline-flex items-center gap-2 px-4 py-2.5 bg-orange-500 text-white rounded-lg text-sm font-medium",
              "hover:bg-orange-600 transition-colors",
              "disabled:opacity-50 disabled:cursor-not-allowed",
            )}
            aria-label="Save product"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Save className="h-4 w-4" />
                Save Product
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

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Form */}
        <div className="lg:col-span-2 space-y-6">
          {/* Basic Information */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              Basic Information
              <span className="text-sm text-gray-500 ml-2 font-normal">
                All fields marked with * are required
              </span>
            </h2>

            <div className="space-y-4">
              <div>
                <label
                  htmlFor="name"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Product Name <span className="text-red-500">*</span>
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
                  Description <span className="text-red-500">*</span>
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
                <p className="mt-1 text-xs text-gray-400">
                  {(productData.description || "").length} / 10 characters
                  minimum
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label
                    htmlFor="price"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    Price ($) <span className="text-red-500">*</span>
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
                    placeholder="0.00"
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
                    placeholder="0"
                  />
                  <p className="mt-1 text-xs text-gray-400">Optional</p>
                </div>

                <div>
                  <label
                    htmlFor="stock"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    Stock <span className="text-red-500">*</span>
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
                    placeholder="0"
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
                    Category <span className="text-red-500">*</span>
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
                  <p className="mt-1 text-xs text-gray-400">Optional</p>
                </div>
              </div>
            </div>
          </div>

          {/* Image Upload */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-900">
                Product Images
                <span className="text-sm text-gray-500 ml-2 font-normal">
                  ({images.length} uploaded)
                </span>
              </h2>
              {isUploading && (
                <div className="flex items-center gap-2 text-sm text-orange-500">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Uploading...
                </div>
              )}
            </div>

            {images.length === 0 && !isUploading && (
              <div className="mb-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                <p className="text-sm text-yellow-700">
                  ⚠️ Please upload at least one product image
                </p>
              </div>
            )}

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-4">
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
                      <X className="h-3 w-3" />
                    </button>
                    {index === 0 && (
                      <span className="absolute bottom-2 left-2 px-2 py-1 bg-orange-500 text-white text-xs rounded-full font-medium">
                        Main
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
                    <Upload className="h-8 w-8 text-gray-400" />
                    <span className="text-xs text-gray-500 mt-2">
                      Upload Image
                    </span>
                    <span className="text-xs text-gray-400 mt-1">Max 5MB</span>
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

            <p className="text-xs text-gray-500 mt-2">
              Supported formats: JPG, PNG, GIF • Max size: 5MB per image • First
              image will be the main image
            </p>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Product Status */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Product Status
            </h3>
            <div className="space-y-3">
              <label className="flex items-center gap-3 cursor-pointer p-3 rounded-lg hover:bg-gray-50 transition-colors">
                <input
                  type="radio"
                  name="status"
                  value="active"
                  className="text-orange-500 focus:ring-orange-500"
                  defaultChecked
                />
                <div>
                  <p className="text-sm font-medium text-gray-900">Active</p>
                  <p className="text-xs text-gray-500">
                    Product will be visible to customers immediately
                  </p>
                </div>
              </label>
              <label className="flex items-center gap-3 cursor-pointer p-3 rounded-lg hover:bg-gray-50 transition-colors">
                <input
                  type="radio"
                  name="status"
                  value="draft"
                  className="text-orange-500 focus:ring-orange-500"
                />
                <div>
                  <p className="text-sm font-medium text-gray-900">Draft</p>
                  <p className="text-xs text-gray-500">
                    Save as draft, not visible to customers
                  </p>
                </div>
              </label>
            </div>
          </div>

          {/* Quick Preview */}
          {previewMode && (
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 animate-fade-in">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Preview
              </h3>
              <div className="space-y-3">
                <div className="aspect-square bg-gray-100 rounded-lg flex items-center justify-center overflow-hidden">
                  {images[0] ? (
                    <img
                      src={images[0]}
                      alt="Product preview"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <ImageIcon className="h-12 w-12 text-gray-400" />
                  )}
                </div>
                <h4 className="font-semibold text-gray-900">
                  {productData.name || "Product Name"}
                </h4>
                <div className="flex items-center gap-2">
                  <p className="text-lg font-bold text-gray-900">
                    ${productData.price || "0.00"}
                  </p>
                  {productData.discount &&
                    parseInt(productData.discount) > 0 && (
                      <span className="text-sm text-green-600 font-medium">
                        {productData.discount}% OFF
                      </span>
                    )}
                </div>
                <p className="text-sm text-gray-600 line-clamp-3">
                  {productData.description ||
                    "Product description will appear here..."}
                </p>
                {productData.sizes && (
                  <div className="flex flex-wrap gap-1">
                    {productData.sizes.split(",").map((size) => (
                      <span
                        key={size.trim()}
                        className="px-2 py-1 bg-gray-100 rounded text-xs text-gray-700"
                      >
                        {size.trim()}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Help Card */}
          <div className="bg-blue-50 rounded-xl p-4">
            <h4 className="text-sm font-semibold text-blue-900 mb-2">
              💡 Tips for creating products
            </h4>
            <ul className="text-xs text-blue-700 space-y-1.5">
              <li>• Use clear, descriptive product names</li>
              <li>• Upload at least 3 high-quality images</li>
              <li>• Set competitive prices based on market research</li>
              <li>• Keep descriptions detailed but concise</li>
              <li>• Add relevant sizes if applicable</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
