import { useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useAdminProductListStore } from "@/lib/store/adminProductStore";
import toast from "react-hot-toast";

export function useAdminProductList() {
  const store = useAdminProductListStore();
  const router = useRouter();

  // Fetch products and categories on mount
  useEffect(() => {
    store.fetchProducts();
    store.loadCategories();
  }, []);

  const handleDelete = useCallback(
    async (id: string) => {
      try {
        await store.deleteProduct(id);
        toast.success("Product deleted successfully");
      } catch (error: any) {
        toast.error(error.message || "Failed to delete product");
      }
    },
    [store],
  );

  const handleBulkDelete = useCallback(async () => {
    try {
      await store.bulkDelete();
      toast.success("Selected products deleted successfully");
    } catch (error: any) {
      toast.error(error.message || "Failed to delete products");
    }
  }, [store]);

  const handleBulkStatusUpdate = useCallback(
    async (status: string) => {
      try {
        await store.bulkUpdateStatus(status);
        toast.success(`Products marked as ${status}`);
      } catch (error: any) {
        toast.error(error.message || "Failed to update products");
      }
    },
    [store],
  );

  const handleNavigateToCreate = useCallback(() => {
    router.push("/admin/products/new");
  }, [router]);

  const handleNavigateToEdit = useCallback(
    (id: string) => {
      router.push(`/admin/products/${id}/edit`);
    },
    [router],
  );

  const handleNavigateToDetails = useCallback(
    (id: string) => {
      router.push(`/admin/products/${id}`);
    },
    [router],
  );

  const handleSelectAll = useCallback(
    (checked: boolean) => {
      if (checked) {
        store.selectAll();
      } else {
        store.clearSelection();
      }
    },
    [store],
  );

  return {
    // State
    products: store.products,
    categories: store.categories,
    isLoading: store.isLoading,
    error: store.error,
    searchTerm: store.searchTerm,
    categoryFilter: store.categoryFilter,
    statusFilter: store.statusFilter,
    selectedProducts: store.selectedProducts,

    // Actions
    setSearchTerm: store.setSearchTerm,
    setCategoryFilter: store.setCategoryFilter,
    setStatusFilter: store.setStatusFilter,
    toggleSelectProduct: store.toggleSelectProduct,
    handleSelectAll,
    clearSelection: store.clearSelection,
    handleDelete,
    handleBulkDelete,
    handleBulkStatusUpdate,
    handleNavigateToCreate,
    handleNavigateToEdit,
    handleNavigateToDetails,
    clearError: store.clearError,
  };
}
