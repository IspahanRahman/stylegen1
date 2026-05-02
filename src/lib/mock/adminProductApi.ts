const delay = (ms: number = 800) => new Promise((resolve) => setTimeout(resolve, ms));

// ============ SHARED TYPES ============
export interface ProductFormData {
  name: string;
  price: string;
  discount?: string;
  category: string;
  stock: string;
  description: string;
  sizes?: string;
}

export interface ProductDetails {
  id: string;
  name: string;
  price: string;
  discount: string;
  category: string;
  stock: string;
  description: string;
  sizes: string;
  images: string[];
  status: 'active' | 'draft' | 'inactive';
  featured: boolean;
  seoTitle: string;
  metaDescription: string;
  tags: string;
  rating?: number;
  reviews?: number;
  sales?: number;
  createdAt: string;
  updatedAt: string;
}

export interface ProductListItem {
  id: string;
  name: string;
  price: number;
  discount: number;
  category: string;
  stock: number;
  status: 'active' | 'draft' | 'inactive' | 'out_of_stock';
  rating: number;
  sales: number;
  images: string[];
  createdAt: string;
}

// ============ MOCK DATA ============
const mockProducts: Record<string, ProductDetails> = {
  '1': {
    id: '1',
    name: 'Italian Leather Weekend Bag',
    price: '299.99',
    discount: '15',
    category: 'Bags',
    stock: '25',
    description: 'Handcrafted Italian leather weekend bag with premium materials.',
    sizes: 'One Size',
    images: [
      '/images/products/bag1.jpeg',
      '/images/products/belt-1.jpeg',
      '/images/products/wallet-1.jpeg',
    ],
    status: 'active',
    featured: true,
    seoTitle: 'Italian Leather Weekend Bag | StyleGen',
    metaDescription: 'Premium handcrafted Italian leather weekend bag.',
    tags: 'leather, bag, weekend, travel, italian',
    rating: 4.8,
    reviews: 124,
    sales: 156,
    createdAt: '2024-01-15',
    updatedAt: '2024-03-20',
  },
  '2': {
    id: '2',
    name: 'Classic Leather Oxford Shoes',
    price: '189.99',
    discount: '0',
    category: 'Shoes',
    stock: '50',
    description: 'Premium leather Oxford shoes with hand-stitched details.',
    sizes: '7,8,9,10,11,12',
    images: ['/images/products/shoes-1.jpeg'],
    status: 'active',
    featured: true,
    seoTitle: 'Classic Leather Oxford Shoes | StyleGen',
    metaDescription: 'Premium leather Oxford shoes with hand-stitched details.',
    tags: 'leather, shoes, oxford, classic',
    rating: 4.6,
    reviews: 89,
    sales: 234,
    createdAt: '2024-01-10',
    updatedAt: '2024-03-18',
  },
};

// Product list for table view
const mockProductList: ProductListItem[] = [
  {
    id: '1',
    name: 'Italian Leather Weekend Bag',
    price: 299.99,
    discount: 15,
    category: 'Bags',
    stock: 25,
    status: 'active',
    rating: 4.8,
    sales: 156,
    images: ['/images/products/bag1.jpeg'],
    createdAt: '2024-01-15',
  },
  {
    id: '2',
    name: 'Classic Leather Oxford Shoes',
    price: 189.99,
    discount: 0,
    category: 'Shoes',
    stock: 50,
    status: 'active',
    rating: 4.6,
    sales: 234,
    images: ['/images/products/shoes-1.jpeg'],
    createdAt: '2024-01-10',
  },
  {
    id: '3',
    name: 'Slim Leather Wallet',
    price: 79.99,
    discount: 10,
    category: 'Wallet',
    stock: 0,
    status: 'out_of_stock',
    rating: 4.9,
    sales: 567,
    images: ['/images/products/wallet-1.jpeg'],
    createdAt: '2024-02-01',
  },
  {
    id: '4',
    name: 'Handcrafted Leather Belt',
    price: 59.99,
    discount: 0,
    category: 'Belt',
    stock: 75,
    status: 'active',
    rating: 4.7,
    sales: 189,
    images: ['/images/products/belt-1.jpeg'],
    createdAt: '2024-01-20',
  },
  {
    id: '5',
    name: 'Premium Leather T-Shirt',
    price: 149.99,
    discount: 20,
    category: 'T-Shirts',
    stock: 0,
    status: 'draft',
    rating: 0,
    sales: 0,
    images: ['/images/products/tshirt-1.webp'],
    createdAt: '2024-02-10',
  },
];

// ============ API FUNCTIONS ============

