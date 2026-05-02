import { create } from "zustand";
import {
  adminProductListAPI,
  adminProductCRUDAPI,
  adminProductDetailsAPI,
  type ProductFormData,
  type ProductDetails,
  type ProductListItem,
} from "@/lib/mock/adminProductApi";

// ============ PRODUCT LIST STORE ============
interface ProductListState {
  // Data
  products: ProductListItem[];
  categories: string[];

  // UI State
  isLoading: boolean;
  error: string | null;

  // Filters
  searchTerm: string;
  categoryFilter: string;
  statusFilter: string;

  // Selection
  selectedProducts: string[];

  // Actions
  fetchProducts: () => Promise<void>;
  loadCategories: () => Promise<void>;
  deleteProduct: (id: string) => Promise<void>;
  bulkDelete: () => Promise<void>;
  bulkUpdateStatus: (status: string) => Promise<void>;
  setSearchTerm: (term: string) => void;
  setCategoryFilter: (category: string) => void;
  setStatusFilter: (status: string) => void;
  toggleSelectProduct: (id: string) => void;
  selectAll: () => void;
  clearSelection: () => void;
  clearError: () => void;
}

export const useAdminProductListStore = create<ProductListState>(
  (set, get) => ({
    products: [],
    categories: [],
    isLoading: false,
    error: null,
    searchTerm: "",
    categoryFilter: "all",
    statusFilter: "all",
    selectedProducts: [],

    fetchProducts: async () => {
      set({ isLoading: true, error: null });

      try {
        const { searchTerm, categoryFilter, statusFilter } = get();
        const response = await adminProductListAPI.getAll({
          search: searchTerm,
          category: categoryFilter,
          status: statusFilter,
        });

        set({ products: response.products, isLoading: false });
      } catch (error: any) {
        set({ error: error.message, isLoading: false });
      }
    },

    loadCategories: async () => {
      try {
        const response = await adminProductListAPI.getCategories();
        set({ categories: response.categories });
      } catch (error: any) {
        console.error("Failed to load categories:", error);
      }
    },

    deleteProduct: async (id: string) => {
      try {
        await adminProductListAPI.delete(id);
        set((state) => ({
          products: state.products.filter((p) => p.id !== id),
          selectedProducts: state.selectedProducts.filter((sid) => sid !== id),
        }));
      } catch (error: any) {
        set({ error: error.message });
        throw error;
      }
    },

    bulkDelete: async () => {
      const ids = get().selectedProducts;
      if (ids.length === 0) return;

      try {
        await adminProductListAPI.bulkDelete(ids);
        set((state) => ({
          products: state.products.filter((p) => !ids.includes(p.id)),
          selectedProducts: [],
        }));
      } catch (error: any) {
        set({ error: error.message });
        throw error;
      }
    },

    bulkUpdateStatus: async (status: string) => {
      const ids = get().selectedProducts;
      if (ids.length === 0) return;

      try {
        await adminProductListAPI.bulkUpdateStatus(ids, status);
        set((state) => ({
          products: state.products.map((p) =>
            ids.includes(p.id)
              ? { ...p, status: status as ProductListItem["status"] }
              : p,
          ),
          selectedProducts: [],
        }));
      } catch (error: any) {
        set({ error: error.message });
        throw error;
      }
    },

    setSearchTerm: (term) => {
      set({ searchTerm: term });
      get().fetchProducts();
    },

    setCategoryFilter: (category) => {
      set({ categoryFilter: category });
      get().fetchProducts();
    },

    setStatusFilter: (status) => {
      set({ statusFilter: status });
      get().fetchProducts();
    },

    toggleSelectProduct: (id) => {
      set((state) => ({
        selectedProducts: state.selectedProducts.includes(id)
          ? state.selectedProducts.filter((sid) => sid !== id)
          : [...state.selectedProducts, id],
      }));
    },

    selectAll: () => {
      set((state) => ({
        selectedProducts: state.products.map((p) => p.id),
      }));
    },

    clearSelection: () => set({ selectedProducts: [] }),

    clearError: () => set({ error: null }),
  }),
);

