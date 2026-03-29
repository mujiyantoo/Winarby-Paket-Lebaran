import { useState, useEffect } from 'react'
import { Plus, Search, Pencil, Trash2, CreditCard, Printer, MessageCircle } from 'lucide-react'
import api from '../api/auth'

const EMPTY = { anggota: '', paket: '', jumlah: '', tanggal: new Date().toISOString().slice(0, 10), metode: 'tunai', keterangan: '' }

export default function Pembayaran() {
  const [pembayaran, setPembayaran] = useState([])
  const [anggota, setAnggota] = useState([])
  const [paket, setPaket] = useState([])
  const [loading, setLoading] = useState(false)
  const [q, setQ] = useState('')
  const [modal, setModal] = useState(null)
  const [editing, setEditing] = useState(null)
  const [form, setForm] = useState(EMPTY)
  const [delId, setDelId] = useState(null)
  const [filterDate, setFilterDate] = useState('')

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    setLoading(true)
    try {
      const [resAnggota, resPaket, resPembayaran] = await Promise.all([
        api.get('/anggota').catch(() => ({ data: { data: [] } })),
        api.get('/paket').catch(() => ({ data: { data: [] } })),
        api.get('/pembayaran').catch(() => ({ data: { data: [] } }))
      ])

      const anggotaData = resAnggota?.data?.data || resAnggota?.data || []
      const paketData = resPaket?.data?.data || resPaket?.data || []
      const pembayaranData = resPembayaran?.data?.data || resPembayaran?.data || []

      setAnggota(anggotaData)
      setPaket(paketData)
      setPembayaran(pembayaranData)
    } catch (error) {
      console.error('Error fetching data:', error)
    } finally {
      setLoading(false)
    }
  }

  const filtered = [...pembayaran]
    .sort((a, b) => new Date(b.tanggal) - new Date(a.tanggal))
    .filter(p => !q || p.anggota?.nama?.toLowerCase().includes(q.toLowerCase()) || p._id?.includes(q))
    .filter(p => !filterDate || (p.tanggal && p.tanggal.startsWith(filterDate)))

  function openAdd() {
    setForm(EMPTY)
    setModal('add')
  }

  function openEdit(p) {
    setEditing(p)
    setForm({
      anggota: p.anggota?._id ?? p.anggota,
      paket: p.paket?._id ?? p.paket,
      jumlah: p.jumlah,
      tanggal: p.tanggal?.slice?.(0, 10) ?? p.tanggal,
      metode: p.metode,
      keterangan: p.keterangan
    })
    setModal('edit')
  }

  function closeModal() {
    setModal(null)
    setEditing(null)
  }

  async function handleSave() {
    if (!form.anggota || !form.paket || !form.jumlah) return

    const data = { ...form, jumlah: Number(form.jumlah) }

    try {
      if (modal === 'add') {
        await api.post('/pembayaran', data)
      } else {
        await api.put(`/pembayaran/${editing._id}`, data)
      }
      fetchData()
      closeModal()
    } catch (error) {
      console.error('Error saving data:', error)
      alert(error.message || 'Gagal menyimpan pembayaran')
    }
  }

  const handleDelete = async () => {
    if (delId) {
      try {
        await api.delete(`/pembayaran/${delId}`)
        fetchData()
        setDelId(null)
      } catch (error) {
        console.error('Error deleting data:', error)
        alert('Gagal menghapus pembayaran')
      }
    }
  }

  const f = k => ({ value: form[k], onChange: e => setForm(v => ({ ...v, [k]: e.target.value })) })

  const rupiah = (amount) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(amount)
  }

  const tgl = (dateStr) => {
    return new Date(dateStr).toLocaleDateString('id-ID', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    })
  }

  const sendWA = (p) => {
    let finalPhone = ''
    if (p.anggota?.telepon) {
      const phone = p.anggota.telepon.replace(/\D/g, '')
      finalPhone = phone.startsWith('0') ? '62' + phone.slice(1) : phone
    }
    
    const currentAnggotaId = p.anggota._id
    const accumulated = pembayaran
      .filter(item => item.anggota?._id === currentAnggotaId && new Date(item.tanggal) <= new Date(p.tanggal))
      .reduce((sum, item) => sum + item.jumlah, 0)
    
    const msg = `Assalamualaikum Bp/Ibu/Sdr. ${p.anggota.nama}\n\nIjin menginformasikan Total Pembayaran Paket Bp/Ibu/Sdr. s.d tanggal ${tgl(p.tanggal)} adalah *${rupiah(accumulated)}*.\n\nTerima kasih.\nWassalamualaikum Warahmatullah Wb,\nPengelola Tabungan,\nNia Kurniawati`
    
    const url = finalPhone 
      ? `https://wa.me/${finalPhone}?text=${encodeURIComponent(msg)}`
      : `https://wa.me/?text=${encodeURIComponent(msg)}`
    
    window.open(url, '_blank')
  }

  return (
    <div className="space-y-5 animate-rise-in">
      <div className="page-header flex items-start justify-between gap-4 no-print">
        <div>
          <h1 className="page-title">Pembayaran</h1>
          <p className="page-sub">{pembayaran.length} transaksi tercatat</p>
        </div>
        <div className="flex gap-2">
          <button onClick={() => window.print()} className="btn-secondary flex-shrink-0">
            <Printer size={16} />Cetak PDF
          </button>
          <button onClick={openAdd} className="btn-primary btn-shimmer flex-shrink-0">
            <Plus size={16} />Catat Pembayaran
          </button>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-3 mb-5 no-print">
        <div className="relative flex-1 max-w-xs">
          <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-brown-100 pointer-events-none" />
          <input
            value={q}
            onChange={e => setQ(e.target.value)}
            placeholder="Cari nama anggota…"
            className="input input-icon-left h-10 text-sm"
          />
        </div>
        <input 
          type="date"
          value={filterDate}
          onChange={e => setFilterDate(e.target.value)}
          className="input h-10 text-sm max-w-[160px]"
        />
        {filterDate && (
          <button onClick={() => setFilterDate('')} className="btn-ghost !h-10 text-xs">Reset Tanggal</button>
        )}
      </div>

      <div className="card !p-0 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="tbl">
            <thead>
              <tr>
                <th>Anggota</th>
                <th>Paket</th>
                <th>Jumlah</th>
                <th>Tanggal</th>
                <th>Metode</th>
                <th>Keterangan</th>
                <th className="no-print">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {loading && (
                <tr>
                  <td colSpan={7} className="text-center py-10 text-brown-100">
                    Memuat…
                  </td>
                </tr>
              )}
              {!loading && filtered.length === 0 && (
                <tr>
                  <td colSpan={7} className="text-center py-12 text-brown-100">
                    <CreditCard size={32} className="mx-auto mb-2 opacity-30" />
                    Tidak ada transaksi
                  </td>
                </tr>
              )}
              {filtered.map((p, i) => (
                <tr key={p._id} className={`stagger-${(i % 6) + 1} animate-rise-in`}>
                  <td className="font-medium text-sm">{p.anggota?.nama ?? '—'}</td>
                  <td className="text-sm text-brown-500">{p.paket?.nama ?? '—'}</td>
                  <td className="font-semibold text-gold-600">{rupiah(p.jumlah)}</td>
                  <td className="text-sm text-brown-300">{tgl(p.tanggal)}</td>
                  <td>
                    <span className={p.metode === 'transfer' ? 'badge bg-blue-50 text-blue-600' : 'badge-gray'}>
                      {p.metode}
                    </span>
                  </td>
                  <td className="text-sm text-brown-300">{p.keterangan || '—'}</td>
                  <td className="no-print">
                    <div className="flex gap-1.5">
                      <button onClick={() => sendWA(p)} className="btn-ghost !h-8 !px-2.5 !text-emerald-600 hover:!bg-emerald-50 font-medium text-xs flex items-center gap-1" title="Kirim WA">
                        <MessageCircle size={14} /> WA
                      </button>
                      <button onClick={() => openEdit(p)} className="btn-ghost !h-8 !px-2.5">
                        <Pencil size={13} />
                      </button>
                      <button
                        onClick={() => setDelId(p._id)}
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
              {modal === 'add' ? 'Catat Pembayaran' : 'Edit Pembayaran'}
            </h2>
            <div className="space-y-4">
              <div>
                <label className="input-label">Anggota</label>
                <select
                  value={form.anggota}
                  onChange={e => setForm(v => ({ ...v, anggota: e.target.value }))}
                  className="input"
                >
                  <option value="">-- Pilih Anggota --</option>
                  {anggota.map(a => (
                    <option key={a._id} value={a._id}>{a.nama}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="input-label">Paket</label>
                <select
                  value={form.paket}
                  onChange={e => setForm(v => ({ ...v, paket: e.target.value }))}
                  className="input"
                >
                  <option value="">-- Pilih Paket --</option>
                  {paket.map(p => (
                    <option key={p._id} value={p._id}>
                      {p.nama} — {rupiah(p.harga)}
                    </option>
                  ))}
                </select>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="input-label">Jumlah (Rp)</label>
                  <input
                    type="number"
                    value={form.jumlah}
                    onChange={e => setForm(v => ({ ...v, jumlah: e.target.value }))}
                    className="input"
                    placeholder="100000"
                  />
                </div>
                <div>
                  <label className="input-label">Tanggal</label>
                  <input
                    type="date"
                    value={form.tanggal}
                    onChange={e => setForm(v => ({ ...v, tanggal: e.target.value }))}
                    className="input"
                  />
                </div>
              </div>
              <div>
                <label className="input-label">Metode</label>
                <select
                  value={form.metode}
                  onChange={e => setForm(v => ({ ...v, metode: e.target.value }))}
                  className="input"
                >
                  <option value="tunai">Tunai</option>
                  <option value="transfer">Transfer</option>
                </select>
              </div>
              <div>
                <label className="input-label">Keterangan</label>
                <input
                  value={form.keterangan}
                  onChange={e => setForm(v => ({ ...v, keterangan: e.target.value }))}
                  className="input"
                  placeholder="cth: Cicilan 1, Pelunasan…"
                />
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
            <p className="text-brown-500 mb-6">Yakin hapus pembayaran ini?</p>
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