const BASE_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:3000/api';

// ─── Types ────────────────────────────────────────────────────────────────────

export type StatusTransaksi = 'Selesai' | 'Diproses' | 'Ditolak';
export type TipeMutasi = 'masuk' | 'keluar';
export type JenisTransaksi =
  | 'Order payment'
  | 'Withdrawal'
  | 'Biaya Komisi Pesanan'
  | 'Biaya Layanan & Komisi'
  | 'Pembayaran Pesanan';

export interface Transaksi {
  id: string;
  jenis_transaksi: JenisTransaksi;
  deskripsi: string;
  nominal: number;
  tipe_mutasi: TipeMutasi;
  status: StatusTransaksi;
  tanggal: string;
  tanggal_transaksi: string;
  pesanan_id: string | null;
  penarikan_id: string | null;
}

export interface RingkasanKeuangan {
  saldo_tersedia: number;
  pendapatan_bulan_ini: number;
  biaya_bulan_ini: number;
  biaya_layanan: number;
  komplain_aktif: number;
  skor_kesehatan: number;
}

export interface GrafikHarian {
  hari: number;
  masuk: number;
  keluar: number;
  biaya_layanan: number;
}

export interface AnalisisPemasukan {
  kategori: string;
  total: number;
}

export interface FilterTransaksi {
  search?: string;
  startDate?: string;
  endDate?: string;
  status?: StatusTransaksi | '';
}

// ─── Internal helper ──────────────────────────────────────────────────────────

async function handleResponse<T>(res: Response): Promise<T> {
  if (!res.ok) {
    const err = await res.json().catch(() => ({})) as { message?: string };
    throw new Error(err.message ?? `HTTP error ${res.status}`);
  }
  const json = await res.json() as { success: boolean; data: T };
  return json.data;
}

// ─── API calls ────────────────────────────────────────────────────────────────

export async function fetchTransaksi(filters: FilterTransaksi = {}): Promise<Transaksi[]> {
  const params = new URLSearchParams();
  if (filters.search)    params.set('search',    filters.search);
  if (filters.startDate) params.set('startDate', filters.startDate);
  if (filters.endDate)   params.set('endDate',   filters.endDate);
  if (filters.status)    params.set('status',    filters.status);

  const res = await fetch(`${BASE_URL}/keuangan/transaksi?${params.toString()}`);
  return handleResponse<Transaksi[]>(res);
}

export async function fetchRingkasan(): Promise<RingkasanKeuangan> {
  const res = await fetch(`${BASE_URL}/keuangan/ringkasan`);
  return handleResponse<RingkasanKeuangan>(res);
}

export async function fetchGrafik(): Promise<GrafikHarian[]> {
  const res = await fetch(`${BASE_URL}/keuangan/grafik`);
  return handleResponse<GrafikHarian[]>(res);
}

export async function fetchAnalisisPemasukan(): Promise<AnalisisPemasukan[]> {
  const res = await fetch(`${BASE_URL}/keuangan/analisis-pemasukan`);
  return handleResponse<AnalisisPemasukan[]>(res);
}

// ─── Client-side export ───────────────────────────────────────────────────────

export function exportLaporan(transaksi: Transaksi[]): void {
  const headers = ['No. Transaksi', 'Jenis', 'Deskripsi', 'Nominal', 'Tipe Mutasi', 'Status', 'Tanggal'];
  const rows = transaksi.map((tx) => [
    tx.id,
    tx.jenis_transaksi,
    tx.deskripsi,
    tx.nominal,
    tx.tipe_mutasi,
    tx.status,
    tx.tanggal,
  ]);

  const csvContent = [headers, ...rows]
    .map((row) => row.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(','))
    .join('\n');

  const blob = new Blob(['\uFEFF' + csvContent], { type: 'text/csv;charset=utf-8;' });
  const url  = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href     = url;
  link.download = `laporan-keuangan-${new Date().toISOString().slice(0, 10)}.csv`;
  link.click();
  URL.revokeObjectURL(url);
}