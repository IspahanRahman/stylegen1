const delay = (ms: number = 800) =>
  new Promise((resolve) => setTimeout(resolve, ms));

// ============ DASHBOARD TYPES ============
export interface DashboardStats {
  totalProducts: number;
  activeInventory: number;
  lowStock: number;
  totalOrders: number;
  totalCustomers: number;
  totalRevenue: number;
  monthlyRevenue: number;
  revenueGrowth: number;
  ordersGrowth: number;
  customersGrowth: number;
}

export interface RecentOrder {
  id: string;
  customer: string;
  amount: number;
  status: "pending" | "processing" | "shipped" | "delivered" | "cancelled";
  date: string;
}

export interface LowStockProduct {
  id: string;
  name: string;
  stock: number;
  threshold: number;
  image?: string;
}

export interface Activity {
  id: number;
  action: string;
  description: string;
  time: string;
  type: "order" | "product" | "customer" | "system";
}

export interface DashboardData {
  stats: DashboardStats;
  recentOrders: RecentOrder[];
  lowStockProducts: LowStockProduct[];
  recentActivities: Activity[];
  timestamp: string;
}

// ============ MOCK DATA ============
const mockStats: DashboardStats = {
  totalProducts: 156,
  activeInventory: 134,
  lowStock: 12,
  totalOrders: 1245,
  totalCustomers: 890,
  totalRevenue: 456789,
  monthlyRevenue: 45678,
  revenueGrowth: 12.5,
  ordersGrowth: 8.3,
  customersGrowth: 15.2,
};

const mockRecentOrders: RecentOrder[] = [
  {
    id: "ORD-001",
    customer: "John Doe",
    amount: 299.99,
    status: "pending",
    date: "2024-03-25",
  },
  {
    id: "ORD-002",
    customer: "Jane Smith",
    amount: 189.99,
    status: "shipped",
    date: "2024-03-24",
  },
  {
    id: "ORD-003",
    customer: "Mike Johnson",
    amount: 79.99,
    status: "delivered",
    date: "2024-03-23",
  },
  {
    id: "ORD-004",
    customer: "Sarah Wilson",
    amount: 459.99,
    status: "processing",
    date: "2024-03-22",
  },
  {
    id: "ORD-005",
    customer: "Tom Brown",
    amount: 149.99,
    status: "cancelled",
    date: "2024-03-21",
  },
  {
    id: "ORD-006",
    customer: "Lisa Anderson",
    amount: 329.99,
    status: "pending",
    date: "2024-03-20",
  },
  {
    id: "ORD-007",
    customer: "Robert Taylor",
    amount: 89.99,
    status: "delivered",
    date: "2024-03-19",
  },
];

const mockLowStockProducts: LowStockProduct[] = [
  {
    id: "1",
    name: "Italian Leather Bag",
    stock: 3,
    threshold: 10,
    image: "/images/products/bag.jpeg",
  },
  {
    id: "2",
    name: "Oxford Shoes",
    stock: 2,
    threshold: 10,
    image: "/images/products/shoes-1.jpg",
  },
  {
    id: "3",
    name: "Leather Wallet",
    stock: 5,
    threshold: 15,
    image: "/images/products/wallet-1.jpg",
  },
  {
    id: "4",
    name: "Leather Belt",
    stock: 4,
    threshold: 8,
    image: "/images/products/belt-1.jpg",
  },
];

const mockRecentActivities: Activity[] = [
  {
    id: 1,
    action: "New order placed",
    description: "Order #ORD-001 by John Doe",
    time: "5 minutes ago",
    type: "order",
  },
  {
    id: 2,
    action: "Product updated",
    description: "Italian Leather Bag stock updated",
    time: "1 hour ago",
    type: "product",
  },
  {
    id: 3,
    action: "New customer registered",
    description: "Sarah Wilson joined",
    time: "2 hours ago",
    type: "customer",
  },
  {
    id: 4,
    action: "Order shipped",
    description: "Order #ORD-002 shipped",
    time: "3 hours ago",
    type: "order",
  },
  {
    id: 5,
    action: "Low stock alert",
    description: "Oxford Shoes running low (2 left)",
    time: "4 hours ago",
    type: "system",
  },
  {
    id: 6,
    action: "Product added",
    description: "New Leather T-Shirt added to catalog",
    time: "5 hours ago",
    type: "product",
  },
];

// ============ API FUNCTIONS ============
export const adminDashboardAPI = {
  getDashboardData: async (
    timeRange: string = "7days",
  ): Promise<{
    success: boolean;
    data: DashboardData;
  }> => {
    await delay(1000);

    // Simulate different data based on time range
    const stats = { ...mockStats };

    switch (timeRange) {
      case "7days":
        stats.totalRevenue = 45678;
        stats.totalOrders = 124;
        stats.totalCustomers = 45;
        stats.monthlyRevenue = 45678;
        break;
      case "30days":
        stats.totalRevenue = 156789;
        stats.totalOrders = 456;
        stats.totalCustomers = 178;
        stats.monthlyRevenue = 156789;
        break;
      case "90days":
        stats.totalRevenue = 345678;
        stats.totalOrders = 890;
        stats.totalCustomers = 345;
        stats.monthlyRevenue = 115226;
        break;
      case "year":
        stats.totalRevenue = 1250000;
        stats.totalOrders = 3456;
        stats.totalCustomers = 1200;
        stats.monthlyRevenue = 104167;
        break;
    }

    return {
      success: true,
      data: {
        stats,
        recentOrders: mockRecentOrders,
        lowStockProducts: mockLowStockProducts,
        recentActivities: mockRecentActivities,
        timestamp: new Date().toISOString(),
      },
    };
  },

  getStatsSummary: async (): Promise<{
    success: boolean;
    stats: DashboardStats;
  }> => {
    await delay(500);
    return {
      success: true,
      stats: mockStats,
    };
  },

  getRecentOrders: async (
    limit: number = 5,
  ): Promise<{
    success: boolean;
    orders: RecentOrder[];
  }> => {
    await delay(600);
    return {
      success: true,
      orders: mockRecentOrders.slice(0, limit),
    };
  },

  getLowStockProducts: async (): Promise<{
    success: boolean;
    products: LowStockProduct[];
  }> => {
    await delay(500);
    return {
      success: true,
      products: mockLowStockProducts,
    };
  },

  getRecentActivities: async (
    limit: number = 6,
  ): Promise<{
    success: boolean;
    activities: Activity[];
  }> => {
    await delay(400);
    return {
      success: true,
      activities: mockRecentActivities.slice(0, limit),
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
      downloadUrl: `/api/export/dashboard-report-${timeRange}-${Date.now()}.pdf`,
    };
  },
};
