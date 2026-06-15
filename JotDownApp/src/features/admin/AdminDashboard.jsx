import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { adminApi } from './adminApi'

const STATUS_BADGE = {
  active:   'badge-active',
  inactive: 'badge-inactive',
  locked:   'badge-banned',
  banned:   'badge-banned',
}
const STATUS_LABEL = { active: 'Hoạt động', inactive: 'Không HĐ', locked: 'Bị khóa', banned: 'Bị khóa' }

function MiniBarChart({ bars, color }) {
  if (!bars || bars.length === 0) return null
  const max = Math.max(...bars, 1) // Prevent division by zero
  return (
    <div className="flex h-8 w-16 flex-shrink-0 items-end justify-end gap-[2px]">
      {bars.map((val, i) => (
        <div
          key={i}
          className={`w-1.5 rounded-sm opacity-70 transition-all ${color.replace('bg-', 'bg-')}`}
          style={{ height: `${(val / max) * 100}%` }}
        />
      ))}
    </div>
  )
}

function StatCard({ stat }) {
  const valueClass = stat.wide
    ? 'break-words text-xl font-extrabold leading-tight text-slate-900 sm:text-2xl dark:text-white'
    : 'truncate text-xl font-extrabold text-slate-900 sm:text-2xl dark:text-white'

  const content = (
    <div className="flex min-h-[124px] items-center justify-between gap-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-card transition-all duration-200 hover:shadow-card-hover dark:border-slate-700 dark:bg-slate-800">
      <div className="flex items-center gap-4 flex-1 min-w-0">
        <div className={`w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0 ${stat.color}`}>
          {stat.icon}
        </div>
        <div className="min-w-0">
          <p className={valueClass} title={String(stat.value)}>{stat.value}</p>
          <p className="truncate text-xs font-medium text-slate-500 dark:text-slate-400" title={stat.label}>{stat.label}</p>
          <p className={`text-xs mt-0.5 font-semibold ${stat.trend === 'alert' ? 'text-red-500' : stat.trend === 'up' ? 'text-emerald-500' : 'text-slate-400'}`}>
            {stat.trend === 'up' ? '↑ ' : stat.trend === 'alert' ? '⚠ ' : ''}{stat.delta}
          </p>
        </div>
      </div>
      <MiniBarChart bars={stat.bars} color={stat.color} />
    </div>
  )

  return stat.link ? <Link to={stat.link} className="block min-w-0">{content}</Link> : content
}

