const delay = (ms: number = 800) =>
  new Promise((resolve) => setTimeout(resolve, ms));

export interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  location: string;
  orders: number;
  totalSpent: number;
  status: "active" | "inactive" | "banned";
  joined: string;
  avatar?: string;
}

export interface CustomerDetails extends Customer {
  lastActive: string;
  addresses: Address[];
  stats: CustomerStats;
  recentOrders: RecentOrder[];
  activity: Activity[];
  notes: Note[];
}

export interface Address {
  id: string;
  type: string;
  street: string;
  apartment?: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  isDefault: boolean;
}

export interface CustomerStats {
  totalOrders: number;
  totalSpent: number;
  averageOrderValue: number;
  lastOrderDate: string;
  productsPurchased: number;
  returns: number;
  reviews: number;
  averageRating: number;
}

export interface RecentOrder {
  id: string;
  date: string;
  total: number;
  status: string;
  items: number;
}

export interface Activity {
  action: string;
  description: string;
  date: string;
}

export interface Note {
  id: number;
  content: string;
  author: string;
  date: string;
}

const mockCustomers: Customer[] = [
  {
    id: "CUST-001",
    name: "John Doe",
    email: "john@example.com",
    phone: "+1 (555) 123-4567",
    location: "New York, USA",
    orders: 12,
    totalSpent: 2456.0,
    status: "active",
    joined: "2024-01-15",
  },
  {
    id: "CUST-002",
    name: "Jane Smith",
    email: "jane@example.com",
    phone: "+1 (555) 234-5678",
    location: "Los Angeles, USA",
    orders: 8,
    totalSpent: 1587.0,
    status: "active",
    joined: "2024-02-01",
  },
  {
    id: "CUST-003",
    name: "Mike Johnson",
    email: "mike@example.com",
    phone: "+1 (555) 345-6789",
    location: "Chicago, USA",
    orders: 3,
    totalSpent: 459.0,
    status: "inactive",
    joined: "2024-01-20",
  },
  {
    id: "CUST-004",
    name: "Sarah Wilson",
    email: "sarah@example.com",
    phone: "+1 (555) 456-7890",
    location: "Houston, USA",
    orders: 0,
    totalSpent: 0,
    status: "banned",
    joined: "2024-03-01",
  },
  {
    id: "CUST-005",
    name: "Tom Anderson",
    email: "tom@example.com",
    phone: "+1 (555) 567-8901",
    location: "Miami, USA",
    orders: 25,
    totalSpent: 5678.0,
    status: "active",
    joined: "2023-11-01",
  },
];

const mockCustomerDetails: Record<string, CustomerDetails> = {
  "CUST-001": {
    id: "CUST-001",
    name: "John Doe",
    email: "john.doe@example.com",
    phone: "+1 (555) 123-4567",
    location: "New York, USA",
    orders: 12,
    totalSpent: 2456.0,
    status: "active",
    joined: "2024-01-15",
    lastActive: "2024-03-25",
    addresses: [
      {
        id: "addr-1",
        type: "Home",
        street: "123 Main Street",
        apartment: "Apt 4B",
        city: "New York",
        state: "NY",
        zipCode: "10001",
        country: "United States",
        isDefault: true,
      },
      {
        id: "addr-2",
        type: "Work",
        street: "456 Business Ave",
        apartment: "Suite 200",
        city: "New York",
        state: "NY",
        zipCode: "10002",
        country: "United States",
        isDefault: false,
      },
    ],
    stats: {
      totalOrders: 12,
      totalSpent: 2456.0,
      averageOrderValue: 204.67,
      lastOrderDate: "2024-03-25",
      productsPurchased: 15,
      returns: 1,
      reviews: 8,
      averageRating: 4.5,
    },
    recentOrders: [
      {
        id: "ORD-001",
        date: "2024-03-25",
        total: 299.99,
        status: "processing",
        items: 2,
      },
      {
        id: "ORD-008",
        date: "2024-03-10",
        total: 189.99,
        status: "delivered",
        items: 1,
      },
      {
        id: "ORD-005",
        date: "2024-02-28",
        total: 459.99,
        status: "delivered",
        items: 3,
      },
    ],
    activity: [
      {
        action: "Order placed",
        description: "Order #ORD-001",
        date: "2024-03-25",
      },
      {
        action: "Review submitted",
        description: "5-star review for Leather Bag",
        date: "2024-03-15",
      },
      {
        action: "Address updated",
        description: "Added work address",
        date: "2024-03-01",
      },
      {
        action: "Account created",
        description: "Joined StyleGen",
        date: "2024-01-15",
      },
    ],
    notes: [
      {
        id: 1,
        content: "VIP customer - prefers express shipping",
        author: "Admin",
        date: "2024-02-15",
      },
      {
        id: 2,
        content: "Contacted support about sizing - resolved",
        author: "Support",
        date: "2024-01-20",
      },
    ],
  },
};

export const adminCustomerAPI = {
  getAll: async (): Promise<{ success: boolean; customers: Customer[] }> => {
    await delay(800);
    return {
      success: true,
      customers: [...mockCustomers],
    };
  },

  getById: async (
    id: string,
  ): Promise<{ success: boolean; customer: CustomerDetails }> => {
    await delay(600);

    // Return mock details for any customer or generate default
    const details =
      mockCustomerDetails[id] ||
      ({
        ...mockCustomers.find((c) => c.id === id),
        lastActive: new Date().toISOString().split("T")[0],
        addresses: [],
        stats: {
          totalOrders: 0,
          totalSpent: 0,
          averageOrderValue: 0,
          lastOrderDate: "",
          productsPurchased: 0,
          returns: 0,
          reviews: 0,
          averageRating: 0,
        },
        recentOrders: [],
        activity: [],
        notes: [],
      } as CustomerDetails);

    return {
      success: true,
      customer: details,
    };
  },

  updateStatus: async (
    id: string,
    status: string,
  ): Promise<{ success: boolean }> => {
    await delay(500);

    const customer = mockCustomers.find((c) => c.id === id);
    if (!customer) throw new Error("Customer not found");

    customer.status = status as Customer["status"];

    return { success: true };
  },

  addNote: async (
    customerId: string,
    content: string,
  ): Promise<{ success: boolean; note: Note }> => {
    await delay(500);

    const note: Note = {
      id: Date.now(),
      content,
      author: "Admin",
      date: new Date().toISOString().split("T")[0],
    };

    return {
      success: true,
      note,
    };
  },

  getStats: async (): Promise<{
    success: boolean;
    stats: {
      total: number;
      active: number;
      inactive: number;
      banned: number;
      newThisMonth: number;
    };
  }> => {
    await delay(400);

    return {
      success: true,
      stats: {
        total: mockCustomers.length,
        active: mockCustomers.filter((c) => c.status === "active").length,
        inactive: mockCustomers.filter((c) => c.status === "inactive").length,
        banned: mockCustomers.filter((c) => c.status === "banned").length,
        newThisMonth: 12,
      },
    };
  },
};
