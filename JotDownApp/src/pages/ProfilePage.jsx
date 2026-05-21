import { useAuth } from '../hooks/useAuth.jsx'
import { Link } from 'react-router-dom'

function ProfilePage() {
  const { user, logout } = useAuth()

  return (
    <div className="grid gap-8 lg:grid-cols-[1fr_320px]">
      <section className="rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-8 shadow-sm">
        <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">Hồ sơ người dùng</h1>
        <p className="mt-2 text-slate-600 dark:text-slate-400">
          Xem thông tin cá nhân và tài khoản của bạn.
        </p>

        <div className="mt-8 flex flex-col sm:flex-row items-center gap-8 border-b border-slate-200 dark:border-slate-800 pb-8">
          <div className="h-32 w-32 rounded-full bg-primary/10 flex items-center justify-center overflow-hidden border-4 border-white dark:border-slate-800 shadow-lg">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-primary" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
            </svg>
          </div>
          <div className="text-center sm:text-left space-y-2">
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white">{user?.name || 'Nguyễn Văn A'}</h2>
            <p className="text-slate-500 dark:text-slate-400">{user?.email || 'nguyenvana@example.com'}</p>
          </div>
        </div>
        
        <div className="mt-8">
          <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">Thông tin chi tiết</h3>
          <div className="grid gap-6 sm:grid-cols-2">
            <div className="rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 p-5">
              <p className="text-sm font-medium text-slate-500 dark:text-slate-400">Ngày tham gia</p>
              <p className="mt-2 text-lg font-semibold text-slate-900 dark:text-white">21 Tháng 5, 2026</p>
            </div>
            <div className="rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 p-5">
              <p className="text-sm font-medium text-slate-500 dark:text-slate-400">Loại tài khoản</p>
              <p className="mt-2 text-lg font-semibold text-slate-900 dark:text-white">Miễn phí</p>
            </div>
          </div>
        </div>
      </section>

      <aside className="space-y-6">
        <div className="rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-sm">
          <h2 className="text-xl font-semibold text-slate-900 dark:text-white">Cài đặt</h2>
          <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">Tùy chỉnh giao diện và bảo mật.</p>
          <Link to="/settings" className="btn btn-primary mt-5 w-full">
            Đi tới Tùy chỉnh
          </Link>
        </div>
        <div className="rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-sm">
          <h2 className="text-xl font-semibold text-slate-900 dark:text-white">Hành động</h2>
          <button className="btn btn-outline btn-error mt-5 w-full" onClick={logout}>
            Đăng xuất
          </button>
        </div>
      </aside>
    </div>
  )
}

export default ProfilePage
