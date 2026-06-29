// services/orderService.ts

// Sesuaikan domain dan port backend Anda di sini
const BACKEND_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:3000/api';
const BASE_URL = `${BACKEND_URL}/penjual/pesanan`;

// ─── HELPER: ambil token dari localStorage ─────────────────────────────────────
const getAuthHeaders = (): Record<string, string> => {
  const token = localStorage.getItem('token');
  return {
    'Content-Type': 'application/json',
    ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
  };
};

export interface OrderItemSeller {
  id: string;
  customer: string;
  product: string;
  status: 'Pending' | 'Diproses' | 'Selesai';
  courier: string;
  price: number;
  date: string;
}

export interface OrderMetrics {
  avgNilaiPesanan: number;
  totalPesanan: number;
  pesananSelesai: number;
  pesananPending: number;
  komplainAktif: number;
  tingkatKonversi: string;
  ratingToko: string;
  stokRendah: number;
}

export interface UpdateStatusResponse {
  success: boolean;
  message: string;
}

const mapStatus = (dbStatus: string): OrderItemSeller['status'] => {
  const map: Record<string, OrderItemSeller['status']> = {
    pending: 'Pending',
    proses:  'Diproses',
    selesai: 'Selesai',
  };
  return map[dbStatus?.toLowerCase()] ?? 'Pending';
};

const formatDate = (datetime: string): string => {
  if (!datetime) return '-';
  const d = new Date(datetime);
  return d.toLocaleDateString('id-ID', { day: '2-digit', month: '2-digit', year: 'numeric' });
};

const hitungKonversi = (selesai: number, total: number): string => {
  if (!total) return '0.00%';
  return ((selesai / total) * 100).toFixed(2) + '%';
};

export const orderService = {

  async getSellerOrders(search: string = '', status: string = 'Semua'): Promise<OrderItemSeller[]> {
    const params = new URLSearchParams();
    if (search) params.append('search', search);
    if (status && status !== 'Semua') params.append('status', status);

    // Memperbaiki pembentukan query string agar tidak typo
    const queryString = params.toString();
    const url = `${BASE_URL}${queryString ? '?' + queryString : ''}`;
    
    const res = await fetch(url, { headers: getAuthHeaders() });

    const rawText = await res.text();
    if (!res.ok) throw new Error(`HTTP ${res.status}: ${rawText.slice(0, 200)}`);

    let json: any;
    try {
      json = JSON.parse(rawText);
    } catch {
      throw new Error(`Response bukan JSON.\nRaw: ${rawText.slice(0, 300)}`);
    }

    return (json.data as any[]).map((row) => ({
      id:       row.id,
      customer: row.nama_pembeli ?? 'Pelanggan Tidak Dikenal',
      product:  row.nama_produk  ?? 'Produk Tidak Ditemukan',
      status:   mapStatus(row.status),
      courier:  row.jasa_kirim   ?? 'JNE',
      price:    parseFloat(row.total_nilai) || 0,
      date:     formatDate(row.tanggal_pesanan),
    }));
  },

  async getSellerMetrics(): Promise<OrderMetrics> {
    const res = await fetch(`${BASE_URL}/metrics`, { headers: getAuthHeaders() });

    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error((err as any).message || `HTTP error ${res.status}`);
    }

    const json = await res.json();
    const d    = json.data;

    return {
      avgNilaiPesanan: parseFloat(d.avg_nilai_pesanan) || 0,
      totalPesanan:    parseInt(d.total_pesanan)       || 0,
      pesananSelesai:  parseInt(d.pesanan_selesai)     || 0,
      pesananPending:  parseInt(d.pesanan_pending)     || 0,
      komplainAktif:   parseInt(d.komplain_aktif)      || 0,
      tingkatKonversi: hitungKonversi(parseInt(d.pesanan_selesai) || 0, parseInt(d.total_pesanan) || 0),
      ratingToko:      d.rating_toko ? parseFloat(d.rating_toko).toFixed(1) : '0.0',
      stokRendah:      parseInt(d.stok_rendah) || 0,
    };
  },

  async createBulkOrder(payload: {
    items: { id: number; quantity: number; price: number }[];
    discount: number;
    metodePembayaran: string;
  }): Promise<{ success: boolean; message: string; pesananId?: string }> {
    // Diarahkan ke port backend 3000
    const res = await fetch(`${BACKEND_URL}/api/orders/checkout`, {
      method:  'POST',
      headers: getAuthHeaders(),
      body:    JSON.stringify(payload),
    });

    const json = await res.json().catch(() => ({ success: false, message: 'Gagal parsing respons server.' }));
    if (!res.ok) throw new Error((json as any).message || `HTTP error ${res.status}`);

    return {
      success:   (json as any).success,
      message:   (json as any).message,
      pesananId: (json as any).pesananId,
    };
  },

  async updateOrderStatus(orderId: string, newStatus: 'proses' | 'selesai'): Promise<UpdateStatusResponse> {
    const res = await fetch(`${BASE_URL}/${orderId}/status`, {
      method:  'PUT',
      headers: getAuthHeaders(),
      body:    JSON.stringify({ status: newStatus }),
    });

    const json = await res.json().catch(() => ({ success: false, message: 'Gagal parsing respons server.' }));
    if (!res.ok) throw new Error((json as any).message || `HTTP error ${res.status}`);

    return { success: (json as any).success, message: (json as any).message };
  },
};