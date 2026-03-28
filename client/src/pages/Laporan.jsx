import { useState, useEffect } from 'react'
import { Printer, FileText } from 'lucide-react'

export default function Laporan() {
  const [rekap, setRekap] = useState(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    fetchRekap()
  }, [])

  const fetchRekap = async () => {
    setLoading(true)
    try {
      // Simulasi data rekap
      const mockRekap = {
        ringkasan: {
          totalAnggota: 3,
          totalTagihan: 2250000,
          totalTerkumpul: 1250000,
          jumlahLunas: 1
        },
        data: [
          {
            anggota: { _id: '1', nama: 'Budi Santoso' },
            paket: { nama: 'Paket Silver' },
            harga: 500000,
            terkumpul: 500000,
            sisa: 0,
            persen: 100,
            status: 'Lunas'
          },
          {
            anggota: { _id: '2', nama: 'Siti Rahayu' },
            paket: { nama: 'Paket Gold' },
            harga: 750000,
            terkumpul: 250000,
            sisa: 500000,
            persen: 33,
            status: 'Belum Lunas'
          },
          {
            anggota: { _id: '3', nama: 'Ahmad Wijaya' },
            paket: { nama: 'Paket Platinum' },
            harga: 1000000,
            terkumpul: 500000,
            sisa: 500000,
            persen: 50,
            status: 'Belum Lunas'
          }
        ]
      }
      setRekap(mockRekap)
    } catch (error) {
      console.error('Error fetching rekap:', error)
    } finally {
      setLoading(false)
    }
  }

  const ring = rekap?.ringkasan ?? {}
  const rows = rekap?.data ?? []

  const rupiah = (amount) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(amount)
  }

  const pct = (value, total) => {
    if (!total) return 0
    return Math.round((value / total) * 100)
  }

  return (
    <div className="space-y-5 animate-rise-in">
      <div className="page-header flex items-start justify-between gap-4">
        <div>
          <h1 className="page-title">Laporan</h1>
          <p className="page-sub">Rekap status pembayaran per anggota</p>
        </div>
        <button
          onClick={() => window.print()}
          className="btn-secondary no-print flex-shrink-0"
        >
          <Printer size={16} />Cetak Laporan
        </button>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 no-print">
        {[
          {
            label: 'Total Anggota',
            value: ring.totalAnggota ?? 0,
            sub: 'terdaftar'
          },
          {
            label: 'Total Tagihan',
            value: rupiah(ring.totalTagihan ?? 0),
            sub: 'keseluruhan'
          },
          {
            label: 'Total Terkumpul',
            value: rupiah(ring.totalTerkumpul ?? 0),
            sub: `${pct(ring.totalTerkumpul ?? 0, ring.totalTagihan || 1)}% dari target`
          },
          {
            label: 'Sudah Lunas',
            value: `${ring.jumlahLunas ?? 0} orang`,
            sub: `${(ring.totalAnggota ?? 0) - (ring.jumlahLunas ?? 0)} belum lunas`
          }
        ].map((s, i) => (
          <div key={i} className={`card stagger-${i + 1} animate-rise-in`}>
            <p className="text-[11px] uppercase tracking-wider text-brown-300 font-medium mb-1">
              {s.label}
            </p>
            <p className="font-display text-xl font-semibold text-brown-700 leading-tight">
              {s.value}
            </p>
            <p className="text-xs text-brown-100 mt-0.5">{s.sub}</p>
          </div>
        ))}
      </div>

      <div className="card !p-0 overflow-hidden">
        <div className="hidden print:block px-6 py-5 border-b border-gray-200">
          <h2 className="text-xl font-bold">Laporan Paket Lebaran — Pilar</h2>
          <p className="text-sm text-gray-500 mt-1">
            Dicetak: {new Date().toLocaleDateString('id-ID', {
              day: '2-digit',
              month: 'long',
              year: 'numeric'
            })}
          </p>
        </div>
        <div className="overflow-x-auto">
          <table className="tbl">
            <thead>
              <tr>
                <th>No</th>
                <th>Nama Anggota</th>
                <th>Paket</th>
                <th>Harga</th>
                <th>Terkumpul</th>
                <th>Sisa</th>
                <th>Progress</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {loading && (
                <tr>
                  <td colSpan={8} className="text-center py-10 text-brown-100">
                    Memuat data dari server…
                  </td>
                </tr>
              )}
              {rows.map((r, i) => (
                <tr key={r.anggota._id}>
                  <td className="text-brown-300 text-center">{i + 1}</td>
                  <td className="font-medium">{r.anggota.nama}</td>
                  <td className="text-sm text-brown-500">{r.paket?.nama ?? '—'}</td>
                  <td className="text-sm">{r.harga ? rupiah(r.harga) : '—'}</td>
                  <td className="font-semibold text-gold-600">{rupiah(r.terkumpul)}</td>
                  <td className={`text-sm ${r.sisa > 0 ? 'text-red-500' : 'text-brown-300'}`}>
                    {r.harga ? rupiah(r.sisa) : '—'}
                  </td>
                  <td className="min-w-[80px]">
                    {r.harga > 0 && (
                      <div className="flex items-center gap-2">
                        <div className="flex-1 h-1.5 bg-cream-200 rounded-full overflow-hidden">
                          <div
                            className="h-full rounded-full bg-gold-btn"
                            style={{ width: `${r.persen}%` }}
                          />
                        </div>
                        <span className="text-[11px] text-brown-300 flex-shrink-0">
                          {r.persen}%
                        </span>
                      </div>
                    )}
                  </td>
                  <td>
                    <span className={r.status === 'Lunas' ? 'badge-green' : r.status === '-' ? 'badge-gray' : 'badge-red'}>
                      {r.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr className="border-t-2 border-gold-200/60 bg-cream-100">
                <td colSpan={3} className="px-4 py-3 font-semibold text-brown-700 text-sm">
                  Total
                </td>
                <td className="px-4 py-3 font-semibold text-sm">
                  {rupiah(ring.totalTagihan ?? 0)}
                </td>
                <td className="px-4 py-3 font-semibold text-gold-600">
                  {rupiah(ring.totalTerkumpul ?? 0)}
                </td>
                <td className="px-4 py-3 font-semibold text-red-500">
                  {rupiah(Math.max(0, (ring.totalTagihan ?? 0) - (ring.totalTerkumpul ?? 0)))}
                </td>
                <td className="px-4 py-3 text-sm text-brown-300">
                  {pct(ring.totalTerkumpul ?? 0, ring.totalTagihan || 1)}%
                </td>
                <td className="px-4 py-3 text-sm text-brown-300">
                  {ring.jumlahLunas ?? 0} lunas
                </td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>

      <p className="text-xs text-brown-100 text-center no-print">
        <FileText size={12} className="inline mr-1" />
        Data dari MongoDB Atlas · Gunakan tombol Cetak untuk ekspor PDF
      </p>
    </div>
  )
}