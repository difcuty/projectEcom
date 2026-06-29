// Sesuaikan base URL dengan port backend kamu (Misal Port 3000 atau 5000)
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api';

// ── INTERFACES FOR BUYER ──
interface CreateOrderPayload {
  produk_id: number;
  jumlah: number;
  harga_satuan: number;
}

interface CreateBulkOrderPayload {
  items: {
    id: number;       
    quantity: number; 
    price: number;    
  }[];
  discount: number;
  metodePembayaran: string; 
}

interface OrderResponse {
  success: boolean;
  message: string;
  pesananId?: string;
}

// Interface baru untuk riwayat pesanan pembeli
export interface BuyerOrderItem {
  id: string;
  date: string;
  productName: string;
  image: string;
  quantity: number;
  totalPrice: number;
  status: 'pending' | 'proses' | 'selesai'; // Sesuai ENUM di database
}

// ── INTERFACES FOR SELLER MANAGEMENT ──
export interface OrderItemSeller {
  id: string;
  customer: string;
  product: string;
  status: 'pending' | 'proses' | 'selesai';
  courier: string;
  price: number;
  date: string;
}

export interface OrderMetrics {
  avgNilaiPesanan: number;
  totalPesanan: number;
  komplainAktif: number;
  stokRendah: number;
  tingkatKonversi: string;
  ratingToko: string;
}

interface SellerListResponse {
  success: boolean;
  data: OrderItemSeller[];
}

interface SellerMetricsResponse {
  success: boolean;
  data: OrderMetrics;
}

interface UpdateStatusResponse {
  success: boolean;
  message: string;
}

// ── EXPORTED SERVICE ──
export const orderService = {
  
  // ========================================================
  // 1. SISI PEMBELI (BUYER WORKFLOW)
  // ========================================================
  
  // Tetap menggunakan /orders/checkout karena dicover oleh orderRoutes
  createOrder: async (payload: CreateOrderPayload): Promise<OrderResponse> => {
    const token = localStorage.getItem('token');
    if (!token) throw new Error('Kamu harus masuk/login terlebih dahulu untuk membeli produk!');

    const response = await fetch(`${API_BASE_URL}/orders/checkout`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(payload),
    });

    const result = await response.json();
    if (!response.ok) throw new Error(result.message || 'Gagal memproses pesanan ke server.');
    return result;
  },

  // DIUBAH: Menggunakan endpoint /bills/bulk-checkout sesuai billRoutes backend
  createBulkOrder: async (payload: CreateBulkOrderPayload): Promise<OrderResponse> => {
    const token = localStorage.getItem('token');
    if (!token) throw new Error('Kamu harus masuk/login terlebih dahulu untuk melakukan transaksi!');

    const response = await fetch(`${API_BASE_URL}/bills/bulk-checkout`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(payload),
    });

    const result = await response.json();
    if (!response.ok) throw new Error(result.message || 'Gagal memproses pembayaran keranjang ke server.');
    return result;
  },

  // DIUBAH: Menggunakan endpoint /bills/history sesuai billRoutes backend
  getBuyerHistory: async (): Promise<BuyerOrderItem[]> => {
    const token = localStorage.getItem('token');
    if (!token) throw new Error('Silakan login terlebih dahulu untuk melihat pesanan.');

    const response = await fetch(`${API_BASE_URL}/bills/history`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      }
    });

    const result = await response.json();
    if (!response.ok || !result.success) {
      throw new Error(result.message || 'Gagal memuat data pesanan');
    }
    
    return result.data;
  },

  // ========================================================
  // 2. SISI PENJUAL (SELLER WORKFLOW - OrderManagement)
  // ========================================================

  // DIUBAH: Menggunakan endpoint /penjual/pesanan sesuai orderRoutesPenjual di backend
  getSellerOrders: async (search?: string, status?: string): Promise<OrderItemSeller[]> => {
    const params = new URLSearchParams();
    if (search) params.append('search', search);
    if (status) params.append('status', status);

    const response = await fetch(`${API_BASE_URL}/penjual/pesanan/list?${params.toString()}`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' }
    });

    const result: SellerListResponse = await response.json();
    if (!response.ok) throw new Error(response.statusText || 'Gagal mengambil daftar pesanan penjual.');
    return result.data;
  },

  // DIUBAH: Menggunakan endpoint /penjual/pesanan sesuai orderRoutesPenjual di backend
  getSellerMetrics: async (): Promise<OrderMetrics> => {
    const response = await fetch(`${API_BASE_URL}/penjual/pesanan/metrics`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' }
    });

    const result: SellerMetricsResponse = await response.json();
    if (!response.ok) throw new Error(response.statusText || 'Gagal mengambil data statistik.');
    return result.data;
  },

  // DIUBAH: Menggunakan endpoint /penjual/pesanan sesuai orderRoutesPenjual di backend
  updateOrderStatus: async (orderId: string, nextStatus: 'proses' | 'selesai'): Promise<UpdateStatusResponse> => {
    const response = await fetch(`${API_BASE_URL}/penjual/pesanan/${orderId}/status`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: nextStatus }),
    });

    const result: UpdateStatusResponse = await response.json();
    if (!response.ok) throw new Error(result.message || 'Gagal memperbarui status pesanan di server.');
    return result;
  }
};