/* eslint-disable react-hooks/set-state-in-effect */
import { useState, useEffect } from 'react'

export default function NotePasswordModal({ isOpen, onClose, onConfirm, mode = 'lock' }) {
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [error, setError] = useState('')

  useEffect(() => {
    if (isOpen) {
      setPassword('')
      setConfirmPassword('')
      setError('')
    }
  }, [isOpen])

  if (!isOpen) return null

  const handleSubmit = (e) => {
    e.preventDefault()
    setError('')

    if (!password) {
      setError('Vui lòng nhập mật khẩu')
      return
    }

    if (mode === 'lock' && password !== confirmPassword) {
      setError('Mật khẩu xác nhận không khớp')
      return
    }

    onConfirm(password)
    onClose()
  }

  return (
    <div className="modal-overlay" role="dialog" aria-modal="true">
      <div className="relative w-full max-w-md bg-white dark:bg-slate-800 rounded-3xl shadow-modal p-6 animate-slide-up">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <span>🔒</span>
            {mode === 'lock' ? 'Bảo vệ ghi chú' : mode === 'unlock' ? 'Mở khóa ghi chú' : 'Xóa mật khẩu bảo vệ'}
          </h3>
          <button
            type="button"
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {mode === 'lock' && (
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Đặt mật khẩu để bảo vệ ghi chú này. Bạn sẽ cần nhập mật khẩu này để đọc hoặc chỉnh sửa ghi chú trong tương lai.
            </p>
          )}

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Mật khẩu
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Nhập mật khẩu..."
              className="w-full px-3 py-2 text-sm rounded-xl border border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500/20"
              autoFocus
            />
          </div>

          {mode === 'lock' && (
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Xác nhận mật khẩu
              </label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Nhập lại mật khẩu..."
                className="w-full px-3 py-2 text-sm rounded-xl border border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500/20"
              />
            </div>
          )}

          {error && (
            <div className="text-xs text-red-500 font-medium">
              ⚠️ {error}
            </div>
          )}

          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="btn-secondary-custom py-2 px-4 text-xs font-semibold"
            >
              Hủy
            </button>
            <button
              type="submit"
              className="btn-primary-custom py-2 px-4 text-xs font-semibold"
            >
              {mode === 'lock' ? 'Bảo vệ' : mode === 'unlock' ? 'Mở khóa' : 'Gỡ khóa'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
