import { useState, useMemo } from 'react'
import NoteCard from '../features/notes/NoteCard'
import NoteEditor from '../features/notes/NoteEditor'
import ConfirmModal from '../components/common/ConfirmModal'
import WorkspaceSidebar from '../features/notes/WorkspaceSidebar'
import LabelManager from '../features/notes/LabelManager'
import { useNoteWorkspace } from '../hooks/useNoteWorkspace'
import { useToast } from '../components/common/Toast'

const FILTER_OPTIONS = [
  { value: 'all', label: 'Tất cả' },
  { value: 'pinned', label: 'Đã ghim' },
  { value: 'favorite', label: 'Yêu thích' },
  { value: 'private', label: 'Riêng tư' },
  { value: 'public', label: 'Công khai' },
]

export default function NotesPage() {
  const { notes, selectedNoteId, setSelectedNoteId, addNote, deleteNote, updateNote } = useNoteWorkspace()
  const { show } = useToast()

  // Workspaces, folders, labels mock state
  const [workspaces, setWorkspaces] = useState([
    { id: 'ws-personal', name: 'Không gian cá nhân', type: 'personal' },
    { id: 'ws-work', name: 'Công việc & Dự án', type: 'share' },
  ])
  const [activeWorkspaceId, setActiveWorkspaceId] = useState('ws-personal')

  const [folders, setFolders] = useState([
    { id: 'fold-1', name: 'Học tập', workspace_id: 'ws-personal' },
    { id: 'fold-2', name: 'Ý tưởng', workspace_id: 'ws-personal' },
    { id: 'fold-3', name: 'Kế hoạch', workspace_id: 'ws-work' },
  ])
  const [activeFolderId, setActiveFolderId] = useState(null)

  const [labels, setLabels] = useState([
    { id: 'lbl-1', name: 'Khẩn cấp', color: '#ef4444' },
    { id: 'lbl-2', name: 'Quan trọng', color: '#eab308' },
    { id: 'lbl-3', name: 'Tài liệu', color: '#3b82f6' },
  ])
  const [activeLabelId, setActiveLabelId] = useState(null)

  const [isTrashActive, setIsTrashActive] = useState(false)
  const [isLabelManagerOpen, setIsLabelManagerOpen] = useState(false)
  const [showWorkspaceSidebar, setShowWorkspaceSidebar] = useState(true)

  // Search & Filter
  const [search, setSearch] = useState('')
  const [filter, setFilter] = useState('all')
  const [view, setView] = useState('list') // 'list' | 'grid'
  const [deleteTarget, setDeleteTarget] = useState(null)

  // Clear filters
  const handleClearFilters = () => {
    setActiveFolderId(null)
    setActiveLabelId(null)
    setIsTrashActive(false)
  }

  // Active Workspace action
  const handleAddWorkspace = (newWs) => {
    setWorkspaces([...workspaces, newWs])
    setActiveWorkspaceId(newWs.id)
    handleClearFilters()
    show({ type: 'success', message: `Đã tạo không gian "${newWs.name}"` })
  }

  // Active Folder actions
  const handleAddFolder = (newFolder) => {
    setFolders([...folders, newFolder])
    setActiveFolderId(newFolder.id)
    setIsTrashActive(false)
    show({ type: 'success', message: `Đã tạo thư mục "${newFolder.name}"` })
  }

  const handleDeleteFolder = (folderId) => {
    setFolders(folders.filter(f => f.id !== folderId))
    if (activeFolderId === folderId) {
      setActiveFolderId(null)
    }
    show({ type: 'info', message: 'Đã xóa thư mục' })
  }

  // Labels actions
  const handleAddLabel = (newLbl) => {
    setLabels([...labels, newLbl])
  }

  const handleDeleteLabel = (lblId) => {
    setLabels(labels.filter(l => l.id !== lblId))
    if (activeLabelId === lblId) {
      setActiveLabelId(null)
    }
  }

  // Filtered + searched notes
  const filteredNotes = useMemo(() => {
    let result = notes

    // Filter by Workspace
    result = result.filter(
      (n) => n.workspace_id === activeWorkspaceId || (!n.workspace_id && activeWorkspaceId === 'ws-personal')
    )

    // Filter by Trash status
    if (isTrashActive) {
      result = result.filter((n) => n.deleteFlag === true)
    } else {
      result = result.filter((n) => !n.deleteFlag)
    }

    // Filter by folder
    if (activeFolderId && !isTrashActive) {
      result = result.filter((n) => n.folder_id === activeFolderId)
    }

    // Filter by label
    if (activeLabelId && !isTrashActive) {
      result = result.filter((n) => n.labels && n.labels.includes(activeLabelId))
    }

    // Filter by search query
    if (search.trim()) {
      const q = search.toLowerCase()
      result = result.filter(
        (n) => n.title?.toLowerCase().includes(q) || n.content?.toLowerCase().includes(q),
      )
    }

    // Secondary Tab Filters
    if (filter === 'pinned') result = result.filter((n) => n.is_pinned)
    if (filter === 'favorite') result = result.filter((n) => n.is_favorite)
    if (filter === 'private') result = result.filter((n) => n.visibility === 'private' || !n.visibility)
    if (filter === 'public') result = result.filter((n) => n.visibility === 'public')

    // Pinned first
    return [...result].sort((a, b) => (b.is_pinned ? 1 : 0) - (a.is_pinned ? 1 : 0))
  }, [notes, activeWorkspaceId, isTrashActive, activeFolderId, activeLabelId, search, filter])

  const selectedNote = useMemo(() => {
    return notes.find((n) => n.id === selectedNoteId) || filteredNotes[0]
  }, [notes, selectedNoteId, filteredNotes])

  const handleAddNote = () => {
    addNote({
      workspace_id: activeWorkspaceId,
      folder_id: activeFolderId,
      labels: activeLabelId ? [activeLabelId] : [],
      deleteFlag: false,
    })
    show({ type: 'success', title: 'Đã tạo ghi chú mới' })
  }

  const handleDeleteNote = (id) => {
    // Check if it's already in Trash, then delete permanently. Otherwise put in Trash.
    const noteToDelete = notes.find((n) => n.id === id)
    if (noteToDelete?.deleteFlag) {
      deleteNote(id)
      show({ type: 'error', title: 'Đã xóa vĩnh viễn ghi chú' })
    } else {
      updateNote({ ...noteToDelete, deleteFlag: true })
      show({ type: 'info', title: 'Đã chuyển vào thùng rác' })
    }
    setDeleteTarget(null)
  }

  return (
    <div className="flex h-full gap-0 -m-4 lg:-m-6">
      {/* Workspace Sidebar */}
      {showWorkspaceSidebar && (
        <WorkspaceSidebar
          workspaces={workspaces}
          activeWorkspaceId={activeWorkspaceId}
          onSelectWorkspace={(id) => {
            setActiveWorkspaceId(id)
            handleClearFilters()
          }}
          onAddWorkspace={handleAddWorkspace}
          folders={folders}
          activeFolderId={activeFolderId}
          onSelectFolder={(id) => {
            setActiveFolderId(id)
            setActiveLabelId(null)
            setIsTrashActive(false)
          }}
          onAddFolder={handleAddFolder}
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
                {isTrashActive ? 'Đã xóa' : activeFolderId ? folders.find(f => f.id === activeFolderId)?.name : workspaces.find(w => w.id === activeWorkspaceId)?.name}
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
          {filteredNotes.length === 0 ? (
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
            onSave={updateNote}
            allLabels={labels}
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
        message={isTrashActive ? "Hành động này không thể khôi phục. Bạn có chắc chắn muốn xóa vĩnh viễn?" : "Ghi chú sẽ được chuyển vào thùng rác. Bạn có thể khôi phục từ Thùng rác."}
        variant="danger"
        confirmText="Xóa"
        cancelText="Hủy"
      />
    </div>
  )
}
