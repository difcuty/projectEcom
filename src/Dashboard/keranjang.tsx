import { useState, useEffect } from 'react'
import { orderService } from '../services/orderService'
import { cartService, type CartItem } from '../services/cartService'
// Import komponen pembayaran yang baru dibuat
import ModalPembayaran from './ModalPembayaran' 

export default function Keranjang() {
  const [cartItems, setCartItems] = useState<CartItem[]>([])
  const [promoCode, setPromoCode] = useState('')
  const [discount, setDiscount] = useState(0)
  
  // Loading states untuk interaksi UI yang mulus
  const [loadingData, setLoadingData] = useState(true)
  const [loadingCheckout, setLoadingCheckout] = useState(false)

  // State untuk mengontrol visibilitas Modal Pembayaran
  const [isModalOpen, setIsModalOpen] = useState(false)

  // 1. Muat data asli dari database MySQL saat halaman diakses
  const muatKeranjangDariDB = async () => {
    try {
      setLoadingData(true)
      const data = await cartService.getCart()
      setCartItems(data)
    } catch (error: any) {
      console.error(error.message)
    } finally {
      setLoadingData(false)
    }
  }

  useEffect(() => {
    muatKeranjangDariDB()
  }, [])

  // 2. Fungsi mengubah jumlah barang (+ / -) langsung ke Database
  const updateQuantity = async (cartId: number, currentQty: number, delta: number) => {
    const targetJumlah = currentQty + delta
    if (targetJumlah < 1) return // Cegah jumlah minus atau nol

    try {
      // Optimistic UI Update (Ubah state lokal dulu agar terasa instan dan responsif)
      setCartItems(prev =>
        prev.map(item => (item.id === cartId ? { ...item, quantity: targetJumlah } : item))
      )
      
      // Tembak perubahan permanen ke MySQL
      await cartService.updateQuantity(cartId, targetJumlah)
    } catch (error: any) {
      alert(error.message || 'Gagal mengubah jumlah item.')
      muatKeranjangDariDB() // Rollback data asli jika server gagal merespon
    }
  }

  // 3. Fungsi menghapus baris item dari keranjang di Database
  const removeItem = async (cartId: number) => {
    const konfirmasi = window.confirm('Apakah Anda yakin ingin menghapus produk ini dari keranjang?')
    if (!konfirmasi) return

    try {
      // Saring langsung di UI agar langsung menghilang tanpa menunggu loading jaringan
      setCartItems(prev => prev.filter(item => item.id !== cartId))
      
      // Hapus barisnya dari tabel keranjang MySQL
      await cartService.removeFromCart(cartId)
    } catch (error: any) {
      alert(error.message || 'Gagal menghapus item.')
      muatKeranjangDariDB() // Re-fetch jika terjadi kendala database
    }
  }

  // 4. Memicu pembukaan Modal Pembayaran (Menggantikan window.confirm lama)
  const handleCheckout = () => {
    if (cartItems.length === 0) return
    setIsModalOpen(true)
  }

  // 5. Eksekusi penyimpanan pesanan ke backend yang dipicu dari dalam ModalPembayaran
  const handlePaymentSuccess = async (metodeBayar: string) => {
    setLoadingCheckout(true)

    // Siapkan bentuk array item ringkas untuk diolah ke transaksi pesanan backend
    const payloadItems = cartItems.map(item => ({
      id: item.produk_id, // Kirim ID Produk asli ke tabel detail_pesanan
      quantity: item.quantity,
      price: item.price
    }))

    try {
      console.log("Isi Payload yang akan dikirim:", payloadItems);
      const response = await orderService.createBulkOrder({
        items: payloadItems,
        discount: discount,
        metodePembayaran: metodeBayar // Menyimpan referensi bank tujuan transaksi
      })

      alert(response.message) // Notifikasi sukses dari backend
      
      // Bersihkan state belanja karena item sudah naik ke tabel pesanan & detail_pesanan
      setCartItems([])
      setDiscount(0)
      setPromoCode('')
      setIsModalOpen(false) // Tutup modal setelah transaksi berhasil
      
    } catch (error: any) {
      alert(error.message || 'Gagal memproses transaksi pembayaran belanjaan.')
    } finally {
      setLoadingCheckout(false)
    }
  }

  // Kalkulasi Ringkasan Otomatis
  const totalItems = cartItems.reduce((acc, item) => acc + item.quantity, 0)
  const subtotal = cartItems.reduce((acc, item) => acc + (item.price * item.quantity), 0)
  const totalPembayaran = Math.max(0, subtotal - discount)

  const formatRupiah = (num: number) => {
    return 'Rp ' + num.toLocaleString('id-ID')
  }

  const handleApplyPromo = (e: React.FormEvent) => {
    e.preventDefault()
    if (promoCode.toUpperCase() === 'ASASUNTUNG') {
      setDiscount(500000)
      alert('Kode promo berhasil dipasang! Potongan Rp 500.000')
    } else {
      alert('Kode promo tidak valid/tidak ditemukan.')
    }
  }

  return (
    <div className="p-4 sm:p-6 bg-[#F2F3F7] min-h-[calc(100vh-57px)] font-sans text-[#1A1A1A]">
      
      {/* Container Utama Detail Keranjang */}
      <div className="bg-white rounded-2xl border border-stone-200 shadow-sm p-4 mb-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-stone-100">
          <h1 className="text-lg font-black tracking-tight text-[#1A1A1A]">Detail Keranjang Belanja</h1>
          
          {/* Mini Badge Ringkasan Atas */}
          <div className="flex items-center gap-2 bg-stone-50 border border-stone-200 rounded-xl px-3 py-1.5 text-xs font-bold text-stone-600">
            <span className="flex gap-1">
              {cartItems.slice(0, 3).map((item, idx) => (
                <span key={idx} className="bg-white px-1.5 py-0.5 rounded border border-stone-200 text-sm">
                  {item.image ? (item.image.startsWith('/') ? '💻' : item.image) : '💻'}
                </span>
              ))}
            </span>
            <span className="ml-1 border-l border-stone-300 pl-2">
              {totalItems} ({cartItems.length} item) – <span className="text-[#C84B31]">{formatRupiah(subtotal)}</span>
            </span>
          </div>
        </div>

        {/* Grid Konten: Tabel Produk & Ringkasan Belanja */}
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-6 mt-4">
          
          {/* ── SEKTOR KIRI: DAFTAR PRODUK (Tabel Nyata dari MySQL) ── */}
          <div className="overflow-x-auto">
            <table className="w-full text-left min-w-[600px]">
              <thead>
                <tr className="text-xs font-bold text-stone-400 border-b border-stone-200 bg-stone-50/75">
                  <th className="py-2 px-3 w-[45%]">Product Name</th>
                  <th className="py-2 px-3">Price</th>
                  <th className="py-2 px-3 text-center">Jumlah</th>
                  <th className="py-2 px-3">Subtotal</th>
                  <th className="py-2 px-3 text-center">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-dashed divide-stone-300">
                {loadingData ? (
                  <tr>
                    <td colSpan={5} className="py-12 text-center text-stone-400 font-medium">
                      Mengambil data keranjang dari server...
                    </td>
                  </tr>
                ) : cartItems.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="py-12 text-center text-stone-400 font-medium">
                      Keranjang belanja Anda kosong.
                    </td>
                  </tr>
                ) : (
                  cartItems.map(item => (
                    <tr key={item.id} className="group hover:bg-stone-50/50 transition-colors">
                      {/* Nama Produk & Thumbnail */}
                      <td className="py-4 px-3 flex items-center gap-3">
                        <div className="w-12 h-12 rounded-xl bg-stone-100 border border-stone-200 flex items-center justify-center text-2xl shrink-0 overflow-hidden">
                          {item.image && item.image.startsWith('/') ? (
                            <img src={`http://localhost:3000${item.image}`} alt={item.name} className="w-full h-full object-cover" />
                          ) : (
                            <span>{item.image || '💻'}</span>
                          )}
                        </div>
                        <span className="text-xs sm:text-sm font-bold text-stone-800 line-clamp-2 leading-tight">
                          {item.name}
                        </span>
                      </td>

                      {/* Harga Satuan */}
                      <td className="py-4 px-3 text-xs sm:text-sm font-medium text-stone-600">
                        {formatRupiah(item.price)}
                      </td>

                      {/* Kontrol Jumlah (Quantity) */}
                      <td className="py-4 px-3">
                        <div className="flex flex-col items-center">
                          <span className="text-[10px] font-bold text-stone-400 mb-1">Jumlah</span>
                          <div className="flex items-center bg-white border border-stone-300 rounded-lg overflow-hidden shadow-sm">
                            <button
                              onClick={() => updateQuantity(item.id, item.quantity, -1)}
                              disabled={item.quantity <= 1}
                              className="px-2 py-1 bg-stone-50 hover:bg-stone-200 disabled:opacity-40 disabled:hover:bg-stone-50 font-bold transition-all text-stone-600 active:scale-95 text-xs"
                            >
                              -
                            </button>
                            <span className="w-8 text-center text-xs font-black text-stone-800">{item.quantity}</span>
                            <button
                              onClick={() => updateQuantity(item.id, item.quantity, 1)}
                              className="px-2 py-1 bg-stone-50 hover:bg-stone-200 font-bold transition-all text-stone-600 active:scale-95 text-xs"
                            >
                              +
                            </button>
                          </div>
                        </div>
                      </td>

                      {/* Subtotal Item */}
                      <td className="py-4 px-3 text-xs sm:text-sm font-black text-[#C84B31]">
                        {formatRupiah(item.price * item.quantity)}
                      </td>

                      {/* Tombol Hapus */}
                      <td className="py-4 px-3 text-center">
                        <button
                          onClick={() => removeItem(item.id)}
                          className="p-1.5 rounded-lg text-stone-400 hover:text-red-500 hover:bg-red-50 transition-all active:scale-90"
                          title="Hapus Item"
                        >
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                            <polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/><line x1="10" y1="11" x2="10" y2="17"/><line x1="14" y1="11" x2="14" y2="17"/>
                          </svg>
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* ── SEKTOR KANAN: RINGKASAN BELANJA ── */}
          <div className="flex flex-col gap-4">
            <div className="bg-white rounded-2xl border border-stone-200 p-4 shadow-sm h-fit">
              <h2 className="text-sm font-black uppercase tracking-wider text-stone-700 pb-2 border-b border-stone-100 mb-3">
                Ringkasan Belanja
              </h2>
              
              <div className="space-y-2.5 text-xs">
                <div className="flex justify-between font-medium text-stone-600">
                  <span>Subtotal ({totalItems} item)</span>
                  <span className="font-bold text-stone-800">{formatRupiah(subtotal)}</span>
                </div>
                
                {discount > 0 && (
                  <div className="flex justify-between font-medium text-green-600">
                    <span>Diskon Promo</span>
                    <span className="font-bold">-{formatRupiah(discount)}</span>
                  </div>
                )}

                <div className="flex justify-between font-medium text-stone-500">
                  <span>Estimasi Biaya Pengiriman</span>
                  <span className="italic text-stone-400">Menghitung...</span>
                </div>

                {/* Form Kode Promo */}
                <form onSubmit={handleApplyPromo} className="pt-2 border-t border-dashed border-stone-200">
                  <label className="block text-[10px] font-bold text-stone-400 uppercase tracking-wide mb-1">
                    Kode Promo
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="Contoh: ASASUNTUNG"
                      value={promoCode}
                      onChange={e => setPromoCode(e.target.value)}
                      className="flex-1 px-3 py-1.5 border border-stone-300 rounded-xl text-xs uppercase placeholder-stone-300 focus:outline-none focus:border-[#C84B31] transition-colors"
                    />
                    <button
                      type="submit"
                      className="px-3 py-1.5 rounded-xl border border-stone-800 font-bold hover:bg-stone-50 active:scale-95 transition-all text-xs"
                    >
                      Apply
                    </button>
                  </div>
                </form>

                {/* Total Pembayaran */}
                <div className="pt-3 border-t border-stone-200 flex justify-between items-center">
                  <span className="font-bold text-stone-800 text-sm">Total Pembayaran</span>
                  <span className="font-black text-lg text-[#C84B31]">{formatRupiah(totalPembayaran)}</span>
                </div>
              </div>

              {/* Button Checkout Lanjut */}
              <button 
                onClick={handleCheckout}
                disabled={cartItems.length === 0 || loadingCheckout}
                className="w-full mt-4 py-2.5 rounded-xl bg-[#C84B31] hover:bg-[#B03D26] disabled:bg-stone-300 disabled:shadow-none font-black text-sm text-white tracking-wide shadow-md shadow-[#C84B31]/20 transition-all active:scale-[0.97]"
              >
                {loadingCheckout ? 'Memproses Pesanan...' : 'Lanjut ke Pembayaran'}
              </button>
            </div>

            {/* Banner Kecil */}
            <div className="bg-stone-50 rounded-2xl border border-stone-200 p-3 flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-lg border border-stone-300 flex items-center justify-center font-black text-[9px] text-stone-500 text-center uppercase leading-none px-0.5 shrink-0">
                MILITARY GRADE
              </div>
              <div>
                <p className="text-[10px] font-black text-stone-700 leading-tight">No. 1 Brand Laptop in Indonesia</p>
                <p className="text-[9px] text-stone-400">Sejak harta / terpercaya</p>
              </div>
            </div>
          </div>

        </div>
      </div>
      
      {/* Footer Mini */}
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
          <span className="text-[#C84B31]">Logout</span>
        </div>
      </footer>

      {/* Render Modal Pembayaran (Dipanggil di paling luar kontainer) */}
      <ModalPembayaran 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onPaymentSuccess={handlePaymentSuccess}
        totalTagihan={totalPembayaran}
        formatRupiah={formatRupiah}
      />

    </div>
  )
}