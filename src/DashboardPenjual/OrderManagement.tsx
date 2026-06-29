// pages/OrderManagement.tsx (atau components/seller/OrderManagement.tsx)
import { useState, useEffect, useCallback } from 'react'
import {
  PlusCircle,
  Search,
  Download,
  ChevronDown,
  AlertTriangle,
  MessageSquare,
  Star,
  Layers,
  Truck,
  FileText,
  CheckCircle2,
  Clock,
  Loader2,
  RefreshCw,
  PackageCheck,
} from 'lucide-react'
import { orderService, type OrderItemSeller, type OrderMetrics } from '../services/orderService'

// ─── TYPES ─────────────────────────────────────────────────────────────────────

type ActionLoading = Record<string, 'proses' | 'selesai' | null>

// ─── STATUS CONFIG ──────────────────────────────────────────────────────────────

const STATUS_CONFIG: Record<
  OrderItemSeller['status'],
  { label: string; className: string; icon: React.ReactNode }
> = {
  Pending: {
    label: 'Pending',
    className: 'bg-blue-50 text-blue-700 border border-blue-200',
    icon: <Clock size={10} className="inline mr-0.5" />,
  },
  Diproses: {
    label: 'Diproses',
    className: 'bg-amber-50 text-amber-700 border border-amber-200',
    icon: <Loader2 size={10} className="inline mr-0.5 animate-spin" />,
  },
  Selesai: {
    label: 'Selesai',
    className: 'bg-emerald-50 text-emerald-700 border border-emerald-200',
    icon: <CheckCircle2 size={10} className="inline mr-0.5" />,
  },
}

// ─── SUB-COMPONENTS ─────────────────────────────────────────────────────────────

