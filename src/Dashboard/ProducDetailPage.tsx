import { useState } from 'react'
import { orderService } from '../services/orderService' 
import { cartService } from '../services/cartService' // ◄ 1. IMPORT SERVICE KERANJANG BARU

// ─── Types ────────────────────────────────────────────────────────────────────
interface Product {
  id: number
  sku?: string
  nama: string
  harga_dasar: number
  kategori?: string
  brand?: string
  stok_total?: number
  status?: string
  icon?: string
  rating?: number
  reviews?: number
}

interface ProductDetailPageProps {
  product: Product
  onClose: () => void
}

// ─── Star Rating ──────────────────────────────────────────────────────────────
function StarRating({
  rating,
  max = 5,
  size = 13
}: {
  rating: number
  max?: number
  size?: number
}) {
  return (
    <div className="flex gap-0.5">
      {[...Array(max)].map((_, i) => (
        <svg
          key={i}
          width={size}
          height={size}
          viewBox="0 0 24 24"
          fill={i < rating ? '#F5A623' : 'none'}
          stroke={i < rating ? '#F5A623' : '#D1D5DB'}
          strokeWidth="2"
        >
          <polygon points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26" />
        </svg>
      ))}
    </div>
  )
}

// ─── Helper ───────────────────────────────────────────────────────────────────
const formatRupiah = (value: number) => {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    maximumFractionDigits: 0
  }).format(value || 0)
}

