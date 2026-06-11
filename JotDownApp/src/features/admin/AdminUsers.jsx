import { useState, useEffect } from 'react'
import ConfirmModal from '../../components/common/ConfirmModal'
import { useToast } from '../../components/common/Toast'
import { adminApi } from './adminApi'

const STATUS_OPTIONS = ['all', 'active', 'inactive', 'locked']
const STATUS_LABEL = { all: 'Tất cả', active: 'Hoạt động', inactive: 'Không hoạt động', locked: 'Bị khóa' }

const STATUS_BADGE = {
  active:   { cls: 'badge-active',   label: 'Hoạt động' },
  inactive: { cls: 'badge-inactive', label: 'Không HĐ' },
  locked:   { cls: 'badge-banned',   label: 'Bị khóa' },
  banned:   { cls: 'badge-banned',   label: 'Bị khóa' },
}

// User Detail Drawer
function UserDrawer({ user, onClose, onBan, onUnban, loadingDetails }) {
  if (!user) return null
  const formatDate = (d) => d ? new Date(d).toLocaleDateString('vi-VN') : '—'

  return (
    <div className="fixed inset-0 z-40 flex justify-end" onClick={onClose}>
      <div
        className="w-full max-w-sm bg-white dark:bg-slate-800 h-full shadow-2xl flex flex-col animate-slide-in overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-200 dark:border-slate-700">
          <h2 className="text-base font-bold text-slate-900 dark:text-white">Chi tiết người dùng</h2>
          <button type="button" onClick={onClose} className="p-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-400 cursor-pointer">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {loadingDetails ? (
          <div className="flex-1 flex items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-500"></div>
          </div>
        ) : (
          <>
            {/* Avatar + Name */}
            <div className="flex flex-col items-center gap-3 px-5 py-6 border-b border-slate-100 dark:border-slate-700">
              <div className="w-16 h-16 rounded-full bg-primary-100 dark:bg-primary-900/40 text-primary-600 dark:text-primary-400 font-extrabold text-2xl flex items-center justify-center uppercase">
                {user.display_name?.charAt(0) || user.email?.charAt(0) || '?'}
              </div>
              <div className="text-center">
                <p className="text-lg font-bold text-slate-900 dark:text-white">{user.display_name || 'No Name'}</p>
                <p className="text-sm text-slate-400">{user.email}</p>
                <div className="flex items-center justify-center gap-2 mt-2">
                  <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${STATUS_BADGE[user.status]?.cls || 'badge-inactive'}`}>
                    {STATUS_BADGE[user.status]?.label || user.status}
                  </span>
                  <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${user.plan?.price > 0 ? 'badge-premium' : 'badge-free'}`}>
                    {user.plan?.name || 'Free'}
                  </span>
                  {user.role === 'admin' && (
                    <span className="text-xs px-2.5 py-1 rounded-full font-medium bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-300">
                      Admin
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Info rows */}
            <div className="px-5 py-4 space-y-3 flex-1">
              {[
                { label: 'Email xác minh', value: user.email_verified_at ? `✓ ${formatDate(user.email_verified_at)}` : '✗ Chưa xác minh', ok: !!user.email_verified_at },
                { label: 'Đăng nhập cuối', value: formatDate(user.last_login_at) },
                { label: 'Ngày tham gia', value: formatDate(user.CreatedTime || user.created_at) },
                { label: 'ID', value: `#${user.Id || user.id}` },
              ].map((row) => (
                <div key={row.label} className="flex justify-between text-sm">
                  <span className="text-slate-500 dark:text-slate-400">{row.label}</span>
                  <span className={`font-medium ${row.ok === false ? 'text-amber-500' : row.ok === true ? 'text-emerald-500' : 'text-slate-900 dark:text-white'}`}>
                    {row.value}
                  </span>
                </div>
              ))}
            </div>

            {/* Actions */}
            {user.role !== 'admin' && (
              <div className="px-5 py-4 border-t border-slate-100 dark:border-slate-700">
                {user.status === 'locked' || user.status === 'banned' ? (
                  <button
                    type="button"
                    onClick={() => onUnban(user)}
                    className="w-full btn-primary-custom justify-center"
                  >
                    ✓ Mở khóa tài khoản
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={() => onBan(user)}
                    className="w-full btn-danger-custom justify-center"
                  >
                    🚫 Khóa tài khoản
                  </button>
                )}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}

export default function AdminUsers() {
  const { show } = useToast()
  const [users, setUsers] = useState([])
  const [stats, setStats] = useState(null)
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [confirmAction, setConfirmAction] = useState(null)
  
  const [selectedUser, setSelectedUser] = useState(null)
  const [loadingDetails, setLoadingDetails] = useState(false)
  const [loading, setLoading] = useState(true)
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [totalUsers, setTotalUsers] = useState(0)

  const fetchUsers = async (p = page, q = search) => {
    try {
      setLoading(true)
      const res = await adminApi.getUsers({ page: p, q, per_page: 15 })
      setUsers(res.data || [])
      setPage(res.current_page || 1)
      setTotalPages(res.last_page || 1)
      setTotalUsers(res.total || 0)
    } catch (err) {
      console.error(err)
      show({ type: 'error', title: 'Lỗi', message: 'Không thể tải danh sách người dùng' })
    } finally {
      setLoading(false)
    }
  }

  const fetchStats = async () => {
    try {
      const res = await adminApi.getDashboardStats()
      setStats(res)
    } catch (err) {
      console.error(err)
    }
  }

  useEffect(() => {
    fetchStats()
  }, [])

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchUsers(1, search)
    }, 500)
    return () => clearTimeout(timer)
  }, [search])

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      fetchUsers(newPage, search)
    }
  }

  const filtered = users.filter((u) => {
    const matchStatus = statusFilter === 'all' || u.status === statusFilter || (statusFilter === 'locked' && u.status === 'banned')
    return matchStatus
  })

  const handleRowClick = async (user) => {
    setSelectedUser(user)
    setLoadingDetails(true)
    try {
      const details = await adminApi.getUserDetails(user.Id || user.id)
      setSelectedUser(details)
    } catch (err) {
      show({ type: 'error', message: 'Không thể tải chi tiết người dùng' })
    } finally {
      setLoadingDetails(false)
    }
  }

  const handleAction = (type, user) => {
    setConfirmAction({ type, user })
  }

  const executeAction = async () => {
    const { type, user } = confirmAction
    const actionVal = type === 'ban' ? 'lock' : 'unlock'
    
    try {
      await adminApi.lockUser(user.Id || user.id, actionVal)
      
      const newStatus = type === 'ban' ? 'locked' : 'active'
      setUsers((prev) => prev.map((u) => u.Id === user.Id ? { ...u, status: newStatus } : u))
      
      if (selectedUser?.Id === user.Id) {
        setSelectedUser((prev) => ({ ...prev, status: newStatus }))
      }
      
      const messages = {
        ban: { title: 'Đã khóa tài khoản', message: `${user.display_name || user.email} đã bị khóa.` },
        unban: { title: 'Đã mở khóa', message: `${user.display_name || user.email} đã được mở khóa.` },
      }
      show({ type: type === 'ban' ? 'error' : 'success', ...messages[type] })
    } catch (err) {
      show({ type: 'error', title: 'Lỗi', message: err.message || 'Không thể thực hiện thao tác này' })
    } finally {
      setConfirmAction(null)
    }
  }

  const formatDate = (d) => d ? new Date(d).toLocaleDateString('vi-VN') : '—'

  return (
    <div className="space-y-5 max-w-6xl">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Quản lý người dùng</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Tổng {totalUsers} tài khoản trong hệ thống.</p>
        </div>
        <button
          type="button"
          id="export-users-btn"
          className="btn-secondary-custom text-xs py-2"
          onClick={() => show({ type: 'info', message: 'Tính năng đang được phát triển.' })}
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
          </svg>
          Xuất CSV
        </button>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { label: 'Tổng số', value: stats?.total_users || 0, color: 'text-indigo-600', bg: 'bg-indigo-50 dark:bg-indigo-900/20', filter: null },
          { label: 'Premium', value: stats?.premium_users || 0, color: 'text-amber-600', bg: 'bg-amber-50 dark:bg-amber-900/20', filter: null },
          { label: 'Miễn phí', value: stats?.free_users || 0, color: 'text-slate-600 dark:text-slate-400', bg: 'bg-slate-50 dark:bg-slate-700/50', filter: null },
        ].map((s) => (
          <button
            key={s.label}
            type="button"
            onClick={() => s.filter && setStatusFilter(statusFilter === s.filter ? 'all' : s.filter)}
            className={`${s.bg} rounded-2xl p-4 text-left transition-all ${s.filter ? 'cursor-pointer hover:scale-[1.02]' : 'cursor-default'}`}
          >
            <p className={`text-2xl font-extrabold ${s.color}`}>{s.value}</p>
            <p className="text-xs font-medium text-slate-500 dark:text-slate-400 mt-1">{s.label}</p>
          </button>
        ))}
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-3">
        <div className="relative flex-1 min-w-[200px] max-w-xs">
          <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            id="admin-users-search"
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Tìm theo tên, email..."
            className="form-input pl-9"
          />
        </div>
        <div className="flex gap-1.5 flex-wrap">
          {STATUS_OPTIONS.map((s) => (
            <button
              key={s}
              type="button"
              id={`filter-status-${s}`}
              onClick={() => setStatusFilter(s)}
              className={`px-3 py-1.5 text-xs font-medium rounded-full transition-colors cursor-pointer
                ${statusFilter === s ? 'bg-primary-500 text-white' : 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-600'}`}
            >
              {STATUS_LABEL[s]}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 shadow-card overflow-hidden">
        <div className="overflow-x-auto min-h-[300px]">
          {loading ? (
            <div className="flex justify-center items-center h-48">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-500"></div>
            </div>
          ) : (
            <table className="w-full table-custom">
              <thead className="bg-slate-50 dark:bg-slate-900/50 border-b border-slate-200 dark:border-slate-700">
                <tr>
                  <th>Người dùng</th>
                  <th>Vai trò</th>
                  <th>Gói</th>
                  <th>Trạng thái</th>
                  <th>Tham gia</th>
                  <th>Hành động</th>
                </tr>
              </thead>
              <tbody>
                {filtered.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="text-center py-10 text-slate-400 dark:text-slate-500 text-sm">Không tìm thấy người dùng</td>
                  </tr>
                ) : (
                  filtered.map((user) => (
                    <tr
                      key={user.Id || user.id}
                      className="cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors"
                      onClick={() => handleRowClick(user)}
                    >
                      <td>
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-primary-100 dark:bg-primary-900/30 text-primary-600 font-bold text-sm flex items-center justify-center flex-shrink-0 uppercase">
                            {user.display_name?.charAt(0) || user.email?.charAt(0) || '?'}
                          </div>
                          <div>
                            <p className="font-medium text-slate-900 dark:text-white text-sm">{user.display_name || 'No Name'}</p>
                            <p className="text-xs text-slate-400">{user.email}</p>
                          </div>
                        </div>
                      </td>
                      <td>
                        <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${user.role === 'admin' ? 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-400' : 'badge-free'}`}>
                          {user.role === 'admin' ? 'Admin' : 'User'}
                        </span>
                      </td>
                      <td>
                        <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${user.plan?.price > 0 ? 'badge-premium' : 'badge-free'}`}>
                          {user.plan?.name || 'Free'}
                        </span>
                      </td>
                      <td>
                        <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${STATUS_BADGE[user.status]?.cls || 'badge-inactive'}`}>
                          {STATUS_BADGE[user.status]?.label || user.status}
                        </span>
                      </td>
                      <td><span className="text-xs">{formatDate(user.CreatedTime || user.created_at)}</span></td>
                      <td onClick={(e) => e.stopPropagation()}>
                        <div className="flex items-center gap-1">
                          {user.role !== 'admin' && (
                            user.status === 'locked' || user.status === 'banned' ? (
                              <button
                                type="button"
                                id={`unban-user-${user.Id || user.id}`}
                                onClick={() => handleAction('unban', user)}
                                className="px-2.5 py-1 text-xs font-medium bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 rounded-lg hover:bg-emerald-200 transition-colors cursor-pointer"
                              >
                                Mở khóa
                              </button>
                            ) : (
                              <button
                                type="button"
                                id={`ban-user-${user.Id || user.id}`}
                                onClick={() => handleAction('ban', user)}
                                className="px-2.5 py-1 text-xs font-medium bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 rounded-lg hover:bg-red-200 transition-colors cursor-pointer"
                              >
                                Khóa
                              </button>
                            )
                          )}
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          )}
        </div>
        
        {/* Pagination */}
        {!loading && totalPages > 1 && (
          <div className="px-5 py-3 border-t border-slate-100 dark:border-slate-700 flex items-center justify-between text-sm">
            <span className="text-slate-500">Trang {page} / {totalPages}</span>
            <div className="flex items-center gap-2">
              <button
                disabled={page <= 1}
                onClick={() => handlePageChange(page - 1)}
                className="px-3 py-1 rounded border border-slate-200 dark:border-slate-600 disabled:opacity-50"
              >
                Trước
              </button>
              <button
                disabled={page >= totalPages}
                onClick={() => handlePageChange(page + 1)}
                className="px-3 py-1 rounded border border-slate-200 dark:border-slate-600 disabled:opacity-50"
              >
                Sau
              </button>
            </div>
          </div>
        )}
      </div>

      {/* User detail drawer */}
      {selectedUser && (
        <UserDrawer
          user={selectedUser}
          loadingDetails={loadingDetails}
          onClose={() => setSelectedUser(null)}
          onBan={(u) => handleAction('ban', u)}
          onUnban={(u) => handleAction('unban', u)}
        />
      )}

      <ConfirmModal
        isOpen={confirmAction !== null}
        onClose={() => setConfirmAction(null)}
        onConfirm={executeAction}
        title={confirmAction?.type === 'ban' ? 'Khóa tài khoản' : 'Mở khóa tài khoản'}
        message={confirmAction?.type === 'ban'
          ? `Tài khoản của ${confirmAction?.user?.display_name || confirmAction?.user?.email} sẽ bị khóa. Người dùng sẽ không thể đăng nhập.`
          : `Mở khóa tài khoản cho ${confirmAction?.user?.display_name || confirmAction?.user?.email}?`
        }
        variant={confirmAction?.type === 'ban' ? 'danger' : 'info'}
        confirmText={confirmAction?.type === 'ban' ? 'Khóa tài khoản' : 'Mở khóa'}
      />
    </div>
  )
}

