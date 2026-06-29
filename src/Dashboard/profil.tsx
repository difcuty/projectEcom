import React, { useState, useEffect } from 'react'
import { profileService } from '../services/profileService' // Pastikan path service sudah benar

export default function Profil() {
  // State untuk form profile - disesuaikan propertinya dengan response database backend
  const [profile, setProfile] = useState({
    nama: '',
    no_telepon: '',
    email: '',
    alamat: '',
  })

  // State tambahan untuk handling loading dan error
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)

  // Ambil data profil riil dari backend saat komponen di-render pertama kali
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        const response = await profileService.getProfile()
        if (response.success && response.data) {
          // Mapping data dari backend ke state (fallback ke string kosong jika data null)
          setProfile({
            nama: response.data.nama || '',
            no_telepon: response.data.no_telepon || '',
            email: response.data.email || '',
            alamat: response.data.alamat || '',
          })
        }
      } catch (err: any) {
        console.error('Gagal mengambil data profil:', err)
        setError(err.response?.data?.message || 'Gagal memuat profil. Silakan login kembali.')
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setProfile(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const response = await profileService.updateProfile(profile)
      if (response.success) {
        alert('Perubahan berhasil disimpan!')
        console.log('Saved Profile:', profile)
      }
    } catch (err: any) {
      console.error('Gagal memperbarui profil:', err)
      alert(err.response?.data?.message || 'Terjadi kesalahan saat menyimpan perubahan.')
    }
  }

  // Tampilan Loading sementara data ditarik dari database
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[calc(100vh-57px)] bg-stone-50 w-full">
        <p className="text-stone-600 font-medium">Memuat data profil...</p>
      </div>
    )
  }

  // Tampilan Error jika token tidak valid / server mati
  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[calc(100vh-57px)] bg-stone-50 w-full p-6">
        <div className="bg-white border border-stone-200 rounded-xl p-6 shadow-sm text-center max-w-sm">
          <p className="text-red-500 font-semibold mb-2">Error</p>
          <p className="text-stone-600 text-sm mb-4">{error}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="px-4 py-2 bg-[#C84B31] text-white text-xs font-semibold rounded-lg"
          >
            Coba Lagi
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col md:flex-row gap-6 p-6 bg-stone-50 min-h-[calc(100vh-57px)] w-full">
      
      {/* SECTION KIRI: Ringkasan Pesanan / Kategori Menu */}
      <div className="w-full md:w-64 bg-white border border-stone-200 rounded-xl p-4 shadow-sm h-fit shrink-0">
        <h3 className="font-bold text-stone-800 border-b border-stone-100 pb-2 mb-4 text-sm tracking-wide uppercase">
          Ringkasan Pesanan
        </h3>
        
        <div className="space-y-4 text-xs sm:text-sm text-stone-600">
          {/* Electronics */}
          <div>
            <div className="flex items-center gap-2 font-semibold text-stone-800 mb-1">
              <span className="text-stone-400">📱</span> Electronics
            </div>
            <ul className="pl-6 list-disc space-y-1 text-stone-500">
              <li className="hover:text-[#C84B31] cursor-pointer">Hondphone & Gadget</li>
            </ul>
          </div>

          {/* ASAS */}
          <div>
            <div className="flex items-center gap-2 font-semibold text-stone-800 mb-1">
              <span className="text-stone-400">💻</span> ASAS
            </div>
            <ul className="pl-6 list-disc space-y-1 text-stone-500">
              <li className="hover:text-[#C84B31] cursor-pointer">Laptop & PC</li>
              <li className="hover:text-[#C84B31] cursor-pointer">Peripherals & Accessories</li>
            </ul>
          </div>

          {/* ASAS Store Exclusive */}
          <div>
            <div className="flex items-center gap-2 font-semibold text-stone-800 mb-1">
              <span className="text-stone-400">👕</span> ASAS Store Exclusive
            </div>
            <ul className="pl-6 list-disc space-y-1 text-stone-500">
              <li className="hover:text-[#C84B31] cursor-pointer">Exclusive T-Shirts</li>
              <li className="hover:text-[#C84B31] cursor-pointer">Exclusive Hats</li>
            </ul>
          </div>
        </div>
      </div>

      {/* SECTION KANAN: Detail Profil Saya */}
      <div className="flex-1 bg-white border border-stone-200 rounded-xl p-6 shadow-sm">
        <h2 className="text-xl font-bold text-stone-800 border-b border-stone-200 pb-3 mb-6">
          Detail Profil Saya
        </h2>

        <form onSubmit={handleSubmit} className="flex flex-col lg:flex-row gap-8">
          {/* Avatar / Foto Profil */}
          <div className="flex flex-col items-center gap-3 shrink-0">
            <div className="w-36 h-36 bg-stone-100 border border-stone-200 rounded-full flex items-center justify-center overflow-hidden relative group shadow-inner">
              <svg className="w-24 h-24 text-stone-400 mt-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M24 20.993V24H0v-2.996A14.977 14.977 0 0112.004 15c4.904 0 9.26 2.354 11.996 5.993zM16.002 8.999a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity cursor-pointer">
                <span className="text-white text-xs font-medium">Ubah Foto</span>
              </div>
            </div>
          </div>

          {/* Form Fields */}
          <div className="flex-1 space-y-5">
            {/* Nama Lengkap */}
            <div className="grid grid-cols-1 sm:grid-cols-3 items-start sm:items-center gap-1 sm:gap-4">
              <label className="text-sm font-semibold text-stone-600 sm:text-right">
                Nama Lengkap:
              </label>
              <input
                type="text"
                name="nama"
                value={profile.nama}
                onChange={handleChange}
                className="col-span-2 px-3 py-2 border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#C84B31]/20 focus:border-[#C84B31] text-sm text-stone-800 bg-stone-50/50"
                required
              />
            </div>

            {/* Nomor Telepon */}
            <div className="grid grid-cols-1 sm:grid-cols-3 items-start sm:items-center gap-1 sm:gap-4">
              <label className="text-sm font-semibold text-stone-600 sm:text-right">
                Nomor Telepon:
              </label>
              <input
                type="text"
                name="no_telepon"
                value={profile.no_telepon}
                onChange={handleChange}
                className="col-span-2 px-3 py-2 border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#C84B31]/20 focus:border-[#C84B31] text-sm text-stone-800 bg-stone-50/50"
              />
            </div>

            {/* Email */}
            <div className="grid grid-cols-1 sm:grid-cols-3 items-start sm:items-center gap-1 sm:gap-4">
              <label className="text-sm font-semibold text-stone-600 sm:text-right">
                Email:
              </label>
              <input
                type="email"
                name="email"
                value={profile.email}
                onChange={handleChange}
                className="col-span-2 px-3 py-2 border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#C84B31]/20 focus:border-[#C84B31] text-sm text-stone-800 bg-stone-50/50"
                required
              />
            </div>

            {/* Alamat Pengiriman Utama */}
            <div className="grid grid-cols-1 sm:grid-cols-3 items-start gap-1 sm:gap-4">
              <label className="text-sm font-semibold text-stone-600 sm:text-right sm:pt-2">
                Alamat Pengiriman Utama:
              </label>
              <textarea
                name="alamat"
                rows={3}
                value={profile.alamat}
                onChange={handleChange}
                className="col-span-2 px-3 py-2 border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#C84B31]/20 focus:border-[#C84B31] text-sm text-stone-800 bg-stone-50/50 resize-none"
              />
            </div>

            {/* Kata Sandi */}
            <div className="grid grid-cols-1 sm:grid-cols-3 items-start sm:items-center gap-1 sm:gap-4">
              <label className="text-sm font-semibold text-stone-600 sm:text-right">
                Kata Sandi:
              </label>
              <div className="col-span-2">
                <button
                  type="button"
                  className="px-4 py-1.5 border border-stone-300 text-stone-700 rounded-lg text-xs font-semibold bg-stone-50 hover:bg-stone-100 transition-colors shadow-sm"
                  onClick={() => alert('Fitur ubah kata sandi dibuka')}
                >
                  Ubah Kata Sandi
                </button>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 border-t border-stone-100">
              <div className="hidden sm:block"></div>
              <div className="col-span-2 flex gap-3">
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-[#C84B31] text-white font-semibold rounded-lg text-sm hover:bg-[#b03f27] transition-colors shadow-sm"
                >
                  Simpan Perubahan
                </button>
                <button
                  type="button"
                  className="px-5 py-2.5 border border-stone-300 text-stone-600 font-semibold rounded-lg text-sm hover:bg-stone-50 transition-colors"
                  onClick={() => window.history.back()}
                >
                  Batal
                </button>
              </div>
            </div>

          </div>
        </form>
      </div>

    </div>
  )
}