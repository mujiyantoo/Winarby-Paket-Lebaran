import api from './auth.js';

// Get all pakets
const getAllPakets = async () => {
  return await api.get('/paket');
};

// Get single paket by ID
const getPaketById = async (id) => {
  return await api.get(`/paket/${id}`);
};

// Create new paket
const createPaket = async (paketData) => {
  return await api.post('/paket', paketData);
};

// Update paket
const updatePaket = async (id, paketData) => {
  return await api.put(`/paket/${id}`, paketData);
};

// Delete paket
const deletePaket = async (id) => {
  return await api.delete(`/paket/${id}`);
};

export const paketAPI = {
  getAllPakets,
  getPaketById,
  createPaket,
  updatePaket,
  deletePaket,
};

// Also export individual functions for use in Dashboard
export { getAllPakets as getPaket, getPaketById, createPaket, updatePaket, deletePaket };