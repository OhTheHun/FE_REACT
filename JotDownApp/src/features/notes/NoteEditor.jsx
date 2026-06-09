 /* eslint-disable react-hooks/set-state-in-effect, react-hooks/exhaustive-deps */
import { useState, useEffect, useCallback, useRef } from 'react'
import { useToast } from '../../components/common/Toast'
import ShareNoteModal from './ShareNoteModal'
import NotePasswordModal from './NotePasswordModal'

const NOTE_COLORS = [
  { hex: '#ffffff', label: 'Mặc định', class: 'bg-white border-slate-300' },
  { hex: '#FEF3C7', label: 'Vàng', class: 'bg-amber-100' },
  { hex: '#D1FAE5', label: 'Xanh lá', class: 'bg-emerald-100' },
  { hex: '#DBEAFE', label: 'Xanh dương', class: 'bg-blue-100' },
  { hex: '#FCE7F3', label: 'Hồng', class: 'bg-pink-100' },
  { hex: '#FFEDD5', label: 'Cam', class: 'bg-orange-100' },
  { hex: '#EDE9FE', label: 'Tím nhạt', class: 'bg-violet-100' },
]

export default function NoteEditor({
  note,
  onSave,
  allLabels = [],
  onNoteUpdated,
  onTogglePin,
  onToggleFavorite,
  onUpdateProtection,
}) {
  const { show } = useToast()
  const [title, setTitle] = useState(note?.title || '')
  const [content, setContent] = useState(note?.content || '')
  const [color, setColor] = useState(note?.color || '#ffffff')
  const [isPinned, setIsPinned] = useState(note?.is_pinned || false)
  const [isFavorite, setIsFavorite] = useState(note?.is_favorite || false)
  const [visibility, setVisibility] = useState(note?.visibility || 'private')
  const [noteLabels, setNoteLabels] = useState(note?.labels || [])
  const [isProtected, setIsProtected] = useState(note?.is_protected || false)

  const [isShareModalOpen, setIsShareModalOpen] = useState(false)
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false)
  const [passwordModalMode, setPasswordModalMode] = useState('lock') // 'lock' | 'remove'

  const [isDirty, setIsDirty] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [lastSaved, setLastSaved] = useState(null)
  const autoSaveTimer = useRef(null)

  // Reset when note changes
  useEffect(() => {
    setTitle(note?.title || '')
    setContent(note?.content || '')
    setColor(note?.color || '#ffffff')
    setIsPinned(note?.is_pinned || false)
    setIsFavorite(note?.is_favorite || false)
    setVisibility(note?.visibility || 'private')
    setNoteLabels(note?.labels || [])
    setIsProtected(note?.is_protected || false)
    setIsDirty(false)
    setIsSaving(false)
  }, [note?.id])

  const save = useCallback(async () => {
    if (!note || !title.trim() || isSaving) return false

    setIsSaving(true)

    try {
      const saved = await onSave?.({
        ...note,
        title,
        content,
        color,
        is_pinned: isPinned,
        is_favorite: isFavorite,
        visibility,
        labels: noteLabels,
        is_protected: isProtected,
      })
      setIsDirty(false)
      setLastSaved(new Date())
      if (saved) setVisibility(saved.visibility || visibility)
      return true
    } catch (err) {
      show({ type: 'error', message: err.message || 'Không thể lưu ghi chú.' })
      return false
    } finally {
      setIsSaving(false)
    }
  }, [note, title, content, color, isPinned, isFavorite, visibility, noteLabels, isProtected, isSaving, onSave, show])

  // Auto-save with debounce
  useEffect(() => {
    if (!isDirty) return
    clearTimeout(autoSaveTimer.current)
    autoSaveTimer.current = setTimeout(async () => {
      const saved = await save()
      if (!saved) return
      show({ type: 'success', message: 'Tự động lưu thành công' })
    }, 1500)
    return () => clearTimeout(autoSaveTimer.current)
  }, [isDirty, save, show])

  const markDirty = (fn) => (...args) => {
    fn(...args)
    setIsDirty(true)
  }

  // --- Pin: gọi API riêng, không qua auto-save chung ---
  const handleTogglePin = async () => {
    if (!note) return
    const next = !isPinned
    setIsPinned(next)
    try {
      const saved = await onTogglePin?.(note.id, next)
      if (saved) setIsPinned(Boolean(saved.is_pinned))
      show({ type: 'success', message: next ? 'Đã ghim ghi chú' : 'Đã bỏ ghim ghi chú' })
      onNoteUpdated?.()
    } catch (err) {
      setIsPinned(!next)
      show({ type: 'error', message: err.message || 'Không thể cập nhật trạng thái ghim.' })
    }
  }

  // --- Favorite: gọi API riêng ---
  const handleToggleFavorite = async () => {
    if (!note) return
    const next = !isFavorite
    setIsFavorite(next)
    try {
      const saved = await onToggleFavorite?.(note.id, next)
      if (saved) setIsFavorite(Boolean(saved.is_favorite))
      show({ type: 'success', message: next ? 'Đã thêm vào yêu thích' : 'Đã bỏ yêu thích' })
      onNoteUpdated?.()
    } catch (err) {
      setIsFavorite(!next)
      show({ type: 'error', message: err.message || 'Không thể cập nhật yêu thích.' })
    }
  }

  // --- Protection: throw lỗi lên NotePasswordModal để hiển thị inline ---
  const handlePasswordConfirm = async (password) => {
    if (!note) return
    const next = passwordModalMode === 'lock'
    // Không try/catch ở đây — để lỗi nổi lên NotePasswordModal (sai mật khẩu, v.v.)
    const saved = await onUpdateProtection?.(note.id, next, password)
    setIsProtected(Boolean(saved?.is_protected ?? next))
    show({
      type: next ? 'success' : 'info',
      message: next ? 'Đã khóa bảo vệ ghi chú này' : 'Đã gỡ bỏ khóa bảo vệ',
    })
    onNoteUpdated?.()
  }

  const handleToggleLabel = (labelId) => {
    let newLabels
    if (noteLabels.includes(labelId)) {
      newLabels = noteLabels.filter((id) => id !== labelId)
    } else {
      newLabels = [...noteLabels, labelId]
    }
    setNoteLabels(newLabels)
    setIsDirty(true)
  }

  if (!note) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-center py-20">
        <div className="w-20 h-20 rounded-3xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center mb-4">
          <svg className="w-10 h-10 text-slate-300 dark:text-slate-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
              d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
          </svg>
        </div>
        <p className="text-lg font-semibold text-slate-400 dark:text-slate-500">Chưa chọn ghi chú</p>
        <p className="text-sm text-slate-400 dark:text-slate-600 mt-1">Chọn một ghi chú hoặc tạo mới để bắt đầu</p>
      </div>
    )
  }

  return (
    <div className="flex flex-col h-full">
      {/* Toolbar */}
      <div className="flex flex-wrap items-center gap-2 pb-4 border-b border-slate-100 dark:border-slate-700">
        {/* Pin */}
        <button
          type="button"
          id="editor-pin-btn"
          onClick={handleTogglePin}
          title={isPinned ? 'Bỏ ghim' : 'Ghim ghi chú'}
          className={`p-2 rounded-xl transition-colors cursor-pointer ${isPinned ? 'bg-amber-100 dark:bg-amber-900/30 text-amber-600' : 'hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-400'}`}
        >
          <svg className="w-4 h-4" fill={isPinned ? 'currentColor' : 'none'} viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
          </svg>
        </button>

        {/* Favorite */}
        <button
          type="button"
          id="editor-favorite-btn"
          onClick={handleToggleFavorite}
          title={isFavorite ? 'Bỏ yêu thích' : 'Yêu thích'}
          className={`p-2 rounded-xl transition-colors cursor-pointer ${isFavorite ? 'bg-red-100 dark:bg-red-900/30 text-red-500' : 'hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-400'}`}
        >
          <svg className="w-4 h-4" fill={isFavorite ? 'currentColor' : 'none'} viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
              d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
          </svg>
        </button>

        {/* Password Lock */}
        <button
          type="button"
          onClick={() => {
            setPasswordModalMode(isProtected ? 'remove' : 'lock')
            setIsPasswordModalOpen(true)
          }}
          title={isProtected ? 'Gỡ khóa mật khẩu' : 'Đặt mật khẩu khóa'}
          className={`p-2 rounded-xl transition-colors cursor-pointer ${isProtected ? 'bg-slate-100 dark:bg-slate-700 text-slate-800 dark:text-white' : 'hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-400'}`}
        >
          <span>{isProtected ? '🔒' : '🔓'}</span>
        </button>

        {/* Share Button */}
        <button
          type="button"
          onClick={() => setIsShareModalOpen(true)}
          title="Chia sẻ ghi chú"
          className="p-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-400 transition-colors cursor-pointer"
        >
          <span>👥</span>
        </button>

        {/* Color picker */}
        <div className="flex items-center gap-1 px-2 py-1 rounded-xl bg-slate-50 dark:bg-slate-800">
          {NOTE_COLORS.map((c) => (
            <button
              key={c.hex}
              type="button"
              title={c.label}
              onClick={() => { setColor(c.hex); setIsDirty(true) }}
              className={`w-5 h-5 rounded-full border-2 cursor-pointer transition-transform hover:scale-110 ${c.class}
                ${color === c.hex ? 'border-primary-500 ring-2 ring-primary-500/30 ring-offset-1' : 'border-transparent'}`}
            />
          ))}
        </div>

        {/* Save status */}
        <div className="ml-auto flex items-center gap-2">
          {isDirty && (
            <span className="text-xs text-amber-500 flex items-center gap-1">
              <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Chưa lưu
            </span>
          )}
          {!isDirty && lastSaved && (
            <span className="text-xs text-emerald-500">Đã lưu</span>
          )}
          <button
            type="button"
            id="editor-save-btn"
            onClick={save}
            disabled={isSaving}
            className="btn-primary-custom py-1.5 text-xs"
          >
            {isSaving ? 'Đang lưu...' : 'Lưu'}
          </button>
        </div>
      </div>

      {/* Labels Picker Selector */}
      {allLabels.length > 0 && (
        <div className="flex flex-wrap items-center gap-1.5 py-2 px-1 border-b border-slate-100 dark:border-slate-800/60">
          <span className="text-[10px] font-bold text-slate-400 uppercase mr-1">Nhãn:</span>
          {allLabels.map((lbl) => {
            const active = noteLabels.includes(lbl.id)
            return (
              <button
                key={lbl.id}
                type="button"
                onClick={() => handleToggleLabel(lbl.id)}
                className={`px-2.5 py-0.5 rounded-full text-[10px] font-semibold transition-all cursor-pointer flex items-center gap-1
                  ${active
                    ? 'text-white'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200'}`}
                style={{ backgroundColor: active ? lbl.color : undefined }}
              >
                <span>🏷️</span>
                <span>{lbl.name}</span>
              </button>
            )
          })}
        </div>
      )}

      {/* Title input */}
      <input
        id="editor-title-input"
        type="text"
        value={title}
        onChange={(e) => markDirty(setTitle)(e.target.value)}
        placeholder="Tiêu đề ghi chú..."
        className="w-full text-2xl font-bold text-slate-900 dark:text-white bg-transparent border-none outline-none placeholder-slate-300 dark:placeholder-slate-600 py-4"
      />

      {/* Content textarea */}
      <textarea
        id="editor-content-textarea"
        value={content}
        onChange={(e) => markDirty(setContent)(e.target.value)}
        placeholder="Bắt đầu viết ghi chú..."
        className="flex-1 w-full resize-none text-sm text-slate-700 dark:text-slate-300 bg-transparent border-none outline-none placeholder-slate-300 dark:placeholder-slate-600 leading-relaxed"
      />

      {/* Modals */}
      <ShareNoteModal
        isOpen={isShareModalOpen}
        onClose={() => setIsShareModalOpen(false)}
        note={{ ...note, visibility }}
        onUpdateNote={(updatedNote) => {
          setVisibility(updatedNote.visibility)
          onNoteUpdated?.()
        }}
      />

      <NotePasswordModal
        isOpen={isPasswordModalOpen}
        onClose={() => setIsPasswordModalOpen(false)}
        onConfirm={handlePasswordConfirm}
        note={note}
        mode={passwordModalMode}
      />
    </div>
  )
}
