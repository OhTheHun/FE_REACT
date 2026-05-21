import { useState, useEffect } from 'react'

function SettingsPage() {
  const [theme, setTheme] = useState('light')
  const [fontSize, setFontSize] = useState('medium')
  const [noteColor, setNoteColor] = useState('default')
    const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmNewPassword, setConfirmNewPassword] = useState('')
  const [passwordError, setPasswordError] = useState('')
  const [passwordSuccess, setPasswordSuccess] = useState('')

  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  }, [theme])

  const handlePasswordChange = (e) => {
    e.preventDefault()
    setPasswordError('')
    setPasswordSuccess('')

    if (newPassword !== confirmNewPassword) {
      setPasswordError('Mật khẩu mới không khớp.')
      return
    }
    
    if (!currentPassword) {
      setPasswordError('Vui lòng nhập mật khẩu hiện tại.')
      return
    }

    console.log('Đã cập nhật mật khẩu')
    setPasswordSuccess('Mật khẩu đã được thay đổi thành công.')
    setCurrentPassword('')
    setNewPassword('')
    setConfirmNewPassword('')
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-12">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">Cài đặt</h1>
        <p className="mt-2 text-slate-600 dark:text-slate-400">Tùy chỉnh giao diện hiển thị và bảo mật tài khoản.</p>
      </div>

      <div className="grid gap-8 md:grid-cols-2">
        {/* Appearance Settings */}
        <section className="space-y-6">
          <div className="rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-sm space-y-8">
            <div>
              <h2 className="text-xl font-semibold text-slate-900 dark:text-white border-b border-slate-100 dark:border-slate-800 pb-4 mb-6">Hiển thị</h2>
              
              <div className="space-y-6">
                {/* Theme Toggle */}
                <div className="space-y-3">
                  <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Giao diện</label>
                  <div className="flex gap-4">
                    <label className={`flex-1 flex flex-col items-center justify-center p-4 rounded-xl border-2 cursor-pointer transition-colors ${theme === 'light' ? 'border-primary bg-primary/5' : 'border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600'}`}>
                      <input type="radio" name="theme" value="light" className="hidden" checked={theme === 'light'} onChange={() => setTheme('light')} />
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 mb-2 text-amber-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                      </svg>
                      <span className="text-sm font-medium dark:text-slate-200">Sáng</span>
                    </label>
                    <label className={`flex-1 flex flex-col items-center justify-center p-4 rounded-xl border-2 cursor-pointer transition-colors ${theme === 'dark' ? 'border-primary bg-primary/5' : 'border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600'}`}>
                      <input type="radio" name="theme" value="dark" className="hidden" checked={theme === 'dark'} onChange={() => setTheme('dark')} />
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 mb-2 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                      </svg>
                      <span className="text-sm font-medium dark:text-slate-200">Tối</span>
                    </label>
                  </div>
                </div>

                {/* Font Size */}
                <div className="space-y-3">
                  <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Cỡ chữ (Ghi chú)</label>
                  <select 
                    value={fontSize} 
                    onChange={(e) => setFontSize(e.target.value)}
                    className="select select-bordered w-full bg-slate-50 dark:bg-slate-800 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-primary/50"
                  >
                    <option value="small">Nhỏ</option>
                    <option value="medium">Vừa (Mặc định)</option>
                    <option value="large">Lớn</option>
                  </select>
                </div>

                {/* Default Note Color */}
                <div className="space-y-3">
                  <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Màu ghi chú mặc định</label>
                  <div className="flex gap-3">
                    {['default', 'red', 'yellow', 'green', 'blue', 'purple'].map((color) => (
                      <button
                        key={color}
                        onClick={() => setNoteColor(color)}
                        className={`w-8 h-8 rounded-full border-2 transition-transform hover:scale-110 ${
                          noteColor === color ? 'border-primary ring-2 ring-primary/30 ring-offset-2 dark:ring-offset-slate-900' : 'border-transparent'
                        } ${
                          color === 'default' ? 'bg-white dark:bg-slate-700 border-slate-300 dark:border-slate-600' :
                          color === 'red' ? 'bg-red-200 dark:bg-red-900/50' :
                          color === 'yellow' ? 'bg-amber-200 dark:bg-amber-900/50' :
                          color === 'green' ? 'bg-emerald-200 dark:bg-emerald-900/50' :
                          color === 'blue' ? 'bg-sky-200 dark:bg-sky-900/50' :
                          'bg-purple-200 dark:bg-purple-900/50'
                        }`}
                      />
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Security Settings */}
        <section className="space-y-6">
          <div className="rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-sm">
            <h2 className="text-xl font-semibold text-slate-900 dark:text-white border-b border-slate-100 dark:border-slate-800 pb-4 mb-6">Bảo mật</h2>
            
            <form onSubmit={handlePasswordChange} className="space-y-5">
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Mật khẩu hiện tại</label>
                <input
                  type="password"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  className="input input-bordered w-full bg-slate-50 dark:bg-slate-800 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-primary/50"
                  placeholder="••••••••"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Mật khẩu mới</label>
                <input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="input input-bordered w-full bg-slate-50 dark:bg-slate-800 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-primary/50"
                  placeholder="••••••••"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Xác nhận mật khẩu mới</label>
                <input
                  type="password"
                  value={confirmNewPassword}
                  onChange={(e) => setConfirmNewPassword(e.target.value)}
                  className="input input-bordered w-full bg-slate-50 dark:bg-slate-800 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-primary/50"
                  placeholder="••••••••"
                />
              </div>

              {passwordError && <p className="text-sm text-red-500">{passwordError}</p>}
              {passwordSuccess && <p className="text-sm text-green-500">{passwordSuccess}</p>}

              <button type="submit" className="btn btn-primary w-full mt-2">
                Cập nhật mật khẩu
              </button>
            </form>
          </div>
        </section>
      </div>
    </div>
  )
}

export default SettingsPage
