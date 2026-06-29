import { useNavigate } from 'react-router-dom'

interface NavSidebarProps {
  activeNav: string
  onNavChange: (label: string) => void
}

const navItems = [
  {
    label: 'Beranda',
    path: '/',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
        <polyline points="9,22 9,12 15,12 15,22" />
      </svg>
    ),
  },
  {
    label: 'Profil Saya',
    path: '/profil',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" />
        <circle cx="12" cy="7" r="4" />
      </svg>
    ),
  },
  {
    label: 'Pesanan Saya',
    path: '/pesanan',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" />
        <polyline points="14,2 14,8 20,8" />
        <line x1="16" y1="13" x2="8" y2="13" />
        <line x1="16" y1="17" x2="8" y2="17" />
        <polyline points="10,9 9,9 8,9" />
      </svg>
    ),
  },
  {
    label: 'Keranjang',
    path: '/keranjang',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="9" cy="21" r="1" />
        <circle cx="20" cy="21" r="1" />
        <path d="M1 1h4l2.68 13.39a2 2 0 002 1.61h9.72a2 2 0 002-1.61L23 6H6" />
      </svg>
    ),
  },
  {
    label: 'Notifikasi',
    path: '/notifikasi',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9" />
        <path d="M13.73 21a2 2 0 01-3.46 0" />
      </svg>
    ),
  },
]

export default function NavSidebar({ activeNav, onNavChange }: NavSidebarProps) {
  const navigate = useNavigate()

  return (
    <aside className="w-[68px] bg-white border-r border-stone-100 flex flex-col items-center py-3 gap-1 shrink-0 sticky top-[57px] h-[calc(100vh-57px)] overflow-y-auto">
      {navItems.map((item) => {
        const isActive = activeNav === item.label
        return (
          <button
            key={item.label}
            onClick={() => {
              onNavChange(item.label)
              navigate(item.path)
            }}
            title={item.label}
            className={`
              relative flex flex-col items-center gap-1.5 w-full px-2 py-3 rounded-xl transition-all duration-150
              ${isActive
                ? 'text-[#C84B31] bg-[#FDF0EC]'
                : 'text-stone-400 hover:text-stone-600 hover:bg-stone-50'
              }
            `}
          >
            {/* Active indicator bar */}
            {isActive && (
              <span className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-6 rounded-r-full bg-[#C84B31]" />
            )}

            <span className={`transition-transform duration-150 ${isActive ? 'scale-105' : ''}`}>
              {item.icon}
            </span>

            <span className="text-[9px] font-medium text-center leading-tight px-1 text-inherit">
              {item.label}
            </span>
          </button>
        )
      })}
    </aside>
  )
}