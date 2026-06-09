/* eslint-disable react-hooks/set-state-in-effect */
import { useCallback, useEffect, useMemo, useState } from 'react'
import { useToast } from '../components/common/Toast'
import ConfirmModal from '../components/common/ConfirmModal'
import {
  createWorkspace,
  createWorkspaceFolder,
  deleteFolder,
  deleteWorkspace,
  fetchWorkspaceFolders,
  fetchWorkspaces,
  updateFolder,
  updateWorkspace,
} from '../features/workspaces/workspaceService'

const WORKSPACE_ICONS = ['💼', '🏠', '🚀', '📚', '🎨', '💡', '🔬', '🎯']
const WORKSPACES_PER_PAGE = 4
const FOLDERS_PER_PAGE = 5

function getWorkspaceIcon(workspace, index = 0) {
  return workspace.icon || WORKSPACE_ICONS[index % WORKSPACE_ICONS.length]
}

function PaginationControls({ page, totalPages, onPageChange }) {
  if (totalPages <= 1) return null

  return (
    <div className="flex items-center justify-end gap-1.5 mt-4">
      <button
        type="button"
        onClick={() => onPageChange(page - 1)}
        disabled={page === 1}
        className="px-2.5 py-1.5 text-xs font-semibold rounded-lg border border-slate-200 dark:border-slate-700 text-slate-500 dark:text-slate-300 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-slate-50 dark:hover:bg-slate-800"
      >
        Trước
      </button>
      {Array.from({ length: totalPages }, (_, index) => index + 1).map((item) => (
        <button
          key={item}
          type="button"
          onClick={() => onPageChange(item)}
          className={`w-8 h-8 text-xs font-bold rounded-lg transition-colors
            ${item === page
              ? 'bg-primary-500 text-white'
              : 'border border-slate-200 dark:border-slate-700 text-slate-500 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800'
            }`}
        >
          {item}
        </button>
      ))}
      <button
        type="button"
        onClick={() => onPageChange(page + 1)}
        disabled={page === totalPages}
        className="px-2.5 py-1.5 text-xs font-semibold rounded-lg border border-slate-200 dark:border-slate-700 text-slate-500 dark:text-slate-300 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-slate-50 dark:hover:bg-slate-800"
      >
        Sau
      </button>
    </div>
  )
}

function WorkspaceCard({ workspace, folderCount, isActive, icon, onSelect, onRename, onDelete }) {
  const [isEditing, setIsEditing] = useState(false)
  const [nameValue, setNameValue] = useState(workspace.name)

  const handleRenameSubmit = async (e) => {
    e.preventDefault()
    if (!nameValue.trim()) return
    await onRename(workspace.id, nameValue.trim())
    setIsEditing(false)
  }

  return (
    <div
      className={`group relative flex flex-col rounded-2xl border-2 p-5 transition-all duration-200 cursor-pointer
        ${isActive
          ? 'border-primary-400 bg-primary-50 dark:bg-primary-900/20 shadow-md shadow-primary-500/10'
          : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 hover:border-slate-300 dark:hover:border-slate-600 hover:shadow-md'
        }`}
      onClick={() => !isEditing && onSelect(workspace.id)}
    >
      {isActive && (
        <span className="absolute top-3 right-3 text-xs font-bold text-primary-600 dark:text-primary-400 bg-primary-100 dark:bg-primary-900/40 px-2 py-0.5 rounded-full">
          Đang dùng
        </span>
      )}

      <div className="text-3xl mb-3">{icon}</div>

      {isEditing ? (
        <form onSubmit={handleRenameSubmit} onClick={(e) => e.stopPropagation()}>
          <input
            type="text"
            value={nameValue}
            onChange={(e) => setNameValue(e.target.value)}
            className="w-full px-2 py-1 text-sm rounded-lg border border-primary-400 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500/30 mb-2"
            autoFocus
            onKeyDown={(e) => e.key === 'Escape' && setIsEditing(false)}
          />
          <div className="flex gap-1.5">
            <button type="submit" className="flex-1 py-1 text-xs font-semibold bg-primary-500 text-white rounded-lg hover:bg-primary-600">
              Lưu
            </button>
            <button type="button" onClick={() => setIsEditing(false)} className="flex-1 py-1 text-xs font-semibold bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 rounded-lg hover:bg-slate-200">
              Hủy
            </button>
          </div>
        </form>
      ) : (
        <>
          <h3 className="text-base font-bold text-slate-900 dark:text-white truncate mb-1">{workspace.name}</h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mb-4">
            {folderCount} thư mục • {workspace.notes_count || 0} ghi chú
          </p>

          <div className="flex gap-2 mt-auto opacity-0 group-hover:opacity-100 transition-opacity" onClick={(e) => e.stopPropagation()}>
            <button
              type="button"
              onClick={() => { setIsEditing(true); setNameValue(workspace.name) }}
              className="flex-1 py-1.5 text-xs font-semibold rounded-xl bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors"
            >
              Đổi tên
            </button>
            <button
              type="button"
              onClick={() => onDelete(workspace.id)}
              className="px-3 py-1.5 text-xs font-semibold rounded-xl bg-red-50 dark:bg-red-900/20 text-red-500 hover:bg-red-100 dark:hover:bg-red-900/30 transition-colors"
              title="Xóa workspace"
            >
              Xóa
            </button>
          </div>
        </>
      )}
    </div>
  )
}

