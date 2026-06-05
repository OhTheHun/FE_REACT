import { useState } from 'react'
import ConfirmModal from '../../components/common/ConfirmModal'
import { useToast } from '../../components/common/Toast'

const MOCK_USERS = [
  { id: '1', display_name: 'Nguyễn Văn A', email: 'nguyenvana@example.com', role: 'user', status: 'active', plan: 'Premium', email_verified_at: '2025-05-21', last_login_at: '2025-05-30', CreatedTime: '2025-05-21', notes: 128, workspaces: 3 },
  { id: '2', display_name: 'Trần Thị B', email: 'tranthib@example.com', role: 'user', status: 'active', plan: 'Free', email_verified_at: '2025-05-22', last_login_at: '2025-05-29', CreatedTime: '2025-05-22', notes: 34, workspaces: 1 },
  { id: '3', display_name: 'Lê Văn C', email: 'levanc@example.com', role: 'user', status: 'inactive', plan: 'Free', email_verified_at: null, last_login_at: null, CreatedTime: '2025-05-23', notes: 7, workspaces: 1 },
  { id: '4', display_name: 'Phạm Thị D', email: 'phamthid@example.com', role: 'user', status: 'banned', plan: 'Free', email_verified_at: '2025-05-24', last_login_at: '2025-05-25', CreatedTime: '2025-05-24', notes: 55, workspaces: 1 },
  { id: '5', display_name: 'Đặng Văn E', email: 'dangvane@example.com', role: 'user', status: 'active', plan: 'Premium', email_verified_at: '2025-05-25', last_login_at: '2025-05-31', CreatedTime: '2025-05-25', notes: 211, workspaces: 5 },
  { id: '6', display_name: 'Vũ Thị F', email: 'vuthif@example.com', role: 'admin', status: 'active', plan: 'Premium', email_verified_at: '2025-01-01', last_login_at: '2025-05-31', CreatedTime: '2025-01-01', notes: 0, workspaces: 0 },
]

const STATUS_OPTIONS = ['all', 'active', 'inactive', 'banned']
const STATUS_LABEL = { all: 'Tất cả', active: 'Hoạt động', inactive: 'Không hoạt động', banned: 'Bị khóa' }

const STATUS_BADGE = {
  active:   { cls: 'badge-active',   label: 'Hoạt động' },
  inactive: { cls: 'badge-inactive', label: 'Không HĐ' },
  banned:   { cls: 'badge-banned',   label: 'Bị khóa' },
}

