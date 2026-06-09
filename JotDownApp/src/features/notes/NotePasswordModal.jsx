/* eslint-disable react-hooks/set-state-in-effect */
import { useState, useEffect } from 'react'

export default function NotePasswordModal({ isOpen, onClose, onConfirm, mode = 'lock' }) {
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [error, setError] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    if (isOpen) {
      setPassword('')
      setConfirmPassword('')
      setError('')
      setIsSubmitting(false)
    }
  }, [isOpen])

  if (!isOpen) return null

  const handleSubmit = async (e) => {
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

    setIsSubmitting(true)
    try {
      // onConfirm là async — chờ kết quả, nếu thành công mới đóng
      await onConfirm(password)
      onClose()
    } catch (err) {
      // Hiển thị lỗi từ API (vd: sai mật khẩu)
      setError(err.message || 'Mật khẩu không đúng hoặc có lỗi xảy ra.')
    } finally {
      setIsSubmitting(false)
    }
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
            disabled={isSubmitting}
            className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors disabled:opacity-50"
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
          {mode === 'remove' && (
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Nhập mật khẩu hiện tại để xác nhận và gỡ bỏ bảo vệ ghi chú.
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
              disabled={isSubmitting}
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
                disabled={isSubmitting}
              />
            </div>
          )}

          {error && (
            <div className="text-xs text-red-500 font-medium bg-red-50 dark:bg-red-900/20 px-3 py-2 rounded-xl border border-red-200 dark:border-red-800">
              ⚠️ {error}
            </div>
          )}

          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="btn-secondary-custom py-2 px-4 text-xs font-semibold disabled:opacity-60"
            >
              Hủy
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="btn-primary-custom py-2 px-4 text-xs font-semibold disabled:opacity-60"
            >
              {isSubmitting
                ? 'Đang xử lý...'
                : mode === 'lock'
                ? 'Bảo vệ'
                : mode === 'unlock'
                ? 'Mở khóa'
                : 'Gỡ khóa'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
