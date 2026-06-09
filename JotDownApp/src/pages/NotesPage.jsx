/* eslint-disable react-hooks/set-state-in-effect */
import { useState, useMemo, useEffect, useCallback } from 'react'
import NoteCard from '../features/notes/NoteCard'
import NoteEditor from '../features/notes/NoteEditor'
import ConfirmModal from '../components/common/ConfirmModal'
import WorkspaceSidebar from '../features/notes/WorkspaceSidebar'
import LabelManager from '../features/notes/LabelManager'
import { useNoteWorkspace } from '../hooks/useNoteWorkspace'
import { useToast } from '../components/common/Toast'
import {
  fetchFolders,
  deleteFolder as deleteFolderApi,
  fetchLabels,
  createLabel as createLabelApi,
  deleteLabel as deleteLabelApi,
} from '../features/notes/notesService'
import {
  createWorkspaceFolder,
  fetchWorkspaceFolders,
  fetchWorkspaces,
} from '../features/workspaces/workspaceService'

const ALL_WORKSPACES = { id: '', name: 'Tất cả không gian' }

const FILTER_OPTIONS = [
  { value: 'all', label: 'Tất cả' },
  { value: 'pinned', label: 'Đã ghim' },
  { value: 'favorite', label: 'Yêu thích' },
  { value: 'private', label: 'Riêng tư' },
  { value: 'public', label: 'Công khai' },
]