// ============ PRODUCT FORM STORE (Create & Edit) ============
interface ProductFormState {
  // Mode
  mode: "create" | "edit";
  productId: string | null;

  // Data
  productDetails: ProductDetails | null;
  images: string[];
  categories: string[];

  // UI State
  isLoading: boolean;
  isSubmitting: boolean;
  isUploading: boolean;
  error: string | null;

  // Create-specific
  previewMode: boolean;

  // Edit-specific
  activeTab: "basic" | "images" | "advanced";

  // Advanced settings
  productStatus: "active" | "draft" | "inactive";
  featured: boolean;
  seoTitle: string;
  metaDescription: string;
  tags: string;

  // Mode Management
  setMode: (mode: "create" | "edit", productId?: string) => void;
  resetForm: () => void;

  // Data Operations
  fetchProduct: (id: string) => Promise<void>;
  loadCategories: () => Promise<void>;
  saveProduct: (data: ProductFormData) => Promise<string | void>;

  // Image Operations
  addImages: (files: FileList) => Promise<void>;
  removeImage: (index: number) => void;

  // UI Actions
  setPreviewMode: (mode: boolean) => void;
  setActiveTab: (tab: "basic" | "images" | "advanced") => void;
  setProductStatus: (status: "active" | "draft" | "inactive") => void;
  setFeatured: (featured: boolean) => void;
  setSeoTitle: (title: string) => void;
  setMetaDescription: (desc: string) => void;
  setTags: (tags: string) => void;
  clearError: () => void;
  validateBeforeSubmit: (data: ProductFormData) => Promise<boolean>;
}

export const useAdminProductFormStore = create<ProductFormState>(
  (set, get) => ({
    mode: "create",
    productId: null,
    productDetails: null,
    images: [],
    categories: [],
    isLoading: false,
    isSubmitting: false,
    isUploading: false,
    error: null,
    previewMode: false,
    activeTab: "basic",
    productStatus: "active",
    featured: false,
    seoTitle: "",
    metaDescription: "",
    tags: "",

    // Mode Management
    setMode: (mode, productId) => {
      const prevImages = get().images;
      // Clean up previous object URLs
      prevImages.forEach((url) => {
        if (url.startsWith("blob:")) URL.revokeObjectURL(url);
      });

      set({
        mode,
        productId: productId || null,
        productDetails: null,
        images: [],
        error: null,
        previewMode: false,
        activeTab: "basic",
        productStatus: "active",
        featured: false,
        seoTitle: "",
        metaDescription: "",
        tags: "",
      });
    },

    resetForm: () => {
      const images = get().images;
      images.forEach((url) => {
        if (url.startsWith("blob:")) URL.revokeObjectURL(url);
      });

      set({
        productDetails: null,
        images: [],
        error: null,
        previewMode: false,
        activeTab: "basic",
        productStatus: "active",
        featured: false,
        seoTitle: "",
        metaDescription: "",
        tags: "",
      });
    },

    // Data Operations
    fetchProduct: async (id: string) => {
      set({ isLoading: true, error: null });

      try {
        const response = await adminProductCRUDAPI.getById(id);
        const product = response.product;

        set({
          productDetails: product,
          images: product.images,
          productStatus: product.status,
          featured: product.featured,
          seoTitle: product.seoTitle,
          metaDescription: product.metaDescription,
          tags: product.tags,
          isLoading: false,
        });
      } catch (error: any) {
        set({ error: error.message, isLoading: false });
      }
    },

    loadCategories: async () => {
      try {
        const response = await adminProductListAPI.getCategories();
        set({ categories: response.categories });
      } catch (error: any) {
        console.error("Failed to load categories:", error);
      }
    },

    saveProduct: async (data: ProductFormData) => {
      set({ isSubmitting: true, error: null });

      try {
        const { mode, productId, images } = get();

        if (mode === "create") {
          const response = await adminProductCRUDAPI.create(data, images);
          set({ isSubmitting: false, productId: response.product.id });
          return response.product.id;
        } else if (mode === "edit" && productId) {
          await adminProductCRUDAPI.update(productId, data, images);
          set({ isSubmitting: false });
        }
      } catch (error: any) {
        set({ error: error.message, isSubmitting: false });
        throw error;
      }
    },

    // Image Operations
    addImages: async (files: FileList) => {
      set({ isUploading: true, error: null });

      try {
        const fileArray = Array.from(files);

        // Validate
        const invalidFiles = fileArray.filter(
          (file) =>
            !file.type.startsWith("image/") || file.size > 5 * 1024 * 1024,
        );

        if (invalidFiles.length > 0) {
          throw new Error("Please upload only images under 5MB");
        }

        // Simulate upload and get persistent mock URLs
        const uploadResponse =
          await adminProductCRUDAPI.uploadImages(fileArray);
        const newImages = uploadResponse.urls;

        set((state) => ({
          images: [...state.images, ...newImages],
          isUploading: false,
        }));
      } catch (error: any) {
        set({ error: error.message, isUploading: false });
      }
    },

    removeImage: (index: number) => {
      set((state) => {
        const imageToRemove = state.images[index];
        if (imageToRemove?.startsWith("blob:")) {
          URL.revokeObjectURL(imageToRemove);
        }
        return {
          images: state.images.filter((_, i) => i !== index),
        };
      });
    },

    // UI Actions
    setPreviewMode: (mode) => set({ previewMode: mode }),
    setActiveTab: (tab) => set({ activeTab: tab }),
    setProductStatus: (status) => set({ productStatus: status }),
    setFeatured: (featured) => set({ featured }),
    setSeoTitle: (title) => set({ seoTitle: title }),
    setMetaDescription: (desc) => set({ metaDescription: desc }),
    setTags: (tags) => set({ tags }),
    clearError: () => set({ error: null }),

    // Validation
    validateBeforeSubmit: async (data: ProductFormData): Promise<boolean> => {
      const validation = await adminProductCRUDAPI.validateData(data);

      if (!validation.success) {
        set({ error: Object.values(validation.errors || {}).join(", ") });
        return false;
      }

      if (get().images.length === 0) {
        set({ error: "Please upload at least one product image" });
        return false;
      }

      return true;
    },
  }),
);

