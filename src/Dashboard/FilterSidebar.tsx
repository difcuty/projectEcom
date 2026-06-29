import { useState } from 'react'

const categories = [
  {
    label: 'Electronics',
    icon: '📱',
    sub: ['Handphone & Gadget'],
  },
  {
    label: 'ASAS',
    icon: '💻',
    sub: ['Laptop & PC', 'Peripherals & Accessories'],
  },
  {
    label: 'ASAS Store Exclusive',
    icon: '👕',
    sub: ['Exclusive T-Shirts', 'Exclusive Hats'],
  },
]

interface FilterSidebarProps {
  onFilterApply?: (filters: { minPrice: string; maxPrice: string; rating: number }) => void
}

export default function FilterSidebar({ onFilterApply }: FilterSidebarProps) {
  const [activeCat, setActiveCat] = useState<string | null>(null)
  const [minPrice, setMinPrice] = useState('')
  const [maxPrice, setMaxPrice] = useState('')
  const [filterRating, setFilterRating] = useState(4)

  const handleApply = () => {
    onFilterApply?.({ minPrice, maxPrice, rating: filterRating })
  }

  return (
    <aside className="hidden md:flex w-52 lg:w-60 bg-white border-r border-stone-200 flex-col shrink-0 sticky top-[57px] h-[calc(100vh-57px)] overflow-y-auto">

      {/* ── Kategori Produk ── */}
      <div className="p-4 border-b border-stone-100">
        <h3 className="text-xs font-black text-[#1A1A1A] uppercase tracking-widest mb-3">
          Kategori Produk
        </h3>
        <div className="space-y-1">
          {categories.map(cat => (
            <div key={cat.label}>
              <button
                onClick={() => setActiveCat(activeCat === cat.label ? null : cat.label)}
                className="w-full flex items-center justify-between px-2 py-1.5 rounded-lg hover:bg-stone-50 transition-colors text-left"
              >
                <div className="flex items-center gap-2">
                  <span className="text-sm">{cat.icon}</span>
                  <span className="text-xs font-semibold text-[#1A1A1A]">{cat.label}</span>
                </div>
                <svg
                  width="12" height="12" viewBox="0 0 24 24" fill="none"
                  stroke="currentColor" strokeWidth="2"
                  className={`text-stone-400 transition-transform duration-200 ${activeCat === cat.label ? 'rotate-180' : ''}`}
                >
                  <polyline points="6,9 12,15 18,9"/>
                </svg>
              </button>

              {/* Sub-items — selalu tampil, tapi bisa diubah ke conditional */}
              <div className="ml-6 mt-0.5 space-y-0.5">
                {cat.sub.map(s => (
                  <button
                    key={s}
                    className="w-full text-left text-xs text-stone-500 hover:text-[#C84B31] px-2 py-1 rounded-lg hover:bg-[#FDF0EC] transition-colors"
                  >
                    • {s}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── Filter & Sortir ── */}
      <div className="p-4">
        <h3 className="text-xs font-black text-[#1A1A1A] uppercase tracking-widest mb-3">
          Filter & Sortir
        </h3>

        {/* Harga */}
        <div className="mb-4">
          <label className="text-xs font-semibold text-stone-500 uppercase tracking-wider block mb-2">
            Harga
          </label>
          <div className="flex items-center gap-2">
            <input
              type="number"
              value={minPrice}
              onChange={e => setMinPrice(e.target.value)}
              placeholder="min"
              className="w-full px-2 py-1.5 rounded-lg border border-stone-200 bg-stone-50 text-xs text-stone-700 focus:outline-none focus:border-[#C84B31] transition-all"
            />
            <span className="text-stone-300 text-xs shrink-0">—</span>
            <input
              type="number"
              value={maxPrice}
              onChange={e => setMaxPrice(e.target.value)}
              placeholder="max"
              className="w-full px-2 py-1.5 rounded-lg border border-stone-200 bg-stone-50 text-xs text-stone-700 focus:outline-none focus:border-[#C84B31] transition-all"
            />
          </div>
        </div>

        {/* Rating */}
        <div className="mb-4">
          <label className="text-xs font-semibold text-stone-500 uppercase tracking-wider block mb-2">
            Rating
          </label>
          <div className="flex gap-1">
            {[1, 2, 3, 4, 5].map(r => (
              <button key={r} onClick={() => setFilterRating(r)}>
                <svg
                  width="18" height="18" viewBox="0 0 24 24"
                  fill={r <= filterRating ? '#F5A623' : 'none'}
                  stroke={r <= filterRating ? '#F5A623' : '#D1D5DB'}
                  strokeWidth="2"
                >
                  <polygon points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26"/>
                </svg>
              </button>
            ))}
          </div>
        </div>

        {/* Lokasi */}
        <div className="mb-5">
          <label className="text-xs font-semibold text-stone-500 uppercase tracking-wider block mb-2">
            Lokasi
          </label>
          <input
            type="range" min="0" max="100" defaultValue="60"
            className="w-full h-1.5 appearance-none bg-stone-200 rounded-full outline-none cursor-pointer accent-[#C84B31]"
          />
        </div>

        <button
          onClick={handleApply}
          className="w-full py-2.5 rounded-xl bg-[#C84B31] hover:bg-[#B03D26] text-white text-xs font-bold uppercase tracking-widest transition-all shadow-md shadow-[#C84B31]/20 active:scale-[0.98]"
        >
          Terapkan Filter
        </button>
      </div>
    </aside>
  )
}