// ─── Product Detail Modal ────────────────────────────────────────────────────
export default function ProductDetailPage({
  product,
  onClose
}: ProductDetailPageProps) {
  const [qty, setQty] = useState(1)
  const [addedToCart, setAddedToCart] = useState(false)
  const [loadingOrder, setLoadingOrder] = useState(false) 
  const [loadingCart, setLoadingCart] = useState(false) // ◄ 2. LOADING STATE UNTUK TOMBOL KERANJANG

  // ◄ 3. PERBAIKAN NYATA: Fungsi Tambah ke Keranjang Database
  const handleAddToCart = async () => {
    if ((product.stok_total ?? 0) <= 0) {
      alert('Maaf, produk tidak dapat dimasukkan ke keranjang karena stok habis.');
      return;
    }

    setLoadingCart(true);

    try {
      // Eksekusi pengiriman data ke tabel `keranjang` MySQL
      const response = await cartService.addToCart(product.id, qty);
      
      // Jika backend merespon sukses, nyalakan animasi indikator centang hijau
      setAddedToCart(true);
      setTimeout(() => {
        setAddedToCart(false);
      }, 2000);

    } catch (error: any) {
      alert(error.message || 'Gagal menambahkan produk ke dalam keranjang.');
    } finally {
      setLoadingCart(false);
    }
  }

  const handleBeliSekarang = async () => {
    if ((product.stok_total ?? 0) <= 0) {
      alert('Maaf, stok produk ini sedang habis.');
      return;
    }

    if ((product.stok_total ?? 0) < qty) {
      alert(`Stok tidak mencukupi. Hanya tersisa ${product.stok_total} item.`);
      return;
    }

    const konfirmasi = window.confirm(`Apakah kamu yakin ingin membeli sebanyak ${qty} unit ${product.nama}?`);
    if (!konfirmasi) return;

    setLoadingOrder(true);

    try {
      const response = await orderService.createOrder({
        produk_id: product.id,
        jumlah: qty,
        harga_satuan: product.harga_dasar
      });

      alert(response.message); 
      onClose(); 
      window.location.reload(); 

    } catch (error: any) {
      alert(error.message || 'Gagal memproses transaksi.');
    } finally {
      setLoadingOrder(false);
    }
  }

  const specs = [
    { label: 'SKU', value: product.sku || '-' },
    { label: 'Kategori', value: product.kategori || '-' },
    { label: 'Brand', value: product.brand || '-' },
    { label: 'Stok', value: product.stok_total ?? 0 },
    { label: 'Status', value: product.status || '-' }
  ]

  return (
    <div
      className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-2 sm:p-4"
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          onClose()
        }
      }}
    >
      {/* MODAL */}
      <div
        className="bg-[#F2F3F7] w-full max-w-5xl max-h-[95vh] rounded-2xl overflow-hidden shadow-2xl flex flex-col"
        style={{ animation: 'slideUp 0.25s ease-out' }}
      >
        {/* ── HEADER ── */}
        <div className="bg-white border-b border-stone-200 px-4 py-3 flex items-center justify-between shrink-0">
          <div className="min-w-0">
            <p className="text-[10px] text-stone-400 uppercase tracking-wider font-bold mb-1">
              Product Detail
            </p>
            <h2 className="text-sm sm:text-base font-black text-[#1A1A1A] truncate">
              {product.nama}
            </h2>
          </div>

          {/* CLOSE */}
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-stone-100 hover:bg-stone-200 flex items-center justify-center transition-colors shrink-0"
          >
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#6B7280" strokeWidth="2.5" strokeLinecap="round">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        {/* ── BODY ── */}
        <div className="overflow-y-auto flex-1">
          <div className="p-4 sm:p-5 grid grid-cols-1 lg:grid-cols-[1fr_1.1fr_280px] gap-4">

            {/* ───────────────── IMAGE ───────────────── */}
            <div className="flex flex-col gap-3">
              <div className="bg-white rounded-2xl border border-stone-100 shadow-sm aspect-[4/3] flex items-center justify-center relative overflow-hidden group">
                <div className="absolute inset-0 bg-gradient-to-br from-stone-50 to-stone-100" />
                <div className="absolute inset-0 bg-gradient-to-br from-[#C84B31]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                {product.icon ? (
                  <img
                    src={`http://localhost:3000${product.icon}`}
                    alt={product.nama}
                    className="w-full h-full object-cover z-10"
                  />
                ) : (
                  <span className="text-7xl sm:text-8xl drop-shadow-lg z-10 transition-transform duration-300 group-hover:scale-105">
                    💻
                  </span>
                )}
              </div>

              {/* BRAND CARD */}
              <div className="bg-white rounded-2xl border border-stone-100 shadow-sm p-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-[#FDF0EC] flex items-center justify-center text-2xl">
                    🏪
                  </div>
                  <div>
                    <p className="text-[10px] text-stone-400 font-bold uppercase tracking-wider">
                      Official Store
                    </p>
                    <p className="text-sm font-bold text-[#1A1A1A]">
                      {product.brand || 'ASAS Official'}
                    </p>
                    <div className="flex items-center gap-2 mt-1">
                      <StarRating rating={product.rating || 4} size={11} />
                      <span className="text-[10px] text-stone-400">
                        ({product.reviews || 0})
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* ───────────────── CENTER ───────────────── */}
            <div className="flex flex-col gap-4">
              <div>
                <div className="inline-flex items-center gap-1.5 mb-2">
                  <span className="bg-[#C84B31] text-white text-[9px] font-black uppercase tracking-widest px-2 py-0.5 rounded">
                    Official
                  </span>
                  <span
                    className={`text-[9px] font-bold px-2 py-0.5 rounded ${
                      product.status === 'Active'
                        ? 'bg-green-100 text-green-700'
                        : 'bg-stone-200 text-stone-600'
                    }`}
                  >
                    {product.status || 'Unknown'}
                  </span>
                </div>

                <h1 className="text-xl sm:text-2xl font-black text-[#1A1A1A] leading-tight mb-2">
                  {product.nama}
                </h1>

                <div className="flex items-center gap-2 mb-3">
                  <StarRating rating={product.rating || 4} size={15} />
                  <span className="text-xs text-[#C84B31] font-semibold">
                    {product.reviews || 0} Ulasan
                  </span>
                </div>

                <p className="text-3xl sm:text-4xl font-black text-[#C84B31]">
                  {formatRupiah(product.harga_dasar)}
                </p>

                <p className="text-[11px] text-stone-400 mt-1">
                  Harga sudah termasuk pajak
                </p>
              </div>

              {/* DESCRIPTION */}
              <div className="bg-white rounded-2xl border border-stone-100 shadow-sm p-4">
                <h3 className="text-sm font-bold text-[#1A1A1A] mb-3">
                  Deskripsi Produk
                </h3>
                <p className="text-xs text-stone-500 leading-relaxed">
                  {product.nama} merupakan produk berkualitas dari{' '}
                  {product.brand || 'ASAS Official Store'}.
                  Produk ini tersedia dengan stok terbaru dan siap digunakan
                  untuk kebutuhan harian maupun profesional.
                </p>
              </div>

              {/* SPEC */}
              <div className="bg-white rounded-2xl border border-stone-100 shadow-sm overflow-hidden">
                <div className="px-4 py-3 bg-stone-50 border-b border-stone-100">
                  <p className="text-xs font-bold text-stone-500 uppercase tracking-wider">
                    Spesifikasi Produk
                  </p>
                </div>

                <table className="w-full text-xs">
                  <tbody>
                    {specs.map((spec, index) => (
                      <tr key={spec.label} className={index % 2 === 0 ? 'bg-white' : 'bg-stone-50/50'}>
                        <td className="px-4 py-3 text-stone-500 font-medium w-[40%]">
                          {spec.label}
                        </td>
                        <td className="px-4 py-3 text-[#1A1A1A] font-semibold">
                          {spec.value}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* ───────────────── RIGHT ───────────────── */}
            <div className="flex flex-col gap-3">
              {/* PURCHASE */}
              <div className="bg-white rounded-2xl border border-stone-100 shadow-sm p-4 flex flex-col gap-4">
                {/* STOCK */}
                <div>
                  <p className="text-[10px] font-bold text-stone-500 uppercase tracking-wider mb-2">
                    Stok Tersedia
                  </p>
                  <p className="text-lg font-black text-[#1A1A1A]">
                    {product.stok_total ?? 0}
                  </p>
                </div>

                {/* QTY */}
                <div>
                  <p className="text-[10px] font-bold text-stone-500 uppercase tracking-wider mb-2">
                    Jumlah
                  </p>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setQty((q) => Math.max(1, q - 1))}
                      className="w-8 h-8 rounded-lg border-2 border-stone-200 flex items-center justify-center font-bold hover:bg-stone-50"
                    >
                      −
                    </button>

                    <span className="w-10 text-center font-bold text-[#1A1A1A]">
                      {qty}
                    </span>

                    <button
                      onClick={() => setQty((q) => q + 1)}
                      className="w-8 h-8 rounded-lg border-2 border-stone-200 flex items-center justify-center font-bold hover:bg-stone-50"
                    >
                      +
                    </button>
                  </div>
                </div>

                {/* BUTTON BELI SEKARANG */}
                <button 
                  onClick={handleBeliSekarang}
                  disabled={loadingOrder || (product.stok_total ?? 0) <= 0}
                  className="w-full py-2.5 rounded-xl bg-[#C84B31] hover:bg-[#B03D26] text-white text-sm font-black tracking-wide shadow-md shadow-[#C84B31]/30 transition-all active:scale-[0.97] disabled:bg-stone-400 disabled:shadow-none disabled:cursor-not-allowed"
                >
                  {loadingOrder ? 'Memproses...' : (product.stok_total ?? 0) <= 0 ? 'Stok Habis' : 'Beli Sekarang'}
                </button>

                {/* ◄ 4. UPDATE INTERAKSI TOMBOL TAMBAH KE KERANJANG */}
                <button
                  onClick={handleAddToCart}
                  disabled={loadingCart || (product.stok_total ?? 0) <= 0}
                  className={`w-full py-2.5 rounded-xl border-2 text-sm font-bold transition-all active:scale-[0.97] disabled:bg-stone-100 disabled:border-stone-300 disabled:text-stone-400 disabled:cursor-not-allowed ${
                    addedToCart
                      ? 'border-green-500 bg-green-50 text-green-600'
                      : 'border-[#C84B31] text-[#C84B31] hover:bg-[#FDF0EC]'
                  }`}
                >
                  {loadingCart
                    ? 'Menyimpan...'
                    : addedToCart
                    ? '✓ Ditambahkan!'
                    : 'Tambah ke Keranjang'}
                </button>
              </div>

              {/* STATUS CARD */}
              <div className="bg-white rounded-2xl border border-stone-100 shadow-sm p-4">
                <h3 className="text-xs font-bold text-stone-500 uppercase tracking-wider mb-3">
                  Informasi Produk
                </h3>

                <div className="space-y-2 text-xs">
                  <div className="flex justify-between">
                    <span className="text-stone-400">SKU</span>
                    <span className="font-semibold text-[#1A1A1A]">
                      {product.sku || '-'}
                    </span>
                  </div>

                  <div className="flex justify-between">
                    <span className="text-stone-400">Kategori</span>
                    <span className="font-semibold text-[#1A1A1A]">
                      {product.kategori || '-'}
                    </span>
                  </div>

                  <div className="flex justify-between">
                    <span className="text-stone-400">Status</span>
                    <span className="font-semibold text-[#1A1A1A]">
                      {product.status || '-'}
                    </span>
                  </div>
                </div>
              </div>

            </div>

          </div>
        </div>
      </div>

      <style>{`
        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(20px) scale(0.98);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }
      `}</style>

    </div>
  )
}