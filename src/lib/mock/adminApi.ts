// Simulate network delay
const delay = (ms: number = 800) =>
  new Promise((resolve) => setTimeout(resolve, ms));

// Analytics Types
export interface AnalyticsData {
  revenue: {
    total: number;
    growth: number;
    monthly: number[];
  };
  orders: {
    total: number;
    growth: number;
    monthly: number[];
  };
  customers: {
    total: number;
    growth: number;
    monthly: number[];
  };
  topProducts: Array<{
    name: string;
    sales: number;
    revenue: number;
    image?: string;
  }>;
  topCategories: Array<{
    name: string;
    sales: number;
    revenue: number;
  }>;
}

// Product Types
export interface ProductFormData {
  name: string;
  price: string;
  discount: string;
  category: string;
  stock: string;
  description: string;
  sizes: string;
}

export interface ProductResponse {
  success: boolean;
  message: string;
  product?: Product & {
    id: string;
    images: string[];
    status: string;
    createdAt: string;
  };
}

interface Product extends ProductFormData {}

// Mock Analytics Data
const mockAnalyticsData: AnalyticsData = {
  revenue: {
    total: 456789,
    growth: 12.5,
    monthly: [
      35000, 42000, 38000, 45000, 52000, 48000, 56000, 51000, 49000, 53000,
      58000, 62000,
    ],
  },
  orders: {
    total: 1245,
    growth: 8.3,
    monthly: [95, 110, 105, 120, 135, 125, 145, 140, 130, 150, 160, 170],
  },
  customers: {
    total: 890,
    growth: 15.2,
    monthly: [65, 72, 68, 75, 82, 78, 85, 80, 76, 90, 95, 100],
  },
  topProducts: [
    { name: "Italian Leather Bag", sales: 156, revenue: 46799 },
    { name: "Slim Leather Wallet", sales: 567, revenue: 45356 },
    { name: "Oxford Shoes", sales: 234, revenue: 44459 },
    { name: "Leather Belt", sales: 189, revenue: 11339 },
  ],
  topCategories: [
    { name: "Bags", sales: 345, revenue: 103456 },
    { name: "Wallet", sales: 678, revenue: 54234 },
    { name: "Shoes", sales: 456, revenue: 86678 },
    { name: "Belt", sales: 234, revenue: 14039 },
  ],
};

// Analytics API
export const adminAnalyticsAPI = {
  getAnalytics: async (
    timeRange: string = "monthly",
  ): Promise<{
    success: boolean;
    data: AnalyticsData;
    timestamp: string;
  }> => {
    await delay(1000);

    // Simulate different data based on time range
    const data = { ...mockAnalyticsData };

    if (timeRange === "weekly") {
      data.revenue.total = 125000;
      data.orders.total = 312;
      data.customers.total = 220;

      // Weekly arrays (7 values)
      data.revenue.monthly = [18000, 22000, 20000, 24000, 26000, 23000, 21000];
      data.orders.monthly = [20, 40, 35, 50, 55, 45, 30];
      data.customers.monthly = [15, 22, 18, 25, 28, 20, 12];
    } else if (timeRange === "yearly") {
      data.revenue.total = 1250000;
      data.orders.total = 15000;
      data.customers.total = 5000;

      // Yearly arrays - keep 12 months but scaled to yearly view
      data.revenue.monthly = [
        95000, 102000, 98000, 105000, 112000, 108000, 115000, 110000, 109000,
        113000, 118000, 125000,
      ];
      data.orders.monthly = [
        800, 900, 850, 920, 980, 940, 1000, 970, 960, 990, 1020, 1080,
      ];
      data.customers.monthly = [
        600, 650, 620, 680, 720, 700, 740, 730, 710, 760, 780, 820,
      ];
    }

    return {
      success: true,
      data,
      timestamp: new Date().toISOString(),
    };
  },

  exportReport: async (
    timeRange: string,
  ): Promise<{
    success: boolean;
    downloadUrl: string;
  }> => {
    await delay(1500);

    return {
      success: true,
      downloadUrl: `/api/export/analytics-${timeRange}-${Date.now()}.csv`,
    };
  },
};

// Product API
export const adminProductAPI = {
  createProduct: async (
    data: ProductFormData,
    images: string[],
  ): Promise<ProductResponse> => {
    await delay(1500);

    // Simulate validation
    if (!data.name || !data.price) {
      throw new Error("Name and price are required");
    }

    return {
      success: true,
      message: "Product created successfully",
      product: {
        id: `PROD-${Date.now()}`,
        ...data,
        images,
        status: "active",
        createdAt: new Date().toISOString(),
      },
    };
  },

  updateProduct: async (
    id: string,
    data: ProductFormData,
    images: string[],
  ): Promise<ProductResponse> => {
    await delay(1500);

    return {
      success: true,
      message: "Product updated successfully",
      product: {
        id,
        ...data,
        images,
        status: "active",
        createdAt: new Date().toISOString(),
      },
    };
  },

  uploadImages: async (
    files: File[],
  ): Promise<{
    success: boolean;
    urls: string[];
  }> => {
    await delay(1000);

    // In real app, upload to cloud storage
    // Here we return mock URLs
    const urls = files.map(
      (_, index) => `/images/products/product-${Date.now()}-${index}.jpg`,
    );

    return {
      success: true,
      urls,
    };
  },

  getCategories: async (): Promise<{
    success: boolean;
    categories: string[];
  }> => {
    await delay(500);

    return {
      success: true,
      categories: ["Bags", "Shoes", "Wallet", "Belt", "T-Shirts"],
    };
  },

  validateProductData: async (
    data: ProductFormData,
  ): Promise<{
    success: boolean;
    errors?: Record<string, string>;
  }> => {
    await delay(300);

    const errors: Record<string, string> = {};

    if (!data.name || data.name.length < 2) {
      errors.name = "Product name must be at least 2 characters";
    }

    if (!data.price || parseFloat(data.price) <= 0) {
      errors.price = "Price must be greater than 0";
    }

    if (!data.description || data.description.length < 10) {
      errors.description = "Description must be at least 10 characters";
    }

    if (!data.category) {
      errors.category = "Please select a category";
    }

    return {
      success: Object.keys(errors).length === 0,
      errors: Object.keys(errors).length > 0 ? errors : undefined,
    };
  },
};
