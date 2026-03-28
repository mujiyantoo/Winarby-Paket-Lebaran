import { useState, useEffect } from 'react';
import { authAPI } from '../api/auth';

const Dashboard = ({ user }) => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await authAPI.getProfile();
        setProfile(response.user);
      } catch (err) {
        console.error('Failed to fetch profile:', err);
        setError('Failed to load profile information.');
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  const handleRefreshProfile = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await authAPI.getProfile();
      setProfile(response.user);
      alert('Profile refreshed successfully!');
    } catch (err) {
      console.error('Failed to refresh profile:', err);
      setError('Failed to refresh profile.');
    } finally {
      setLoading(false);
    }
  };

  const userData = profile || user;

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800">Dashboard</h1>
        <p className="text-gray-600 mt-2">Welcome to your personal dashboard</p>
      </div>

      {loading && (
        <div className="card mb-6">
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
            <span className="ml-3 text-gray-600">Loading profile...</span>
          </div>
        </div>
      )}

      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg">
          {error}
        </div>
      )}

      {userData && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* User Profile Card */}
          <div className="card md:col-span-2">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">User Profile</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-500">Full Name</label>
                <p className="mt-1 text-lg text-gray-800">{userData.name}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-500">Email Address</label>
                <p className="mt-1 text-lg text-gray-800">{userData.email}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-500">User ID</label>
                <p className="mt-1 text-sm font-mono text-gray-600 bg-gray-50 p-2 rounded">
                  {userData.id}
                </p>
              </div>
              {userData.createdAt && (
                <div>
                  <label className="block text-sm font-medium text-gray-500">Member Since</label>
                  <p className="mt-1 text-gray-700">
                    {new Date(userData.createdAt).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    })}
                  </p>
                </div>
              )}
            </div>
            
            <div className="mt-6 pt-6 border-t">
              <button
                onClick={handleRefreshProfile}
                disabled={loading}
                className="btn btn-secondary"
              >
                {loading ? 'Refreshing...' : 'Refresh Profile'}
              </button>
            </div>
          </div>

          {/* Token Information Card */}
          <div className="card">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Authentication Status</h2>
            <div className="space-y-4">
              <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
                <div className="flex items-center">
                  <svg className="w-5 h-5 text-green-600 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span className="font-medium text-green-800">Authenticated</span>
                </div>
                <p className="text-sm text-green-700 mt-1">JWT token is valid and stored in localStorage</p>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-500 mb-2">JWT Token Status</label>
                <div className="p-3 bg-gray-50 rounded-lg">
                  <p className="text-sm text-gray-600">
                    Token is {authAPI.isAuthenticated() ? 'present' : 'missing'} in localStorage
                  </p>
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-500 mb-2">API Endpoint Test</label>
                <div className="space-y-2">
                  <p className="text-sm text-gray-600">
                    Protected route <code className="text-xs bg-gray-100 px-2 py-1 rounded">/api/auth/profile</code> is accessible
                  </p>
                  <p className="text-sm text-gray-600">
                    Health check <code className="text-xs bg-gray-100 px-2 py-1 rounded">/api/health</code> is working
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Application Information Card */}
          <div className="card md:col-span-3">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Application Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="p-4 bg-blue-50 rounded-lg">
                <h3 className="font-medium text-blue-800 mb-2">Frontend</h3>
                <ul className="text-sm text-blue-700 space-y-1">
                  <li>React 18 + Vite</li>
                  <li>Tailwind CSS</li>
                  <li>React Router DOM</li>
                  <li>Axios for API calls</li>
                </ul>
              </div>
              
              <div className="p-4 bg-green-50 rounded-lg">
                <h3 className="font-medium text-green-800 mb-2">Backend</h3>
                <ul className="text-sm text-green-700 space-y-1">
                  <li>Node.js + Express</li>
                  <li>MongoDB + Mongoose</li>
                  <li>JWT Authentication</li>
                  <li>bcryptjs for password hashing</li>
                </ul>
              </div>
              
              <div className="p-4 bg-purple-50 rounded-lg">
                <h3 className="font-medium text-purple-800 mb-2">Features</h3>
                <ul className="text-sm text-purple-700 space-y-1">
                  <li>User Registration & Login</li>
                  <li>Protected Routes</li>
                  <li>Token-based Auth</li>
                  <li>Profile Management</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Instructions */}
      <div className="mt-8 card">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">Next Steps</h2>
        <div className="space-y-3">
          <p className="text-gray-700">
            This full-stack application demonstrates:
          </p>
          <ul className="list-disc pl-5 text-gray-600 space-y-2">
            <li>Complete authentication flow with JWT</li>
            <li>Secure password storage using bcrypt</li>
            <li>Protected API endpoints with middleware</li>
            <li>Token storage in localStorage</li>
            <li>MongoDB Atlas integration</li>
            <li>Responsive UI with Tailwind CSS</li>
          </ul>
          <p className="text-sm text-gray-500 mt-4">
            You can explore the code in the <code className="bg-gray-100 px-2 py-1 rounded">server</code> and <code className="bg-gray-100 px-2 py-1 rounded">client</code> directories.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;