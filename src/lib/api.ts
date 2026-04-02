const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const getToken = (): string | null => localStorage.getItem('biralstore_token');

const headers = (withAuth = false): HeadersInit => {
  const h: HeadersInit = { 'Content-Type': 'application/json' };
  if (withAuth) {
    const token = getToken();
    if (token) h['Authorization'] = `Bearer ${token}`;
  }
  return h;
};

const handleResponse = async (res: Response) => {
  let data;
  try {
    const text = await res.text();
    data = text ? JSON.parse(text) : {};
  } catch (err) {
    if (!res.ok) throw new Error('Sistemdə kiçik yenilənmə gedir (Təqribən 1 dəqiqə), zəhmət olmasa birazdan təkrar yoxlayın.');
    console.error('JSON parse error:', err);
    throw new Error('Serverdən etibarsız məlumat gəldi');
  }

  if (!res.ok) throw new Error(data.error || 'Xəta baş verdi');
  return data;
};

// ─── AUTH ──────────────────────────────────────
export const authAPI = {
  register: async (body: { firstName: string; lastName: string; email: string; username?: string; phone?: string; password: string }) => {
    const res = await fetch(`${API_URL}/auth/register`, { method: 'POST', headers: headers(), body: JSON.stringify(body) });
    return handleResponse(res);
  },
  login: async (body: { email: string; password: string }) => {
    const res = await fetch(`${API_URL}/auth/login`, { method: 'POST', headers: headers(), body: JSON.stringify(body) });
    return handleResponse(res);
  },
  getMe: async () => {
    const res = await fetch(`${API_URL}/auth/me`, { headers: headers(true) });
    return handleResponse(res);
  },
  updateProfile: async (body: Record<string, unknown>) => {
    const res = await fetch(`${API_URL}/auth/profile`, { method: 'PUT', headers: headers(true), body: JSON.stringify(body) });
    return handleResponse(res);
  },
  verifyEmail: async (code: string) => {
    const res = await fetch(`${API_URL}/auth/verify-email`, { method: 'POST', headers: headers(true), body: JSON.stringify({ code }) });
    return handleResponse(res);
  },
  resendOTP: async () => {
    const res = await fetch(`${API_URL}/auth/resend-otp`, { method: 'POST', headers: headers(true) });
    return handleResponse(res);
  },
};

// ─── PRODUCTS ──────────────────────────────────
export const productsAPI = {
  getAll: async (params?: Record<string, string>) => {
    const query = params ? '?' + new URLSearchParams(params).toString() : '';
    const res = await fetch(`${API_URL}/products${query}`);
    return handleResponse(res);
  },
  getById: async (id: string) => {
    const res = await fetch(`${API_URL}/products/${id}`);
    return handleResponse(res);
  },
  getCategories: async () => {
    const res = await fetch(`${API_URL}/products/categories`);
    return handleResponse(res);
  },
  search: async (q: string) => {
    const res = await fetch(`${API_URL}/products?search=${encodeURIComponent(q)}`);
    return handleResponse(res);
  },
};

// ─── ORDERS ────────────────────────────────────
export const ordersAPI = {
  create: async (body: Record<string, unknown>) => {
    const res = await fetch(`${API_URL}/orders`, { method: 'POST', headers: headers(true), body: JSON.stringify(body) });
    return handleResponse(res);
  },
  getAll: async () => {
    const res = await fetch(`${API_URL}/orders`, { headers: headers(true) });
    return handleResponse(res);
  },
  getById: async (id: string) => {
    const res = await fetch(`${API_URL}/orders/${id}`, { headers: headers(true) });
    return handleResponse(res);
  },
};

// ─── USER (wishlist, addresses, cards, tickets) ──
export const userAPI = {
  // Wishlist
  getWishlist: async () => {
    const res = await fetch(`${API_URL}/users/wishlist`, { headers: headers(true) });
    return handleResponse(res);
  },
  toggleWishlist: async (productId: string) => {
    const res = await fetch(`${API_URL}/users/wishlist/${productId}`, { method: 'POST', headers: headers(true) });
    return handleResponse(res);
  },

  // Addresses
  getAddresses: async () => {
    const res = await fetch(`${API_URL}/users/addresses`, { headers: headers(true) });
    return handleResponse(res);
  },
  addAddress: async (body: Record<string, unknown>) => {
    const res = await fetch(`${API_URL}/users/addresses`, { method: 'POST', headers: headers(true), body: JSON.stringify(body) });
    return handleResponse(res);
  },
  updateAddress: async (id: string, body: Record<string, unknown>) => {
    const res = await fetch(`${API_URL}/users/addresses/${id}`, { method: 'PUT', headers: headers(true), body: JSON.stringify(body) });
    return handleResponse(res);
  },
  deleteAddress: async (id: string) => {
    const res = await fetch(`${API_URL}/users/addresses/${id}`, { method: 'DELETE', headers: headers(true) });
    return handleResponse(res);
  },
  setDefaultAddress: async (id: string) => {
    const res = await fetch(`${API_URL}/users/addresses/${id}/default`, { method: 'PUT', headers: headers(true) });
    return handleResponse(res);
  },

  // Cards
  getCards: async () => {
    const res = await fetch(`${API_URL}/users/cards`, { headers: headers(true) });
    return handleResponse(res);
  },
  addCard: async (body: Record<string, unknown>) => {
    const res = await fetch(`${API_URL}/users/cards`, { method: 'POST', headers: headers(true), body: JSON.stringify(body) });
    return handleResponse(res);
  },
  deleteCard: async (id: string) => {
    const res = await fetch(`${API_URL}/users/cards/${id}`, { method: 'DELETE', headers: headers(true) });
    return handleResponse(res);
  },

  // Tickets
  getTickets: async () => {
    const res = await fetch(`${API_URL}/users/tickets`, { headers: headers(true) });
    return handleResponse(res);
  },
  createTicket: async (body: { subject: string; message: string }) => {
    const res = await fetch(`${API_URL}/users/tickets`, { method: 'POST', headers: headers(true), body: JSON.stringify(body) });
    return handleResponse(res);
  },
};

