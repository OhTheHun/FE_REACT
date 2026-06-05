/* eslint-disable react-hooks/set-state-in-effect */
import { useState, useEffect } from 'react'
import { useToast } from '../../components/common/Toast'

export default function ShareNoteModal({ isOpen, onClose, note, onUpdateNote }) {
  const { show } = useToast()
  const [visibility, setVisibility] = useState(note?.visibility || 'private')
  const [collaborators, setCollaborators] = useState([
    { email: 'collab1@example.com', role: 'viewer' },
    { email: 'collab2@example.com', role: 'editor' },
  ])
  const [newCollab, setNewCollab] = useState('')
  const [collabRole, setCollabRole] = useState('viewer')

  useEffect(() => {
    if (note) {
      setVisibility(note.visibility || 'private')
    }
  }, [note])

  if (!isOpen || !note) return null

  const handleCopyLink = () => {
    const shareUrl = `${window.location.origin}/shared/note/${note.id}`
    navigator.clipboard.writeText(shareUrl)
    show({ type: 'success', title: 'Đã sao chép liên kết chia sẻ' })
  }

  const handleAddCollaborator = (e) => {
    e.preventDefault()
    if (!newCollab.trim()) return
    if (collaborators.some((c) => c.email === newCollab.trim())) {
      show({ type: 'warning', message: 'Người dùng này đã nằm trong danh sách chia sẻ' })
      return
    }
    setCollaborators([...collaborators, { email: newCollab.trim(), role: collabRole }])
    setNewCollab('')
    show({ type: 'success', message: `Đã thêm ${newCollab.trim()} làm người xem/chỉnh sửa` })
  }

  const handleRemoveCollaborator = (email) => {
    setCollaborators(collaborators.filter((c) => c.email !== email))
    show({ type: 'info', message: 'Đã xóa người chia sẻ' })
  }

  const handleSaveVisibility = () => {
    onUpdateNote({ ...note, visibility })
    show({ type: 'success', message: 'Đã cập nhật chế độ hiển thị ghi chú' })
    onClose()
  }

  return (
    <div className="modal-overlay" role="dialog" aria-modal="true">
      <div className="relative w-full max-w-lg bg-white dark:bg-slate-800 rounded-3xl shadow-modal p-6 animate-slide-up">
        <div className="flex items-center justify-between mb-4 pb-2 border-b border-slate-100 dark:border-slate-700">
          <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <span>👥</span>
            Chia sẻ ghi chú: "{note.title}"
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

        <div className="space-y-5">
          {/* Visibility options */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
              Chế độ hiển thị
            </label>
            <div className="grid grid-cols-3 gap-2">
              {[
                { value: 'private', label: 'Riêng tư', desc: 'Chỉ mình bạn xem', icon: '🔒' },
                { value: 'shared', label: 'Chia sẻ nhóm', desc: 'Những người được chọn', icon: '👥' },
                { value: 'public', label: 'Công khai', desc: 'Ai có link đều xem được', icon: '🌐' },
              ].map((opt) => (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => setVisibility(opt.value)}
                  className={`flex flex-col items-center justify-center p-3 rounded-2xl border-2 transition-all cursor-pointer text-center
                    ${visibility === opt.value
                      ? 'border-primary-500 bg-primary-50/50 dark:bg-primary-950/20 text-primary-900 dark:text-primary-100'
                      : 'border-slate-100 dark:border-slate-700 hover:border-slate-200 dark:hover:border-slate-600 text-slate-600 dark:text-slate-400'
                    }`}
                >
                  <span className="text-xl mb-1">{opt.icon}</span>
                  <span className="text-xs font-bold">{opt.label}</span>
                  <span className="text-[10px] text-slate-400 dark:text-slate-500 mt-0.5">{opt.desc}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Public Link option if public */}
          {visibility === 'public' && (
            <div className="p-3 bg-slate-50 dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-700 flex items-center justify-between gap-3">
              <div className="min-w-0 flex-1">
                <p className="text-xs font-semibold text-slate-700 dark:text-slate-300">Đường dẫn công khai</p>
                <p className="text-xs text-slate-400 truncate mt-0.5">{window.location.origin}/shared/note/{note.id}</p>
              </div>
              <button
                type="button"
                onClick={handleCopyLink}
                className="btn-primary-custom py-1.5 px-3 text-xs flex-shrink-0"
              >
                Sao chép link
              </button>
            </div>
          )}

          {/* Shared Collaborators list if Shared */}
          {visibility === 'shared' && (
            <div className="space-y-3">
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-400">
                Thành viên chia sẻ
              </label>

              {/* Add collaborator form */}
              <form onSubmit={handleAddCollaborator} className="flex gap-2">
                <input
                  type="email"
                  value={newCollab}
                  onChange={(e) => setNewCollab(e.target.value)}
                  placeholder="Nhập email người dùng..."
                  className="flex-1 px-3 py-2 text-sm rounded-xl border border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500/20"
                />
                <select
                  value={collabRole}
                  onChange={(e) => setCollabRole(e.target.value)}
                  className="text-xs px-2 py-2 rounded-xl border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 focus:outline-none cursor-pointer"
                >
                  <option value="viewer">Đọc (Viewer)</option>
                  <option value="editor">Sửa (Editor)</option>
                </select>
                <button
                  type="submit"
                  className="btn-primary-custom px-4 text-xs font-semibold"
                >
                  Thêm
                </button>
              </form>

              {/* Collaborators list */}
              <div className="max-h-[140px] overflow-y-auto space-y-1.5 pr-1">
                {collaborators.map((c) => (
                  <div key={c.email} className="flex items-center justify-between p-2 rounded-xl bg-slate-50 dark:bg-slate-900">
                    <div className="flex items-center gap-2 min-w-0">
                      <span className="w-2 h-2 rounded-full bg-primary-500"></span>
                      <span className="text-xs text-slate-700 dark:text-slate-300 truncate">{c.email}</span>
                      <span className="text-[10px] px-1.5 py-0.5 rounded-md bg-slate-200 dark:bg-slate-700 text-slate-500 dark:text-slate-400 capitalize">
                        {c.role === 'editor' ? 'Chỉnh sửa' : 'Chỉ xem'}
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleRemoveCollaborator(c.email)}
                      className="text-slate-400 hover:text-red-500 transition-colors p-1"
                    >
                      <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="flex justify-end gap-3 pt-3 border-t border-slate-100 dark:border-slate-700">
            <button
              type="button"
              onClick={onClose}
              className="btn-secondary-custom py-2 px-4 text-xs font-semibold"
            >
              Đóng
            </button>
            <button
              type="button"
              onClick={handleSaveVisibility}
              className="btn-primary-custom py-2 px-4 text-xs font-semibold"
            >
              Lưu thay đổi
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
