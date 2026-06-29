import { Outlet, useLocation } from 'react-router-dom'
import { Bell, Settings } from 'lucide-react'
import NavSidebarPenjual from './Sidebar'

/**
 * SellerLayout
 * Layout khusus untuk halaman seller yang menggunakan NavSidebarPenjual.
 * Pasang di App.tsx sebagai wrapper Route untuk rute penjual.
 *
 * Contoh penggunaan di App.tsx:
 *
 *   import SellerLayout from './Dashboard/SellerLayout'
 *   import DashboardPenjual from './Dashboard/DashboardPenjual'
 *
 *   <Route element={<SellerLayout />}>
 *     <Route path="/dashboard-penjual" element={<DashboardPenjual />} />
 *     <Route path="/produk"            element={<ProductManagement />} />
 *     <Route path="/pesanan"           element={<OrderManagement />} />
 *     <Route path="/keuangan"          element={<Finance />} />
 *     <Route path="/marketing"         element={<MarketingTools />} />
 *     <Route path="/insights"          element={<Insights />} />
 *   </Route>
 */
export default function SellerLayout() {
  const location = useLocation()

  return (
    <div
      className="flex flex-col min-h-screen bg-[#f5f5f0]"
      style={{ fontFamily: "'DM Sans', 'Segoe UI', sans-serif" }}
    >
      {/* ── TOP HEADER (57px, sticky) ── */}
      <header
        className="
          h-[57px] bg-white border-b border-stone-200
          flex items-center justify-between
          px-6 sticky top-0 z-50
          shadow-[0_1px_3px_rgba(0,0,0,0.05)]
        "
      >
        {/* Brand */}
        <span
          className="font-black text-[17px] tracking-[0.06em] text-stone-900 uppercase"
          style={{ letterSpacing: '0.08em' }}
        >
          ASAS OFFICIAL STORE
        </span>

        {/* Right actions */}
        <div className="flex items-center gap-2">
          {/* Notification bell with badge */}
          <button
            className="
              relative p-2.5 rounded-xl
              bg-stone-50 border border-stone-200
              hover:bg-stone-100 hover:border-stone-300
              transition-all
            "
          >
            <Bell size={17} className="text-stone-600" />
            <span
              className="
                absolute top-1.5 right-1.5
                w-[18px] h-[18px]
                bg-rose-500 rounded-full
                flex items-center justify-center
                text-[9px] font-bold text-white
                border-2 border-white
              "
            >
              3
            </span>
          </button>

          {/* Settings */}
          <button
            className="
              flex items-center gap-2 px-3 py-2 rounded-xl
              bg-stone-50 border border-stone-200
              hover:bg-stone-100 hover:border-stone-300
              transition-all
            "
          >
            <Settings size={15} className="text-stone-500" />
            <span className="text-sm font-semibold text-stone-600">Pengaturan</span>
          </button>
        </div>
      </header>

      {/* ── BODY ── */}
      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <NavSidebarPenjual activePath={location.pathname} />

        {/* Page content */}
        <main className="flex-1 overflow-x-hidden overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  )
}