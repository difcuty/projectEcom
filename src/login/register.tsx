import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { authService } from '../services/authService' // ◄ BARU: Jalur relatif disesuaikan dengan struktur folder src kamu

export default function Register() {
  const navigate = useNavigate()

  // State untuk form input
  const [nama, setNama] = useState('')
  const [email, setEmail] = useState('')
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  
  // State untuk UI internal frontend
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [agreed, setAgreed] = useState(false)

  // Fungsi pengukur kekuatan password
  const getStrength = (p: string) => {
    if (!p) return 0
    let score = 0
    if (p.length >= 8) score++
    if (/[A-Z]/.test(p)) score++
    if (/[0-9]/.test(p)) score++
    if (/[^A-Za-z0-9]/.test(p)) score++
    return score
  }

  const strength = getStrength(password)
  const strengthLabel = ['', 'Lemah', 'Cukup', 'Kuat', 'Sangat Kuat'][strength]
  const strengthColor = ['', '#EF4444', '#F5A623', '#22C55E', '#16A34A'][strength]

  // Fungsi submit yang memanggil authService
  const handleSubmit = async () => {
    if (!agreed) return
    if (!nama || !email || !username || !password) {
      alert('Semua kolom formulir wajib diisi!')
      return
    }

    setLoading(true)

    // ◄ BARU: Memanfaatkan service dengan payload terstruktur
    const result = await authService.register({
      nama,
      username,
      email,
      password
    })

    setLoading(false)

    if (result.success) {
      alert(result.message)
      navigate('/login') // Redirect ke halaman login setelah berhasil
    } else {
      alert(result.message) // Menampilkan pesan kegagalan (dari server maupun jaringan)
    }
  }

  return (
    <div className="min-h-screen bg-[#F7F3EE] flex flex-col font-sans">

      {/* ── Navbar ── */}
      <nav className="w-full px-4 sm:px-8 py-3 sm:py-4 flex items-center justify-between bg-white border-b border-stone-200 shadow-sm sticky top-0 z-10">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-[#C84B31] flex items-center justify-center shrink-0">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
              <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <polyline points="9,22 9,12 15,12 15,22" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          <span className="text-[#1A1A1A] font-bold text-base sm:text-lg tracking-tight">TokoKamu</span>
        </div>

        <div className="flex items-center gap-0.5 sm:gap-1 text-xs sm:text-sm">
          <button
            type="button"
            onClick={() => navigate('/login')}
            className="text-stone-500 px-2 sm:px-3 py-1 sm:py-1.5 rounded-lg hover:bg-stone-100 transition-colors"
          >
            Login
          </button>
          <span className="text-stone-300">/</span>
          <button
            type="button"
            onClick={() => navigate('/daftar')}
            className="text-[#C84B31] font-semibold px-2 sm:px-3 py-1 sm:py-1.5 rounded-lg hover:bg-red-50 transition-colors"
          >
            Daftar
          </button>
        </div>
      </nav>

      {/* ── Main ── */}
      <main className="flex-1 flex items-center justify-center px-4 py-8 sm:py-12">
        <div className="w-full max-w-sm sm:max-w-md">

          {/* Decorative dots */}
          <div className="hidden sm:flex justify-center mb-6">
            <div className="flex gap-1">
              {[...Array(5)].map((_, i) => (
                <div
                  key={i}
                  className="h-1 rounded-full bg-[#C84B31] transition-all"
                  style={{ width: i === 2 ? '2rem' : '0.5rem', opacity: i === 2 ? 1 : 0.3 }}
                />
              ))}
            </div>
          </div>

          {/* ── Card ── */}
          <div className="bg-white rounded-2xl shadow-xl shadow-stone-200/60 border border-stone-100 overflow-hidden">
            <div className="h-1.5 w-full bg-gradient-to-r from-[#C84B31] via-[#E8724A] to-[#F5A623]" />

            <div className="px-5 sm:px-8 py-7 sm:py-10">

              {/* Header */}
              <div className="text-center mb-6 sm:mb-8">
                <div className="inline-flex items-center justify-center w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-[#FDF0EC] mb-3 sm:mb-4">
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
                    <path d="M16 21v-2a4 4 0 00-4-4H6a4 4 0 00-4 4v2" stroke="#C84B31" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <circle cx="9" cy="7" r="4" stroke="#C84B31" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <line x1="19" y1="8" x2="19" y2="14" stroke="#C84B31" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <line x1="22" y1="11" x2="16" y2="11" stroke="#C84B31" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
                <h1 className="text-xl sm:text-2xl font-bold text-[#1A1A1A] tracking-tight">Daftar Sekarang</h1>
                <p className="text-stone-400 text-xs sm:text-sm mt-1.5 leading-relaxed">
                  Silakan isi formulir di bawah ini untuk membuat akun baru.
                </p>
              </div>

              {/* Form */}
              <div className="space-y-4 sm:space-y-5">

                {/* Nama Lengkap */}
                <div>
                  <label className="block text-xs font-semibold text-stone-500 uppercase tracking-widest mb-1.5 sm:mb-2">
                    Nama Lengkap
                  </label>
                  <div className="relative">
                    <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-400">
                      <svg width="15" height="15" viewBox="0 0 24 24" fill="none">
                        <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        <circle cx="12" cy="7" r="4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </div>
                    <input
                      type="text"
                      value={nama}
                      onChange={e => setNama(e.target.value)}
                      placeholder="Nama Lengkap Anda"
                      className="w-full pl-10 pr-4 py-3 rounded-xl border border-stone-200 bg-stone-50 text-sm text-[#1A1A1A] placeholder-stone-300 focus:outline-none focus:ring-2 focus:ring-[#C84B31]/20 focus:border-[#C84B31] transition-all"
                    />
                  </div>
                </div>

                {/* Email */}
                <div>
                  <label className="block text-xs font-semibold text-stone-500 uppercase tracking-widest mb-1.5 sm:mb-2">
                    Email
                  </label>
                  <div className="relative">
                    <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-400">
                      <svg width="15" height="15" viewBox="0 0 24 24" fill="none">
                        <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        <polyline points="22,6 12,13 2,6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </div>
                    <input
                      type="email"
                      value={email}
                      onChange={e => setEmail(e.target.value)}
                      placeholder="email@domain.com"
                      inputMode="email"
                      autoComplete="email"
                      className="w-full pl-10 pr-4 py-3 rounded-xl border border-stone-200 bg-stone-50 text-sm text-[#1A1A1A] placeholder-stone-300 focus:outline-none focus:ring-2 focus:ring-[#C84B31]/20 focus:border-[#C84B31] transition-all"
                    />
                  </div>
                </div>

                {/* Username */}
                <div>
                  <label className="block text-xs font-semibold text-stone-500 uppercase tracking-widest mb-1.5 sm:mb-2">
                    Username
                  </label>
                  <div className="relative">
                    <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-400">
                      <svg width="15" height="15" viewBox="0 0 24 24" fill="none">
                        <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        <circle cx="12" cy="7" r="4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </div>
                    <input
                      type="text"
                      value={username}
                      onChange={e => setUsername(e.target.value.replace(/\s/g, ''))}
                      placeholder="username_pilihan"
                      autoComplete="username"
                      className="w-full pl-10 pr-4 py-3 rounded-xl border border-stone-200 bg-stone-50 text-sm text-[#1A1A1A] placeholder-stone-300 focus:outline-none focus:ring-2 focus:ring-[#C84B31]/20 focus:border-[#C84B31] transition-all"
                    />
                  </div>
                  <p className="text-xs text-stone-400 mt-1.5 ml-1">Gunakan huruf, angka, atau garis bawah. Tanpa spasi.</p>
                </div>

                {/* Password */}
                <div>
                  <label className="block text-xs font-semibold text-stone-500 uppercase tracking-widest mb-1.5 sm:mb-2">
                    Password
                  </label>
                  <div className="relative">
                    <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-400">
                      <svg width="15" height="15" viewBox="0 0 24 24" fill="none">
                        <rect x="3" y="11" width="18" height="11" rx="2" ry="2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        <path d="M7 11V7a5 5 0 0110 0v4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </div>
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={e => setPassword(e.target.value)}
                      placeholder="••••••••"
                      autoComplete="new-password"
                      className="w-full pl-10 pr-12 py-3 rounded-xl border border-stone-200 bg-stone-50 text-sm text-[#1A1A1A] placeholder-stone-300 focus:outline-none focus:ring-2 focus:ring-[#C84B31]/20 focus:border-[#C84B31] transition-all"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600 transition-colors p-1"
                    >
                      {showPassword ? (
                        <svg width="15" height="15" viewBox="0 0 24 24" fill="none">
                          <path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19m-6.72-1.07a3 3 0 11-4.24-4.24" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                          <line x1="1" y1="1" x2="23" y2="23" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                        </svg>
                      ) : (
                        <svg width="15" height="15" viewBox="0 0 24 24" fill="none">
                          <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                          <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                      )}
                    </button>
                  </div>

                  {/* Password strength bar */}
                  {password.length > 0 && (
                    <div className="mt-2.5 space-y-1.5">
                      <div className="flex gap-1">
                        {[1, 2, 3, 4].map(i => (
                          <div
                            key={i}
                            className="flex-1 h-1 rounded-full transition-all duration-300"
                            style={{ backgroundColor: i <= strength ? strengthColor : '#E7E5E4' }}
                          />
                        ))}
                      </div>
                      <p className="text-xs ml-0.5" style={{ color: strengthColor }}>
                        {strengthLabel}
                      </p>
                    </div>
                  )}
                </div>

                {/* Agree to terms */}
                <div className="flex items-start gap-2.5 cursor-pointer group">
                  <button
                    type="button"
                    onClick={() => setAgreed(!agreed)}
                    className={`mt-0.5 w-5 h-5 rounded-md border-2 flex items-center justify-center transition-all cursor-pointer shrink-0 ${
                      agreed ? 'bg-[#C84B31] border-[#C84B31]' : 'border-stone-300 bg-white'
                    }`}
                  >
                    {agreed && (
                      <svg width="10" height="10" viewBox="0 0 12 12" fill="none">
                        <polyline points="2,6 5,9 10,3" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    )}
                  </button>
                  <span className="text-xs sm:text-sm text-stone-500 leading-relaxed select-none">
                    Saya menyetujui{' '}
                    <span className="text-[#C84B31] underline underline-offset-2 cursor-pointer">Syarat & Ketentuan</span>
                    {' '}dan{' '}
                    <span className="text-[#C84B31] underline underline-offset-2 cursor-pointer">Kebijakan Privasi</span>
                    {' '}TokoKamu.
                  </span>
                </div>

                {/* Submit */}
                <button
                  type="button"
                  onClick={handleSubmit}
                  disabled={loading || !agreed}
                  className="w-full rounded-xl bg-[#C84B31] hover:bg-[#B03D26] active:scale-[0.98] text-white font-bold text-sm tracking-widest uppercase transition-all shadow-lg shadow-[#C84B31]/30 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 min-h-[48px] px-4"
                >
                  {loading ? (
                    <>
                      <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="white" strokeWidth="4"/>
                        <path className="opacity-75" fill="white" d="M4 12a8 8 0 018-8v8z"/>
                      </svg>
                      Mendaftar...
                    </>
                  ) : (
                    'Daftar'
                  )}
                </button>

                {/* Divider */}
                <div className="flex items-center gap-3">
                  <div className="flex-1 h-px bg-stone-100" />
                  <span className="text-xs text-stone-300 font-medium">atau</span>
                  <div className="flex-1 h-px bg-stone-100" />
                </div>

                {/* Google */}
                <button type="button" className="w-full rounded-xl border border-stone-200 bg-white hover:bg-stone-50 active:scale-[0.98] text-stone-600 text-sm font-medium flex items-center justify-center gap-2.5 transition-all min-h-[48px] px-4">
                  <svg width="16" height="16" viewBox="0 0 24 24">
                    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                  </svg>
                  Daftar dengan Google
                </button>
              </div>

              {/* Footer links */}
              <div className="mt-6 sm:mt-8 space-y-2 text-center">
                <p className="text-xs sm:text-sm text-stone-400">
                  Sudah punya akun?{' '}
                  <button
                    type="button"
                    onClick={() => navigate('/login')}
                    className="text-[#C84B31] font-semibold hover:underline underline-offset-2"
                  >
                    Halaman Login
                  </button>
                </p>
                <p className="text-xs sm:text-sm text-stone-400">
                  <button type="button" className="text-[#C84B31] hover:underline underline-offset-2">
                    Lupa Password?
                  </button>
                </p>
              </div>
            </div>
          </div>

          {/* Legal */}
          <p className="text-center text-xs text-stone-400 mt-5 sm:mt-6 px-2 leading-relaxed">
            Dengan mendaftar, kamu menyetujui{' '}
            <span className="underline cursor-pointer">Syarat & Ketentuan</span> dan{' '}
            <span className="underline cursor-pointer">Kebijakan Privasi</span> kami.
          </p>
        </div>
      </main>
    </div>
  )
}