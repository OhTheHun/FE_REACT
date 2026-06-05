import { Link, Outlet, useLocation, Navigate } from 'react-router-dom'
import { useState } from 'react'
import Sidebar from './Sidebar'
import Footer from './Footer'
import { useAuth } from '../../features/auth'

const AUTH_PATHS = ['/login', '/register', '/forgot-password', '/reset-password']
const PUBLIC_PATHS = ['/', '/landing']
const APP_PATHS = ['/notes', '/workspaces', '/labels', '/plans', '/profile', '/settings']
const ADMIN_PATHS = ['/admin']

function isPathIn(pathname, paths) {
  return paths.some((p) => pathname === p || pathname.startsWith(p + '/'))
}

export default function AppShell() {
  const location = useLocation()
  const { user } = useAuth()
  const [mobileOpen, setMobileOpen] = useState(false)

  const isLoggedIn = !!user
  const isAdmin = user?.role === 'admin' || (user && isPathIn(location.pathname, ADMIN_PATHS))

  const isAuthPage = isPathIn(location.pathname, AUTH_PATHS)
  const isPublicPage = isPathIn(location.pathname, PUBLIC_PATHS) || location.pathname === '/'
  const isAppPage = isPathIn(location.pathname, APP_PATHS) || isPathIn(location.pathname, ADMIN_PATHS)
  const isEmailUnverified = isLoggedIn && !user?.email_verified_at

  // Route protection
  if (isAppPage && !isLoggedIn) {
    return <Navigate to="/login" replace state={{ from: location }} />
  }

  if (isAuthPage && isLoggedIn) {
    return <Navigate to="/notes" replace />
  }

  // Auth pages – standalone layout
  if (isAuthPage) {
    return (
      <div className="min-h-screen auth-gradient">
        <Outlet />
      </div>
    )
  }

  // App pages – sidebar layout
  if (isAppPage) {
    return (
      <div className="flex h-screen overflow-hidden bg-slate-50 dark:bg-slate-950">
        {/* Desktop sidebar */}
        <div className="hidden lg:flex h-full">
          <Sidebar user={user} isAdmin={isAdmin} />
        </div>

        {/* Mobile sidebar overlay */}
        {mobileOpen && (
          <div className="fixed inset-0 z-40 flex lg:hidden">
            <div className="fixed inset-0 bg-black/50" onClick={() => setMobileOpen(false)} />
            <div className="relative z-50 flex h-full">
              <Sidebar user={user} isAdmin={isAdmin} />
            </div>
          </div>
        )}

        {/* Main content */}
        <div className="flex flex-col flex-1 min-w-0 overflow-hidden">
          {/* Email verification banner */}
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

          {/* Mobile top bar */}
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
            <Link to="/" className="text-lg font-bold text-primary-600 dark:text-primary-400 tracking-tight">
              JotDown
            </Link>
          </header>

          {/* Page content */}
          <main id="main-content" className="flex-1 overflow-y-auto p-4 lg:p-6 page-enter">
            <Outlet />
          </main>
        </div>
      </div>
    )
  }

  // Public/Landing pages – top nav layout
  return (
    <div className="min-h-screen flex flex-col bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-100">
      <header className="sticky top-0 z-20 border-b border-slate-200 dark:border-slate-800 bg-white/95 dark:bg-slate-950/95 backdrop-blur-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between h-16">
          <Link to="/" className="flex items-center gap-2">
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
            <Link to="/login" id="header-login-btn"
              className="text-sm font-medium text-slate-700 dark:text-slate-300 hover:text-primary-600 dark:hover:text-primary-400 transition-colors">
              Đăng nhập
            </Link>
            <Link to="/register" id="header-register-btn"
              className="text-sm font-semibold bg-primary-500 hover:bg-primary-600 text-white px-4 py-2 rounded-xl transition-colors">
              Dùng miễn phí
            </Link>
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
