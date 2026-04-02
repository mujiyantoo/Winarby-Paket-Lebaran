import api from './auth.js';

export const getAnggota = async () => {
  return await api.get('/anggota');
};

export const createAnggota = async (anggotaData) => {
  return await api.post('/anggota', anggotaData);
};

export const deleteAnggota = async (id) => {
  return await api.delete(`/anggota/${id}`);
};

export const updateAnggota = async (id, anggotaData) => {
  return await api.put(`/anggota/${id}`, anggotaData);
};