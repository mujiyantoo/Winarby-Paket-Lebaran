import React, { useEffect, useState } from 'react';
import { getAnggota, createAnggota, deleteAnggota, updateAnggota } from '../api';

const Anggota = () => {
  const [anggota, setAnggota] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({ nama: '', alamat: '', telepon: '', status: 'aktif' });

  useEffect(() => { loadAnggota(); }, []);

  const loadAnggota = async () => {
    try { const data = await getAnggota(); setAnggota(data); }
    catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) { await updateAnggota(editingId, formData); }
      else { await createAnggota(formData); }
      setShowForm(false); setEditingId(null); setFormData({ nama: '', alamat: '', telepon: '', status: 'aktif' });
      loadAnggota();
    } catch (err) { alert(err.message); }
  };

  const handleEdit = (item) => {
    setFormData({ nama: item.nama, alamat: item.alamat || '', telepon: item.telepon || '', status: item.status });
    setEditingId(item._id); setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (confirm('Yakin hapus anggota ini?')) { try { await deleteAnggota(id); loadAnggota(); } catch (err) { alert(err.message); } }
  };

  const activeCount = anggota.filter(a => a.status === 'aktif').length;

  if (loading) return (
    <div className="flex items-center justify-center h-96 pt-20">
      <div className="animate-spin rounded-full h-12 w-12 border-4 border-amber-500 border-t-transparent"></div>
    </div>
  );

  return (
    <div className="p-4 lg:p-8 bg-slate-50 min-h-screen pt-20 lg:pt-8">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold text-slate-800">Data Anggota</h1>
          <p className="text-slate-500 text-sm mt-1">Kelola semua anggota dengan mudah</p>
        </div>
        <button onClick={() => { setShowForm(!showForm); setEditingId(null); setFormData({ nama: '', alamat: '', telepon: '', status: 'aktif' }); }} className="mt-4 sm:mt-0 bg-gradient-to-r from-amber-500 to-orange-500 text-white px-4 py-2.5 lg:px-6 lg:py-3 rounded-xl font-medium hover:shadow-lg hover:shadow-amber-500/30 transition-all flex items-center gap-2 text-sm lg:text-base">
          <svg className="w-4 h-4 lg:w-5 lg:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
          <span className="hidden sm:inline">Tambah</span>
        </button>
      </div>

      {/* Stats Cards - Mobile Horizontal Scroll */}
      <div className="flex gap-3 overflow-x-auto pb-4 mb-4 -mx-4 px-4 lg:mx-0 lg:px-0">
        <div className="bg-white rounded-xl p-4 shadow-card min-w-[120px]">
          <p className="text-slate-500 text-xs">Total</p>
          <p className="text-xl font-bold text-slate-800">{anggota.length}</p>
        </div>
        <div className="bg-white rounded-xl p-4 shadow-card min-w-[120px]">
          <p className="text-slate-500 text-xs">Aktif</p>
          <p className="text-xl font-bold text-emerald-600">{activeCount}</p>
        </div>
        <div className="bg-white rounded-xl p-4 shadow-card min-w-[120px]">
          <p className="text-slate-500 text-xs">Nonaktif</p>
          <p className="text-xl font-bold text-red-600">{anggota.length - activeCount}</p>
        </div>
      </div>

      {showForm && (
        <div className="bg-white rounded-xl lg:rounded-2xl p-4 lg:p-6 shadow-card mb-4 lg:mb-8 border-t-4 border-amber-500">
          <h2 className="text-lg lg:text-xl font-bold text-slate-800 mb-4">{editingId ? 'Edit Anggota' : 'Tambah Anggota'}</h2>
          <form onSubmit={handleSubmit} className="space-y-3 lg:space-y-4">
            <input type="text" placeholder="Nama Lengkap" className="w-full border-2 border-slate-200 rounded-xl p-3 text-sm lg:text-base focus:border-amber-500 focus:outline-none" value={formData.nama} onChange={e => setFormData({...formData, nama: e.target.value})} required />
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-3 lg:gap-4">
              <input type="text" placeholder="Alamat" className="w-full border-2 border-slate-200 rounded-xl p-3 text-sm lg:text-base focus:border-amber-500 focus:outline-none" value={formData.alamat} onChange={e => setFormData({...formData, alamat: e.target.value})} />
              <input type="text" placeholder="Telepon" className="w-full border-2 border-slate-200 rounded-xl p-3 text-sm lg:text-base focus:border-amber-500 focus:outline-none" value={formData.telepon} onChange={e => setFormData({...formData, telepon: e.target.value})} />
              <select className="w-full border-2 border-slate-200 rounded-xl p-3 text-sm lg:text-base focus:border-amber-500 focus:outline-none" value={formData.status} onChange={e => setFormData({...formData, status: e.target.value})}>
                <option value="aktif">Aktif</option>
                <option value="nonaktif">Nonaktif</option>
              </select>
            </div>
            <div className="flex gap-2 lg:gap-3">
              <button type="submit" className="flex-1 bg-gradient-to-r from-emerald-500 to-teal-500 text-white px-4 py-2.5 lg:py-3 rounded-xl font-medium text-sm lg:text-base">{editingId ? 'Simpan' : 'Tambah'}</button>
              <button type="button" onClick={() => { setShowForm(false); setEditingId(null); setFormData({ nama: '', alamat: '', telepon: '', status: 'aktif' }); }} className="px-4 py-2.5 lg:py-3 bg-slate-100 text-slate-600 rounded-xl font-medium text-sm lg:text-base">Batal</button>
            </div>
          </form>
        </div>
      )}

      {/* Mobile Card View */}
      <div className="lg:hidden space-y-3">
        {anggota.map((item, index) => (
          <div key={item._id} className="bg-white rounded-xl p-4 shadow-card">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-amber-400 to-orange-500 rounded-full flex items-center justify-center text-white font-bold text-sm">{item.nama.charAt(0).toUpperCase()}</div>
                <div>
                  <p className="font-medium text-slate-800">{item.nama}</p>
                  <p className="text-xs text-slate-400">{item.telepon || '-'}</p>
                </div>
              </div>
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${item.status === 'aktif' ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'}`}>{item.status === 'aktif' ? 'Aktif' : 'Nonaktif'}</span>
            </div>
            <div className="flex gap-2">
              <button onClick={() => handleEdit(item)} className="flex-1 py-2 text-center text-blue-600 bg-blue-50 rounded-lg text-sm">Edit</button>
              <button onClick={() => handleDelete(item._id)} className="flex-1 py-2 text-center text-red-600 bg-red-50 rounded-lg text-sm">Hapus</button>
            </div>
          </div>
        ))}
        {anggota.length === 0 && <div className="text-center py-8 text-slate-400">Belum ada anggota</div>}
      </div>

      {/* Desktop Table View */}
      <div className="hidden lg:block bg-white rounded-2xl shadow-card overflow-hidden">
        <table className="w-full">
          <thead className="bg-slate-50">
            <tr>
              <th className="p-4 text-left text-sm font-semibold text-slate-600">No</th>
              <th className="p-4 text-left text-sm font-semibold text-slate-600">Nama</th>
              <th className="p-4 text-left text-sm font-semibold text-slate-600">Alamat</th>
              <th className="p-4 text-left text-sm font-semibold text-slate-600">Telepon</th>
              <th className="p-4 text-left text-sm font-semibold text-slate-600">Bergabung</th>
              <th className="p-4 text-left text-sm font-semibold text-slate-600">Status</th>
              <th className="p-4 text-left text-sm font-semibold text-slate-600">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {anggota.map((item, index) => (
              <tr key={item._id} className="hover:bg-slate-50">
                <td className="p-4 text-slate-600">{index + 1}</td>
                <td className="p-4"><div className="flex items-center gap-3"><div className="w-10 h-10 bg-gradient-to-br from-amber-400 to-orange-500 rounded-full flex items-center justify-center text-white font-bold">{item.nama.charAt(0).toUpperCase()}</div><span className="font-medium text-slate-800">{item.nama}</span></div></td>
                <td className="p-4 text-slate-600">{item.alamat || '-'}</td>
                <td className="p-4 text-slate-600">{item.telepon || '-'}</td>
                <td className="p-4 text-slate-600">{item.bergabung ? new Date(item.bergabung).toLocaleDateString('id-ID') : '-'}</td>
                <td className="p-4"><span className={`px-3 py-1 rounded-full text-xs font-medium ${item.status === 'aktif' ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'}`}>{item.status === 'aktif' ? 'Aktif' : 'Nonaktif'}</span></td>
                <td className="p-4"><div className="flex gap-2"><button onClick={() => handleEdit(item)} className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg"><svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg></button><button onClick={() => handleDelete(item._id)} className="p-2 text-red-600 hover:bg-red-50 rounded-lg"><svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg></button></div></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Anggota;