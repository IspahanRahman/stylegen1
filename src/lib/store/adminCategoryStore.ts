import { create } from "zustand";
import {
  adminCategoryAPI,
  type Category,
  type CategoryFormData,
} from "@/lib/mock/adminCategoryApi";

interface CategoryState {
  // Data
  categories: Category[];
  selectedCategory: Category | null;

  // UI State
  isLoading: boolean;
  isSubmitting: boolean;
  isUploading: boolean;
  error: string | null;

  // Modal State
  showAddModal: boolean;
  showEditModal: boolean;
  showDeleteModal: boolean;

  // Form Data
  formData: CategoryFormData;
  selectedImage: string | null;
  imageFile: File | null;

  // Search
  searchTerm: string;

  // Actions
  fetchCategories: () => Promise<void>;
  createCategory: () => Promise<void>;
  updateCategory: () => Promise<void>;
  deleteCategory: () => Promise<void>;

  // UI Actions
  setSearchTerm: (term: string) => void;
  openAddModal: () => void;
  openEditModal: (category: Category) => void;
  openDeleteModal: (category: Category) => void;
  closeModals: () => void;

  // Form Actions
  setFormData: (data: Partial<CategoryFormData>) => void;
  handleImageUpload: (file: File) => Promise<void>;
  removeImage: () => void;
  resetForm: () => void;

  // Utils
  clearError: () => void;
  getFilteredCategories: () => Category[];
}

export const useAdminCategoryStore = create<CategoryState>((set, get) => ({
  // Initial State
  categories: [],
  selectedCategory: null,
  isLoading: false,
  isSubmitting: false,
  isUploading: false,
  error: null,
  showAddModal: false,
  showEditModal: false,
  showDeleteModal: false,
  formData: {
    name: "",
    description: "",
    status: "active",
  },
  selectedImage: null,
  imageFile: null,
  searchTerm: "",

  // Data Actions
  fetchCategories: async () => {
    set({ isLoading: true, error: null });

    try {
      const response = await adminCategoryAPI.getAll();
      set({ categories: response.categories, isLoading: false });
    } catch (error: any) {
      set({ error: error.message, isLoading: false });
    }
  },

  createCategory: async () => {
    const { formData, imageFile } = get();

    set({ isSubmitting: true, error: null });

    try {
      // Validate
      const validation = await adminCategoryAPI.validateData(formData);
      if (!validation.success) {
        throw new Error(Object.values(validation.errors || {}).join(", "));
      }

      // Upload image if exists
      let imageUrl: string | undefined;
      if (imageFile) {
        const uploadResponse = await adminCategoryAPI.uploadImage(imageFile);
        imageUrl = uploadResponse.url;
      }

      // Create category
      const response = await adminCategoryAPI.create(formData, imageUrl);

      set((state) => ({
        categories: [...state.categories, response.category],
        isSubmitting: false,
        showAddModal: false,
      }));

      get().resetForm();
    } catch (error: any) {
      set({ error: error.message, isSubmitting: false });
      throw error;
    }
  },

  updateCategory: async () => {
    const { selectedCategory, formData, imageFile } = get();

    if (!selectedCategory) return;

    set({ isSubmitting: true, error: null });

    try {
      const validation = await adminCategoryAPI.validateData(formData);
      if (!validation.success) {
        throw new Error(Object.values(validation.errors || {}).join(", "));
      }

      let imageUrl: string | undefined;
      if (imageFile) {
        const uploadResponse = await adminCategoryAPI.uploadImage(imageFile);
        imageUrl = uploadResponse.url;
      }

      const response = await adminCategoryAPI.update(
        selectedCategory.id,
        formData,
        imageUrl,
      );

      set((state) => ({
        categories: state.categories.map((c) =>
          c.id === selectedCategory.id ? response.category : c,
        ),
        isSubmitting: false,
        showEditModal: false,
      }));

      get().resetForm();
    } catch (error: any) {
      set({ error: error.message, isSubmitting: false });
      throw error;
    }
  },

  deleteCategory: async () => {
    const { selectedCategory } = get();
    if (!selectedCategory) return;

    set({ isSubmitting: true, error: null });

    try {
      await adminCategoryAPI.delete(selectedCategory.id);

      set((state) => ({
        categories: state.categories.filter(
          (c) => c.id !== selectedCategory.id,
        ),
        isSubmitting: false,
        showDeleteModal: false,
        selectedCategory: null,
      }));
    } catch (error: any) {
      set({ error: error.message, isSubmitting: false });
      throw error;
    }
  },

  // UI Actions
  setSearchTerm: (term) => set({ searchTerm: term }),

  openAddModal: () => {
    get().resetForm();
    set({ showAddModal: true, error: null });
  },

  openEditModal: (category) => {
    set({
      selectedCategory: category,
      formData: {
        name: category.name,
        description: category.description,
        status: category.status,
      },
      selectedImage: category.image,
      showEditModal: true,
      error: null,
    });
  },

  openDeleteModal: (category) => {
    set({
      selectedCategory: category,
      showDeleteModal: true,
      error: null,
    });
  },

  closeModals: () => {
    set({
      showAddModal: false,
      showEditModal: false,
      showDeleteModal: false,
      selectedCategory: null,
    });
    get().resetForm();
  },

  // Form Actions
  setFormData: (data) => {
    set((state) => ({
      formData: { ...state.formData, ...data },
    }));
  },

  handleImageUpload: async (file: File) => {
    set({ isUploading: true });

    // Create preview
    const reader = new FileReader();
    reader.onloadend = () => {
      set({ selectedImage: reader.result as string });
    };
    reader.readAsDataURL(file);

    set({ imageFile: file, isUploading: false });
  },

  removeImage: () => {
    set({ selectedImage: null, imageFile: null });
  },

  resetForm: () => {
    set({
      formData: {
        name: "",
        description: "",
        status: "active",
      },
      selectedImage: null,
      imageFile: null,
      selectedCategory: null,
      error: null,
    });
  },

  // Utils
  clearError: () => set({ error: null }),

  getFilteredCategories: () => {
    const { categories, searchTerm } = get();

    if (!searchTerm.trim()) return categories;

    const term = searchTerm.toLowerCase();
    return categories.filter(
      (cat) =>
        cat.name.toLowerCase().includes(term) ||
        cat.description.toLowerCase().includes(term),
    );
  },
}));
