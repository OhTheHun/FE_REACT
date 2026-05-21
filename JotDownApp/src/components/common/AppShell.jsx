import { Link, Outlet, useLocation } from 'react-router-dom'
import { useState } from 'react'
import Footer from './Footer'

function AppShell() {
  const location = useLocation()
  
  const [isVerified, setIsVerified] = useState(false)
  const [isLoggedIn, setIsLoggedIn] = useState(false) 

  const authPaths = ['/login', '/register', '/forgot-password', '/reset-password']
  const appPaths = ['/', '/landing', '/notes', '/profile', '/settings', ...authPaths]
  const isAuthPage = authPaths.includes(location.pathname)
  const isLanding = location.pathname === '/' || location.pathname === '/landing'
  const isNotFoundPage = !appPaths.includes(location.pathname)
  const shouldUsePublicNav = isLanding || isNotFoundPage

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-slate-50 transition-colors duration-200">
      {isLoggedIn && !isVerified && (
        <div className="bg-amber-100 dark:bg-amber-900 text-amber-900 dark:text-amber-100 px-4 py-2 text-center text-sm font-medium">
          Tài khoản của bạn chưa được xác minh. Vui lòng kiểm tra email để kích hoạt tài khoản.
        </div>
      )}
      
      {!isAuthPage && (
        <header className="sticky top-0 z-20 border-b border-slate-200 dark:border-slate-800 bg-white/95 dark:bg-slate-950/95 backdrop-blur-lg">
          <div className="container mx-auto px-4 max-w-7xl flex items-center justify-between h-16">
            <Link to="/" className="text-2xl font-bold tracking-tight text-blue-600 dark:text-blue-500">
              JotDown
            </Link>
            
            {shouldUsePublicNav ? (
              <>
                <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-600 dark:text-slate-300">
                  <Link to="/features" className="hover:text-slate-900 dark:hover:text-white transition-colors">Features</Link>
                  <Link to="/pricing" className="hover:text-slate-900 dark:hover:text-white transition-colors">Pricing</Link>
                  <Link to="/about" className="hover:text-slate-900 dark:hover:text-white transition-colors">About</Link>
                </nav>
                <div className="flex items-center gap-4">
                  <Link to="/login" className="text-sm font-medium hover:text-blue-600 transition-colors">
                    Log In
                  </Link>
                  <Link to="/register" className="bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-md px-5 py-2 transition-colors">
                    Start for free
                  </Link>
                </div>
              </>
            ) : (
              <div className="flex items-center gap-4">
                {isLoggedIn ? (
                  <>
                    <Link to="/notes" className="text-sm hover:text-blue-600">Ghi chú</Link>
                    <Link to="/profile" className="text-sm hover:text-blue-600">Hồ sơ</Link>
                    <Link to="/settings" className="text-sm hover:text-blue-600">Cài đặt</Link>
                  </>
                ) : (
                   <Link to="/login" className="bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-md px-5 py-2 transition-colors">
                    Login
                  </Link>
                )}
              </div>
            )}
          </div>
        </header>
      )}

      <main className={`flex-1 ${isAuthPage ? '' : (shouldUsePublicNav ? '' : 'container mx-auto px-4 py-8')}`}>
        <Outlet />
      </main>
      
      {isLanding && !isAuthPage && <Footer />}
    </div>
  )
}

export default AppShell
