import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import api, { authAPI } from '../api/auth'
import {
  LayoutDashboard, Users, Package, CreditCard, FileText,
  PiggyBank, TrendingUp, ArrowRight, CalendarDays, RefreshCw
} from 'lucide-react'

const Dashboard = ({ user }) => {
  const [profile, setProfile] = useState(null)
  const [loading, setLoading] = useState(true)

  const [ringkasan, setRingkasan] = useState({
    totalAnggota: 0,
    totalPaket: 0,
    totalTarget: 0,
    totalTerkumpul: 0,
    totalBebas: 0,
    lunas: 0,
    belumLunas: 0,
  })
  const [recentPayments, setRecentPayments] = useState([])

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [profileRes, rekapRes, payRes, tabunganRes, paketRes] = await Promise.all([
          authAPI.getProfile().catch(() => ({ user: null })),
          api.get('/pembayaran/rekap').catch(() => ({ data: { ringkasan: {} }})),
          api.get('/pembayaran').catch(() => ({ data: { data: [] }})),
          api.get('/tabungan-bebas').catch(() => ({ data: [] })),
          api.get('/paket').catch(() => ({ data: { count: 0 }})),
        ])
        
        setProfile(profileRes.user)
        
        const tabList = Array.isArray(tabunganRes) ? tabunganRes : (Array.isArray(tabunganRes?.data) ? tabunganRes.data : []);
        const sumTabungan = tabList.reduce((sum, t) => sum + (t.jumlah || 0), 0);
        const summary = rekapRes.data?.ringkasan || {}
        setRingkasan({
          totalAnggota: summary.totalAnggota || 0,
          totalPaket: paketRes.data?.count || 0,
          totalTarget: summary.totalTagihan || 0,
          totalTerkumpul: summary.totalTerkumpul || 0,
          totalBebas: sumTabungan,
          lunas: summary.jumlahLunas || 0,
          belumLunas: (summary.totalAnggota || 0) - (summary.jumlahLunas || 0),
        })
        
        const pays = Array.isArray(payRes?.data?.data) ? payRes.data.data : []
        setRecentPayments(pays.slice(0, 5).map(p => ({
          id: p._id,
          nama: p.anggota?.nama || 'Unknown',
          paket: p.paket?.nama || '-',
          jumlah: p.jumlah,
          tanggal: p.tanggal,
          metode: p.metode
        })))
      } catch (err) {
        console.error('Failed to fetch dashboard data:', err)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  const userData = profile || user



  const rupiah = (n) =>
    new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(n)

  const tgl = (d) =>
    new Date(d).toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' })

  const pctCollected = ringkasan.totalTarget > 0 ? Math.round((ringkasan.totalTerkumpul / ringkasan.totalTarget) * 100) : 0

  const statCards = [
    { label: 'Total Anggota', value: ringkasan.totalAnggota, sub: 'orang terdaftar', icon: Users, color: 'text-blue-600', bg: 'bg-blue-50' },
    { label: 'Paket Tersedia', value: ringkasan.totalPaket, sub: 'jenis paket', icon: Package, color: 'text-emerald-600', bg: 'bg-emerald-50' },
    { label: 'Total Terkumpul', value: rupiah(ringkasan.totalTerkumpul), sub: `${pctCollected}% dari target`, icon: TrendingUp, color: 'text-gold-600', bg: 'bg-gold-100' },
    { label: 'Nabung Bebas', value: rupiah(ringkasan.totalBebas), sub: 'tabungan bebas', icon: PiggyBank, color: 'text-purple-600', bg: 'bg-purple-50' },
  ]

  const quickLinks = [
    { label: 'Anggota', desc: 'Kelola data anggota', icon: Users, to: '/anggota', color: 'text-blue-600' },
    { label: 'Paket', desc: 'Atur paket lebaran', icon: Package, to: '/paket', color: 'text-emerald-600' },
    { label: 'Pembayaran', desc: 'Catat pembayaran', icon: CreditCard, to: '/pembayaran', color: 'text-gold-600' },
    { label: 'Nabung Bebas', desc: 'Tabungan bebas', icon: PiggyBank, to: '/nabung-bebas', color: 'text-purple-600' },
    { label: 'Laporan', desc: 'Lihat rekap laporan', icon: FileText, to: '/laporan', color: 'text-red-500' },
  ]

  const greeting = () => {
    const h = new Date().getHours()
    if (h < 12) return 'Selamat Pagi'
    if (h < 15) return 'Selamat Siang'
    if (h < 18) return 'Selamat Sore'
    return 'Selamat Malam'
  }

  return (
    <div className="space-y-6 animate-rise-in">
      {/* Hero greeting */}
      <div className="card bg-gradient-to-br from-cream-50 via-gold-100/60 to-cream-200 border-gold-200/50">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <p className="text-sm text-brown-300 font-medium flex items-center gap-1.5">
              <LayoutDashboard size={14} />
              Dashboard
            </p>
            <h1 className="font-display text-2xl sm:text-3xl font-bold text-brown-700 mt-1">
              {greeting()}, {userData?.name?.split(' ')[0] || 'User'} 👋
            </h1>
            <p className="text-brown-300 mt-1 text-sm">
              Berikut ringkasan data Paket Lebaran hari ini
            </p>
          </div>
          <div className="text-right hidden sm:block">
            <p className="text-xs text-brown-100 uppercase tracking-wider font-medium">Hari ini</p>
            <p className="font-display text-lg font-semibold text-brown-700">
              {new Date().toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
            </p>
          </div>
        </div>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((s, i) => (
          <div key={i} className={`card hover:-translate-y-0.5 transition-transform duration-200 stagger-${i + 1} animate-rise-in`}>
            <div className="flex items-start justify-between mb-3">
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

      {/* Target progress */}
      <div className="card">
        <div className="flex items-center justify-between mb-3">
          <div>
            <h2 className="font-display text-lg font-semibold text-brown-700">Progress Target</h2>
            <p className="text-sm text-brown-300 mt-0.5">
              {rupiah(ringkasan.totalTerkumpul)} dari {rupiah(ringkasan.totalTarget)}
            </p>
          </div>
          <div className="text-right">
            <span className="badge-gold text-sm font-semibold">{pctCollected}%</span>
          </div>
        </div>
        <div className="w-full h-3 bg-cream-200 rounded-full overflow-hidden">
          <div
            className="h-full rounded-full bg-gold-btn transition-all duration-700 ease-out"
            style={{ width: `${pctCollected}%` }}
          />
        </div>
        <div className="flex justify-between mt-2 text-xs text-brown-100">
          <span>{ringkasan.lunas} anggota lunas</span>
          <span>{ringkasan.belumLunas} belum lunas</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Payments */}
        <div className="lg:col-span-2 card !p-0 overflow-hidden">
          <div className="px-5 py-4 border-b border-gold-200/30 flex items-center justify-between">
            <h2 className="font-display text-lg font-semibold text-brown-700">Pembayaran Terakhir</h2>
            <Link to="/pembayaran" className="text-xs text-gold-600 hover:text-gold-700 font-medium flex items-center gap-1">
              Lihat Semua <ArrowRight size={12} />
            </Link>
          </div>
          <div className="overflow-x-auto">
            <table className="tbl">
              <thead>
                <tr>
                  <th>Nama</th>
                  <th>Paket</th>
                  <th>Jumlah</th>
                  <th>Tanggal</th>
                  <th>Metode</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan={5} className="text-center py-8 text-brown-100">
                      <RefreshCw size={18} className="mx-auto mb-2 animate-spin opacity-40" />
                      Memuat data…
                    </td>
                  </tr>
                ) : (
                  recentPayments.map(p => (
                    <tr key={p.id}>
                      <td className="font-medium text-sm">{p.nama}</td>
                      <td className="text-sm text-brown-300">{p.paket}</td>
                      <td className="font-semibold text-gold-600 text-sm">{rupiah(p.jumlah)}</td>
                      <td className="text-sm text-brown-300">{tgl(p.tanggal)}</td>
                      <td>
                        <span className={p.metode === 'transfer' ? 'badge bg-blue-50 text-blue-600' : 'badge-gray'}>
                          {p.metode}
                        </span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Quick Links */}
        <div className="card">
          <h2 className="font-display text-lg font-semibold text-brown-700 mb-4">Menu Cepat</h2>
          <div className="space-y-2">
            {quickLinks.map((link, i) => (
              <Link
                key={i}
                to={link.to}
                className="flex items-center gap-3 p-3 rounded-xl hover:bg-cream-200/60 transition-colors group"
              >
                <div className="w-9 h-9 rounded-lg bg-cream-200 flex items-center justify-center flex-shrink-0 group-hover:scale-105 transition-transform">
                  <link.icon size={16} className={link.color} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-brown-700">{link.label}</p>
                  <p className="text-xs text-brown-100">{link.desc}</p>
                </div>
                <ArrowRight size={14} className="text-brown-100 group-hover:text-brown-300 transition-colors flex-shrink-0" />
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Dashboard