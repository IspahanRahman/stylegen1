const delay = (ms: number = 800) =>
  new Promise((resolve) => setTimeout(resolve, ms));

export interface OrderItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  size: string | null;
  image: string;
  discount: number;
}

export interface OrderCustomer {
  name: string;
  email: string;
  phone?: string;
  totalOrders?: number;
}

export interface ShippingAddress {
  street: string;
  apartment?: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
}

export interface TimelineEvent {
  status: string;
  date: string | null;
  icon: string;
  completed: boolean;
}

export interface Order {
  id: string;
  customer: OrderCustomer;
  items: { name: string; quantity: number }[];
  total: number;
  status: "pending" | "processing" | "shipped" | "delivered" | "cancelled";
  payment: string;
  date?: string;
  shipping: string | number;
}

export interface OrderDetails extends Order {
  paymentMethod: string;
  subtotal: number;
  shipping: number;
  tax: number;
  discount: number;
  createdAt: string;
  updatedAt: string;
  shippingAddress: ShippingAddress;
  items: OrderItem[];
  timeline: TimelineEvent[];
}

const mockOrders: Order[] = [
  {
    id: "ORD-001",
    customer: { name: "John Doe", email: "john@example.com" },
    items: [{ name: "Italian Leather Bag", quantity: 1 }],
    total: 299.99,
    status: "pending",
    payment: "paid",
    date: "2024-03-25",
    shipping: "Standard",
  },
  {
    id: "ORD-002",
    customer: { name: "Jane Smith", email: "jane@example.com" },
    items: [{ name: "Oxford Shoes", quantity: 1 }],
    total: 189.99,
    status: "shipped",
    payment: "paid",
    date: "2024-03-24",
    shipping: "Express",
  },
  {
    id: "ORD-003",
    customer: { name: "Mike Johnson", email: "mike@example.com" },
    items: [{ name: "Leather Wallet", quantity: 2 }],
    total: 159.98,
    status: "delivered",
    payment: "paid",
    date: "2024-03-23",
    shipping: "Standard",
  },
  {
    id: "ORD-004",
    customer: { name: "Sarah Wilson", email: "sarah@example.com" },
    items: [
      { name: "Leather Belt", quantity: 1 },
      { name: "Leather T-Shirt", quantity: 1 },
    ],
    total: 209.98,
    status: "processing",
    payment: "paid",
    date: "2024-03-22",
    shipping: "Express",
  },
  {
    id: "ORD-005",
    customer: { name: "Tom Brown", email: "tom@example.com" },
    items: [{ name: "Weekend Bag", quantity: 1 }],
    total: 299.99,
    status: "cancelled",
    payment: "refunded",
    date: "2024-03-21",
    shipping: "Standard",
  },
];

const mockOrderDetails: Record<string, OrderDetails> = {
  "ORD-001": {
    id: "ORD-001",
    status: "processing",
    payment: "paid",
    paymentMethod: "Credit Card (Visa ****4242)",
    subtotal: 329.98,
    shipping: 0,
    tax: 24.99,
    discount: 54.98,
    total: 299.99,
    createdAt: "2024-03-25 14:30",
    updatedAt: "2024-03-25 16:45",
    customer: {
      name: "John Doe",
      email: "john.doe@example.com",
      phone: "+1 (555) 123-4567",
      totalOrders: 12,
    },
    shippingAddress: {
      street: "123 Main Street",
      apartment: "Apt 4B",
      city: "New York",
      state: "NY",
      zipCode: "10001",
      country: "United States",
    },
    items: [
      {
        id: "1",
        name: "Italian Leather Weekend Bag",
        price: 299.99,
        quantity: 1,
        size: "One Size",
        image: "/images/products/bag-1.jpg",
        discount: 15,
      },
      {
        id: "2",
        name: "Leather Care Kit",
        price: 29.99,
        quantity: 1,
        size: null,
        image: "/images/products/care-kit.jpg",
        discount: 0,
      },
    ],
    timeline: [
      {
        status: "Order Placed",
        date: "2024-03-25 14:30",
        icon: "Clock",
        completed: true,
      },
      {
        status: "Payment Confirmed",
        date: "2024-03-25 14:31",
        icon: "CreditCard",
        completed: true,
      },
      {
        status: "Processing",
        date: "2024-03-25 15:00",
        icon: "Package",
        completed: true,
      },
      { status: "Ready to Ship", date: null, icon: "Truck", completed: false },
      { status: "Shipped", date: null, icon: "Truck", completed: false },
      {
        status: "Delivered",
        date: null,
        icon: "CheckCircle2",
        completed: false,
      },
    ],
  },
};

