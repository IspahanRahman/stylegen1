import { products, categories, mockUsers, mockOrders } from "./data";

// Simulate network delay
const delay = (ms: number = 800) =>
  new Promise((resolve) => setTimeout(resolve, ms));

// Product APIs
export const mockProductAPI = {
  getAll: async (filters?: any) => {
    await delay();
    let filteredProducts = [...products];

    if (filters?.category) {
      filteredProducts = filteredProducts.filter(
        (p) => p.category.toLowerCase() === filters.category.toLowerCase(),
      );
    }

    if (filters?.minPrice) {
      filteredProducts = filteredProducts.filter(
        (p) => p.price >= filters.minPrice,
      );
    }

    if (filters?.maxPrice) {
      filteredProducts = filteredProducts.filter(
        (p) => p.price <= filters.maxPrice,
      );
    }

    if (filters?.featured) {
      filteredProducts = filteredProducts.filter((p) => p.featured);
    }

    if (filters?.search) {
      const searchTerm = filters.search.toLowerCase();
      filteredProducts = filteredProducts.filter(
        (p) =>
          p.name.toLowerCase().includes(searchTerm) ||
          p.description.toLowerCase().includes(searchTerm),
      );
    }

    return {
      success: true,
      products: filteredProducts,
      total: filteredProducts.length,
    };
  },

  getById: async (id: string) => {
    await delay(500);
    const product = products.find((p) => p.id === id);

    if (!product) {
      throw new Error("Product not found");
    }

    return {
      success: true,
      product,
    };
  },

  getRelated: async (category: string, excludeId: string) => {
    await delay(600);
    const related = products
      .filter((p) => p.category === category && p.id !== excludeId)
      .slice(0, 4);

    return {
      success: true,
      products: related,
    };
  },
};

// Category APIs
export const mockCategoryAPI = {
  getAll: async () => {
    await delay(500);
    return {
      success: true,
      categories,
    };
  },
};

// Auth APIs
export const mockAuthAPI = {
  login: async (email: string, password: string) => {
    await delay(1000);

    if (email === "admin@stylegen.com" && password === "admin123") {
      return {
        success: true,
        user: mockUsers.admin,
        token: "mock-jwt-token-admin",
      };
    }

    if (email === "jane@example.com" && password === "user123") {
      return {
        success: true,
        user: mockUsers.customer,
        token: "mock-jwt-token-user",
      };
    }

    throw new Error("Invalid credentials");
  },

  register: async (userData: any) => {
    await delay(1000);
    return {
      success: true,
      user: {
        id: "new-user",
        ...userData,
        role: "user",
      },
      token: "mock-jwt-token-new-user",
    };
  },
};

// Order APIs
export const mockOrderAPI = {
  getUserOrders: async (userId: string) => {
    await delay(800);
    return {
      success: true,
      orders: mockOrders.filter((o) => o.userId === userId),
    };
  },

  createOrder: async (orderData: any) => {
    await delay(1200);
    return {
      success: true,
      order: {
        id: `order-${Date.now()}`,
        ...orderData,
        status: "pending",
        createdAt: new Date().toISOString(),
      },
    };
  },
};
