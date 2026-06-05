import { useState } from 'react'
import { useToast } from '../components/common/Toast'
import ConfirmModal from '../components/common/ConfirmModal'

const PRESET_COLORS = [
  '#ef4444', '#f97316', '#eab308', '#22c55e',
  '#3b82f6', '#8b5cf6', '#ec4899', '#14b8a6',
  '#64748b', '#0ea5e9', '#a855f7', '#f43f5e',
]

function LabelBadge({ label, isActive, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold transition-all cursor-pointer border-2
        ${isActive ? 'border-current scale-105 shadow-md' : 'border-transparent hover:scale-102'}`}
      style={{
        backgroundColor: label.color + '22',
        color: label.color,
        borderColor: isActive ? label.color : 'transparent',
      }}
    >
      <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ backgroundColor: label.color }} />
      {label.name}
    </button>
  )
}

export default function LabelsPage() {
  const { show } = useToast()
  const [labels, setLabels] = useState([
    { id: 'lbl-1', name: 'Khẩn cấp', color: '#ef4444', noteCount: 3 },
    { id: 'lbl-2', name: 'Quan trọng', color: '#eab308', noteCount: 7 },
    { id: 'lbl-3', name: 'Tài liệu', color: '#3b82f6', noteCount: 12 },
    { id: 'lbl-4', name: 'Học tập', color: '#22c55e', noteCount: 5 },
    { id: 'lbl-5', name: 'Ý tưởng', color: '#8b5cf6', noteCount: 9 },
  ])
  const [activeLabel, setActiveLabel] = useState(null)
  const [isCreating, setIsCreating] = useState(false)
  const [newName, setNewName] = useState('')
  const [newColor, setNewColor] = useState('#3b82f6')
  const [editingId, setEditingId] = useState(null)
  const [editName, setEditName] = useState('')
  const [editColor, setEditColor] = useState('')
  const [deleteTarget, setDeleteTarget] = useState(null)

  const handleCreate = (e) => {
    e.preventDefault()
    if (!newName.trim()) return
    const newLabel = {
      id: `lbl-${Date.now()}`,
      name: newName.trim(),
      color: newColor,
      noteCount: 0,
    }
    setLabels([...labels, newLabel])
    setNewName('')
    setIsCreating(false)
    show({ type: 'success', title: 'Đã tạo nhãn', message: `Nhãn "${newLabel.name}" đã được tạo.` })
  }

  const handleStartEdit = (label) => {
    setEditingId(label.id)
    setEditName(label.name)
    setEditColor(label.color)
  }

  const handleSaveEdit = (e) => {
    e.preventDefault()
    if (!editName.trim()) return
    setLabels(labels.map((l) => l.id === editingId ? { ...l, name: editName.trim(), color: editColor } : l))
    setEditingId(null)
    show({ type: 'success', message: 'Đã cập nhật nhãn.' })
  }

  const handleDelete = () => {
    const label = labels.find((l) => l.id === deleteTarget)
    setLabels(labels.filter((l) => l.id !== deleteTarget))
    if (activeLabel === deleteTarget) setActiveLabel(null)
    setDeleteTarget(null)
    show({ type: 'info', message: `Đã xóa nhãn "${label?.name}".` })
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white">Nhãn dán</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Tổ chức ghi chú bằng nhãn màu sắc để tìm kiếm nhanh hơn.
          </p>
        </div>
        <button
          type="button"
          id="create-label-btn"
          onClick={() => { setIsCreating(true); setEditingId(null) }}
          className="btn-primary-custom"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Tạo nhãn
        </button>
      </div>

      {/* All labels overview */}
      <div className="rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 p-6">
        <h2 className="text-sm font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-4">
          Tất cả nhãn ({labels.length})
        </h2>
        {labels.length === 0 ? (
          <div className="text-center py-10">
            <p className="text-3xl mb-2">🏷️</p>
            <p className="text-sm text-slate-400 dark:text-slate-500">Chưa có nhãn nào. Hãy tạo nhãn đầu tiên!</p>
          </div>
        ) : (
          <div className="flex flex-wrap gap-3">
            {labels.map((label) => (
              <LabelBadge
                key={label.id}
                label={label}
                isActive={activeLabel === label.id}
                onClick={() => setActiveLabel(activeLabel === label.id ? null : label.id)}
              />
            ))}
          </div>
        )}
      </div>

      {/* Create form */}
      {isCreating && (
        <div className="rounded-2xl border-2 border-primary-300 dark:border-primary-600 bg-primary-50 dark:bg-primary-900/20 p-5 animate-slide-up">
          <h3 className="font-bold text-slate-900 dark:text-white mb-4">Tạo nhãn mới</h3>
          <form onSubmit={handleCreate} className="space-y-4">
            <div>
              <label className="form-label">Tên nhãn</label>
              <input
                type="text"
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                placeholder="Ví dụ: Khẩn cấp, Dự án A..."
                className="form-input"
                autoFocus
              />
            </div>
            <div>
              <label className="form-label">Màu sắc</label>
              <div className="flex gap-2 flex-wrap">
                {PRESET_COLORS.map((color) => (
                  <button
                    key={color}
                    type="button"
                    onClick={() => setNewColor(color)}
                    className={`w-8 h-8 rounded-full transition-transform hover:scale-110 border-2
                      ${newColor === color ? 'border-slate-900 dark:border-white scale-110' : 'border-transparent'}`}
                    style={{ backgroundColor: color }}
                  />
                ))}
              </div>
              {/* Preview */}
              <div className="mt-3">
                <span className="text-xs text-slate-500 dark:text-slate-400 mb-2 block">Xem trước:</span>
                <span
                  className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold"
                  style={{ backgroundColor: newColor + '22', color: newColor }}
                >
                  <span className="w-2 h-2 rounded-full" style={{ backgroundColor: newColor }} />
                  {newName || 'Nhãn mẫu'}
                </span>
              </div>
            </div>
            <div className="flex gap-3 justify-end">
              <button type="button" onClick={() => setIsCreating(false)} className="btn-secondary-custom">Hủy</button>
              <button type="submit" className="btn-primary-custom">Tạo nhãn</button>
            </div>
          </form>
        </div>
      )}

      {/* Labels table */}
      <div className="rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 overflow-hidden">
        <table className="w-full table-custom">
          <thead className="bg-slate-50 dark:bg-slate-800/50">
            <tr>
              <th>Nhãn</th>
              <th>Màu</th>
              <th>Ghi chú</th>
              <th className="text-right">Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {labels.map((label) => (
              <tr key={label.id}>
                <td>
                  {editingId === label.id ? (
                    <form onSubmit={handleSaveEdit} className="flex items-center gap-2">
                      <input
                        type="text"
                        value={editName}
                        onChange={(e) => setEditName(e.target.value)}
                        className="form-input py-1 text-xs"
                        autoFocus
                      />
                      <button type="submit" className="text-xs font-bold text-primary-600 hover:text-primary-700 dark:text-primary-400 cursor-pointer whitespace-nowrap">
                        ✓ Lưu
                      </button>
                      <button type="button" onClick={() => setEditingId(null)} className="text-xs text-slate-400 hover:text-slate-600 cursor-pointer">
                        ✕
                      </button>
                    </form>
                  ) : (
                    <span
                      className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold"
                      style={{ backgroundColor: label.color + '22', color: label.color }}
                    >
                      <span className="w-2 h-2 rounded-full" style={{ backgroundColor: label.color }} />
                      {label.name}
                    </span>
                  )}
                </td>
                <td>
                  {editingId === label.id ? (
                    <div className="flex gap-1.5 flex-wrap">
                      {PRESET_COLORS.map((c) => (
                        <button
                          key={c}
                          type="button"
                          onClick={() => setEditColor(c)}
                          className={`w-5 h-5 rounded-full border-2 transition-transform hover:scale-110
                            ${editColor === c ? 'border-slate-700 dark:border-white scale-110' : 'border-transparent'}`}
                          style={{ backgroundColor: c }}
                        />
                      ))}
                    </div>
                  ) : (
                    <span className="w-5 h-5 rounded-full block" style={{ backgroundColor: label.color }} />
                  )}
                </td>
                <td>
                  <span className="text-slate-500 dark:text-slate-400">{label.noteCount} ghi chú</span>
                </td>
                <td className="text-right">
                  <div className="flex items-center justify-end gap-2">
                    {editingId !== label.id && (
                      <button
                        type="button"
                        onClick={() => handleStartEdit(label)}
                        className="text-xs font-medium text-slate-500 dark:text-slate-400 hover:text-primary-600 dark:hover:text-primary-400 cursor-pointer transition-colors"
                      >
                        Sửa
                      </button>
                    )}
                    <button
                      type="button"
                      onClick={() => setDeleteTarget(label.id)}
                      className="text-xs font-medium text-red-400 hover:text-red-600 cursor-pointer transition-colors"
                    >
                      Xóa
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Delete confirm */}
      <ConfirmModal
        isOpen={deleteTarget !== null}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
        title="Xóa nhãn"
        message="Nhãn này sẽ bị xóa khỏi tất cả các ghi chú. Bạn có chắc không?"
        variant="danger"
        confirmText="Xóa"
        cancelText="Hủy"
      />
    </div>
  )
}
