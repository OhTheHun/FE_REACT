import { useEffect, useCallback } from 'react'

const ICON_MAP = {
  danger: (
    <svg className="w-6 h-6 text-red-500 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
        d="M12 9v2m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
    </svg>
  ),
  warning: (
    <svg className="w-6 h-6 text-amber-500 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
        d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  ),
  info: (
    <svg className="w-6 h-6 text-blue-500 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
        d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  ),
}

/**
 * ConfirmModal – reusable confirmation dialog
 * Props:
 *  isOpen, onClose, onConfirm, title, message, variant ('danger'|'warning'|'info'), confirmText, cancelText
 */
export default function ConfirmModal({
  isOpen,
  onClose,
  onConfirm,
  title = 'Xác nhận',
  message = 'Bạn có chắc chắn muốn thực hiện thao tác này?',
  variant = 'danger',
  confirmText = 'Xác nhận',
  cancelText = 'Hủy',
}) {
  const handleKeyDown = useCallback(
    (e) => {
      if (e.key === 'Escape') onClose()
      if (e.key === 'Enter') { onConfirm(); onClose() }
    },
    [onClose, onConfirm],
  )

  useEffect(() => {
    if (!isOpen) return
    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [isOpen, handleKeyDown])

  if (!isOpen) return null

  const confirmBtnClass = variant === 'danger'
    ? 'btn-danger-custom'
    : variant === 'warning'
    ? 'bg-amber-500 hover:bg-amber-600 text-white inline-flex items-center gap-2 px-5 py-2.5 text-sm font-semibold rounded-xl transition-all duration-200 cursor-pointer'
    : 'btn-primary-custom'

  return (
    <div className="modal-overlay" role="dialog" aria-modal="true" aria-labelledby="confirm-title">
      <div
        className="relative w-full max-w-md bg-white dark:bg-slate-800 rounded-3xl shadow-modal p-6 animate-slide-up"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Icon + Title */}
        <div className="flex items-start gap-4 mb-4">
          {ICON_MAP[variant]}
          <div>
            <h3 id="confirm-title" className="text-lg font-semibold text-slate-900 dark:text-white">
              {title}
            </h3>
            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
              {message}
            </p>
          </div>
        </div>

        {/* Actions */}
        <div className="flex justify-end gap-3 mt-6">
          <button
            type="button"
            onClick={onClose}
            className="btn-secondary-custom"
            id="confirm-cancel-btn"
          >
            {cancelText}
          </button>
          <button
            type="button"
            onClick={() => { onConfirm(); onClose() }}
            className={confirmBtnClass}
            id="confirm-action-btn"
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  )
}
