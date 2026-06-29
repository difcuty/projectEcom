import { useState } from 'react'
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from 'recharts'
import {
  ShoppingBag,
  Package,
  TrendingUp,
  Bell,
  Settings,
  AlertTriangle,
  Megaphone,
  ChevronRight,
  ArrowUpRight,
  Star,
  Clock,
  CheckCircle2,
} from 'lucide-react'

// ─── DATA ────────────────────────────────────────────────────────────────────

const salesData = [
  { hari: 'H1', penjualan: 200 },
  { hari: 'H2', penjualan: 520 },
  { hari: 'H3', penjualan: 310 },
  { hari: 'H4', penjualan: 700 },
  { hari: 'H5', penjualan: 420 },
  { hari: 'H6', penjualan: 150 },
  { hari: 'H7', penjualan: 600 },
  { hari: 'H8', penjualan: 450 },
  { hari: 'H9', penjualan: 820 },
  { hari: 'H10', penjualan: 680 },
]

const categoryData = [
  { name: 'Laptop', value: 40 },
  { name: 'Headset', value: 25 },
  { name: 'Mouse', value: 20 },
  { name: 'Lainnya', value: 15 },
]

const COLORS = ['#1a1a2e', '#16213e', '#0f3460', '#533483']

const recentOrders = [
  { id: 'IDO0123', nama: 'Budi', tanggal: '12 Jun 2025', nilai: 'Rp 22.000', status: 'pending' },
  { id: 'IDO0124', nama: 'Sari', tanggal: '12 Jun 2025', nilai: 'Rp 15.500', status: 'proses' },
  { id: 'IDO0125', nama: 'Andi', tanggal: '11 Jun 2025', nilai: 'Rp 32.000', status: 'selesai' },
  { id: 'IDO0126', nama: 'Dewi', tanggal: '11 Jun 2025', nilai: 'Rp 8.750', status: 'pending' },
]

const outOfStock = [
  { nama: 'TUF Gaming F15', stok: 1, icon: '💻' },
  { nama: 'ROG Delta S Headset', stok: 1, icon: '🎧' },
  { nama: 'ROG Gladius III Mouse', stok: 2, icon: '🖱️' },
]

const promosi = [
  { nama: 'Kampanye Aktif Marketing campaign saravveery!', aktif: true },
  { nama: 'Kampanye Aktif Marketing campaign par men strong!', aktif: true },
]

// ─── STATUS BADGE ─────────────────────────────────────────────────────────────

