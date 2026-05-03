// Simulate network delay
const delay = (ms: number = 800) =>
  new Promise((resolve) => setTimeout(resolve, ms));

export interface Category {
  id: string;
  name: string;
  description: string;
  image: string;
  productCount: number;
  status: "active" | "inactive";
  createdAt: string;
}

export interface CategoryFormData {
  name: string;
  description: string;
  status: "active" | "inactive";
}

const mockCategories: Category[] = [
  {
    id: "1",
    name: "Shoes",
    description: "Handcrafted leather footwear for every occasion",
    image: "/images/categories/shoes-1.jpeg",
    productCount: 45,
    status: "active",
    createdAt: "2024-01-01",
  },
  {
    id: "2",
    name: "Wallet",
    description: "Slim and classic leather wallets with RFID protection",
    image: "/images/categories/wallet-1.jpeg",
    productCount: 30,
    status: "active",
    createdAt: "2024-01-05",
  },
  {
    id: "3",
    name: "Belt",
    description: "Premium full-grain leather belts with brass buckles",
    image: "/images/categories/belt-1.jpeg",
    productCount: 25,
    status: "active",
    createdAt: "2024-01-10",
  },
  {
    id: "4",
    name: "Bags",
    description: "Luxury leather bags for travel and daily use",
    image: "/images/categories/bag1.jpeg",
    productCount: 35,
    status: "active",
    createdAt: "2024-01-15",
  },
  {
    id: "5",
    name: "T-Shirts",
    description: "Premium leather apparel with modern designs",
    image: "/images/categories/tshirt-1.webp",
    productCount: 20,
    status: "active",
    createdAt: "2024-01-20",
  },
  {
    id: "6",
    name: "Accessories",
    description: "Leather accessories and small goods",
    image: "/images/categories/accessories-1.jpeg",
    productCount: 0,
    status: "inactive",
    createdAt: "2024-02-01",
  },
];

export const adminCategoryAPI = {
  getAll: async (): Promise<{ success: boolean; categories: Category[] }> => {
    await delay(800);
    return {
      success: true,
      categories: [...mockCategories],
    };
  },

  getById: async (
    id: string,
  ): Promise<{ success: boolean; category: Category }> => {
    await delay(500);
    const category = mockCategories.find((c) => c.id === id);
    if (!category) throw new Error("Category not found");
    return { success: true, category };
  },

  create: async (
    data: CategoryFormData,
    imageUrl?: string,
  ): Promise<{ success: boolean; category: Category }> => {
    await delay(1000);

    if (!data.name || !data.description) {
      throw new Error("Name and description are required");
    }

    const newCategory: Category = {
      id: `cat-${Date.now()}`,
      name: data.name,
      description: data.description,
      image: imageUrl || "/images/categories/default.jpg",
      productCount: 0,
      status: data.status,
      createdAt: new Date().toISOString().split("T")[0],
    };

    mockCategories.push(newCategory);

    return {
      success: true,
      category: newCategory,
    };
  },

  update: async (
    id: string,
    data: CategoryFormData,
    imageUrl?: string,
  ): Promise<{ success: boolean; category: Category }> => {
    await delay(1000);

    const index = mockCategories.findIndex((c) => c.id === id);
    if (index === -1) throw new Error("Category not found");

    mockCategories[index] = {
      ...mockCategories[index],
      name: data.name,
      description: data.description,
      status: data.status,
      image: imageUrl || mockCategories[index].image,
    };

    return {
      success: true,
      category: mockCategories[index],
    };
  },

  delete: async (id: string): Promise<{ success: boolean }> => {
    await delay(800);

    const category = mockCategories.find((c) => c.id === id);
    if (!category) throw new Error("Category not found");

    if (category.productCount > 0) {
      throw new Error(
        `Cannot delete category with ${category.productCount} products`,
      );
    }

    const index = mockCategories.findIndex((c) => c.id === id);
    mockCategories.splice(index, 1);

    return { success: true };
  },

  uploadImage: async (
    file: File,
  ): Promise<{ success: boolean; url: string }> => {
    await delay(1000);

    // In production, upload to cloud storage
    const url = URL.createObjectURL(file);

    return {
      success: true,
      url,
    };
  },

  validateData: async (
    data: CategoryFormData,
  ): Promise<{ success: boolean; errors?: Record<string, string> }> => {
    await delay(300);

    const errors: Record<string, string> = {};

    if (!data.name || data.name.trim().length < 2) {
      errors.name = "Category name must be at least 2 characters";
    }

    if (!data.description || data.description.trim().length < 10) {
      errors.description = "Description must be at least 10 characters";
    }

    return {
      success: Object.keys(errors).length === 0,
      errors: Object.keys(errors).length > 0 ? errors : undefined,
    };
  },
};
