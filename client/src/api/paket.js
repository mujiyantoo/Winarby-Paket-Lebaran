import api from './auth.js';

export const paketAPI = {
  // Get all pakets
  getAllPakets: async (isActive) => {
    const params = {};
    if (isActive !== undefined) {
      params.isActive = isActive;
    }
    return await api.get('/paket', { params });
  },

  // Get single paket by ID
  getPaketById: async (id) => {
    return await api.get(`/paket/${id}`);
  },

  // Create new paket
  createPaket: async (paketData) => {
    return await api.post('/paket', paketData);
  },

  // Update paket
  updatePaket: async (id, paketData) => {
    return await api.put(`/paket/${id}`, paketData);
  },

  // Delete paket
  deletePaket: async (id) => {
    return await api.delete(`/paket/${id}`);
  },
};