function StatusBadge({ status }: { status: string }) {
  const map: Record<string, { label: string; cls: string; icon: React.ReactNode }> = {
    pending: {
      label: 'Tertunda',
      cls: 'bg-amber-100 text-amber-700 border border-amber-200',
      icon: <Clock size={11} />,
    },
    proses: {
      label: 'Diproses',
      cls: 'bg-blue-100 text-blue-700 border border-blue-200',
      icon: <Package size={11} />,
    },
    selesai: {
      label: 'Selesai',
      cls: 'bg-emerald-100 text-emerald-700 border border-emerald-200',
      icon: <CheckCircle2 size={11} />,
    },
  }
  const s = map[status] ?? map['pending']
  return (
    <span
      className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold ${s.cls}`}
    >
      {s.icon}
      {s.label}
    </span>
  )
}

// ─── STAT CARD ────────────────────────────────────────────────────────────────

function StatCard({
  title,
  value,
  sub,
  icon,
  accent,
}: {
  title: string
  value: string
  sub?: string
  icon: React.ReactNode
  accent: string
}) {
  return (
    <div className="relative bg-white rounded-2xl p-5 shadow-sm border border-stone-100 overflow-hidden group hover:shadow-md transition-shadow">
      <div
        className={`absolute top-0 right-0 w-24 h-24 rounded-full -translate-y-8 translate-x-8 opacity-10 ${accent}`}
      />
      <div className={`inline-flex p-2.5 rounded-xl mb-3 ${accent} bg-opacity-10`}>{icon}</div>
      <p className="text-xs text-stone-400 font-medium uppercase tracking-wider">{title}</p>
      <p className="text-2xl font-bold text-stone-800 mt-0.5 font-mono">{value}</p>
      {sub && <p className="text-xs text-stone-400 mt-1">{sub}</p>}
      <div className="absolute bottom-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
        <ArrowUpRight size={16} className="text-stone-300" />
      </div>
    </div>
  )
}

// ─── MAIN DASHBOARD ───────────────────────────────────────────────────────────

export default function DashboardPenjual() {
  const [tab, setTab] = useState<'7hari' | '30hari'>('30hari')

  return (
    <div
      className="min-h-screen bg-[#f5f5f0] p-6 space-y-6"
      style={{ fontFamily: "'DM Sans', 'Segoe UI', sans-serif" }}
    >
      {/* ── TOP BAR ── */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-stone-800 tracking-tight">
            Selamat datang kembali 👋
          </h1>
          <p className="text-sm text-stone-400 mt-0.5">Ringkasan performa toko Anda hari ini</p>
        </div>
        <div className="flex items-center gap-3">
          <button className="relative p-2.5 bg-white rounded-xl border border-stone-200 hover:border-stone-300 transition-colors shadow-sm">
            <Bell size={18} className="text-stone-500" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-rose-500 rounded-full" />
          </button>
          <button className="p-2.5 bg-white rounded-xl border border-stone-200 hover:border-stone-300 transition-colors shadow-sm">
            <Settings size={18} className="text-stone-500" />
          </button>
        </div>
      </div>

      {/* ── STAT CARDS ── */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <StatCard
          title="Penjualan Total (Bulan Ini)"
          value="Rp 550 Jt"
          sub="↑ 12% dari bulan lalu"
          icon={<TrendingUp size={20} className="text-indigo-600" />}
          accent="bg-indigo-500"
        />
        <StatCard
          title="Pesanan Baru"
          value="45"
          sub="12 masih tertunda"
          icon={<ShoppingBag size={20} className="text-violet-600" />}
          accent="bg-violet-500"
        />
        <StatCard
          title="Rata-rata Nilai Pesanan"
          value="Rp 12,2 Jt"
          sub="Evaluasi: 4.8 / 5.0 ⭐"
          icon={<Star size={20} className="text-amber-500" />}
          accent="bg-amber-400"
        />
      </div>

      {/* ── MAIN GRID ── */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* ── LEFT: Chart + Breakdown ── */}
        <div className="xl:col-span-2 space-y-6">
          {/* Performance Chart */}
          <div className="bg-white rounded-2xl p-5 shadow-sm border border-stone-100">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="font-bold text-stone-800">Grafik Penjualan</h2>
                <p className="text-xs text-stone-400">Performa harian toko Anda</p>
              </div>
              <div className="flex gap-1 bg-stone-100 rounded-lg p-1">
                {(['7hari', '30hari'] as const).map((t) => (
                  <button
                    key={t}
                    onClick={() => setTab(t)}
                    className={`px-3 py-1 rounded-md text-xs font-semibold transition-all ${
                      tab === t
                        ? 'bg-white text-stone-800 shadow-sm'
                        : 'text-stone-400 hover:text-stone-600'
                    }`}
                  >
                    {t === '7hari' ? '7 Hari' : '30 Hari'}
                  </button>
                ))}
              </div>
            </div>
            <ResponsiveContainer width="100%" height={220}>
              <LineChart data={salesData} margin={{ top: 4, right: 8, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis
                  dataKey="hari"
                  tick={{ fontSize: 11, fill: '#a8a29e' }}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis
                  tick={{ fontSize: 11, fill: '#a8a29e' }}
                  axisLine={false}
                  tickLine={false}
                />
                <Tooltip
                  contentStyle={{
                    background: '#1a1a2e',
                    border: 'none',
                    borderRadius: 10,
                    color: '#fff',
                    fontSize: 12,
                  }}
                  itemStyle={{ color: '#c4b5fd' }}
                  cursor={{ stroke: '#e5e7eb', strokeWidth: 1 }}
                />
                <Line
                  type="monotone"
                  dataKey="penjualan"
                  stroke="#6d28d9"
                  strokeWidth={2.5}
                  dot={{ r: 4, fill: '#6d28d9', strokeWidth: 0 }}
                  activeDot={{ r: 6, fill: '#6d28d9' }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Sales & Orders Breakdown */}
          <div className="bg-white rounded-2xl p-5 shadow-sm border border-stone-100">
            <h2 className="font-bold text-stone-800 mb-4">Rincian Penjualan & Pesanan</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Left column */}
              <div className="space-y-3">
                <div className="flex justify-between items-center py-2 border-b border-stone-50">
                  <span className="text-sm text-stone-500">Pesanan Tertunda</span>
                  <span className="text-sm font-bold text-amber-600 bg-amber-50 px-2.5 py-0.5 rounded-full">
                    12
                  </span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-stone-50">
                  <span className="text-sm text-stone-500">Pesanan Baru</span>
                  <span className="text-sm font-bold text-stone-700">45</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-stone-50">
                  <span className="text-sm text-stone-500">Rata-rata Nilai</span>
                  <span className="text-sm font-bold text-stone-700">Rp 7 Juta</span>
                </div>
                <div className="flex justify-between items-center py-2">
                  <span className="text-sm text-stone-500">Total Pesanan</span>
                  <span className="text-sm font-bold text-stone-700">10</span>
                </div>
              </div>
              {/* Right column - Today's summary */}
              <div className="bg-gradient-to-br from-indigo-600 to-violet-600 rounded-xl p-5 flex flex-col justify-between text-white">
                <p className="text-xs font-medium opacity-70 uppercase tracking-wider">
                  Total Penjualan Hari Ini
                </p>
                <p className="text-3xl font-bold font-mono mt-2">Rp 25 Jt</p>
                <div className="flex items-center justify-between mt-4 pt-3 border-t border-white/20">
                  <span className="text-xs opacity-70">Evaluasi Penjual</span>
                  <span className="font-bold text-lg">4.8 / 5.0</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ── RIGHT COLUMN ── */}
        <div className="space-y-6">
          {/* Category Pie Chart */}
          <div className="bg-white rounded-2xl p-5 shadow-sm border border-stone-100">
            <h2 className="font-bold text-stone-800 mb-1">Produk Terlaris by Kategori</h2>
            <p className="text-xs text-stone-400 mb-4">Distribusi penjualan per kategori</p>
            <PieChart width={220} height={180} className="mx-auto">
              <Pie
                data={categoryData}
                cx={105}
                cy={85}
                innerRadius={48}
                outerRadius={78}
                paddingAngle={3}
                dataKey="value"
              >
                {categoryData.map((_, index) => (
                  <Cell key={index} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  background: '#1a1a2e',
                  border: 'none',
                  borderRadius: 8,
                  color: '#fff',
                  fontSize: 12,
                }}
              />
            </PieChart>
            <div className="grid grid-cols-2 gap-1 mt-2">
              {categoryData.map((item, i) => (
                <div key={i} className="flex items-center gap-2">
                  <span
                    className="w-2.5 h-2.5 rounded-full flex-shrink-0"
                    style={{ background: COLORS[i] }}
                  />
                  <span className="text-xs text-stone-500 truncate">{item.name}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Out of Stock Warning */}
          <div className="bg-white rounded-2xl p-5 shadow-sm border border-stone-100">
            <div className="flex items-center gap-2 mb-3">
              <AlertTriangle size={15} className="text-rose-500" />
              <h2 className="font-bold text-stone-800 text-sm">Produk Habis Stok Segera</h2>
            </div>
            <div className="space-y-2.5">
              {outOfStock.map((item, i) => (
                <div
                  key={i}
                  className="flex items-center gap-3 p-2.5 rounded-xl bg-rose-50 border border-rose-100"
                >
                  <span className="text-xl">{item.icon}</span>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-semibold text-stone-700 truncate">{item.nama}</p>
                    <p className="text-[11px] text-rose-500 font-medium">Stok {item.stok} tersisa</p>
                  </div>
                  <ChevronRight size={14} className="text-stone-300 flex-shrink-0" />
                </div>
              ))}
            </div>
          </div>

          {/* Active Promotions */}
          <div className="bg-white rounded-2xl p-5 shadow-sm border border-stone-100">
            <div className="flex items-center gap-2 mb-3">
              <Megaphone size={15} className="text-violet-500" />
              <h2 className="font-bold text-stone-800 text-sm">Promosi Aktif</h2>
            </div>
            <div className="space-y-2.5">
              {promosi.map((item, i) => (
                <div
                  key={i}
                  className="flex items-start gap-2.5 p-2.5 rounded-xl bg-violet-50 border border-violet-100"
                >
                  <span className="mt-0.5 w-2 h-2 rounded-full bg-violet-500 flex-shrink-0 animate-pulse" />
                  <p className="text-xs text-stone-600 leading-snug">{item.nama}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ── RECENT ORDERS TABLE ── */}
      <div className="bg-white rounded-2xl shadow-sm border border-stone-100 overflow-hidden">
        <div className="flex items-center justify-between p-5 border-b border-stone-50">
          <div>
            <h2 className="font-bold text-stone-800">Feed Pesanan Terbaru</h2>
            <p className="text-xs text-stone-400 mt-0.5">Pesanan masuk secara real-time</p>
          </div>
          <button className="text-xs font-semibold text-violet-600 hover:text-violet-700 flex items-center gap-1 transition-colors">
            Lihat Semua <ChevronRight size={13} />
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-stone-50/70">
                <th className="text-left px-5 py-3 text-xs font-semibold text-stone-400 uppercase tracking-wider">
                  ID Pesanan
                </th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-stone-400 uppercase tracking-wider">
                  Nama Pembeli
                </th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-stone-400 uppercase tracking-wider">
                  Tanggal
                </th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-stone-400 uppercase tracking-wider">
                  Nilai
                </th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-stone-400 uppercase tracking-wider">
                  Status
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-50">
              {recentOrders.map((order, i) => (
                <tr
                  key={i}
                  className="hover:bg-stone-50/50 transition-colors cursor-pointer"
                >
                  <td className="px-5 py-3.5 font-mono text-xs font-semibold text-violet-600">
                    {order.id}
                  </td>
                  <td className="px-5 py-3.5 text-stone-700 font-medium">{order.nama}</td>
                  <td className="px-5 py-3.5 text-stone-400 text-xs">{order.tanggal}</td>
                  <td className="px-5 py-3.5 font-bold text-stone-700 font-mono text-xs">
                    {order.nilai}
                  </td>
                  <td className="px-5 py-3.5">
                    <StatusBadge status={order.status} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}