export const adminOrderAPI = {
  getAll: async (): Promise<{ success: boolean; orders: Order[] }> => {
    await delay(800);
    return {
      success: true,
      orders: [...mockOrders],
    };
  },

  getById: async (
    id: string,
  ): Promise<{ success: boolean; order: OrderDetails }> => {
    await delay(600);

    const order = mockOrderDetails[id];
    if (!order) {
      // Generate default details for any order
      const basicOrder = mockOrders.find((o) => o.id === id);
      if (!basicOrder) throw new Error("Order not found");

      const defaultOrder: OrderDetails = {
        ...basicOrder,
        paymentMethod: "Credit Card",
        subtotal: basicOrder.total,
        shipping: 0,
        tax: 0,
        discount: 0,
        createdAt: `${basicOrder.date} 10:00`,
        updatedAt: `${basicOrder.date} 10:00`,
        shippingAddress: {
          street: "123 Default Street",
          city: "New York",
          state: "NY",
          zipCode: "10001",
          country: "United States",
        },
        items: basicOrder.items.map((item, index) => ({
          id: `${index + 1}`,
          name: item.name,
          price: basicOrder.total / basicOrder.items.length,
          quantity: item.quantity,
          size: "One Size",
          image: "/images/products/default.jpg",
          discount: 0,
        })),
        timeline: [
          {
            status: "Order Placed",
            date: `${basicOrder.date} 10:00`,
            icon: "Clock",
            completed: true,
          },
          {
            status: "Payment Confirmed",
            date: `${basicOrder.date} 10:05`,
            icon: "CreditCard",
            completed: true,
          },
          {
            status: "Processing",
            date: null,
            icon: "Package",
            completed: false,
          },
          { status: "Shipped", date: null, icon: "Truck", completed: false },
          {
            status: "Delivered",
            date: null,
            icon: "CheckCircle2",
            completed: false,
          },
        ],
      };

      return { success: true, order: defaultOrder };
    }

    return { success: true, order };
  },

  updateStatus: async (
    id: string,
    status: string,
  ): Promise<{ success: boolean }> => {
    await delay(500);

    const order = mockOrders.find((o) => o.id === id);
    if (!order) throw new Error("Order not found");

    order.status = status as Order["status"];

    // Also update details if exists
    if (mockOrderDetails[id]) {
      mockOrderDetails[id].status = status as Order["status"];
    }

    return { success: true };
  },

  exportOrders: async (): Promise<{
    success: boolean;
    downloadUrl: string;
  }> => {
    await delay(1000);

    return {
      success: true,
      downloadUrl: `/api/export/orders-${Date.now()}.csv`,
    };
  },

  printInvoice: async (orderId: string): Promise<{ success: boolean }> => {
    await delay(500);
    return { success: true };
  },

  getStats: async (): Promise<{
    success: boolean;
    stats: {
      total: number;
      pending: number;
      processing: number;
      shipped: number;
      delivered: number;
      cancelled: number;
      totalRevenue: number;
    };
  }> => {
    await delay(400);

    return {
      success: true,
      stats: {
        total: mockOrders.length,
        pending: mockOrders.filter((o) => o.status === "pending").length,
        processing: mockOrders.filter((o) => o.status === "processing").length,
        shipped: mockOrders.filter((o) => o.status === "shipped").length,
        delivered: mockOrders.filter((o) => o.status === "delivered").length,
        cancelled: mockOrders.filter((o) => o.status === "cancelled").length,
        totalRevenue: mockOrders.reduce((sum, o) => sum + o.total, 0),
      },
    };
  },
};
