import { useState, useEffect, useCallback } from 'react';
import {
  PlusCircle, Calendar, Search, Download, ChevronDown,
  Eye, Printer, DollarSign, AlertTriangle, HeartPulse,
  TrendingUp, Clock, BarChart3, RefreshCw, X,
} from 'lucide-react';
import CetakResi from './cetakresi';
import {
  fetchTransaksi,
  fetchRingkasan,
  fetchGrafik,
  fetchAnalisisPemasukan,
  exportLaporan,
  type Transaksi,
  type RingkasanKeuangan,
  type GrafikHarian,
  type AnalisisPemasukan,
  type FilterTransaksi,
  type StatusTransaksi,
} from '../services/keuanganService';

// ─── Helpers ──────────────────────────────────────────────────────────────────

const formatRupiah = (val: number): string =>
  new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    maximumFractionDigits: 0,
  }).format(val ?? 0);

const PIE_COLORS = ['#3b82f6', '#f59e0b', '#ec4899', '#10b981', '#8b5cf6'];

function buildPieGradient(data: AnalisisPemasukan[]): string {
  const total = data.reduce((s, d) => s + Number(d.total), 0);
  if (total === 0) return 'conic-gradient(#e7e5e4 0% 100%)';
  let cursor = 0;
  const stops = data.map((d, i) => {
    const pct = (Number(d.total) / total) * 100;
    const stop = `${PIE_COLORS[i % PIE_COLORS.length]} ${cursor.toFixed(1)}% ${(cursor + pct).toFixed(1)}%`;
    cursor += pct;
    return stop;
  });
  return `conic-gradient(${stops.join(', ')})`;
}

function buildGrafikPoints(data: GrafikHarian[], daysInMonth: number): GrafikHarian[] {
  const map = new Map(data.map((d) => [d.hari, d]));
  return Array.from({ length: daysInMonth }, (_, i) => ({
    hari: i + 1,
    masuk:         Number(map.get(i + 1)?.masuk         ?? 0),
    keluar:        Number(map.get(i + 1)?.keluar        ?? 0),
    biaya_layanan: Number(map.get(i + 1)?.biaya_layanan ?? 0),
  }));
}

function scaleY(val: number, max: number, height = 100): number {
  return max === 0 ? height : height - (val / max) * (height - 8);
}

function buildPath(
  points: GrafikHarian[],
  xStep: number,
  getY: (p: GrafikHarian) => number,
): string {
  return points
    .map((p, i) => {
      const x = i * xStep;
      const y = getY(p);
      if (i === 0) return `M ${x} ${y}`;
      const px = (i - 1) * xStep;
      const py = getY(points[i - 1]);
      const cpx = (px + x) / 2;
      return `C ${cpx} ${py} ${cpx} ${y} ${x} ${y}`;
    })
    .join(' ');
}

// ─── Component ────────────────────────────────────────────────────────────────

