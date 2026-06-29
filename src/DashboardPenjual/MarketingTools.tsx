import { useState } from 'react'
import {
  PlusCircle,
  Calendar,
  Search,
  Download,
  ChevronDown,
  Globe,       // Pengganti Facebook / Browser internet
  Camera,      // Pengganti Instagram
  Mail,        // Ikon Email bawaan Lucide
  Video,       // Pengganti YouTube
  TrendingUp,
  Target,
  Percent,
  Award,
  Users,
  Eye,
  Copy,
  Sliders
} from 'lucide-react'

// Data Mock sesuai dengan wireframe
const INITIAL_CAMPAIGNS = [
  { id: '1000002', name: 'Pembagian Kampanye', target: 'Target Audience', channels: ['facebook', 'instagram', 'mail'], budget: 4500000, date: '21/09/20', status: 'Active' },
  { id: '1000003', name: 'Order Payment Kampanye', target: 'Kampanye Pembayaran', channels: ['facebook'], budget: 8200000, date: '21/09/20', status: 'Paused' },
  { id: '1000004', name: 'Biaya Layanan Kampanye', target: 'Kampanye Biaya Layanan', channels: ['facebook', 'instagram', 'mail'], budget: 1100000, date: '21/09/20', status: 'Ditunda' },
  { id: '1000005', name: 'Pemasaran Campaign', target: 'Kampanye Pemasaran', channels: ['facebook'], budget: 1100000, date: '21/09/20', status: 'Aktif' },
  { id: '1000006', name: 'Biaya Pesanan Campaign', target: 'Kampanye Biaya Pesanan', channels: ['facebook'], budget: 2500000, date: '21/09/20', status: 'Selesai' },
  { id: '1000007', name: 'New Catalog Campaign', target: 'Kampanye Katalog Baru', channels: ['facebook'], budget: 1500000, date: '21/09/20', status: 'Selesai' },
]