// Product List Operations
export const adminProductListAPI = {
  getAll: async (filters?: {
    search?: string;
    category?: string;
    status?: string;
  }): Promise<{
    success: boolean;
    products: ProductListItem[];
    total: number;
  }> => {
    await delay(800);

    let filtered = [...mockProductList];

    if (filters?.search) {
      const term = filters.search.toLowerCase();
      filtered = filtered.filter(
        (p) => p.name.toLowerCase().includes(term) || p.id.toLowerCase().includes(term)
      );
    }

    if (filters?.category && filters.category !== 'all') {
      filtered = filtered.filter((p) => p.category === filters.category);
    }

    if (filters?.status && filters.status !== 'all') {
      filtered = filtered.filter((p) => p.status === filters.status);
    }

    return {
      success: true,
      products: filtered,
      total: filtered.length,
    };
  },

  delete: async (id: string): Promise<{ success: boolean }> => {
    await delay(600);
    const index = mockProductList.findIndex((p) => p.id === id);
    if (index !== -1) {
      mockProductList.splice(index, 1);
    }
    return { success: true };
  },

  bulkDelete: async (ids: string[]): Promise<{ success: boolean }> => {
    await delay(800);
    ids.forEach((id) => {
      const index = mockProductList.findIndex((p) => p.id === id);
      if (index !== -1) mockProductList.splice(index, 1);
    });
    return { success: true };
  },

  bulkUpdateStatus: async (ids: string[], status: string): Promise<{ success: boolean }> => {
    await delay(800);
    ids.forEach((id) => {
      const product = mockProductList.find((p) => p.id === id);
      if (product) product.status = status as ProductListItem['status'];
    });
    return { success: true };
  },

  getCategories: async (): Promise<{
    success: boolean;
    categories: string[];
  }> => {
    await delay(400);
    const categories = [...new Set(mockProductList.map((p) => p.category))];
    return { success: true, categories };
  },
};

// Product CRUD Operations (Single product)
export const adminProductCRUDAPI = {
  getById: async (id: string): Promise<{ success: boolean; product: ProductDetails }> => {
    await delay(600);

    const product = mockProducts[id];
    if (!product) {
      return {
        success: true,
        product: {
          id,
          name: 'Product Name',
          price: '0',
          discount: '0',
          category: 'Bags',
          stock: '0',
          description: 'Product description...',
          sizes: '',
          images: [],
          status: 'active',
          featured: false,
          seoTitle: '',
          metaDescription: '',
          tags: '',
          createdAt: new Date().toISOString().split('T')[0],
          updatedAt: new Date().toISOString().split('T')[0],
        },
      };
    }

    return { success: true, product };
  },

  create: async (
    data: ProductFormData,
    images: string[]
  ): Promise<{
    success: boolean;
    product: ProductDetails;
  }> => {
    await delay(1500);

    const newProduct: ProductDetails = {
      id: `PROD-${Date.now()}`,
      ...data,
      discount: data.discount ?? '0',
      sizes: data.sizes ?? '',
      // Convert any temporary blob URLs to mock persistent paths
      images: images.map((img, i) =>
        img.startsWith('blob:') ? `/images/products/uploaded-${Date.now()}-${i}.jpg` : img
      ),
      status: 'active',
      featured: false,
      seoTitle: '',
      metaDescription: '',
      tags: '',
      createdAt: new Date().toISOString().split('T')[0],
      updatedAt: new Date().toISOString().split('T')[0],
    };

    mockProducts[newProduct.id] = newProduct;

    // Add to product list so list views reflect the new product
    mockProductList.unshift({
      id: newProduct.id,
      name: newProduct.name,
      price: parseFloat(newProduct.price || '0'),
      discount: parseFloat(newProduct.discount || '0'),
      category: newProduct.category,
      stock: parseInt(newProduct.stock || '0'),
      status: newProduct.status as ProductListItem['status'],
      rating: newProduct.rating || 0,
      sales: newProduct.sales || 0,
      images: newProduct.images,
      createdAt: newProduct.createdAt,
    });

    return { success: true, product: newProduct };
  },

  update: async (
    id: string,
    data: ProductFormData,
    images: string[]
  ): Promise<{
    success: boolean;
    product: ProductDetails;
  }> => {
    await delay(1500);

    const existing = mockProducts[id];
    if (!existing) throw new Error('Product not found');

    const savedImages =
      images.length > 0
        ? images.map((img, i) =>
            img.startsWith('blob:') ? `/images/products/uploaded-${Date.now()}-${i}.jpg` : img
          )
        : existing.images;

    const updated: ProductDetails = {
      ...existing,
      ...data,
      discount: data.discount ?? existing.discount,
      sizes: data.sizes ?? existing.sizes,
      images: savedImages,
      updatedAt: new Date().toISOString().split('T')[0],
    };

    mockProducts[id] = updated;

    // Update list entry if present so list reflects edits
    const listIdx = mockProductList.findIndex((p) => p.id === id);
    if (listIdx !== -1) {
      mockProductList[listIdx] = {
        ...mockProductList[listIdx],
        name: updated.name,
        price: parseFloat(updated.price || '0'),
        discount: parseFloat(updated.discount || '0'),
        category: updated.category,
        stock: parseInt(updated.stock || '0'),
        status: updated.status as ProductListItem['status'],
        images: updated.images,
      };
    }

    return { success: true, product: updated };
  },

  delete: async (id: string): Promise<{ success: boolean }> => {
    await delay(600);
    delete mockProducts[id];
    // Also remove from list view
    const idx = mockProductList.findIndex((p) => p.id === id);
    if (idx !== -1) mockProductList.splice(idx, 1);
    return { success: true };
  },

  uploadImages: async (
    files: File[]
  ): Promise<{
    success: boolean;
    urls: string[];
  }> => {
    await delay(1000);

    // If running in the browser, convert files to data URLs so previews render immediately.
    try {
      const readFileAsDataUrl = (file: File) =>
        new Promise<string>((resolve, reject) => {
          const reader = new FileReader();
          reader.onload = () => resolve(String(reader.result));
          reader.onerror = () => reject(new Error('Failed to read file'));
          reader.readAsDataURL(file);
        });

      const urls = await Promise.all(files.map((f) => readFileAsDataUrl(f)));
      return { success: true, urls };
    } catch (err) {
      // Fallback to mock paths if FileReader isn't available
      const urls = files.map((_, i) => `/images/products/img-${Date.now()}-${i}.jpg`);
      return { success: true, urls };
    }
  },

  validateData: async (
    data: ProductFormData
  ): Promise<{
    success: boolean;
    errors?: Record<string, string>;
  }> => {
    await delay(300);

    const errors: Record<string, string> = {};

    if (!data.name || data.name.length < 2) {
      errors.name = 'Product name must be at least 2 characters';
    }

    if (!data.price || parseFloat(data.price) <= 0) {
      errors.price = 'Price must be greater than 0';
    }

    if (!data.description || data.description.length < 10) {
      errors.description = 'Description must be at least 10 characters';
    }

    if (!data.category) {
      errors.category = 'Please select a category';
    }

    if (data.stock && parseInt(data.stock) < 0) {
      errors.stock = 'Stock must be 0 or more';
    }

    return {
      success: Object.keys(errors).length === 0,
      errors: Object.keys(errors).length > 0 ? errors : undefined,
    };
  },
};

