import { useRef } from 'react';
import { X, Printer } from 'lucide-react';
import type { Transaksi } from '../services/keuanganService';

// ─── Helper ───────────────────────────────────────────────────────────────────

const formatRupiah = (val: number): string =>
  new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    maximumFractionDigits: 0,
  }).format(val ?? 0);

// ─── Props ────────────────────────────────────────────────────────────────────

interface CetakResiProps {
  transaksi: Transaksi;
  onClose: () => void;
}

// ─── Print stylesheet (injected into popup window) ────────────────────────────

const PRINT_STYLES = `
  * { box-sizing: border-box; margin: 0; padding: 0; }
  body {
    font-family: 'Segoe UI', sans-serif;
    background: #fff;
    color: #1c1917;
    padding: 32px 24px;
  }
  .resi-header { text-align: center; margin-bottom: 20px; }
  .resi-header h1 { font-size: 16px; font-weight: 800; letter-spacing: -0.3px; }
  .resi-header p  { font-size: 11px; color: #78716c; margin-top: 2px; }
  .divider { border: none; border-top: 1px dashed #d6d3d1; margin: 14px 0; }
  .nominal { font-size: 22px; font-weight: 800; text-align: center; margin: 16px 0 4px; }
  .tipe    { font-size: 10px; text-align: center; color: #78716c; margin-bottom: 16px; }
  .tipe .masuk  { color: #059669; font-weight: 700; }
  .tipe .keluar { color: #e11d48; font-weight: 700; }
  .row { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 8px; }
  .row .label { font-size: 10px; color: #78716c; }
  .row .value { font-size: 11px; font-weight: 600; text-align: right; max-width: 55%; }
  .badge { display: inline-block; padding: 2px 8px; border-radius: 4px; font-size: 10px; font-weight: 700; }
  .badge-selesai { background: #ecfdf5; color: #065f46; border: 1px solid #a7f3d0; }
  .badge-diproses { background: #fffbeb; color: #92400e; border: 1px solid #fde68a; }
  .badge-ditolak  { background: #fff1f2; color: #9f1239; border: 1px solid #fecdd3; }
  .footer { text-align: center; margin-top: 24px; font-size: 9px; color: #a8a29e; line-height: 1.6; }
  .watermark { font-size: 10px; font-weight: 700; color: #d6d3d1; text-align: center; margin-top: 12px; letter-spacing: 4px; text-transform: uppercase; }
`;

// ─── Component ────────────────────────────────────────────────────────────────

export default function CetakResi({ transaksi: tx, onClose }: CetakResiProps) {
  const resiRef = useRef<HTMLDivElement>(null);

  const handlePrint = () => {
    if (!resiRef.current) return;
    const win = window.open('', '_blank', 'width=420,height=620');
    if (!win) return;
    win.document.write(`
      <!DOCTYPE html>
      <html lang="id">
      <head>
        <meta charset="UTF-8"/>
        <title>Bukti Transaksi ${tx.id}</title>
        <style>${PRINT_STYLES}</style>
      </head>
      <body>${resiRef.current.innerHTML}</body>
      </html>
    `);
    win.document.close();
    win.focus();
    win.print();
    win.close();
  };

  const badgeClass =
    tx.status === 'Selesai'  ? 'badge-selesai'  :
    tx.status === 'Diproses' ? 'badge-diproses' : 'badge-ditolak';

  const isMasuk    = tx.tipe_mutasi === 'masuk';
  const tipeLabel  = isMasuk ? '↑ Uang Masuk' : '↓ Uang Keluar';
  const tipeClass  = isMasuk ? 'masuk' : 'keluar';

  const statusBadge =
    tx.status === 'Selesai'
      ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
      : tx.status === 'Diproses'
      ? 'bg-amber-50 text-amber-700 border border-amber-200'
      : 'bg-rose-50 text-rose-700 border border-rose-200';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl w-[380px] max-h-[90vh] overflow-y-auto">

        {/* Modal header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-stone-100">
          <h2 className="text-sm font-bold text-stone-900">Bukti Transaksi</h2>
          <button onClick={onClose} className="text-stone-400 hover:text-stone-700 transition-colors">
            <X size={16} />
          </button>
        </div>

        {/* Resi body — also injected into print window */}
        <div ref={resiRef} className="p-6">
          <div className="resi-header text-center mb-5">
            <h1 className="text-base font-extrabold tracking-tight text-stone-900">TokoAsus</h1>
            <p className="text-[10px] text-stone-400 mt-0.5">Bukti Transaksi Resmi</p>
          </div>

          <div className="nominal text-2xl font-extrabold text-stone-900 text-center my-4">
            {formatRupiah(tx.nominal)}
          </div>
          <div className="tipe text-[10px] text-center text-stone-400 mb-4">
            Tipe: <span className={`font-bold ${isMasuk ? 'text-emerald-600' : 'text-rose-600'}`}>{tipeLabel}</span>
          </div>

          <hr className="border-dashed border-stone-200 my-4" />

          <div className="flex flex-col gap-2.5 text-xs">
            {([
              ['No. Transaksi', <span className="font-mono font-bold text-stone-900">{tx.id}</span>],
              ['Jenis',         <span className="font-semibold text-stone-700 text-right max-w-[55%]">{tx.jenis_transaksi}</span>],
              ['Deskripsi',     <span className="font-semibold text-stone-700 text-right">{tx.deskripsi}</span>],
              ['Tanggal',       <span className="font-mono font-semibold text-stone-700">{tx.tanggal}</span>],
              ...(tx.pesanan_id
                ? [['ID Pesanan', <span className="font-mono font-semibold text-stone-700">{tx.pesanan_id}</span>] as const]
                : []),
              ['Status', (
                <span className={`inline-block px-2 py-0.5 rounded-md text-[10px] font-bold ${statusBadge}`}>
                  {tx.status}
                </span>
              )],
            ] as [string, React.ReactNode][]).map(([label, value]) => (
              <div key={label} className="flex justify-between items-start gap-3">
                <span className="text-stone-400 shrink-0">{label}</span>
                {value}
              </div>
            ))}
          </div>

          <hr className="border-dashed border-stone-200 my-4" />

          <div className="footer text-center text-[9px] text-stone-300 leading-relaxed">
            Dicetak pada {new Date().toLocaleString('id-ID')}<br />
            Dokumen ini merupakan bukti transaksi yang sah.<br />
            Simpan sebagai arsip keuangan Anda.
          </div>
          <div className="watermark text-[9px] font-bold text-stone-200 text-center tracking-[4px] uppercase mt-3">
            TokoAsus
          </div>
        </div>

        {/* Modal footer */}
        <div className="px-5 pb-5 flex gap-2">
          <button
            onClick={onClose}
            className="flex-1 text-xs font-semibold py-2 border border-stone-200 rounded-lg text-stone-600 hover:bg-stone-50 transition-colors"
          >
            Tutup
          </button>
          <button
            onClick={handlePrint}
            className="flex-1 flex items-center justify-center gap-1.5 text-xs font-semibold py-2 bg-stone-900 text-white rounded-lg hover:bg-stone-800 transition-colors"
          >
            <Printer size={13} />
            Cetak Resi
          </button>
        </div>
      </div>
    </div>
  );
}