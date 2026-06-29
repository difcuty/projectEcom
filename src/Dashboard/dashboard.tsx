import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import FilterSidebar from './FilterSidebar'
import ProductDetailPage from './ProducDetailPage'
import { productService } from '../services/productService'

// ─────────────────────────────────────────────────────────
// TYPES
// ─────────────────────────────────────────────────────────
interface Product {
  id: number
  nama: string
  harga_dasar: number
  brand?: string
  kategori?: string
  stok_total?: number
  status?: string
  icon?: string
  rating?: number
  reviews?: number
}

// ─────────────────────────────────────────────────────────
// STAR RATING
// ─────────────────────────────────────────────────────────
function StarRating({
  rating,
  max = 5
}: {
  rating: number
  max?: number
}) {
  return (
    <div className="flex gap-0.5">
      {[...Array(max)].map((_, i) => (
        <svg
          key={i}
          width="13"
          height="13"
          viewBox="0 0 24 24"
          fill={i < rating ? '#F5A623' : 'none'}
          stroke={i < rating ? '#F5A623' : '#D1D5DB'}
          strokeWidth="2"
        >
          <polygon points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26" />
        </svg>
      ))}
    </div>
  )
}

// ─────────────────────────────────────────────────────────
// DASHBOARD
// ─────────────────────────────────────────────────────────
export default function Dashboard() {

  const navigate = useNavigate()

  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const [search, setSearch] = useState('')
  const [cartCount] = useState(3)

  const [selectedProduct, setSelectedProduct] =
    useState<Product | null>(null)

  // ───────────────────────────────────────────────────────
  // FETCH PRODUCTS
  // ───────────────────────────────────────────────────────
  const fetchProducts = async () => {

    try {

      setLoading(true)

      const data = await productService.getProducts()

      const formatted = data.map((item: any) => ({

        id: item.id,

        nama: item.nama,

        harga_dasar: item.harga_dasar,

        brand: item.brand,

        kategori: item.kategori,

        stok_total: item.stok_total,

        status: item.status,

        icon: item.icon,

        rating: item.rating || 4,

        reviews: item.reviews || 0
      }))

      setProducts(formatted)

    } catch (err: any) {

      console.error(err)

      setError('Gagal mengambil produk')

    } finally {

      setLoading(false)
    }
  }

  useEffect(() => {

    fetchProducts()

  }, [])

  // ───────────────────────────────────────────────────────
  // FORMAT RUPIAH
  // ───────────────────────────────────────────────────────
  const formatRupiah = (value: number) => {

    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      maximumFractionDigits: 0
    }).format(value || 0)
  }

  // ───────────────────────────────────────────────────────
  // FILTER
  // ───────────────────────────────────────────────────────
  const filteredProducts = products.filter((p) => {

    const keyword = search.toLowerCase()

    return (
      p.nama?.toLowerCase().includes(keyword) ||
      p.brand?.toLowerCase().includes(keyword) ||
      p.kategori?.toLowerCase().includes(keyword)
    )
  })

  // ───────────────────────────────────────────────────────
  // LOADING
  // ───────────────────────────────────────────────────────
  if (loading) {

    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F2F3F7]">
        <p className="text-sm font-semibold text-stone-500">
          Loading products...
        </p>
      </div>
    )
  }

  // ───────────────────────────────────────────────────────
  // ERROR
  // ───────────────────────────────────────────────────────
  if (error) {

    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F2F3F7]">
        <p className="text-sm font-semibold text-red-500">
          {error}
        </p>
      </div>
    )
  }

  return (

    <div className="min-h-screen bg-[#F2F3F7] flex flex-col font-sans">

      {/* ───────────────────────────────────────────── */}
      {/* TOP NAVBAR */}
      {/* ───────────────────────────────────────────── */}
      <header className="bg-white border-b border-stone-200 shadow-sm sticky top-0 z-20">

        <div className="flex items-center gap-3 px-4 sm:px-6 py-3">

          {/* LOGO */}
          <div className="flex items-center gap-2 shrink-0">

            <div className="w-8 h-8 rounded-lg bg-[#C84B31] flex items-center justify-center">

              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
              >
                <path
                  d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"
                  stroke="white"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />

                <polyline
                  points="9,22 9,12 15,12 15,22"
                  stroke="white"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>

            <span className="font-black text-sm sm:text-base text-[#1A1A1A] tracking-tight">
              ASAS OFFICIAL STORE
            </span>
          </div>

          {/* SEARCH */}
          <div className="flex-1 relative max-w-xl mx-auto">

            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400">

              <svg
                width="15"
                height="15"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <circle cx="11" cy="11" r="8" />

                <line
                  x1="21"
                  y1="21"
                  x2="16.65"
                  y2="16.65"
                />
              </svg>
            </div>

            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Cari produk..."
              className="w-full pl-9 pr-4 py-2 rounded-xl border border-stone-200 bg-stone-50 text-sm text-[#1A1A1A] placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-[#C84B31]/20 focus:border-[#C84B31] transition-all"
            />
          </div>

          {/* RIGHT */}
          <div className="flex items-center gap-1 sm:gap-3 shrink-0">

            {/* CART */}
            <button className="relative p-2 rounded-xl hover:bg-stone-100 transition-colors">

              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#1A1A1A"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <circle cx="9" cy="21" r="1" />
                <circle cx="20" cy="21" r="1" />

                <path d="M1 1h4l2.68 13.39a2 2 0 002 1.61h9.72a2 2 0 002-1.61L23 6H6" />
              </svg>

              {cartCount > 0 && (

                <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-[#C84B31] text-white text-[10px] font-bold flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </button>

            {/* LOGOUT */}
            <button
              onClick={() => navigate('/login')}
              className="text-xs sm:text-sm text-[#C84B31] font-semibold px-2 sm:px-3 py-1.5 rounded-xl hover:bg-red-50 transition-colors"
            >
              Logout
            </button>
          </div>
        </div>
      </header>

      {/* ───────────────────────────────────────────── */}
      {/* CONTENT */}
      {/* ───────────────────────────────────────────── */}
      <div className="flex flex-1 overflow-hidden">

        {/* FILTER SIDEBAR */}
        <FilterSidebar
          onFilterApply={(filters) =>
            console.log(filters)
          }
        />

        {/* MAIN */}
        <main className="flex-1 overflow-y-auto p-3 sm:p-5">

          {/* HERO */}
          <div className="rounded-2xl overflow-hidden mb-5 bg-gradient-to-r from-[#1A1A2E] via-[#16213E] to-[#0F3460] relative shadow-xl">

            <div className="relative flex flex-col sm:flex-row items-center gap-4 p-5 sm:p-6">

              <div className="flex-1 text-center sm:text-left">

                <div className="inline-block bg-[#C84B31] text-white text-[10px] font-black uppercase tracking-widest px-2 py-0.5 rounded mb-2">
                  No. 1 Brand Laptop di Indonesia
                </div>

                <div className="flex items-center justify-center sm:justify-start gap-2 mb-1">

                  <span className="text-white font-black text-4xl sm:text-5xl leading-none">
                    No.1
                  </span>

                  <div>

                    <div className="text-[#F5A623] font-black text-lg leading-tight">
                      QUALITY
                    </div>

                    <div className="text-white/70 text-xs font-bold">
                      & SERVICE
                    </div>
                  </div>
                </div>

                <p className="text-white/50 text-[10px] font-bold uppercase tracking-widest">
                  Tested Tough, Protects Better
                </p>
              </div>

              <div className="flex gap-3 text-5xl sm:text-6xl">

                <span>💻</span>
                <span>🖥️</span>
              </div>
            </div>
          </div>

          {/* RESULT */}
          <p className="text-xs text-stone-500 mb-3 font-medium">

            Menampilkan

            <span className="text-[#1A1A1A] font-bold">
              {' '}
              {filteredProducts.length}
            </span>

            {' '}produk
          </p>

          {/* PRODUCT GRID */}
          <div className="grid grid-cols-2 lg:grid-cols-3 gap-3">

            {filteredProducts.map((product) => (

              <div
                key={product.id}
                className="bg-white rounded-2xl border border-stone-100 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all overflow-hidden group"
              >

                {/* IMAGE */}
                <div className="bg-gradient-to-br from-stone-50 to-stone-100 h-28 sm:h-36 flex items-center justify-center relative overflow-hidden">

                  {product.icon ? (

                    <img
                      src={`http://localhost:3000${product.icon}`}
                      alt={product.nama}
                      className="w-full h-full object-cover"
                    />

                  ) : (

                    <span className="text-5xl">
                      💻
                    </span>
                  )}
                </div>

                {/* CONTENT */}
                <div className="p-3">

                  <h3 className="text-xs sm:text-sm font-bold text-[#1A1A1A] leading-tight mb-1 line-clamp-2">

                    {product.nama}
                  </h3>

                  <p className="text-[#C84B31] font-black text-sm sm:text-base mb-1">

                    {formatRupiah(product.harga_dasar)}
                  </p>

                  <p className="text-[10px] text-stone-400 mb-2">

                    {product.brand || 'ASAS Official Store'}
                  </p>

                  <div className="flex items-center gap-1.5 mb-3">

                    <StarRating
                      rating={product.rating || 4}
                    />

                    <span className="text-[10px] text-stone-400">
                      ({product.reviews || 0})
                    </span>
                  </div>

                  {/* BUTTON */}
                  <div className="flex gap-1.5">

                    <button
                      onClick={() =>
                        setSelectedProduct(product)
                      }
                      className="flex-1 py-1.5 rounded-lg border border-stone-200 text-[10px] sm:text-xs font-semibold text-stone-600 hover:bg-stone-50 hover:border-stone-300 transition-all active:scale-[0.97]"
                    >
                      Detail
                    </button>

                    <button className="flex-1 py-1.5 rounded-lg bg-[#C84B31] hover:bg-[#B03D26] text-[10px] sm:text-xs font-bold text-white transition-all active:scale-[0.97] shadow-sm shadow-[#C84B31]/30">

                      Beli Sekarang
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* EMPTY */}
          {filteredProducts.length === 0 && (

            <div className="bg-white border border-stone-200 rounded-2xl p-10 text-center mt-4">

              <p className="text-sm font-semibold text-stone-500">
                Produk tidak ditemukan
              </p>
            </div>
          )}
        </main>
      </div>

      {/* ───────────────────────────────────────────── */}
      {/* DETAIL MODAL */}
      {/* ───────────────────────────────────────────── */}
      {selectedProduct && (

        <ProductDetailPage
          product={selectedProduct}
          onClose={() => setSelectedProduct(null)}
        />
      )}
    </div>
  )
}