export default function MarketingTools() {
  const [campaigns] = useState(INITIAL_CAMPAIGNS)
  const [search, setSearch] = useState('')

  const formatRupiah = (val: number) => {
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(val)
  }

  return (
    <div className="p-6 bg-stone-50 min-h-screen text-stone-800" style={{ fontFamily: "'DM Sans', 'Segoe UI', sans-serif" }}>
      
      {/* JUDUL UTAMA */}
      <div className="mb-5">
        <h1 className="text-xl font-bold tracking-tight text-stone-900">Alat Pemasaran Saya</h1>
      </div>

      {/* GRID UTAMA */}
      <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
        
        {/* KOLOM KIRI (3/4 Lebar) - Konten Utama Pemasaran */}
        <div className="xl:col-span-3 flex flex-col gap-6">
          
          {/* BARIS ACTION UTAMA & FILTER */}
          <div className="flex flex-wrap items-center justify-between gap-3 bg-white p-4 rounded-xl border border-stone-200 shadow-sm">
            <div className="flex flex-wrap items-center gap-2 flex-1 min-w-[300px]">
              {/* Buat Kampanye Baru */}
              <button className="flex items-center gap-1.5 bg-stone-900 text-white text-xs font-semibold px-3 py-2 rounded-lg hover:bg-stone-800 transition-colors">
                <PlusCircle size={14} />
                Buat Kampanye Baru
              </button>

              {/* Pilih Rentang Tanggal */}
              <button className="flex items-center gap-1.5 text-xs font-medium px-3 py-2 border border-stone-200 rounded-lg bg-white text-stone-600 hover:bg-stone-50">
                <Calendar size={13} />
                Pilih Rentang Tanggal
              </button>

              {/* Cari Kampanye */}
              <div className="relative flex-1 max-w-xs">
                <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" />
                <input 
                  type="text" 
                  placeholder="Cari Kampanye..." 
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full pl-9 pr-3 py-1.5 bg-stone-50 border border-stone-200 rounded-lg text-xs focus:outline-none focus:border-stone-400 transition-colors"
                />
              </div>
            </div>

            {/* Ekspor Laporan Pemasaran */}
            <button className="flex items-center gap-1.5 text-xs font-semibold px-3 py-2 border border-stone-200 rounded-lg bg-white text-stone-700 hover:bg-stone-50 transition-colors">
              <Download size={14} />
              Ekspor Laporan Pemasaran
            </button>
          </div>

          {/* KINERJA KAMPANYE PEMASARAN */}
          <div className="bg-white p-5 rounded-xl border border-stone-200 shadow-sm">
            <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 mb-4">
              <div>
                <h2 className="text-sm font-bold text-stone-900">Kinerja Kampanye Pemasaran (Bulan Ini)</h2>
                {/* Legenda Grafik */}
                <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-2 text-[11px] font-medium text-stone-500">
                  <div className="flex items-center gap-1">
                    <span className="w-2.5 h-0.5 bg-teal-600 inline-block"></span> Jangkauan Kampanye Pemasaran
                  </div>
                  <div className="flex items-center gap-1">
                    <span className="w-2.5 h-0.5 bg-rose-500 inline-block"></span> Tingkat Konversi ↑
                  </div>
                  <div className="flex items-center gap-1">
                    <span className="w-2.5 h-0.5 bg-amber-500 inline-block"></span> Tingkat Konversi from Marketing
                  </div>
                </div>
              </div>

              {/* Kotak Ringkasan Angka */}
              <div className="bg-stone-50 border border-stone-200 rounded-lg p-3 min-w-[240px] text-xs font-medium text-stone-700 flex flex-col gap-1 shadow-inner">
                <div className="flex justify-between"><span>Kampanye Aktif:</span> <span className="font-bold text-stone-900">8</span></div>
                <div className="flex justify-between"><span>Rata-rata ROAS:</span> <span className="font-bold text-stone-900">3.5x</span></div>
                <div className="flex justify-between text-stone-500"><span>Tingkat Konversi Terakhir:</span> <span className="text-emerald-600 font-bold">12%</span></div>
              </div>
            </div>

            {/* Area Grafik Gabungan Line & Bar */}
            <div className="relative h-44 w-full mt-4">
              <div className="absolute left-0 top-0 text-[10px] text-stone-400">Rp</div>
              <div className="absolute left-0 top-1/2 -translate-y-1/2 text-[10px] text-stone-400">Rp</div>
              <div className="absolute left-0 bottom-6 text-[10px] text-stone-400">Rp</div>

              <div className="absolute right-0 top-0 text-[10px] text-stone-400">10%</div>
              <div className="absolute right-0 top-1/2 -translate-y-1/2 text-[10px] text-stone-400">5%</div>
              <div className="absolute right-0 bottom-6 text-[10px] text-stone-400">0%</div>
              
              <div className="h-[130px] mx-6 border-b border-l border-r border-stone-200 relative pt-4">
                <svg className="w-full h-full overflow-visible" viewBox="0 0 600 100" preserveAspectRatio="none">
                  {/* Bar Chart - Background Volume */}
                  <rect x="50" y="65" width="8" height="35" fill="#d6d3d1" rx="1" />
                  <rect x="130" y="45" width="8" height="55" fill="#d6d3d1" rx="1" />
                  <rect x="210" y="30" width="8" height="70" fill="#d6d3d1" rx="1" />
                  <rect x="290" y="75" width="8" height="25" fill="#d6d3d1" rx="1" />
                  <rect x="370" y="40" width="8" height="60" fill="#d6d3d1" rx="1" />
                  <rect x="450" y="60" width="8" height="40" fill="#d6d3d1" rx="1" />
                  
                  {/* Line 1: Jangkauan Kampanye (Teal) */}
                  <path d="M 0 45 Q 100 25 200 35 T 400 10 T 600 20" fill="none" stroke="#0d9488" strokeWidth="2"/>
                  <circle cx="200" cy="35" r="3" fill="#0d9488" />
                  <circle cx="400" cy="10" r="3" fill="#0d9488" />

                  {/* Line 2: Tingkat Konversi (Rose) */}
                  <path d="M 0 70 Q 100 55 200 60 T 400 35 T 600 45" fill="none" stroke="#f43f5e" strokeWidth="1.5"/>
                  
                  {/* Line 3: Konversi dari Marketing (Amber) */}
                  <path d="M 0 85 Q 100 75 200 50 T 400 75 T 600 80" fill="none" stroke="#f59e0b" strokeWidth="1.5"/>
                  <circle cx="200" cy="50" r="3" fill="#f59e0b" />
                </svg>

                {/* Annotation Target Konversi */}
                <div className="absolute right-4 top-4 bg-white/90 border border-stone-300 rounded px-1.5 py-0.5 text-[9px] font-bold text-stone-700 pointer-events-none shadow-sm">
                  ← Target Konversi
                </div>
              </div>

              {/* Sumbu X (Hari) */}
              <div className="flex justify-between mx-6 mt-1 text-[10px] text-stone-400 font-medium">
                <span>Hari</span><span>Hari</span><span>Hari</span><span>Hari</span><span>Hari</span><span>Hari</span><span>Hari</span><span>Hari</span><span>Hari</span>
              </div>
            </div>
          </div>

          {/* DAFTAR KAMPANYE PEMASARAN */}
          <div className="bg-white rounded-xl border border-stone-200 shadow-sm overflow-hidden">
            <div className="p-4 border-b border-stone-100 flex items-center justify-between">
              <h2 className="text-sm font-bold text-stone-900">Daftar Kampanye Pemasaran</h2>
              <div className="flex items-center gap-2">
                <button className="flex items-center gap-1 text-xs border border-stone-200 px-2.5 py-1 rounded-md text-stone-600 bg-white">
                  Sort Produk <ChevronDown size={12} />
                </button>
                <button className="flex items-center gap-1 text-xs border border-stone-200 px-2.5 py-1 rounded-md text-stone-600 bg-white">
                  Tanggal <ChevronDown size={12} />
                </button>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-stone-50 border-b border-stone-200 text-stone-500 font-semibold text-[11px] uppercase tracking-wider">
                    <th className="p-3 w-8"><input type="checkbox" className="rounded text-stone-900 focus:ring-0" /></th>
                    <th className="p-3">No. Kampanye</th>
                    <th className="p-3">Nama Kampanye</th>
                    <th className="p-3">Target Audience</th>
                    <th className="p-3 text-center">Saluran</th>
                    <th className="p-3 text-right">Anggaran</th>
                    <th className="p-3 text-center">Tanggal</th>
                    <th className="p-3 text-center">Status</th>
                    <th className="p-3 text-center">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-100 text-xs font-medium text-stone-700">
                  {campaigns.map((camp) => (
                    <tr key={camp.id} className="hover:bg-stone-50/50 transition-colors">
                      <td className="p-3"><input type="checkbox" className="rounded text-stone-900 focus:ring-0" /></td>
                      <td className="p-3 text-stone-900 font-mono font-semibold">{camp.id}</td>
                      <td className="p-3 text-stone-800 font-semibold max-w-[140px] truncate" title={camp.name}>{camp.name}</td>
                      <td className="p-3 text-stone-500 max-w-[150px] truncate" title={camp.target}>{camp.target}</td>
                      <td className="p-3">
                        {/* Ikon Brand yang Diperbarui Menggunakan Alternatif Lucide Bawaan */}
                        <div className="flex items-center justify-center gap-1 text-stone-500">
                          {camp.channels.includes('facebook') && <span className="p-1 bg-stone-100 rounded border border-stone-200" title="Facebook"><Globe size={12} className="text-blue-600" /></span>}
                          {camp.channels.includes('instagram') && <span className="p-1 bg-stone-100 rounded border border-stone-200" title="Instagram"><Camera size={12} className="text-pink-600" /></span>}
                          {camp.channels.includes('mail') && <span className="p-1 bg-stone-100 rounded border border-stone-200" title="Email"><Mail size={12} className="text-amber-600" /></span>}
                        </div>
                      </td>
                      <td className="p-3 text-right font-bold text-stone-900">{formatRupiah(camp.budget)}</td>
                      <td className="p-3 text-center font-mono text-stone-500">{camp.date}</td>
                      <td className="p-3 text-center">
                        <span className={`inline-block px-2 py-0.5 rounded-md text-[10px] font-bold ${
                          camp.status === 'Active' || camp.status === 'Aktif'
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' 
                            : camp.status === 'Paused' || camp.status === 'Ditunda'
                            ? 'bg-amber-50 text-amber-700 border border-amber-200'
                            : 'bg-stone-100 text-stone-600 border border-stone-300'
                        }`}>
                          {camp.status}
                        </span>
                      </td>
                      <td className="p-3">
                        <div className="flex items-center justify-center gap-1">
                          <button className="flex items-center gap-0.5 px-1.5 py-1 text-[11px] border border-stone-200 rounded text-stone-700 hover:bg-stone-50 bg-white">
                            <Eye size={11} /> Laporan
                          </button>
                          <button className="p-1 border border-stone-200 rounded text-stone-600 hover:bg-stone-50 bg-white" title="Duplikat">
                            <Copy size={11} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* KOLOM KANAN (1/4 Lebar) - ANALISIS SALURAN PEMASARAN */}
        <div className="flex flex-col gap-6">
          <div className="bg-white p-4 rounded-xl border border-stone-200 shadow-sm flex flex-col gap-5">
            <div>
              <h2 className="text-xs font-bold uppercase tracking-wider text-stone-400 mb-1">Analisis Saluran Pemasaran</h2>
              <div className="h-px bg-stone-100 w-full"></div>
            </div>

            {/* SEKSI 1: ROI Pemasaran */}
            <div>
              <h3 className="text-xs font-bold text-stone-800 mb-3">ROI Pemasaran</h3>
              <div className="grid grid-cols-3 gap-2 text-center">
                <div className="p-2 border border-stone-200 rounded-lg bg-stone-50 flex flex-col items-center justify-center">
                  <Percent size={16} className="text-stone-600 mb-1" />
                  <p className="text-[9px] text-stone-500 font-medium leading-tight">ROI Pemasaran</p>
                  <p className="text-[11px] font-bold text-stone-900 mt-1">3.5%</p>
                </div>
                <div className="p-2 border border-stone-200 rounded-lg bg-stone-50 flex flex-col items-center justify-center">
                  <Award size={16} className="text-amber-500 mb-1" />
                  <p className="text-[9px] text-stone-500 font-medium leading-tight">Top Performa Kampanye</p>
                  <p className="text-[10px] font-bold text-stone-900 mt-1">Terbaik</p>
                </div>
                <div className="p-2 border border-stone-200 rounded-lg bg-stone-50 flex flex-col items-center justify-center">
                  <Users size={16} className="text-emerald-600 mb-1" />
                  <p className="text-[9px] text-stone-500 font-medium leading-tight">Tingkat Akuisisi Baru</p>
                  <p className="text-[10px] font-bold text-stone-900 mt-1">Tinggi</p>
                </div>
              </div>
            </div>

            {/* SEKSI 2: Budget Distribution by Channel */}
            <div className="pt-2 border-t border-stone-100">
              <h3 className="text-xs font-bold text-stone-800 mb-3">Analisis Saluran Pemasaran</h3>
              <div className="flex items-center justify-between gap-3">
                
                {/* Donut Chart Budget via Conic Gradient */}
                <div className="flex flex-col items-center text-center">
                  <div 
                    className="w-14 h-14 rounded-full border border-stone-200 shadow-sm mb-1"
                    style={{
                      background: 'conic-gradient(#3b82f6 0% 50%, #ea580c 50% 75%, #10b981 75% 90%, #eab308 90% 100%)'
                    }}
                  />
                  <span className="text-[9px] font-bold text-stone-500 leading-tight">Budget Distribution<br/>by Channel</span>
                </div>

                <div className="flex flex-col gap-1.5 flex-1 text-[11px] font-medium text-stone-600">
                  <div className="flex justify-between items-center bg-stone-50 p-1 rounded px-2 border border-stone-100">
                    <span className="flex items-center gap-1"><Globe size={10} className="text-blue-600" /> FB Pemasaran</span>
                  </div>
                  <div className="flex justify-between items-center bg-stone-50 p-1 rounded px-2 border border-stone-100">
                    <span className="flex items-center gap-1"><Mail size={10} className="text-amber-600" /> Email</span>
                  </div>
                  <div className="flex justify-between items-center bg-stone-50 p-1 rounded px-2 border border-stone-100">
                    <span className="flex items-center gap-1"><Camera size={10} className="text-pink-600" /> Instagram</span>
                  </div>
                  <div className="flex justify-between items-center bg-stone-50 p-1 rounded px-2 border border-stone-100">
                    <span className="flex items-center gap-1"><Video size={10} className="text-red-600" /> YouTube</span>
                  </div>
                </div>

              </div>
            </div>

            {/* SEKSI 3: Rekomendasi Strategi Pemasaran */}
            <div className="pt-2 border-t border-stone-100">
              <h3 className="text-xs font-bold text-stone-800 mb-2">Rekomendasi Strategi Pemasaran</h3>
              <div className="grid grid-cols-3 gap-2 text-center text-[10px] font-bold text-stone-700">
                <div className="p-2 border border-stone-200 rounded-lg bg-stone-50 flex flex-col items-center gap-1.5 hover:bg-stone-100/70 transition-colors cursor-pointer">
                  <Sliders size={14} className="text-stone-600" />
                  <span className="leading-tight">Pengujian A/B & Optimasi</span>
                </div>
                <div className="p-2 border border-stone-200 rounded-lg bg-stone-50 flex flex-col items-center gap-1.5 hover:bg-stone-100/70 transition-colors cursor-pointer">
                  <Target size={14} className="text-stone-600" />
                  <span className="leading-tight">Penargetan Audiens</span>
                </div>
                <div className="p-2 border border-stone-200 rounded-lg bg-stone-50 flex flex-col items-center gap-1.5 hover:bg-stone-100/70 transition-colors cursor-pointer">
                  <TrendingUp size={14} className="text-stone-600" />
                  <span className="leading-tight">Optimalkan Anggaran</span>
                </div>
              </div>
            </div>

          </div>
        </div>

      </div>
    </div>
  )
}