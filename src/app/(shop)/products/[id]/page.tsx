'use client';

import React from 'react';
import Image from 'next/image';
import { useParams } from 'next/navigation';
import { useAdminProductDetails } from '@/hooks/useAdminProductDetails';
import AddToCartButton from '@/components/product/AddToCartButton';
import { formatCurrency } from '@/lib/utils/formatCurrency';

export default function ProductDetailPage() {
  const params = useParams();
  const id = params?.id as string;

  const {
    product,
    selectedImageIndex,
    isLoading,
    error,
    discountedPrice,
    handleImageNavigation,
    setSelectedImage,
    goBack,
  } = useAdminProductDetails(id);

  if (isLoading)
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-6">
          <div className="h-6 w-24 bg-gray-200 rounded animate-pulse" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-4">
            <div className="bg-white rounded-xl p-6 shadow-sm">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-start">
                <div className="md:col-span-2">
                  <div className="aspect-[4/3] bg-gray-200 rounded-lg animate-pulse" />

                  <div className="mt-4 flex gap-3">
                    <div className="w-20 h-20 bg-gray-200 rounded animate-pulse" />
                    <div className="w-20 h-20 bg-gray-200 rounded animate-pulse" />
                    <div className="w-20 h-20 bg-gray-200 rounded animate-pulse" />
                  </div>
                </div>

                <div className="md:col-span-1">
                  <div className="h-6 bg-gray-200 rounded w-3/4 animate-pulse mb-3" />
                  <div className="h-4 bg-gray-200 rounded w-1/2 animate-pulse mb-4" />
                  <div className="h-8 bg-gray-200 rounded w-full animate-pulse mb-2" />
                  <div className="h-8 bg-gray-200 rounded w-full animate-pulse" />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-sm">
              <div className="h-4 bg-gray-200 rounded w-1/3 animate-pulse mb-3" />
              <div className="space-y-2">
                <div className="h-3 bg-gray-200 rounded animate-pulse" />
                <div className="h-3 bg-gray-200 rounded animate-pulse" />
                <div className="h-3 bg-gray-200 rounded animate-pulse" />
              </div>
            </div>
          </div>

          <aside className="space-y-4">
            <div className="bg-white rounded-xl p-6 shadow-sm">
              <div className="h-4 bg-gray-200 rounded w-1/2 animate-pulse mb-3" />
              <div className="h-3 bg-gray-200 rounded animate-pulse" />
            </div>

            <div className="bg-white rounded-xl p-6 shadow-sm">
              <div className="h-4 bg-gray-200 rounded w-1/2 animate-pulse mb-3" />
              <div className="h-3 bg-gray-200 rounded animate-pulse" />
            </div>
          </aside>
        </div>
      </div>
    );
  if (error) return <div className="p-8 text-red-600">{error}</div>;
  if (!product) return <div className="p-8">Product not found</div>;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-6">
        <button onClick={goBack} className="text-sm text-gray-600 hover:underline">
          ← Back
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-4">
          <div className="bg-white rounded-xl p-6 shadow-sm">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-start">
              <div className="md:col-span-2">
                <div className="aspect-[4/3] bg-gray-100 rounded-lg overflow-hidden">
                  <Image
                    src={product.images[selectedImageIndex] ?? '/images/placeholder.png'}
                    alt={product.name}
                    width={1200}
                    height={900}
                    className="object-cover w-full h-full"
                  />
                </div>

                <div className="mt-4 flex gap-3">
                  <button
                    onClick={() => handleImageNavigation('prev')}
                    className="px-3 py-2 bg-gray-100 rounded"
                  >
                    Prev
                  </button>
                  {product.images.map((img, i) => (
                    <button
                      key={i}
                      onClick={() => setSelectedImage(i)}
                      className={`w-20 h-20 rounded overflow-hidden border ${i === selectedImageIndex ? 'border-orange-500' : 'border-gray-200'}`}
                    >
                      <Image
                        src={img}
                        alt={`${product.name} ${i + 1}`}
                        width={80}
                        height={80}
                        className="object-cover w-full h-full"
                      />
                    </button>
                  ))}
                  <button
                    onClick={() => handleImageNavigation('next')}
                    className="px-3 py-2 bg-gray-100 rounded"
                  >
                    Next
                  </button>
                </div>
              </div>

              <div className="md:col-span-1">
                <h1 className="text-2xl font-semibold text-gray-900">{product.name}</h1>
                <p className="text-sm text-gray-500 mt-1">{product.category}</p>

                <div className="mt-4">
                  <div className="flex items-baseline gap-3">
                    <span className="text-2xl font-bold text-gray-900">
                      {formatCurrency(discountedPrice)}
                    </span>
                    {parseFloat(product.discount || '0') > 0 && (
                      <span className="text-sm text-gray-400 line-through">
                        {formatCurrency(parseFloat(product.price))}
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-gray-500 mt-1">Stock: {product.stock}</p>
                </div>

                <div className="mt-6">
                  <AddToCartButton
                    product={{
                      id: product.id,
                      name: product.name,
                      price: parseFloat(product.price),
                      discount: parseFloat(product.discount || '0'),
                      category: product.category,
                      stock: parseInt(product.stock || '0'),
                      images: product.images,
                      rating: product.rating || 0,
                      sales: product.sales || 0,
                    }}
                    className="w-full"
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm">
            <h2 className="text-lg font-semibold mb-2">Description</h2>
            <p className="text-sm text-gray-700">{product.description}</p>

            {product.sizes && (
              <div className="mt-4">
                <h3 className="text-sm font-medium">Available sizes</h3>
                <p className="text-sm text-gray-600">{product.sizes}</p>
              </div>
            )}
          </div>
        </div>

        <aside className="space-y-4">
          <div className="bg-white rounded-xl p-6 shadow-sm">
            <h3 className="text-sm font-medium text-gray-900">Product Details</h3>
            <ul className="mt-3 text-sm text-gray-600 space-y-1">
              <li>Category: {product.category}</li>
              <li>SKU: {product.id}</li>
              <li>Reviews: {product.reviews ?? 0}</li>
            </ul>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm">
            <h3 className="text-sm font-medium text-gray-900">Shipping</h3>
            <p className="text-sm text-gray-600 mt-2">
              Free shipping on orders over $50. Estimated delivery in 2-5 business days.
            </p>
          </div>
        </aside>
      </div>
    </div>
  );
}
