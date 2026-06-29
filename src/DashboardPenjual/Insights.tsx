import { useState } from 'react'
import {
  TrendingUp,
  Users,
  ShoppingBag,
  Percent,
  Clock,
  AlertTriangle,
  Star,
  Globe,
  Sliders,
  Tag,
  UserCheck,
  Eye,
  ChevronDown
} from 'lucide-react'

// Data Mock sesuai dengan baris tabel Wawasan Produk & Pelanggan pada wireframe
const INITIAL_PRODUCT_METRICS = [
  { sku: '1000001', name: 'ASUS Zenbook 14', views: 1412, ctr: '0.37 %', conversion: '80 %', customers: '37/68' },
  { sku: '1000002', name: 'Logitech MX Master 3', views: 1397, ctr: '0.06 %', conversion: '76 %', customers: '22/90' },
  { sku: '1000003', name: 'Keychron K4 V2', views: 968, ctr: '0.68 %', conversion: '60 %', customers: '35/64' },
  { sku: '1000004', name: '65W USB-C PD Charger', views: 360, ctr: '0.30 %', conversion: '20 %', customers: '17/30' },
]

export default function Insights() {
  const [metrics] = useState(INITIAL_PRODUCT_METRICS)

  return (
    <div className="p-6 bg-stone-50 min-h-screen text-stone-800" style={{ fontFamily: "'DM Sans', 'Segoe UI', sans-serif" }}>
      
      {/* JUDUL UTAMA */}
      <div className="mb-5">
        <h1 className="text-xl font-bold tracking-tight text-stone-900">Wawasan Toko Saya</h1>
      </div>

      {/* GRID UTAMA */}
      <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
        
        {/* KOLOM KIRI (3/4 Lebar) - Konten Utama Analisis */}
        <div className="xl:col-span-3 flex flex-col gap-6">
          
          {/* RINGKASAN WAWASAN TOKO (4 KARTU UTAMA) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            
            {/* Total Pengunjung */}
            <div className="bg-white p-4 rounded-xl border border-stone-200 shadow-sm relative overflow-hidden">
              <p className="text-xs font-semibold text-stone-500">Total Pengunjung</p>
              <div className="flex items-baseline gap-2 mt-1">
                <span className="text-2xl font-bold text-stone-900">153</span>
                <span className="text-[10px] text-emerald-600 font-bold bg-emerald-50 px-1 rounded flex items-center">
                  ↑ 12%
                </span>
              </div>
              {/* Mini Sparkline SVG */}
              <div className="w-full h-8 mt-2">
                <svg className="w-full h-full" viewBox="0 0 100 30" preserveAspectRatio="none">
                  <path d="M0 25 Q 20 10 40 22 T 80 5 T 100 12" fill="none" stroke="#3b82f6" strokeWidth="1.5" />
                </svg>
              </div>
              <span className="absolute right-2 top-2 text-[9px] font-bold text-stone-400 bg-stone-50 px-1.5 py-0.5 rounded border border-stone-100">
                Pengunjung Naik 12%
              </span>
            </div>

            {/* Rata-rata Nilai Pesanan */}
            <div className="bg-white p-4 rounded-xl border border-stone-200 shadow-sm">
              <p className="text-xs font-semibold text-stone-500">Rata-rata Nilai Pesanan</p>
              <p className="text-xl font-bold text-stone-900 mt-1">Rp 660.000</p>
              <p className="text-[10px] text-emerald-600 font-medium mt-3 flex items-center gap-1">
                <span className="font-bold">▲ 3.7%</span> to spatial periode
              </p>
            </div>

            {/* Tingkat Konversi Toko */}
            <div className="bg-white p-4 rounded-xl border border-stone-200 shadow-sm">
              <p className="text-xs font-semibold text-stone-500">Tingkat Konversi Toko</p>
              <p className="text-2xl font-bold text-stone-900 mt-1">7.5%</p>
              <div className="w-full bg-stone-100 h-1.5 rounded-full mt-4 overflow-hidden">
                <div className="bg-stone-900 h-full rounded-full" style={{ width: '7.5%' }}></div>
              </div>
            </div>

            {/* Tingkat Akuisisi Pelanggan Baru */}
            <div className="bg-white p-4 rounded-xl border border-stone-200 shadow-sm">
              <p className="text-xs font-semibold text-stone-500">Tingkat Akuisisi Pelanggan Baru</p>
              <p className="text-2xl font-bold text-stone-900 mt-1">5.3%</p>
              <div className="w-full bg-stone-100 h-1.5 rounded-full mt-4 overflow-hidden">
                <div className="bg-emerald-500 h-full rounded-full" style={{ width: '5.3%' }}></div>
              </div>
            </div>

          </div>

          {/* BARIS SEKSI GRAFIK TREN & PERFORMA TERLARIS (2 KOLOM) */}
          <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
            
            {/* Tren Kunjungan & Penjualan (3/5 Lebar) */}
            <div className="bg-white p-4 rounded-xl border border-stone-200 shadow-sm md:col-span-3">
              <h2 className="text-xs font-bold text-stone-900 mb-1">Tren Kunjungan & Penjualan (Bulan Ini)</h2>
              
              {/* Area Grafik Multi Line */}
              <div className="relative h-44 w-full mt-4">
                <div className="absolute left-0 top-0 text-[9px] text-stone-400">200</div>
                <div className="absolute left-0 top-1/3 -translate-y-1/2 text-[9px] text-stone-400">150</div>
                <div className="absolute left-0 top-2/3 -translate-y-1/2 text-[9px] text-stone-400">100</div>
                <div className="absolute left-0 bottom-6 text-[9px] text-stone-400">0</div>

                <div className="h-[130px] ml-7 border-b border-l border-stone-200 relative pt-2">
                  <svg className="w-full h-full overflow-visible" viewBox="0 0 400 100" preserveAspectRatio="none">
                    {/* Line 1: Kunjungan (Teal) */}
                    <path d="M 0 65 Q 80 40 160 55 T 320 25 T 400 40" fill="none" stroke="#0d9488" strokeWidth="1.5"/>
                    <circle cx="200" cy="48" r="2.5" fill="#0d9488" />

                    {/* Line 2: Pesanan Dibuat (Rose) */}
                    <path d="M 0 80 Q 80 65 160 70 T 320 50 T 400 60" fill="none" stroke="#f43f5e" strokeWidth="1.5"/>
                    
                    {/* Line 3: Pesanan Selesai (Amber) */}
                    <path d="M 0 90 Q 80 80 160 85 T 320 65 T 400 70" fill="none" stroke="#f59e0b" strokeWidth="1.5"/>
                  </svg>

                  {/* Popover Card Detail Tooltip bawaan dari Coreta Wireframe */}
                  <div className="absolute left-[42%] top-[10%] bg-stone-900/95 text-white border border-stone-800 rounded-lg p-2 text-[9px] font-medium pointer-events-none shadow-md z-10 min-w-[105px] leading-tight flex flex-col gap-0.5">
                    <p className="font-bold border-b border-white/10 pb-0.5 mb-0.5">Kunjungan: 27</p>
                    <p>Pesanan Dibuat: 21</p>
                    <p className="text-amber-300">Tingkat Konversi: 25%</p>
                    <p className="text-emerald-300">Pesanan Selesai: 1.0%</p>
                  </div>
                </div>

                {/* Sumbu X (Hari) */}
                <div className="flex justify-between ml-7 mt-1 text-[9px] text-stone-400 font-semibold">
                  <span>Hari</span><span>Hari</span><span>Hari</span><span>Hari</span><span>Hari</span><span>Hari</span>
                </div>
              </div>

              {/* Legend Tren Grafik */}
              <div className="flex items-center justify-center gap-4 mt-2 text-[10px] font-bold text-stone-500 border-t border-stone-50 pt-2">
                <span className="flex items-center gap-1"><span className="w-2.5 h-0.5 bg-teal-600 inline-block"></span> Kunjungan</span>
                <span className="flex items-center gap-1"><span className="w-2.5 h-0.5 bg-rose-500 inline-block"></span> Pesanan Dibuat</span>
                <span className="flex items-center gap-1"><span className="w-2.5 h-0.5 bg-amber-500 inline-block"></span> Pesanan Selesai</span>
              </div>
            </div>

            {/* Performa Produk Terlaris - Scatter Chart (2/5 Lebar) */}
            <div className="bg-white p-4 rounded-xl border border-stone-200 shadow-sm md:col-span-2 flex flex-col justify-between">
              <div>
                <h2 className="text-xs font-bold text-stone-900 mb-1">Performa Produk Terlaris</h2>
              </div>

              {/* Scatter / Bubble Plot Area */}
              <div className="relative h-40 w-full mt-2">
                <div className="absolute left-0 top-0 text-[8px] text-stone-400 font-mono">80</div>
                <div className="absolute left-0 top-1/2 -translate-y-1/2 text-[8px] text-stone-400 font-mono">40</div>
                <div className="absolute left-0 bottom-6 text-[8px] text-stone-400 font-mono">0</div>
                
                {/* Judul Sumbu Y Vertikal */}
                <div className="absolute -left-4 top-1/3 -rotate-90 text-[8px] text-stone-400 font-bold tracking-wider">
                  Jumlah Terjual
                </div>

                <div className="h-[110px] ml-6 border-b border-l border-stone-200 relative">
                  {/* Grid Lines */}
                  <div className="absolute w-full top-1/2 border-t border-dashed border-stone-100"></div>
                  
                  {/* Bubble Elements Map (Simulasi Gambar Sepatu/Boots di Coretan) */}
                  <div className="absolute left-[30%] bottom-[20%] w-6 h-6 rounded-full bg-amber-500/20 border border-amber-500 flex items-center justify-center shadow-sm">
                    <ShoppingBag size={10} className="text-amber-700" />
                  </div>
                  <div className="absolute left-[55%] bottom-[40%] w-8 h-8 rounded-full bg-rose-500/20 border border-rose-500 flex items-center justify-center shadow-sm">
                    <ShoppingBag size={12} className="text-rose-700" />
                  </div>
                  {/* Bubble Utama Terlaris dengan Pointer Annotate */}
                  <div className="absolute right-[20%] top-[15%] w-10 h-10 rounded-full bg-teal-500/20 border-2 border-teal-600 flex items-center justify-center shadow-md animate-pulse">
                    <ShoppingBag size={14} className="text-teal-700" />
                  </div>

                  <span className="absolute right-2 top-1/3 text-[9px] font-bold text-stone-700 italic bg-white/80 px-1 border border-stone-200 rounded pointer-events-none">
                    ← Analisis Konversi
                  </span>
                </div>

                {/* Sumbu X (Pendapatan) */}
                <div className="flex justify-between ml-6 mt-1 text-[8px] text-stone-400 font-mono font-bold">
                  <span>0</span><span>10.000</span><span>20.000</span><span>30.000</span>
                </div>
                <p className="text-center text-[8px] text-stone-400 font-bold tracking-wider mt-0.5">Pendapatan</p>
              </div>
            </div>

          </div>

          {/* TABEL WAWAsAN PRODUK & PELANGGAN */}
          <div className="bg-white rounded-xl border border-stone-200 shadow-sm overflow-hidden">
            <div className="p-4 border-b border-stone-100">
              <h2 className="text-xs font-bold text-stone-900">Wawasan Produk & Pelanggan</h2>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-stone-50 border-b border-stone-200 text-stone-500 font-semibold text-[10px] uppercase tracking-wider">
                    <th className="p-3">SKU/Produk</th>
                    <th className="p-3 text-right">Jumlah Dilihat</th>
                    <th className="p-3 text-right">Tingkat Klik-Melalui (CTR)</th>
                    <th className="p-3 text-right">Tingkat Konversi Produk</th>
                    <th className="p-3 text-center">Pelanggan Baru/Berulang</th>
                    <th className="p-3 text-center">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-100 text-xs font-medium text-stone-700">
                  {metrics.map((item) => (
                    <tr key={item.sku} className="hover:bg-stone-50/50 transition-colors">
                      <td className="p-3 text-stone-900 font-mono font-semibold">{item.sku}</td>
                      <td className="p-3 text-right font-bold text-stone-900">{item.views.toLocaleString('id-ID')}</td>
                      <td className="p-3 text-right font-mono text-stone-600">{item.ctr}</td>
                      <td className="p-3 text-right text-emerald-600 font-bold">{item.conversion}</td>
                      <td className="p-3 text-center font-mono text-stone-500 bg-stone-50/40">{item.customers}</td>
                      <td className="p-3 text-center">
                        <button className="inline-flex items-center gap-1 px-2 py-1 text-[11px] border border-stone-200 rounded-md text-stone-700 hover:bg-stone-50 bg-white shadow-sm font-semibold">
                          Edit Strategi
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* KOLOM KANAN (1/4 Lebar) - OPERATIONAL METRICS & DEMOGRAFI */}
        <div className="flex flex-col gap-6">
          <div className="bg-white p-4 rounded-xl border border-stone-200 shadow-sm flex flex-col gap-5">
            
            {/* Bagian 1: Operational Metrics */}
            <div>
              <h2 className="text-xs font-bold uppercase tracking-wider text-stone-400 mb-1">Operational Metrics</h2>
              <div className="h-px bg-stone-100 w-full mb-3"></div>
              
              <div className="grid grid-cols-3 gap-2 text-center">
                {/* Rata-rata Waktu Pengiriman */}
                <div className="p-2 border border-stone-200 rounded-lg bg-stone-50 flex flex-col items-center justify-center">
                  <Clock size={15} className="text-stone-600 mb-1" />
                  <p className="text-[8px] text-stone-500 font-semibold leading-tight">Rata-rata Pengiriman</p>
                  <p className="text-[10px] font-bold text-stone-900 mt-1">Cepat</p>
                </div>
                {/* Tingkat Komplain */}
                <div className="p-2 border border-stone-200 rounded-lg bg-stone-50 flex flex-col items-center justify-center">
                  <AlertTriangle size={15} className="text-amber-500 mb-1" />
                  <p className="text-[8px] text-stone-500 font-semibold leading-tight">Tingkat Komplain</p>
                  <p className="text-[10px] font-bold text-stone-900 mt-1">Rendah</p>
                </div>
                {/* Rating Toko */}
                <div className="p-2 border border-stone-200 rounded-lg bg-stone-50 flex flex-col items-center justify-center">
                  <Star size={15} className="text-amber-500 fill-amber-400 mb-1" />
                  <p className="text-[8px] text-stone-500 font-semibold leading-tight">Rating Toko</p>
                  <p className="text-[10px] font-bold text-stone-900 mt-1">5.00</p>
                </div>
              </div>
            </div>

            {/* Bagian 2: Analisis Demografi Pelanggan */}
            <div className="pt-2 border-t border-stone-100">
              <h2 className="text-xs font-bold uppercase tracking-wider text-stone-400 mb-1">Analisis Demografi Pelanggan</h2>
              <div className="h-px bg-stone-100 w-full mb-3"></div>
              
              {/* Representasi Dunia Mini SVG Map / Grafik Area */}
              <div className="bg-stone-50 border border-stone-200 rounded-lg p-2 flex flex-col items-center justify-center h-24 mb-2 relative overflow-hidden">
                <Globe size={32} className="text-stone-200 absolute opacity-40" />
                <div className="w-full flex justify-between px-2 text-[9px] font-bold text-stone-400 z-10">
                  <span>Domestik</span><span>Global</span>
                </div>
                {/* Placeholder Bar Sederhana Lokasi */}
                <div className="w-full px-2 mt-2 z-10">
                  <div className="flex justify-between text-[10px] text-stone-700 font-medium mb-0.5">
                    <span>Medan & Sekitarnya</span>
                    <span>72%</span>
                  </div>
                  <div className="w-full bg-stone-200 h-1 rounded-full overflow-hidden">
                    <div className="bg-stone-800 h-full" style={{ width: '72%' }}></div>
                  </div>
                </div>
              </div>
              <p className="text-[9px] text-stone-400 font-semibold text-center tracking-wide uppercase">Top Lokasi Pelanggan Visited dan Area</p>
            </div>

            {/* Bagian 3: Rekomendasi Strategi Wawasan */}
            <div className="pt-2 border-t border-stone-100">
              <h2 className="text-xs font-bold uppercase tracking-wider text-stone-400 mb-2">Rekomendasi Strategi Wawasan</h2>
              
              <div className="grid grid-cols-3 gap-2 text-center text-[9px] font-bold text-stone-700">
                <div className="p-2 border border-stone-200 rounded-lg bg-stone-50 flex flex-col items-center gap-1.5 hover:bg-stone-100/70 transition-colors cursor-pointer">
                  <Sliders size={13} className="text-stone-600" />
                  <span className="leading-tight">Optimasi Halaman Produk</span>
                </div>
                <div className="p-2 border border-stone-200 rounded-lg bg-stone-50 flex flex-col items-center gap-1.5 hover:bg-stone-100/70 transition-colors cursor-pointer">
                  <Tag size={13} className="text-stone-600" />
                  <span className="leading-tight">Analisis Harga Pesaing</span>
                </div>
                <div className="p-2 border border-stone-200 rounded-lg bg-stone-50 flex flex-col items-center gap-1.5 hover:bg-stone-100/70 transition-colors cursor-pointer">
                  <UserCheck size={13} className="text-stone-600" />
                  <span className="leading-tight">Strategi Retensi Pelanggan</span>
                </div>
              </div>
            </div>

          </div>
        </div>

      </div>
    </div>
  )
}