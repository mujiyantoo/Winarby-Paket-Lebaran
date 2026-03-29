import { useState, useEffect } from 'react'
import { Plus, Search, Pencil, Trash2, Users } from 'lucide-react'
import api from '../api/auth'

const EMPTY = { nama: '', alamat: '', telepon: '', bergabung: new Date().toISOString().slice(0, 10), status: 'aktif' }

export default function Anggota() {
  const [anggota, setAnggota] = useState([])
  const [loading, setLoading] = useState(false)
  const [q, setQ] = useState('')
  const [modal, setModal] = useState(null)
  const [editing, setEditing] = useState(null)
  const [form, setForm] = useState(EMPTY)
  const [delId, setDelId] = useState(null)

  useEffect(() => {
    fetchAnggota()
  }, [])

  const fetchAnggota = async () => {
    setLoading(true)
    try {
      const { data } = await api.get('/anggota')
      setAnggota(data.data || data || [])
    } catch (error) {
      console.error('Error fetching anggota:', error)
    } finally {
      setLoading(false)
    }
  }

  const filtered = anggota.filter(a =>
    a.nama.toLowerCase().includes(q.toLowerCase()) || (a._id ?? '').includes(q)
  )

  function openAdd() {
    setForm(EMPTY)
    setModal('add')
  }

  function openEdit(a) {
    setEditing(a)
    setForm({
      nama: a.nama,
      alamat: a.alamat,
      telepon: a.telepon,
      bergabung: a.bergabung?.slice?.(0, 10) ?? a.bergabung,
      status: a.status
    })
    setModal('edit')
  }

  function closeModal() {
    setModal(null)
    setEditing(null)
  }

  async function handleSave() {
    if (!form.nama.trim()) return

    try {
      if (modal === 'add') {
        await api.post('/anggota', form)
      } else {
        await api.put(`/anggota/${editing._id}`, form)
      }
      fetchAnggota()
      closeModal()
    } catch (error) {
      console.error('Error saving anggota:', error)
      alert(error.message || 'Gagal menyimpan data anggota')
    }
  }

  const handleDelete = async () => {
    if (delId) {
      try {
        await api.delete(`/anggota/${delId}`)
        fetchAnggota()
        setDelId(null)
      } catch (error) {
        console.error('Error deleting anggota:', error)
        alert('Gagal menghapus anggota')
      }
    }
  }

  const f = k => ({ value: form[k], onChange: e => setForm(v => ({ ...v, [k]: e.target.value })) })

  const tgl = (dateStr) => {
    return new Date(dateStr).toLocaleDateString('id-ID', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    })
  }

  return (
    <div className="space-y-5 animate-rise-in">
      <div className="page-header flex items-start justify-between gap-4">
        <div>
          <h1 className="page-title">Anggota</h1>
          <p className="page-sub">{anggota.length} anggota terdaftar</p>
        </div>
        <button onClick={openAdd} className="btn-primary btn-shimmer flex-shrink-0">
          <Plus size={16} />Tambah Anggota
        </button>
      </div>

      <div className="relative max-w-xs">
        <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-brown-100 pointer-events-none" />
        <input
          value={q}
          onChange={e => setQ(e.target.value)}
          placeholder="Cari nama…"
          className="input input-icon-left h-10 text-sm"
        />
      </div>

      <div className="card !p-0 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="tbl">
            <thead>
              <tr>
                <th>Nama</th>
                <th>Telepon</th>
                <th>Bergabung</th>
                <th>Status</th>
                <th>Aksi</th>
              </tr>
            </thead>
            <tbody>
              {loading && (
                <tr>
                  <td colSpan={5} className="text-center py-10 text-brown-100">
                    Memuat…
                  </td>
                </tr>
              )}
              {!loading && filtered.length === 0 && (
                <tr>
                  <td colSpan={5} className="text-center py-12 text-brown-100">
                    <Users size={32} className="mx-auto mb-2 opacity-30" />
                    Tidak ada data
                  </td>
                </tr>
              )}
              {filtered.map((a, i) => (
                <tr key={a._id} className={`stagger-${(i % 6) + 1} animate-rise-in`}>
                  <td className="font-medium">{a.nama}</td>
                  <td className="text-sm text-brown-300">{a.telepon}</td>
                  <td className="text-sm text-brown-300">{tgl(a.bergabung)}</td>
                  <td>
                    <span className={a.status === 'aktif' ? 'badge-green' : 'badge-gray'}>
                      {a.status}
                    </span>
                  </td>
                  <td>
                    <div className="flex gap-1.5">
                      <button onClick={() => openEdit(a)} className="btn-ghost !h-8 !px-2.5">
                        <Pencil size={13} />
                      </button>
                      <button
                        onClick={() => setDelId(a._id)}
                        className="btn-ghost !h-8 !px-2.5 hover:!bg-red-50 hover:!text-red-600"
                      >
                        <Trash2 size={13} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal */}
      {modal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
          <div className="bg-cream-50 rounded-2xl shadow-card-lg w-full max-w-md p-6">
            <h2 className="font-display text-xl font-semibold text-brown-700 mb-4">
              {modal === 'add' ? 'Tambah Anggota' : 'Edit Anggota'}
            </h2>
            <div className="space-y-4">
              <div>
                <label className="input-label">Nama Lengkap</label>
                <input {...f('nama')} className="input" placeholder="Nama lengkap" />
              </div>
              <div>
                <label className="input-label">Alamat</label>
                <input {...f('alamat')} className="input" placeholder="Alamat" />
              </div>
              <div>
                <label className="input-label">No. Telepon</label>
                <input {...f('telepon')} type="tel" className="input" placeholder="08xxx" />
              </div>
              <div>
                <label className="input-label">Tanggal Bergabung</label>
                <input {...f('bergabung')} type="date" className="input" />
              </div>
              <div>
                <label className="input-label">Status</label>
                <select {...f('status')} className="input">
                  <option value="aktif">Aktif</option>
                  <option value="nonaktif">Non-Aktif</option>
                </select>
              </div>
              <div className="flex gap-3 pt-6">
                <button onClick={closeModal} className="btn-secondary flex-1">
                  Batal
                </button>
                <button onClick={handleSave} className="btn-primary btn-shimmer flex-1">
                  Simpan
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Confirm Dialog */}
      {delId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
          <div className="bg-cream-50 rounded-2xl shadow-card p-6 max-w-sm w-full">
            <h3 className="font-display text-lg font-semibold text-brown-700 mb-3">
              Konfirmasi Hapus
            </h3>
            <p className="text-brown-500 mb-6">Yakin hapus anggota ini?</p>
            <div className="flex gap-3">
              <button
                onClick={() => setDelId(null)}
                className="btn-secondary flex-1"
              >
                Batal
              </button>
              <button
                onClick={handleDelete}
                className="btn-danger flex-1"
              >
                Hapus
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}