export default function FinanceManagement() {
  // ── Data state ─────────────────────────────────────────────────────────────
  const [transaksi,  setTransaksi]  = useState<Transaksi[]>([]);
  const [ringkasan,  setRingkasan]  = useState<RingkasanKeuangan | null>(null);
  const [grafik,     setGrafik]     = useState<GrafikHarian[]>([]);
  const [analisis,   setAnalisis]   = useState<AnalisisPemasukan[]>([]);

  // ── UI state ───────────────────────────────────────────────────────────────
  const [search,          setSearch]          = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [startDate,       setStartDate]       = useState('');
  const [endDate,         setEndDate]         = useState('');
  const [showDatePicker,  setShowDatePicker]  = useState(false);
  const [loading,         setLoading]         = useState(true);
  const [error,           setError]           = useState('');
  const [resiTarget,      setResiTarget]      = useState<Transaksi | null>(null);

  // ── Debounce search ────────────────────────────────────────────────────────
  useEffect(() => {
    const t = setTimeout(() => setDebouncedSearch(search), 400);
    return () => clearTimeout(t);
  }, [search]);

  // ── Fetch all ──────────────────────────────────────────────────────────────
  const loadAll = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const filters: FilterTransaksi = {
        search:    debouncedSearch,
        startDate,
        endDate,
      };
      const [txData, summaryData, grafikData, analisisData] = await Promise.all([
        fetchTransaksi(filters),
        fetchRingkasan(),
        fetchGrafik(),
        fetchAnalisisPemasukan(),
      ]);
      setTransaksi(txData);
      setRingkasan(summaryData);
      setGrafik(grafikData);
      setAnalisis(analisisData);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Gagal memuat data.');
    } finally {
      setLoading(false);
    }
  }, [debouncedSearch, startDate, endDate]);

  useEffect(() => { void loadAll(); }, [loadAll]);

  // ── Grafik compute ─────────────────────────────────────────────────────────
  const now          = new Date();
  const daysInMonth  = new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate();
  const grafikPoints = buildGrafikPoints(grafik, daysInMonth);
  const maxVal       = Math.max(...grafikPoints.flatMap((p) => [p.masuk, p.keluar, p.biaya_layanan]), 1);
  const xStep        = 600 / (daysInMonth - 1);

  // ── Render ─────────────────────────────────────────────────────────────────
  return (
    <div
      className="p-6 bg-stone-50 min-h-screen text-stone-800"
      style={{ fontFamily: "'DM Sans', 'Segoe UI', sans-serif" }}
    >
      {/* Judul */}
      <div className="mb-5 flex items-center justify-between">
        <h1 className="text-xl font-bold tracking-tight text-stone-900">Keuangan Toko Saya</h1>
        <button
          onClick={() => void loadAll()}
          disabled={loading}
          className="flex items-center gap-1.5 text-xs font-medium text-stone-500 hover:text-stone-800 transition-colors disabled:opacity-40"
        >
          <RefreshCw size={13} className={loading ? 'animate-spin' : ''} />
          {loading ? 'Memuat...' : 'Perbarui'}
        </button>
      </div>

      {/* Error Banner */}
      {error && (
        <div className="mb-4 flex items-center gap-2 bg-rose-50 border border-rose-200 text-rose-700 text-xs font-medium px-4 py-2.5 rounded-lg">
          <AlertTriangle size={14} className="shrink-0" />
          <span className="flex-1">{error}</span>
          <button onClick={() => setError('')}><X size={13} /></button>
        </div>
      )}

      {/* Grid Utama */}
      <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">

        {/* ── KOLOM KIRI ────────────────────────────────────────────────── */}
        <div className="xl:col-span-3 flex flex-col gap-6">

          {/* ACTION BAR */}
          <div className="flex flex-wrap items-center justify-between gap-3 bg-white p-4 rounded-xl border border-stone-200 shadow-sm">
            <div className="flex flex-wrap items-center gap-2 flex-1 min-w-[300px]">
              <button className="flex items-center gap-1.5 bg-stone-900 text-white text-xs font-semibold px-3 py-2 rounded-lg hover:bg-stone-800 transition-colors">
                <PlusCircle size={14} />
                Buat Penarikan Saldo
              </button>

              {/* Date range picker */}
              <div className="relative">
                <button
                  onClick={() => setShowDatePicker((v) => !v)}
                  className="flex items-center gap-1.5 text-xs font-medium px-3 py-2 border border-stone-200 rounded-lg bg-white text-stone-600 hover:bg-stone-50"
                >
                  <Calendar size={13} />
                  {startDate && endDate ? `${startDate} – ${endDate}` : 'Pilih Rentang Tanggal'}
                </button>
                {showDatePicker && (
                  <div className="absolute top-full mt-1 left-0 z-30 bg-white border border-stone-200 rounded-xl shadow-xl p-4 flex flex-col gap-2 min-w-[240px]">
                    {(['Dari', 'Sampai'] as const).map((label, i) => {
                      const val   = i === 0 ? startDate : endDate;
                      const setVal = i === 0 ? setStartDate : setEndDate;
                      return (
                        <div key={label} className="flex flex-col gap-1">
                          <label className="text-[10px] font-semibold text-stone-500 uppercase tracking-wide">{label}</label>
                          <input
                            type="date"
                            value={val}
                            onChange={(e) => setVal(e.target.value)}
                            className="text-xs border border-stone-200 rounded-lg px-3 py-1.5 focus:outline-none focus:border-stone-400"
                          />
                        </div>
                      );
                    })}
                    <div className="flex gap-2 pt-1">
                      <button
                        onClick={() => { setStartDate(''); setEndDate(''); setShowDatePicker(false); }}
                        className="flex-1 text-xs font-medium py-1.5 border border-stone-200 rounded-lg text-stone-500 hover:bg-stone-50"
                      >
                        Reset
                      </button>
                      <button
                        onClick={() => setShowDatePicker(false)}
                        className="flex-1 text-xs font-semibold py-1.5 bg-stone-900 text-white rounded-lg hover:bg-stone-800"
                      >
                        Terapkan
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* Search */}
              <div className="relative flex-1 max-w-xs">
                <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" />
                <input
                  type="text"
                  placeholder="Cari transaksi..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full pl-9 pr-3 py-1.5 bg-stone-50 border border-stone-200 rounded-lg text-xs focus:outline-none focus:border-stone-400 transition-colors"
                />
              </div>
            </div>

            <button
              onClick={() => exportLaporan(transaksi)}
              disabled={transaksi.length === 0}
              className="flex items-center gap-1.5 text-xs font-semibold px-3 py-2 border border-stone-200 rounded-lg bg-white text-stone-700 hover:bg-stone-50 transition-colors disabled:opacity-40"
            >
              <Download size={14} />
              Export Laporan
            </button>
          </div>

          {/* GRAFIK */}
          <div className="bg-white p-5 rounded-xl border border-stone-200 shadow-sm">
            <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 mb-4">
              <div>
                <h2 className="text-sm font-bold text-stone-900">Wawasan Saldo & Pendapatan (Bulan Ini)</h2>
                <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-2 text-[11px] font-medium text-stone-500">
                  {([
                    ['bg-teal-600',  'Pemasukan'],
                    ['bg-rose-500',  'Pengeluaran'],
                    ['bg-amber-500', 'Biaya Layanan'],
                  ] as [string, string][]).map(([color, label]) => (
                    <div key={label} className="flex items-center gap-1">
                      <span className={`w-2.5 h-0.5 ${color} inline-block`} />
                      {label}
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-stone-50 border border-stone-200 rounded-lg p-3 min-w-[240px] text-xs font-medium text-stone-700 flex flex-col gap-1 shadow-inner">
                {([
                  ['Total Saldo',            ringkasan?.saldo_tersedia,       'font-bold text-stone-900'],
                  ['Pendapatan Bulan Ini',   ringkasan?.pendapatan_bulan_ini, 'font-bold text-stone-900'],
                  ['Biaya Bulan Ini',        ringkasan?.biaya_bulan_ini,      'text-stone-500'],
                ] as [string, number | undefined, string][]).map(([label, val, cls]) => (
                  <div key={label} className="flex justify-between">
                    <span>{label}:</span>
                    <span className={cls}>{loading ? '–' : formatRupiah(val ?? 0)}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* SVG Chart */}
            <div className="relative h-44 w-full mt-2">
              <div className="h-[130px] ml-6 border-b border-l border-stone-200 relative">
                {loading ? (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-[11px] text-stone-400 animate-pulse">Memuat grafik...</span>
                  </div>
                ) : (
                  <svg className="w-full h-full overflow-visible" viewBox="0 0 600 100" preserveAspectRatio="none">
                    {grafikPoints.map((p, i) => {
                      const barH = Math.max(2, (p.biaya_layanan / maxVal) * 40);
                      return (
                        <rect key={i} x={i * xStep - 3} y={100 - barH} width={6} height={barH} fill="#e7e5e4" rx="1" />
                      );
                    })}
                    <path d={buildPath(grafikPoints, xStep, (p) => scaleY(p.masuk,  maxVal))} fill="none" stroke="#0d9488" strokeWidth="2" />
                    <path d={buildPath(grafikPoints, xStep, (p) => scaleY(p.keluar, maxVal))} fill="none" stroke="#f43f5e" strokeWidth="1.5" />
                    <path d={buildPath(grafikPoints, xStep, (p) => scaleY(p.biaya_layanan, maxVal))} fill="none" stroke="#f59e0b" strokeWidth="1.5" strokeDasharray="4 3" />
                  </svg>
                )}
              </div>
              <div className="flex justify-between ml-6 mt-1 text-[10px] text-stone-400 font-medium">
                {[1, 5, 10, 15, 20, 25, daysInMonth].map((d) => <span key={d}>{d}</span>)}
              </div>
            </div>
          </div>

          {/* TABEL TRANSAKSI */}
          <div className="bg-white rounded-xl border border-stone-200 shadow-sm overflow-hidden">
            <div className="p-4 border-b border-stone-100 flex items-center justify-between">
              <h2 className="text-sm font-bold text-stone-900">
                Daftar Transaksi & Penarikan
                {!loading && (
                  <span className="ml-2 text-[10px] font-medium text-stone-400 bg-stone-100 px-1.5 py-0.5 rounded-md">
                    {transaksi.length} data
                  </span>
                )}
              </h2>
              <div className="flex items-center gap-2">
                {['Jenis', 'Tanggal'].map((label) => (
                  <button key={label} className="flex items-center gap-1 text-xs border border-stone-200 px-2.5 py-1 rounded-md text-stone-600 bg-white hover:bg-stone-50">
                    {label} <ChevronDown size={12} />
                  </button>
                ))}
              </div>
            </div>

            <div className="overflow-x-auto">
              {loading ? (
                <div className="py-16 text-center text-xs text-stone-400 animate-pulse">Memuat transaksi...</div>
              ) : transaksi.length === 0 ? (
                <div className="py-16 text-center text-xs text-stone-400">Tidak ada transaksi ditemukan.</div>
              ) : (
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-stone-50 border-b border-stone-200 text-stone-500 font-semibold text-[11px] uppercase tracking-wider">
                      <th className="p-3 w-8"><input type="checkbox" className="rounded focus:ring-0" /></th>
                      {['No. Transaksi', 'Jenis', 'Deskripsi', 'Nominal', 'Tanggal', 'Status', 'Aksi'].map((h) => (
                        <th key={h} className={`p-3 ${h === 'Nominal' ? 'text-right' : h === 'Aksi' || h === 'Tanggal' || h === 'Status' ? 'text-center' : ''}`}>
                          {h}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-stone-100 text-xs font-medium text-stone-700">
                    {transaksi.map((tx) => {
                      const statusCls: Record<StatusTransaksi, string> = {
                        Selesai:  'bg-emerald-50 text-emerald-700 border border-emerald-200',
                        Diproses: 'bg-amber-50 text-amber-700 border border-amber-200',
                        Ditolak:  'bg-rose-50 text-rose-700 border border-rose-200',
                      };
                      return (
                        <tr key={tx.id} className="hover:bg-stone-50/50 transition-colors">
                          <td className="p-3"><input type="checkbox" className="rounded focus:ring-0" /></td>
                          <td className="p-3 font-mono font-semibold text-stone-900">{tx.id}</td>
                          <td className="p-3 text-stone-600 max-w-[130px] truncate" title={tx.jenis_transaksi}>{tx.jenis_transaksi}</td>
                          <td className="p-3 text-stone-500 max-w-[180px] truncate" title={tx.deskripsi}>{tx.deskripsi}</td>
                          <td className={`p-3 text-right font-bold ${tx.tipe_mutasi === 'masuk' ? 'text-emerald-700' : 'text-rose-700'}`}>
                            {tx.tipe_mutasi === 'masuk' ? '+' : '−'} {formatRupiah(tx.nominal)}
                          </td>
                          <td className="p-3 text-center font-mono text-stone-500">{tx.tanggal}</td>
                          <td className="p-3 text-center">
                            <span className={`inline-block px-2 py-0.5 rounded-md text-[10px] font-bold ${statusCls[tx.status]}`}>
                              {tx.status}
                            </span>
                          </td>
                          <td className="p-3">
                            <div className="flex items-center justify-center gap-1.5">
                              <button className="flex items-center gap-1 px-2 py-1 text-[11px] border border-stone-200 rounded text-stone-700 hover:bg-stone-50 bg-white">
                                <Eye size={11} /> Detail
                              </button>
                              <button
                                onClick={() => setResiTarget(tx)}
                                className="flex items-center gap-1 px-2 py-1 text-[11px] border border-stone-200 rounded text-stone-600 hover:bg-stone-50 bg-white"
                              >
                                <Printer size={11} /> Cetak
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        </div>

        {/* ── KOLOM KANAN ───────────────────────────────────────────────── */}
        <div className="flex flex-col gap-6">
          <div className="bg-white p-4 rounded-xl border border-stone-200 shadow-sm flex flex-col gap-5">
            <div>
              <h2 className="text-xs font-bold uppercase tracking-wider text-stone-400 mb-1">Wawasan Keuangan Utama</h2>
              <div className="h-px bg-stone-100 w-full" />
            </div>

            {/* Ringkasan Biaya & Saldo */}
            <div>
              <h3 className="text-xs font-bold text-stone-800 mb-3">Ringkasan Biaya & Saldo</h3>
              <div className="grid grid-cols-3 gap-2 text-center">
                {([
                  { icon: <DollarSign size={16} className="text-stone-600" />,  label: 'Total Biaya Layanan', value: formatRupiah(ringkasan?.biaya_layanan ?? 0), cls: 'text-stone-900' },
                  { icon: <AlertTriangle size={16} className="text-rose-500" />, label: 'Komplain Aktif',       value: String(ringkasan?.komplain_aktif ?? 0),     cls: 'text-rose-600 font-extrabold text-[11px]' },
                  { icon: <HeartPulse size={16} className="text-emerald-600" />, label: 'Skor Kesehatan',       value: `${ringkasan?.skor_kesehatan ?? 0} / 5.0`,   cls: 'text-stone-900' },
                ]).map(({ icon, label, value, cls }) => (
                  <div key={label} className="p-2 border border-stone-200 rounded-lg bg-stone-50 flex flex-col items-center justify-center">
                    <div className="mb-1">{icon}</div>
                    <p className="text-[9px] text-stone-500 font-medium leading-tight">{label}</p>
                    <p className={`text-[10px] font-bold mt-1 ${cls}`}>{loading ? '–' : value}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Analisis Pemasukan */}
            <div className="pt-2 border-t border-stone-100">
              <h3 className="text-xs font-bold text-stone-800 mb-3">Pemasukan by Kategori</h3>
              <div className="flex items-center justify-between gap-3">
                <div className="flex flex-col gap-2 flex-1 text-[11px]">
                  {loading ? (
                    <p className="text-stone-400 text-[10px] animate-pulse">Memuat...</p>
                  ) : (
                    analisis.slice(0, 3).map((a) => (
                      <div key={a.kategori} className="p-2 bg-stone-50 rounded-lg border border-stone-100">
                        <p className="font-bold text-stone-900 truncate">{a.kategori}</p>
                        <p className="text-stone-500 font-semibold">{formatRupiah(a.total)}</p>
                      </div>
                    ))
                  )}
                </div>
                <div className="flex flex-col items-center text-center shrink-0">
                  <div
                    className="w-14 h-14 rounded-full border border-stone-200 shadow-sm mb-1"
                    style={{ background: loading ? '#f5f5f4' : buildPieGradient(analisis) }}
                  />
                  <span className="text-[9px] font-bold text-stone-500 leading-tight">Pemasukan<br />by Kategori</span>
                </div>
              </div>
            </div>

            {/* Rekomendasi */}
            <div className="pt-2 border-t border-stone-100">
              <h3 className="text-xs font-bold text-stone-800 mb-2">Rekomendasi Strategi</h3>
              <div className="grid grid-cols-3 gap-2 text-center text-[10px] font-bold text-stone-700">
                {([
                  [<TrendingUp size={14} />, 'Optimalkan Margin'],
                  [<Clock      size={14} />, 'Jadwal Penarikan'],
                  [<BarChart3  size={14} />, 'Analisis Biaya'],
                ] as [React.ReactNode, string][]).map(([icon, label]) => (
                  <div key={label} className="p-2 border border-stone-200 rounded-lg bg-stone-50 flex flex-col items-center gap-1.5 hover:bg-stone-100/70 transition-colors cursor-pointer">
                    <span className="text-stone-600">{icon}</span>
                    <span className="leading-tight">{label}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Modal Cetak Resi */}
      {resiTarget && (
        <CetakResi transaksi={resiTarget} onClose={() => setResiTarget(null)} />
      )}
    </div>
  );
}