function FolderCard({ folder, onRename, onDelete }) {
  const [isEditing, setIsEditing] = useState(false)
  const [nameValue, setNameValue] = useState(folder.name)

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!nameValue.trim()) return
    await onRename(folder.id, nameValue.trim())
    setIsEditing(false)
  }

  return (
    <div className="group flex items-center gap-3 p-3.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 hover:border-slate-300 transition-all">
      <span className="text-lg">📁</span>
      {isEditing ? (
        <form onSubmit={handleSubmit} className="flex flex-1 gap-2">
          <input
            type="text"
            value={nameValue}
            onChange={(e) => setNameValue(e.target.value)}
            className="form-input py-1 text-xs"
            autoFocus
            onKeyDown={(e) => e.key === 'Escape' && setIsEditing(false)}
          />
          <button type="submit" className="btn-primary-custom py-1 px-2 text-xs">Lưu</button>
        </form>
      ) : (
        <>
          <div className="flex-1 min-w-0">
            <span className="block text-sm font-medium text-slate-700 dark:text-slate-300 truncate">{folder.name}</span>
            <span className="text-xs text-slate-400">{folder.notes_count || 0} ghi chú</span>
          </div>
          <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-all">
            <button
              type="button"
              onClick={() => { setIsEditing(true); setNameValue(folder.name) }}
              className="text-slate-400 hover:text-primary-500 transition-all text-xs font-semibold"
            >
              Sửa
            </button>
            <button
              type="button"
              onClick={() => onDelete(folder.id)}
              className="text-slate-400 hover:text-red-500 transition-all text-xs font-semibold"
            >
              Xóa
            </button>
          </div>
        </>
      )}
    </div>
  )
}

