import { useState, useEffect } from 'react'
import { Plus, Search, Pencil, Trash2, Package, ToggleLeft, ToggleRight, X } from 'lucide-react'
import { paketAPI } from '../api/paket'
import { authAPI } from '../api/auth'

const EMPTY = { nama: '', deskripsi: '', harga: '', duration: '', items: '', isActive: true }

export default function PaketPage() {
  const [pakets, setPakets] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [q, setQ] = useState('')
  const [modal, setModal] = useState(null)   // 'add' | 'edit' | null
  const [editingId, setEditingId] = useState(null)
  const [form, setForm] = useState(EMPTY)
  const [delId, setDelId] = useState(null)
  const isAuth = authAPI.isAuthenticated()

  useEffect(() => { fetchPakets() }, [])

  const fetchPakets = async () => {
    setLoading(true)
    try {
      const response = await paketAPI.getAllPakets()
      // axios returns response.data, and our backend returns { success: true, data: [...] }
      const fetchedPakets = response?.data?.data || []
      setPakets(fetchedPakets)
      setError('')
    } catch (err) {
      console.error('Gagal memuat paket:', err)
      setError('Gagal mengambil data paket')
    } finally {
      setLoading(false)
    }
  }

  const filtered = pakets.filter(p =>
    p.nama?.toLowerCase().includes(q.toLowerCase()) || p.deskripsi?.toLowerCase().includes(q.toLowerCase())
  )

  const rupiah = (n) =>
    new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(n)

  function openAdd() {
    setForm(EMPTY)
    setEditingId(null)
    setModal('add')
  }

  function openEdit(p) {
    setEditingId(p._id)
    setForm({
      nama: p.nama || '',
      deskripsi: p.deskripsi || '',
      harga: p.harga?.toString() || '',
      duration: p.duration?.toString() || '90',
      items: Array.isArray(p.items) ? p.items.join(', ') : p.items || '',
      isActive: p.isActive !== undefined ? p.isActive : true,
    })
    setModal('edit')
  }

  function closeModal() {
    setModal(null)
    setEditingId(null)
  }

  async function handleSave(e) {
    e?.preventDefault()
    if (!form.nama.trim() || !form.harga) return

    const paketData = {
      nama: form.nama,
      deskripsi: form.deskripsi,
      harga: parseFloat(form.harga),
      duration: parseInt(form.duration, 10) || 90,
      items: form.items?.split(',').map(f => f.trim()).filter(f => f.length > 0) || [],
      isActive: form.isActive,
    }

    try {
      if (editingId) {
        await paketAPI.updatePaket(editingId, paketData)
        // Fallback: update local
        setPakets(prev => prev.map(p => p._id === editingId ? { ...p, ...paketData } : p))
      } else {
        await paketAPI.createPaket(paketData)
        // Fallback: add local
        setPakets(prev => [...prev, { _id: Date.now().toString(), ...paketData, createdAt: new Date().toISOString() }])
      }
      closeModal()
      fetchPakets()
    } catch (err) {
      // Local fallback already handled above
      closeModal()
    }
  }

  async function toggleStatus(p) {
    try {
      await paketAPI.updatePaket(p._id, { ...p, isActive: !p.isActive })
    } catch {}
    setPakets(prev => prev.map(x => x._id === p._id ? { ...x, isActive: !x.isActive } : x))
  }

  async function handleDelete() {
    if (!delId) return
    try {
      await paketAPI.deletePaket(delId)
    } catch {}
    setPakets(prev => prev.filter(p => p._id !== delId))
    setDelId(null)
  }

  const f = k => ({ value: form[k], onChange: e => setForm(v => ({ ...v, [k]: e.target.value })) })

  return (
    <div className="space-y-5 animate-rise-in">
      {/* Header */}
      <div className="page-header flex items-start justify-between gap-4">
        <div>
          <h1 className="page-title">Paket Lebaran</h1>
          <p className="page-sub">{pakets.length} paket tersedia</p>
        </div>
        {isAuth && (
          <button onClick={openAdd} className="btn-primary btn-shimmer flex-shrink-0">
            <Plus size={16} />Tambah Paket
          </button>
        )}
      </div>

      {/* Search */}
      <div className="relative max-w-xs">
        <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-brown-100 pointer-events-none" />
        <input
          value={q}
          onChange={e => setQ(e.target.value)}
          placeholder="Cari paket…"
          className="input input-icon-left h-10 text-sm"
        />
      </div>

      {error && (
        <div className="p-4 bg-red-50 border border-red-200 text-red-700 rounded-xl text-sm">
          {error}
        </div>
      )}

      {/* Loading */}
      {loading && pakets.length === 0 && (
        <div className="card text-center py-12">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-gold-400 mx-auto" />
          <p className="mt-4 text-brown-300 text-sm">Memuat paket…</p>
        </div>
      )}

      {/* Empty */}
      {!loading && filtered.length === 0 && (
        <div className="card text-center py-12">
          <Package size={40} className="mx-auto mb-3 opacity-20 text-brown-300" />
          <h3 className="font-display text-lg font-semibold text-brown-700 mb-1">Belum Ada Paket</h3>
          <p className="text-sm text-brown-300">Klik "Tambah Paket" untuk membuat paket pertama.</p>
        </div>
      )}

      {/* Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filtered.map((p, i) => (
          <div
            key={p._id}
            className={`card group hover:-translate-y-1 transition-all duration-200 ${!p.isActive ? 'opacity-60 grayscale-[30%]' : ''} stagger-${(i % 6) + 1} animate-rise-in`}
          >
            {/* Header */}
            <div className="flex items-start justify-between mb-3">
              <div>
                <h3 className="font-display text-xl font-semibold text-brown-700 group-hover:text-gold-600 transition-colors">
                  {p.nama}
                </h3>
                <span className={p.isActive ? 'badge-green mt-1' : 'badge-red mt-1'}>
                  {p.isActive ? 'Aktif' : 'Nonaktif'}
                </span>
              </div>
              <div className="text-right">
                <p className="font-display text-2xl font-bold text-gold-600 leading-none">
                  {rupiah(p.harga)}
                </p>
                <p className="text-[11px] text-brown-100 mt-0.5">{p.duration} hari</p>
              </div>
            </div>

            {/* Description */}
            <p className="text-sm text-brown-300 mb-4">{p.deskripsi}</p>

            {/* Features */}
            {p.items && p.items.length > 0 && (
              <div className="mb-4">
                <p className="text-[11px] uppercase tracking-wider text-brown-300 font-medium mb-2">Isi Paket</p>
                <ul className="space-y-1.5">
                  {(Array.isArray(p.items) ? p.items : []).slice(0, 4).map((feat, idx) => (
                    <li key={idx} className="flex items-center gap-2 text-sm text-brown-500">
                      <span className="w-1.5 h-1.5 rounded-full bg-gold-400 flex-shrink-0" />
                      {feat}
                    </li>
                  ))}
                  {p.items.length > 4 && (
                    <li className="text-xs text-brown-100 pl-3.5">+{p.items.length - 4} lainnya</li>
                  )}
                </ul>
              </div>
            )}

            {/* Actions */}
            {isAuth && (
              <div className="pt-3 border-t border-gold-200/30 flex items-center gap-2">
                <button onClick={() => openEdit(p)} className="btn-ghost !h-8 !px-2.5 text-sm">
                  <Pencil size={13} /> Edit
                </button>
                <button onClick={() => toggleStatus(p)} className="btn-ghost !h-8 !px-2.5 text-sm">
                  {p.isActive ? <ToggleRight size={15} className="text-emerald-500" /> : <ToggleLeft size={15} className="text-brown-100" />}
                  {p.isActive ? 'Nonaktifkan' : 'Aktifkan'}
                </button>
                <button
                  onClick={() => setDelId(p._id)}
                  className="btn-ghost !h-8 !px-2.5 text-sm hover:!bg-red-50 hover:!text-red-600 ml-auto"
                >
                  <Trash2 size={13} />
                </button>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Modal */}
      {modal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
          <div className="bg-cream-50 rounded-2xl shadow-card-lg w-full max-w-lg p-6 animate-rise-in">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-display text-xl font-semibold text-brown-700">
                {modal === 'add' ? 'Tambah Paket' : 'Edit Paket'}
              </h2>
              <button onClick={closeModal} className="btn-ghost !h-8 !px-2">
                <X size={16} />
              </button>
            </div>
            <form onSubmit={handleSave} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2 sm:col-span-1">
                  <label className="input-label">Nama Paket *</label>
                  <input {...f('nama')} className="input" placeholder="cth: Paket Gold" required />
                </div>
                <div>
                  <label className="input-label">Harga *</label>
                  <input type="number" {...f('harga')} className="input" placeholder="750000" min="0" required />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="input-label">Durasi (Hari)</label>
                  <input type="number" {...f('duration')} className="input" placeholder="90" min="1" />
                </div>
                <div>
                  <label className="input-label">Status</label>
                  <div className="mt-2">
                    <label className="inline-flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={form.isActive}
                        onChange={e => setForm(v => ({ ...v, isActive: e.target.checked }))}
                        className="rounded text-gold-500 focus:ring-gold-400"
                      />
                      <span className="text-sm text-brown-500">Aktif</span>
                    </label>
                  </div>
                </div>
              </div>
              <div>
                <label className="input-label">Deskripsi</label>
                <textarea {...f('deskripsi')} className="input !h-auto" rows="2" placeholder="Deskripsi singkat paket…" />
              </div>
              <div>
                <label className="input-label">Isi Paket (pisahkan koma)</label>
                <input {...f('items')} className="input" placeholder="Beras 10kg, Gula 3kg, Minyak 4L" />
                <p className="text-xs text-brown-100 mt-1">Pisahkan item dengan tanda koma</p>
              </div>
              <div className="flex gap-3 pt-4">
                <button type="button" onClick={closeModal} className="btn-secondary flex-1">Batal</button>
                <button type="submit" className="btn-primary btn-shimmer flex-1">Simpan</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirm */}
      {delId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
          <div className="bg-cream-50 rounded-2xl shadow-card p-6 max-w-sm w-full animate-rise-in">
            <h3 className="font-display text-lg font-semibold text-brown-700 mb-3">Konfirmasi Hapus</h3>
            <p className="text-brown-500 mb-6">Yakin ingin menghapus paket ini? Tindakan ini tidak dapat dibatalkan.</p>
            <div className="flex gap-3">
              <button onClick={() => setDelId(null)} className="btn-secondary flex-1">Batal</button>
              <button onClick={handleDelete} className="btn-danger flex-1">Hapus</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}