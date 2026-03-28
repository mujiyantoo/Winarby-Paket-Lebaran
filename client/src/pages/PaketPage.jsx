import { useState, useEffect } from 'react';
import { paketAPI } from '../api/paket';
import { authAPI } from '../api/auth';

const PaketPage = () => {
  const [pakets, setPakets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    duration: '',
    features: '',
    isActive: true,
  });

  // Check authentication on mount
  useEffect(() => {
    const authenticated = authAPI.isAuthenticated();
    setIsAuthenticated(authenticated);
    fetchPakets();
  }, []);

  const fetchPakets = async () => {
    try {
      setLoading(true);
      const response = await paketAPI.getAllPakets();
      setPakets(response.data || []);
      setError('');
    } catch (err) {
      console.error('Failed to fetch pakets:', err);
      setError(err.message || 'Failed to load pakets');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value,
    });
  };

  const handleFeaturesChange = (e) => {
    const featuresArray = e.target.value
      .split(',')
      .map((feature) => feature.trim())
      .filter((feature) => feature.length > 0);
    setFormData({
      ...formData,
      features: featuresArray,
    });
  };

  const handleEdit = (paket) => {
    setFormData({
      name: paket.name,
      description: paket.description,
      price: paket.price.toString(),
      duration: paket.duration.toString(),
      features: paket.features.join(', '),
      isActive: paket.isActive,
    });
    setEditingId(paket._id);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this paket?')) {
      return;
    }

    try {
      await paketAPI.deletePaket(id);
      alert('Paket deleted successfully!');
      fetchPakets();
    } catch (err) {
      console.error('Delete error:', err);
      alert(err.message || 'Failed to delete paket');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!isAuthenticated) {
      alert('You must be logged in to perform this action');
      return;
    }

    try {
      const paketData = {
        name: formData.name,
        description: formData.description,
        price: parseFloat(formData.price),
        duration: parseInt(formData.duration, 10),
        features: formData.features
          .split(',')
          .map((f) => f.trim())
          .filter((f) => f.length > 0),
        isActive: formData.isActive,
      };

      if (editingId) {
        await paketAPI.updatePaket(editingId, paketData);
        alert('Paket updated successfully!');
      } else {
        await paketAPI.createPaket(paketData);
        alert('Paket created successfully!');
      }

      // Reset form and refresh list
      resetForm();
      fetchPakets();
    } catch (err) {
      console.error('Submit error:', err);
      alert(err.message || 'Failed to save paket');
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      price: '',
      duration: '',
      features: '',
      isActive: true,
    });
    setEditingId(null);
    setShowForm(false);
  };

  const toggleStatus = async (paket) => {
    try {
      await paketAPI.updatePaket(paket._id, {
        ...paket,
        isActive: !paket.isActive,
      });
      alert(`Paket ${!paket.isActive ? 'activated' : 'deactivated'} successfully!`);
      fetchPakets();
    } catch (err) {
      console.error('Toggle status error:', err);
      alert(err.message || 'Failed to update paket status');
    }
  };

  if (loading && pakets.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading pakets...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800">Paket Management</h1>
        <p className="text-gray-600 mt-2">Manage your subscription packages</p>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg">
          {error}
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <button
            onClick={fetchPakets}
            className="btn btn-secondary mr-2"
            disabled={loading}
          >
            {loading ? 'Refreshing...' : 'Refresh List'}
          </button>
          <button
            onClick={() => setShowForm(!showForm)}
            className="btn btn-primary"
            disabled={!isAuthenticated}
          >
            {showForm ? 'Cancel' : 'Add New Paket'}
          </button>
        </div>
        <div className="text-sm text-gray-600">
          {pakets.length} paket{pakets.length !== 1 ? 's' : ''} found
        </div>
      </div>

      {/* Create/Edit Form */}
      {showForm && (
        <div className="card mb-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">
            {editingId ? 'Edit Paket' : 'Create New Paket'}
          </h2>
          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Name *
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="input"
                  placeholder="Package name"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Price *
                </label>
                <input
                  type="number"
                  name="price"
                  value={formData.price}
                  onChange={handleInputChange}
                  className="input"
                  placeholder="0.00"
                  min="0"
                  step="0.01"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Duration (days) *
                </label>
                <input
                  type="number"
                  name="duration"
                  value={formData.duration}
                  onChange={handleInputChange}
                  className="input"
                  placeholder="30"
                  min="1"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Status
                </label>
                <div className="mt-2">
                  <label className="inline-flex items-center">
                    <input
                      type="checkbox"
                      name="isActive"
                      checked={formData.isActive}
                      onChange={handleInputChange}
                      className="rounded text-primary-600 focus:ring-primary-500"
                    />
                    <span className="ml-2 text-gray-700">Active</span>
                  </label>
                </div>
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description *
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  className="input"
                  rows="3"
                  placeholder="Package description"
                  required
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Features (comma separated)
                </label>
                <input
                  type="text"
                  name="features"
                  value={formData.features}
                  onChange={handleFeaturesChange}
                  className="input"
                  placeholder="Feature 1, Feature 2, Feature 3"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Separate multiple features with commas
                </p>
              </div>
            </div>
            <div className="mt-6 flex justify-end space-x-3">
              <button
                type="button"
                onClick={resetForm}
                className="btn btn-secondary"
              >
                Cancel
              </button>
              <button type="submit" className="btn btn-primary">
                {editingId ? 'Update Paket' : 'Create Paket'}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Paket List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {pakets.length === 0 ? (
          <div className="col-span-3">
            <div className="card text-center py-12">
              <svg
                className="w-16 h-16 text-gray-400 mx-auto"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
              <h3 className="mt-4 text-lg font-medium text-gray-900">No Pakets Found</h3>
              <p className="mt-2 text-gray-500">
                Get started by creating your first paket.
              </p>
            </div>
          </div>
        ) : (
          pakets.map((paket) => (
            <div
              key={paket._id}
              className={`card ${!paket.isActive ? 'opacity-75' : ''}`}
            >
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-xl font-semibold text-gray-800">{paket.name}</h3>
                  <span
                    className={`inline-block px-2 py-1 text-xs font-medium rounded-full mt-1 ${
                      paket.isActive
                        ? 'bg-green-100 text-green-800'
                        : 'bg-red-100 text-red-800'
                    }`}
                  >
                    {paket.isActive ? 'Active' : 'Inactive'}
                  </span>
                </div>
                <div className="text-2xl font-bold text-primary-600">
                  ${paket.price.toFixed(2)}
                </div>
              </div>
              <p className="text-gray-600 mb-4">{paket.description}</p>
              <div className="mb-4">
                <div className="flex items-center text-sm text-gray-500 mb-2">
                  <svg
                    className="w-4 h-4 mr-1"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z"
                      clipRule="evenodd"
                    />
                  </svg>
                  Duration: {paket.duration} days
                </div>
                {paket.features && paket.features.length > 0 && (
                  <div>
                    <h4 className="text-sm font-medium text-gray-700 mb-1">Features:</h4>
                    <ul className="text-sm text-gray-600 list-disc pl-5">
                      {paket.features.slice(0, 3).map((feature, index) => (
                        <li key={index}>{feature}</li>
                      ))}
                      {paket.features.length > 3 && (
                        <li className="text-gray-500">
                          +{paket.features.length - 3} more
                        </li>
                      )}
                    </ul>
                  </div>
                )}
              </div>
              <div className="pt-4 border-t">
                <div className="flex justify-between">
                  <div className="flex space-x-2">
                    {isAuthenticated && (
                      <>
                        <button
                          onClick={() => handleEdit(paket)}
                          className="text-sm text-blue-600 hover:text-blue-800"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => toggleStatus(paket)}
                          className="text-sm text-orange-600 hover:text-orange-800"
                        >
                          {paket.isActive ? 'Deactivate' : 'Activate'}
                        </button>
                        <button
                          onClick={() => handleDelete(paket._id)}
                          className="text-sm text-red-600 hover:text-red-800"
                        >
                          Delete
                        </button>
                      </>
                    )}
                  </div>
                  <div className="text-xs text-gray-500">
                    Created: {new Date(paket.createdAt).toLocaleDateString()}
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Authentication Notice */}
      {!isAuthenticated && (
        <div className="mt-8 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
          <div className="flex">
            <svg
              className="w-5 h-5 text-yellow-600 mr-2"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                clipRule="evenodd"
              />
            </svg>
            <div>
              <h4 className="font-medium text-yellow-800">Authentication Required</h4>
              <p className="text-sm text-yellow-700 mt-1">
                You need to be logged in to create, edit, or delete pakets. Please login
                to access all features.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PaketPage;