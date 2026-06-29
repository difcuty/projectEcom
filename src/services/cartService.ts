// Mengambil Base URL dari environment variables Vite, dengan fallback ke localhost
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';
const CART_URL = `${API_BASE_URL}/cart`;

// 1. Interface untuk struktur data item keranjang di Frontend
export interface CartItem {
  id: number;          // ID Baris Keranjang (Primary Key dari tabel keranjang)
  produk_id: number;   // ID Produk asli
  name: string;        // Nama produk (Hasil JOIN dari tabel produk)
  price: number;       // Harga produk
  image: string;       // Icon/Gambar produk
  quantity: number;    // Jumlah item yang dibeli
}

// 2. Interface standar untuk respons umum dari Backend Express
export interface BaseResponse {
  success: boolean;
  message: string;
}

export const cartService = {
  // =========================================================================
  // A. Ambil semua item keranjang dari database berdasarkan token login
  // =========================================================================
  async getCart(): Promise<CartItem[]> {
    const token = localStorage.getItem('token');
    if (!token) throw new Error('Silakan login terlebih dahulu untuk melihat keranjang.');

    try {
      const response = await fetch(CART_URL, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      const result = await response.json();
      if (!response.ok) throw new Error(result.message || 'Gagal mengambil data keranjang.');
      
      // Karena backend sudah mereturn k.jumlah AS quantity, kita langsung petakan ke item.quantity
      // Penggunaan Number() tetap dipertahankan sebagai lapisan keamanan tambahan (Type Safety)
      const mappedData: CartItem[] = result.data.map((item: any) => ({
        id: item.id,
        produk_id: item.produk_id,
        name: item.name,
        price: Number(item.price),      
        image: item.image,
        quantity: Number(item.quantity) // ◄ Membaca 'quantity' langsung dari backend
      }));

      return mappedData;
    } catch (error: any) {
      throw new Error(error.message || 'Terjadi gangguan jaringan saat menghubungi server.');
    }
  },

  // =========================================================================
  // B. Tambah produk ke keranjang belanja
  // =========================================================================
  async addToCart(produkId: number, jumlah: number = 1): Promise<BaseResponse> {
    const token = localStorage.getItem('token');
    if (!token) throw new Error('Silakan login terlebih dahulu untuk menambah barang.');

    try {
      const response = await fetch(CART_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ produk_id: produkId, jumlah }),
      });

      const result = await response.json();
      if (!response.ok) throw new Error(result.message || 'Gagal menambahkan produk ke keranjang.');
      
      return result;
    } catch (error: any) {
      throw new Error(error.message || 'Terjadi gangguan jaringan saat menghubungi server.');
    }
  },

  // =========================================================================
  // C. Update jumlah item (Ditembak saat menekan tombol + atau -)
  // =========================================================================
  async updateQuantity(cartId: number, jumlah: number): Promise<BaseResponse> {
    const token = localStorage.getItem('token');
    if (!token) throw new Error('Sesi login tidak valid.');

    try {
      const response = await fetch(`${CART_URL}/${cartId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ jumlah }), // Dikirim sebagai 'jumlah' karena backend di req.body mencarinya dengan nama itu
      });

      const result = await response.json();
      if (!response.ok) throw new Error(result.message || 'Gagal memperbarui kuantitas item.');
      
      return result;
    } catch (error: any) {
      throw new Error(error.message || 'Terjadi gangguan jaringan saat memperbarui keranjang.');
    }
  },

  // =========================================================================
  // D. Hapus item dari keranjang (Ditembak saat menekan tombol ikon Trash)
  // =========================================================================
  async removeFromCart(cartId: number): Promise<BaseResponse> {
    const token = localStorage.getItem('token');
    if (!token) throw new Error('Sesi login tidak valid.');

    try {
      const response = await fetch(`${CART_URL}/${cartId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      const result = await response.json();
      if (!response.ok) throw new Error(result.message || 'Gagal menghapus produk dari keranjang.');
      
      return result;
    } catch (error: any) {
      throw new Error(error.message || 'Terjadi gangguan jaringan saat menghapus item.');
    }
  }
};