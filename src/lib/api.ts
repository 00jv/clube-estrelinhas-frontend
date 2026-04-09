const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3333';

type RequestOptions = {
  method?: string;
  body?: unknown;
  token?: string;
};

async function request<T>(path: string, options: RequestOptions = {}): Promise<T> {
  const { method = 'GET', body, token } = options;

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const res = await fetch(`${API_URL}${path}`, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
    cache: 'no-store',
  });

  if (!res.ok) {
    const error = await res.json().catch(() => ({}));
    throw new Error((error as { error?: string }).error || `HTTP ${res.status}`);
  }

  return res.json();
}

// ─── Products ──────────────────────────────────────────────────────────────

export async function getProducts(params?: { category?: string; tag?: string; search?: string }) {
  const qs = params ? '?' + new URLSearchParams(params as Record<string, string>).toString() : '';
  return request<Product[]>(`/api/products${qs}`);
}

export async function getProductBySlug(slug: string) {
  return request<Product>(`/api/products/slug/${slug}`);
}

export async function getProductById(id: string, token: string) {
  return request<Product>(`/api/products/id/${id}`, { token });
}

export async function createProduct(data: CreateProductPayload, token: string) {
  return request<Product>('/api/products', { method: 'POST', body: data, token });
}

export async function updateProduct(id: string, data: Partial<CreateProductPayload>, token: string) {
  return request<Product>(`/api/products/${id}`, { method: 'PUT', body: data, token });
}

export async function deleteProduct(id: string, token: string) {
  const res = await fetch(`${API_URL}/api/products/${id}`, {
    method: 'DELETE',
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) throw new Error('Erro ao excluir produto');
}

// ─── Upload ─────────────────────────────────────────────────────────────────

export async function uploadImage(file: File, token: string): Promise<{ url: string }> {
  const formData = new FormData();
  formData.append('image', file);

  const res = await fetch(`${API_URL}/api/upload`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}` },
    body: formData,
  });

  if (!res.ok) throw new Error('Erro ao fazer upload da imagem');
  return res.json();
}

// ─── Orders ─────────────────────────────────────────────────────────────────

export async function getOrders(token: string) {
  return request<Order[]>('/api/orders', { token });
}

export async function getOrderById(id: string, token: string) {
  return request<Order>(`/api/orders/${id}`, { token });
}

export async function createOrder(data: CreateOrderPayload, token?: string) {
  return request<Order>('/api/orders', { method: 'POST', body: data, token });
}

export async function updateOrderStatus(id: string, status: string, token: string) {
  return request<Order>(`/api/orders/${id}/status`, { method: 'PUT', body: { status }, token });
}

// ─── Dashboard ───────────────────────────────────────────────────────────────

export async function getDashboardStats(token: string) {
  return request<DashboardStats>('/api/dashboard/stats', { token });
}

// ─── Auth ────────────────────────────────────────────────────────────────────

export async function loginUser(email: string, password: string) {
  const API = process.env.NEXT_PUBLIC_API_URL || process.env.API_URL || 'http://localhost:3333';
  const res = await fetch(`${API}/api/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });
  if (!res.ok) {
    const error = await res.json().catch(() => ({}));
    throw new Error((error as { error?: string }).error || 'Credenciais inválidas');
  }
  return res.json() as Promise<{ token: string; user: AuthUser }>;
}

export async function registerUser(data: { 
  name: string; 
  email: string; 
  password: string;
  phone?: string;
  zipCode?: string;
  street?: string;
  number?: string;
  complement?: string;
  neighborhood?: string;
  city?: string;
  state?: string;
  bust?: number;
  waist?: number;
  hips?: number;
}) {
  return request<AuthUser>('/api/auth/register', { method: 'POST', body: data });
}

export async function getProfile(token: string) {
  return request<AuthUser>('/api/auth/me', { token });
}

export async function getMyOrders(token: string) {
  return request<Order[]>('/api/orders/me', { token });
}

export async function updateProfile(data: Partial<AuthUser>, token: string) {
  return request<AuthUser>('/api/auth/profile', { method: 'PUT', body: data, token });
}

// ─── Types ───────────────────────────────────────────────────────────────────

export interface Product {
  id: string;
  name: string;
  slug: string;
  price: number;
  image: string;
  tag?: string | null;
  category: string;
  description: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateProductPayload {
  name: string;
  slug: string;
  price: number;
  image: string;
  tag?: string | null;
  category: string;
  description: string;
}

export interface OrderItem {
  id: string;
  productId: string;
  quantity: number;
  price: number;
  product?: Product;
}

export interface Order {
  id: string;
  customerName: string;
  email?: string | null;
  phone?: string | null;
  
  // Address
  zipCode?: string | null;
  street?: string | null;
  number?: string | null;
  complement?: string | null;
  neighborhood?: string | null;
  city?: string | null;
  state?: string | null;

  // Measurements
  bust?: number | null;
  waist?: number | null;
  hips?: number | null;

  totalAmount: number;
  status: 'PENDING' | 'PAID' | 'PREPARING' | 'SHIPPED' | 'COMPLETED' | 'CANCELLED';
  createdAt: string;
  items: OrderItem[];
}

export interface CreateOrderPayload {
  userId?: string;
  customerName: string;
  email?: string;
  phone?: string;
  
  // Endereço
  zipCode?: string;
  street?: string;
  number?: string;
  complement?: string;
  neighborhood?: string;
  city?: string;
  state?: string;

  // Medidas
  bust?: number;
  waist?: number;
  hips?: number;

  items: { productId: string; quantity: number }[];
}

export interface DashboardStats {
  totalOrders: number;
  totalProducts: number;
  totalRevenue: number;
  recentOrders: Order[];
}

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  role: 'ADMIN' | 'USER';
  phone?: string;
  zipCode?: string;
  street?: string;
  number?: string;
  complement?: string;
  neighborhood?: string;
  city?: string;
  state?: string;
  bust?: number;
  waist?: number;
  hips?: number;
}
