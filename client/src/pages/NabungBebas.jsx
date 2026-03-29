import { useState, useEffect } from 'react'
import { Plus, Search, Pencil, Trash2, PiggyBank, TrendingUp, Wallet, Printer, MessageCircle } from 'lucide-react'
import api from '../api/auth'

const EMPTY = { anggota: '', jumlah: '', tanggal: new Date().toISOString().slice(0, 10), keterangan: '' }

export default function NabungBebas() {
  const [tabungan, setTabungan] = useState([])
  const [anggotaList, setAnggotaList] = useState([])
  const [loading, setLoading] = useState(false)
  const [q, setQ] = useState('')
  const [modal, setModal] = useState(null)
  const [editing, setEditing] = useState(null)
  const [form, setForm] = useState(EMPTY)
  const [delId, setDelId] = useState(null)
  const [filterDate, setFilterDate] = useState('')

  useEffect(() => { fetchData() }, [])

  const fetchData = async () => {
    setLoading(true)
    try {
      const [resAnggota, resTabungan] = await Promise.all([
        api.get('/anggota').catch(() => ({ data: { data: [] } })),
        api.get('/tabungan-bebas').catch(() => ({ data: [] }))
      ])

      const anggotaData = resAnggota?.data?.data || resAnggota?.data || []
      const tabunganData = Array.isArray(resTabungan) ? resTabungan : (Array.isArray(resTabungan?.data) ? resTabungan.data : [])

      setAnggotaList(anggotaData)
      setTabungan(tabunganData)
    } catch (error) {
      console.error('Error fetching data:', error)
    } finally {
      setLoading(false)
    }
  }

  const filtered = [...tabungan]
    .sort((a, b) => new Date(b.tanggal) - new Date(a.tanggal))
    .filter(t => !q || t.anggota?.nama?.toLowerCase().includes(q.toLowerCase()))
    .filter(t => !filterDate || (t.tanggal && t.tanggal.startsWith(filterDate)))

  // Per-anggota summary
  const perAnggota = {}
  tabungan.forEach(t => {
    const id = t.anggota?._id
    if (!id) return
    if (!perAnggota[id]) perAnggota[id] = { nama: t.anggota.nama, total: 0, count: 0 }
    perAnggota[id].total += t.jumlah
    perAnggota[id].count += 1
  })
  const topSavers = Object.values(perAnggota).sort((a, b) => b.total - a.total).slice(0, 5)

  const totalTabungan = tabungan.reduce((s, t) => s + t.jumlah, 0)
  const totalTransaksi = tabungan.length
  const rataRata = totalTransaksi > 0 ? Math.round(totalTabungan / totalTransaksi) : 0

  function openAdd() {
    setForm(EMPTY)
    setModal('add')
  }
  function openEdit(t) {
    setEditing(t)
    setForm({
      anggota: t.anggota?._id ?? t.anggota,
      jumlah: t.jumlah,
      tanggal: t.tanggal?.slice?.(0, 10) ?? t.tanggal,
      keterangan: t.keterangan,
    })
    setModal('edit')
  }
  function closeModal() {
    setModal(null)
    setEditing(null)
  }

  async function handleSave() {
    if (!form.anggota || !form.jumlah) return
    const data = { ...form, jumlah: Number(form.jumlah) }

    try {
      if (modal === 'add') {
        await api.post('/tabungan-bebas', data)
      } else {
        await api.put(`/tabungan-bebas/${editing._id}`, data)
      }
      fetchData()
      closeModal()
    } catch (error) {
      console.error('Error saving data:', error)
      alert(error.message || 'Gagal menyimpan tabungan')
    }
  }

  const handleDelete = async () => {
    if (delId) {
      try {
        await api.delete(`/tabungan-bebas/${delId}`)
        fetchData()
        setDelId(null)
      } catch (error) {
        console.error('Error deleting data:', error)
        alert('Gagal menghapus tabungan')
      }
    }
  }

  const rupiah = (n) =>
    new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(n)

  const tgl = (d) =>
    new Date(d).toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' })

  const sendWA = (t) => {
    let finalPhone = ''
    if (t.anggota?.telepon) {
      const phone = t.anggota.telepon.replace(/\D/g, '')
      finalPhone = phone.startsWith('0') ? '62' + phone.slice(1) : phone
    }
    
    const currentAnggotaId = t.anggota._id
    const accumulated = tabungan
      .filter(item => item.anggota?._id === currentAnggotaId && new Date(item.tanggal) <= new Date(t.tanggal))
      .reduce((sum, item) => sum + item.jumlah, 0)
    
    const msg = `Assalamualaikum Bp/Ibu/Sdr. ${t.anggota.nama}\n\nIjin menginformasikan Saldo tabungan Bp/Ibu/Sdr. s.d tanggal ${tgl(t.tanggal)} adalah *${rupiah(accumulated)}*.\n\nTerima kasih.\nWaalaikum Salam Warahmatullah Wb,\nPengelola Tabungan,\nNia Kurniawati`
    
    const url = finalPhone 
      ? `https://wa.me/${finalPhone}?text=${encodeURIComponent(msg)}`
      : `https://wa.me/?text=${encodeURIComponent(msg)}`
      
    window.open(url, '_blank')
  }

  return (
    <div className="space-y-5 animate-rise-in">
      {/* Header */}
      <div className="page-header flex items-start justify-between gap-4 no-print">
        <div>
          <h1 className="page-title">Nabung Bebas</h1>
          <p className="page-sub">Tabungan bebas tanpa terikat paket</p>
        </div>
        <div className="flex gap-2">
          <button onClick={() => window.print()} className="btn-secondary flex-shrink-0">
            <Printer size={16} />Cetak PDF
          </button>
          <button onClick={openAdd} className="btn-primary btn-shimmer flex-shrink-0">
            <Plus size={16} />Catat Tabungan
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
        {[
          { label: 'Total Tabungan', value: rupiah(totalTabungan), sub: `${totalTransaksi} transaksi`, icon: PiggyBank, bg: 'bg-purple-50', color: 'text-purple-600' },
          { label: 'Rata-rata Nabung', value: rupiah(rataRata), sub: 'per transaksi', icon: TrendingUp, bg: 'bg-emerald-50', color: 'text-emerald-600' },
          { label: 'Penabung Aktif', value: `${Object.keys(perAnggota).length} orang`, sub: 'sudah menabung', icon: Wallet, bg: 'bg-blue-50', color: 'text-blue-600' },
        ].map((s, i) => (
          <div key={i} className={`card stagger-${i + 1} animate-rise-in`}>
            <div className="flex items-start justify-between mb-2">
              <p className="text-[11px] uppercase tracking-wider text-brown-300 font-medium">{s.label}</p>
              <div className={`w-8 h-8 rounded-lg ${s.bg} flex items-center justify-center flex-shrink-0`}>
                <s.icon size={16} className={s.color} />
              </div>
            </div>
            <p className="font-display text-xl font-semibold text-brown-700 leading-tight">{s.value}</p>
            <p className="text-xs text-brown-100 mt-0.5">{s.sub}</p>
          </div>
        ))}
      </div>

      {/* Search */}
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

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Table */}
        <div className="lg:col-span-2 card !p-0 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="tbl">
              <thead>
                <tr>
                  <th>Anggota</th>
                  <th>Jumlah</th>
                  <th>Tanggal</th>
                  <th>Keterangan</th>
                  <th className="no-print">Aksi</th>
                </tr>
              </thead>
              <tbody>
                {loading && (
                  <tr>
                    <td colSpan={5} className="text-center py-10 text-brown-100">Memuat…</td>
                  </tr>
                )}
                {!loading && filtered.length === 0 && (
                  <tr>
                    <td colSpan={5} className="text-center py-12 text-brown-100">
                      <PiggyBank size={32} className="mx-auto mb-2 opacity-30" />
                      Belum ada catatan tabungan
                    </td>
                  </tr>
                )}
                {filtered.map(t => (
                  <tr key={t._id}>
                    <td className="font-medium text-sm">{t.anggota?.nama ?? '—'}</td>
                    <td className="font-semibold text-purple-600">{rupiah(t.jumlah)}</td>
                    <td className="text-sm text-brown-300">{tgl(t.tanggal)}</td>
                    <td className="text-sm text-brown-300">{t.keterangan || '—'}</td>
                    <td className="no-print">
                      <div className="flex gap-1.5">
                        <button onClick={() => sendWA(t)} className="btn-ghost !h-8 !px-2.5 !text-emerald-600 hover:!bg-emerald-50 font-medium text-xs flex items-center gap-1" title="Kirim WA">
                          <MessageCircle size={14} /> WA
                        </button>
                        <button onClick={() => openEdit(t)} className="btn-ghost !h-8 !px-2.5">
                          <Pencil size={13} />
                        </button>
                        <button
                          onClick={() => setDelId(t._id)}
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

        {/* Top Savers Sidebar */}
        <div className="card">
          <h3 className="font-display text-lg font-semibold text-brown-700 mb-4">🏆 Top Penabung</h3>
          <div className="space-y-3">
            {topSavers.map((s, i) => (
              <div key={i} className="flex items-center gap-3 p-2.5 rounded-xl bg-cream-100/60">
                <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 ${
                  i === 0 ? 'bg-gold-btn text-white' : i === 1 ? 'bg-gray-300 text-white' : i === 2 ? 'bg-amber-700 text-white' : 'bg-cream-200 text-brown-300'
                }`}>
                  {i + 1}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-brown-700 truncate">{s.nama}</p>
                  <p className="text-xs text-brown-100">{s.count} transaksi</p>
                </div>
                <p className="text-sm font-semibold text-purple-600 flex-shrink-0">{rupiah(s.total)}</p>
              </div>
            ))}
            {topSavers.length === 0 && (
              <p className="text-sm text-brown-100 text-center py-4">Belum ada data</p>
            )}
          </div>
        </div>
      </div>

      {/* Modal */}
      {modal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
          <div className="bg-cream-50 rounded-2xl shadow-card-lg w-full max-w-md p-6 animate-rise-in">
            <h2 className="font-display text-xl font-semibold text-brown-700 mb-4">
              {modal === 'add' ? 'Catat Tabungan Bebas' : 'Edit Tabungan'}
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
                  {anggotaList.map(a => (
                    <option key={a._id} value={a._id}>{a.nama}</option>
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
                    placeholder="50000"
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
                <label className="input-label">Keterangan</label>
                <input
                  value={form.keterangan}
                  onChange={e => setForm(v => ({ ...v, keterangan: e.target.value }))}
                  className="input"
                  placeholder="cth: Nabung mingguan, nabung harian…"
                />
              </div>
              <div className="flex gap-3 pt-6">
                <button onClick={closeModal} className="btn-secondary flex-1">Batal</button>
                <button onClick={handleSave} className="btn-primary btn-shimmer flex-1">Simpan</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Confirm Dialog */}
      {delId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
          <div className="bg-cream-50 rounded-2xl shadow-card p-6 max-w-sm w-full animate-rise-in">
            <h3 className="font-display text-lg font-semibold text-brown-700 mb-3">Konfirmasi Hapus</h3>
            <p className="text-brown-500 mb-6">Yakin hapus catatan tabungan ini?</p>
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
