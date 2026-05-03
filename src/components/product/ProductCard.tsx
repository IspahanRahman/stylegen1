"use client";

import Image from "next/image";
import Link from "next/link";
import { Star, Heart } from "lucide-react";
import { useWishlistStore } from "@/lib/store/wishlistStore";
import { formatCurrency } from "@/lib/utils/formatCurrency";
import AddToCartButton from "./AddToCartButton";

interface ProductCardProps {
  product: {
    id: string;
    name: string;
    price: number;
    discount: number;
    category: string;
    stock: number;
    images: string[];
    rating: number;
    sales: number;
  };
}

export default function ProductCard({ product }: ProductCardProps) {
  const wishlist = useWishlistStore();
  const isInWishlist = wishlist.items.some((i) => i.productId === product.id);

  const toggleWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (isInWishlist) {
      wishlist.remove(product.id);
    } else {
      wishlist.add({
        productId: product.id,
        name: product.name,
        price: product.price,
        image: product.images?.[0] ?? "/images/placeholder.png",
      });
    }
  };
  return (
    <div className="group bg-white rounded-xl shadow-sm border border-gray-100 hover:shadow-lg hover:border-orange-200 transition-all duration-300">
      <Link href={`/products/${product.id}`} className="block">
        {/* Product Image */}
        <div className="aspect-square rounded-t-xl overflow-hidden bg-gray-100 relative">
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
        <div className="p-4">
          <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">
            {product.category}
          </p>
          <h3 className="text-sm font-semibold text-gray-900 mb-2 line-clamp-2 group-hover:text-orange-600 transition-colors">
            {product.name}
          </h3>

          {/* Rating */}
          <div className="flex items-center gap-1 mb-3">
            <Star className="h-4 w-4 text-yellow-400 fill-current" />
            <span className="text-sm text-gray-600">{product.rating}</span>
            <span className="text-xs text-gray-400">
              ({product.sales} sold)
            </span>
          </div>

          {/* Price */}
          <div className="flex items-center justify-between">
            <div>
              {product.discount > 0 ? (
                <div>
                  <span className="text-lg font-bold text-gray-900">
                    {formatCurrency(
                      product.price - (product.price * product.discount) / 100,
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
          </div>
        </div>
      </Link>

      {/* Add to Cart - Outside Link to prevent navigation */}
      <div className="px-4 pb-4 flex items-center gap-3">
        <div className="flex-1">
          <AddToCartButton
            product={product}
            className="w-full"
            variant="outline"
          />
        </div>

        <button
          onClick={toggleWishlist}
          aria-label={isInWishlist ? "Remove from wishlist" : "Add to wishlist"}
          className="p-2 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors"
        >
          <Heart
            className={`h-5 w-5 ${isInWishlist ? "text-red-500" : "text-gray-600"}`}
          />
        </button>
      </div>
    </div>
  );
}
