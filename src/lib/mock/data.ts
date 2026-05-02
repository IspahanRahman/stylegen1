// Mock Products Data
export const products = [
  {
    id: "1",
    name: "Italian Leather Weekend Bag",
    price: 299.99,
    discount: 15,
    category: "Bags",
    stock: 25,
    images: [
      "/images/products/bag-1.jpg",
      "/images/products/bag-2.jpg",
      "/images/products/bag-3.jpg",
    ],
    sizes: ["One Size"],
    description:
      "Handcrafted Italian leather weekend bag. Perfect for short trips with ample storage space and durable construction.",
    featured: true,
    rating: 4.8,
    reviews: 124,
    createdAt: "2024-01-15",
  },
  {
    id: "2",
    name: "Classic Leather Oxford Shoes",
    price: 189.99,
    discount: 0,
    category: "Shoes",
    stock: 50,
    images: ["/images/products/shoes-1.jpg", "/images/products/shoes-2.jpg"],
    sizes: ["7", "8", "9", "10", "11", "12"],
    description:
      "Premium leather Oxford shoes, hand-stitched with Blake construction for durability and elegance.",
    featured: true,
    rating: 4.6,
    reviews: 89,
    createdAt: "2024-01-10",
  },
  {
    id: "3",
    name: "Slim Leather Wallet",
    price: 79.99,
    discount: 10,
    category: "Wallet",
    stock: 100,
    images: ["/images/products/wallet-1.jpg", "/images/products/wallet-2.jpg"],
    sizes: ["One Size"],
    description:
      "Minimalist slim wallet made from full-grain leather. Features RFID blocking and quick card access.",
    featured: true,
    rating: 4.9,
    reviews: 256,
    createdAt: "2024-02-01",
  },
  {
    id: "4",
    name: "Handcrafted Leather Belt",
    price: 59.99,
    discount: 0,
    category: "Belt",
    stock: 75,
    images: ["/images/products/belt-1.jpg", "/images/products/belt-2.jpg"],
    sizes: ["30", "32", "34", "36", "38", "40"],
    description:
      "Full-grain leather belt with brass buckle. Each belt is hand-finished for a unique patina.",
    featured: false,
    rating: 4.7,
    reviews: 178,
    createdAt: "2024-01-20",
  },
  {
    id: "5",
    name: "Premium Leather T-Shirt",
    price: 149.99,
    discount: 20,
    category: "T-Shirts",
    stock: 30,
    images: ["/images/products/tshirt-1.jpg", "/images/products/tshirt-2.jpg"],
    sizes: ["S", "M", "L", "XL", "XXL"],
    description:
      "Luxurious lambskin leather t-shirt. Soft and comfortable with a modern slim fit design.",
    featured: true,
    rating: 4.5,
    reviews: 67,
    createdAt: "2024-02-10",
  },
  {
    id: "6",
    name: "Leather Messenger Bag",
    price: 199.99,
    discount: 0,
    category: "Bags",
    stock: 40,
    images: [
      "/images/products/messenger-1.jpg",
      "/images/products/messenger-2.jpg",
    ],
    sizes: ["One Size"],
    description:
      "Professional leather messenger bag with padded laptop compartment and multiple organizer pockets.",
    featured: false,
    rating: 4.7,
    reviews: 92,
    createdAt: "2024-01-25",
  },
];

// Mock Categories
export const categories = [
  {
    id: "1",
    name: "Shoes",
    description: "Handcrafted leather footwear",
    image: "/images/categories/shoes.jpg",
    productCount: 45,
  },
  {
    id: "2",
    name: "Wallet",
    description: "Slim & classic wallets",
    image: "/images/categories/wallet.jpg",
    productCount: 30,
  },
  {
    id: "3",
    name: "Belt",
    description: "Premium leather belts",
    image: "/images/categories/belt.jpg",
    productCount: 25,
  },
  {
    id: "4",
    name: "Bags",
    description: "Luxury leather bags",
    image: "/images/categories/bags.jpg",
    productCount: 35,
  },
  {
    id: "5",
    name: "T-Shirts",
    description: "Leather apparel",
    image: "/images/categories/tshirts.jpg",
    productCount: 20,
  },
];

// Mock Users
export const mockUsers = {
  admin: {
    id: "admin-1",
    name: "John Admin",
    email: "admin@stylegen.com",
    password: "admin123",
    role: "admin",
  },
  customer: {
    id: "user-1",
    name: "Jane Smith",
    email: "jane@example.com",
    password: "user123",
    role: "user",
    addresses: [
      {
        id: "addr-1",
        street: "123 Main Street",
        city: "New York",
        state: "NY",
        zipCode: "10001",
        country: "USA",
        isDefault: true,
      },
    ],
  },
};

// Mock Orders
export const mockOrders = [
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
    },
    createdAt: "2024-03-01",
    trackingNumber: "TRK123456789",
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
    },
    createdAt: "2024-03-15",
    trackingNumber: null,
  },
];

// Hero Banners
export const heroBanners = [
  {
    id: 1,
    title: "Premium Leather Collection",
    subtitle: "Handcrafted with Passion",
    description: "Discover our new collection of premium leather goods",
    image: "/images/hero/hero-1.jpg",
    cta: "Shop Now",
    link: "/products",
  },
  {
    id: 2,
    title: "Spring Sale",
    subtitle: "Up to 30% Off",
    description: "Limited time offer on selected leather items",
    image: "/images/hero/hero-2.jpg",
    cta: "View Deals",
    link: "/products?discount=true",
  },
];

// Testimonials
export const testimonials = [
  {
    id: 1,
    name: "Michael Brown",
    role: "Verified Buyer",
    content:
      "The quality of the leather is outstanding. Best purchase I've made this year!",
    rating: 5,
    avatar: "/images/avatars/avatar-1.jpg",
  },
  {
    id: 2,
    name: "Sarah Johnson",
    role: "Fashion Blogger",
    content:
      "StyleGen's attention to detail is remarkable. These pieces are true craftsmanship.",
    rating: 5,
    avatar: "/images/avatars/avatar-2.jpg",
  },
];
