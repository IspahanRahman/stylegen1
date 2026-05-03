const delay = (ms: number = 800) =>
  new Promise((resolve) => setTimeout(resolve, ms));

export interface UserOrderItem {
  productId: string;
  name: string;
  quantity: number;
  price: number;
  size?: string;
  image: string;
}

export interface UserOrder {
  id: string;
  userId: string;
  items: UserOrderItem[];
  totalPrice: number;
  status: "pending" | "processing" | "shipped" | "delivered" | "cancelled";
  shippingAddress: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
    apartment?: string;
  };
  trackingNumber: string | null;
  estimatedDelivery: string | null;
  createdAt: string;
  shippedAt: string | null;
  deliveredAt: string | null;
}

export interface TrackingEvent {
  status: string;
  location: string;
  timestamp: string;
  completed: boolean;
}

// Mock user orders storage (shared across the app)
const userOrders: UserOrder[] = [
  {
    id: "order-1",
    userId: "user-1",
    items: [
      {
        productId: "1",
        name: "Italian Leather Weekend Bag",
        quantity: 1,
        price: 254.99,
        image: "/images/products/bag-1.jpg",
      },
    ],
    totalPrice: 254.99,
    status: "delivered",
    shippingAddress: {
      street: "123 Main Street",
      city: "New York",
      state: "NY",
      zipCode: "10001",
      country: "USA",
    },
    trackingNumber: "TRK123456789",
    estimatedDelivery: "2024-03-25",
    createdAt: "2024-03-01",
    shippedAt: "2024-03-15",
    deliveredAt: "2024-03-20",
  },
  {
    id: "order-2",
    userId: "user-1",
    items: [
      {
        productId: "3",
        name: "Slim Leather Wallet",
        quantity: 2,
        price: 71.99,
        image: "/images/products/wallet-1.jpg",
      },
    ],
    totalPrice: 143.98,
    status: "pending",
    shippingAddress: {
      street: "123 Main Street",
      city: "New York",
      state: "NY",
      zipCode: "10001",
      country: "USA",
    },
    trackingNumber: null,
    estimatedDelivery: null,
    createdAt: "2024-03-15",
    shippedAt: null,
    deliveredAt: null,
  },
];

const mockTrackingHistory: TrackingEvent[] = [
  {
    status: "Package delivered",
    location: "New York, NY",
    timestamp: "2024-03-25 14:30",
    completed: true,
  },
  {
    status: "Out for delivery",
    location: "New York, NY",
    timestamp: "2024-03-25 08:15",
    completed: true,
  },
  {
    status: "Arrived at local facility",
    location: "New York, NY",
    timestamp: "2024-03-25 06:00",
    completed: true,
  },
  {
    status: "In transit",
    location: "Philadelphia, PA",
    timestamp: "2024-03-24 22:45",
    completed: true,
  },
  {
    status: "Departed facility",
    location: "Newark, NJ",
    timestamp: "2024-03-24 15:30",
    completed: true,
  },
  {
    status: "Package received",
    location: "Newark, NJ",
    timestamp: "2024-03-24 10:00",
    completed: true,
  },
  {
    status: "Order processed",
    location: "StyleGen Warehouse",
    timestamp: "2024-03-23 16:00",
    completed: true,
  },
];

export const userOrderAPI = {
  getOrders: async (
    userId: string,
  ): Promise<{ success: boolean; orders: UserOrder[] }> => {
    await delay(800);

    const orders = userOrders.filter((o) => o.userId === userId);

    return {
      success: true,
      orders,
    };
  },

  getOrderById: async (
    orderId: string,
  ): Promise<{ success: boolean; order: UserOrder }> => {
    await delay(600);

    const order = userOrders.find((o) => o.id === orderId);
    if (!order) throw new Error("Order not found");

    return { success: true, order };
  },

  createOrder: async (
    orderData: Omit<
      UserOrder,
      | "id"
      | "createdAt"
      | "trackingNumber"
      | "estimatedDelivery"
      | "shippedAt"
      | "deliveredAt"
    >,
  ): Promise<{ success: boolean; order: UserOrder }> => {
    await delay(1200);

    const newOrder: UserOrder = {
      ...orderData,
      id: `order-${Date.now()}`,
      trackingNumber:
        orderData.status !== "pending" ? `TRK${Date.now()}` : null,
      estimatedDelivery:
        orderData.status === "shipped"
          ? new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
              .toISOString()
              .split("T")[0]
          : null,
      createdAt: new Date().toISOString(),
      shippedAt:
        orderData.status === "shipped" ? new Date().toISOString() : null,
      deliveredAt: null,
    };

    userOrders.push(newOrder);

    return { success: true, order: newOrder };
  },

  getTrackingInfo: async (
    orderId: string,
  ): Promise<{
    success: boolean;
    tracking: TrackingEvent[];
    currentStep: number;
  }> => {
    await delay(700);

    const order = userOrders.find((o) => o.id === orderId);
    if (!order) throw new Error("Order not found");

    // Calculate current step based on order status
    const statusStepMap: Record<string, number> = {
      pending: 1,
      processing: 2,
      shipped: 3,
      delivered: 5,
      cancelled: 1,
    };

    const currentStep = statusStepMap[order.status] || 1;

    return {
      success: true,
      tracking: mockTrackingHistory,
      currentStep,
    };
  },

  downloadInvoice: async (
    orderId: string,
  ): Promise<{ success: boolean; downloadUrl: string }> => {
    await delay(500);
    return {
      success: true,
      downloadUrl: `/api/invoices/${orderId}.pdf`,
    };
  },
};
