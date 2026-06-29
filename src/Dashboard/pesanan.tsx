import { useState, useEffect } from 'react'
import { orderService, type BuyerOrderItem } from '../services/billService' // Sesuaikan path import

export default function Pesanan() {
  const [orders, setOrders] = useState<BuyerOrderItem[]>([])
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)

  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState('Semua')

  // ── AMBIL DATA DARI BACKEND SAAT KOMPONEN DIMUAT ──
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setLoading(true)
        const data = await orderService.getBuyerHistory()
        setOrders(data)
      } catch (err: any) {
        setError(err.message || 'Terjadi gangguan saat mengambil data pesanan.')
      } finally {
        setLoading(false)
      }
    }

    fetchOrders()
  }, [])

  // Helper format mata uang Rupiah
  const formatRupiah = (num: number) => {
    return 'Rp ' + num.toLocaleString('id-ID')
  }

  // Filter logika pencarian dan status drop-down
  const filteredOrders = orders.filter((order) => {
    const matchesSearch =
      order.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.productName.toLowerCase().includes(searchQuery.toLowerCase())

    // Menyesuaikan value dropdown dengan ENUM database (pending, proses, selesai)
    const matchesStatus =
      statusFilter === 'Semua' || order.status === statusFilter

    return matchesSearch && matchesStatus
  })

  return (
    <div className="p-4 sm:p-6 bg-[#F2F3F7] min-h-[calc(100vh-57px)] font-sans text-[#1A1A1A]">
      <div className="bg-white rounded-2xl border border-stone-200 shadow-sm p-4 mb-4">
        
        {/* Header Judul */}
        <h1 className="text-lg font-black tracking-tight text-[#1A1A1A] pb-3 border-b border-stone-100 mb-4">
          Daftar Pesanan Saya - Laptop & Aksesoris
        </h1>

        {/* ── SEKTOR FILTER & PENCARIAN ── */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 mb-5">
          <div className="flex-1 flex flex-col gap-1">
            <label className="text-xs font-bold text-stone-600">Cari Pesanan</label>
            <div className="relative">
              <input
                type="text"
                placeholder="Cari berdasarkan nomor pesanan atau nama produk..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-2 rounded-xl border border-stone-300 text-xs bg-stone-50/50 text-[#1A1A1A] placeholder-stone-400 focus:outline-none focus:border-[#C84B31] focus:ring-1 focus:ring-[#C84B31] transition-all"
              />
              <div className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
                </svg>
              </div>
            </div>
          </div>

          <div className="w-full sm:w-56 flex flex-col gap-1">
            <label className="text-xs font-bold text-stone-600">Status Pesanan</label>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-stone-300 text-xs bg-stone-50/50 text-[#1A1A1A] focus:outline-none focus:border-[#C84B31] transition-all"
            >
              <option value="Semua">Semua</option>
              <option value="pending">Menunggu</option>
              <option value="proses">Diproses / Dikirim</option>
              <option value="selesai">Selesai</option>
            </select>
          </div>
        </div>

        {/* ── KONDISI LOADING, ERROR, ATAU TABEL ── */}
        {loading ? (
          <div className="py-20 flex flex-col items-center justify-center gap-3">
             <div className="w-6 h-6 border-4 border-stone-200 border-t-[#C84B31] rounded-full animate-spin"></div>
             <p className="text-xs font-bold text-stone-500 animate-pulse">Memuat riwayat transaksi...</p>
          </div>
        ) : error ? (
          <div className="py-20 text-center text-sm font-bold text-red-500 bg-red-50 rounded-xl border border-red-100">
            {error}
          </div>
        ) : (
          <div className="overflow-x-auto border border-stone-200 rounded-xl">
            <table className="w-full text-left border-collapse min-w-[800px]">
              <thead>
                <tr className="text-xs font-bold text-stone-700 bg-stone-100/80 border-b border-stone-200">
                  <th className="py-3 px-4 w-[18%] border-r border-stone-200">Nomor Pesanan</th>
                  <th className="py-3 px-4 w-[12%] border-r border-stone-200">Tanggal Pesanan</th>
                  <th className="py-3 px-4 w-[35%] border-r border-stone-200">Detail Produk</th>
                  <th className="py-3 px-3 w-[8%] border-r border-stone-200 text-center">Jumlah</th>
                  <th className="py-3 px-4 w-[12%] border-r border-stone-200">Total Harga</th>
                  <th className="py-3 px-4 w-[15%] border-r border-stone-200">Status</th>
                  <th className="py-3 px-4 text-center">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-200 text-xs sm:text-sm">
                {filteredOrders.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="py-10 text-center text-stone-400 font-medium bg-stone-50/30">
                      Tidak ada transaksi pesanan yang cocok.
                    </td>
                  </tr>
                ) : (
                  filteredOrders.map((order, idx) => (
                    <tr 
                      key={order.id} 
                      className={`${idx % 2 === 1 ? 'bg-stone-50/60' : 'bg-white'} hover:bg-stone-100/40 transition-colors`}
                    >
                      <td className="py-4 px-4 font-mono text-xs font-bold text-stone-600 border-r border-stone-200">
                        {order.id}
                      </td>

                      <td className="py-4 px-4 text-xs text-stone-600 border-r border-stone-200">
                        {order.date}
                      </td>

                      <td className="py-4 px-4 border-r border-stone-200">
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 bg-stone-100 border border-stone-200 rounded-xl flex items-center justify-center text-2xl shrink-0 shadow-sm overflow-hidden">
                            
                            {/* ── LOGIKA BARU UNTUK MERENDER GAMBAR DARI BASE URL BACKEND ── */}
                            {order.image && order.image.startsWith('/') ? (
                               <img 
                                 src={`http://localhost:3000${order.image}`} 
                                 alt={order.productName} 
                                 className="w-full h-full object-cover" 
                               />
                            ) : order.image && order.image.startsWith('http') ? (
                               <img 
                                 src={order.image} 
                                 alt={order.productName} 
                                 className="w-full h-full object-cover" 
                               />
                            ) : (
                               <span className="text-xl">{order.image || '💻'}</span>
                            )}
                          </div>
                          <span className="font-bold text-stone-800 leading-tight">
                            {order.productName}
                          </span>
                        </div>
                      </td>

                      <td className="py-4 px-3 text-center font-bold text-stone-700 border-r border-stone-200">
                        {order.quantity}
                      </td>

                      <td className="py-4 px-4 font-bold text-stone-800 border-r border-stone-200">
                        {formatRupiah(order.totalPrice)}
                      </td>

                      {/* Map Status Database (pending, proses, selesai) ke Badge UI */}
                      <td className="py-4 px-4 border-r border-stone-200 font-semibold text-center sm:text-left">
                        {order.status === 'proses' && (
                          <span className="text-blue-600 bg-blue-50 border border-blue-200 px-2 py-1 rounded-md text-[11px] block sm:inline">
                            Diproses
                          </span>
                        )}
                        {order.status === 'pending' && (
                          <span className="text-amber-600 bg-amber-50 border border-amber-200 px-2 py-1 rounded-md text-[11px] block sm:inline">
                            Menunggu
                          </span>
                        )}
                        {order.status === 'selesai' && (
                          <span className="text-green-600 bg-green-50 border border-green-200 px-2 py-1 rounded-md text-[11px] block sm:inline">
                            Selesai
                          </span>
                        )}
                      </td>

                      {/* Tombol Aksi Sesuai Status Real */}
                      <td className="py-4 px-4">
                        <div className="flex flex-wrap items-center justify-center gap-1.5">
                          {order.status === 'proses' && (
                            <>
                              <button className="px-2.5 py-1 text-[11px] font-bold border border-stone-800 rounded hover:bg-stone-50 active:scale-95 transition-all">
                                Lacak
                              </button>
                              <button className="px-2.5 py-1 text-[11px] font-bold border border-stone-800 rounded hover:bg-stone-50 active:scale-95 transition-all">
                                Detail
                              </button>
                            </>
                          )}
                          {order.status === 'pending' && (
                            <button className="w-full max-w-[120px] px-2 py-1 text-[11px] font-black text-center border-2 border-stone-800 rounded hover:bg-stone-50 active:scale-95 transition-all">
                              Bayar Sekarang
                            </button>
                          )}
                          {order.status === 'selesai' && (
                            <div className="flex flex-col gap-1 w-full max-w-[100px]">
                              <button className="w-full py-1 text-[11px] font-bold border border-stone-800 rounded hover:bg-stone-50 active:scale-95 transition-all text-center">
                                Ulas Produk
                              </button>
                              <button className="w-full py-1 text-[11px] font-bold border border-stone-800 rounded hover:bg-stone-50 active:scale-95 transition-all text-center">
                                Beli Lagi
                              </button>
                            </div>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <footer className="mt-8 pt-4 border-t border-stone-200 flex flex-col sm:flex-row items-center justify-between gap-2 text-[11px] text-stone-400 font-medium">
        <div className="flex gap-4">
          <span className="hover:text-stone-600 cursor-pointer">Beranda</span>
          <span className="hover:text-stone-600 cursor-pointer">Hepsan</span>
          <span className="hover:text-stone-600 cursor-pointer">Produkto</span>
          <span className="hover:text-stone-600 cursor-pointer">ASAS</span>
        </div>
        <div className="flex gap-4">
          <span>Keranjang</span>
          <span>Profil</span>
          <span>Pesanan</span>
          <span className="text-[#C84B31] cursor-pointer" onClick={() => { localStorage.clear(); window.location.reload(); }}>Logout</span>
        </div>
      </footer>
    </div>
  )
}