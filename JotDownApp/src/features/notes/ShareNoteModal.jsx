/* eslint-disable react-hooks/set-state-in-effect */
import { useState, useEffect } from 'react'
import { useToast } from '../../components/common/Toast'
import { shareNote, addCollaborator } from './notesService'

export default function ShareNoteModal({ isOpen, onClose, note, onUpdateNote }) {
  const { show } = useToast()
  const [visibility, setVisibility] = useState(note?.visibility || 'private')
  const [shareUrl, setShareUrl] = useState(note?.share_url || '')
  const [newCollab, setNewCollab] = useState('')
  const [collabRole, setCollabRole] = useState('view')
  const [isSaving, setIsSaving] = useState(false)
  const [isAddingCollab, setIsAddingCollab] = useState(false)

  useEffect(() => {
    if (note) {
      setVisibility(note.visibility || 'private')
      setShareUrl(note.share_url || '')
    }
  }, [note])

  if (!isOpen || !note) return null

  const handleCopyLink = () => {
    const url = shareUrl || `${window.location.origin}/shared/${note.id}`
    navigator.clipboard.writeText(url)
    show({ type: 'success', title: 'Đã sao chép liên kết chia sẻ' })
  }

  const handleSaveVisibility = async () => {
    setIsSaving(true)
    try {
      const result = await shareNote(note.id, visibility)
      if (result.share_url) setShareUrl(result.share_url)
      onUpdateNote({ ...note, visibility, share_url: result.share_url })
      show({ type: 'success', message: 'Đã cập nhật chế độ hiển thị ghi chú' })
      onClose()
    } catch (err) {
      show({ type: 'error', message: err.message || 'Không thể cập nhật chế độ hiển thị.' })
    } finally {
      setIsSaving(false)
    }
  }

  const handleAddCollaborator = async (e) => {
    e.preventDefault()
    if (!newCollab.trim()) return
    setIsAddingCollab(true)
    try {
      await addCollaborator(note.id, newCollab.trim(), collabRole)
      show({ type: 'success', message: `Đã chia sẻ với ${newCollab.trim()}` })
      setNewCollab('')
    } catch (err) {
      show({ type: 'error', message: err.message || 'Không thể chia sẻ ghi chú.' })
    } finally {
      setIsAddingCollab(false)
    }
  }

  return (
    <div className="modal-overlay" role="dialog" aria-modal="true">
      <div className="relative w-full max-w-lg bg-white dark:bg-slate-800 rounded-3xl shadow-modal p-6 animate-slide-up">
        <div className="flex items-center justify-between mb-4 pb-2 border-b border-slate-100 dark:border-slate-700">
          <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <span>👥</span>
            Chia sẻ ghi chú: &quot;{note.title}&quot;
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
            <div className="grid grid-cols-2 gap-2">
              {[
                { value: 'private', label: 'Riêng tư', desc: 'Chỉ mình bạn xem', icon: '🔒' },
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

          {/* Public share link */}
          {visibility === 'public' && (
            <div className="p-3 bg-slate-50 dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-700 flex items-center justify-between gap-3">
              <div className="min-w-0 flex-1">
                <p className="text-xs font-semibold text-slate-700 dark:text-slate-300">Đường dẫn công khai</p>
                <p className="text-xs text-slate-400 truncate mt-0.5">
                  {shareUrl || `${window.location.origin}/shared/${note.id}`}
                </p>
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

          {/* Chia sẻ riêng theo email */}
          <div className="space-y-3">
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-400">
              Chia sẻ với người dùng cụ thể
            </label>
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
                <option value="view">Đọc</option>
                <option value="edit">Chỉnh sửa</option>
              </select>
              <button
                type="submit"
                disabled={isAddingCollab}
                className="btn-primary-custom px-4 text-xs font-semibold disabled:opacity-60"
              >
                {isAddingCollab ? '...' : 'Mời'}
              </button>
            </form>
          </div>

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
              disabled={isSaving}
              className="btn-primary-custom py-2 px-4 text-xs font-semibold disabled:opacity-60"
            >
              {isSaving ? 'Đang lưu...' : 'Lưu thay đổi'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
