import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

export default function ForgotPassword() {
  const navigate = useNavigate()

  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [sent, setSent] = useState(false)

  const handleSubmit = () => {
    if (!email) return
    setLoading(true)
    setTimeout(() => {
      setLoading(false)
      setSent(true)
    }, 2000)
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
            onClick={() => navigate('/login')}
            className="text-stone-500 px-2 sm:px-3 py-1 sm:py-1.5 rounded-lg hover:bg-stone-100 transition-colors"
          >
            Login
          </button>
          <span className="text-stone-300">/</span>
          <button
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

              {!sent ? (
                <>
                  {/* Header */}
                  <div className="text-center mb-6 sm:mb-8">
                    <div className="inline-flex items-center justify-center w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-[#FDF0EC] mb-3 sm:mb-4">
                      <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
                        <rect x="3" y="11" width="18" height="11" rx="2" ry="2" stroke="#C84B31" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        <path d="M7 11V7a5 5 0 0110 0v4" stroke="#C84B31" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        <circle cx="12" cy="16" r="1" fill="#C84B31"/>
                      </svg>
                    </div>
                    <h1 className="text-xl sm:text-2xl font-bold text-[#1A1A1A] tracking-tight">Reset Password</h1>
                    <p className="text-stone-400 text-xs sm:text-sm mt-1.5 leading-relaxed">
                      Silakan masukkan email Anda untuk menerima instruksi reset password.
                      <br className="hidden sm:block" />
                      {' '}Kami akan mengirimkan tautan untuk membuat password baru.
                    </p>
                  </div>

                  {/* Form */}
                  <div className="space-y-4 sm:space-y-5">

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
                          onKeyDown={e => e.key === 'Enter' && handleSubmit()}
                          placeholder="email@domain.com"
                          inputMode="email"
                          autoComplete="email"
                          className="w-full pl-10 pr-4 py-3 rounded-xl border border-stone-200 bg-stone-50 text-sm text-[#1A1A1A] placeholder-stone-300 focus:outline-none focus:ring-2 focus:ring-[#C84B31]/20 focus:border-[#C84B31] transition-all"
                        />
                      </div>
                    </div>

                    {/* Submit */}
                    <button
                      onClick={handleSubmit}
                      disabled={loading || !email}
                      className="w-full rounded-xl bg-[#C84B31] hover:bg-[#B03D26] active:scale-[0.98] text-white font-bold text-sm tracking-widest uppercase transition-all shadow-lg shadow-[#C84B31]/30 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 min-h-[48px] px-4"
                    >
                      {loading ? (
                        <>
                          <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="white" strokeWidth="4"/>
                            <path className="opacity-75" fill="white" d="M4 12a8 8 0 018-8v8z"/>
                          </svg>
                          Mengirim...
                        </>
                      ) : (
                        'Kirim Instruksi'
                      )}
                    </button>
                  </div>

                  {/* Footer */}
                  <p className="text-center text-xs sm:text-sm text-stone-400 mt-6 sm:mt-8">
                    Sudah ingat password?{' '}
                    <button
                      onClick={() => navigate('/login')}
                      className="text-[#C84B31] font-semibold hover:underline underline-offset-2"
                    >
                      Halaman Login
                    </button>
                  </p>
                </>
              ) : (
                /* ── Success State ── */
                <div className="text-center py-4">
                  <div className="inline-flex items-center justify-center w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-green-50 mb-4">
                    <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
                      <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" stroke="#22C55E" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      <polyline points="22,6 12,13 2,6" stroke="#22C55E" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </div>
                  <h2 className="text-lg sm:text-xl font-bold text-[#1A1A1A] mb-2">Email Terkirim!</h2>
                  <p className="text-stone-400 text-xs sm:text-sm leading-relaxed mb-6 sm:mb-8">
                    Instruksi reset password telah dikirim ke{' '}
                    <span className="font-semibold text-[#1A1A1A]">{email}</span>.
                    <br />Cek inbox atau folder spam kamu.
                  </p>

                  {/* Resend */}
                  <p className="text-xs text-stone-400 mb-4">
                    Tidak menerima email?{' '}
                    <button
                      onClick={() => { setSent(false) }}
                      className="text-[#C84B31] font-semibold hover:underline underline-offset-2"
                    >
                      Kirim ulang
                    </button>
                  </p>

                  <button
                    onClick={() => navigate('/login')}
                    className="w-full rounded-xl bg-[#C84B31] hover:bg-[#B03D26] active:scale-[0.98] text-white font-bold text-sm tracking-widest uppercase transition-all shadow-lg shadow-[#C84B31]/30 flex items-center justify-center gap-2 min-h-[48px] px-4"
                  >
                    Kembali ke Login
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Legal */}
          <p className="text-center text-xs text-stone-400 mt-5 sm:mt-6 px-2 leading-relaxed">
            Butuh bantuan?{' '}
            <span className="underline cursor-pointer">Hubungi Support</span> kami.
          </p>
        </div>
      </main>
    </div>
  )
}