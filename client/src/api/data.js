import api from './auth.js';

export const dataAPI = {
  // Get semua anggota
  getAllAnggota: async () => {
    return await api.get('/data/anggota');
  },

  // Get semua paket
  getAllPaket: async () => {
    return await api.get('/data/paket');
  },

  // Get semua pembayaran
  getAllPembayaran: async () => {
    return await api.get('/data/pembayaran');
  },

  // Get laporan statistik
  getLaporan: async () => {
    return await api.get('/data/laporan');
  }
};