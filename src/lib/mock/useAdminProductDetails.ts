import { useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useAdminProductDetailsStore } from "@/lib/store/adminProductStore";
import toast from "react-hot-toast";

export function useAdminProductDetails(productId: string) {
  const store = useAdminProductDetailsStore();
  const router = useRouter();

  // Fetch product details on mount
  useEffect(() => {
    if (productId) {
      store.fetchProductDetails(productId);
    }

    // Reset selected image on unmount
    return () => {
      store.setSelectedImage(0);
    };
  }, [productId]);

  const handleDelete = useCallback(async () => {
    try {
      await store.deleteProduct();
      toast.success("Product deleted successfully");
      router.push("/admin/products");
    } catch (error: any) {
      toast.error(error.message || "Failed to delete product");
    }
  }, [store, router]);

  const handleImageNavigation = useCallback(
    (direction: "prev" | "next") => {
      const { product, selectedImageIndex } = store;
      if (!product) return;

      if (direction === "prev") {
        store.setSelectedImage(
          selectedImageIndex === 0
            ? product.images.length - 1
            : selectedImageIndex - 1,
        );
      } else {
        store.setSelectedImage(
          selectedImageIndex === product.images.length - 1
            ? 0
            : selectedImageIndex + 1,
        );
      }
    },
    [store],
  );

  const handleNavigateToEdit = useCallback(() => {
    router.push(`/admin/products/${productId}/edit`);
  }, [router, productId]);

  const computedDiscountedPrice = useCallback(() => {
    const product = store.product;
    if (!product) return 0;

    const price = parseFloat(product.price);
    const discount = parseFloat(product.discount || "0");

    return price - (price * discount) / 100;
  }, [store.product]);

  return {
    // State
    product: store.product,
    selectedImageIndex: store.selectedImageIndex,
    isLoading: store.isLoading,
    error: store.error,
    showDeleteModal: store.showDeleteModal,

    // Computed
    discountedPrice: computedDiscountedPrice(),

    // Actions
    setSelectedImage: store.setSelectedImage,
    handleDelete,
    handleImageNavigation,
    handleNavigateToEdit,
    openDeleteModal: store.openDeleteModal,
    closeDeleteModal: store.closeDeleteModal,
    clearError: store.clearError,
    goBack: () => router.back(),
  };
}
