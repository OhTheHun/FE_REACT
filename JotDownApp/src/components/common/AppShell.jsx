import { Link, Navigate, Outlet, useLocation, useNavigate } from 'react-router-dom'
import { useEffect, useState } from 'react'
import Sidebar from './Sidebar'
import Footer from './Footer'
import { useAuth } from '../../features/auth'
import { useToast } from './Toast'

const AUTH_PATHS = ['/login', '/register', '/forgot-password', '/reset-password']
const PUBLIC_PATHS = ['/', '/landing', '/plans']
const APP_PATHS = ['/notes', '/workspaces', '/labels', '/profile', '/settings', '/payments']

function isPathIn(pathname, paths) {
  return paths.some((p) => pathname === p || pathname.startsWith(p + '/'))
}

function AccountLink({ user }) {
  const accountPath = user?.role === 'admin' ? '/admin' : '/profile'
  const displayName = user?.display_name || user?.name || user?.email || 'Tài khoản'
  const avatarInitial = displayName.charAt(0).toUpperCase()

  return (
    <Link
      to={accountPath}
      id="header-account-btn"
      title={displayName}
      className="flex h-12 min-w-[78px] flex-col items-center justify-center gap-0.5 rounded-lg px-3 text-slate-600 transition-colors hover:bg-slate-100 hover:text-primary-600 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-primary-400"
    >
      <span className="flex h-7 w-7 items-center justify-center overflow-hidden rounded-full bg-primary-100 text-xs font-bold text-primary-700 ring-2 ring-primary-200 dark:bg-primary-900/40 dark:text-primary-300 dark:ring-primary-800">
        {user?.avatar_url ? (
          <img src={user.avatar_url} alt={displayName} className="h-full w-full object-cover" />
        ) : avatarInitial}
      </span>
      <span className="text-[11px] font-medium leading-none">Tài khoản</span>
    </Link>
  )
}

export default function AppShell() {
  const location = useLocation()
  const navigate = useNavigate()
  const { show } = useToast()
  const { user, isAuthenticated } = useAuth()
  const [mobileOpen, setMobileOpen] = useState(false)

  useEffect(() => {
    const params = new URLSearchParams(location.search)
    const paymentStatus = params.get('payment_status')
    const paymentMethod = params.get('payment_method')

    if (!paymentStatus || !paymentMethod) return

    const methodLabel = paymentMethod === 'paypal' ? 'PayPal' : paymentMethod.toUpperCase()
    const message = params.get('message') || (
      paymentStatus === 'success'
        ? `Thanh toán ${methodLabel} thành công.`
        : `Thanh toán ${methodLabel} đã bị hủy.`
    )

    show({
      type: paymentStatus === 'success' ? 'success' : 'info',
      title: paymentStatus === 'success' ? 'Thanh toán thành công' : 'Thanh toán đã hủy',
      message,
      duration: 6000,
    })

    params.delete('payment_method')
    params.delete('payment_status')
    params.delete('payment_id')
    params.delete('transaction_code')
    params.delete('paypal_order_id')
    params.delete('message')

    navigate({
      pathname: location.pathname,
      search: params.toString() ? `?${params.toString()}` : '',
    }, { replace: true })
  }, [location.pathname, location.search, navigate, show])

  const isAdmin = user?.role === 'admin'
  const isAuthPage = isPathIn(location.pathname, AUTH_PATHS)
  const isPublicPage = isPathIn(location.pathname, PUBLIC_PATHS) || location.pathname === '/'
  const isAppPage = isPathIn(location.pathname, APP_PATHS)
  const isEmailUnverified = isAuthenticated && !user?.email_verified_at

  if (isAppPage && !isAuthenticated) {
    return <Navigate to="/login" replace state={{ from: location }} />
  }

  if (isAuthPage) {
    return (
      <div className="min-h-screen auth-gradient">
        <Outlet />
      </div>
    )
  }

  if (isAppPage) {
    return (
      <div className="flex h-screen overflow-hidden bg-slate-50 dark:bg-slate-950">
        <div className="hidden lg:flex h-full">
          <Sidebar user={user} isAdmin={isAdmin} />
        </div>

        {mobileOpen && (
          <div className="fixed inset-0 z-40 flex lg:hidden">
            <div className="fixed inset-0 bg-black/50" onClick={() => setMobileOpen(false)} />
            <div className="relative z-50 flex h-full">
              <Sidebar user={user} isAdmin={isAdmin} />
            </div>
          </div>
        )}

        <div className="flex flex-col flex-1 min-w-0 overflow-hidden">
          {isEmailUnverified && (
            <div className="bg-amber-50 dark:bg-amber-900/20 border-b border-amber-200 dark:border-amber-800 px-4 py-2.5 text-center">
              <p className="text-sm text-amber-700 dark:text-amber-400">
                <span className="font-medium">Tài khoản chưa xác minh.</span>{' '}
                Vui lòng kiểm tra email để kích hoạt tài khoản.{' '}
                <button className="underline font-medium cursor-pointer hover:no-underline">
                  Gửi lại email
                </button>
              </p>
            </div>
          )}

          <header className="lg:hidden flex items-center gap-3 px-4 py-3 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-700">
            <button
              type="button"
              id="mobile-menu-btn"
              onClick={() => setMobileOpen(true)}
              className="p-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors cursor-pointer"
            >
              <svg className="w-5 h-5 text-slate-600 dark:text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
            <Link to="/landing" className="text-lg font-bold text-primary-600 dark:text-primary-400 tracking-tight">
              JotDown
            </Link>
          </header>

          <main id="main-content" className="flex-1 overflow-y-auto p-4 lg:p-6 page-enter">
            <Outlet />
          </main>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex flex-col bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-100">
      <header className="sticky top-0 z-20 border-b border-slate-200 dark:border-slate-800 bg-white/95 dark:bg-slate-950/95 backdrop-blur-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between h-16">
          <Link to="/landing" className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-primary-500 flex items-center justify-center">
              <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5}
                  d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
            </div>
            <span className="text-xl font-bold tracking-tight text-slate-900 dark:text-white">JotDown</span>
          </Link>

          <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-600 dark:text-slate-300">
            <Link to="/landing#features" className="hover:text-slate-900 dark:hover:text-white transition-colors">Tính năng</Link>
            <Link to="/plans" className="hover:text-slate-900 dark:hover:text-white transition-colors">Bảng giá</Link>
            <Link to="/shared-notes" className="hover:text-slate-900 dark:hover:text-white transition-colors">Cộng đồng</Link>
            <Link to="/landing#about" className="hover:text-slate-900 dark:hover:text-white transition-colors">Giới thiệu</Link>
          </nav>

          <div className="flex items-center gap-3">
            {isAuthenticated ? (
              <AccountLink user={user} />
            ) : (
              <>
                <Link to="/login" id="header-login-btn"
                  className="text-sm font-medium text-slate-700 dark:text-slate-300 hover:text-primary-600 dark:hover:text-primary-400 transition-colors">
                  Đăng nhập
                </Link>
                <Link to="/register" id="header-register-btn"
                  className="text-sm font-semibold bg-primary-500 hover:bg-primary-600 text-white px-4 py-2 rounded-xl transition-colors">
                  Dùng miễn phí
                </Link>
              </>
            )}
          </div>
        </div>
      </header>

      <main className="flex-1">
        <Outlet />
      </main>

      {isPublicPage && <Footer />}
    </div>
  )
}
