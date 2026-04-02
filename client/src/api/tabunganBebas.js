import api from './auth.js';

export const getTabunganBebas = async () => {
  return await api.get('/tabungan-bebas');
};

export const createTabunganBebas = async (tabunganData) => {
  return await api.post('/tabungan-bebas', tabunganData);
};

export const deleteTabunganBebas = async (id) => {
  return await api.delete(`/tabungan-bebas/${id}`);
};

export const updateTabunganBebas = async (id, tabunganData) => {
  return await api.put(`/tabungan-bebas/${id}`, tabunganData);
};