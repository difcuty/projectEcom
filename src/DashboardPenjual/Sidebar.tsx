import { useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import {
  LayoutGrid,
  Package,
  ClipboardList,
  Wallet,
  Megaphone,
  BarChart2,
  ChevronRight,
} from 'lucide-react'

// ─── NAV ITEMS ────────────────────────────────────────────────────────────────

const navItems = [
  {
    label: 'Overview',
    icon: LayoutGrid,
    path: '/dashboard-penjual',
  },
  {
    label: 'Product Management',
    icon: Package,
    path: '/produk',
  },
  {
    label: 'Order Management',
    icon: ClipboardList,
    path: '/pesanan-masuk',
  },
  {
    label: 'Finance',
    icon: Wallet,
    path: '/keuangan',
  },
  {
    label: 'Marketing Tools',
    icon: Megaphone,
    path: '/marketing',
  },
  {
    label: 'Insights',
    icon: BarChart2,
    path: '/insights',
  },
]

// ─── TYPES ────────────────────────────────────────────────────────────────────

interface NavSidebarPenjualProps {
  /** Controlled from outside — pass location.pathname or active label */
  activePath?: string
  onNavChange?: (path: string, label: string) => void
}

// ─── COMPONENT ────────────────────────────────────────────────────────────────

export default function NavSidebarPenjual({
  activePath,
  onNavChange,
}: NavSidebarPenjualProps) {
  const navigate = useNavigate()
  const location = useLocation()
  const currentPath = activePath ?? location.pathname

  // Hover state for subtle animation
  const [hovered, setHovered] = useState<string | null>(null)

  const handleClick = (item: (typeof navItems)[0]) => {
    onNavChange?.(item.path, item.label)
    navigate(item.path)
  }

  return (
    <aside
      className="
        flex flex-col
        w-[168px] min-w-[168px]
        min-h-screen
        bg-white
        border-r border-stone-200
        pt-2 pb-6
        sticky top-[57px] h-[calc(100vh-57px)]
        overflow-y-auto
      "
      style={{ fontFamily: "'DM Sans', 'Segoe UI', sans-serif" }}
    >
      {/* Nav List */}
      <nav className="flex flex-col gap-0.5 px-2 mt-1">
        {navItems.map((item) => {
          const Icon = item.icon
          const isActive = currentPath === item.path
          const isHovered = hovered === item.path

          return (
            <button
              key={item.path}
              onClick={() => handleClick(item)}
              onMouseEnter={() => setHovered(item.path)}
              onMouseLeave={() => setHovered(null)}
              className={`
                relative flex items-center gap-3
                w-full text-left
                px-3 py-3
                rounded-xl
                transition-all duration-150
                group
                ${
                  isActive
                    ? 'bg-stone-900 text-white shadow-sm'
                    : 'text-stone-600 hover:bg-stone-100 hover:text-stone-900'
                }
              `}
            >
              {/* Active left bar accent */}
              {isActive && (
                <span className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-6 bg-white/40 rounded-r-full" />
              )}

              {/* Icon */}
              <span
                className={`
                  flex items-center justify-center
                  w-8 h-8 rounded-lg flex-shrink-0
                  transition-colors duration-150
                  ${isActive ? 'bg-white/10' : 'bg-stone-100 group-hover:bg-stone-200'}
                `}
              >
                <Icon
                  size={16}
                  className={isActive ? 'text-white' : 'text-stone-500 group-hover:text-stone-700'}
                  strokeWidth={isActive ? 2.2 : 1.8}
                />
              </span>

              {/* Label */}
              <span
                className={`
                  text-[13px] font-semibold leading-tight flex-1
                  ${isActive ? 'text-white' : 'text-stone-600 group-hover:text-stone-900'}
                `}
              >
                {item.label}
              </span>

              {/* Chevron on hover/active */}
              {(isActive || isHovered) && (
                <ChevronRight
                  size={13}
                  className={`flex-shrink-0 transition-opacity ${
                    isActive ? 'text-white/50' : 'text-stone-300'
                  }`}
                />
              )}
            </button>
          )
        })}
      </nav>

      {/* Bottom divider + version tag */}
      <div className="mt-auto px-4 pt-4 border-t border-stone-100 mx-2">
        <p className="text-[10px] text-stone-300 font-medium tracking-wider uppercase">
          Asas Seller v2
        </p>
      </div>
    </aside>
  )
}