export default function NotesPage() {
  const { show } = useToast()

  // Workspaces (giữ state cục bộ vì workspace API có thể phát triển riêng)
  const [workspaces, setWorkspaces] = useState([])
  const [activeWorkspaceId, setActiveWorkspaceId] = useState('')

  // Folders — load từ API
  const [folders, setFolders] = useState([])
  const [activeFolderId, setActiveFolderId] = useState(null)

  // Labels — load từ API
  const [labels, setLabels] = useState([])
  const [activeLabelId, setActiveLabelId] = useState(null)

  const [isTrashActive, setIsTrashActive] = useState(false)
  const [isLabelManagerOpen, setIsLabelManagerOpen] = useState(false)
  const [showWorkspaceSidebar, setShowWorkspaceSidebar] = useState(true)

  // Search & Filter
  const [search, setSearch] = useState('')
  const [filter, setFilter] = useState('all')
  const [view, setView] = useState('list') // 'list' | 'grid'
  const [deleteTarget, setDeleteTarget] = useState(null)

  // --- Load Folders từ API ---
  const loadWorkspaces = useCallback(async () => {
    try {
      const data = await fetchWorkspaces()
      setWorkspaces(data)
    } catch (err) {
      show({ type: 'error', message: err.message || 'Khong the tai danh sach workspace.' })
    }
  }, [show])

  const loadFolders = useCallback(async () => {
    try {
      const data = activeWorkspaceId
        ? await fetchWorkspaceFolders(activeWorkspaceId)
        : await fetchFolders()
      setFolders(data)
    } catch (err) {
      show({ type: 'error', message: err.message || 'Khong the tai danh sach thu muc.' })
    }
  }, [activeWorkspaceId, show])

  // --- Load Labels từ API ---
  const loadLabels = useCallback(async () => {
    try {
      const data = await fetchLabels()
      setLabels(data)
    } catch (err) {
      console.error('Không thể tải danh sách nhãn:', err)
    }
  }, [])

  useEffect(() => {
    loadWorkspaces()
  }, [loadWorkspaces])

  useEffect(() => {
    loadFolders()
  }, [loadFolders])

  useEffect(() => {
    loadLabels()
  }, [loadLabels])

  // --- Build bộ lọc để truyền sang API ---
  const apiFilters = useMemo(() => {
    const params = {}

    if (activeWorkspaceId && !isTrashActive) {
      params.workspace_id = activeWorkspaceId
    }
    if (activeFolderId && !isTrashActive) {
      params.folder_id = activeFolderId
    }
    if (activeLabelId && !isTrashActive) {
      params.label_id = activeLabelId
    }
    if (search.trim()) {
      params.search = search.trim()
    }
    if (filter === 'pinned') params.is_pinned = true
    if (filter === 'favorite') params.is_favorite = true
    if (filter === 'private') params.visibility = 'private'
    if (filter === 'public') params.visibility = 'public'

    return params
  }, [activeWorkspaceId, activeFolderId, activeLabelId, search, filter, isTrashActive])

  const {
    notes,
    selectedNoteId,
    setSelectedNoteId,
    addNote,
    deleteNote,
    updateNote,
    updatePinStatus,
    updateFavoriteStatus,
    updateProtectionStatus,
    loading,
    error,
    refreshNotes,
  } =
    useNoteWorkspace(apiFilters)

  // Sắp xếp: ghim lên đầu (client-side sort nhẹ)
  const filteredNotes = useMemo(() => {
    return [...notes].sort((a, b) => (b.is_pinned ? 1 : 0) - (a.is_pinned ? 1 : 0))
  }, [notes])

  const selectedNote = useMemo(() => {
    return notes.find((n) => n.id === selectedNoteId) || filteredNotes[0]
  }, [notes, selectedNoteId, filteredNotes])

  // --- Clear filters ---
  const handleClearFilters = () => {
    setActiveFolderId(null)
    setActiveLabelId(null)
    setIsTrashActive(false)
    setSearch('')
    setFilter('all')
  }

  // --- Folder actions (qua API) ---
  const handleAddFolder = async (folderData) => {
    if (!activeWorkspaceId) {
      show({ type: 'warning', message: 'Hãy chọn workspace trước khi tạo thư mục.' })
      return false
    }

    try {
      const newFolder = await createWorkspaceFolder(activeWorkspaceId, { name: folderData.name })
      setFolders((prev) => [...prev, newFolder])
      setActiveFolderId(newFolder.id)
      setIsTrashActive(false)
      show({ type: 'success', message: `Đã tạo thư mục "${newFolder.name}"` })
      return newFolder
    } catch (err) {
      show({ type: 'error', message: err.message || 'Không thể tạo thư mục.' })
      return false
    }
  }

  const handleDeleteFolder = async (folderId) => {
    await deleteFolderApi(folderId)
    setFolders((prev) => prev.filter((f) => f.id !== folderId))
    if (activeFolderId === folderId) {
      setActiveFolderId(null)
    }
    show({ type: 'info', message: 'Đã xóa thư mục' })
  }

  // --- Label actions (qua API) ---
  const handleAddLabel = async (newLbl) => {
    const created = await createLabelApi(newLbl.name, newLbl.color)
    setLabels((prev) => [...prev, created])
  }

  const handleDeleteLabel = async (lblId) => {
    await deleteLabelApi(lblId)
    setLabels((prev) => prev.filter((l) => l.id !== lblId))
    if (activeLabelId === lblId) {
      setActiveLabelId(null)
    }
  }

  // --- Note actions ---
  const handleAddNote = async () => {
    try {
      await addNote({
        workspace_id: activeWorkspaceId,
        folder_id: activeFolderId,
        labels: activeLabelId ? [activeLabelId] : [],
      })
      show({ type: 'success', title: 'Đã tạo ghi chú mới' })
    } catch (err) {
      show({ type: 'error', title: 'Lỗi khi tạo ghi chú', message: err.message || 'Không thể tạo ghi chú mới.' })
    }
  }

  const handleDeleteNote = async (id) => {
    await deleteNote(id)
    show({ type: 'error', title: 'Đã xóa ghi chú' })
    setDeleteTarget(null)
  }

  // Khi save note trong editor, refresh nhẹ state
  const handleUpdateNote = async (updatedNote) => {
    const saved = await updateNote(updatedNote)
    return saved
  }

  return (
    <div className="flex h-full gap-0 -m-4 lg:-m-6">
      {/* Workspace Sidebar */}
      {showWorkspaceSidebar && (
        <WorkspaceSidebar
          workspaces={[ALL_WORKSPACES, ...workspaces]}
          activeWorkspaceId={activeWorkspaceId}
          onSelectWorkspace={(id) => {
            setActiveWorkspaceId(id)
            handleClearFilters()
          }}
          folders={folders}
          activeFolderId={activeFolderId}
          onSelectFolder={(id) => {
            setActiveFolderId(id)
            setActiveLabelId(null)
            setIsTrashActive(false)
          }}
          onAddFolder={(data) => handleAddFolder({ ...data, workspace_id: activeWorkspaceId })}
          onDeleteFolder={handleDeleteFolder}
          labels={labels}
          activeLabelId={activeLabelId}
          onSelectLabel={(id) => {
            setActiveLabelId(id)
            setActiveFolderId(null)
            setIsTrashActive(false)
          }}
          onManageLabels={() => setIsLabelManagerOpen(true)}
          isTrashActive={isTrashActive}
          onSelectTrash={() => {
            setIsTrashActive(true)
            setActiveFolderId(null)
            setActiveLabelId(null)
          }}
          onClearFilters={handleClearFilters}
        />
      )}

      {/* ─── Left panel: note list ─── */}
      <div className="flex flex-col w-full max-w-xs lg:max-w-[280px] xl:max-w-[300px] flex-shrink-0
                      border-r border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between gap-2 px-4 pt-5 pb-3">
          <div className="flex items-center gap-2">
            <button
              type="button"
              id="notes-sidebar-toggle-btn"
              onClick={() => setShowWorkspaceSidebar(!showWorkspaceSidebar)}
              className="p-1 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 hover:text-slate-600 transition-colors cursor-pointer"
              title={showWorkspaceSidebar ? "Ẩn danh mục" : "Hiện danh mục"}
            >
              <svg className="w-4.5 h-4.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
            <div>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                {isTrashActive ? 'Thùng rác' : activeFolderId ? 'Thư mục' : 'Workspace'}
              </p>
              <h1 className="text-lg font-bold text-slate-900 dark:text-white truncate max-w-[120px]">
                {isTrashActive
                  ? 'Đã xóa'
                  : activeFolderId
                  ? folders.find((f) => f.id === activeFolderId)?.name
                  : [ALL_WORKSPACES, ...workspaces].find((w) => w.id === activeWorkspaceId)?.name}
              </h1>
            </div>
          </div>
          {!isTrashActive && (
            <button
              type="button"
              id="add-note-btn"
              onClick={handleAddNote}
              className="btn-primary-custom py-1.5 text-xs"
            >
              ➕ Thêm
            </button>
          )}
        </div>

        {/* Search */}
        <div className="px-4 pb-2">
          <div className="relative">
            <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              id="notes-search-input"
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Tìm kiếm..."
              className="w-full pl-9 pr-4 py-1.5 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary-500/20"
            />
          </div>
        </div>

        {/* Filters + view toggle */}
        <div className="flex items-center gap-1 px-4 pb-3 overflow-x-auto">
          <div className="flex items-center gap-1 flex-1 overflow-x-auto no-scrollbar">
            {FILTER_OPTIONS.map((f) => (
              <button
                key={f.value}
                type="button"
                id={`filter-${f.value}-btn`}
                onClick={() => setFilter(f.value)}
                className={`flex-shrink-0 px-2.5 py-1 text-[10px] font-bold rounded-full transition-colors cursor-pointer
                  ${filter === f.value
                    ? 'bg-primary-500 text-white'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200'
                  }`}
              >
                {f.label}
              </button>
            ))}
          </div>
          {/* View toggle */}
          <div className="flex items-center gap-0.5 flex-shrink-0 bg-slate-100 dark:bg-slate-800 rounded-lg p-0.5">
            <button
              type="button"
              id="view-list-btn"
              onClick={() => setView('list')}
              title="Dạng danh sách"
              className={`p-1 rounded-md cursor-pointer transition-colors ${view === 'list' ? 'bg-white dark:bg-slate-700 text-primary-600 shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}
            >
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
              </svg>
            </button>
            <button
              type="button"
              id="view-grid-btn"
              onClick={() => setView('grid')}
              title="Dạng lưới"
              className={`p-1 rounded-md cursor-pointer transition-colors ${view === 'grid' ? 'bg-white dark:bg-slate-700 text-primary-600 shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}
            >
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6z" />
              </svg>
            </button>
          </div>
        </div>

        {/* Note list */}
        <div className={`flex-1 overflow-y-auto px-3 pb-4 ${view === 'grid' ? 'grid grid-cols-1 gap-2 content-start' : 'space-y-0.5'}`}>
          {loading ? (
            <div className="flex flex-col items-center justify-center py-12 text-center px-4">
              <p className="text-xs font-semibold text-slate-400 dark:text-slate-500">Đang tải ghi chú...</p>
            </div>
          ) : error ? (
            <div className="flex flex-col items-center justify-center py-12 text-center px-4">
              <p className="text-xs font-semibold text-red-500">{error}</p>
              <button
                type="button"
                onClick={refreshNotes}
                className="mt-3 text-xs text-primary-500 hover:underline cursor-pointer"
              >
                Thử lại
              </button>
            </div>
          ) : filteredNotes.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center px-4">
              <svg className="w-10 h-10 text-slate-300 dark:text-slate-600 mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <p className="text-xs font-semibold text-slate-400 dark:text-slate-500">
                {search ? 'Không tìm thấy ghi chú' : 'Chưa có ghi chú nào'}
              </p>
            </div>
          ) : (
            filteredNotes.map((note) => (
              <NoteCard
                key={note.id}
                note={note}
                view={view}
                active={note.id === selectedNote?.id}
                onSelect={() => setSelectedNoteId(note.id)}
                onDelete={() => setDeleteTarget(note.id)}
              />
            ))
          )}
        </div>
      </div>

      {/* ─── Right panel: editor ─── */}
      <div className="flex-1 overflow-hidden bg-slate-50 dark:bg-slate-950">
        <div className="h-full flex flex-col px-6 py-5">
          <NoteEditor
            key={selectedNote?.id || 'empty'}
            note={selectedNote}
            onSave={handleUpdateNote}
            allLabels={labels}
            onNoteUpdated={refreshNotes}
            onTogglePin={updatePinStatus}
            onToggleFavorite={updateFavoriteStatus}
            onUpdateProtection={updateProtectionStatus}
          />
        </div>
      </div>

      {/* Label Manager Modal */}
      <LabelManager
        isOpen={isLabelManagerOpen}
        onClose={() => setIsLabelManagerOpen(false)}
        labels={labels}
        onAddLabel={handleAddLabel}
        onDeleteLabel={handleDeleteLabel}
      />

      {/* Confirm delete */}
      <ConfirmModal
        isOpen={deleteTarget !== null}
        onClose={() => setDeleteTarget(null)}
        onConfirm={() => handleDeleteNote(deleteTarget)}
        title={isTrashActive ? "Xóa vĩnh viễn" : "Xóa ghi chú"}
        message={isTrashActive ? "Hành động này không thể khôi phục. Bạn có chắc chắn muốn xóa vĩnh viễn?" : "Ghi chú sẽ bị xóa. Bạn có chắc chắn không?"}
        variant="danger"
        confirmText="Xóa"
        cancelText="Hủy"
      />
    </div>
  )
}
