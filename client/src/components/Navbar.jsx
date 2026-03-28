import { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { Menu, X, LayoutDashboard, Users, Package, CreditCard, PiggyBank, FileText, LogOut } from 'lucide-react'

const NAV_ITEMS = [
  { label: 'Dashboard', to: '/dashboard', icon: LayoutDashboard },
  { label: 'Anggota', to: '/anggota', icon: Users },
  { label: 'Paket', to: '/paket', icon: Package },
  { label: 'Pembayaran', to: '/pembayaran', icon: CreditCard },
  { label: 'Nabung Bebas', to: '/nabung-bebas', icon: PiggyBank },
  { label: 'Laporan', to: '/laporan', icon: FileText },
]

const Navbar = ({ isAuthenticated, user, onLogout }) => {
  const [mobileOpen, setMobileOpen] = useState(false)
  const location = useLocation()

  const isActive = (to) => location.pathname === to

  return (
    <nav className="bg-cream-50/95 backdrop-blur-sm shadow-card border-b border-gold-200/40 sticky top-0 z-40">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 flex-shrink-0">
            <div className="w-9 h-9 rounded-xl bg-gold-btn flex items-center justify-center shadow-gold flex-shrink-0">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.2" strokeLinejoin="round">
                <polygon points="12,2 22,12 12,22 2,12" />
                <line x1="2" y1="12" x2="22" y2="12" stroke="rgba(255,255,255,0.55)" strokeWidth="1.2" />
                <line x1="12" y1="2" x2="12" y2="22" stroke="rgba(255,255,255,0.55)" strokeWidth="1.2" />
                <circle cx="12" cy="12" r="2.5" fill="white" opacity="0.9" stroke="none" />
              </svg>
            </div>
            <div>
              <p className="font-display text-lg font-bold text-brown-700 leading-none">Pilar</p>
              <p className="text-[10px] font-medium tracking-widest text-brown-100 uppercase">Paket Lebaran</p>
            </div>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden lg:flex items-center gap-1">
            {isAuthenticated ? (
              <>
                {NAV_ITEMS.map(item => (
                  <Link
                    key={item.to}
                    to={item.to}
                    className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                      isActive(item.to)
                        ? 'bg-gold-100/80 text-gold-700 shadow-sm'
                        : 'text-brown-300 hover:text-brown-700 hover:bg-cream-200/60'
                    }`}
                  >
                    <item.icon size={15} />
                    {item.label}
                  </Link>
                ))}
                <div className="w-px h-6 bg-gold-200/50 mx-2" />
                <span className="text-sm text-brown-300 mr-1">
                  Halo, <strong className="text-brown-700">{user?.name?.split(' ')[0]}</strong>
                </span>
                <button onClick={onLogout} className="btn-ghost !h-9 !px-3 text-sm hover:!bg-red-50 hover:!text-red-600">
                  <LogOut size={15} />
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="text-brown-300 hover:text-brown-700 transition-colors px-3 py-2 text-sm font-medium">
                  Login
                </Link>
                <Link to="/register" className="btn btn-primary text-sm">
                  Daftar
                </Link>
              </>
            )}
          </div>

          {/* Mobile hamburger */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="lg:hidden btn-ghost !h-10 !px-2.5"
            aria-label="Toggle menu"
          >
            {mobileOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="lg:hidden border-t border-gold-200/30 bg-cream-50 animate-rise-in">
          <div className="container mx-auto px-4 py-3 space-y-1">
            {isAuthenticated ? (
              <>
                <div className="px-3 py-2 mb-2">
                  <p className="text-sm text-brown-300">
                    Halo, <strong className="text-brown-700">{user?.name}</strong>
                  </p>
                </div>
                {NAV_ITEMS.map(item => (
                  <Link
                    key={item.to}
                    to={item.to}
                    onClick={() => setMobileOpen(false)}
                    className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                      isActive(item.to)
                        ? 'bg-gold-100/80 text-gold-700'
                        : 'text-brown-500 hover:bg-cream-200/60'
                    }`}
                  >
                    <item.icon size={18} />
                    {item.label}
                  </Link>
                ))}
                <div className="pt-2 mt-2 border-t border-gold-200/30">
                  <button
                    onClick={() => { onLogout(); setMobileOpen(false) }}
                    className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-red-500 hover:bg-red-50 w-full"
                  >
                    <LogOut size={18} />
                    Logout
                  </button>
                </div>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  onClick={() => setMobileOpen(false)}
                  className="block px-3 py-2.5 rounded-xl text-sm font-medium text-brown-500 hover:bg-cream-200/60"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  onClick={() => setMobileOpen(false)}
                  className="block px-3 py-2.5 rounded-xl text-sm font-medium text-gold-600 hover:bg-gold-100/60"
                >
                  Daftar
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  )
}

export default Navbar
