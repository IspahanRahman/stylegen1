import { useEffect, useCallback } from "react";
import { useAdminCategoryStore } from "@/lib/store/adminCategoryStore";
import toast from "react-hot-toast";

export function useAdminCategories() {
  const store = useAdminCategoryStore();

  // Fetch categories on mount
  useEffect(() => {
    store.fetchCategories();
  }, []);

  const handleCreateCategory = useCallback(async () => {
    try {
      await store.createCategory();
      toast.success("Category created successfully!");
    } catch (error: any) {
      toast.error(error.message || "Failed to create category");
    }
  }, [store]);

  const handleUpdateCategory = useCallback(async () => {
    try {
      await store.updateCategory();
      toast.success("Category updated successfully!");
    } catch (error: any) {
      toast.error(error.message || "Failed to update category");
    }
  }, [store]);

  const handleDeleteCategory = useCallback(async () => {
    try {
      await store.deleteCategory();
      toast.success("Category deleted successfully!");
    } catch (error: any) {
      toast.error(error.message || "Failed to delete category");
      store.closeModals();
    }
  }, [store]);

  const handleImageUpload = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) {
        // Validate file
        if (!file.type.startsWith("image/")) {
          toast.error("Please upload an image file");
          return;
        }
        if (file.size > 5 * 1024 * 1024) {
          toast.error("Image must be less than 5MB");
          return;
        }
        store.handleImageUpload(file);
      }
    },
    [store],
  );

  return {
    // State
    categories: store.categories,
    filteredCategories: store.getFilteredCategories(),
    selectedCategory: store.selectedCategory,
    isLoading: store.isLoading,
    isSubmitting: store.isSubmitting,
    isUploading: store.isUploading,
    error: store.error,
    searchTerm: store.searchTerm,
    formData: store.formData,
    selectedImage: store.selectedImage,
    showAddModal: store.showAddModal,
    showEditModal: store.showEditModal,
    showDeleteModal: store.showDeleteModal,

    // Actions
    setSearchTerm: store.setSearchTerm,
    openAddModal: store.openAddModal,
    openEditModal: store.openEditModal,
    openDeleteModal: store.openDeleteModal,
    closeModals: store.closeModals,
    setFormData: store.setFormData,
    handleImageUpload,
    removeImage: store.removeImage,
    handleCreateCategory,
    handleUpdateCategory,
    handleDeleteCategory,
    clearError: store.clearError,
    resetForm: store.resetForm,
  };
}
