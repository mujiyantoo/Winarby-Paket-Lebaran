import { Link } from 'react-router-dom';

const Navbar = ({ isAuthenticated, user, onLogout }) => {
  return (
    <nav className="bg-cream-50 shadow-card border-b border-gold-200/40">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <Link to="/" className="flex items-center gap-3">
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
          </div>
          
          <div className="flex items-center space-x-4">
            {isAuthenticated ? (
              <>
                <div className="flex items-center space-x-4">
                  <span className="text-brown-700">
                    Welcome, <strong>{user?.name}</strong>
                  </span>
                  <Link
                    to="/dashboard"
                    className="text-brown-300 hover:text-brown-700 transition-colors"
                  >
                    Dashboard
                  </Link>
                  <Link
                    to="/anggota"
                    className="text-brown-300 hover:text-brown-700 transition-colors"
                  >
                    Anggota
                  </Link>
                  <Link
                    to="/paket"
                    className="text-brown-300 hover:text-brown-700 transition-colors"
                  >
                    Paket
                  </Link>
                  <Link
                    to="/pembayaran"
                    className="text-brown-300 hover:text-brown-700 transition-colors"
                  >
                    Pembayaran
                  </Link>
                  <Link
                    to="/laporan"
                    className="text-brown-300 hover:text-brown-700 transition-colors"
                  >
                    Laporan
                  </Link>
                  <button
                    onClick={onLogout}
                    className="btn btn-secondary"
                  >
                    Logout
                  </button>
                </div>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="text-brown-300 hover:text-brown-700 transition-colors"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="btn btn-primary"
                >
                  Sign Up
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
