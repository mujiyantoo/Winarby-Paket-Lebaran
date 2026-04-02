import api from './auth.js';

export const getPembayaran = async () => {
  return await api.get('/pembayaran');
};

export const createPembayaran = async (pembayaranData) => {
  return await api.post('/pembayaran', pembayaranData);
};

export const deletePembayaran = async (id) => {
  return await api.delete(`/pembayaran/${id}`);
};

export const updatePembayaran = async (id, pembayaranData) => {
  return await api.put(`/pembayaran/${id}`, pembayaranData);
};