import { useState } from 'react'

export default function WorkspaceSidebar({
  workspaces = [],
  activeWorkspaceId,
  onSelectWorkspace,
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
  const [newFolderName, setNewFolderName] = useState('')
  const [isAddingFolder, setIsAddingFolder] = useState(false)

  const activeWorkspace = workspaces.find((workspace) => workspace.id === activeWorkspaceId) || workspaces[0]
  const visibleFolders = folders.filter((folder) => !activeWorkspaceId || folder.workspace_id === activeWorkspaceId)

  const handleAddFolderSubmit = async (e) => {
    e.preventDefault()
    if (!newFolderName.trim()) return

    const created = await onAddFolder({
      id: `folder-${Date.now()}`,
      name: newFolderName.trim(),
      workspace_id: activeWorkspaceId,
    })

    if (created === false) return
    setNewFolderName('')
    setIsAddingFolder(false)
  }

  return (
    <div className="w-56 lg:w-64 bg-slate-50 dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 flex flex-col h-full flex-shrink-0">
      <div className="p-4 border-b border-slate-200 dark:border-slate-800 relative">
        <button
          type="button"
          onClick={() => setIsWorkspaceDropdownOpen((open) => !open)}
          className="w-full flex items-center justify-between gap-2 px-3 py-2.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-left text-sm font-semibold text-slate-800 dark:text-white hover:border-primary-300 dark:hover:border-primary-700 transition-colors shadow-sm cursor-pointer"
        >
          <span className="flex items-center gap-2 truncate">
            <span className="w-7 h-7 rounded-lg bg-slate-100 dark:bg-slate-700 flex items-center justify-center text-xs">
              {activeWorkspace?.id ? '📁' : '▦'}
            </span>
            <span className="truncate">{activeWorkspace?.name || 'Tất cả không gian'}</span>
          </span>
          <svg className={`w-4 h-4 text-slate-400 transition-transform duration-200 ${isWorkspaceDropdownOpen ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>

        {isWorkspaceDropdownOpen && (
          <div className="absolute top-full left-4 right-4 mt-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-2xl shadow-xl z-20 overflow-hidden p-1.5 animate-slide-up">
            <div className="px-3 pt-2 pb-1.5">
              <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Không gian</p>
            </div>

            <div className="max-h-64 overflow-y-auto space-y-1">
              {workspaces.map((workspace) => {
                const active = workspace.id === activeWorkspaceId
                return (
                  <button
                    key={workspace.id || 'all-workspaces'}
                    type="button"
                    onClick={() => {
                      onSelectWorkspace(workspace.id)
                      setIsWorkspaceDropdownOpen(false)
                    }}
                    className={`w-full text-left px-3 py-2.5 text-xs font-semibold flex items-center gap-2 rounded-xl transition-colors cursor-pointer
                      ${active
                        ? 'text-primary-600 dark:text-primary-300 bg-primary-50 dark:bg-primary-900/35'
                        : 'text-slate-700 dark:text-slate-100 hover:bg-slate-50 dark:hover:bg-slate-800'
                      }`}
                  >
                    <span className={`w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 ${active ? 'bg-primary-100 dark:bg-primary-800/50' : 'bg-slate-100 dark:bg-slate-700'}`}>
                      {workspace.id ? '📁' : '▦'}
                    </span>
                    <span className="truncate flex-1">{workspace.name}</span>
                    {active && (
                      <svg className="w-4 h-4 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                      </svg>
                    )}
                  </button>
                )
              })}
            </div>
          </div>
        )}
      </div>

      <div className="flex-1 overflow-y-auto p-3 space-y-4">
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
              <span>📒</span>
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
              <span>🗑</span>
              <span>Thùng rác</span>
            </span>
          </button>
        </div>

        <div className="space-y-1">
          <div className="flex items-center justify-between px-3">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Thư mục</span>
            <button
              type="button"
              onClick={() => setIsAddingFolder((adding) => !adding)}
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
            {visibleFolders.map((folder) => (
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
                  title="Xóa thư mục"
                >
                  <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7" />
                  </svg>
                </button>
              </div>
            ))}
            {visibleFolders.length === 0 && (
              <p className="text-[10px] text-slate-400 px-3 py-2 italic">Không có thư mục</p>
            )}
          </div>
        </div>

        <div className="space-y-1">
          <div className="flex items-center justify-between px-3">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Nhãn</span>
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
            {labels.map((label) => (
              <button
                key={label.id}
                type="button"
                onClick={() => onSelectLabel(label.id)}
                className={`w-full text-left px-3 py-1.5 rounded-xl text-xs font-medium flex items-center gap-2 transition-colors cursor-pointer
                  ${activeLabelId === label.id
                    ? 'text-primary-600 bg-primary-50 dark:bg-primary-950/20'
                    : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'}`}
              >
                <span className="w-2 h-2 rounded-full" style={{ backgroundColor: label.color }} />
                <span className="truncate">{label.name}</span>
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
