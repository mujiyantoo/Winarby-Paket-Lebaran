import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { authAPI } from './api/auth';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import PaketPage from './pages/PaketPage';
import Anggota from './pages/Anggota';
import Pembayaran from './pages/Pembayaran';
import Laporan from './pages/Laporan';
import NabungBebas from './pages/NabungBebas';
import Navbar from './components/Navbar';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = () => {
      const authenticated = authAPI.isAuthenticated();
      const currentUser = authAPI.getCurrentUser();
      setIsAuthenticated(authenticated);
      setUser(currentUser);
      setLoading(false);
    };
    checkAuth();
  }, []);

  const handleLogin = (userData, token) => {
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(userData));
    setIsAuthenticated(true);
    setUser(userData);
  };

  const handleLogout = () => {
    authAPI.logout();
    setIsAuthenticated(false);
    setUser(null);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-cream-100">
        <div className="text-center">
          <div className="w-12 h-12 rounded-xl bg-gold-btn flex items-center justify-center shadow-gold mx-auto animate-pulse">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.2" strokeLinejoin="round">
              <polygon points="12,2 22,12 12,22 2,12" />
              <circle cx="12" cy="12" r="2.5" fill="white" opacity="0.9" stroke="none" />
            </svg>
          </div>
          <p className="mt-4 text-brown-300 text-sm font-medium">Memuat PILAR…</p>
        </div>
      </div>
    );
  }

  return (
    <Router>
      <div className="min-h-screen bg-cream-100 flex flex-col">
        <Navbar isAuthenticated={isAuthenticated} user={user} onLogout={handleLogout} />

        <main className="container mx-auto px-4 py-6 flex-1">
          <Routes>
            <Route
              path="/"
              element={
                isAuthenticated ?
                <Navigate to="/dashboard" replace /> :
                <Navigate to="/login" replace />
              }
            />
            <Route
              path="/login"
              element={
                isAuthenticated ?
                <Navigate to="/dashboard" replace /> :
                <Login onLogin={handleLogin} />
              }
            />
            <Route
              path="/register"
              element={
                isAuthenticated ?
                <Navigate to="/dashboard" replace /> :
                <Register onLogin={handleLogin} />
              }
            />
            <Route
              path="/dashboard"
              element={
                isAuthenticated ?
                <Dashboard user={user} /> :
                <Navigate to="/login" replace />
              }
            />
            <Route
              path="/paket"
              element={
                isAuthenticated ?
                <PaketPage /> :
                <Navigate to="/login" replace />
              }
            />
            <Route
              path="/anggota"
              element={
                isAuthenticated ?
                <Anggota /> :
                <Navigate to="/login" replace />
              }
            />
            <Route
              path="/pembayaran"
              element={
                isAuthenticated ?
                <Pembayaran /> :
                <Navigate to="/login" replace />
              }
            />
            <Route
              path="/nabung-bebas"
              element={
                isAuthenticated ?
                <NabungBebas /> :
                <Navigate to="/login" replace />
              }
            />
            <Route
              path="/laporan"
              element={
                isAuthenticated ?
                <Laporan /> :
                <Navigate to="/login" replace />
              }
            />
          </Routes>
        </main>

        <footer className="bg-cream-50 border-t border-gold-200/40 py-5 mt-auto">
          <div className="container mx-auto px-4 text-center">
            <p className="text-sm text-brown-300 font-medium">
              PILAR — Paket Lebaran Lancar
            </p>
            <p className="text-xs text-brown-100 mt-1">
              © {new Date().getFullYear()} Winarby · Sistem Manajemen Paket Lebaran
            </p>
          </div>
        </footer>
      </div>
    </Router>
  );
}

export default App;