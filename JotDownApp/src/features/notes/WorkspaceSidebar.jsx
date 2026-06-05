import { useState } from 'react'

export default function WorkspaceSidebar({
  workspaces = [],
  activeWorkspaceId,
  onSelectWorkspace,
  onAddWorkspace,
  folders = [],
  activeFolderId,
  onSelectFolder,
  onAddFolder,
  onDeleteFolder,
  labels = [],
  activeLabelId,
  onSelectLabel,
  onManageLabels,
  isTrashActive,
  onSelectTrash,
  onClearFilters,
}) {
  const [isWorkspaceDropdownOpen, setIsWorkspaceDropdownOpen] = useState(false)
  const [newWorkspaceName, setNewWorkspaceName] = useState('')
  const [isAddingWorkspace, setIsAddingWorkspace] = useState(false)
  const [newFolderName, setNewFolderName] = useState('')
  const [isAddingFolder, setIsAddingFolder] = useState(false)

  const activeWorkspace = workspaces.find((w) => w.id === activeWorkspaceId) || workspaces[0]

  const handleAddWorkspaceSubmit = (e) => {
    e.preventDefault()
    if (!newWorkspaceName.trim()) return
    onAddWorkspace({
      id: `ws-${Date.now()}`,
      name: newWorkspaceName.trim(),
      type: 'personal',
    })
    setNewWorkspaceName('')
    setIsAddingWorkspace(false)
  }

  const handleAddFolderSubmit = (e) => {
    e.preventDefault()
    if (!newFolderName.trim()) return
    onAddFolder({
      id: `folder-${Date.now()}`,
      name: newFolderName.trim(),
      workspace_id: activeWorkspaceId,
    })
    setNewFolderName('')
    setIsAddingFolder(false)
  }

  return (
    <div className="w-56 lg:w-64 bg-slate-50 dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 flex flex-col h-full flex-shrink-0">
      {/* Workspace Selector */}
      <div className="p-4 border-b border-slate-200 dark:border-slate-800 relative">
        <button
          type="button"
          onClick={() => setIsWorkspaceDropdownOpen(!isWorkspaceDropdownOpen)}
          className="w-full flex items-center justify-between gap-2 px-3 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-left text-sm font-semibold text-slate-800 dark:text-white hover:border-slate-300 transition-colors shadow-sm cursor-pointer"
        >
          <span className="flex items-center gap-2 truncate">
            <span className="text-base">💼</span>
            <span className="truncate">{activeWorkspace?.name || 'Cá nhân'}</span>
          </span>
          <svg className={`w-4 h-4 text-slate-400 transition-transform duration-200 ${isWorkspaceDropdownOpen ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>

        {isWorkspaceDropdownOpen && (
          <div className="absolute top-full left-4 right-4 mt-1 bg-white dark:bg-slate-855 border border-slate-200 dark:border-slate-700 rounded-xl shadow-lg z-20 overflow-hidden py-1.5 animate-slide-up">
            {workspaces.map((ws) => (
              <button
                key={ws.id}
                type="button"
                onClick={() => {
                  onSelectWorkspace(ws.id)
                  setIsWorkspaceDropdownOpen(false)
                }}
                className={`w-full text-left px-3 py-2 text-xs font-medium flex items-center gap-2 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors cursor-pointer
                  ${ws.id === activeWorkspaceId ? 'text-primary-500 bg-primary-50/50 dark:bg-primary-950/20' : 'text-slate-700 dark:text-slate-300'}`}
              >
                <span>📁</span>
                <span className="truncate">{ws.name}</span>
              </button>
            ))}

            <div className="border-t border-slate-100 dark:border-slate-700 my-1"></div>

            {isAddingWorkspace ? (
              <form onSubmit={handleAddWorkspaceSubmit} className="p-2 flex gap-1">
                <input
                  type="text"
                  value={newWorkspaceName}
                  onChange={(e) => setNewWorkspaceName(e.target.value)}
                  placeholder="Tên không gian..."
                  className="flex-1 px-2 py-1 text-[11px] rounded-lg border border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white focus:outline-none"
                  autoFocus
                />
                <button type="submit" className="btn-primary-custom px-2 text-[10px]">Tạo</button>
              </form>
            ) : (
              <button
                type="button"
                onClick={() => setIsAddingWorkspace(true)}
                className="w-full text-left px-3 py-1.5 text-xs text-primary-500 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors font-semibold flex items-center gap-2 cursor-pointer"
              >
                <span>➕</span>
                <span>Tạo không gian mới</span>
              </button>
            )}
          </div>
        )}
      </div>

      {/* Sidebar Items */}
      <div className="flex-1 overflow-y-auto p-3 space-y-4">
        {/* Navigation list */}
        <div className="space-y-0.5">
          <button
            type="button"
            onClick={onClearFilters}
            className={`w-full text-left px-3 py-2 rounded-xl text-xs font-semibold flex items-center justify-between transition-colors cursor-pointer
              ${!activeFolderId && !activeLabelId && !isTrashActive
                ? 'text-primary-600 bg-primary-50 dark:bg-primary-950/20'
                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'}`}
          >
            <span className="flex items-center gap-2">
              <span>📓</span>
              <span>Tất cả ghi chú</span>
            </span>
          </button>

          <button
            type="button"
            onClick={onSelectTrash}
            className={`w-full text-left px-3 py-2 rounded-xl text-xs font-semibold flex items-center justify-between transition-colors cursor-pointer
              ${isTrashActive
                ? 'text-primary-600 bg-primary-50 dark:bg-primary-950/20'
                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'}`}
          >
            <span className="flex items-center gap-2">
              <span>🗑️</span>
              <span>Thùng rác</span>
            </span>
          </button>
        </div>

        {/* Folders Section */}
        <div className="space-y-1">
          <div className="flex items-center justify-between px-3">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Thư mục (Folders)</span>
            <button
              type="button"
              onClick={() => setIsAddingFolder(!isAddingFolder)}
              className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              title="Tạo thư mục"
            >
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
            </button>
          </div>

          {isAddingFolder && (
            <form onSubmit={handleAddFolderSubmit} className="px-3 py-1 flex gap-1">
              <input
                type="text"
                value={newFolderName}
                onChange={(e) => setNewFolderName(e.target.value)}
                placeholder="Tên thư mục..."
                className="flex-1 px-2 py-1 text-xs rounded-lg border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none"
                autoFocus
              />
              <button type="submit" className="btn-primary-custom px-2 py-1 text-[10px]">Lưu</button>
            </form>
          )}

          <div className="space-y-0.5 max-h-[160px] overflow-y-auto">
            {folders.filter(f => f.workspace_id === activeWorkspaceId).map((folder) => (
              <div
                key={folder.id}
                className={`group flex items-center justify-between px-3 py-1.5 rounded-xl text-xs font-medium transition-colors
                  ${activeFolderId === folder.id
                    ? 'text-primary-600 bg-primary-50 dark:bg-primary-950/20'
                    : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'}`}
              >
                <button
                  type="button"
                  onClick={() => onSelectFolder(folder.id)}
                  className="flex-1 text-left flex items-center gap-2 truncate cursor-pointer"
                >
                  <span>📁</span>
                  <span className="truncate">{folder.name}</span>
                </button>
                <button
                  type="button"
                  onClick={() => onDeleteFolder(folder.id)}
                  className="opacity-0 group-hover:opacity-100 text-slate-400 hover:text-red-500 transition-opacity p-0.5"
                >
                  <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7" />
                  </svg>
                </button>
              </div>
            ))}
            {folders.filter(f => f.workspace_id === activeWorkspaceId).length === 0 && (
              <p className="text-[10px] text-slate-400 px-3 py-2 italic">Không có thư mục</p>
            )}
          </div>
        </div>

        {/* Labels Section */}
        <div className="space-y-1">
          <div className="flex items-center justify-between px-3">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Nhãn (Labels)</span>
            <button
              type="button"
              onClick={onManageLabels}
              className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              title="Quản lý nhãn"
            >
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </button>
          </div>

          <div className="space-y-0.5 max-h-[160px] overflow-y-auto">
            {labels.map((lbl) => (
              <button
                key={lbl.id}
                type="button"
                onClick={() => onSelectLabel(lbl.id)}
                className={`w-full text-left px-3 py-1.5 rounded-xl text-xs font-medium flex items-center gap-2 transition-colors cursor-pointer
                  ${activeLabelId === lbl.id
                    ? 'text-primary-600 bg-primary-50 dark:bg-primary-950/20'
                    : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'}`}
              >
                <span className="w-2 h-2 rounded-full" style={{ backgroundColor: lbl.color }}></span>
                <span className="truncate">{lbl.name}</span>
              </button>
            ))}
            {labels.length === 0 && (
              <p className="text-[10px] text-slate-400 px-3 py-2 italic">Không có nhãn</p>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
