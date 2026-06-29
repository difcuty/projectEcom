import { useState } from 'react'

interface ModalPembayaranProps {
  isOpen: boolean;
  onClose: () => void;
  onPaymentSuccess: (metodeBayar: string) => Promise<void>;
  totalTagihan: number;
  formatRupiah: (num: number) => string;
}

export default function ModalPembayaran({
  isOpen,
  onClose,
  onPaymentSuccess,
  totalTagihan,
  formatRupiah
}: ModalPembayaranProps) {
  const [bankTerpilih, setBankTerpilih] = useState('BCA')
  const [loadingProses, setLoadingProses] = useState(false)

  if (!isOpen) return null

  const handleBayarSekarang = async () => {
    setLoadingProses(true)
    try {
      // Menjalankan callback sukses transaksi ke backend via Keranjang.tsx
      await onPaymentSuccess(bankTerpilih)
    } catch (error) {
      console.error(error)
    } finally {
      setLoadingProses(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 animate-fade-in">
      <div className="bg-white rounded-2xl border border-stone-200 shadow-xl max-w-md w-full overflow-hidden p-6 font-sans text-[#1A1A1A]">
        
        {/* Header Modal */}
        <div className="flex items-center justify-between pb-3 border-b border-stone-100">
          <h2 className="text-base font-black tracking-tight uppercase text-stone-800">
            Pilih Metode & Selesaikan Pembayaran
          </h2>
          <button 
            onClick={onClose}
            className="text-stone-400 hover:text-stone-600 font-bold transition-colors text-sm"
          >
            ✕
          </button>
        </div>

        {/* Total Tagihan Box */}
        <div className="my-4 p-3 bg-stone-50 border border-stone-200 rounded-xl text-center">
          <p className="text-[10px] font-bold text-stone-400 uppercase tracking-wide">Total Nilai Pesanan</p>
          <p className="text-xl font-black text-[#C84B31]">{formatRupiah(totalTagihan)}</p>
        </div>

        {/* Pilihan Rekening Bank Transfer */}
        <div className="space-y-2.5">
          <label className="block text-[10px] font-bold text-stone-400 uppercase tracking-wide">
            Pilih Rekening Bank Tujuan (Toko ASUS)
          </label>
          
          {/* Opsi BCA */}
          <div 
            onClick={() => setBankTerpilih('BCA')}
            className={`p-3 rounded-xl border transition-all cursor-pointer flex items-center justify-between ${
              bankTerpilih === 'BCA' ? 'border-[#C84B31] bg-orange-50/20' : 'border-stone-200 bg-white hover:bg-stone-50'
            }`}
          >
            <div className="flex items-center gap-3">
              <span className="w-8 h-5 bg-blue-800 text-white font-black text-[9px] rounded flex items-center justify-center tracking-tighter">BCA</span>
              <div>
                <p className="text-xs font-bold">Bank Central Asia</p>
                <p className="text-[10px] font-mono text-stone-400">123-4567-890 a/n PT Asus Indonesia</p>
              </div>
            </div>
            <input type="radio" checked={bankTerpilih === 'BCA'} readOnly className="accent-[#C84B31]" />
          </div>

          {/* Opsi Mandiri */}
          <div 
            onClick={() => setBankTerpilih('MANDIRI')}
            className={`p-3 rounded-xl border transition-all cursor-pointer flex items-center justify-between ${
              bankTerpilih === 'MANDIRI' ? 'border-[#C84B31] bg-orange-50/20' : 'border-stone-200 bg-white hover:bg-stone-50'
            }`}
          >
            <div className="flex items-center gap-3">
              <span className="w-8 h-5 bg-blue-900 text-amber-400 font-black text-[9px] rounded flex items-center justify-center tracking-tighter">MANDIRI</span>
              <div>
                <p className="text-xs font-bold">Bank Mandiri</p>
                <p className="text-[10px] font-mono text-stone-400">900-12345-6789 a/n PT Asus Indonesia</p>
              </div>
            </div>
            <input type="radio" checked={bankTerpilih === 'MANDIRI'} readOnly className="accent-[#C84B31]" />
          </div>
        </div>

        {/* Informasi Aturan Finansial */}
        <p className="text-[10px] text-stone-400 mt-4 leading-tight">
          *Transaksi ini akan otomatis terdaftar pada sistem log keuangan <span className="font-mono">transaksi_keuangan</span> dengan status <span className="font-semibold text-emerald-600">Selesai</span> setelah Anda mengklik konfirmasi pembayaran.
        </p>

        {/* Tombol Aksi */}
        <div className="grid grid-cols-2 gap-3 mt-5">
          <button
            onClick={onClose}
            disabled={loadingProses}
            className="py-2 rounded-xl border border-stone-300 font-bold text-xs hover:bg-stone-50 transition-all text-stone-600"
          >
            Batal
          </button>
          <button
            onClick={handleBayarSekarang}
            disabled={loadingProses}
            className="py-2 rounded-xl bg-[#C84B31] hover:bg-[#B03D26] font-black text-xs text-white tracking-wide transition-all disabled:bg-stone-300 flex items-center justify-center"
          >
            {loadingProses ? 'Menghubungkan...' : 'Konfirmasi Sudah Bayar'}
          </button>
        </div>

      </div>
    </div>
  )
}