function StatusBadge({ status }: { status: OrderItemSeller['status'] }) {
  const cfg = STATUS_CONFIG[status] ?? STATUS_CONFIG['Pending']
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-md text-[10px] font-bold tracking-wide ${cfg.className}`}>
      {cfg.icon}
      {cfg.label}
    </span>
  )
}

function SkeletonRow() {
  return (
    <tr className="animate-pulse">
      {Array.from({ length: 9 }).map((_, i) => (
        <td key={i} className="p-3">
          <div className="h-3 bg-stone-100 rounded w-full" />
        </td>
      ))}
    </tr>
  )
}

// ─── MAIN COMPONENT ─────────────────────────────────────────────────────────────

export default function OrderManagement() {
  // ── Data State ──
  const [orders,  setOrders]  = useState<OrderItemSeller[]>([])
  const [metrics, setMetrics] = useState<OrderMetrics | null>(null)

  // ── UI / Filter State ──
  const [search,        setSearch]        = useState('')
  const [noPesanFilter, setNoPesanFilter] = useState('')
  const [statusFilter,  setStatusFilter]  = useState('Semua')
  const [loading,       setLoading]       = useState(true)
  const [actionLoading, setActionLoading] = useState<ActionLoading>({})
  const [toast,         setToast]         = useState<{ msg: string; type: 'success' | 'error' } | null>(null)

  // ── Toast helper ──
  const showToast = (msg: string, type: 'success' | 'error' = 'success') => {
    setToast({ msg, type })
    setTimeout(() => setToast(null), 3500)
  }

  // ── Fetch Metrics (sekali saat mount) ──
  useEffect(() => {
    orderService.getSellerMetrics()
      .then(setMetrics)
      .catch((err) => console.error('Gagal memuat metrics:', err))
  }, [])

  // ── Fetch Orders (dengan debounce saat filter berubah) ──
  const fetchOrders = useCallback(async () => {
    setLoading(true)
    try {
      const data = await orderService.getSellerOrders(search, statusFilter)
      const filtered = noPesanFilter
        ? data.filter(o => o.id.toLowerCase().includes(noPesanFilter.toLowerCase()))
        : data
      setOrders(filtered)
    } catch (err) {
      console.error('Gagal memuat daftar pesanan:', err)
      showToast('Gagal memuat daftar pesanan dari server.', 'error')
    } finally {
      setLoading(false)
    }
  }, [search, statusFilter, noPesanFilter])

  useEffect(() => {
    const t = setTimeout(fetchOrders, 400)
    return () => clearTimeout(t)
  }, [fetchOrders])

  // ── Handler: Proses (pending → proses) ──
  const handleProses = async (orderId: string) => {
    setActionLoading(prev => ({ ...prev, [orderId]: 'proses' }))
    try {
      await orderService.updateOrderStatus(orderId, 'proses')
      showToast(`Pesanan ${orderId} berhasil diproses!`)
      // Optimistic update — langsung ubah state tanpa refetch penuh
      setOrders(prev =>
        prev.map(o => o.id === orderId ? { ...o, status: 'Diproses' } : o)
      )
      // Refresh metrics (total/pending berubah)
      orderService.getSellerMetrics().then(setMetrics).catch(() => {})
    } catch (err: any) {
      showToast(err.message || 'Gagal memproses pesanan.', 'error')
    } finally {
      setActionLoading(prev => ({ ...prev, [orderId]: null }))
    }
  }

  // ── Handler: Selesai (proses → selesai) ──
  const handleSelesai = async (orderId: string) => {
    setActionLoading(prev => ({ ...prev, [orderId]: 'selesai' }))
    try {
      await orderService.updateOrderStatus(orderId, 'selesai')
      showToast(`Pesanan ${orderId} telah diselesaikan! 🎉`)
      setOrders(prev =>
        prev.map(o => o.id === orderId ? { ...o, status: 'Selesai' } : o)
      )
      orderService.getSellerMetrics().then(setMetrics).catch(() => {})
    } catch (err: any) {
      showToast(err.message || 'Gagal menyelesaikan pesanan.', 'error')
    } finally {
      setActionLoading(prev => ({ ...prev, [orderId]: null }))
    }
  }

  // ── Util ──
  const formatRupiah = (val: number) =>
    new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      maximumFractionDigits: 0,
    }).format(val)

  // Summary counts untuk info cepat
  const countByStatus = (s: OrderItemSeller['status']) =>
    orders.filter(o => o.status === s).length

  // ─────────────────────────────────────────────────────────────────────────────
  return (
    <div className="p-6 bg-stone-50 min-h-screen text-stone-800" style={{ fontFamily: "'DM Sans', 'Segoe UI', sans-serif" }}>

      {/* ── TOAST NOTIFICATION ── */}
      {toast && (
        <div className={`fixed top-4 right-4 z-50 flex items-center gap-2 px-4 py-3 rounded-xl shadow-lg text-sm font-semibold transition-all duration-300 ${
          toast.type === 'success'
            ? 'bg-emerald-600 text-white'
            : 'bg-rose-600 text-white'
        }`}>
          {toast.type === 'success' ? <CheckCircle2 size={16} /> : <AlertTriangle size={16} />}
          {toast.msg}
        </div>
      )}

      {/* ── JUDUL UTAMA ── */}
      <div className="mb-5 flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-stone-900">Manajemen Pesanan Saya</h1>
          <p className="text-xs text-stone-400 mt-0.5 font-medium">
            {loading ? 'Memuat data...' : `${orders.length} pesanan ditemukan`}
            {!loading && orders.length > 0 && (
              <span className="ml-2">
                · <span className="text-blue-600">{countByStatus('Pending')} Pending</span>
                · <span className="text-amber-600">{countByStatus('Diproses')} Diproses</span>
                · <span className="text-emerald-600">{countByStatus('Selesai')} Selesai</span>
              </span>
            )}
          </p>
        </div>
        <button
          onClick={fetchOrders}
          className="flex items-center gap-1.5 text-xs font-semibold px-3 py-2 border border-stone-200 rounded-lg bg-white text-stone-600 hover:bg-stone-50 transition-colors"
        >
          <RefreshCw size={13} />
          Refresh
        </button>
      </div>

      {/* ── GRID UTAMA ── */}
      <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">

        {/* ══ KOLOM KIRI (3/4) ══════════════════════════════════════════════════ */}
        <div className="xl:col-span-3 flex flex-col gap-6">

          {/* ── FILTER BAR ── */}
          <div className="flex flex-wrap items-center justify-between gap-3 bg-white p-4 rounded-xl border border-stone-200 shadow-sm">
            <div className="flex flex-wrap items-center gap-2 flex-1 min-w-[300px]">

              <button className="flex items-center gap-1.5 bg-stone-900 text-white text-xs font-semibold px-3 py-2 rounded-lg hover:bg-stone-800 transition-colors">
                <PlusCircle size={14} />
                Buat Pesanan Manual
              </button>

              {/* Filter No. Pesanan */}
              <div className="relative max-w-[130px]">
                <input
                  type="text"
                  placeholder="No. Pesan..."
                  value={noPesanFilter}
                  onChange={(e) => setNoPesanFilter(e.target.value)}
                  className="w-full px-2.5 py-1.5 bg-stone-50 border border-stone-200 rounded-lg text-xs focus:outline-none focus:border-stone-400"
                />
              </div>

              {/* Search nama / produk */}
              <div className="relative flex-1 max-w-xs">
                <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" />
                <input
                  type="text"
                  placeholder="Cari nama pelanggan / produk..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full pl-9 pr-3 py-1.5 bg-stone-50 border border-stone-200 rounded-lg text-xs focus:outline-none focus:border-stone-400 transition-colors"
                />
              </div>

              {/* Filter Status */}
              <div className="relative inline-block text-left">
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="appearance-none text-[11px] font-semibold border border-stone-200 pl-2.5 pr-7 py-1.5 rounded-lg text-stone-600 bg-white hover:bg-stone-50 focus:outline-none cursor-pointer"
                >
                  <option value="Semua">Semua Status</option>
                  <option value="Pending">Pending</option>
                  <option value="Diproses">Diproses</option>
                  <option value="Selesai">Selesai</option>
                </select>
                <ChevronDown size={12} className="absolute right-2 top-1/2 -translate-y-1/2 text-stone-500 pointer-events-none" />
              </div>

              <button className="flex items-center gap-1 text-[11px] font-semibold border border-stone-200 px-2.5 py-1.5 rounded-lg text-stone-600 bg-white hover:bg-stone-50">
                Tanggal Pesanan <ChevronDown size={12} />
              </button>
            </div>

            <button className="flex items-center gap-1.5 text-xs font-semibold px-3 py-2 border border-stone-200 rounded-lg bg-white text-stone-700 hover:bg-stone-50 transition-colors">
              <Download size={14} />
              Export Data Pesanan
            </button>
          </div>

          {/* ── WAWASAN KINERJA PESANAN ── */}
          <div className="bg-white p-5 rounded-xl border border-stone-200 shadow-sm">
            <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-6 mb-2">
              <div className="flex-1">
                <h2 className="text-sm font-bold text-stone-900">Wawasan Kinerja Pesanan (Bulan Ini)</h2>
                <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-2 text-[11px] font-medium text-stone-500">
                  <div className="flex items-center gap-1">
                    <span className="w-2.5 h-0.5 bg-stone-500 inline-block" /> Total Pesanan
                  </div>
                  <div className="flex items-center gap-1">
                    <span className="w-2.5 h-0.5 bg-teal-600 inline-block" /> Pesanan Selesai
                  </div>
                  <div className="flex items-center gap-1">
                    <span className="w-2.5 h-0.5 bg-rose-500 inline-block" /> Pesanan Dibatalkan
                  </div>
                </div>
              </div>

              {/* Kotak Ringkasan Metrics — data live dari backend */}
              <div className="grid grid-cols-2 gap-x-6 gap-y-2 bg-stone-50 border border-stone-200 rounded-xl p-3 min-w-[280px] text-[11px] font-medium text-stone-700 shadow-inner">
                <div>
                  <p className="text-stone-400 font-semibold uppercase text-[9px]">Rata-rata Nilai Pesanan</p>
                  <p className="font-bold text-stone-900 text-xs">
                    {metrics ? formatRupiah(metrics.avgNilaiPesanan) : '—'}
                  </p>
                </div>
                <div>
                  <p className="text-stone-400 font-semibold uppercase text-[9px]">Tingkat Konversi</p>
                  <p className="font-bold text-emerald-600 text-xs">
                    {metrics?.tingkatKonversi ?? '—'}
                  </p>
                </div>
                <div className="border-t border-stone-200/60 pt-1.5 col-span-2 flex justify-between items-center">
                  <div>
                    <p className="text-stone-400 font-semibold uppercase text-[9px]">Total Volume Pesanan</p>
                    <p className="font-bold text-stone-900">
                      {metrics ? `${metrics.totalPesanan} trx` : '—'}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-stone-400 font-semibold uppercase text-[9px]">Pesanan Selesai</p>
                    <p className="font-bold text-emerald-600">
                      {metrics ? metrics.pesananSelesai : '—'}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Line Chart */}
            <div className="relative h-40 w-full mt-2">
              <div className="absolute left-0 top-0 text-[10px] text-stone-400 font-mono">1000</div>
              <div className="absolute left-0 top-1/2 -translate-y-1/2 text-[10px] text-stone-400 font-mono">500</div>
              <div className="absolute left-0 bottom-6 text-[10px] text-stone-400 font-mono">0</div>
              <div className="h-[120px] mx-8 border-b border-l border-stone-200 relative pt-4">
                <svg className="w-full h-full overflow-visible" viewBox="0 0 600 100" preserveAspectRatio="none">
                  <path d="M 0 75 Q 100 45 200 55 T 400 30 T 600 45" fill="none" stroke="#78716c" strokeWidth="2" />
                  <circle cx="200" cy="55" r="3" fill="#78716c" />
                  <circle cx="400" cy="30" r="3" fill="#78716c" />
                  <path d="M 0 82 Q 100 55 200 65 T 400 40 T 600 52" fill="none" stroke="#0d9488" strokeWidth="1.5" />
                  <circle cx="200" cy="65" r="2.5" fill="#0d9488" />
                  <path d="M 0 95 Q 100 90 200 92 T 400 85 T 600 90" fill="none" stroke="#f43f5e" strokeWidth="1.5" />
                  <circle cx="400" cy="85" r="2.5" fill="#f43f5e" />
                </svg>
              </div>
              <div className="flex justify-between mx-8 mt-1 text-[10px] text-stone-400 font-semibold">
                {['Hari 1','Hari 4','Hari 8','Hari 12','Hari 16','Hari 20','Hari 24','Hari 28','Hari 30'].map(d => (
                  <span key={d}>{d}</span>
                ))}
              </div>
            </div>
          </div>

          {/* ── TABEL DAFTAR PESANAN ── */}
          <div className="bg-white rounded-xl border border-stone-200 shadow-sm overflow-hidden">
            <div className="p-4 border-b border-stone-100 flex items-center justify-between">
              <h2 className="text-sm font-bold text-stone-900">Daftar Pesanan</h2>
              <div className="flex items-center gap-2">
                <button className="flex items-center gap-1 text-xs border border-stone-200 px-2.5 py-1 rounded-md text-stone-600 bg-white font-medium shadow-sm">
                  Sort Produk <ChevronDown size={12} />
                </button>
                <button className="flex items-center gap-1 text-xs border border-stone-200 px-2.5 py-1 rounded-md text-stone-600 bg-white font-medium shadow-sm">
                  Tanggal <ChevronDown size={12} />
                </button>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-stone-50 border-b border-stone-200 text-stone-500 font-semibold text-[11px] uppercase tracking-wider">
                    <th className="p-3 w-8">
                      <input type="checkbox" className="rounded text-stone-900 focus:ring-0" />
                    </th>
                    <th className="p-3">No. Pesanan</th>
                    <th className="p-3">Pelanggan</th>
                    <th className="p-3">Produk</th>
                    <th className="p-3 text-center">Status</th>
                    <th className="p-3">Jasa Kirim</th>
                    <th className="p-3 text-right">Total Harga</th>
                    <th className="p-3 text-center">Tanggal</th>
                    <th className="p-3 text-center">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-100 text-xs font-medium text-stone-700">

                  {/* Loading skeleton */}
                  {loading && (
                    <>
                      <SkeletonRow />
                      <SkeletonRow />
                      <SkeletonRow />
                    </>
                  )}

                  {/* Empty state */}
                  {!loading && orders.length === 0 && (
                    <tr>
                      <td colSpan={9} className="p-10 text-center">
                        <div className="flex flex-col items-center gap-2 text-stone-400">
                          <PackageCheck size={32} strokeWidth={1.2} />
                          <p className="font-semibold text-sm">Tidak ada pesanan ditemukan</p>
                          <p className="text-xs">Coba ubah filter atau kata kunci pencarian.</p>
                        </div>
                      </td>
                    </tr>
                  )}

                  {/* Data rows */}
                  {!loading && orders.map((order) => {
                    const isLoadingAction = !!actionLoading[order.id]
                    return (
                      <tr key={order.id} className="hover:bg-stone-50/50 transition-colors">
                        <td className="p-3">
                          <input type="checkbox" className="rounded text-stone-900 focus:ring-0" />
                        </td>
                        <td className="p-3 text-stone-900 font-mono font-semibold text-[11px]">
                          {order.id}
                        </td>
                        <td className="p-3 text-stone-800 font-semibold">{order.customer}</td>
                        <td className="p-3 max-w-[180px] truncate text-stone-600 font-medium" title={order.product}>
                          {order.product}
                        </td>
                        <td className="p-3 text-center">
                          <StatusBadge status={order.status} />
                        </td>
                        <td className="p-3 text-stone-500 font-semibold">{order.courier}</td>
                        <td className="p-3 text-right font-bold text-stone-900">
                          {formatRupiah(order.price)}
                        </td>
                        <td className="p-3 text-center font-mono text-stone-400">{order.date}</td>

                        {/* ── ACTION BUTTONS (alur: pending→proses→selesai) ── */}
                        <td className="p-3 text-center">
                          <div className="flex items-center justify-center gap-1">

                            {/* Tombol PROSES: muncul hanya saat status Pending */}
                            {order.status === 'Pending' && (
                              <button
                                onClick={() => handleProses(order.id)}
                                disabled={isLoadingAction}
                                className="flex items-center gap-1 px-2 py-1 text-[10px] font-bold bg-amber-500 text-white rounded hover:bg-amber-600 transition-colors shadow-sm disabled:opacity-60 disabled:cursor-not-allowed"
                                title="Tandai sebagai sedang diproses"
                              >
                                {actionLoading[order.id] === 'proses'
                                  ? <Loader2 size={10} className="animate-spin" />
                                  : <Truck size={10} />
                                }
                                Proses
                              </button>
                            )}

                            {/* Tombol SELESAI: muncul hanya saat status Diproses */}
                            {order.status === 'Diproses' && (
                              <button
                                onClick={() => handleSelesai(order.id)}
                                disabled={isLoadingAction}
                                className="flex items-center gap-1 px-2 py-1 text-[10px] font-bold bg-emerald-600 text-white rounded hover:bg-emerald-700 transition-colors shadow-sm disabled:opacity-60 disabled:cursor-not-allowed"
                                title="Tandai pesanan sebagai selesai"
                              >
                                {actionLoading[order.id] === 'selesai'
                                  ? <Loader2 size={10} className="animate-spin" />
                                  : <CheckCircle2 size={10} />
                                }
                                Selesai
                              </button>
                            )}

                            {/* Badge Selesai (tidak ada aksi lebih lanjut) */}
                            {order.status === 'Selesai' && (
                              <span className="flex items-center gap-1 px-2 py-1 text-[10px] font-bold text-emerald-600 bg-emerald-50 rounded border border-emerald-100">
                                <CheckCircle2 size={10} />
                                Tuntas
                              </span>
                            )}

                            {/* Tombol Cetak Resi (selalu ada) */}
                            <button className="flex items-center gap-1 px-2 py-1 text-[10px] font-bold border border-stone-200 rounded text-stone-700 bg-white hover:bg-stone-50 shadow-sm">
                              <FileText size={10} />
                              Resi
                            </button>
                          </div>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>

            {/* Pagination placeholder */}
            {!loading && orders.length > 0 && (
              <div className="p-3 border-t border-stone-100 flex items-center justify-between text-[11px] text-stone-400 font-medium">
                <span>Menampilkan {orders.length} pesanan</span>
                <div className="flex items-center gap-1">
                  <button className="px-2 py-1 border border-stone-200 rounded text-stone-600 hover:bg-stone-50 font-semibold">‹</button>
                  <button className="px-2 py-1 border border-stone-900 rounded bg-stone-900 text-white font-semibold">1</button>
                  <button className="px-2 py-1 border border-stone-200 rounded text-stone-600 hover:bg-stone-50 font-semibold">›</button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* ══ KOLOM KANAN (1/4) ═════════════════════════════════════════════════ */}
        <div className="flex flex-col gap-6">
          <div className="bg-white p-4 rounded-xl border border-stone-200 shadow-sm flex flex-col gap-5">

            {/* PANEL 1: Operational Metrics — data live dari backend */}
            <div>
              <h2 className="text-xs font-bold uppercase tracking-wider text-stone-400 mb-1">Operational & Marketing</h2>
              <div className="h-px bg-stone-100 w-full mb-3" />
              <h3 className="text-[11px] font-bold text-stone-700 mb-2 uppercase tracking-wide">Operational Metrics</h3>
              <div className="grid grid-cols-3 gap-2 text-center">
                <div className="p-2 border border-stone-200 rounded-lg bg-stone-50 flex flex-col items-center justify-center">
                  <AlertTriangle size={15} className="text-rose-500 mb-1" />
                  <p className="text-[8px] text-stone-500 font-semibold leading-tight">Pesanan Kritis</p>
                  <p className="text-[11px] font-bold text-stone-900 mt-1">
                    {metrics?.pesananPending ?? 0}
                  </p>
                </div>
                <div className="p-2 border border-stone-200 rounded-lg bg-stone-50 flex flex-col items-center justify-center">
                  <MessageSquare size={15} className="text-amber-500 mb-1" />
                  <p className="text-[8px] text-stone-500 font-semibold leading-tight">Komplain Aktif</p>
                  <p className="text-[11px] font-bold text-stone-900 mt-1">
                    {metrics?.komplainAktif ?? 0}
                  </p>
                </div>
                <div className="p-2 border border-stone-200 rounded-lg bg-stone-50 flex flex-col items-center justify-center">
                  <Star size={15} className="text-amber-500 fill-amber-400 mb-1" />
                  <p className="text-[8px] text-stone-500 font-semibold leading-tight">Rating Toko</p>
                  <p className="text-[10px] font-bold text-stone-900 mt-1">
                    {metrics?.ratingToko ?? '—'}
                  </p>
                </div>
              </div>
            </div>

            {/* PANEL 2: Log Ringkasan Aktivitas Terbaru */}
            <div className="pt-2 border-t border-stone-100">
              <h2 className="text-xs font-bold uppercase tracking-wider text-stone-400 mb-2">Log Aktivitas Pesanan</h2>
              <div className="flex flex-col gap-1.5 max-h-48 overflow-y-auto pr-1">
                {loading ? (
                  <div className="text-[11px] text-stone-400 text-center py-4 animate-pulse">Memuat log...</div>
                ) : orders.length === 0 ? (
                  <div className="text-[11px] text-stone-400 text-center py-4">Belum ada aktivitas.</div>
                ) : (
                  // Tampilkan 8 pesanan terbaru sebagai log ringkas
                  orders.slice(0, 8).map((order) => (
                    <div key={order.id} className="flex items-center gap-2 p-2 bg-stone-50 rounded-lg border border-stone-100 hover:border-stone-200 transition-colors">
                      <div className={`w-1.5 h-1.5 rounded-full shrink-0 ${
                        order.status === 'Selesai' ? 'bg-emerald-500' :
                        order.status === 'Diproses' ? 'bg-amber-500' :
                        'bg-blue-500'
                      }`} />
                      <div className="flex-1 min-w-0">
                        <p className="text-[10px] font-bold text-stone-800 truncate">{order.id}</p>
                        <p className="text-[9px] text-stone-500 truncate">{order.customer} · {order.date}</p>
                      </div>
                      <StatusBadge status={order.status} />
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* PANEL 3: Analisis Stok */}
            <div className="pt-2 border-t border-stone-100">
              <h2 className="text-xs font-bold uppercase tracking-wider text-stone-400 mb-2">Analisis Stok</h2>
              <div className="flex flex-col gap-2">
                <div className="flex items-center gap-3 p-2 bg-stone-50 border border-stone-200 rounded-xl">
                  <div className="w-8 h-8 rounded-lg bg-stone-200 flex items-center justify-center text-stone-600 shrink-0">
                    <Layers size={14} />
                  </div>
                  <div className="flex-1 min-w-0 text-[11px] font-medium text-stone-700">
                    <p className="font-bold text-stone-900 leading-tight">
                      Stok Kritis: <span className="text-rose-600">{metrics?.stokRendah ?? 0}</span>
                    </p>
                    <p className="text-[10px] text-stone-500 mt-0.5">Produk stok &lt; 5 unit</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-2 bg-stone-50 border border-stone-200 rounded-xl">
                  <div className="w-8 h-8 rounded-lg bg-stone-200 flex items-center justify-center text-stone-600 shrink-0">
                    <Layers size={14} />
                  </div>
                  <div className="flex-1 min-w-0 text-[11px] font-medium text-stone-700">
                    <p className="font-bold text-stone-900 leading-tight">Pesanan Tertua</p>
                    <p className="text-[10px] text-stone-500 mt-0.5">
                      {orders.filter(o => o.status === 'Pending').length > 0
                        ? orders.filter(o => o.status === 'Pending').at(-1)?.date ?? '—'
                        : 'Tidak ada pending'}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* PANEL 4: Rekomendasi Operasional */}
            <div className="pt-2 border-t border-stone-100">
              <h2 className="text-xs font-bold uppercase tracking-wider text-stone-400 mb-2">Rekomendasi Operasional</h2>
              <div className="flex flex-col gap-2 text-left text-[11px] font-bold text-stone-700">
                <div className="p-2.5 border border-stone-200 rounded-lg bg-stone-50 flex items-center gap-3 hover:bg-stone-100/70 transition-colors cursor-pointer">
                  <Truck size={16} className="text-stone-600 shrink-0" />
                  <span className="leading-tight font-semibold">Tingkatkan Kecepatan Pengiriman</span>
                </div>
                <div className="p-2.5 border border-stone-200 rounded-lg bg-stone-50 flex items-center gap-3 hover:bg-stone-100/70 transition-colors cursor-pointer">
                  <FileText size={16} className="text-stone-600 shrink-0" />
                  <span className="leading-tight font-semibold">Meminimalkan Top Komplain Pelanggan</span>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  )
}