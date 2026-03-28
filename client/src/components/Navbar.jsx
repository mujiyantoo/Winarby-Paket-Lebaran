import { Link } from 'react-router-dom';

const Navbar = ({ isAuthenticated, user, onLogout }) => {
  return (
    <nav className="bg-white shadow-md">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <Link to="/" className="text-xl font-bold text-primary-600">
              FullStack App
            </Link>
          </div>
          
          <div className="flex items-center space-x-4">
            {isAuthenticated ? (
              <>
                <div className="flex items-center space-x-4">
                  <span className="text-gray-700">
                    Welcome, <strong>{user?.name}</strong>
                  </span>
                  <Link
                    to="/dashboard"
                    className="text-gray-600 hover:text-primary-600 transition-colors"
                  >
                    Dashboard
                  </Link>
                  <Link
                    to="/paket"
                    className="text-gray-600 hover:text-primary-600 transition-colors"
                  >
                    Paket
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
                  className="text-gray-600 hover:text-primary-600 transition-colors"
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