import React from "react";
import { Minus, Plus, Trash2 } from "lucide-react";
import { formatCurrency } from "@/lib/utils/formatCurrency";

type CartItemType = {
  productId: string;
  name: string;
  price: number;
  originalPrice?: number;
  quantity: number;
  size?: string;
  image: string;
  stock: number;
};

type Props = {
  item: CartItemType;
  onRemove: (productId: string, size?: string) => void;
  onUpdateQuantity: (
    productId: string,
    quantity: number,
    size?: string,
  ) => void;
};

export default function CartItem({ item, onRemove, onUpdateQuantity }: Props) {
  return (
    <div className="bg-white rounded-xl p-4 sm:p-6 shadow-sm border border-gray-200">
      <div className="flex gap-4">
        <div className="h-24 w-24 bg-gray-100 rounded-lg flex-shrink-0 flex items-center justify-center">
          {item.image ? (
            <img
              src={item.image}
              alt={item.name}
              className="w-full h-full object-cover"
            />
          ) : (
            <span className="text-gray-400 text-xs">Image</span>
          )}
        </div>

        <div className="flex-1">
          <div className="flex justify-between">
            <div>
              <h3 className="font-semibold text-gray-900">{item.name}</h3>
              {item.size && (
                <p className="text-sm text-gray-500 mt-1">Size: {item.size}</p>
              )}
              <p className="text-lg font-bold text-gray-900 mt-2">
                {formatCurrency(item.price)}
              </p>
              {item.originalPrice && (
                <p className="text-sm text-gray-400 line-through">
                  {formatCurrency(item.originalPrice)}
                </p>
              )}
            </div>

            <button
              onClick={() => onRemove(item.productId, item.size)}
              className="text-gray-400 hover:text-red-500 transition-colors"
            >
              <Trash2 className="h-5 w-5" />
            </button>
          </div>

          <div className="flex items-center gap-3 mt-4">
            <button
              onClick={() =>
                onUpdateQuantity(item.productId, item.quantity - 1, item.size)
              }
              disabled={item.quantity <= 1}
              className="p-1 rounded-lg border border-gray-300 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Minus className="h-4 w-4" />
            </button>
            <span className="w-12 text-center font-medium">
              {item.quantity}
            </span>
            <button
              onClick={() =>
                onUpdateQuantity(item.productId, item.quantity + 1, item.size)
              }
              disabled={item.quantity >= item.stock}
              className="p-1 rounded-lg border border-gray-300 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Plus className="h-4 w-4" />
            </button>
            {item.quantity >= item.stock && (
              <span className="text-xs text-orange-500">Max stock reached</span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
