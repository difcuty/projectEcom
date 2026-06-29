import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { authService } from '../services/authService' // ◄ BARU: Hubungkan dengan authService kamu

export default function Login() {
  const navigate = useNavigate()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [remember, setRemember] = useState(true)
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)

  // ◄ BARU: Handler Submit Terintegrasi Backend
  const handleSubmit = async (e: React.FormEvent) => {
    // Mencegah reload halaman default jika dipanggil dari form submit
    if (e && e.preventDefault) e.preventDefault()

    if (!email || !password) {
      alert('Email dan password wajib diisi!')
      return
    }

    setLoading(true)

    // Menembak method login pada authService
    const result = await authService.login({ email, password })

    setLoading(false)

    if (result.success && result.data) {
      alert(result.message)

      // Simpan token JWT dan data user ke localStorage lokal browser
      localStorage.setItem('token', result.data.token)
      localStorage.setItem('user', JSON.stringify(result.data.user))

      // Redirect ke halaman dashboard utama atau root setelah berhasil masuk
      navigate('/') 
    } else {
      // Menampilkan pesan kegagalan dari response backend (misal: "Email atau password salah")
      alert(result.message)
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
            className="text-[#C84B31] font-semibold px-2 sm:px-3 py-1 sm:py-1.5 rounded-lg hover:bg-red-50 transition-colors"
          >
            Login
          </button>
          <span className="text-stone-300">/</span>
          <button
            type="button"
            onClick={() => navigate('/daftar')}
            className="text-stone-500 px-2 sm:px-3 py-1 sm:py-1.5 rounded-lg hover:bg-stone-100 transition-colors"
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
                    <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" stroke="#C84B31" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <circle cx="12" cy="7" r="4" stroke="#C84B31" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
                <h1 className="text-xl sm:text-2xl font-bold text-[#1A1A1A] tracking-tight">Masuk ke Akun</h1>
                <p className="text-stone-400 text-xs sm:text-sm mt-1.5 leading-relaxed">
                  Silakan login untuk mulai berjualan atau membeli jasa/produk
                </p>
              </div>

              {/* Form Container */}
              <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-5">

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
                      required
                      value={email}
                      onChange={e => setEmail(e.target.value)}
                      placeholder="email@domain.com"
                      inputMode="email"
                      autoComplete="email"
                      className="w-full pl-10 pr-4 py-3 rounded-xl border border-stone-200 bg-stone-50 text-sm text-[#1A1A1A] placeholder-stone-300 focus:outline-none focus:ring-2 focus:ring-[#C84B31]/20 focus:border-[#C84B31] transition-all"
                    />
                  </div>
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
                      required
                      value={password}
                      onChange={e => setPassword(e.target.value)}
                      placeholder="••••••••"
                      autoComplete="current-password"
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
                </div>

                {/* Remember & Forgot */}
                <div className="flex items-center justify-between">
                  <label className="flex items-center gap-2 cursor-pointer group">
                    <button
                      type="button"
                      onClick={() => setRemember(!remember)}
                      className={`w-5 h-5 rounded-md border-2 flex items-center justify-center transition-all cursor-pointer shrink-0 ${
                        remember ? 'bg-[#C84B31] border-[#C84B31]' : 'border-stone-300 bg-white'
                      }`}
                    >
                      {remember && (
                        <svg width="10" height="10" viewBox="0 0 12 12" fill="none">
                          <polyline points="2,6 5,9 10,3" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                      )}
                    </button>
                    <span className="text-xs sm:text-sm text-stone-500 group-hover:text-stone-700 transition-colors select-none">
                      Ingat Saya
                    </span>
                  </label>
                  <button 
                    type="button" 
                    onClick={() => navigate('/ForgotPassword')}  
                    className="text-xs sm:text-sm text-[#C84B31] font-medium hover:underline underline-offset-2 transition-all"
                  >
                    Lupa Password?
                  </button>
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full rounded-xl bg-[#C84B31] hover:bg-[#B03D26] active:scale-[0.98] text-white font-bold text-sm tracking-widest uppercase transition-all shadow-lg shadow-[#C84B31]/30 disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2 min-h-[48px] px-4"
                >
                  {loading ? (
                    <>
                      <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="white" strokeWidth="4"/>
                        <path className="opacity-75" fill="white" d="M4 12a8 8 0 018-8v8z"/>
                      </svg>
                      Memproses...
                    </>
                  ) : (
                    'Masuk'
                  )}
                </button>

                {/* Divider */}
                <div className="flex items-center gap-3">
                  <div className="flex-1 h-px bg-stone-100" />
                  <span className="text-xs text-stone-300 font-medium">atau</span>
                  <div className="flex-1 h-px bg-stone-100" />
                </div>

                {/* Google Button */}
                <button 
                  type="button" 
                  className="w-full rounded-xl border border-stone-200 bg-white hover:bg-stone-50 active:scale-[0.98] text-stone-600 text-sm font-medium flex items-center justify-center gap-2.5 transition-all min-h-[48px] px-4"
                >
                  <svg width="16" height="16" viewBox="0 0 24 24">
                    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                  </svg>
                  Masuk dengan Google
                </button>
              </form>

              {/* Toggle ke Register */}
              <p className="text-center text-xs sm:text-sm text-stone-400 mt-6 sm:mt-8">
                Belum punya akun?{' '}
                <button
                  type="button"
                  onClick={() => navigate('/daftar')}
                  className="text-[#C84B31] font-semibold hover:underline underline-offset-2"
                >
                  Daftar Sekarang
                </button>
              </p>
            </div>
          </div>

          {/* Legal */}
          <p className="text-center text-xs text-stone-400 mt-5 sm:mt-6 px-2 leading-relaxed">
            Dengan masuk, kamu menyetujui{' '}
            <span className="underline cursor-pointer">Syarat & Ketentuan</span> dan{' '}
            <span className="underline cursor-pointer">Kebijakan Privasi</span> kami.
          </p>
        </div>
      </main>
    </div>
  )
}