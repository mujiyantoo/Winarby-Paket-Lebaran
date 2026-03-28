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
import Navbar from './components/Navbar';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check authentication status on mount
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
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <Router>
      <div className="min-h-screen bg-cream-100">
        <Navbar isAuthenticated={isAuthenticated} user={user} onLogout={handleLogout} />
        
        <main className="container mx-auto px-4 py-8">
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
              path="/laporan" 
              element={
                isAuthenticated ? 
                <Laporan /> : 
                <Navigate to="/login" replace />
              } 
            />
          </Routes>
        </main>
        
        <footer className="bg-cream-50 border-t border-gold-200/40 py-6">
          <div className="container mx-auto px-4 text-center text-brown-300">
            <p>Pilar - Paket Lebaran Management System</p>
            <p className="text-sm mt-2">Backend: Node.js + Express | Frontend: React + Tailwind CSS</p>
          </div>
        </footer>
      </div>
    </Router>
  );
}

export default App;