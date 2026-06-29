import { BrowserRouter, Routes, Route, Outlet, useLocation } from 'react-router-dom'
import { useState, useEffect } from 'react'
import Login from './login/login'
import Register from './login/register'
import ForgotPassword from './login/ForgotPassword'
import Dashboard from './Dashboard/dashboard'
import Profil from './Dashboard/profil'
import Keranjang from './Dashboard/keranjang'
import NavSidebar from './Dashboard/NavSidebar'
import DashboardPenjual from './DashboardPenjual/Dashboard'
import ProductManagement from './DashboardPenjual/ProductManagement' // sesuaikan path filenya
import SellerLayout from './DashboardPenjual/SellerLayout' // ← Layout penjual baru
import FinanceManagement from './DashboardPenjual/FinanceManagement' // sesuaikan path file
import MarketingTools from './DashboardPenjual/MarketingTools'
import Insights from './DashboardPenjual/Insights'
import OrderManagement from './DashboardPenjual/OrderManagement'
import Pesanan from './Dashboard/pesanan'

// ─── Layout untuk halaman pembeli/umum (sidebar lama) ────────────────────────
function DashboardLayout() {
  const location = useLocation()
  const [activeNav, setActiveNav] = useState('Beranda')

  useEffect(() => {
    switch (location.pathname) {
      case '/':
      case '/dashboard':
        setActiveNav('Beranda')
        break
      case '/profil':
        setActiveNav('Profil Saya')
        break
      case '/pesanan':
        setActiveNav('Pesanan Saya')
        break
      case '/keranjang':
        setActiveNav('Keranjang Belanja')
        break
      case '/notifikasi':
        setActiveNav('Notifikasi')
        break
      default:
        setActiveNav('')
    }
  }, [location.pathname])

  return (
    <div className="flex flex-col min-h-screen bg-stone-50">
      <header className="h-[57px] bg-white border-b border-stone-200 flex items-center justify-between px-6 sticky top-0 z-50">
        <span className="font-bold text-lg tracking-wider text-stone-800">ASAS OFFICIAL STORE</span>
      </header>
      <div className="flex flex-1">
        <NavSidebar activeNav={activeNav} onNavChange={(label) => setActiveNav(label)} />
        <main className="flex-1 overflow-x-hidden">
          <Outlet />
        </main>
      </div>
    </div>
  )
}

// ─── App ──────────────────────────────────────────────────────────────────────
function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* ── AUTH (tanpa sidebar) ── */}
        <Route path="/login"          element={<Login />} />
        <Route path="/daftar"         element={<Register />} />
        <Route path="/ForgotPassword" element={<ForgotPassword />} />

        {/* ── SELLER DASHBOARD (sidebar penjual baru) ── */}
        <Route element={<SellerLayout />}>
          <Route path="/dashboard-penjual" element={<DashboardPenjual />} />
          <Route path="/produk" element={<ProductManagement />} />
          <Route path="/pesanan-masuk" element={<OrderManagement />} />
          <Route path="/keuangan"  element={<FinanceManagement />} />
         <Route path="/marketing" element={<MarketingTools />} />
          <Route path="/insights"  element={<Insights/>} />
        </Route>

        {/* ── BUYER DASHBOARD (sidebar lama) ── */}
        <Route element={<DashboardLayout />}>
          <Route path="/"           element={<Dashboard />} />
          <Route path="/dashboard"  element={<Dashboard />} />
          <Route path="/profil"     element={<Profil />} />
          <Route path="/pesanan"    element={<Pesanan/>} />
         <Route path="/keranjang"  element={<Keranjang />} />
          <Route path="/notifikasi" element={<div className="p-6">Halaman Notifikasi</div>} />
        </Route>

        {/* ── FALLBACK ── */}
        <Route path="*" element={<Login />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App