"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useAdminProductListStore } from "@/lib/store/adminProductStore";
import { formatCurrency } from "@/lib/utils/formatCurrency";

export default function Home() {
  // Use the EXISTING store that admin already uses
  const { products, isLoading, error, fetchProducts } =
    useAdminProductListStore();

  // Fetch products on mount using the existing store
  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  // Filter only active products for featured section
  const featuredProducts = products
    .filter((p) => p.status === "active" && p.stock > 0)
    .slice(0, 4);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Hero Section */}
        <section className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center mb-16">
          <div>
            <span className="text-orange-500 font-semibold text-sm uppercase tracking-wider">
              Premium Collection
            </span>
            <h1 className="text-4xl sm:text-5xl font-extrabold text-gray-900 mt-2 mb-4">
              StyleGen — Curated Leather Goods
            </h1>
            <p className="text-lg text-gray-600 mb-6">
              Handcrafted premium leather products designed to last. Explore our
              curated selection and find your next statement piece.
            </p>

            <div className="flex flex-wrap gap-3">
              <Link
                href="/products"
                className="inline-flex items-center gap-2 bg-orange-500 text-white px-6 py-3 rounded-lg font-medium hover:bg-orange-600 transition-colors shadow-lg shadow-orange-500/25"
              >
                Shop Now
                <svg
                  className="w-4 h-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17 8l4 4m0 0l-4 4m4-4H3"
                  />
                </svg>
              </Link>
              <Link
                href="/products"
                className="inline-flex items-center gap-2 border border-gray-300 px-6 py-3 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
              >
                Browse Collection
              </Link>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-6 mt-8 pt-8 border-t border-gray-200">
              <div>
                <p className="text-2xl font-bold text-gray-900">
                  {products.length}+
                </p>
                <p className="text-sm text-gray-500">Products</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">4.8</p>
                <p className="text-sm text-gray-500">Avg Rating</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">5K+</p>
                <p className="text-sm text-gray-500">Happy Customers</p>
              </div>
            </div>
          </div>

          {/* Hero Images */}
          <div className="hidden lg:block">
            <div className="grid grid-cols-2 gap-4">
              <div className="rounded-2xl overflow-hidden bg-white shadow-lg">
                <Image
                  src="/images/hero/hero-1.avif"
                  alt="Premium Leather Bag"
                  width={560}
                  height={360}
                  className="object-cover w-full h-full hover:scale-105 transition-transform duration-500"
                />
              </div>
              <div className="rounded-2xl overflow-hidden bg-white shadow-lg mt-8">
                <Image
                  src="/images/hero/hero-2.avif"
                  alt="Leather Accessories"
                  width={560}
                  height={360}
                  className="object-cover w-full h-full hover:scale-105 transition-transform duration-500"
                />
              </div>
            </div>
          </div>
        </section>

        {/* Featured Products */}
        <section>
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">
                Featured Picks
              </h2>
              <p className="text-sm text-gray-500 mt-1">
                Handpicked favorites from our collection
              </p>
            </div>
            <Link
              href="/products"
              className="text-sm text-orange-500 hover:text-orange-600 font-medium inline-flex items-center gap-1 group"
            >
              View all products
              <svg
                className="w-4 h-4 group-hover:translate-x-1 transition-transform"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </Link>
          </div>

          {/* Loading State */}
          {isLoading && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {[...Array(4)].map((_, i) => (
                <div
                  key={i}
                  className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 animate-pulse"
                >
                  <div className="aspect-square bg-gray-200 rounded-lg mb-4" />
                  <div className="h-4 bg-gray-200 rounded w-3/4 mb-2" />
                  <div className="h-3 bg-gray-200 rounded w-1/2 mb-3" />
                  <div className="flex justify-between">
                    <div className="h-5 bg-gray-200 rounded w-1/3" />
                    <div className="h-5 bg-gray-200 rounded w-1/4" />
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Error State */}
          {error && !isLoading && (
            <div className="text-center py-12 bg-white rounded-xl border border-red-200">
              <div className="text-red-500 mb-3">
                <svg
                  className="w-12 h-12 mx-auto"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                  />
                </svg>
              </div>
              <p className="text-red-600 font-medium mb-2">
                Failed to load products
              </p>
              <p className="text-red-500 text-sm mb-4">{error}</p>
              <button
                onClick={() => window.location.reload()}
                className="px-4 py-2 bg-red-500 text-white rounded-lg text-sm hover:bg-red-600 transition-colors"
              >
                Try Again
              </button>
            </div>
          )}

          {/* Empty State */}
          {!isLoading && !error && featuredProducts.length === 0 && (
            <div className="text-center py-12 bg-white rounded-xl border">
              <div className="text-gray-400 mb-3">
                <svg
                  className="w-12 h-12 mx-auto"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
                  />
                </svg>
              </div>
              <p className="text-gray-500 font-medium">No products available</p>
              <p className="text-gray-400 text-sm mt-1">
                Check back soon for new arrivals
              </p>
            </div>
          )}

          {/* Products Grid */}
          {!isLoading && !error && featuredProducts.length > 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {featuredProducts.map((product) => (
                <Link
                  key={product.id}
                  href={`/products/${product.id}`}
                  className="group block bg-white rounded-xl p-4 shadow-sm border border-gray-100 hover:shadow-lg hover:border-orange-200 transition-all duration-300"
                >
                  {/* Product Image */}
                  <div className="aspect-square rounded-lg overflow-hidden mb-4 bg-gray-100 relative">
                    <Image
                      src={product.images?.[0] ?? "/images/placeholder.png"}
                      alt={product.name}
                      width={400}
                      height={400}
                      className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-500"
                    />

                    {/* Discount Badge */}
                    {product.discount > 0 && (
                      <span className="absolute top-2 left-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                        -{product.discount}%
                      </span>
                    )}

                    {/* Out of Stock Overlay */}
                    {product.stock === 0 && (
                      <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                        <span className="text-white font-semibold text-sm bg-black/70 px-3 py-1 rounded-full">
                          Out of Stock
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Product Info */}
                  <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">
                    {product.category}
                  </p>
                  <h3 className="text-sm font-semibold text-gray-900 mb-2 line-clamp-2 group-hover:text-orange-600 transition-colors">
                    {product.name}
                  </h3>

                  {/* Price & Rating */}
                  <div className="flex items-center justify-between mt-auto">
                    <div>
                      {product.discount > 0 ? (
                        <div>
                          <span className="text-lg font-bold text-gray-900">
                            {formatCurrency(
                              product.price -
                                (product.price * product.discount) / 100,
                            )}
                          </span>
                          <span className="text-xs text-gray-400 line-through ml-2">
                            {formatCurrency(product.price)}
                          </span>
                        </div>
                      ) : (
                        <span className="text-lg font-bold text-gray-900">
                          {formatCurrency(product.price)}
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-1">
                      <svg
                        className="w-4 h-4 text-yellow-400 fill-current"
                        viewBox="0 0 20 20"
                      >
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                      <span className="text-sm text-gray-600">
                        {product.rating}
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