interface ProductDetailsExtended extends ProductDetails {
  views: number;
  features: string[];
  specifications: Record<string, string>;
  salesHistory: Array<{ month: string; sales: number; revenue: number }>;
  recentOrders: Array<{
    id: string;
    customer: string;
    date: string;
    quantity: number;
    total: number;
  }>;
}

interface ProductDetailsState {
  // Data
  product: ProductDetailsExtended | null;
  selectedImageIndex: number;

  // UI State
  isLoading: boolean;
  error: string | null;
  showDeleteModal: boolean;

  // Actions
  fetchProductDetails: (id: string) => Promise<void>;
  setSelectedImage: (index: number) => void;
  deleteProduct: () => Promise<void>;
  openDeleteModal: () => void;
  closeDeleteModal: () => void;
  clearError: () => void;
}

export const useAdminProductDetailsStore = create<ProductDetailsState>(
  (set, get) => ({
    product: null,
    selectedImageIndex: 0,
    isLoading: false,
    error: null,
    showDeleteModal: false,

    fetchProductDetails: async (id: string) => {
      set({ isLoading: true, error: null });

      try {
        const response = await adminProductDetailsAPI.getDetails(id);
        set({ product: response.product, isLoading: false });
      } catch (error: any) {
        set({ error: error.message, isLoading: false });
      }
    },

    setSelectedImage: (index) => set({ selectedImageIndex: index }),

    deleteProduct: async () => {
      const { product } = get();
      if (!product) return;

      try {
        await adminProductCRUDAPI.delete(product.id);
        set({ showDeleteModal: false });
        return;
      } catch (error: any) {
        set({ error: error.message });
        throw error;
      }
    },

    openDeleteModal: () => set({ showDeleteModal: true }),
    closeDeleteModal: () => set({ showDeleteModal: false }),
    clearError: () => set({ error: null }),
  }),
);
