import Image from "next/image";
import Link from "next/link";
import { mockProductAPI } from "@/lib/mock/api";
import { formatCurrency } from "@/lib/utils/formatCurrency";

type Props = {
  params: {
    slug: string;
  };
};

export default async function CategoryPage({ params }: Props) {
  const slug = params?.slug ?? "";
  const displayName = slug ? slug.replace(/-/g, " ") : "Category";
  const resp = await mockProductAPI.getAll({ category: slug });
  const products = resp.products || [];

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 capitalize">
              {displayName}
            </h1>
            <p className="text-gray-600 mt-1">
              Browse products in the {displayName} category.
            </p>
          </div>
          <Link href="/products" className="text-sm text-orange-500">
            View all products
          </Link>
        </div>

        {products.length === 0 ? (
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 text-center">
            <p className="text-gray-600">No products found in this category.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {products.map((p: any) => (
              <Link
                key={p.id}
                href={`/products/${p.id}`}
                className="block bg-white rounded-xl p-4 shadow-sm border border-gray-100 hover:shadow-md"
              >
                <div className="aspect-square rounded-md overflow-hidden mb-3 bg-gray-100">
                  <Image
                    src={p.images?.[0] ?? "/images/placeholder.png"}
                    alt={p.name}
                    width={400}
                    height={400}
                    className="object-cover w-full h-full"
                  />
                </div>
                <h3 className="text-sm font-medium text-gray-900 mb-1">
                  {p.name}
                </h3>
                <p className="text-sm text-gray-500 mb-3">{p.category}</p>
                <div className="flex items-center justify-between">
                  <div className="text-lg font-semibold text-gray-900">
                    {formatCurrency(p.price)}
                  </div>
                  <div className="text-xs text-gray-500">{p.rating} ★</div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
