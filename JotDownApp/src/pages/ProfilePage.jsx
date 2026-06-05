import { useState } from 'react'
import { Link } from 'react-router-dom'
import ConfirmModal from '../components/common/ConfirmModal'
import { useToast } from '../components/common/Toast'

// Mock data – replace with real auth context
const MOCK_USER = {
  display_name: 'Nguyễn Văn A',
  email: 'nguyenvana@example.com',
  avatar_url: null,
  role: 'user',
  status: 'active',
  plan_id: null,
  email_verified_at: null,
  last_login_at: new Date().toISOString(),
  CreatedTime: '2025-05-21T08:00:00Z',
}

const MOCK_STATS = { total_notes: 24, total_workspaces: 3, total_labels: 7, shared_notes: 5 }

function StatCard({ label, value, icon, color }) {
  return (
    <div className="flex items-center gap-4 p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-700">
      <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${color}`}>
        {icon}
      </div>
      <div>
        <p className="text-2xl font-bold text-slate-900 dark:text-white">{value}</p>
        <p className="text-xs text-slate-500 dark:text-slate-400">{label}</p>
      </div>
    </div>
  )
}

export default function ProfilePage() {
  const { show } = useToast()
  const user = MOCK_USER
  const stats = MOCK_STATS

  const [displayName, setDisplayName] = useState(user.display_name)
  const [editing, setEditing] = useState(false)
  const [showDeleteAccount, setShowDeleteAccount] = useState(false)

  const handleSaveName = () => {
    if (!displayName.trim()) return
    show({ type: 'success', title: 'Cập nhật thành công', message: 'Tên hiển thị đã được thay đổi.' })
    setEditing(false)
  }

  const handleDeleteAccount = () => {
    show({ type: 'error', title: 'Tài khoản đã bị xóa', message: 'Rất tiếc khi bạn rời đi.' })
  }

  const avatarInitial = displayName.charAt(0).toUpperCase()
  const isPremium = user.plan_id != null
  const isVerified = user.email_verified_at != null

  const formatDate = (iso) =>
    iso ? new Date(iso).toLocaleDateString('vi-VN', { day: '2-digit', month: 'long', year: 'numeric' }) : '—'

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Hero card */}
      <div className="rounded-3xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 overflow-hidden shadow-card">
        {/* Banner */}
        <div className="h-24 bg-gradient-to-r from-primary-500 to-primary-400" />

        <div className="px-6 pb-6">
          {/* Avatar + info row */}
          <div className="flex flex-col sm:flex-row sm:items-end gap-4 -mt-10 mb-5">
            <div className="relative flex-shrink-0">
              <div className="w-20 h-20 rounded-2xl bg-white dark:bg-slate-800 border-4 border-white dark:border-slate-900 shadow-lg flex items-center justify-center text-3xl font-bold text-primary-600">
                {user.avatar_url ? (
                  <img src={user.avatar_url} alt={displayName} className="w-full h-full object-cover rounded-xl" />
                ) : avatarInitial}
              </div>
              <button
                type="button"
                id="change-avatar-btn"
                title="Thay ảnh đại diện"
                className="absolute -bottom-1 -right-1 w-6 h-6 bg-primary-500 hover:bg-primary-600 text-white rounded-full flex items-center justify-center cursor-pointer transition-colors shadow-sm"
              >
                <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15.232 5.232l3.536 3.536M9 11l6-6 3 3-6 6H9v-3z" />
                </svg>
              </button>
            </div>

            <div className="flex-1">
              <div className="flex flex-wrap items-center gap-2 mt-2">
                <span className={`text-xs px-2.5 py-0.5 rounded-full font-medium ${isPremium ? 'badge-premium' : 'badge-free'}`}>
                  {isPremium ? '⭐ Premium' : 'Free'}
                </span>
                <span className={`text-xs px-2.5 py-0.5 rounded-full font-medium ${user.status === 'active' ? 'badge-active' : 'badge-inactive'}`}>
                  {user.status === 'active' ? 'Hoạt động' : 'Không hoạt động'}
                </span>
                {isVerified ? (
                  <span className="text-xs px-2.5 py-0.5 rounded-full font-medium badge-active">Email đã xác minh</span>
                ) : (
                  <span className="text-xs px-2.5 py-0.5 rounded-full font-medium badge-pending">Email chưa xác minh</span>
                )}
              </div>
            </div>
          </div>

          {/* Name edit */}
          <div className="space-y-1 mb-5">
            {editing ? (
              <div className="flex items-center gap-2">
                <input
                  id="display-name-input"
                  type="text"
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  className="form-input flex-1 text-lg font-semibold"
                  autoFocus
                />
                <button type="button" onClick={handleSaveName} className="btn-primary-custom py-2">Lưu</button>
                <button type="button" onClick={() => { setEditing(false); setDisplayName(user.display_name) }} className="btn-secondary-custom py-2">Hủy</button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <h1 className="text-2xl font-bold text-slate-900 dark:text-white">{displayName}</h1>
                <button
                  type="button"
                  id="edit-name-btn"
                  onClick={() => setEditing(true)}
                  className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-400 hover:text-slate-600 transition-colors cursor-pointer"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536M9 11l6-6 3 3-6 6H9v-3z" />
                  </svg>
                </button>
              </div>
            )}
            <p className="text-sm text-slate-500 dark:text-slate-400">{user.email}</p>
          </div>

          {/* Info grid */}
          <div className="grid grid-cols-2 gap-3 text-sm">
            <div>
              <p className="text-xs text-slate-400 mb-0.5">Tham gia từ</p>
              <p className="font-medium text-slate-700 dark:text-slate-300">{formatDate(user.CreatedTime)}</p>
            </div>
            <div>
              <p className="text-xs text-slate-400 mb-0.5">Đăng nhập lần cuối</p>
              <p className="font-medium text-slate-700 dark:text-slate-300">{formatDate(user.last_login_at)}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div>
        <h2 className="text-sm font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-3 px-1">Thống kê</h2>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          <StatCard label="Ghi chú" value={stats.total_notes} color="bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400"
            icon={<svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>}
          />
          <StatCard label="Workspace" value={stats.total_workspaces} color="bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400"
            icon={<svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" /></svg>}
          />
          <StatCard label="Nhãn" value={stats.total_labels} color="bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400"
            icon={<svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A2 2 0 013 12V7a4 4 0 014-4z" /></svg>}
          />
          <StatCard label="Đã chia sẻ" value={stats.shared_notes} color="bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400"
            icon={<svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" /></svg>}
          />
        </div>
      </div>

      {/* Quick actions */}
      <div>
        <h2 className="text-sm font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-3 px-1">Hành động nhanh</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <Link to="/settings" id="goto-settings-btn"
            className="flex items-center gap-3 p-4 rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 hover:border-primary-300 hover:shadow-card-hover transition-all cursor-pointer">
            <div className="w-9 h-9 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-600 dark:text-slate-400">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </div>
            <div>
              <p className="text-sm font-semibold text-slate-900 dark:text-white">Cài đặt</p>
              <p className="text-xs text-slate-400">Giao diện & bảo mật</p>
            </div>
          </Link>

          <Link to="/plans" id="goto-plans-btn"
            className="flex items-center gap-3 p-4 rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 hover:border-primary-300 hover:shadow-card-hover transition-all cursor-pointer">
            <div className="w-9 h-9 rounded-xl bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center text-blue-600 dark:text-blue-400">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
              </svg>
            </div>
            <div>
              <p className="text-sm font-semibold text-slate-900 dark:text-white">Nâng cấp gói</p>
              <p className="text-xs text-slate-400">{isPremium ? 'Đang dùng Premium' : 'Nâng cấp lên Premium'}</p>
            </div>
          </Link>
        </div>
      </div>

      {/* Danger zone */}
      <div className="rounded-3xl border border-red-200 dark:border-red-800/50 bg-red-50/50 dark:bg-red-900/10 p-5">
        <h2 className="text-sm font-semibold text-red-700 dark:text-red-400 uppercase tracking-wider mb-3">Vùng nguy hiểm</h2>
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div>
            <p className="text-sm font-medium text-slate-700 dark:text-slate-300">Xóa tài khoản</p>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">Tất cả dữ liệu sẽ bị xóa vĩnh viễn. Không thể hoàn tác.</p>
          </div>
          <button
            type="button"
            id="delete-account-btn"
            onClick={() => setShowDeleteAccount(true)}
            className="btn-danger-custom flex-shrink-0 text-xs py-2"
          >
            Xóa tài khoản
          </button>
        </div>
      </div>

      <ConfirmModal
        isOpen={showDeleteAccount}
        onClose={() => setShowDeleteAccount(false)}
        onConfirm={handleDeleteAccount}
        title="Xóa tài khoản vĩnh viễn"
        message="Tất cả ghi chú, workspace và dữ liệu của bạn sẽ bị xóa hoàn toàn. Hành động này không thể hoàn tác."
        variant="danger"
        confirmText="Xóa vĩnh viễn"
        cancelText="Hủy"
      />
    </div>
  )
}