export default function AdminDashboard() {
  const [stats, setStats] = useState(null)
  const [recentUsers, setRecentUsers] = useState([])
  const [recentPayments, setRecentPayments] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true)
        const [statsRes, usersRes, paymentsRes] = await Promise.all([
          adminApi.getDashboardStats(),
          adminApi.getUsers({ per_page: 4 }),
          adminApi.getPayments({ per_page: 4 })
        ])
        
        setStats(statsRes)
        setRecentUsers(usersRes.data || [])
        setRecentPayments(paymentsRes.data || [])
      } catch (err) {
        console.error('Failed to load dashboard data', err)
      } finally {
        setLoading(false)
      }
    }

    fetchDashboardData()
  }, [])

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-500"></div>
      </div>
    )
  }

  const formatNumber = (num) => new Intl.NumberFormat('vi-VN').format(num || 0)
  const formatCurrency = (amount) => new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount || 0)

  const STATS_CARDS = [
    {
      label: 'Tổng người dùng', value: formatNumber(stats?.total_users), delta: 'Cập nhật hôm nay', trend: 'neutral', color: 'bg-blue-500',
      icon: (
        <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
      ),
      bars: [40, 55, 48, 62, 70, 65, 80],
    },
    {
      label: 'Tổng ghi chú', value: formatNumber(stats?.notes), delta: 'Cập nhật hôm nay', trend: 'neutral', color: 'bg-emerald-500',
      icon: (
        <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
      ),
      bars: [60, 70, 75, 68, 85, 90, 95],
    },
    {
      label: 'Tài khoản Premium', value: formatNumber(stats?.premium_users), delta: 'Cập nhật hôm nay', trend: 'neutral', color: 'bg-amber-500',
      icon: (
        <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
        </svg>
      ),
      bars: [20, 25, 28, 30, 32, 35, 38],
    },
    {
      label: 'Doanh thu', value: formatCurrency(stats?.revenue), delta: 'Cập nhật hôm nay', trend: 'neutral', color: 'bg-indigo-500', wide: true,
      icon: (
        <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      bars: [50, 58, 62, 55, 70, 75, 80],
    },
    {
      label: 'Báo cáo chờ duyệt', value: formatNumber(stats?.unresolved_reports), delta: stats?.unresolved_reports > 0 ? 'Cần xử lý ngay' : 'Không có báo cáo mới', trend: stats?.unresolved_reports > 0 ? 'alert' : 'neutral', color: stats?.unresolved_reports > 0 ? 'bg-red-500' : 'bg-slate-400',
      icon: (
        <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
        </svg>
      ),
      bars: [5, 3, 7, 2, 4, 6, 3],
      link: '/admin/reports',
    },
    {
      label: 'Workspace', value: formatNumber(stats?.workspaces), delta: 'Cập nhật hôm nay', trend: 'neutral', color: 'bg-cyan-500',
      icon: (
        <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
        </svg>
      ),
      bars: [60, 65, 70, 75, 80, 78, 85],
    },
  ]

  return (
    <div className="w-full space-y-6">
      {/* Title */}
      <div>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Tổng quan hệ thống</h1>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
          Xem nhanh các chỉ số quan trọng của JotDown.
        </p>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
        {STATS_CARDS.map((s, i) => <StatCard key={i} stat={s} />)}
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { label: 'Thêm gói mới', to: '/admin/plans', icon: '📦', color: 'from-blue-500/10 to-blue-500/5 border-blue-200 dark:border-blue-800 text-blue-700 dark:text-blue-400' },
          { label: 'Duyệt thanh toán', to: '/admin/payments', icon: '💳', color: 'from-emerald-500/10 to-emerald-500/5 border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-400' },
          { label: 'Xử lý báo cáo', to: '/admin/reports', icon: '🚨', color: 'from-red-500/10 to-red-500/5 border-red-200 dark:border-red-800 text-red-700 dark:text-red-400' },
          { label: 'Xem nhật ký', to: '/admin/activity-logs', icon: '📋', color: 'from-slate-500/10 to-slate-500/5 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-400' },
        ].map((action) => (
          <Link
            key={action.to}
            to={action.to}
            className={`flex flex-col items-center gap-2 p-4 rounded-2xl border bg-gradient-to-br ${action.color} hover:scale-[1.02] transition-transform`}
          >
            <span className="text-2xl">{action.icon}</span>
            <span className="text-xs font-semibold text-center">{action.label}</span>
          </Link>
        ))}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        {/* Recent users */}
        <div className="rounded-3xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 shadow-card overflow-hidden">
          <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100 dark:border-slate-700">
            <h2 className="text-sm font-semibold text-slate-900 dark:text-white">Người dùng mới nhất</h2>
            <Link to="/admin/users" className="text-xs text-primary-500 hover:underline cursor-pointer">Xem tất cả →</Link>
          </div>
          <div className="divide-y divide-slate-100 dark:divide-slate-700">
            {recentUsers.length > 0 ? recentUsers.map((u, i) => (
              <div key={i} className="flex items-center gap-3 px-5 py-3">
                <div className="w-8 h-8 rounded-full bg-primary-100 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400 font-bold text-sm flex items-center justify-center flex-shrink-0 uppercase">
                  {u.display_name?.charAt(0) || u.email?.charAt(0) || '?'}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-slate-900 dark:text-white truncate">{u.display_name || 'No Name'}</p>
                  <p className="text-xs text-slate-400 truncate">{u.email}</p>
                </div>
                <div className="flex items-center gap-1.5 flex-shrink-0">
                  <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${u.plan?.price > 0 ? 'badge-premium' : 'badge-free'}`}>{u.plan?.name || 'Free'}</span>
                  <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${STATUS_BADGE[u.status] || 'badge-inactive'}`}>{STATUS_LABEL[u.status] || u.status}</span>
                </div>
              </div>
            )) : (
              <div className="p-5 text-center text-sm text-slate-500">Chưa có dữ liệu</div>
            )}
          </div>
        </div>

        {/* Recent payments */}
        <div className="rounded-3xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 shadow-card overflow-hidden">
          <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100 dark:border-slate-700">
            <h2 className="text-sm font-semibold text-slate-900 dark:text-white">Giao dịch gần đây</h2>
            <Link to="/admin/payments" className="text-xs text-primary-500 hover:underline cursor-pointer">Xem tất cả →</Link>
          </div>
          <div className="divide-y divide-slate-100 dark:divide-slate-700">
            {recentPayments.length > 0 ? recentPayments.map((p, i) => (
              <div key={i} className="flex items-center gap-3 px-5 py-3">
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-slate-900 dark:text-white truncate">{p.user?.display_name || p.user?.email || 'Unknown User'}</p>
                  <p className="text-xs text-slate-400">{p.plan?.name || 'Unknown Plan'} · {new Date(p.created_at || p.CreatedTime).toLocaleDateString('vi-VN')}</p>
                </div>
                <div className="flex items-center gap-2 flex-shrink-0">
                  <span className="text-sm font-semibold text-slate-700 dark:text-slate-300">{formatCurrency(p.amount)}</span>
                  <span className={`text-xs px-2 py-0.5 rounded-full font-medium
                    ${p.status === 'confirmed' ? 'badge-success' : p.status === 'pending' ? 'badge-pending' : 'badge-failed'}`}>
                    {p.status === 'confirmed' ? 'Thành công' : p.status === 'pending' ? 'Chờ duyệt' : 'Thất bại'}
                  </span>
                </div>
              </div>
            )) : (
              <div className="p-5 text-center text-sm text-slate-500">Chưa có dữ liệu</div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

