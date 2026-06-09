import { useState } from 'react'
import { useToast } from '../../components/common/Toast'

const LABEL_COLORS = [
  { hex: '#ef4444', name: 'Đỏ' },
  { hex: '#f97316', name: 'Cam' },
  { hex: '#eab308', name: 'Vàng' },
  { hex: '#22c55e', name: 'Xanh lá' },
  { hex: '#3b82f6', name: 'Xanh dương' },
  { hex: '#a855f7', name: 'Tím' },
  { hex: '#ec4899', name: 'Hồng' },
  { hex: '#64748b', name: 'Xám' },
]

export default function LabelManager({ isOpen, onClose, labels = [], onAddLabel, onDeleteLabel }) {
  const { show } = useToast()
  const [newLabelName, setNewLabelName] = useState('')
  const [newLabelColor, setNewLabelColor] = useState('#3b82f6')
  const [isCreating, setIsCreating] = useState(false)

  if (!isOpen) return null

  const handleCreate = async (e) => {
    e.preventDefault()
    if (!newLabelName.trim()) return

    if (labels.some((l) => l.name.toLowerCase() === newLabelName.trim().toLowerCase())) {
      show({ type: 'warning', message: 'Tên nhãn đã tồn tại' })
      return
    }

    setIsCreating(true)
    try {
      await onAddLabel({ name: newLabelName.trim(), color: newLabelColor })
      setNewLabelName('')
      show({ type: 'success', message: 'Đã tạo nhãn mới thành công' })
    } catch (err) {
      show({ type: 'error', message: err.message || 'Không thể tạo nhãn.' })
    } finally {
      setIsCreating(false)
    }
  }

  const handleDelete = async (id) => {
    try {
      await onDeleteLabel(id)
    } catch (err) {
      show({ type: 'error', message: err.message || 'Không thể xóa nhãn.' })
    }
  }

  return (
    <div className="modal-overlay" role="dialog" aria-modal="true">
      <div className="relative w-full max-w-md bg-white dark:bg-slate-800 rounded-3xl shadow-modal p-6 animate-slide-up">
        <div className="flex items-center justify-between mb-4 pb-2 border-b border-slate-100 dark:border-slate-700">
          <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <span>🏷️</span>
            Quản lý nhãn (Labels)
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

        <div className="space-y-4">
          {/* Create form */}
          <form onSubmit={handleCreate} className="space-y-3 p-3 bg-slate-50 dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800">
            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Tạo nhãn mới</h4>
            <div className="flex gap-2">
              <input
                type="text"
                value={newLabelName}
                onChange={(e) => setNewLabelName(e.target.value)}
                placeholder="Tên nhãn mới..."
                className="flex-1 px-3 py-1.5 text-xs rounded-xl border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none"
              />
              <button
                type="submit"
                disabled={isCreating}
                className="btn-primary-custom py-1.5 px-3 text-xs font-semibold disabled:opacity-60"
              >
                {isCreating ? '...' : 'Tạo'}
              </button>
            </div>
            {/* Color picker */}
            <div>
              <p className="text-[10px] font-semibold text-slate-500 mb-1">Màu sắc nhãn:</p>
              <div className="flex flex-wrap gap-1.5">
                {LABEL_COLORS.map((c) => (
                  <button
                    key={c.hex}
                    type="button"
                    title={c.name}
                    onClick={() => setNewLabelColor(c.hex)}
                    style={{ backgroundColor: c.hex }}
                    className={`w-5 h-5 rounded-full transition-transform hover:scale-110 cursor-pointer border-2
                      ${newLabelColor === c.hex ? 'border-slate-950 dark:border-white scale-110 ring-2 ring-primary-500/20' : 'border-transparent'}`}
                  />
                ))}
              </div>
            </div>
          </form>

          {/* Labels list */}
          <div className="space-y-2">
            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Danh sách nhãn hiện tại ({labels.length})</h4>
            <div className="max-h-[180px] overflow-y-auto space-y-1.5 pr-1">
              {labels.length === 0 ? (
                <p className="text-xs text-slate-400 text-center py-4">Chưa có nhãn nào được tạo.</p>
              ) : (
                labels.map((l) => (
                  <div key={l.id} className="flex items-center justify-between p-2 rounded-xl bg-slate-50 dark:bg-slate-900/50 border border-slate-100 dark:border-slate-800">
                    <span className="flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: l.color }} />
                      <span className="text-xs font-medium text-slate-700 dark:text-slate-300">{l.name}</span>
                      {l.notes_count != null && (
                        <span className="text-[10px] text-slate-400">({l.notes_count})</span>
                      )}
                    </span>
                    <button
                      type="button"
                      onClick={() => handleDelete(l.id)}
                      className="text-slate-400 hover:text-red-500 transition-colors p-1"
                    >
                      <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>

          <div className="flex justify-end pt-2">
            <button
              type="button"
              onClick={onClose}
              className="btn-secondary-custom py-2 px-4 text-xs font-semibold"
            >
              Đóng
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
