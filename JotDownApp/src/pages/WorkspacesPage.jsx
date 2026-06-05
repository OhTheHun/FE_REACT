import { useState } from 'react'
import { useToast } from '../components/common/Toast'
import ConfirmModal from '../components/common/ConfirmModal'

const WORKSPACE_ICONS = ['💼', '🏠', '🚀', '📚', '🎨', '💡', '🔬', '🎯']

function WorkspaceCard({ workspace, folders, isActive, onSelect, onRename, onDelete }) {
  const [isEditing, setIsEditing] = useState(false)
  const [nameValue, setNameValue] = useState(workspace.name)

  const handleRenameSubmit = (e) => {
    e.preventDefault()
    if (!nameValue.trim()) return
    onRename(workspace.id, nameValue.trim())
    setIsEditing(false)
  }

  const folderCount = folders.filter((f) => f.workspace_id === workspace.id).length

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

      {/* Icon */}
      <div className="text-3xl mb-3">{workspace.icon || '💼'}</div>

      {/* Name */}
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
            {folderCount} thư mục • {workspace.type === 'share' ? 'Chia sẻ' : 'Cá nhân'}
          </p>

          {/* Actions */}
          <div className="flex gap-2 mt-auto opacity-0 group-hover:opacity-100 transition-opacity" onClick={(e) => e.stopPropagation()}>
            <button
              type="button"
              onClick={() => { setIsEditing(true); setNameValue(workspace.name) }}
              className="flex-1 py-1.5 text-xs font-semibold rounded-xl bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors"
            >
              ✏️ Đổi tên
            </button>
            {workspace.type !== 'personal' && (
              <button
                type="button"
                onClick={() => onDelete(workspace.id)}
                className="px-3 py-1.5 text-xs font-semibold rounded-xl bg-red-50 dark:bg-red-900/20 text-red-500 hover:bg-red-100 dark:hover:bg-red-900/30 transition-colors"
              >
                🗑️
              </button>
            )}
          </div>
        </>
      )}
    </div>
  )
}

export default function WorkspacesPage() {
  const { show } = useToast()
  const [workspaces, setWorkspaces] = useState([
    { id: 'ws-personal', name: 'Không gian cá nhân', type: 'personal', icon: '🏠' },
    { id: 'ws-work', name: 'Công việc & Dự án', type: 'share', icon: '💼' },
  ])
  const [folders, setFolders] = useState([
    { id: 'fold-1', name: 'Học tập', workspace_id: 'ws-personal' },
    { id: 'fold-2', name: 'Ý tưởng', workspace_id: 'ws-personal' },
    { id: 'fold-3', name: 'Kế hoạch', workspace_id: 'ws-work' },
  ])
  const [activeWsId, setActiveWsId] = useState('ws-personal')
  const [isCreating, setIsCreating] = useState(false)
  const [newName, setNewName] = useState('')
  const [selectedIcon, setSelectedIcon] = useState('💼')
  const [deleteTarget, setDeleteTarget] = useState(null)

  // Folder state
  const [newFolderName, setNewFolderName] = useState('')
  const [isAddingFolder, setIsAddingFolder] = useState(false)
  const [deleteFolderTarget, setDeleteFolderTarget] = useState(null)

  const activeWorkspace = workspaces.find((w) => w.id === activeWsId)
  const activeFolders = folders.filter((f) => f.workspace_id === activeWsId)

  const handleCreateWorkspace = (e) => {
    e.preventDefault()
    if (!newName.trim()) return
    const newWs = {
      id: `ws-${Date.now()}`,
      name: newName.trim(),
      type: 'personal',
      icon: selectedIcon,
    }
    setWorkspaces([...workspaces, newWs])
    setActiveWsId(newWs.id)
    setNewName('')
    setIsCreating(false)
    show({ type: 'success', title: 'Đã tạo Workspace', message: `"${newWs.name}" đã sẵn sàng.` })
  }

  const handleRenameWorkspace = (id, name) => {
    setWorkspaces(workspaces.map((w) => (w.id === id ? { ...w, name } : w)))
    show({ type: 'success', message: 'Đã đổi tên workspace.' })
  }

  const handleDeleteWorkspace = () => {
    const ws = workspaces.find((w) => w.id === deleteTarget)
    setWorkspaces(workspaces.filter((w) => w.id !== deleteTarget))
    setFolders(folders.filter((f) => f.workspace_id !== deleteTarget))
    if (activeWsId === deleteTarget) setActiveWsId('ws-personal')
    setDeleteTarget(null)
    show({ type: 'info', message: `Đã xóa workspace "${ws?.name}".` })
  }

  const handleAddFolder = (e) => {
    e.preventDefault()
    if (!newFolderName.trim()) return
    const newFolder = { id: `folder-${Date.now()}`, name: newFolderName.trim(), workspace_id: activeWsId }
    setFolders([...folders, newFolder])
    setNewFolderName('')
    setIsAddingFolder(false)
    show({ type: 'success', message: `Đã tạo thư mục "${newFolder.name}".` })
  }

  const handleDeleteFolder = () => {
    const f = folders.find((f) => f.id === deleteFolderTarget)
    setFolders(folders.filter((fl) => fl.id !== deleteFolderTarget))
    setDeleteFolderTarget(null)
    show({ type: 'info', message: `Đã xóa thư mục "${f?.name}".` })
  }

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      {/* Header */}
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

      {/* Create form */}
      {isCreating && (
        <div className="rounded-2xl border-2 border-primary-300 dark:border-primary-600 bg-primary-50 dark:bg-primary-900/20 p-5 animate-slide-up">
          <h3 className="font-bold text-slate-900 dark:text-white mb-4">Tạo không gian mới</h3>
          <form onSubmit={handleCreateWorkspace} className="flex flex-col gap-4">
            {/* Icon picker */}
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

      {/* Workspace grid */}
      <div>
        <h2 className="text-sm font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-3">
          Tất cả Workspaces ({workspaces.length})
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {workspaces.map((ws) => (
            <WorkspaceCard
              key={ws.id}
              workspace={ws}
              folders={folders}
              isActive={ws.id === activeWsId}
              onSelect={setActiveWsId}
              onRename={handleRenameWorkspace}
              onDelete={(id) => setDeleteTarget(id)}
            />
          ))}
        </div>
      </div>

      {/* Active workspace folders */}
      {activeWorkspace && (
        <div className="rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 p-6">
          <div className="flex items-center justify-between mb-5">
            <div>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Đang xem</p>
              <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <span>{activeWorkspace.icon}</span>
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

          {activeFolders.length === 0 ? (
            <div className="text-center py-10">
              <p className="text-3xl mb-2">📁</p>
              <p className="text-sm text-slate-400 dark:text-slate-500">Chưa có thư mục nào trong workspace này.</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
              {activeFolders.map((folder) => (
                <div
                  key={folder.id}
                  className="group flex items-center gap-3 p-3.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 hover:border-slate-300 transition-all"
                >
                  <span className="text-lg">📁</span>
                  <span className="flex-1 text-sm font-medium text-slate-700 dark:text-slate-300 truncate">{folder.name}</span>
                  <button
                    type="button"
                    onClick={() => setDeleteFolderTarget(folder.id)}
                    className="opacity-0 group-hover:opacity-100 text-slate-400 hover:text-red-500 transition-all"
                  >
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5-4h4M3 7h18" />
                    </svg>
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Delete workspace confirm */}
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

      {/* Delete folder confirm */}
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