// ─── ADMIN ──────────────────────────────────────
export const adminAPI = {
  // Upload
  uploadImage: async (file: File) => {
    const formData = new FormData();
    formData.append('image', file);
    const token = getToken();
    const h: HeadersInit = {};
    if (token) h['Authorization'] = `Bearer ${token}`;
    const res = await fetch(`${API_URL}/upload`, { method: 'POST', headers: h, body: formData });
    return handleResponse(res);
  },

  // Products
  createProduct: async (body: Record<string, unknown>) => {
    const res = await fetch(`${API_URL}/products`, { method: 'POST', headers: headers(true), body: JSON.stringify(body) });
    return handleResponse(res);
  },
  updateProduct: async (id: string, body: Record<string, unknown>) => {
    const res = await fetch(`${API_URL}/products/${id}`, { method: 'PUT', headers: headers(true), body: JSON.stringify(body) });
    return handleResponse(res);
  },
  deleteProduct: async (id: string) => {
    const res = await fetch(`${API_URL}/products/${id}`, { method: 'DELETE', headers: headers(true) });
    return handleResponse(res);
  },

  // Orders
  getAllOrders: async () => {
    const res = await fetch(`${API_URL}/orders/admin/all`, { headers: headers(true) });
    return handleResponse(res);
  },
  updateOrderStatus: async (id: string, status: string) => {
    const res = await fetch(`${API_URL}/orders/${id}/status`, { method: 'PUT', headers: headers(true), body: JSON.stringify({ status }) });
    return handleResponse(res);
  },

  // Categories
  getAllCategories: async () => {
    const res = await fetch(`${API_URL}/categories`);
    return handleResponse(res);
  },
  createCategory: async (body: Record<string, unknown>) => {
    const res = await fetch(`${API_URL}/categories`, { method: 'POST', headers: headers(true), body: JSON.stringify(body) });
    return handleResponse(res);
  },
  updateCategory: async (id: string, body: Record<string, unknown>) => {
    const res = await fetch(`${API_URL}/categories/${id}`, { method: 'PUT', headers: headers(true), body: JSON.stringify(body) });
    return handleResponse(res);
  },
  deleteCategory: async (id: string) => {
    const res = await fetch(`${API_URL}/categories/${id}`, { method: 'DELETE', headers: headers(true) });
    return handleResponse(res);
  },

  // Users
  getAllUsers: async () => {
    const res = await fetch(`${API_URL}/users/admin/all`, { headers: headers(true) });
    return handleResponse(res);
  },
  updateUserStatus: async (id: string, status: string) => {
    const res = await fetch(`${API_URL}/users/admin/${id}/status`, { method: 'PUT', headers: headers(true), body: JSON.stringify({ status }) });
    return handleResponse(res);
  },
  deleteUser: async (id: string) => {
    const res = await fetch(`${API_URL}/users/admin/${id}`, { method: 'DELETE', headers: headers(true) });
    return handleResponse(res);
  }
};

export const articlesAPI = {
  getAll: async (params?: { status?: string, limit?: number }) => {
    const q = new URLSearchParams(params as any).toString();
    const res = await fetch(`${API_URL}/articles${q ? `?${q}` : ''}`);
    return handleResponse(res);
  },
  getBySlug: async (slug: string) => {
    const res = await fetch(`${API_URL}/articles/${slug}`);
    return handleResponse(res);
  },
  create: async (body: Record<string, unknown>) => {
    const res = await fetch(`${API_URL}/articles`, { method: 'POST', headers: headers(true), body: JSON.stringify(body) });
    return handleResponse(res);
  },
  update: async (id: string, body: Record<string, unknown>) => {
    const res = await fetch(`${API_URL}/articles/${id}`, { method: 'PUT', headers: headers(true), body: JSON.stringify(body) });
    return handleResponse(res);
  },
  delete: async (id: string) => {
    const res = await fetch(`${API_URL}/articles/${id}`, { method: 'DELETE', headers: headers(true) });
    return handleResponse(res);
  },
};