// Product Details Operations (for single product view)
export const adminProductDetailsAPI = {
  getById: async (id: string): Promise<{ success: boolean; product: ProductDetails }> => {
    await delay(600);

    const product = mockProducts[id];
    if (!product) {
      // Return a default product if not found
      return {
        success: true,
        product: {
          id,
          name: 'Product Name',
          price: '0',
          discount: '0',
          category: 'Bags',
          stock: '0',
          description: 'Product description...',
          sizes: '',
          images: [],
          status: 'active',
          featured: false,
          seoTitle: '',
          metaDescription: '',
          tags: '',
          rating: 0,
          reviews: 0,
          sales: 0,
          createdAt: new Date().toISOString().split('T')[0],
          updatedAt: new Date().toISOString().split('T')[0],
        },
      };
    }

    return { success: true, product };
  },

  // Add mock product details with extended info
  getDetails: async (
    id: string
  ): Promise<{
    success: boolean;
    product: ProductDetails & {
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
    };
  }> => {
    await delay(700);

    const product = mockProducts[id];

    // If product isn't present in the detailed mock map, return a sensible default
    const base = product
      ? { ...product }
      : {
          id,
          name: 'Product Name',
          price: '0',
          discount: '0',
          category: 'Bags',
          stock: '0',
          description: 'Product description...',
          sizes: '',
          images: [],
          status: 'active',
          featured: false,
          seoTitle: '',
          metaDescription: '',
          tags: '',
          rating: 0,
          reviews: 0,
          sales: 0,
          createdAt: new Date().toISOString().split('T')[0],
          updatedAt: new Date().toISOString().split('T')[0],
        };

    return {
      success: true,
      product: {
        ...(base as ProductDetails),
        views: 2345,
        features: [
          'Full-grain Italian leather',
          'Hand-stitched details',
          'Brass hardware',
          'Cotton canvas lining',
          'Adjustable shoulder strap',
          'Multiple interior pockets',
          'Reinforced bottom',
        ],
        specifications: {
          dimensions: '20" x 12" x 8"',
          weight: '3.5 lbs',
          material: 'Full-grain Italian leather',
          color: 'Brown',
          capacity: '30L',
        },
        salesHistory: [
          { month: 'Jan', sales: 12, revenue: 3599.88 },
          { month: 'Feb', sales: 18, revenue: 5399.82 },
          { month: 'Mar', sales: 25, revenue: 7499.75 },
          { month: 'Apr', sales: 20, revenue: 5999.8 },
        ],
        recentOrders: [
          {
            id: 'ORD-001',
            customer: 'John Doe',
            date: '2024-03-25',
            quantity: 1,
            total: 254.99,
          },
          {
            id: 'ORD-010',
            customer: 'Alice Brown',
            date: '2024-03-23',
            quantity: 2,
            total: 509.98,
          },
          {
            id: 'ORD-015',
            customer: 'Bob Wilson',
            date: '2024-03-20',
            quantity: 1,
            total: 254.99,
          },
        ],
      },
    };
  },
};