export default function WorkspacesPage() {
  const { show } = useToast()
  const [workspaces, setWorkspaces] = useState([])
  const [folders, setFolders] = useState([])
  const [activeWsId, setActiveWsId] = useState('')
  const [loadingWorkspaces, setLoadingWorkspaces] = useState(true)
  const [loadingFolders, setLoadingFolders] = useState(false)
  const [error, setError] = useState('')
  const [workspacePage, setWorkspacePage] = useState(1)
  const [workspaceSlideDirection, setWorkspaceSlideDirection] = useState('forward')
  const [folderPage, setFolderPage] = useState(1)
  const [folderSlideDirection, setFolderSlideDirection] = useState('forward')

  const [isCreating, setIsCreating] = useState(false)
  const [newName, setNewName] = useState('')
  const [newDescription, setNewDescription] = useState('')
  const [selectedIcon, setSelectedIcon] = useState('💼')
  const [deleteTarget, setDeleteTarget] = useState(null)

  const [newFolderName, setNewFolderName] = useState('')
  const [isAddingFolder, setIsAddingFolder] = useState(false)
  const [deleteFolderTarget, setDeleteFolderTarget] = useState(null)

  const activeWorkspace = useMemo(
    () => workspaces.find((workspace) => workspace.id === activeWsId),
    [workspaces, activeWsId],
  )
  const workspaceTotalPages = Math.max(Math.ceil(workspaces.length / WORKSPACES_PER_PAGE), 1)
  const folderTotalPages = Math.max(Math.ceil(folders.length / FOLDERS_PER_PAGE), 1)
  const visibleWorkspaces = useMemo(() => {
    const start = (workspacePage - 1) * WORKSPACES_PER_PAGE
    return workspaces.slice(start, start + WORKSPACES_PER_PAGE)
  }, [workspaces, workspacePage])
  const visibleFolders = useMemo(() => {
    const start = (folderPage - 1) * FOLDERS_PER_PAGE
    return folders.slice(start, start + FOLDERS_PER_PAGE)
  }, [folders, folderPage])

  const loadWorkspaces = useCallback(async () => {
    setLoadingWorkspaces(true)
    setError('')

    try {
      const data = await fetchWorkspaces()
      setWorkspaces(data)
      setActiveWsId((current) => current || data[0]?.id || '')
    } catch (err) {
      setError(err.message || 'Không thể tải workspace.')
    } finally {
      setLoadingWorkspaces(false)
    }
  }, [])

  const loadFolders = useCallback(async (workspaceId) => {
    if (!workspaceId) {
      setFolders([])
      return
    }

    setLoadingFolders(true)
    try {
      const data = await fetchWorkspaceFolders(workspaceId)
      setFolders(data)
    } catch (err) {
      show({ type: 'error', message: err.message || 'Không thể tải thư mục.' })
      setFolders([])
    } finally {
      setLoadingFolders(false)
    }
  }, [show])

  useEffect(() => {
    loadWorkspaces()
  }, [loadWorkspaces])

  useEffect(() => {
    loadFolders(activeWsId)
  }, [activeWsId, loadFolders])

  useEffect(() => {
    setWorkspacePage((current) => Math.min(current, workspaceTotalPages))
  }, [workspaceTotalPages])

  useEffect(() => {
    setFolderPage(1)
    setFolderSlideDirection('forward')
  }, [activeWsId])

  useEffect(() => {
    setFolderPage((current) => Math.min(current, folderTotalPages))
  }, [folderTotalPages])

  const handleWorkspacePageChange = (nextPage) => {
    if (nextPage < 1 || nextPage > workspaceTotalPages || nextPage === workspacePage) return
    setWorkspaceSlideDirection(nextPage > workspacePage ? 'forward' : 'backward')
    setWorkspacePage(nextPage)
  }

  const handleFolderPageChange = (nextPage) => {
    if (nextPage < 1 || nextPage > folderTotalPages || nextPage === folderPage) return
    setFolderSlideDirection(nextPage > folderPage ? 'forward' : 'backward')
    setFolderPage(nextPage)
  }

  const handleCreateWorkspace = async (e) => {
    e.preventDefault()
    if (!newName.trim()) return

    try {
      const created = await createWorkspace({
        name: newName.trim(),
        description: newDescription.trim() || null,
      })
      const nextWorkspace = { ...created, icon: selectedIcon }
      setWorkspaces((current) => [...current, nextWorkspace])
      setWorkspaceSlideDirection('forward')
      setWorkspacePage(Math.ceil((workspaces.length + 1) / WORKSPACES_PER_PAGE))
      setActiveWsId(nextWorkspace.id)
      setNewName('')
      setNewDescription('')
      setIsCreating(false)
      show({ type: 'success', title: 'Đã tạo Workspace', message: `"${nextWorkspace.name}" đã sẵn sàng.` })
    } catch (err) {
      show({ type: 'error', message: err.message || 'Không thể tạo workspace.' })
    }
  }

  const handleRenameWorkspace = async (id, name) => {
    try {
      const current = workspaces.find((workspace) => workspace.id === id)
      const updated = await updateWorkspace(id, { name, description: current?.description })
      setWorkspaces((items) => items.map((workspace) => (workspace.id === id ? { ...workspace, ...updated } : workspace)))
      show({ type: 'success', message: 'Đã đổi tên workspace.' })
    } catch (err) {
      show({ type: 'error', message: err.message || 'Không thể đổi tên workspace.' })
      throw err
    }
  }

  const handleDeleteWorkspace = async () => {
    const workspace = workspaces.find((item) => item.id === deleteTarget)
    if (!deleteTarget) return

    try {
      await deleteWorkspace(deleteTarget)
      const nextWorkspaces = workspaces.filter((item) => item.id !== deleteTarget)
      setWorkspaces(nextWorkspaces)
      if (activeWsId === deleteTarget) {
        setActiveWsId(nextWorkspaces[0]?.id || '')
      }
      setDeleteTarget(null)
      show({ type: 'info', message: `Đã xóa workspace "${workspace?.name}".` })
    } catch (err) {
      show({ type: 'error', message: err.message || 'Không thể xóa workspace.' })
    }
  }

  const handleAddFolder = async (e) => {
    e.preventDefault()
    if (!newFolderName.trim() || !activeWsId) return

    try {
      const folder = await createWorkspaceFolder(activeWsId, { name: newFolderName.trim() })
      setFolders((current) => [...current, folder])
      setFolderSlideDirection('forward')
      setFolderPage(Math.ceil((folders.length + 1) / FOLDERS_PER_PAGE))
      setWorkspaces((current) => current.map((workspace) => (
        workspace.id === activeWsId
          ? { ...workspace, folders_count: (workspace.folders_count || 0) + 1 }
          : workspace
      )))
      setNewFolderName('')
      setIsAddingFolder(false)
      show({ type: 'success', message: `Đã tạo thư mục "${folder.name}".` })
    } catch (err) {
      show({ type: 'error', message: err.message || 'Không thể tạo thư mục.' })
    }
  }

  const handleRenameFolder = async (id, name) => {
    try {
      const folder = await updateFolder(id, { name })
      setFolders((items) => items.map((item) => (item.id === id ? { ...item, ...folder } : item)))
      show({ type: 'success', message: 'Đã đổi tên thư mục.' })
    } catch (err) {
      show({ type: 'error', message: err.message || 'Không thể đổi tên thư mục.' })
      throw err
    }
  }

  const handleDeleteFolder = async () => {
    const folder = folders.find((item) => item.id === deleteFolderTarget)
    if (!deleteFolderTarget) return

    try {
      await deleteFolder(deleteFolderTarget)
      setFolders((items) => items.filter((item) => item.id !== deleteFolderTarget))
      setWorkspaces((current) => current.map((workspace) => (
        workspace.id === activeWsId
          ? { ...workspace, folders_count: Math.max((workspace.folders_count || 1) - 1, 0) }
          : workspace
      )))
      setDeleteFolderTarget(null)
      show({ type: 'info', message: `Đã xóa thư mục "${folder?.name}".` })
    } catch (err) {
      show({ type: 'error', message: err.message || 'Không thể xóa thư mục.' })
    }
  }

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white">Workspaces</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Quản lý không gian làm việc và tổ chức ghi chú của bạn.
          </p>
        </div>
        <button
          type="button"
          id="create-workspace-btn"
          onClick={() => setIsCreating(true)}
          className="btn-primary-custom"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Tạo Workspace
        </button>
      </div>

      {isCreating && (
        <div className="rounded-2xl border-2 border-primary-300 dark:border-primary-600 bg-primary-50 dark:bg-primary-900/20 p-5 animate-slide-up">
          <h3 className="font-bold text-slate-900 dark:text-white mb-4">Tạo không gian mới</h3>
          <form onSubmit={handleCreateWorkspace} className="flex flex-col gap-4">
            <div>
              <label className="form-label">Biểu tượng</label>
              <div className="flex gap-2 flex-wrap">
                {WORKSPACE_ICONS.map((icon) => (
                  <button
                    key={icon}
                    type="button"
                    onClick={() => setSelectedIcon(icon)}
                    className={`w-10 h-10 rounded-xl text-xl flex items-center justify-center transition-all
                      ${selectedIcon === icon
                        ? 'bg-primary-500 scale-110 shadow-md'
                        : 'bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:scale-105'
                      }`}
                  >
                    {icon}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label className="form-label">Tên workspace</label>
              <input
                type="text"
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                placeholder="Ví dụ: Học tập, Dự án ABC..."
                className="form-input"
                autoFocus
              />
            </div>
            <div>
              <label className="form-label">Mô tả</label>
              <textarea
                value={newDescription}
                onChange={(e) => setNewDescription(e.target.value)}
                placeholder="Mô tả ngắn cho workspace..."
                className="form-input min-h-20"
              />
            </div>
            <div className="flex gap-3 justify-end">
              <button type="button" onClick={() => setIsCreating(false)} className="btn-secondary-custom">
                Hủy
              </button>
              <button type="submit" className="btn-primary-custom">
                Tạo
              </button>
            </div>
          </form>
        </div>
      )}

      <div>
        <h2 className="text-sm font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-3">
          Tất cả Workspaces ({workspaces.length})
        </h2>

        {loadingWorkspaces ? (
          <div className="rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 p-8 text-center text-sm text-slate-500">
            Đang tải workspace...
          </div>
        ) : error ? (
          <div className="rounded-2xl border border-red-200 bg-red-50 p-8 text-center">
            <p className="text-sm text-red-600">{error}</p>
            <button type="button" onClick={loadWorkspaces} className="mt-3 text-xs text-primary-600 hover:underline">
              Thử lại
            </button>
          </div>
        ) : workspaces.length === 0 ? (
          <div className="rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 p-8 text-center text-sm text-slate-500">
            Chưa có workspace nào.
          </div>
        ) : (
          <>
            <div
              key={`workspace-page-${workspacePage}`}
              className={`grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 workspace-page-slide-${workspaceSlideDirection}`}
            >
              {visibleWorkspaces.map((workspace, index) => {
                const absoluteIndex = (workspacePage - 1) * WORKSPACES_PER_PAGE + index
                return (
                  <WorkspaceCard
                    key={workspace.id}
                    workspace={workspace}
                    folderCount={workspace.id === activeWsId ? folders.length : workspace.folders_count || 0}
                    icon={getWorkspaceIcon(workspace, absoluteIndex)}
                    isActive={workspace.id === activeWsId}
                    onSelect={setActiveWsId}
                    onRename={handleRenameWorkspace}
                    onDelete={(id) => setDeleteTarget(id)}
                  />
                )
              })}
            </div>
            <PaginationControls
              page={workspacePage}
              totalPages={workspaceTotalPages}
              onPageChange={handleWorkspacePageChange}
            />
          </>
        )}
      </div>

      {activeWorkspace && (
        <div className="rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 p-6">
          <div className="flex items-center justify-between mb-5">
            <div>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Đang xem</p>
              <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <span>{getWorkspaceIcon(activeWorkspace, workspaces.findIndex((item) => item.id === activeWorkspace.id))}</span>
                <span>{activeWorkspace.name}</span>
              </h2>
            </div>
            <button
              type="button"
              id="add-folder-btn"
              onClick={() => setIsAddingFolder(true)}
              className="btn-secondary-custom py-2 text-xs"
            >
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Thêm thư mục
            </button>
          </div>

          {isAddingFolder && (
            <form onSubmit={handleAddFolder} className="flex gap-2 mb-4">
              <input
                type="text"
                value={newFolderName}
                onChange={(e) => setNewFolderName(e.target.value)}
                placeholder="Tên thư mục..."
                className="form-input flex-1"
                autoFocus
              />
              <button type="submit" className="btn-primary-custom py-2">Thêm</button>
              <button type="button" onClick={() => setIsAddingFolder(false)} className="btn-secondary-custom py-2">Hủy</button>
            </form>
          )}

          {loadingFolders ? (
            <div className="text-center py-10 text-sm text-slate-400">Đang tải thư mục...</div>
          ) : folders.length === 0 ? (
            <div className="text-center py-10">
              <p className="text-3xl mb-2">📁</p>
              <p className="text-sm text-slate-400 dark:text-slate-500">Chưa có thư mục nào trong workspace này.</p>
            </div>
          ) : (
            <>
              <div
                key={`folder-page-${activeWsId}-${folderPage}`}
                className={`grid grid-cols-1 gap-3 workspace-page-slide-${folderSlideDirection}`}
              >
                {visibleFolders.map((folder) => (
                  <FolderCard
                    key={folder.id}
                    folder={folder}
                    onRename={handleRenameFolder}
                    onDelete={(id) => setDeleteFolderTarget(id)}
                  />
                ))}
              </div>
              <PaginationControls
                page={folderPage}
                totalPages={folderTotalPages}
                onPageChange={handleFolderPageChange}
              />
            </>
          )}
        </div>
      )}

      <ConfirmModal
        isOpen={deleteTarget !== null}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDeleteWorkspace}
        title="Xóa Workspace"
        message="Tất cả thư mục trong workspace này sẽ bị xóa. Hành động không thể khôi phục."
        variant="danger"
        confirmText="Xóa"
        cancelText="Hủy"
      />

      <ConfirmModal
        isOpen={deleteFolderTarget !== null}
        onClose={() => setDeleteFolderTarget(null)}
        onConfirm={handleDeleteFolder}
        title="Xóa thư mục"
        message="Bạn có chắc chắn muốn xóa thư mục này không?"
        variant="danger"
        confirmText="Xóa"
        cancelText="Hủy"
      />
    </div>
  )
}