// User Detail Drawer
function UserDrawer({ user, onClose, onBan, onUnban }) {
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

        {/* Avatar + Name */}
        <div className="flex flex-col items-center gap-3 px-5 py-6 border-b border-slate-100 dark:border-slate-700">
          <div className="w-16 h-16 rounded-full bg-primary-100 dark:bg-primary-900/40 text-primary-600 dark:text-primary-400 font-extrabold text-2xl flex items-center justify-center">
            {user.display_name.charAt(0)}
          </div>
          <div className="text-center">
            <p className="text-lg font-bold text-slate-900 dark:text-white">{user.display_name}</p>
            <p className="text-sm text-slate-400">{user.email}</p>
            <div className="flex items-center justify-center gap-2 mt-2">
              <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${STATUS_BADGE[user.status]?.cls}`}>
                {STATUS_BADGE[user.status]?.label}
              </span>
              <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${user.plan === 'Premium' ? 'badge-premium' : 'badge-free'}`}>
                {user.plan}
              </span>
              {user.role === 'admin' && (
                <span className="text-xs px-2.5 py-1 rounded-full font-medium bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-300">
                  Admin
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 gap-3 px-5 py-4 border-b border-slate-100 dark:border-slate-700">
          {[
            { label: 'Ghi chú', value: user.notes },
            { label: 'Workspaces', value: user.workspaces },
          ].map((s) => (
            <div key={s.label} className="bg-slate-50 dark:bg-slate-700/50 rounded-xl p-3 text-center">
              <p className="text-xl font-extrabold text-slate-900 dark:text-white">{s.value}</p>
              <p className="text-xs text-slate-400 mt-0.5">{s.label}</p>
            </div>
          ))}
        </div>

        {/* Info rows */}
        <div className="px-5 py-4 space-y-3 flex-1">
          {[
            { label: 'Email xác minh', value: user.email_verified_at ? `✓ ${formatDate(user.email_verified_at)}` : '✗ Chưa xác minh', ok: !!user.email_verified_at },
            { label: 'Đăng nhập cuối', value: formatDate(user.last_login_at) },
            { label: 'Ngày tham gia', value: formatDate(user.CreatedTime) },
            { label: 'ID', value: `#${user.id}` },
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
            {user.status === 'banned' ? (
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
      </div>
    </div>
  )
}

export default function AdminUsers() {
  const { show } = useToast()
  const [users, setUsers] = useState(MOCK_USERS)
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [confirmAction, setConfirmAction] = useState(null)
  const [selectedUser, setSelectedUser] = useState(null)

  const filtered = users.filter((u) => {
    const matchSearch = !search || u.display_name.toLowerCase().includes(search.toLowerCase()) || u.email.toLowerCase().includes(search.toLowerCase())
    const matchStatus = statusFilter === 'all' || u.status === statusFilter
    return matchSearch && matchStatus
  })

  const handleAction = (type, user) => {
    setSelectedUser(null)
    setConfirmAction({ type, user })
  }

  const executeAction = () => {
    const { type, user } = confirmAction
    setUsers((prev) =>
      prev.map((u) => {
        if (u.id !== user.id) return u
        if (type === 'ban') return { ...u, status: 'banned' }
        if (type === 'unban') return { ...u, status: 'active' }
        return u
      }),
    )
    const messages = {
      ban: { title: 'Đã khóa tài khoản', message: `${user.display_name} đã bị khóa.` },
      unban: { title: 'Đã mở khóa', message: `${user.display_name} đã được mở khóa.` },
    }
    show({ type: type === 'ban' ? 'error' : 'success', ...messages[type] })
    setConfirmAction(null)
  }

  const formatDate = (d) => d ? new Date(d).toLocaleDateString('vi-VN') : '—'

  // Summary counts
  const counts = {
    active: users.filter((u) => u.status === 'active').length,
    inactive: users.filter((u) => u.status === 'inactive').length,
    banned: users.filter((u) => u.status === 'banned').length,
    premium: users.filter((u) => u.plan === 'Premium').length,
  }

  return (
    <div className="space-y-5 max-w-6xl">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Quản lý người dùng</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Tổng {users.length} tài khoản trong hệ thống.</p>
        </div>
        <button
          type="button"
          id="export-users-btn"
          className="btn-secondary-custom text-xs py-2"
          onClick={() => show({ type: 'info', message: 'Đã xuất danh sách người dùng (mô phỏng).' })}
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
          { label: 'Hoạt động', value: counts.active, color: 'text-emerald-600', bg: 'bg-emerald-50 dark:bg-emerald-900/20', filter: 'active' },
          { label: 'Không HĐ', value: counts.inactive, color: 'text-slate-600 dark:text-slate-400', bg: 'bg-slate-50 dark:bg-slate-700/50', filter: 'inactive' },
          { label: 'Bị khóa', value: counts.banned, color: 'text-red-600', bg: 'bg-red-50 dark:bg-red-900/20', filter: 'banned' },
          { label: 'Premium', value: counts.premium, color: 'text-blue-600', bg: 'bg-blue-50 dark:bg-blue-900/20', filter: null },
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
        <div className="overflow-x-auto">
          <table className="w-full table-custom">
            <thead className="bg-slate-50 dark:bg-slate-900/50 border-b border-slate-200 dark:border-slate-700">
              <tr>
                <th>Người dùng</th>
                <th>Vai trò</th>
                <th>Gói</th>
                <th>Trạng thái</th>
                <th>Email xác minh</th>
                <th>Đăng nhập cuối</th>
                <th>Tham gia</th>
                <th>Hành động</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={8} className="text-center py-10 text-slate-400 dark:text-slate-500 text-sm">Không tìm thấy người dùng</td>
                </tr>
              ) : (
                filtered.map((user) => (
                  <tr
                    key={user.id}
                    className="cursor-pointer"
                    onClick={() => setSelectedUser(user)}
                  >
                    <td>
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-primary-100 dark:bg-primary-900/30 text-primary-600 font-bold text-sm flex items-center justify-center flex-shrink-0">
                          {user.display_name.charAt(0)}
                        </div>
                        <div>
                          <p className="font-medium text-slate-900 dark:text-white text-sm">{user.display_name}</p>
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
                      <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${user.plan === 'Premium' ? 'badge-premium' : 'badge-free'}`}>
                        {user.plan}
                      </span>
                    </td>
                    <td>
                      <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${STATUS_BADGE[user.status]?.cls}`}>
                        {STATUS_BADGE[user.status]?.label}
                      </span>
                    </td>
                    <td>
                      {user.email_verified_at ? (
                        <span className="text-xs text-emerald-500">✓ {formatDate(user.email_verified_at)}</span>
                      ) : (
                        <span className="text-xs text-amber-500">✗ Chưa xác minh</span>
                      )}
                    </td>
                    <td><span className="text-xs">{formatDate(user.last_login_at)}</span></td>
                    <td><span className="text-xs">{formatDate(user.CreatedTime)}</span></td>
                    <td onClick={(e) => e.stopPropagation()}>
                      <div className="flex items-center gap-1">
                        {user.role !== 'admin' && (
                          user.status === 'banned' ? (
                            <button
                              type="button"
                              id={`unban-user-${user.id}`}
                              onClick={() => handleAction('unban', user)}
                              className="px-2.5 py-1 text-xs font-medium bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 rounded-lg hover:bg-emerald-200 transition-colors cursor-pointer"
                            >
                              Mở khóa
                            </button>
                          ) : (
                            <button
                              type="button"
                              id={`ban-user-${user.id}`}
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
        </div>
        <div className="px-5 py-3 border-t border-slate-100 dark:border-slate-700 text-xs text-slate-400">
          Hiển thị {filtered.length} / {users.length} người dùng
        </div>
      </div>

      {/* User detail drawer */}
      {selectedUser && (
        <UserDrawer
          user={selectedUser}
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
          ? `Tài khoản của ${confirmAction?.user?.display_name} sẽ bị khóa. Người dùng sẽ không thể đăng nhập.`
          : `Mở khóa tài khoản cho ${confirmAction?.user?.display_name}?`
        }
        variant={confirmAction?.type === 'ban' ? 'danger' : 'info'}
        confirmText={confirmAction?.type === 'ban' ? 'Khóa tài khoản' : 'Mở khóa'}
      />
    </div>
  )
}
